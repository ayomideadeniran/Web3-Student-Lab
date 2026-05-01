'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Wallet,
  Zap,
  Activity,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { MerkleTree, Recipient } from '../../utils/merkle';
import recipientsData from './recipients.json';
import { useAuth } from '@/contexts/AuthContext';

const recipients = recipientsData as Recipient[];

export const AirdropDashboard: React.FC = () => {
  const { user } = useAuth();
  const [merkleTree, setMerkleTree] = useState<MerkleTree | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'eligible' | 'not-eligible' | 'claiming' | 'success' | 'error'>('idle');
  const [eligibilityData, setEligibilityData] = useState<{ amount: string, proof: string[] } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Stats for the dashboard
  const totalRecipients = recipients.length;
  const totalAmount = recipients.reduce((acc, curr) => acc + BigInt(curr.amount), BigInt(0));
  const poolSize = "1,000,000 RST";

  useEffect(() => {
    const initMerkle = async () => {
      const tree = await MerkleTree.create(recipients);
      setMerkleTree(tree);
      console.log("Merkle Root:", tree.getRoot());
    };
    initMerkle();
  }, []);

  const checkEligibility = async () => {
    if (!user?.email) return; // Assuming email stores the wallet address for now
    
    setStatus('checking');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const recipient = recipients.find(r => r.address === user.email);
    
    if (recipient && merkleTree) {
      const proof = await merkleTree.getProofAsync(recipient.address, recipient.amount);
      setEligibilityData({ amount: recipient.amount, proof });
      setStatus('eligible');
    } else {
      setStatus('not-eligible');
    }
  };

  const handleClaim = async () => {
    if (!eligibilityData) return;
    
    setStatus('claiming');
    
    try {
      // Simulate Soroban contract call
      console.log("Calling airdrop_manager::claim", {
        user: user?.email,
        amount: eligibilityData.amount,
        proof: eligibilityData.proof
      });
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      setStatus('success');
    } catch (err) {
      setErrorMsg("Transaction failed on Stellar network.");
      setStatus('error');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8 selection:bg-red-600 selection:text-white">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="border-l-4 border-red-600 pl-6 py-2">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
            Protocol <span className="text-red-600">Airdrop</span>
          </h1>
          <p className="text-gray-400 font-light tracking-widest text-sm uppercase">
            Merkle-Based Distribution · Anti-Sybil Shield Active
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-950 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black">Deadline</p>
              <p className="text-sm font-mono font-bold">24D 14H 05M</p>
            </div>
          </div>
          <div className="bg-zinc-950 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black">Network</p>
              <p className="text-sm font-mono font-bold">STELLAR_TEST</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Claim Panel */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-950 border border-white/10 rounded-3xl p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <Gift className="w-7 h-7 text-red-600" />
                Claim Dashboard
              </h2>

              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Initialize the cryptographic verification sequence to check your eligibility for the token distribution.
                    </p>
                    <button 
                      onClick={checkEligibility}
                      className="group relative px-10 py-5 bg-red-600 hover:bg-red-700 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    >
                      Check Eligibility
                      <ArrowRight className="w-5 h-5 inline-block ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {status === 'checking' && (
                  <motion.div 
                    key="checking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-red-500 font-mono text-sm animate-pulse uppercase font-bold tracking-tighter">
                      Traversing Merkle Tree...
                    </p>
                  </motion.div>
                )}

                {status === 'eligible' && (
                  <motion.div 
                    key="eligible"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 mb-8 flex items-center gap-6">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-wide">Eligibility Confirmed</h3>
                        <p className="text-green-500/80 font-mono text-sm">Cryptographic proof generated for your address.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="bg-black border border-white/5 p-6 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Claimable Amount</p>
                        <p className="text-3xl font-black text-white">{Number(eligibilityData?.amount) / 10**7} RST</p>
                      </div>
                      <div className="bg-black border border-white/5 p-6 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Proof Size</p>
                        <p className="text-3xl font-black text-white">{eligibilityData?.proof.length} Nodes</p>
                      </div>
                    </div>

                    <button 
                      onClick={handleClaim}
                      className="w-full py-5 bg-white text-black hover:bg-gray-200 rounded-xl font-black uppercase tracking-widest transition-all"
                    >
                      Execute Claim Transaction
                    </button>
                  </motion.div>
                )}

                {status === 'not-eligible' && (
                  <motion.div 
                    key="not-eligible"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-600/20">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">Not Eligible</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto font-light">
                      Your address was not found in the distribution list. Please verify your identity or check other nodes.
                    </p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="px-8 py-3 border border-white/20 hover:border-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Return to Start
                    </button>
                  </motion.div>
                )}

                {status === 'claiming' && (
                  <motion.div 
                    key="claiming"
                    className="text-center py-12"
                  >
                    <div className="relative w-20 h-20 mx-auto mb-8">
                      <div className="absolute inset-0 border-4 border-red-600/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      <Zap className="absolute inset-0 m-auto w-8 h-8 text-red-600 animate-pulse" />
                    </div>
                    <p className="text-white font-black text-lg uppercase tracking-widest mb-2">Executing On-Chain</p>
                    <p className="text-gray-500 font-mono text-xs">Waiting for Stellar Consensus...</p>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Tokens Secured</h3>
                    <p className="text-gray-400 mb-10 max-w-md mx-auto">
                      The airdrop tokens have been successfully transferred to your wallet.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button className="px-6 py-3 bg-zinc-900 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:border-white transition-all">
                        View Transaction
                      </button>
                      <button className="px-6 py-3 bg-red-600 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                        Go to Dashboard
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Verification Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                <UserCheck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-1">Identity Verified</h4>
                <p className="text-xs text-gray-500 font-light">Status: PASSED</p>
              </div>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-1">Sybil Protection</h4>
                <p className="text-xs text-gray-500 font-light">Shield: ACTIVE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Distribution Metrics</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Total Pool Size</p>
                <p className="text-2xl font-black text-white">{poolSize}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Eligible Addresses</p>
                <p className="text-2xl font-black text-white">{totalRecipients}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Claimed Ratio</p>
                <div className="w-full bg-zinc-900 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-red-600 h-full w-1/3 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                </div>
                <p className="text-right text-[10px] font-mono mt-1 text-gray-500">33.3% COMPLETE</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Sybil Protection
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light mb-6">
              Our heuristic engine monitors for automated patterns and duplicate identities. Detected sybil accounts are automatically blacklisted from this and future airdrops.
            </p>
            <div className="p-4 bg-red-600/5 border border-red-600/20 rounded-xl">
              <p className="text-[10px] text-red-500 font-black uppercase mb-1">Detected Sybils</p>
              <p className="text-xl font-black text-white font-mono">142</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
