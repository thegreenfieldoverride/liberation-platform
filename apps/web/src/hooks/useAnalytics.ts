'use client';

import { useCallback, useRef } from 'react';

/**
 * Internal Liberation Analytics Client
 * Provides detailed insights for liberation tools
 */
class LiberationAnalyticsClient {
  private baseURL: string;
  private sessionID: string;

  constructor() {
    this.baseURL = '/api/analytics';
    this.sessionID = this.generateSessionID();
  }

  async track(app: string, action: string, attributes: Record<string, any> = {}): Promise<void> {
    const event = {
      app,
      action,
      attributes,
      timestamp: new Date().toISOString(),
      session_id: this.sessionID
    };

    try {
      const response = await fetch(`${this.baseURL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        console.warn('Liberation Analytics: Failed to track event', response.status);
      }
    } catch (error) {
      // Fail silently - analytics should never break the user experience
      console.warn('Liberation Analytics: Network error', error);
    }
  }

  private generateSessionID(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 16) + 
           Date.now().toString(36);
  }
}

// Create singleton instance
let internalAnalytics: LiberationAnalyticsClient | null = null;

const getInternalAnalytics = (): LiberationAnalyticsClient => {
  if (!internalAnalytics) {
    internalAnalytics = new LiberationAnalyticsClient();
  }
  return internalAnalytics;
};

/**
 * Enhanced Analytics hook for tracking liberation platform events
 * Privacy-first internal analytics only
 */
export function useAnalytics() {
  const internalRef = useRef<LiberationAnalyticsClient>();

  if (!internalRef.current) {
    internalRef.current = getInternalAnalytics();
  }

  // Privacy-first internal analytics only
  const track = useCallback((eventName: string, value?: number, attributes?: Record<string, any>) => {
    // Track with internal analytics (detailed insights)
    internalRef.current?.track('platform', eventName.toLowerCase().replace(/\s+/g, '_'), {
      event: eventName,
      value,
      ...attributes
    });
  }, []);

  const trackPageview = useCallback((url?: string) => {
    track('Page View', undefined, { url: url || window.location.pathname });
  }, [track]);

  // Liberation-specific tracking events with detailed attributes
  const trackToolUsage = useCallback((toolName: string, metadata?: Record<string, any>) => {
    track(`Tool Used: ${toolName}`, undefined, { tool: toolName, ...metadata });
  }, [track]);

  const trackCalculation = useCallback((toolName: string, result?: string, metadata?: Record<string, any>) => {
    track(`Calculation: ${toolName}${result ? ` - ${result}` : ''}`, undefined, { 
      tool: toolName, 
      result, 
      ...metadata 
    });
  }, [track]);

  const trackDownload = useCallback((itemName: string) => {
    track(`Download: ${itemName}`, undefined, { item: itemName });
  }, [track]);

  const trackGoalCompletion = useCallback((goalName: string, value?: number) => {
    track(`Goal: ${goalName}`, value, { goal: goalName, value });
  }, [track]);

  const trackLiberationMilestone = useCallback((milestone: string) => {
    track(`Liberation Milestone: ${milestone}`, undefined, { milestone });
  }, [track]);

  // Enhanced tool-specific tracking with detailed data
  const trackRunwayCalculation = useCallback((runwayMonths?: number, savingsBand?: string, expensesBand?: string) => {
    trackCalculation('Runway Calculator', runwayMonths ? `${runwayMonths} months` : undefined, {
      runway_months: runwayMonths,
      savings_band: savingsBand,
      expenses_band: expensesBand
    });
  }, [trackCalculation]);

  const trackRealHourlyWage = useCallback((salaryBand?: string, realWageDiff?: number, commuteMinutes?: number) => {
    trackCalculation('Real Hourly Wage', realWageDiff ? `${realWageDiff}% difference` : undefined, {
      salary_band: salaryBand,
      real_wage_diff: realWageDiff,
      commute_minutes: commuteMinutes
    });
  }, [trackCalculation]);

  const trackCognitiveDebt = useCallback((score?: number, category?: string, recommendation?: string) => {
    trackCalculation('Cognitive Debt Assessment', score ? `Score: ${score}` : undefined, {
      debt_score: score,
      primary_category: category,
      recommendation
    });
  }, [trackCalculation]);

  const trackAICopilot = useCallback((queryType?: string, planGenerated?: boolean, actionsTaken?: number) => {
    trackToolUsage('AI Co-Pilot', {
      query_type: queryType,
      plan_generated: planGenerated,
      actions_taken: actionsTaken
    });
  }, [trackToolUsage]);

  const trackValuesVocation = useCallback((topValue?: string, careerPivot?: boolean, satisfactionChange?: number) => {
    trackCalculation('Values-to-Vocation Matcher', topValue, {
      top_value: topValue,
      career_pivot: careerPivot,
      satisfaction_change: satisfactionChange
    });
  }, [trackCalculation]);

  const trackSmallBets = useCallback((betCount?: number, totalValue?: number, topPerformer?: string) => {
    trackToolUsage('Small Bets Portfolio', {
      bet_count: betCount,
      total_value: totalValue,
      top_performer: topPerformer
    });
  }, [trackToolUsage]);

  return {
    // Core tracking
    track,
    trackPageview,
    
    // Liberation-specific events
    trackToolUsage,
    trackCalculation,
    trackDownload,
    trackGoalCompletion,
    trackLiberationMilestone,
    
    // Enhanced tool-specific methods with detailed tracking
    trackRunwayCalculation,
    trackRealHourlyWage,
    trackCognitiveDebt,
    trackAICopilot,
    trackValuesVocation,
    trackSmallBets,
  };
}