'use client';

import React, { useState, useEffect } from 'react';
import {
  calculateRealHourlyWage,
  createDefaultWorkHours,
  createDefaultWorkCosts,
  formatHourlyWage,
  formatWageComparison,
  calculateTimeImpact,
  type RealWageInputs
} from '../core/calculator';
import type { WorkHours, WorkCosts, RealWageCalculation } from '@greenfield/types';

interface RealHourlyWageCalculatorProps {
  className?: string;
  onCalculationChange?: (calculation: RealWageCalculation) => void;
  showPrivacyStatement?: boolean;
}

export function RealHourlyWageCalculator({
  className = '',
  onCalculationChange,
  showPrivacyStatement = true
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

  // Real-time calculation
  useEffect(() => {
    const inputs: RealWageInputs = { annualSalary, workHours, workCosts };
    const newCalculation = calculateRealHourlyWage(inputs);
    setCalculation(newCalculation);
    onCalculationChange?.(newCalculation);
  }, [annualSalary, workHours, workCosts, onCalculationChange]);

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
    </div>
  );
}