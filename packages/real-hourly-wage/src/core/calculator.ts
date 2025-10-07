/**
 * Real Hourly Wage Calculator - Reveals true compensation reality
 * Exposes the hidden costs of employment and corporate time extraction
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { WorkHours, WorkCosts, RealWageCalculation } from '@greenfield/types';

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