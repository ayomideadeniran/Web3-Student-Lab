//! Web3 Student Lab Soroban contract playground modules.
//!
//! The MVP contract crate exposes focused educational contracts that compile
//! cleanly with the Soroban SDK and can be exercised from unit tests or the
//! classroom playground. The modules below are intentionally small, documented,
//! and self-contained so learners can study one smart-contract pattern at a
//! time without unrelated examples interfering with the build.

#![no_std]
#![allow(clippy::needless_pass_by_value)]

pub mod activity_log;
pub mod admin;
pub mod crowdfunding;
pub mod dao_treasury;
pub mod dex_aggregator;
pub mod distribution_manager;
pub mod dynamic_staking;
pub mod enrollment;
pub mod events;
pub mod execution_engine;
pub mod gaming_asset_exchange;
#[cfg(test)]
pub mod gaming_asset_exchange_test;
pub mod membership_nft;
pub mod oracle_aggregator;
pub mod paymaster;
pub mod payment_gateway;
pub mod timestamping;
