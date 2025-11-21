'use client';

import { useCallback } from 'react';
import { analytics } from '@/lib/analytics';

/**
 * Enhanced Analytics hook for tracking liberation platform events
 * Privacy-first analytics using the Liberation Analytics service
 */
export function useAnalytics() {
  // Privacy-first analytics using new analytics service
  const track = useCallback((eventName: string, value?: number, attributes?: Record<string, any>) => {
    analytics.track('platform', eventName.toLowerCase().replace(/\s+/g, '_'), {
      event: eventName,
      value,
      ...attributes
    });
  }, []);

  const trackPageview = useCallback((url?: string) => {
    analytics.trackPageView(url || (typeof window !== 'undefined' ? window.location.pathname : '/'));
  }, []);

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

  // Enhanced tool-specific tracking with detailed data - using new analytics service
  const trackRunwayCalculation = useCallback((runwayMonths?: number, savingsBand?: string, expensesBand?: string) => {
    if (runwayMonths !== undefined && savingsBand && expensesBand) {
      analytics.trackRunwayCalculation(runwayMonths, savingsBand, expensesBand);
    }
  }, []);

  const trackRealHourlyWage = useCallback((salaryBand?: string, realWageDiff?: number, commuteMinutes?: number) => {
    if (salaryBand && realWageDiff !== undefined && commuteMinutes !== undefined) {
      analytics.trackRealWageReveal(salaryBand, realWageDiff, commuteMinutes);
    }
  }, []);

  const trackCognitiveDebt = useCallback((score?: number, category?: string, recommendation?: string) => {
    if (score !== undefined && category && recommendation) {
      analytics.trackCognitiveDebtAssessment(score, category, recommendation);
    }
  }, []);

  const trackAICopilot = useCallback((queryType?: string, planGenerated?: boolean, actionsTaken?: number) => {
    if (queryType && planGenerated !== undefined && actionsTaken !== undefined) {
      analytics.trackAICoPilotConsultation(queryType, planGenerated, actionsTaken);
    }
  }, []);

  const trackValuesVocation = useCallback((topValue?: string, careerPivot?: boolean, satisfactionChange?: number) => {
    if (topValue && careerPivot !== undefined && satisfactionChange !== undefined) {
      analytics.trackValuesVocationMatch(topValue, careerPivot, satisfactionChange);
    }
  }, []);

  const trackSmallBets = useCallback((betCount?: number, totalValue?: number, topPerformer?: string) => {
    if (betCount !== undefined && totalValue !== undefined && topPerformer) {
      analytics.trackSmallBetsActivity(betCount, totalValue, topPerformer);
    }
  }, []);

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