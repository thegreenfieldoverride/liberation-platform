'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateRunway, 
  createDefaultExpenses, 
  updateExpenseAmount, 
  addExpenseCategory, 
  removeExpenseCategory,
  type RunwayScenario,
  type StressTestScenario
} from '../core/calculator';
import type { ExpenseCategory, RunwayCalculation } from '@greenfieldoverride/types';

interface RunwayCalculatorProps {
  className?: string;
  onCalculationChange?: (calculation: RunwayCalculation) => void;
  showPrivacyStatement?: boolean;
  showAdvancedFeatures?: boolean;
}

export function RunwayCalculator({ 
  className = '', 
  onCalculationChange,
  showPrivacyStatement = true,
  showAdvancedFeatures = true
}: RunwayCalculatorProps) {
  const [expenses, setExpenses] = useState<ExpenseCategory[]>(createDefaultExpenses);
  const [savings, setSavings] = useState<number>(0);
  const [calculation, setCalculation] = useState<RunwayCalculation>({ 
    totalMonthlyExpenses: 0, 
    currentSavings: 0, 
    runwayMonths: 0, 
    runwayDisplay: "0 months" 
  });
  const [showScenarios, setShowScenarios] = useState(false);
  const [showStressTests, setShowStressTests] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'scenarios' | 'stress' | 'insights'>('basic');

  // Real-time calculation
  useEffect(() => {
    const newCalculation = calculateRunway({ expenses, savings });
    setCalculation(newCalculation);
    onCalculationChange?.(newCalculation);
    
    // Broadcast data for AI Dashboard integration
    if (typeof window !== 'undefined' && newCalculation.runwayMonths > 0) {
      const event = new CustomEvent('liberation-data-update', {
        detail: {
          tool: 'runway',
          data: {
            runwayMonths: newCalculation.runwayMonths,
            savings: savings,
            monthlyExpenses: newCalculation.totalMonthlyExpenses
          }
        }
      });
      window.dispatchEvent(event);
    }
  }, [expenses, savings, onCalculationChange]);

  const parseNumericValue = (value: string): number => {
    // Remove commas, dollar signs, and other non-numeric characters except decimal points
    const cleaned = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const formatDisplayValue = (value: number): string => {
    if (value === 0) return '';
    return value.toLocaleString('en-US');
  };

  const handleExpenseChange = (id: string, amount: string) => {
    const numericAmount = parseNumericValue(amount);
    setExpenses(prev => updateExpenseAmount(prev, id, numericAmount));
  };

  const handleSavingsChange = (value: string) => {
    setSavings(parseNumericValue(value));
  };

  const handleAddExpense = () => {
    const name = prompt("What's this expense category?");
    if (name) {
      setExpenses(prev => addExpenseCategory(prev, name, true));
    }
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(prev => removeExpenseCategory(prev, id));
  };

  return (
    <div className={`runway-calculator ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          Your Runway Calculator
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Transform your financial anxiety into a clear, achievable number. 
          This is your path to freedom.
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

      {/* Monthly Expenses */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Monthly Essential Expenses
        </h2>
        <div className="space-y-3">
          {expenses.map(expense => (
            <div key={expense.id} className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">
                  {expense.name}
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(expense.amount)}
                  onChange={(e) => handleExpenseChange(expense.id, e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {expenses.length > 1 && (
                <button
                  onClick={() => handleRemoveExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={handleAddExpense}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Add another expense
          </button>
        </div>
      </div>

      {/* Current Savings */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Current Liquid Savings
        </h2>
        <input
          type="text"
          value={formatDisplayValue(savings)}
          onChange={(e) => handleSavingsChange(e.target.value)}
          placeholder="0"
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Money you can access immediately for your transition
        </p>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Your runway to freedom:</p>
          <div className="text-4xl font-light text-gray-800 mb-4">
            {calculation.runwayDisplay}
          </div>
          <p className="text-gray-600">
            Real Number: <span className="font-medium">${calculation.totalMonthlyExpenses.toLocaleString()}/month</span>
          </p>
          {calculation.runwayMonths > 0 && (
            <p className="text-sm text-green-700 mt-3">
              {calculation.runwayMonths >= 6 
                ? "You have solid breathing room to plan your next move." 
                : calculation.runwayMonths >= 3
                ? "You have time to build your escape plan."
                : "Every day you take action is a day closer to freedom."
              }
            </p>
          )}
        </div>
      </div>

      {/* Advanced Features */}
      {showAdvancedFeatures && calculation.runwayMonths > 0 && (
        <div className="mt-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'basic', label: 'Basic Results', icon: '📊' },
                { id: 'scenarios', label: 'Liberation Scenarios', icon: '🎯' },
                { id: 'stress', label: 'Stress Testing', icon: '⚠️' },
                { id: 'insights', label: 'Strategic Insights', icon: '🧠' }
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
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-600">Basic runway information shown above.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Explore the other tabs for advanced liberation planning features.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Liberation Scenarios</h3>
                <p className="text-gray-600">Different pathways to freedom with your current savings</p>
              </div>
              
              {calculation.scenarios?.map((scenario: RunwayScenario, index: number) => (
                <div key={scenario.name} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{scenario.name}</h4>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-gray-800">{scenario.runwayDisplay}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        scenario.viability === 'excellent' ? 'bg-green-100 text-green-800' :
                        scenario.viability === 'good' ? 'bg-blue-100 text-blue-800' :
                        scenario.viability === 'challenging' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {scenario.viability}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">
                      <span className="font-medium">Monthly expenses:</span> ${scenario.monthlyExpenses.toLocaleString()}
                    </p>
                    {scenario.insights.length > 0 && (
                      <div>
                        <span className="font-medium">Key insights:</span>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                          {scenario.insights.slice(0, 2).map((insight, i) => (
                            <li key={i}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stress' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Stress Testing</h3>
                <p className="text-gray-600">How your runway holds up under challenging scenarios</p>
              </div>
              
              {calculation.stressTests?.map((test: StressTestScenario, index: number) => (
                <div key={test.name} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800 flex items-center gap-2">
                        {test.name}
                        {test.expenseIncrease > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            +{test.expenseIncrease}% costs
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{test.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-red-700">{test.runwayDisplay}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    <p className="bg-gray-50 p-3 rounded">{test.impact}</p>
                  </div>
                </div>
              ))}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Stress Test Insights</h4>
                <p className="text-sm text-yellow-700">
                  These scenarios help you understand vulnerabilities in your liberation plan. 
                  Consider building additional buffers if stress tests show concerning results.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Strategic Liberation Insights</h3>
                <p className="text-gray-600">AI-powered guidance for your path to freedom</p>
              </div>
              
              {calculation.insights && calculation.insights.length > 0 ? (
                <div className="space-y-4">
                  {calculation.insights.map((insight: string, index: number) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Strategic insights will appear as you refine your runway calculation.</p>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">🚀 Next Steps</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  {calculation.runwayMonths >= 12 ? (
                    <>
                      <p>• You're in an excellent position to make strategic career moves</p>
                      <p>• Consider exploring the Real Hourly Wage calculator to optimize your current income</p>
                      <p>• Use the Cognitive Debt Assessment to ensure you're in the right mental state for decisions</p>
                    </>
                  ) : calculation.runwayMonths >= 6 ? (
                    <>
                      <p>• Start networking and building relationships in your target field</p>
                      <p>• Practice the "lean transition" lifestyle to extend your runway</p>
                      <p>• Consider building part-time income streams before making the leap</p>
                    </>
                  ) : (
                    <>
                      <p>• Focus on building your emergency fund before making career changes</p>
                      <p>• Look for ways to reduce essential expenses</p>
                      <p>• Assess your real hourly wage to see if job changes could improve your situation</p>
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