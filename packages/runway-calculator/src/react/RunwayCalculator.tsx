'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateRunway, 
  createDefaultExpenses, 
  updateExpenseAmount, 
  addExpenseCategory, 
  removeExpenseCategory 
} from '../core/calculator';
import type { ExpenseCategory, RunwayCalculation } from '@greenfield/types';

interface RunwayCalculatorProps {
  className?: string;
  onCalculationChange?: (calculation: RunwayCalculation) => void;
  showPrivacyStatement?: boolean;
}

export function RunwayCalculator({ 
  className = '', 
  onCalculationChange,
  showPrivacyStatement = true 
}: RunwayCalculatorProps) {
  const [expenses, setExpenses] = useState<ExpenseCategory[]>(createDefaultExpenses);
  const [savings, setSavings] = useState<number>(0);
  const [calculation, setCalculation] = useState<RunwayCalculation>({ 
    totalMonthlyExpenses: 0, 
    currentSavings: 0, 
    runwayMonths: 0, 
    runwayDisplay: "0 months" 
  });

  // Real-time calculation
  useEffect(() => {
    const newCalculation = calculateRunway({ expenses, savings });
    setCalculation(newCalculation);
    onCalculationChange?.(newCalculation);
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
    </div>
  );
}