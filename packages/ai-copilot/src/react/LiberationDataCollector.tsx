'use client';

import React, { useState, useEffect } from 'react';
import { LiberationDashboard } from './LiberationDashboard';

interface LiberationDataCollectorProps {
  className?: string;
  onDataUpdate?: (data: any) => void;
}

interface LiberationToolData {
  runway?: {
    runwayMonths: number;
    savings: number;
    monthlyExpenses: number;
  };
  realWage?: {
    realHourlyWage: number;
    statedHourlyWage: number;
    reduction: number;
  };
  cognitiveDebt?: {
    overallScore: number;
    riskLevel: string;
    primaryConcerns: string[];
  };
}

export function LiberationDataCollector({ className = '', onDataUpdate }: LiberationDataCollectorProps) {
  const [collectedData, setCollectedData] = useState<LiberationToolData>({});
  const [isDataComplete, setIsDataComplete] = useState(false);

  // Listen for data from other liberation tools
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      const { tool, data } = event.detail;
      
      setCollectedData(prev => ({
        ...prev,
        [tool]: data
      }));
    };

    // Listen for liberation tool data events
    window.addEventListener('liberation-data-update' as any, handleDataUpdate);

    return () => {
      window.removeEventListener('liberation-data-update' as any, handleDataUpdate);
    };
  }, []);

  // Check if we have enough data for meaningful analysis
  useEffect(() => {
    const hasRunway = collectedData.runway?.runwayMonths !== undefined;
    const hasWage = collectedData.realWage?.realHourlyWage !== undefined;
    const hasCognitive = collectedData.cognitiveDebt?.overallScore !== undefined;
    
    setIsDataComplete(hasRunway || hasWage || hasCognitive);
  }, [collectedData]);

  // Transform collected data to dashboard format
  const transformedData = isDataComplete ? {
    financial: {
      runwayMonths: collectedData.runway?.runwayMonths || 0,
      realHourlyWage: collectedData.realWage?.realHourlyWage || 0,
      savings: collectedData.runway?.savings || 0,
      monthlyExpenses: collectedData.runway?.monthlyExpenses || 0
    },
    cognitive: {
      overallScore: collectedData.cognitiveDebt?.overallScore || 0,
      riskLevel: collectedData.cognitiveDebt?.riskLevel || 'unknown',
      primaryConcerns: collectedData.cognitiveDebt?.primaryConcerns || []
    },
    career: {
      jobSatisfaction: 5, // Default - could be collected from a career satisfaction tool
      workLifeBalance: (collectedData.realWage?.reduction || 0) > 50 ? 2 : 6, // Derived from wage data
      skillsDevelopment: 6, // Default
      marketValue: Math.min(10, Math.max(1, (collectedData.realWage?.realHourlyWage || 15) / 3))
    }
  } : undefined;

  // Notify parent component when data changes
  useEffect(() => {
    onDataUpdate?.(transformedData);
  }, [transformedData, onDataUpdate]);

  if (!isDataComplete) {
    return (
      <div className={`liberation-data-collector ${className}`}>
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            Collecting Your Liberation Data
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Use the liberation tools below to build your personalized dashboard. 
            As you complete assessments, your AI Co-Pilot will provide increasingly sophisticated guidance.
          </p>
          
          {/* Data Collection Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className={`p-4 rounded-lg border-2 ${
              collectedData.runway ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-2xl mb-2">
                {collectedData.runway ? '✅' : '📊'}
              </div>
              <h3 className="font-medium text-gray-800">Financial Runway</h3>
              <p className="text-sm text-gray-600 mt-1">
                {collectedData.runway ? 
                  `${collectedData.runway.runwayMonths.toFixed(1)} months` : 
                  'Complete the Runway Calculator'
                }
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${
              collectedData.realWage ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-2xl mb-2">
                {collectedData.realWage ? '✅' : '💰'}
              </div>
              <h3 className="font-medium text-gray-800">Real Wage</h3>
              <p className="text-sm text-gray-600 mt-1">
                {collectedData.realWage ? 
                  `$${collectedData.realWage.realHourlyWage.toFixed(0)}/hour` : 
                  'Complete the Real Hourly Wage Calculator'
                }
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${
              collectedData.cognitiveDebt ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-2xl mb-2">
                {collectedData.cognitiveDebt ? '✅' : '🧠'}
              </div>
              <h3 className="font-medium text-gray-800">Cognitive Health</h3>
              <p className="text-sm text-gray-600 mt-1">
                {collectedData.cognitiveDebt ? 
                  `${collectedData.cognitiveDebt.riskLevel} risk` : 
                  'Complete the Cognitive Debt Assessment'
                }
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              💡 Tip: Complete at least one assessment to unlock your AI Liberation Dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`liberation-data-collector ${className}`}>
      <LiberationDashboard 
        liberationData={transformedData}
        onStrategyGenerated={(strategy) => {
          console.log('AI strategy generated:', strategy);
        }}
      />
      
      {/* Data Sources Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">📊 Your Data Sources</h4>
        <div className="text-sm text-blue-700 space-y-1">
          {collectedData.runway && (
            <p>• Financial: {collectedData.runway.runwayMonths.toFixed(1)} months runway from Runway Calculator</p>
          )}
          {collectedData.realWage && (
            <p>• Wage: ${collectedData.realWage.realHourlyWage.toFixed(0)}/hour real wage from Real Hourly Wage Calculator</p>
          )}
          {collectedData.cognitiveDebt && (
            <p>• Mental Health: {collectedData.cognitiveDebt.overallScore}% cognitive debt from Cognitive Debt Assessment</p>
          )}
        </div>
        <p className="text-xs text-blue-600 mt-2">
          🔒 All data stays in your browser - nothing is sent to servers
        </p>
      </div>
    </div>
  );
}

// Utility function to broadcast data from liberation tools
export function broadcastLiberationData(tool: string, data: any) {
  const event = new CustomEvent('liberation-data-update', {
    detail: { tool, data }
  });
  window.dispatchEvent(event);
}