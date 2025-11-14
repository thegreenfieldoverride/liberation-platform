/**
 * User Context Package - Cross-tool data persistence
 * Privacy-first client-side storage for liberation tools
 */

export { UserContextStorage } from './storage/user-storage';
export { useUserContext } from './hooks/useUserContext';
// TODO: Re-enable once types are properly distributed
// export { useInsightDecisions } from './hooks/useInsightDecisions';

// Re-export types for convenience
export type {
  UserContext,
  UserIdentity,
  FinancialContext,
  CareerContext,
  SmallBet,
  SmallBetsPortfolio,
  AIPersonalization,
  // TODO: Re-enable once types are properly distributed
  // InsightDecision,
  UserContextEvent,
  StorageConfig,
  UserDataExport
} from '@greenfieldoverride/types';