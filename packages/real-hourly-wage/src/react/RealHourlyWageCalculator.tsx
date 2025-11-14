'use client';

import React, { useState, useEffect } from 'react';
import {
  calculateRealHourlyWage,
  calculateWageLiberation,
  calculateWorkLifeBalance,
  createDefaultWorkHours,
  createDefaultWorkCosts,
  formatHourlyWage,
  formatWageComparison,
  calculateTimeImpact,
  type RealWageInputs,
  type WageLiberation
} from '../core/calculator';
import type { WorkHours, WorkCosts, RealWageCalculation } from '@greenfieldoverride/types';

// Helper for liberation journey tracking (will be injected from app)
interface LiberationJourneyHook {
  updateMilestone: (id: string, progress: number, metadata?: any) => void;
  recordEvent: (event: { 
    type: 'milestone_completed' | 'phase_advanced' | 'tool_used' | 'decision_made' | 'achievement_unlocked'; 
    toolId: 'runway-calculator' | 'real-hourly-wage' | 'cognitive-debt-assessment' | 'values-vocation-matcher' | 'insight-engine' | 'ai-copilot' | 'small-bets-portfolio'; 
    metadata: any 
  }) => void;
  updateToolInsights: (toolId: 'runway-calculator' | 'real-hourly-wage' | 'cognitive-debt-assessment' | 'values-vocation-matcher' | 'insight-engine' | 'ai-copilot' | 'small-bets-portfolio', insights: any) => void;
}

declare global {
  interface Window {
    liberationJourney?: LiberationJourneyHook;
  }
}

interface RealHourlyWageCalculatorProps {
  className?: string;
  onCalculationChange?: (calculation: RealWageCalculation) => void;
  showPrivacyStatement?: boolean;
  showLiberationFeatures?: boolean;
}

export function RealHourlyWageCalculator({
  className = '',
  onCalculationChange,
  showPrivacyStatement = true,
  showLiberationFeatures = true
}: RealHourlyWageCalculatorProps) {
  const [annualSalary, setAnnualSalary] = useState<number>(0);
  const [workHours, setWorkHours] = useState<WorkHours>(createDefaultWorkHours);
  const [workCosts, setWorkCosts] = useState<WorkCosts>(createDefaultWorkCosts);
  const [calculation, setCalculation] = useState<RealWageCalculation>({
    statedHourlyWage: 0,
    realHourlyWage: 0,
    monthlyRealIncome: 0,
    totalMonthlyHours: 0
  });
  const [liberationAnalysis, setLiberationAnalysis] = useState<WageLiberation | null>(null);
  const [activeTab, setActiveTab] = useState<'reality' | 'scenarios' | 'balance' | 'liberation'>('reality');
  const [hasRecordedCalculation, setHasRecordedCalculation] = useState<boolean>(false);

  // Real-time calculation
  useEffect(() => {
    const inputs: RealWageInputs = { annualSalary, workHours, workCosts };
    const newCalculation = calculateRealHourlyWage(inputs);
    setCalculation(newCalculation);
    onCalculationChange?.(newCalculation);
    
    // Calculate liberation analysis if salary is provided
    if (annualSalary > 0 && showLiberationFeatures) {
      const liberation = calculateWageLiberation(inputs);
      setLiberationAnalysis(liberation);
    }

    // Track milestones for liberation journey
    if (typeof window !== 'undefined' && window.liberationJourney) {
      const hasCompletedCalculation = annualSalary > 0 && newCalculation.realHourlyWage > 0;
      
      if (hasCompletedCalculation && !hasRecordedCalculation) {
        setHasRecordedCalculation(true);
        
        // Update milestone for real wage calculated
        window.liberationJourney.updateMilestone('real-wage-calculated', 100, {
          statedWage: newCalculation.statedHourlyWage,
          realWage: newCalculation.realHourlyWage,
          efficiency: newCalculation.realHourlyWage >= newCalculation.statedHourlyWage * 0.8 ? 'high' : 
                     newCalculation.realHourlyWage >= newCalculation.statedHourlyWage * 0.6 ? 'medium' : 'low'
        });

        // Record tool usage event
        window.liberationJourney.recordEvent({
          type: 'tool_used',
          toolId: 'real-hourly-wage',
          metadata: { 
            action: 'wage_calculated',
            realWage: newCalculation.realHourlyWage,
            statedWage: newCalculation.statedHourlyWage
          }
        });

        // Update tool insights
        window.liberationJourney.updateToolInsights('real-hourly-wage', {
          realWage: newCalculation.realHourlyWage,
          efficiency: newCalculation.realHourlyWage >= newCalculation.statedHourlyWage * 0.8 ? 'high' : 
                     newCalculation.realHourlyWage >= newCalculation.statedHourlyWage * 0.6 ? 'medium' : 'low'
        });
      }
    }

    // Broadcast data for liberation dashboard integration
    if (typeof window !== 'undefined') {
      const liberationData = {
        type: 'real-hourly-wage',
        timestamp: new Date().toISOString(),
        data: {
          calculation: newCalculation,
          inputs,
          liberation: liberationAnalysis,
          workLifeBalance: annualSalary > 0 ? calculateWorkLifeBalance(inputs) : null
        }
      };

      window.dispatchEvent(new CustomEvent('liberation-data-update', {
        detail: liberationData
      }));
    }
  }, [annualSalary, workHours, workCosts, onCalculationChange, showLiberationFeatures, liberationAnalysis, hasRecordedCalculation]);

  const parseNumericValue = (value: string): number => {
    // Remove commas, dollar signs, and other non-numeric characters except decimal points
    const cleaned = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const formatDisplayValue = (value: number): string => {
    if (value === 0) return '';
    return value.toLocaleString('en-US');
  };

  const handleSalaryChange = (value: string) => {
    setAnnualSalary(parseNumericValue(value));
  };

  const handleWorkHoursChange = (field: keyof WorkHours, value: string) => {
    setWorkHours(prev => ({ ...prev, [field]: parseNumericValue(value) }));
  };

  const handleWorkCostsChange = (field: keyof WorkCosts, value: string) => {
    setWorkCosts(prev => ({ ...prev, [field]: parseNumericValue(value) }));
  };

  const wageComparison = formatWageComparison(calculation.statedHourlyWage, calculation.realHourlyWage);
  const timeImpact = calculateTimeImpact(workHours.weeklyHours, workHours.commuteDailyMinutes, workHours.workDaysPerWeek);

  return (
    <div className={`real-hourly-wage-calculator ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          Real Hourly Wage Calculator
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Shatter the salary illusion. Discover what you're actually being paid 
          for each hour of your life.
        </p>
      </div>

      {/* Privacy Statement */}
      {showPrivacyStatement && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-green-800">
            🔒 <strong>Your data is yours.</strong> Everything stays in your browser. 
            We don't store, track, or share anything.
          </p>
        </div>
      )}

      {/* Annual Salary */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Annual Salary
        </h2>
        <input
          type="text"
          value={formatDisplayValue(annualSalary)}
          onChange={(e) => handleSalaryChange(e.target.value)}
          placeholder="60,000"
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Your gross annual salary before taxes
        </p>
      </div>

      {/* Work Hours */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Real Hours Worked
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Hours per week
            </label>
            <input
              type="text"
              value={formatDisplayValue(workHours.weeklyHours)}
              onChange={(e) => handleWorkHoursChange('weeklyHours', e.target.value)}
              placeholder="40"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Daily commute (minutes)
            </label>
            <input
              type="text"
              value={formatDisplayValue(workHours.commuteDailyMinutes)}
              onChange={(e) => handleWorkHoursChange('commuteDailyMinutes', e.target.value)}
              placeholder="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Work days per week
            </label>
            <input
              type="text"
              value={formatDisplayValue(workHours.workDaysPerWeek)}
              onChange={(e) => handleWorkHoursChange('workDaysPerWeek', e.target.value)}
              placeholder="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Include overtime, lunch breaks, and total commute time
        </p>
      </div>

      {/* Hidden Costs */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Hidden Monthly Costs
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Commute costs (gas, parking, transit)
            </label>
            <input
              type="text"
              value={formatDisplayValue(workCosts.commuteMonthlyCost)}
              onChange={(e) => handleWorkCostsChange('commuteMonthlyCost', e.target.value)}
              placeholder="150"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Work lunches and coffee
            </label>
            <input
              type="text"
              value={formatDisplayValue(workCosts.workLunchesMonthlyCost)}
              onChange={(e) => handleWorkCostsChange('workLunchesMonthlyCost', e.target.value)}
              placeholder="200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Work clothing and dry cleaning
            </label>
            <input
              type="text"
              value={formatDisplayValue(workCosts.workClothingMonthlyCost)}
              onChange={(e) => handleWorkCostsChange('workClothingMonthlyCost', e.target.value)}
              placeholder="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Stress spending (takeout, therapy, etc.)
            </label>
            <input
              type="text"
              value={formatDisplayValue(workCosts.stressSpendingMonthlyCost)}
              onChange={(e) => handleWorkCostsChange('stressSpendingMonthlyCost', e.target.value)}
              placeholder="300"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Costs that exist only because of your job
        </p>
      </div>

      {/* Results - The Red Pill Moment */}
      {annualSalary > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">The Truth About Your Hourly Wage</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stated Wage */}
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">What you think you earn:</p>
                <div className="text-2xl font-light text-gray-700">
                  {formatHourlyWage(calculation.statedHourlyWage)}/hour
                </div>
                <p className="text-xs text-gray-500 mt-1">Based on 40-hour week</p>
              </div>

              {/* Real Wage */}
              <div className="bg-white bg-opacity-75 rounded-lg p-4 border-2 border-red-300">
                <p className="text-sm text-red-700 mb-1 font-medium">What you actually earn:</p>
                <div className="text-3xl font-light text-red-800">
                  {formatHourlyWage(calculation.realHourlyWage)}/hour
                </div>
                <p className="text-xs text-red-600 mt-1">Including real hours + costs</p>
              </div>
            </div>
          </div>

          {/* Impact Message */}
          <div className="text-center">
            <p className="text-red-700 font-medium mb-2">
              You're losing {formatHourlyWage(wageComparison.difference)} per hour 
              ({wageComparison.percentageReduction.toFixed(1)}% of your stated wage)
            </p>
            <p className="text-sm text-red-600 italic">
              {wageComparison.message}
            </p>
          </div>

          {/* Time Impact */}
          <div className="mt-6 pt-4 border-t border-red-200">
            <p className="text-sm text-gray-700 text-center">
              <strong>Time Reality:</strong> You're giving {timeImpact.hoursPerWeek.toFixed(1)} hours per week 
              ({timeImpact.daysPerYear.toFixed(0)} full days per year) to your job.
            </p>
          </div>
        </div>
      )}

      {/* Liberation Features */}
      {showLiberationFeatures && liberationAnalysis && (
        <div className="mt-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'reality', label: 'Wage Reality', icon: '💰' },
                { id: 'scenarios', label: 'Liberation Scenarios', icon: '🚀' },
                { id: 'balance', label: 'Work-Life Balance', icon: '⚖️' },
                { id: 'liberation', label: 'Path to Freedom', icon: '🌟' }
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
          {activeTab === 'reality' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-600">Your wage reality is shown above.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Explore other tabs to see how you can optimize your earning potential.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Liberation Scenarios</h3>
                <p className="text-gray-600">Different paths to optimize your earning efficiency</p>
              </div>
              
              {[
                liberationAnalysis.currentScenario,
                liberationAnalysis.remoteWorkScenario,
                liberationAnalysis.freelanceScenario,
                liberationAnalysis.optimizedScenario
              ].map((scenario, index) => (
                <div key={scenario.name} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-800">{scenario.name}</h4>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-gray-800">
                        {formatHourlyWage(scenario.hourlyWage)}/hour
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        scenario.liberationPotential === 'high' ? 'bg-green-100 text-green-800' :
                        scenario.liberationPotential === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {scenario.liberationPotential} liberation potential
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Monthly income:</span> ${scenario.monthlyIncome.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Time commitment:</span> {scenario.timeValue}
                    </div>
                  </div>

                  {scenario.name === liberationAnalysis.remoteWorkScenario.name && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        💡 <strong>Remote Work Benefit:</strong> You could reclaim {liberationAnalysis.timeReclaiming.hoursPerWeek.toFixed(1)} hours per week
                        and increase your effective income by ${(scenario.monthlyIncome - liberationAnalysis.currentScenario.monthlyIncome).toLocaleString()} monthly!
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'balance' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Work-Life Balance Analysis</h3>
                <p className="text-gray-600">How work is impacting your life quality</p>
              </div>
              
              {(() => {
                const workLifeBalance = calculateWorkLifeBalance({ annualSalary, workHours, workCosts });
                return (
                  <div className="space-y-6">
                    {/* Quality Score */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="text-center mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Quality of Life Score</h4>
                        <div className={`text-4xl font-light mb-2 ${
                          workLifeBalance.qualityOfLifeScore >= 70 ? 'text-green-600' :
                          workLifeBalance.qualityOfLifeScore >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {workLifeBalance.qualityOfLifeScore}/100
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              workLifeBalance.qualityOfLifeScore >= 70 ? 'bg-green-500' :
                              workLifeBalance.qualityOfLifeScore >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${workLifeBalance.qualityOfLifeScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Time Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-800 mb-4">Weekly Time Allocation</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Work (including commute)</span>
                          <span className="font-medium">{workLifeBalance.weeklyWorkHours.toFixed(1)} hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Sleep (8 hours/night)</span>
                          <span className="font-medium">56 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Personal time</span>
                          <span className="font-medium">{workLifeBalance.weeklyPersonalHours.toFixed(1)} hours</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center font-medium">
                          <span>Work-to-life ratio</span>
                          <span className={workLifeBalance.workLifeRatio > 1.5 ? 'text-red-600' : 
                                          workLifeBalance.workLifeRatio > 1 ? 'text-yellow-600' : 'text-green-600'}>
                            {workLifeBalance.workLifeRatio.toFixed(2)}:1
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {workLifeBalance.recommendations.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-800 mb-3">⚡ Recommendations</h4>
                        <ul className="space-y-2 text-sm text-yellow-700">
                          {workLifeBalance.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'liberation' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Your Path to Liberation</h3>
                <p className="text-gray-600">Strategic insights for maximizing your earning freedom</p>
              </div>
              
              {liberationAnalysis.insights.length > 0 ? (
                <div className="space-y-4">
                  {liberationAnalysis.insights.map((insight, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Liberation insights will appear as you optimize your wage data.</p>
                </div>
              )}
              
              {/* Time Value Analysis */}
              {liberationAnalysis.timeReclaiming.hoursPerWeek > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-800 mb-4">⏰ Time Reclamation Opportunity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-light text-blue-800">
                        {liberationAnalysis.timeReclaiming.hoursPerWeek.toFixed(1)}
                      </div>
                      <p className="text-blue-600">Hours per week you could reclaim</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-light text-blue-800">
                        {liberationAnalysis.timeReclaiming.hoursPerYear.toFixed(0)}
                      </div>
                      <p className="text-blue-600">Hours per year saved</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-light text-blue-800">
                        ${liberationAnalysis.timeReclaiming.valuePerYear.toLocaleString()}
                      </div>
                      <p className="text-blue-600">Annual value of reclaimed time</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">🚀 Next Steps</h4>
                <div className="text-sm text-green-700 space-y-2">
                  {calculation.realHourlyWage < 15 ? (
                    <>
                      <p>• Your real wage is concerning - prioritize immediate optimization</p>
                      <p>• Negotiate remote work to eliminate commute costs</p>
                      <p>• Use the Runway Calculator to plan a job transition</p>
                    </>
                  ) : calculation.realHourlyWage < 25 ? (
                    <>
                      <p>• You have room for improvement - focus on high-impact changes</p>
                      <p>• Consider freelancing or consulting to boost your effective rate</p>
                      <p>• Evaluate your real wage regularly as you make career moves</p>
                    </>
                  ) : (
                    <>
                      <p>• You're in a strong position - use this as leverage</p>
                      <p>• Consider how to scale your earning efficiency further</p>
                      <p>• Help others discover their real wage truth</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}