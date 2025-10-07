'use client';

import React, { useState, useEffect } from 'react';
import type { ExpenseCategory, RunwayCalculation } from '@greenfield/types';
import Link from 'next/link';

// Inline calculator for better performance
function RunwayCalculator() {
  const [expenses, setExpenses] = useState<ExpenseCategory[]>([
    { id: '1', name: 'Housing (rent/mortgage)', amount: 0, isEssential: true },
    { id: '2', name: 'Food & groceries', amount: 0, isEssential: true },
    { id: '3', name: 'Utilities', amount: 0, isEssential: true },
    { id: '4', name: 'Insurance (health, auto)', amount: 0, isEssential: true },
    { id: '5', name: 'Transportation', amount: 0, isEssential: true },
    { id: '6', name: 'Phone & internet', amount: 0, isEssential: true },
  ]);
  const [savings, setSavings] = useState<number>(0);
  const [calculation, setCalculation] = useState<RunwayCalculation>({ 
    totalMonthlyExpenses: 0, 
    currentSavings: 0, 
    runwayMonths: 0, 
    runwayDisplay: "0 months" 
  });

  // Real-time calculation
  useEffect(() => {
    const totalMonthlyExpenses = expenses
      .filter(expense => expense.isEssential)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const runwayMonths = totalMonthlyExpenses > 0 ? savings / totalMonthlyExpenses : 0;
    
    let runwayDisplay = "0 months";
    if (runwayMonths < 0.1) runwayDisplay = "Less than a week";
    else if (runwayMonths < 1) {
      const weeks = Math.floor(runwayMonths * 4.33);
      runwayDisplay = weeks === 1 ? "1 week" : `${weeks} weeks`;
    } else {
      const wholeMonths = Math.floor(runwayMonths);
      const remainingWeeks = Math.floor((runwayMonths - wholeMonths) * 4.33);
      
      if (remainingWeeks === 0) {
        runwayDisplay = wholeMonths === 1 ? "1 month" : `${wholeMonths} months`;
      } else {
        const monthStr = wholeMonths === 1 ? "month" : "months";
        const weekStr = remainingWeeks === 1 ? "week" : "weeks";
        runwayDisplay = `${wholeMonths} ${monthStr}, ${remainingWeeks} ${weekStr}`;
      }
    }
    
    setCalculation({
      totalMonthlyExpenses,
      currentSavings: savings,
      runwayMonths,
      runwayDisplay
    });
  }, [expenses, savings]);

  const parseNumericValue = (value: string): number => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const formatDisplayValue = (value: number): string => {
    if (value === 0) return '';
    return value.toLocaleString('en-US');
  };

  const handleExpenseChange = (id: string, amount: string) => {
    const numericAmount = parseNumericValue(amount);
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, amount: numericAmount } : expense
    ));
  };

  const handleSavingsChange = (value: string) => {
    setSavings(parseNumericValue(value));
  };

  return (
    <div className="runway-calculator">
      {/* Privacy Statement */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-green-800">
          🔒 <strong>Your data is yours.</strong> Everything stays in your browser. 
          We don't store, track, or share anything.
        </p>
      </div>

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
            </div>
          ))}
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
    </div>
  );
}

export default function RunwayCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/tools" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
            ← Back to Tools
          </Link>
        </nav>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🛣️</span>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Runway Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your financial anxiety into clarity. Calculate exactly how long 
            your savings will last and build confidence in your path to freedom.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          <RunwayCalculator />
        </div>

        {/* Next Steps */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">
            What's Next?
          </h2>
          <p className="text-gray-600 mb-6">
            Now that you know your runway, discover what you're really earning per hour.
          </p>
          <Link 
            href="/tools/real-hourly-wage"
            className="inline-flex items-center bg-gray-700 text-white px-8 py-4 rounded-2xl hover:bg-gray-600 transition-all duration-300 font-light shadow-sm hover:shadow-md"
          >
            Calculate Your Real Hourly Wage →
          </Link>
        </div>
      </div>
    </div>
  );
}