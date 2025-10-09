/**
 * Runway Calculator - Core liberation planning logic
 * Transforms financial anxiety into clear runway calculations for corporate escape
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { ExpenseCategory, RunwayCalculation, RunwayInputs } from '@thegreenfieldoverride/types';

/**
 * Core runway calculation logic - framework agnostic
 * This is the "red pill" calculation that transforms anxiety into clarity
 */

export function calculateRunway(inputs: RunwayInputs): RunwayCalculation {
  const { expenses, savings } = inputs;
  
  // Sum essential expenses for the "Real Number"
  const essentialExpenses = expenses
    .filter(expense => expense.isEssential)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Sum all expenses for comparison
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate different scenarios
  const scenarios = calculateRunwayScenarios(savings, essentialExpenses, totalExpenses);
  
  // Main runway calculation (essential only)
  const runwayMonths = essentialExpenses > 0 ? savings / essentialExpenses : 0;
  const runwayDisplay = formatRunwayDisplay(runwayMonths);
  
  // Calculate stress testing scenarios
  const stressTests = calculateStressTestScenarios(savings, essentialExpenses);
  
  return {
    totalMonthlyExpenses: essentialExpenses,
    currentSavings: savings,
    runwayMonths,
    runwayDisplay,
    scenarios,
    stressTests,
    insights: generateRunwayInsights(runwayMonths, scenarios, stressTests)
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

/**
 * Advanced Runway Scenarios - Different liberation pathways
 */
export interface RunwayScenario {
  name: string;
  description: string;
  monthlyExpenses: number;
  runwayMonths: number;
  runwayDisplay: string;
  viability: 'excellent' | 'good' | 'challenging' | 'risky';
  insights: string[];
}

export interface StressTestScenario {
  name: string;
  description: string;
  expenseIncrease: number;
  newRunwayMonths: number;
  runwayDisplay: string;
  impact: string;
}

export function calculateRunwayScenarios(savings: number, essentialExpenses: number, totalExpenses: number): RunwayScenario[] {
  const scenarios: RunwayScenario[] = [];
  
  // Scenario 1: Bare Minimum (Essential only)
  const bareMinimumMonths = essentialExpenses > 0 ? savings / essentialExpenses : 0;
  scenarios.push({
    name: 'Bare Minimum',
    description: 'Essential expenses only - maximum runway',
    monthlyExpenses: essentialExpenses,
    runwayMonths: bareMinimumMonths,
    runwayDisplay: formatRunwayDisplay(bareMinimumMonths),
    viability: bareMinimumMonths >= 12 ? 'excellent' : bareMinimumMonths >= 6 ? 'good' : bareMinimumMonths >= 3 ? 'challenging' : 'risky',
    insights: generateScenarioInsights('bare_minimum', bareMinimumMonths)
  });
  
  // Scenario 2: Current Lifestyle (All expenses)
  const currentLifestyleMonths = totalExpenses > 0 ? savings / totalExpenses : 0;
  scenarios.push({
    name: 'Current Lifestyle',
    description: 'Maintaining all current spending habits',
    monthlyExpenses: totalExpenses,
    runwayMonths: currentLifestyleMonths,
    runwayDisplay: formatRunwayDisplay(currentLifestyleMonths),
    viability: currentLifestyleMonths >= 12 ? 'excellent' : currentLifestyleMonths >= 6 ? 'good' : currentLifestyleMonths >= 3 ? 'challenging' : 'risky',
    insights: generateScenarioInsights('current_lifestyle', currentLifestyleMonths)
  });
  
  // Scenario 3: Lean Transition (80% of essential)
  const leanExpenses = essentialExpenses * 0.8;
  const leanMonths = leanExpenses > 0 ? savings / leanExpenses : 0;
  scenarios.push({
    name: 'Lean Transition',
    description: 'Optimized essential expenses - aggressive cost cutting',
    monthlyExpenses: leanExpenses,
    runwayMonths: leanMonths,
    runwayDisplay: formatRunwayDisplay(leanMonths),
    viability: leanMonths >= 18 ? 'excellent' : leanMonths >= 9 ? 'good' : leanMonths >= 6 ? 'challenging' : 'risky',
    insights: generateScenarioInsights('lean_transition', leanMonths)
  });
  
  // Scenario 4: Partial Income Bridge (50% income replacement)
  const bridgeExpenses = totalExpenses * 0.5; // Assuming 50% income covers 50% expenses
  const bridgeMonths = bridgeExpenses > 0 ? savings / bridgeExpenses : 0;
  scenarios.push({
    name: 'Income Bridge',
    description: 'With part-time work or consulting income (50% replacement)',
    monthlyExpenses: bridgeExpenses,
    runwayMonths: bridgeMonths,
    runwayDisplay: formatRunwayDisplay(bridgeMonths),
    viability: bridgeMonths >= 24 ? 'excellent' : bridgeMonths >= 12 ? 'good' : bridgeMonths >= 6 ? 'challenging' : 'risky',
    insights: generateScenarioInsights('income_bridge', bridgeMonths)
  });
  
  return scenarios;
}

export function calculateStressTestScenarios(savings: number, essentialExpenses: number): StressTestScenario[] {
  const scenarios: StressTestScenario[] = [];
  
  // Economic downturn (20% expense increase)
  const downturnExpenses = essentialExpenses * 1.2;
  const downturnMonths = downturnExpenses > 0 ? savings / downturnExpenses : 0;
  scenarios.push({
    name: 'Economic Downturn',
    description: 'Inflation and economic uncertainty increase costs by 20%',
    expenseIncrease: 20,
    newRunwayMonths: downturnMonths,
    runwayDisplay: formatRunwayDisplay(downturnMonths),
    impact: calculateImpactDescription(essentialExpenses > 0 ? savings / essentialExpenses : 0, downturnMonths)
  });
  
  // Health emergency (50% expense increase)
  const healthExpenses = essentialExpenses * 1.5;
  const healthMonths = healthExpenses > 0 ? savings / healthExpenses : 0;
  scenarios.push({
    name: 'Health Emergency',
    description: 'Unexpected health costs increase expenses by 50%',
    expenseIncrease: 50,
    newRunwayMonths: healthMonths,
    runwayDisplay: formatRunwayDisplay(healthMonths),
    impact: calculateImpactDescription(essentialExpenses > 0 ? savings / essentialExpenses : 0, healthMonths)
  });
  
  // Job market crash (double timeline)
  const baseMonths = essentialExpenses > 0 ? savings / essentialExpenses : 0;
  const crashMonths = baseMonths; // Same months but need to double timeline
  scenarios.push({
    name: 'Job Market Crash',
    description: 'Finding new work takes twice as long as expected',
    expenseIncrease: 0,
    newRunwayMonths: crashMonths / 2, // Effectively half the runway
    runwayDisplay: formatRunwayDisplay(crashMonths / 2),
    impact: `If job search takes twice as long, you'd need ${formatRunwayDisplay(baseMonths * 2)} runway`
  });
  
  return scenarios;
}

function generateScenarioInsights(scenario: string, months: number): string[] {
  const insights: string[] = [];
  
  switch (scenario) {
    case 'bare_minimum':
      if (months >= 12) {
        insights.push('Excellent runway for a career transition');
        insights.push('You have breathing room to be selective about opportunities');
      } else if (months >= 6) {
        insights.push('Good foundation for a job search');
        insights.push('Start networking and planning before you quit');
      } else {
        insights.push('Build more savings before making the leap');
        insights.push('Consider reducing expenses further');
      }
      break;
      
    case 'current_lifestyle':
      if (months < 6) {
        insights.push('Current lifestyle significantly reduces your runway');
        insights.push('Identify which expenses you can cut during transition');
      } else {
        insights.push('You can maintain comfort during your transition');
        insights.push('Consider if all expenses are worth the shortened runway');
      }
      break;
      
    case 'lean_transition':
      insights.push('Aggressive cost-cutting extends your runway significantly');
      insights.push('Practice this lifestyle before making the transition');
      if (months >= 18) {
        insights.push('This runway gives you excellent negotiating power');
      }
      break;
      
    case 'income_bridge':
      insights.push('Part-time income dramatically extends your freedom');
      insights.push('Start building income streams before you quit');
      if (months >= 24) {
        insights.push('This scenario provides excellent long-term sustainability');
      }
      break;
  }
  
  return insights;
}

function calculateImpactDescription(baseMonths: number, newMonths: number): string {
  const reduction = baseMonths - newMonths;
  const percentReduction = baseMonths > 0 ? (reduction / baseMonths) * 100 : 0;
  
  if (percentReduction >= 30) {
    return `Severely impacts your runway - reduces it by ${formatRunwayDisplay(reduction)}`;
  } else if (percentReduction >= 15) {
    return `Significantly impacts your runway - reduces it by ${formatRunwayDisplay(reduction)}`;
  } else {
    return `Manageable impact - reduces runway by ${formatRunwayDisplay(reduction)}`;
  }
}

export function generateRunwayInsights(baseMonths: number, scenarios: RunwayScenario[], stressTests: StressTestScenario[]): string[] {
  const insights: string[] = [];
  
  // Overall assessment
  if (baseMonths >= 18) {
    insights.push('🎯 Excellent financial position for career freedom');
    insights.push('💪 You have significant leverage in job negotiations');
  } else if (baseMonths >= 12) {
    insights.push('✅ Good runway for a thoughtful career transition');
    insights.push('📈 Consider building additional savings for more options');
  } else if (baseMonths >= 6) {
    insights.push('⚠️ Adequate runway but requires careful planning');
    insights.push('🎯 Focus on networking and opportunities before quitting');
  } else if (baseMonths >= 3) {
    insights.push('🚨 Limited runway - high risk for career changes');
    insights.push('💡 Build emergency fund before making any moves');
  } else {
    insights.push('🆘 Critical - no financial cushion for career changes');
    insights.push('🏃‍♂️ Focus entirely on building savings first');
  }
  
  // Scenario comparisons
  const bareMinimum = scenarios.find(s => s.name === 'Bare Minimum');
  const currentLifestyle = scenarios.find(s => s.name === 'Current Lifestyle');
  
  if (bareMinimum && currentLifestyle) {
    const difference = bareMinimum.runwayMonths - currentLifestyle.runwayMonths;
    if (difference >= 6) {
      insights.push(`💰 Cutting non-essentials extends your runway by ${formatRunwayDisplay(difference)}`);
    }
  }
  
  // Stress test warnings
  const severeStressTest = stressTests.find(st => st.expenseIncrease >= 50);
  if (severeStressTest && severeStressTest.newRunwayMonths < 3) {
    insights.push('🚨 Vulnerable to unexpected expenses - build larger emergency fund');
  }
  
  // Income bridge opportunity
  const incomebridge = scenarios.find(s => s.name === 'Income Bridge');
  if (incomebridge && incomebridge.runwayMonths >= baseMonths * 2) {
    insights.push('🌟 Part-time income could double+ your runway - explore consulting/freelance');
  }
  
  return insights;
}