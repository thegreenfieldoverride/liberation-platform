/**
 * Runway Calculator - Core liberation planning logic
 * Transforms financial anxiety into clear runway calculations for corporate escape
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { ExpenseCategory, RunwayCalculation, RunwayInputs } from '@greenfield/types';

/**
 * Core runway calculation logic - framework agnostic
 * This is the "red pill" calculation that transforms anxiety into clarity
 */

export function calculateRunway(inputs: RunwayInputs): RunwayCalculation {
  const { expenses, savings } = inputs;
  
  // Sum only essential expenses for the "Real Number"
  const totalMonthlyExpenses = expenses
    .filter(expense => expense.isEssential)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate runway in months
  const runwayMonths = totalMonthlyExpenses > 0 ? savings / totalMonthlyExpenses : 0;
  
  // Format for hopeful display
  const runwayDisplay = formatRunwayDisplay(runwayMonths);
  
  return {
    totalMonthlyExpenses,
    currentSavings: savings,
    runwayMonths,
    runwayDisplay
  };
}

export function formatRunwayDisplay(months: number): string {
  if (months < 0.1) return "Less than a week";
  if (months < 1) {
    const weeks = Math.floor(months * 4.33);
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  }
  
  const wholeMonths = Math.floor(months);
  const remainingWeeks = Math.floor((months - wholeMonths) * 4.33);
  
  if (remainingWeeks === 0) {
    return wholeMonths === 1 ? "1 month" : `${wholeMonths} months`;
  }
  
  const monthStr = wholeMonths === 1 ? "month" : "months";
  const weekStr = remainingWeeks === 1 ? "week" : "weeks";
  
  return `${wholeMonths} ${monthStr}, ${remainingWeeks} ${weekStr}`;
}

export function createDefaultExpenses(): ExpenseCategory[] {
  return [
    { id: '1', name: 'Housing (rent/mortgage)', amount: 0, isEssential: true },
    { id: '2', name: 'Food & groceries', amount: 0, isEssential: true },
    { id: '3', name: 'Utilities', amount: 0, isEssential: true },
    { id: '4', name: 'Insurance (health, auto)', amount: 0, isEssential: true },
    { id: '5', name: 'Transportation', amount: 0, isEssential: true },
    { id: '6', name: 'Phone & internet', amount: 0, isEssential: true },
    { id: '7', name: 'Essential subscriptions', amount: 0, isEssential: true }
  ];
}

export function addExpenseCategory(
  expenses: ExpenseCategory[], 
  name: string, 
  isEssential: boolean = true
): ExpenseCategory[] {
  const newExpense: ExpenseCategory = {
    id: Date.now().toString(),
    name,
    amount: 0,
    isEssential
  };
  
  return [...expenses, newExpense];
}

export function updateExpenseAmount(
  expenses: ExpenseCategory[], 
  id: string, 
  amount: number
): ExpenseCategory[] {
  return expenses.map(expense => 
    expense.id === id ? { ...expense, amount } : expense
  );
}

export function removeExpenseCategory(
  expenses: ExpenseCategory[], 
  id: string
): ExpenseCategory[] {
  return expenses.filter(expense => expense.id !== id);
}