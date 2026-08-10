/**
 * Small Bets Portfolio Core
 * Core logic and engines for portfolio management
 */

export { PortfolioEngine } from './portfolio-engine';
export type { BetAnalysis, PortfolioInsights } from './portfolio-engine';

export {
  scoreActivation,
  compareActivation,
  NEUTRAL_FRICTION,
  EXECUTIVE_FUNCTION_FRICTION,
} from './activation';
export type {
  ActivationScore,
  FrictionProfile,
  Initiation,
  InitiationKind,
  StallPoint,
} from './activation';

export { BET_CATALOG, suggestBets } from './catalog';
export type { AiExposure, BetRung, CatalogEntry, CatalogSuggestion } from './catalog';

// Re-export shared types for convenience
export type {
  SmallBet,
  SmallBetsPortfolio as SmallBetsPortfolioType,
  UserContext
} from '@greenfieldoverride/types';