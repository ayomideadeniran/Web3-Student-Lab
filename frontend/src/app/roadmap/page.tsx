'use client';

import { useState } from 'react';

const NODES = [
  {
    id: 1,
    title: 'Foundations',
    desc: 'Ledger basics, accounts, and trustlines.',
    status: 'COMPLETED',
    x: '50%',
    y: '10%',
  },
  {
    id: 2,
    title: 'Assets & SDEX',
    desc: 'Issuing tokens and liquidity pools.',
    status: 'IN_PROGRESS',
    x: '30%',
    y: '35%',
  },
  {
    id: 3,
    title: 'Soroban 101',
    desc: 'Rust smart contracts and WASM.',
    status: 'LOCKED',
    x: '70%',
    y: '35%',
  },
  {
    id: 4,
    title: 'Advanced DeFi',
    desc: 'Flash loans and cross-chain hooks.',
    status: 'LOCKED',
    x: '50%',
    y: '60%',
  },
  {
    id: 5,
    title: 'Protocol Expert',
    desc: 'Core architecture and consensus.',
    status: 'LOCKED',
    x: '50%',
    y: '85%',
  },
];

export default function RoadmapPage() {
  const [activeNode, setActiveNode] = useState(NODES[1]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-black p-6 font-mono text-white md:p-12">
      {/* Background Grid Accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>

      <div className="mx-auto flex h-full max-w-7xl flex-col items-center">
        {/* Header */}
        <div className="mb-16 w-full border-b border-red-600/20 pb-8 text-center">
          <h1 className="mb-2 text-4xl font-black tracking-tighter uppercase">
            Technical <span className="text-red-500">Roadmap</span>
          </h1>
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
            Module Hierarchy & Skill Acquisition Tree
          </p>
        </div>

        {/* Desktop Interactive SVG Map */}
        <div className="hidden md:relative md:flex md:aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-[3rem] border border-white/5 bg-zinc-950/20 p-12 shadow-inner">
          {/* Connecting Lines (SVG) */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20">
            <line
              x1="50%"
              y1="10%"
              x2="30%"
              y2="35%"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <line
              x1="50%"
              y1="10%"
              x2="70%"
              y2="35%"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <line
              x1="30%"
              y1="35%"
              x2="50%"
              y2="60%"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <line
              x1="70%"
              y1="35%"
              x2="50%"
              y2="60%"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <line
              x1="50%"
              y1="60%"
              x2="50%"
              y2="85%"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4"
            />
          </svg>

          {/* Nodes */}
          {NODES.map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveNode(node)}
              className={`group absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-4 transition-all duration-500 ${
                activeNode.id === node.id ? 'z-20 scale-125' : 'z-10 bg-black'
              } ${
                node.status === 'COMPLETED'
                  ? 'border-green-500 bg-green-500/10'
                  : node.status === 'IN_PROGRESS'
                    ? 'animate-pulse border-red-600 bg-red-600/10'
                    : 'border-zinc-800 bg-zinc-900 opacity-60'
              }`}
              style={{ left: node.x, top: node.y }}
            >
              <div
                className={`h-3 w-3 rounded-full ${
                  node.status === 'COMPLETED'
                    ? 'bg-green-500 shadow-[0_0_10px_#22c55e]'
                    : node.status === 'IN_PROGRESS'
                      ? 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                      : 'bg-zinc-700'
                }`}
              ></div>

              {/* Tooltip Label */}
              <div className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded border border-white/10 bg-zinc-900 px-2 py-1 text-[9px] font-black tracking-widest uppercase">
                  {node.title}
                </span>
              </div>
            </button>
          ))}

          {/* Active Detail Overlay */}
          <div className="animate-in fade-in slide-in-from-bottom-4 absolute right-10 bottom-10 left-10 rounded-2xl border border-red-500/30 bg-zinc-950 p-6 shadow-2xl backdrop-blur-xl md:right-10 md:left-auto md:w-80">
            <div className="mb-4 flex items-start justify-between">
              <span
                className={`rounded border px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                  activeNode.status === 'COMPLETED'
                    ? 'border-green-500/30 bg-green-500/10 text-green-500'
                    : activeNode.status === 'IN_PROGRESS'
                      ? 'border-red-500/30 bg-red-500/10 text-red-500'
                      : 'border-white/5 bg-zinc-800 text-gray-500'
                }`}
              >
                {activeNode.status.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-bold text-gray-600">NODE_0{activeNode.id}</span>
            </div>
            <h3 className="mb-2 text-xl font-black tracking-tighter text-white uppercase">
              {activeNode.title}
            </h3>
            <p className="mb-6 text-xs leading-relaxed font-light text-gray-400">
              {activeNode.desc}
            </p>
            <button
              className={`w-full py-3 text-[10px] font-black tracking-widest uppercase transition-all min-h-[44px] flex items-center justify-center ${
                activeNode.status === 'LOCKED'
                  ? 'cursor-not-allowed bg-zinc-800 text-gray-600'
                  : 'bg-red-600 text-white hover:bg-red-500 active:scale-95'
              }`}
            >
              {activeNode.status === 'COMPLETED'
                ? 'Review Protocol'
                : activeNode.status === 'IN_PROGRESS'
                  ? 'Initiate Node'
                  : 'Node Locked'}
            </button>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="flex md:hidden flex-col gap-6 w-full max-w-md relative px-4">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[39px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-zinc-800"></div>

          {NODES.map((node) => {
            const isCompleted = node.status === 'COMPLETED';
            const isInProgress = node.status === 'IN_PROGRESS';
            const isLocked = node.status === 'LOCKED';

            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                className={`relative flex gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                  activeNode.id === node.id
                    ? 'border-red-500/50 bg-zinc-950/80 shadow-lg'
                    : 'border-white/5 bg-zinc-950/30'
                }`}
              >
                {/* Status Dot in Column */}
                <div className="relative z-10 flex flex-col items-center justify-start pt-1">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? 'border-green-500 bg-green-500/10'
                        : isInProgress
                          ? 'animate-pulse border-red-500 bg-red-500/10'
                          : 'border-zinc-800 bg-zinc-900'
                    }`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isCompleted
                          ? 'bg-green-500 shadow-[0_0_10px_#22c55e]'
                          : isInProgress
                            ? 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                            : 'bg-zinc-700'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Node Details */}
                <div className="flex-1 flex flex-col min-w-0 pt-1">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className={`rounded border px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase ${
                      isCompleted
                        ? 'border-green-500/30 bg-green-500/10 text-green-500'
                        : isInProgress
                          ? 'border-red-500/30 bg-red-500/10 text-red-500'
                          : 'border-white/5 bg-zinc-800 text-gray-500'
                    }`}>
                      {node.status.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-600">NODE_0{node.id}</span>
                  </div>
                  <h3 className="text-base font-black tracking-tight text-white uppercase truncate">
                    {node.title}
                  </h3>
                  <p className="mt-1 text-xs leading-normal font-light text-zinc-400">
                    {node.desc}
                  </p>
                  
                  {activeNode.id === node.id && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        className={`w-full py-3.5 text-[9px] font-black tracking-widest uppercase transition-all rounded-lg min-h-[44px] flex items-center justify-center ${
                          isLocked
                            ? 'cursor-not-allowed bg-zinc-900 text-gray-600 border border-white/5'
                            : 'bg-red-600 text-white hover:bg-red-500 active:scale-95'
                        }`}
                        disabled={isLocked}
                      >
                        {isCompleted
                          ? 'Review Protocol'
                          : isInProgress
                            ? 'Initiate Node'
                            : 'Node Locked'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 max-w-2xl px-8 text-center">
          <p className="border-t border-white/5 pt-8 text-xs font-light tracking-widest text-gray-600 uppercase">
            Interactive Roadmap visualized in real-time. Progress synced to your encrypted operator
            profile. Reach <span className="font-bold text-red-500">Expert Tier</span> to unlock
            dark-mode advanced governance modules.
          </p>
        </div>
      </div>
    </div>
  );
}
