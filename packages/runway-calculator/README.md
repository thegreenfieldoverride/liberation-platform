# Runway Calculator 🚀

> Transform financial anxiety into clarity - calculate your runway to freedom

[![npm version](https://badge.fury.io/js/%40thegreenfieldoverride%2Frunway-calculator.svg)](https://badge.fury.io/js/%40thegreenfieldoverride%2Frunway-calculator)
[![License](https://img.shields.io/badge/license-Liberation--1.0-blue.svg)](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md)

Stop wondering "How long could I survive without my job?" and start knowing. The Runway Calculator turns your financial anxiety into actionable clarity, showing exactly how long your savings will last and what you need to achieve freedom.

## 🌟 Features

- **🎯 Crystal Clear Results**: "6 months, 2 weeks" instead of vague numbers
- **🔒 100% Private**: All calculations happen in your browser
- **⚡ Lightning Fast**: Instant results as you type
- **📱 Works Everywhere**: React, vanilla JS, or pure logic
- **🧠 Smart Categories**: Essential vs. nice-to-have expense tracking
- **📊 Liberation Insights**: How reducing expenses extends your runway

## 🚀 Quick Start

### Installation

```bash
npm install @thegreenfieldoverride/runway-calculator
```

### React Component

```jsx
import { RunwayCalculator } from '@thegreenfieldoverride/runway-calculator/react';

function MyApp() {
  return (
    <div>
      <h1>Calculate Your Runway to Freedom</h1>
      <RunwayCalculator />
    </div>
  );
}
```

### Vanilla JavaScript

```html
<div id="runway-calculator"></div>
<script src="https://unpkg.com/@thegreenfieldoverride/runway-calculator/vanilla"></script>
<script>
  new VanillaRunwayCalculator({
    containerId: 'runway-calculator'
  });
</script>
```

### Core Logic Only

```javascript
import { calculateRunway } from '@thegreenfieldoverride/runway-calculator/core';

const result = calculateRunway({
  savings: 50000,
  expenses: [
    { id: '1', name: 'Rent', amount: 2000, isEssential: true },
    { id: '2', name: 'Food', amount: 600, isEssential: true },
    { id: '3', name: 'Subscriptions', amount: 200, isEssential: false }
  ]
});

console.log(result.runwayDisplay); // "17 months, 3 weeks"
console.log(result.monthsTotal); // 17.86
console.log(result.essentialOnlyRunway); // "25 months" (cutting non-essentials)
```

## 🔧 API Reference

### calculateRunway(params)

**Parameters:**
- `savings` (number): Total savings amount
- `expenses` (array): List of expense objects
  - `id` (string): Unique identifier
  - `name` (string): Expense name
  - `amount` (number): Monthly amount
  - `isEssential` (boolean): Whether it's essential

**Returns:**
- `runwayDisplay` (string): Human-readable runway (e.g., "6 months, 2 weeks")
- `monthsTotal` (number): Total months as decimal
- `essentialOnlyRunway` (string): Runway if cutting non-essentials
- `monthlyTotal` (number): Total monthly expenses
- `essentialTotal` (number): Essential monthly expenses only

## 🎯 Use Cases

- **Job Transition Planning**: Know exactly how long you can job hunt
- **Sabbatical Planning**: Calculate extended break feasibility  
- **Emergency Preparedness**: Understand your financial cushion
- **Liberation Timeline**: Plan your escape from corporate burnout
- **Expense Optimization**: See which cuts extend your runway most

## 🤝 Contributing

This tool helps people escape financial anxiety. Every improvement matters:

1. Fork the repository
2. Create a feature branch
3. Test thoroughly (this affects real financial decisions)
4. Submit a pull request

## 📄 License

Licensed under [Liberation License v1.0](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md) - ensuring these tools serve human liberation, not corporate exploitation.

---

*"Clarity is the first step to freedom."*