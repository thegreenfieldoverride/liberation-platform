/**
 * User Context Package - Cross-tool data persistence
 * Privacy-first client-side storage for liberation tools
 */

export { UserContextStorage } from './storage/user-storage';
export { useUserContext } from './hooks/useUserContext';

// Re-export types for convenience
export type {
  UserContext,
  UserIdentity,
  FinancialContext,
  CareerContext,
  SmallBet,
  SmallBetsPortfolio,
  AIPersonalization,
  UserContextEvent,
  StorageConfig,
  UserDataExport
} from '@thegreenfieldoverride/types';