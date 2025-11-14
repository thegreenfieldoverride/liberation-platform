/**
 * React Hook for Insight Engine Decision Management
 * Provides persistence and progress tracking for strategic insights
 */

import { useState, useCallback } from 'react';
import { InsightDecision } from '@greenfieldoverride/types';
import { useUserContext } from './useUserContext';

interface UseInsightDecisionsReturn {
  decisions: InsightDecision[];
  loading: boolean;
  error: string | null;
  
  // Decision management
  createDecision: (userChoice: InsightDecision['userChoice'], aiRecommendation: InsightDecision['aiRecommendation']) => Promise<InsightDecision>;
  updateDecision: (id: string, updates: Partial<InsightDecision>) => Promise<void>;
  makeUserDecision: (id: string, decision: NonNullable<InsightDecision['userDecision']>) => Promise<void>;
  updateProgress: (id: string, progress: Partial<NonNullable<InsightDecision['progress']>>) => Promise<void>;
  
  // Query methods  
  getDecision: (id: string) => InsightDecision | undefined;
  getActiveDecisions: () => InsightDecision[];
  getDecisionsByStatus: (status: 'planning' | 'in_progress' | 'completed' | 'pivoted' | 'abandoned') => InsightDecision[];
  getRecentDecisions: (days?: number) => InsightDecision[];
  
  // Analytics
  getDecisionStats: () => {
    total: number;
    withUserDecisions: number;
    byStatus: Record<string, number>;
    avgConfidence: number;
  };
}

export const useInsightDecisions = (): UseInsightDecisionsReturn => {
  const { context, updateAI, loading, error } = useUserContext();
  const [localError, setLocalError] = useState<string | null>(null);

  const decisions = context?.ai.insightDecisions || [];

  const createDecision = useCallback(async (
    userChoice: InsightDecision['userChoice'], 
    aiRecommendation: InsightDecision['aiRecommendation']
  ): Promise<InsightDecision> => {
    if (!context) throw new Error('User context not initialized');
    
    try {
      const newDecision: InsightDecision = {
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userChoice,
        aiRecommendation,
        createdAt: new Date(),
        tags: []
      };
      
      const updatedAI = {
        ...context.ai,
        insightDecisions: [...decisions, newDecision]
      };
      
      await updateAI(updatedAI);
      setLocalError(null);
      return newDecision;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create insight decision';
      setLocalError(errorMsg);
      throw err;
    }
  }, [context, decisions, updateAI]);

  const updateDecision = useCallback(async (id: string, updates: Partial<InsightDecision>) => {
    if (!context) throw new Error('User context not initialized');
    
    try {
      const updatedDecisions = decisions.map(decision => 
        decision.id === id ? { ...decision, ...updates } : decision
      );
      
      const updatedAI = {
        ...context.ai,
        insightDecisions: updatedDecisions
      };
      
      await updateAI(updatedAI);
      setLocalError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update insight decision';
      setLocalError(errorMsg);
      throw err;
    }
  }, [context, decisions, updateAI]);

  const makeUserDecision = useCallback(async (id: string, decision: NonNullable<InsightDecision['userDecision']>) => {
    await updateDecision(id, { 
      userDecision: decision,
      progress: {
        status: 'planning',
        completedActions: [],
        nextSteps: [],
        lessonsLearned: [],
        lastUpdated: new Date()
      }
    });
  }, [updateDecision]);

  const updateProgress = useCallback(async (id: string, progressUpdates: Partial<NonNullable<InsightDecision['progress']>>) => {
    const existingDecision = decisions.find(d => d.id === id);
    if (!existingDecision) throw new Error('Decision not found');
    
    const currentProgress = existingDecision.progress || {
      status: 'planning' as const,
      completedActions: [],
      nextSteps: [],
      lessonsLearned: [],
      lastUpdated: new Date()
    };
    
    const updatedProgress: NonNullable<InsightDecision['progress']> = {
      ...currentProgress,
      ...progressUpdates,
      lastUpdated: new Date()
    };
    
    await updateDecision(id, { progress: updatedProgress });
  }, [decisions, updateDecision]);

  // Query methods
  const getDecision = useCallback((id: string) => {
    return decisions.find(d => d.id === id);
  }, [decisions]);

  const getActiveDecisions = useCallback(() => {
    return decisions.filter(d => 
      d.userDecision && 
      d.progress?.status && 
      !['completed', 'abandoned'].includes(d.progress.status)
    );
  }, [decisions]);

  const getDecisionsByStatus = useCallback((status: NonNullable<InsightDecision['progress']>['status']) => {
    return decisions.filter(d => d.progress?.status === status);
  }, [decisions]);

  const getRecentDecisions = useCallback((days = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return decisions.filter(d => d.createdAt >= cutoff);
  }, [decisions]);

  // Analytics
  const getDecisionStats = useCallback(() => {
    const total = decisions.length;
    const withUserDecisions = decisions.filter(d => d.userDecision).length;
    
    const byStatus: Record<string, number> = {};
    decisions.forEach(d => {
      if (d.progress?.status) {
        byStatus[d.progress.status] = (byStatus[d.progress.status] || 0) + 1;
      }
    });
    
    const avgConfidence = decisions.reduce((sum, d) => sum + d.aiRecommendation.confidence, 0) / total;
    
    return {
      total,
      withUserDecisions,
      byStatus,
      avgConfidence: isNaN(avgConfidence) ? 0 : Math.round(avgConfidence)
    };
  }, [decisions]);

  return {
    decisions,
    loading,
    error: error || localError,
    createDecision,
    updateDecision,
    makeUserDecision,
    updateProgress,
    getDecision,
    getActiveDecisions,
    getDecisionsByStatus,
    getRecentDecisions,
    getDecisionStats
  };
};