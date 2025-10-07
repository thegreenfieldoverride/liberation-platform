# Shared Types 📝

> TypeScript definitions for the Liberation Platform ecosystem

[![npm version](https://badge.fury.io/js/%40thegreenfieldoverride%2Ftypes.svg)](https://badge.fury.io/js/%40thegreenfieldoverride%2Ftypes)
[![License](https://img.shields.io/badge/license-Liberation--1.0-blue.svg)](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md)

Common TypeScript types, interfaces, and enums shared across all Liberation Platform tools. Ensures type safety and consistency across the runway calculator, real hourly wage calculator, cognitive debt assessment, and AI co-pilot.

## 🌟 Features

- **🔒 Type Safety**: Prevent runtime errors with comprehensive types
- **🔄 Consistency**: Shared interfaces across all liberation tools
- **📚 Well-Documented**: Clear JSDoc comments for all types
- **🎯 Focused**: Only the essential types, no bloat
- **🛠️ Developer-Friendly**: Great IDE support and autocomplete

## 🚀 Quick Start

### Installation

```bash
npm install @thegreenfieldoverride/types
```

### Basic Usage

```typescript
import {
  FinancialData,
  CognitiveDebtScore,
  LiberationPlan,
  AIResponse
} from '@thegreenfieldoverride/types';

// Type-safe financial calculations
const runwayData: FinancialData = {
  savings: 50000,
  monthlyExpenses: 3500,
  emergencyBuffer: 6,
  riskTolerance: 'moderate'
};

// Cognitive assessment results
const cognitiveScore: CognitiveDebtScore = {
  overall: 68,
  cognitive: 75,
  emotional: 62,
  creative: 45,
  physical: 71,
  level: 'concerning'
};

// AI-generated liberation guidance
const plan: LiberationPlan = {
  timeframe: '12-months',
  steps: [
    { action: 'Build emergency fund', priority: 'high', timeline: '3-months' },
    { action: 'Reduce cognitive load', priority: 'high', timeline: '1-month' }
  ],
  riskAssessment: 'moderate',
  confidence: 0.85
};
```

## 📚 Type Categories

### Financial Types
```typescript
interface FinancialData {
  savings: number;
  monthlyExpenses: number;
  income?: number;
  emergencyBuffer: number; // months
  riskTolerance: 'low' | 'moderate' | 'high';
}

interface RunwayResult {
  months: number;
  display: string; // "6 months, 2 weeks"
  confidence: number; // 0-1
  scenarios: RunwayScenario[];
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  isEssential: boolean;
  frequency: 'monthly' | 'yearly' | 'weekly';
}
```

### Cognitive Assessment Types
```typescript
interface CognitiveDebtAssessment {
  cognitiveLoad: CognitiveLoadMetrics;
  emotionalDebt: EmotionalDebtMetrics;
  creativeDepletion: CreativeDepletionMetrics;
  physicalImpact: PhysicalImpactMetrics;
}

interface CognitiveDebtScore {
  overall: number; // 0-100
  cognitive: number;
  emotional: number;
  creative: number;
  physical: number;
  level: 'optimal' | 'manageable' | 'concerning' | 'severe';
}

interface RecoveryPlan {
  immediate: RecoveryAction[];    // 0-7 days
  shortTerm: RecoveryAction[];    // 1-4 weeks  
  longTerm: RecoveryAction[];     // 1-6 months
  primaryConcerns: string[];
}
```

### AI & Liberation Types
```typescript
interface AIResponse {
  content: string;
  confidence: number; // 0-1
  sources: string[];
  type: 'guidance' | 'analysis' | 'plan' | 'support';
  metadata?: Record<string, any>;
}

interface LiberationPlan {
  timeframe: '3-months' | '6-months' | '12-months' | '18-months';
  steps: LiberationStep[];
  riskAssessment: 'low' | 'moderate' | 'high';
  confidence: number;
  personalizedFor: UserProfile;
}

interface LiberationStep {
  action: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeline: string;
  dependencies?: string[];
  resources?: Resource[];
}
```

### User & Personalization Types
```typescript
interface UserProfile {
  demographics?: {
    ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '56+';
    location?: string;
    industry?: string;
    role?: string;
  };
  preferences: {
    riskTolerance: 'low' | 'moderate' | 'high';
    timeframe: 'immediate' | 'short' | 'medium' | 'long';
    priorities: Priority[];
  };
  goals: Goal[];
  constraints: Constraint[];
}

interface Goal {
  id: string;
  type: 'financial' | 'career' | 'lifestyle' | 'health';
  description: string;
  priority: number; // 1-10
  timeline?: string;
  measurable?: boolean;
}
```

## 🔧 Enums & Constants

```typescript
enum ExpenseCategory {
  HOUSING = 'housing',
  FOOD = 'food', 
  TRANSPORTATION = 'transportation',
  UTILITIES = 'utilities',
  HEALTHCARE = 'healthcare',
  ENTERTAINMENT = 'entertainment',
  SAVINGS = 'savings',
  DEBT = 'debt',
  OTHER = 'other'
}

enum CognitiveDomain {
  ATTENTION = 'attention',
  MEMORY = 'memory',
  DECISION_MAKING = 'decision_making',
  CREATIVITY = 'creativity',
  EMOTIONAL_REGULATION = 'emotional_regulation'
}

enum LiberationStage {
  AWARENESS = 'awareness',        // Recognizing the problem
  PLANNING = 'planning',          // Building escape plan
  TRANSITION = 'transition',      // Actively changing
  STABILIZATION = 'stabilization', // Settling into new life
  OPTIMIZATION = 'optimization'   // Continuous improvement
}
```

## 🎯 Usage in Liberation Tools

### Runway Calculator
```typescript
import { FinancialData, RunwayResult } from '@thegreenfieldoverride/types';

function calculateRunway(data: FinancialData): RunwayResult {
  // Implementation uses shared types for consistency
}
```

### AI Co-Pilot
```typescript
import { AIResponse, LiberationPlan, UserProfile } from '@thegreenfieldoverride/types';

function generatePlan(profile: UserProfile): Promise<LiberationPlan> {
  // AI uses shared types for structured responses
}
```

### Cognitive Assessment
```typescript
import { CognitiveDebtAssessment, CognitiveDebtScore } from '@thegreenfieldoverride/types';

function assessCognitive(assessment: CognitiveDebtAssessment): CognitiveDebtScore {
  // Assessment uses shared scoring types
}
```

## 🤝 Contributing

Type definitions are the foundation of code quality:

1. Fork the repository
2. Add types with comprehensive JSDoc comments
3. Ensure backwards compatibility
4. Add examples for complex types
5. Test with all liberation tools
6. Submit a pull request

## 📄 License

Licensed under [Liberation License v1.0](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md) - ensuring these tools serve human liberation, not corporate exploitation.

---

*"Good types prevent bugs. Great types prevent confusion."*