/**
 * Real Hourly Wage Calculator - Reveals true compensation reality
 * Exposes the hidden costs of employment and corporate time extraction
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { WorkHours, WorkCosts, RealWageCalculation } from '@thegreenfieldoverride/types';

/**
 * Real Hourly Wage calculation logic - the "red pill" for salary illusions
 * This exposes the hidden costs of employment and reveals true compensation
 */

export interface RealWageInputs {
  annualSalary: number;
  workHours: WorkHours;
  workCosts: WorkCosts;
}

export function calculateRealHourlyWage(inputs: RealWageInputs): RealWageCalculation {
  const { annualSalary, workHours, workCosts } = inputs;
  
  // Calculate stated hourly wage (based on 40-hour week illusion)
  const statedHourlyWage = annualSalary / (40 * 52);
  
  // Calculate real weekly hours including commute
  const commuteHoursPerWeek = (workHours.commuteDailyMinutes / 60) * workHours.workDaysPerWeek;
  const totalWeeklyHours = workHours.weeklyHours + commuteHoursPerWeek;
  const totalMonthlyHours = totalWeeklyHours * 4.33; // Average weeks per month
  
  // Calculate total monthly work costs
  const totalMonthlyCosts = 
    workCosts.commuteMonthlyCost +
    workCosts.workLunchesMonthlyCost +
    workCosts.workClothingMonthlyCost +
    workCosts.stressSpendingMonthlyCost;
  
  // Calculate real monthly income after work costs
  const grossMonthlyIncome = annualSalary / 12;
  const realMonthlyIncome = grossMonthlyIncome - totalMonthlyCosts;
  
  // Calculate real hourly wage
  const realHourlyWage = totalMonthlyHours > 0 ? realMonthlyIncome / totalMonthlyHours : 0;
  
  return {
    statedHourlyWage,
    realHourlyWage,
    monthlyRealIncome: realMonthlyIncome,
    totalMonthlyHours
  };
}

export function createDefaultWorkHours(): WorkHours {
  return {
    weeklyHours: 40,
    commuteDailyMinutes: 30, // 15 minutes each way
    workDaysPerWeek: 5
  };
}

export function createDefaultWorkCosts(): WorkCosts {
  return {
    commuteMonthlyCost: 0,
    workLunchesMonthlyCost: 0,
    workClothingMonthlyCost: 0,
    stressSpendingMonthlyCost: 0
  };
}

export function formatHourlyWage(wage: number): string {
  return `$${wage.toFixed(2)}`;
}

export function formatWageComparison(stated: number, real: number): {
  difference: number;
  percentageReduction: number;
  message: string;
} {
  const difference = stated - real;
  const percentageReduction = stated > 0 ? (difference / stated) * 100 : 0;
  
  let message = "";
  if (percentageReduction >= 50) {
    message = "Your real wage is less than half of what you thought. This is the hidden cost of your job.";
  } else if (percentageReduction >= 30) {
    message = "You're losing nearly a third of your stated wage to hidden costs. Time to reevaluate.";
  } else if (percentageReduction >= 15) {
    message = "The hidden costs are eating into your compensation more than you realized.";
  } else if (percentageReduction > 0) {
    message = "Even small hidden costs add up. Every dollar matters on your journey to freedom.";
  } else {
    message = "You're doing well at minimizing work-related costs!";
  }
  
  return {
    difference,
    percentageReduction,
    message
  };
}

export function calculateTimeImpact(weeklyHours: number, commuteDailyMinutes: number, workDaysPerWeek: number): {
  hoursPerWeek: number;
  hoursPerMonth: number;
  hoursPerYear: number;
  daysPerYear: number;
} {
  const commuteHoursPerWeek = (commuteDailyMinutes / 60) * workDaysPerWeek;
  const totalWeeklyHours = weeklyHours + commuteHoursPerWeek;
  const hoursPerMonth = totalWeeklyHours * 4.33;
  const hoursPerYear = totalWeeklyHours * 52;
  const daysPerYear = hoursPerYear / 24;
  
  return {
    hoursPerWeek: totalWeeklyHours,
    hoursPerMonth,
    hoursPerYear,
    daysPerYear
  };
}

/**
 * Enhanced Real Wage Analysis - Multiple scenarios and liberation insights
 */
export interface WageScenario {
  name: string;
  description: string;
  hourlyWage: number;
  monthlyIncome: number;
  annualIncome: number;
  timeValue: string;
  liberationPotential: 'high' | 'medium' | 'low';
}

export interface WageLiberation {
  currentScenario: WageScenario;
  remoteWorkScenario: WageScenario;
  freelanceScenario: WageScenario;
  optimizedScenario: WageScenario;
  insights: string[];
  timeReclaiming: {
    hoursPerWeek: number;
    hoursPerYear: number;
    valuePerYear: number;
  };
}

export function calculateWageLiberation(inputs: RealWageInputs): WageLiberation {
  const baseCalculation = calculateRealHourlyWage(inputs);
  
  // Current scenario
  const currentScenario: WageScenario = {
    name: 'Current Employment',
    description: 'Your current work situation with all costs included',
    hourlyWage: baseCalculation.realHourlyWage,
    monthlyIncome: baseCalculation.monthlyRealIncome,
    annualIncome: baseCalculation.monthlyRealIncome * 12,
    timeValue: `${baseCalculation.totalMonthlyHours.toFixed(1)} hours/month`,
    liberationPotential: baseCalculation.realHourlyWage >= 25 ? 'high' : baseCalculation.realHourlyWage >= 15 ? 'medium' : 'low'
  };
  
  // Remote work scenario (eliminate commute)
  const remoteInputs = {
    ...inputs,
    workHours: {
      ...inputs.workHours,
      commuteDailyMinutes: 0
    },
    workCosts: {
      ...inputs.workCosts,
      commuteMonthlyCost: 0,
      workLunchesMonthlyCost: inputs.workCosts.workLunchesMonthlyCost * 0.3 // Reduced lunch costs
    }
  };
  const remoteCalculation = calculateRealHourlyWage(remoteInputs);
  
  const remoteScenario: WageScenario = {
    name: 'Remote Work',
    description: 'Eliminate commute and reduce work-related costs',
    hourlyWage: remoteCalculation.realHourlyWage,
    monthlyIncome: remoteCalculation.monthlyRealIncome,
    annualIncome: remoteCalculation.monthlyRealIncome * 12,
    timeValue: `${remoteCalculation.totalMonthlyHours.toFixed(1)} hours/month`,
    liberationPotential: 'high'
  };
  
  // Freelance scenario (higher hourly rate, but more uncertainty)
  const freelanceHourlyRate = baseCalculation.statedHourlyWage * 1.5; // 50% premium for freelance
  const freelanceMonthlyHours = inputs.workHours.weeklyHours * 4.33; // No commute
  const freelanceMonthlyIncome = (freelanceHourlyRate * freelanceMonthlyHours) * 0.75; // Account for gaps
  
  const freelanceScenario: WageScenario = {
    name: 'Freelance/Consulting',
    description: 'Higher rates but variable income and self-employment costs',
    hourlyWage: freelanceMonthlyIncome / freelanceMonthlyHours,
    monthlyIncome: freelanceMonthlyIncome,
    annualIncome: freelanceMonthlyIncome * 12,
    timeValue: `${freelanceMonthlyHours.toFixed(1)} hours/month`,
    liberationPotential: 'high'
  };
  
  // Optimized scenario (reduced costs + remote)
  const optimizedInputs = {
    ...inputs,
    workHours: {
      ...inputs.workHours,
      commuteDailyMinutes: 0,
      weeklyHours: inputs.workHours.weeklyHours * 0.9 // 10% more efficient
    },
    workCosts: {
      commuteMonthlyCost: 0,
      workLunchesMonthlyCost: inputs.workCosts.workLunchesMonthlyCost * 0.2,
      workClothingMonthlyCost: inputs.workCosts.workClothingMonthlyCost * 0.3,
      stressSpendingMonthlyCost: inputs.workCosts.stressSpendingMonthlyCost * 0.5
    }
  };
  const optimizedCalculation = calculateRealHourlyWage(optimizedInputs);
  
  const optimizedScenario: WageScenario = {
    name: 'Optimized Employment',
    description: 'Best case improvements to current employment',
    hourlyWage: optimizedCalculation.realHourlyWage,
    monthlyIncome: optimizedCalculation.monthlyRealIncome,
    annualIncome: optimizedCalculation.monthlyRealIncome * 12,
    timeValue: `${optimizedCalculation.totalMonthlyHours.toFixed(1)} hours/month`,
    liberationPotential: 'medium'
  };
  
  // Time reclaiming analysis
  const timeReclaiming = {
    hoursPerWeek: (baseCalculation.totalMonthlyHours - remoteCalculation.totalMonthlyHours) / 4.33,
    hoursPerYear: (baseCalculation.totalMonthlyHours - remoteCalculation.totalMonthlyHours) * 12,
    valuePerYear: ((remoteCalculation.monthlyRealIncome - baseCalculation.monthlyRealIncome) * 12) + 
                  ((baseCalculation.totalMonthlyHours - remoteCalculation.totalMonthlyHours) * 12 * baseCalculation.realHourlyWage)
  };
  
  const insights = generateWageInsights(currentScenario, [remoteScenario, freelanceScenario, optimizedScenario], timeReclaiming);
  
  return {
    currentScenario,
    remoteWorkScenario: remoteScenario,
    freelanceScenario,
    optimizedScenario,
    insights,
    timeReclaiming
  };
}

function generateWageInsights(current: WageScenario, alternatives: WageScenario[], timeReclaiming: any): string[] {
  const insights: string[] = [];
  
  // Current wage assessment
  if (current.hourlyWage < 10) {
    insights.push('🚨 Your real hourly wage is critically low - below minimum wage in most areas');
    insights.push('💡 Every hour of unpaid overtime costs you significantly');
  } else if (current.hourlyWage < 15) {
    insights.push('⚠️ Your real hourly wage is concerning - hidden costs are eating your income');
    insights.push('🎯 Focus on reducing work-related expenses and time commitments');
  } else if (current.hourlyWage < 25) {
    insights.push('📊 Your real wage is moderate but has room for improvement');
    insights.push('🚀 Small optimizations could significantly boost your effective income');
  } else {
    insights.push('✅ Your real hourly wage is strong - you have good earning efficiency');
    insights.push('💪 You\'re in a position to make strategic career moves');
  }
  
  // Alternative scenario insights
  const remote = alternatives.find(a => a.name === 'Remote Work');
  if (remote && remote.hourlyWage > current.hourlyWage * 1.2) {
    insights.push(`🏠 Remote work could increase your real wage by $${(remote.hourlyWage - current.hourlyWage).toFixed(2)}/hour`);
    insights.push('🎯 Negotiate remote work or seek remote-friendly employers');
  }
  
  const freelance = alternatives.find(a => a.name === 'Freelance/Consulting');
  if (freelance && freelance.hourlyWage > current.hourlyWage * 1.3) {
    insights.push(`💼 Freelancing could boost your effective rate by $${(freelance.hourlyWage - current.hourlyWage).toFixed(2)}/hour`);
    insights.push('🌟 Consider building skills and reputation for independent work');
  }
  
  // Time value insights
  if (timeReclaiming.hoursPerWeek >= 10) {
    insights.push(`⏰ You could reclaim ${timeReclaiming.hoursPerWeek.toFixed(1)} hours per week through remote work`);
    insights.push(`💰 This time is worth $${timeReclaiming.valuePerYear.toFixed(0)} per year in opportunity cost`);
  }
  
  // Liberation potential
  if (current.liberationPotential === 'low') {
    insights.push('🚨 Current situation limits your career freedom - focus on skill building');
    insights.push('📈 Increase your value before making major career moves');
  } else if (current.liberationPotential === 'medium') {
    insights.push('🎯 You have moderate career flexibility - plan strategically');
    insights.push('🚀 Small improvements could unlock significantly more options');
  } else {
    insights.push('🌟 You have excellent career leverage - you can be selective');
    insights.push('💪 Your earning efficiency gives you negotiating power');
  }
  
  return insights;
}

export function calculateWorkLifeBalance(inputs: RealWageInputs): {
  workLifeRatio: number;
  weeklyWorkHours: number;
  weeklyPersonalHours: number;
  qualityOfLifeScore: number;
  recommendations: string[];
} {
  const timeImpact = calculateTimeImpact(
    inputs.workHours.weeklyHours,
    inputs.workHours.commuteDailyMinutes,
    inputs.workHours.workDaysPerWeek
  );
  
  const weeklyWorkHours = timeImpact.hoursPerWeek;
  const weeklyPersonalHours = 168 - weeklyWorkHours - (7 * 8); // Total hours - work - sleep
  const workLifeRatio = weeklyWorkHours / weeklyPersonalHours;
  
  // Quality of life scoring (0-100)
  let qualityScore = 100;
  if (weeklyWorkHours > 50) qualityScore -= 30;
  else if (weeklyWorkHours > 45) qualityScore -= 15;
  
  if (inputs.workHours.commuteDailyMinutes > 60) qualityScore -= 20;
  else if (inputs.workHours.commuteDailyMinutes > 30) qualityScore -= 10;
  
  if (inputs.workCosts.stressSpendingMonthlyCost > 200) qualityScore -= 15;
  
  const recommendations: string[] = [];
  
  if (weeklyWorkHours > 50) {
    recommendations.push('🚨 Excessive work hours - negotiate better boundaries');
  }
  if (inputs.workHours.commuteDailyMinutes > 45) {
    recommendations.push('🚗 Long commute is stealing your life - consider relocation or remote work');
  }
  if (workLifeRatio > 1.5) {
    recommendations.push('⚖️ Work is dominating your life - reassess priorities');
  }
  if (qualityScore < 50) {
    recommendations.push('🆘 Critical work-life imbalance - immediate changes needed');
  }
  
  return {
    workLifeRatio,
    weeklyWorkHours,
    weeklyPersonalHours,
    qualityOfLifeScore: Math.max(0, qualityScore),
    recommendations
  };
}