'use client';

import { useCallback } from 'react';
import { trackEvent, trackPageView } from '../components/analytics/FathomAnalytics';

/**
 * Analytics hook for tracking liberation platform events
 * Privacy-first: no personal data, GDPR compliant
 */
export function useAnalytics() {
  const track = useCallback((eventName: string, value?: number) => {
    trackEvent(eventName, value);
  }, []);

  const trackPageview = useCallback((url?: string) => {
    trackPageView(url);
  }, []);

  // Liberation-specific tracking events
  const trackToolUsage = useCallback((toolName: string) => {
    track(`Tool Used: ${toolName}`);
  }, [track]);

  const trackCalculation = useCallback((toolName: string, result?: string) => {
    track(`Calculation: ${toolName}${result ? ` - ${result}` : ''}`);
  }, [track]);

  const trackDownload = useCallback((itemName: string) => {
    track(`Download: ${itemName}`);
  }, [track]);

  const trackGoalCompletion = useCallback((goalName: string, value?: number) => {
    track(`Goal: ${goalName}`, value);
  }, [track]);

  const trackLiberationMilestone = useCallback((milestone: string) => {
    track(`Liberation Milestone: ${milestone}`);
  }, [track]);

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
    
    // Convenience methods for common events
    trackRunwayCalculation: () => trackToolUsage('Runway Calculator'),
    trackRealHourlyWage: () => trackToolUsage('Real Hourly Wage'),
    trackCognitiveDebt: () => trackToolUsage('Cognitive Debt Assessment'),
    trackAICopilot: () => trackToolUsage('AI Co-Pilot'),
    trackValuesVocation: () => trackToolUsage('Values-to-Vocation Matcher'),
    trackSmallBets: () => trackToolUsage('Small Bets Portfolio'),
  };
}