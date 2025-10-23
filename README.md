# Liberation Platform

> AI-powered liberation tools for breaking free from corporate exploitation

[![License](https://img.shields.io/badge/license-Liberation--1.0-blue.svg)](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md)
[![GitHub](https://img.shields.io/github/stars/thegreenfieldoverride/liberation-platform?style=social)](https://github.com/thegreenfieldoverride/liberation-platform)

## Mission

To build a platform that helps people escape the "Hamster Wheel" of corporate burnout and reconstruct a more humane, intentional way of living and working. Our goal is to move individuals from a state of being "burned down" by the system to a place where they can "rise from the ashes."

## Core Principles

1. **Privacy is a Human Right** - Every tool is architected with privacy as its foundation
2. **AI is a Partner, Not a Replacement** - AI augments human creativity and liberates from toil  
3. **Radical Empathy in a Cold World** - Fiercely validating, non-judgmental, empowering
4. **Open and Replicable** - Tools designed to be replicated and spread freely

## Architecture

### Three-Tier Strategy

**Tier 1: The Mirror (Liberation Tools)**
- 🚀 **Runway Calculator** ✅ - Transform anxiety into clarity 
- 💰 **Real Hourly Wage Calculator** ✅ - Shatter the salary illusion
- 🧠 **Cognitive Debt Assessment** ✅ - Measure burnout's hidden costs

**Tier 2: The AI Liberation Toolkit**  
- 🤖 **AI Co-Pilot** ✅ - Your personal chief of staff for freedom
- 📈 **Liberation Planning** ✅ - AI-powered escape routes

**Tier 3: The Colony (Secure Platform)**
- Skills Barter System (planned)
- Sovereign Circles (planned)

## Getting Started

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build all packages
npm run build
```

## 🚀 Quick Start

### Try the Live Platform

Visit the [Liberation Platform](https://liberation-platform.vercel.app) to start planning your escape.

### Install Liberation Tools

```bash
# Install individual packages
npm install @greenfieldoverride/runway-calculator
npm install @greenfieldoverride/real-hourly-wage  
npm install @greenfieldoverride/ai-copilot
npm install @greenfieldoverride/cognitive-debt-assessment
```

### Usage Examples

**🚀 Runway Calculator:**
```jsx
import { RunwayCalculator } from '@greenfieldoverride/runway-calculator/react';

function MyApp() {
  return <RunwayCalculator />;
}
```

**🤖 AI Co-Pilot:**
```jsx
import { LiberationCoPilot } from '@greenfieldoverride/ai-copilot/react';

function MyApp() {
  return <LiberationCoPilot />;
}
```

**Core Logic (Framework Agnostic):**
```js
import { calculateRunway } from '@greenfieldoverride/runway-calculator/core';
import { LiberationAI } from '@greenfieldoverride/ai-copilot/core';

// Calculate financial runway
const runway = calculateRunway({
  expenses: [{ id: '1', name: 'Rent', amount: 1500, isEssential: true }],
  savings: 10000
});

// Get AI liberation guidance  
const ai = new LiberationAI();
const advice = await ai.generateEscapePlan(runway);
```

## Project Structure

```
liberation-platform/
├── packages/                                      # Liberation modules
│   ├── ai-copilot/                              # @greenfieldoverride/ai-copilot
│   ├── runway-calculator/                       # @greenfieldoverride/runway-calculator  
│   ├── real-hourly-wage/                        # @greenfieldoverride/real-hourly-wage
│   ├── cognitive-debt-assessment/               # @greenfieldoverride/cognitive-debt-assessment
│   └── shared-types/                            # @greenfieldoverride/types
├── apps/
│   └── web/                                     # Liberation Platform (Next.js + AI)
├── LICENSE                                      # Liberation License v1.0
├── MANIFESTO.md                                 # Our vision for liberation
└── TECHNICAL_ROADMAP.md                         # AI sovereignty roadmap
```

## 📦 Publishing Liberation Tools

```bash
# Publish individual tools
npm run publish:runway           # Runway Calculator
npm run publish:hourly-wage      # Real Hourly Wage
npm run publish:ai-copilot       # AI Co-Pilot  
npm run publish:cognitive-debt   # Cognitive Debt Assessment
npm run publish:types            # Shared Types

# Publish everything
npm run publish:all
```

## 🔧 Development

```bash
# Install dependencies  
pnpm install

# Start development server with AI Co-Pilot
pnpm dev

# Build all liberation tools
pnpm build

# Run tests
pnpm test
```

## Contributing

This is a liberation movement. Every contribution helps someone escape the hamster wheel.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (this affects people's lives)
5. Submit a pull request

## License

This project is licensed under the **Liberation License v1.0** - a license designed to support individual freedom while preventing corporate exploitation.

**Key Points:**
- ✅ **Full freedom** for individuals, communities, and liberation-focused projects
- ✅ **Limited corporate use** - only for humanitarian/ecological work aligned with the manifesto
- 🚫 **Blocks exploitation** - no profit-driven surveillance, manipulation, or worker extraction
- 🤝 **Supports cooperatives** - worker-owned and democratically governed organizations welcome

**Full License**: See [LICENSE](./LICENSE) file or visit the [official Liberation License repository](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md).

**Why this license?** Traditional open source licenses allow unlimited corporate use, often resulting in tools that help individuals being co-opted to exploit them. The Liberation License ensures this technology serves human liberation, not human exploitation.

---

*"The master's tools will never dismantle the master's house. But we can build better tools."*