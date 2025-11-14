/**
 * React Hook for Insight Engine Decision Management
 * Provides persistence and progress tracking for strategic insights
 * 
 * TEMPORARILY DISABLED due to type distribution timing
 * TODO: Re-enable once InsightDecision type is properly distributed
 */

export function useInsightDecisions() {
  return {
    decisions: [],
    loading: false,
    error: null,
    createDecision: async () => ({ id: 'temp' } as any),
    updateDecision: async () => {},
    makeUserDecision: async () => {},
    updateProgress: async () => {},
    getDecisionsByTool: () => [],
    getRecentDecisions: () => [],
    getDecisionsByConfidence: () => [],
    getDecisionsByOutcome: () => [],
    getDecisionStats: () => ({ 
      total: 0, 
      avgConfidence: 0, 
      decisionsByTool: {},
      confidenceDistribution: {},
      outcomeDistribution: {},
      progressStats: {}
    }),
    clearDecisions: async () => {}
  };
}