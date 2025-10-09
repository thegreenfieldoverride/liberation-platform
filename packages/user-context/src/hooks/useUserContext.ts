/**
 * React Hook for User Context Management
 * Provides seamless access to cross-tool user data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { UserContext, UserContextEvent } from '@thegreenfieldoverride/types';
import { UserContextStorage } from '../storage/user-storage';

interface UseUserContextReturn {
  context: UserContext | null;
  loading: boolean;
  error: string | null;
  
  // Context management
  updateFinancial: (data: UserContext['financial']) => Promise<void>;
  updateCareer: (data: UserContext['career']) => Promise<void>;
  updateSmallBets: (data: UserContext['smallBets']) => Promise<void>;
  updateAI: (data: UserContext['ai']) => Promise<void>;
  
  // Small bets specific
  addSmallBet: (bet: UserContext['smallBets']['bets'][0]) => Promise<void>;
  updateSmallBet: (id: string, updates: Partial<UserContext['smallBets']['bets'][0]>) => Promise<void>;
  deleteSmallBet: (id: string) => Promise<void>;
  
  // Data management
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<void>;
  resetContext: () => Promise<void>;
  
  // Events
  addEventListener: (event: string, callback: Function) => void;
  removeEventListener: (event: string, callback: Function) => void;
}

export const useUserContext = (): UseUserContextReturn => {
  const [context, setContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storageRef = useRef<UserContextStorage | null>(null);

  // Initialize storage and load context
  useEffect(() => {
    const initializeContext = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize storage
        storageRef.current = new UserContextStorage();
        await storageRef.current.initialize();

        // Load existing context or create new one
        let userContext = await storageRef.current.getUserContext();
        if (!userContext) {
          userContext = await storageRef.current.createUserContext();
        }

        setContext(userContext);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize user context');
        console.error('User context initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeContext();
  }, []);

  // Calculate liberation score when context changes
  useEffect(() => {
    if (context && storageRef.current) {
      const newScore = calculateLiberationScore(context);
      const newPhase = determineLiberationPhase(context);
      
      if (newScore !== context.liberationScore || newPhase !== context.liberationPhase) {
        storageRef.current.updateContext('liberationScore', newScore);
        storageRef.current.updateContext('liberationPhase', newPhase);
      }
    }
  }, [context]);

  // Update methods
  const updateFinancial = useCallback(async (data: UserContext['financial']) => {
    if (!storageRef.current) return;
    
    try {
      await storageRef.current.updateContext('financial', data);
      const updatedContext = await storageRef.current.getUserContext();
      setContext(updatedContext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update financial data');
    }
  }, []);

  const updateCareer = useCallback(async (data: UserContext['career']) => {
    if (!storageRef.current) return;
    
    try {
      await storageRef.current.updateContext('career', data);
      const updatedContext = await storageRef.current.getUserContext();
      setContext(updatedContext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update career data');
    }
  }, []);

  const updateSmallBets = useCallback(async (data: UserContext['smallBets']) => {
    if (!storageRef.current) return;
    
    try {
      await storageRef.current.updateContext('smallBets', data);
      const updatedContext = await storageRef.current.getUserContext();
      setContext(updatedContext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update small bets data');
    }
  }, []);

  const updateAI = useCallback(async (data: UserContext['ai']) => {
    if (!storageRef.current) return;
    
    try {
      await storageRef.current.updateContext('ai', data);
      const updatedContext = await storageRef.current.getUserContext();
      setContext(updatedContext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update AI data');
    }
  }, []);

  // Small bets specific methods
  const addSmallBet = useCallback(async (bet: UserContext['smallBets']['bets'][0]) => {
    if (!context || !storageRef.current) return;
    
    try {
      const updatedBets = [...context.smallBets.bets, bet];
      const updatedPortfolio = calculatePortfolioMetrics({
        ...context.smallBets,
        bets: updatedBets,
        lastUpdated: new Date()
      });
      
      await updateSmallBets(updatedPortfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add small bet');
    }
  }, [context, updateSmallBets]);

  const updateSmallBet = useCallback(async (id: string, updates: Partial<UserContext['smallBets']['bets'][0]>) => {
    if (!context || !storageRef.current) return;
    
    try {
      const updatedBets = context.smallBets.bets.map(bet => 
        bet.id === id ? { ...bet, ...updates } : bet
      );
      
      const updatedPortfolio = calculatePortfolioMetrics({
        ...context.smallBets,
        bets: updatedBets,
        lastUpdated: new Date()
      });
      
      await updateSmallBets(updatedPortfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update small bet');
    }
  }, [context, updateSmallBets]);

  const deleteSmallBet = useCallback(async (id: string) => {
    if (!context || !storageRef.current) return;
    
    try {
      const updatedBets = context.smallBets.bets.filter(bet => bet.id !== id);
      const updatedPortfolio = calculatePortfolioMetrics({
        ...context.smallBets,
        bets: updatedBets,
        lastUpdated: new Date()
      });
      
      await updateSmallBets(updatedPortfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete small bet');
    }
  }, [context, updateSmallBets]);

  // Data management
  const exportData = useCallback(async () => {
    if (!storageRef.current) throw new Error('Storage not initialized');
    return await storageRef.current.exportUserData();
  }, []);

  const importData = useCallback(async (data: any) => {
    if (!storageRef.current) throw new Error('Storage not initialized');
    
    try {
      await storageRef.current.importUserData(data);
      const updatedContext = await storageRef.current.getUserContext();
      setContext(updatedContext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
    }
  }, []);

  const resetContext = useCallback(async () => {
    if (!storageRef.current) return;
    
    try {
      const newContext = await storageRef.current.createUserContext();
      setContext(newContext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset context');
    }
  }, []);

  // Event management
  const addEventListener = useCallback((event: string, callback: Function) => {
    if (storageRef.current) {
      storageRef.current.on(event, callback);
    }
  }, []);

  const removeEventListener = useCallback((event: string, callback: Function) => {
    if (storageRef.current) {
      storageRef.current.off(event, callback);
    }
  }, []);

  return {
    context,
    loading,
    error,
    updateFinancial,
    updateCareer,
    updateSmallBets,
    updateAI,
    addSmallBet,
    updateSmallBet,
    deleteSmallBet,
    exportData,
    importData,
    resetContext,
    addEventListener,
    removeEventListener
  };
};

// Helper functions
function calculateLiberationScore(context: UserContext): number {
  let score = 0;
  
  // Financial foundation (40 points)
  if (context.financial.runwayMonths) {
    score += Math.min(context.financial.runwayMonths * 2, 20); // Up to 20 points for 10+ months runway
  }
  if (context.financial.cognitiveDebtPercentage !== undefined) {
    score += Math.max(0, 20 - context.financial.cognitiveDebtPercentage * 0.2); // Up to 20 points for low cognitive debt
  }
  
  // Career clarity (30 points)
  if (context.career.valueProfile) {
    score += 15; // Values assessment completed
  }
  if (context.career.topMatches && context.career.topMatches.length > 0) {
    score += 15; // Career matches identified
  }
  
  // Action taking (30 points)
  if (context.smallBets.bets.length > 0) {
    score += 10; // Started taking action
    const activeBets = context.smallBets.bets.filter(bet => bet.status === 'active' || bet.status === 'successful');
    score += Math.min(activeBets.length * 5, 20); // Up to 20 points for active bets
  }
  
  return Math.min(Math.round(score), 100);
}

function determineLiberationPhase(context: UserContext): UserContext['liberationPhase'] {
  const score = context.liberationScore;
  const hasFinancialData = Object.keys(context.financial).length > 0;
  const hasCareerClarity = !!context.career.valueProfile;
  const hasActiveBets = context.smallBets.bets.some(bet => bet.status === 'active');
  const hasSuccessfulBets = context.smallBets.bets.some(bet => bet.status === 'successful');
  
  if (score >= 80 && hasSuccessfulBets) return 'liberated';
  if (score >= 60 && hasActiveBets) return 'transitioning';
  if (score >= 40 && hasCareerClarity) return 'building';
  if (score >= 20 && hasFinancialData) return 'planning';
  return 'discovery';
}

function calculatePortfolioMetrics(portfolio: UserContext['smallBets']): UserContext['smallBets'] {
  const { bets } = portfolio;
  
  const totalInvestment = bets.reduce((sum, bet) => sum + bet.initialInvestment, 0);
  const totalRevenue = bets.reduce((sum, bet) => sum + bet.totalRevenue, 0);
  const totalProfit = bets.reduce((sum, bet) => sum + bet.totalProfit, 0);
  const averageHoursPerWeek = bets.reduce((sum, bet) => sum + bet.hoursPerWeek, 0);
  
  // Calculate diversification score
  const categories = new Set(bets.map(bet => bet.category));
  const diversificationScore = Math.min(categories.size * 2, 10);
  
  // Calculate risk level
  const highRiskBets = bets.filter(bet => bet.initialInvestment > 1000).length;
  const totalBets = bets.length;
  const riskLevel = totalBets === 0 ? 'low' : 
                   highRiskBets / totalBets > 0.5 ? 'high' :
                   highRiskBets / totalBets > 0.2 ? 'medium' : 'low';
  
  // Calculate runway from portfolio
  const monthlyIncome = bets.reduce((sum, bet) => sum + bet.monthlyRevenue, 0);
  const monthlyBurnRate = bets.reduce((sum, bet) => sum + bet.monthlyExpenses, 0);
  const runway = monthlyBurnRate > 0 ? monthlyIncome / monthlyBurnRate : 0;
  
  return {
    ...portfolio,
    totalInvestment,
    totalRevenue,
    totalProfit,
    averageHoursPerWeek,
    portfolioMetrics: {
      diversificationScore,
      riskLevel: riskLevel as 'low' | 'medium' | 'high',
      monthlyBurnRate,
      monthlyIncome,
      runway
    }
  };
}