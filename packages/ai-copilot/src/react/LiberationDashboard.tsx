'use client';

import React, { useState, useEffect } from 'react';
import { LiberationStrategistEngine, type LiberationProfile } from '../engines/liberation-strategist.engine';
import type { AIResponse } from '../interfaces/ai-engine.interface';

interface LiberationData {
  financial: {
    runwayMonths: number;
    realHourlyWage: number;
    savings: number;
    monthlyExpenses: number;
  };
  cognitive: {
    overallScore: number;
    riskLevel: string;
    primaryConcerns: string[];
  };
  career: {
    jobSatisfaction: number;
    workLifeBalance: number;
    skillsDevelopment: number;
    marketValue: number;
  };
}

interface LiberationDashboardProps {
  liberationData?: LiberationData;
  className?: string;
  onStrategyGenerated?: (strategy: AIResponse) => void;
}

export function LiberationDashboard({ 
  liberationData, 
  className = '',
  onStrategyGenerated 
}: LiberationDashboardProps) {
  const [strategy, setStrategy] = useState<AIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'progress' | 'insights'>('overview');

  const strategist = new LiberationStrategistEngine();

  useEffect(() => {
    if (liberationData) {
      generateStrategy();
    }
  }, [liberationData]);

  const generateStrategy = async () => {
    if (!liberationData) return;
    
    setIsAnalyzing(true);
    
    try {
      const profile: LiberationProfile = {
        runway: {
          months: liberationData.financial.runwayMonths,
          scenarios: [], // Would be populated from actual calculator
          stressTests: []
        },
        realWage: {
          hourlyWage: liberationData.financial.realHourlyWage,
          statedWage: liberationData.financial.realHourlyWage * 1.3, // Estimate
          reduction: 30,
          scenarios: []
        },
        cognitiveDebt: {
          overallScore: liberationData.cognitive.overallScore,
          riskLevel: liberationData.cognitive.riskLevel,
          primaryConcerns: liberationData.cognitive.primaryConcerns,
          categoryScores: {}
        },
        context: {
          riskTolerance: 'medium',
          timeframe: '1year'
        }
      };

      const result = await strategist.analyzeLiberation(profile);
      setStrategy(result);
      onStrategyGenerated?.(result);
    } catch (error) {
      console.error('Failed to generate strategy:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getLiberationPhase = () => {
    if (!liberationData) return 'unknown';
    
    const { financial, cognitive, career } = liberationData;
    const overallScore = (
      (financial.runwayMonths >= 12 ? 30 : financial.runwayMonths >= 6 ? 20 : 10) +
      (100 - cognitive.overallScore) * 0.3 +
      ((career.jobSatisfaction + career.workLifeBalance + career.skillsDevelopment + career.marketValue) / 4 * 4)
    );
    
    if (overallScore >= 80) return 'free';
    if (overallScore >= 60) return 'transitioning';
    if (overallScore >= 40) return 'planning';
    if (overallScore >= 20) return 'awakening';
    return 'trapped';
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'free': return '🌟';
      case 'transitioning': return '🚀';
      case 'planning': return '🎯';
      case 'awakening': return '💡';
      case 'trapped': return '⛓️';
      default: return '❓';
    }
  };

  const getPhaseDescription = (phase: string) => {
    switch (phase) {
      case 'free': return 'You have achieved significant liberation and autonomy';
      case 'transitioning': return 'You are actively moving toward freedom';
      case 'planning': return 'You are building your liberation strategy';
      case 'awakening': return 'You are recognizing the need for change';
      case 'trapped': return 'You are in a concerning situation requiring immediate attention';
      default: return 'Unable to determine current phase';
    }
  };

  if (!liberationData) {
    return (
      <div className={`liberation-dashboard ${className}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-medium text-gray-800 mb-2">AI Liberation Co-Pilot</h2>
          <p className="text-gray-600">
            Complete your liberation assessments to receive AI-powered strategic guidance.
          </p>
        </div>
      </div>
    );
  }

  const currentPhase = getLiberationPhase();

  return (
    <div className={`liberation-dashboard ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-2">AI Liberation Co-Pilot</h1>
        <p className="text-gray-600">Your personal chief of staff for freedom</p>
      </div>

      {/* Phase Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <div className="text-center">
          <div className="text-6xl mb-4">{getPhaseIcon(currentPhase)}</div>
          <h2 className="text-2xl font-medium text-gray-800 mb-2 capitalize">
            {currentPhase} Phase
          </h2>
          <p className="text-gray-600">{getPhaseDescription(currentPhase)}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Liberation Overview', icon: '📊' },
            { id: 'strategy', label: 'AI Strategy', icon: '🧠' },
            { id: 'progress', label: 'Progress Tracking', icon: '📈' },
            { id: 'insights', label: 'Strategic Insights', icon: '💡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-light text-blue-600 mb-2">
                  {liberationData.financial.runwayMonths.toFixed(1)}
                </div>
                <h3 className="font-medium text-gray-800">Months Runway</h3>
                <p className="text-sm text-gray-600 mt-1">Financial freedom buffer</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-light text-green-600 mb-2">
                  ${liberationData.financial.realHourlyWage.toFixed(0)}
                </div>
                <h3 className="font-medium text-gray-800">Real Hourly Wage</h3>
                <p className="text-sm text-gray-600 mt-1">True earning efficiency</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className={`text-3xl font-light mb-2 ${
                  liberationData.cognitive.overallScore >= 75 ? 'text-red-600' :
                  liberationData.cognitive.overallScore >= 50 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {(100 - liberationData.cognitive.overallScore).toFixed(0)}%
                </div>
                <h3 className="font-medium text-gray-800">Mental Health</h3>
                <p className="text-sm text-gray-600 mt-1">Cognitive clarity score</p>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-800 mb-4">Quick Assessment</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Financial Readiness</span>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  liberationData.financial.runwayMonths >= 12 ? 'bg-green-100 text-green-800' :
                  liberationData.financial.runwayMonths >= 6 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {liberationData.financial.runwayMonths >= 12 ? 'Excellent' :
                   liberationData.financial.runwayMonths >= 6 ? 'Good' : 'Needs Work'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mental Clarity</span>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  liberationData.cognitive.overallScore <= 25 ? 'bg-green-100 text-green-800' :
                  liberationData.cognitive.overallScore <= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {liberationData.cognitive.riskLevel === 'low' ? 'Excellent' :
                   liberationData.cognitive.riskLevel === 'moderate' ? 'Good' :
                   liberationData.cognitive.riskLevel === 'high' ? 'Concerning' : 'Critical'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Career Leverage</span>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  liberationData.financial.realHourlyWage >= 25 ? 'bg-green-100 text-green-800' :
                  liberationData.financial.realHourlyWage >= 15 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {liberationData.financial.realHourlyWage >= 25 ? 'Strong' :
                   liberationData.financial.realHourlyWage >= 15 ? 'Moderate' : 'Limited'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="space-y-6">
          {isAnalyzing ? (
            <div className="text-center py-12">
              <div className="animate-spin text-4xl mb-4">🤖</div>
              <p className="text-gray-600">AI is analyzing your liberation profile...</p>
            </div>
          ) : strategy ? (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-4">🧠 AI Strategic Analysis</h3>
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {strategy.content}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Privacy Note:</strong> This analysis was generated locally in your browser. 
                  Your data never leaves your device.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🤖</div>
              <p className="text-gray-600 mb-4">Ready to generate your liberation strategy</p>
              <button
                onClick={generateStrategy}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate AI Strategy
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Track your liberation journey over time to see concrete improvement.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Progress tracking features coming soon...
            </p>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Strategic Insights</h3>
            <p className="text-gray-600">
              AI-powered insights based on patterns in your liberation data.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Advanced insights features coming soon...
            </p>
          </div>
        </div>
      )}

      {/* Privacy Statement */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          🔒 <strong>100% Privacy-First AI:</strong> All analysis happens in your browser. 
          Your liberation data is never sent to servers or shared with anyone.
        </p>
      </div>
    </div>
  );
}