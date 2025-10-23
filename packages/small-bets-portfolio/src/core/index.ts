/**
 * Small Bets Portfolio Core
 * Core logic and engines for portfolio management
 */

export { PortfolioEngine } from './portfolio-engine';
export type { BetAnalysis, PortfolioInsights } from './portfolio-engine';

// Re-export shared types for convenience
export type {
  SmallBet,
  SmallBetsPortfolio as SmallBetsPortfolioType,
  UserContext
} from '@greenfieldoverride/types';