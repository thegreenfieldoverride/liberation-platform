'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import { RunwayCalculator } from '@greenfieldoverride/runway-calculator';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { RunwayCalculation } from '@greenfieldoverride/types';

interface AnalyticsEnabledRunwayCalculatorProps {
  className?: string;
  showPrivacyStatement?: boolean;
  showAdvancedFeatures?: boolean;
}

export function AnalyticsEnabledRunwayCalculator(props: AnalyticsEnabledRunwayCalculatorProps) {
  const analytics = useAnalytics();
  const lastCalculationRef = useRef<RunwayCalculation | null>(null);
  const trackingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCalculationChange = useCallback((calculation: RunwayCalculation) => {
    // Only track if this is a meaningful calculation (has savings and expenses)
    if (calculation.runwayMonths > 0 && 
        calculation.currentSavings > 0 && 
        calculation.totalMonthlyExpenses > 0) {
      
      // Debounce tracking to avoid spam during real-time input
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }

      trackingTimeoutRef.current = setTimeout(() => {
        // Track with both analytics systems
        analytics.trackRunwayCalculation(
          calculation.runwayMonths,
          getSavingsBand(calculation.currentSavings),
          getExpensesBand(calculation.totalMonthlyExpenses)
        );

        // Track general tool usage for Fathom
        analytics.trackCalculation('Runway Calculator', `${calculation.runwayMonths.toFixed(1)} months`);

        lastCalculationRef.current = calculation;
      }, 2000); // Wait 2 seconds after user stops typing
    }
  }, [analytics]);

  // Track tool usage when component mounts
  useEffect(() => {
    analytics.trackToolUsage('Runway Calculator');
    analytics.trackPageview('/tools/runway-calculator');
  }, [analytics]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <RunwayCalculator
      {...props}
      onCalculationChange={handleCalculationChange}
    />
  );
}

// Helper functions to categorize financial data for privacy-preserving analytics
function getSavingsBand(savings: number): string {
  if (savings < 1000) return '0-1k';
  if (savings < 5000) return '1k-5k';
  if (savings < 10000) return '5k-10k';
  if (savings < 25000) return '10k-25k';
  if (savings < 50000) return '25k-50k';
  if (savings < 100000) return '50k-100k';
  if (savings < 250000) return '100k-250k';
  return '250k+';
}

function getExpensesBand(monthlyExpenses: number): string {
  if (monthlyExpenses < 1000) return '0-1k';
  if (monthlyExpenses < 2000) return '1k-2k';
  if (monthlyExpenses < 3000) return '2k-3k';
  if (monthlyExpenses < 4000) return '3k-4k';
  if (monthlyExpenses < 5000) return '4k-5k';
  if (monthlyExpenses < 7500) return '5k-7.5k';
  if (monthlyExpenses < 10000) return '7.5k-10k';
  return '10k+';
}