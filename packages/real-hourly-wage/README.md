# Real Hourly Wage Calculator 💰

> Shatter the salary illusion - calculate what you're really being paid per hour

[![npm version](https://badge.fury.io/js/%40thegreenfieldoverride%2Freal-hourly-wage.svg)](https://badge.fury.io/js/%40thegreenfieldoverride%2Freal-hourly-wage)
[![License](https://img.shields.io/badge/license-Liberation--1.0-blue.svg)](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md)

That $80k salary sounds impressive until you calculate the **real** hourly wage including unpaid overtime, commuting, work prep, and all the hidden costs. This tool reveals the uncomfortable truth about what you're actually earning per hour.

## 🌟 Features

- **💸 True Hourly Calculation**: Accounts for ALL work-related time and costs
- **🚗 Commute Impact**: See how travel time destroys your hourly rate
- **👔 Work Prep Time**: Includes getting ready, mental prep, decompression
- **💼 Hidden Costs**: Work clothes, meals, equipment, training
- **📊 Reality Check**: Compare advertised vs. actual hourly wage
- **🔒 100% Private**: All calculations happen in your browser

## 🚀 Quick Start

### Installation

```bash
npm install @greenfieldoverride/real-hourly-wage
```

### React Component

```jsx
import { RealHourlyWageCalculator } from '@greenfieldoverride/real-hourly-wage/react';

function MyApp() {
  return (
    <div>
      <h1>What Are You Really Earning?</h1>
      <RealHourlyWageCalculator />
    </div>
  );
}
```

### Core Logic Only

```javascript
import { calculateRealHourlyWage } from '@greenfieldoverride/real-hourly-wage/core';

const result = calculateRealHourlyWage({
  annualSalary: 80000,
  hoursPerWeek: 40,
  weeksPerYear: 50,
  overtimeHoursPerWeek: 5,
  commuteTimePerDay: 60, // minutes
  workPrepTimePerDay: 30, // minutes
  workCosts: {
    commuting: 200,     // monthly
    workClothes: 100,   // monthly  
    workMeals: 300,     // monthly
    equipment: 50       // monthly
  }
});

console.log(result.advertised);  // "$40.00/hour"
console.log(result.actual);      // "$18.50/hour" 
console.log(result.difference);  // "53% less than advertised"
```

## 🔧 API Reference

### calculateRealHourlyWage(params)

**Parameters:**
- `annualSalary` (number): Gross annual salary
- `hoursPerWeek` (number): Contracted hours per week
- `weeksPerYear` (number): Working weeks per year
- `overtimeHoursPerWeek` (number): Average unpaid overtime per week
- `commuteTimePerDay` (number): Daily commute time in minutes
- `workPrepTimePerDay` (number): Daily prep/decompression time in minutes
- `workCosts` (object): Monthly work-related expenses
  - `commuting` (number): Gas, parking, public transport
  - `workClothes` (number): Professional attire
  - `workMeals` (number): Lunches, coffee, work snacks
  - `equipment` (number): Laptop, phone, office supplies

**Returns:**
- `advertised` (string): Advertised hourly wage
- `actual` (string): Real hourly wage after time/costs
- `difference` (string): Percentage difference with context
- `breakdown` (object): Detailed calculation breakdown

## 💡 Real-World Examples

### The $100k Developer
```javascript
const seniorDev = calculateRealHourlyWage({
  annualSalary: 100000,
  hoursPerWeek: 40,
  weeksPerYear: 50,
  overtimeHoursPerWeek: 10,  // Crunch time
  commuteTimePerDay: 90,     // Bay Area commute
  workPrepTimePerDay: 45,    // Coffee, emails, wind-down
  workCosts: {
    commuting: 400,  // Gas + parking
    workClothes: 150,
    workMeals: 500,  // Expensive city
    equipment: 100
  }
});
// Advertised: $50/hour → Actual: $22/hour (56% less!)
```

### The $60k Marketing Manager
```javascript
const marketingMgr = calculateRealHourlyWage({
  annualSalary: 60000,
  hoursPerWeek: 40,
  weeksPerYear: 48,  // Less vacation
  overtimeHoursPerWeek: 8,   // Event planning
  commuteTimePerDay: 45,
  workPrepTimePerDay: 30,
  workCosts: {
    commuting: 250,
    workClothes: 200,  // Client-facing role
    workMeals: 300,
    equipment: 75
  }
});
// Reality check reveals the true cost of that "good" salary
```

## 🎯 Use Cases

- **Salary Negotiation**: Know your true worth before asking for raises
- **Job Comparison**: Compare offers based on real hourly value
- **Career Planning**: See which expenses are killing your wage
- **Remote Work Value**: Calculate savings from working from home
- **Freelance Transition**: Set rates based on your current real wage

## 🔍 What This Tool Reveals

- **The Commute Tax**: How daily travel destroys earning potential
- **Overtime Reality**: Why "salary" often means unpaid labor
- **Hidden Expenses**: The true cost of maintaining employment
- **Time Poverty**: How work bleeds into your entire life
- **Liberation Math**: The financial case for remote/freelance work

## 🤝 Contributing

This tool helps people see through salary illusions. Every improvement helps someone make better career decisions:

1. Fork the repository
2. Create a feature branch
3. Test thoroughly (financial clarity is critical)
4. Submit a pull request

## 📄 License

Licensed under [Liberation License v1.0](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md) - ensuring these tools serve human liberation, not corporate exploitation.

---

*"A salary is just a drug they give you to forget your dreams."*