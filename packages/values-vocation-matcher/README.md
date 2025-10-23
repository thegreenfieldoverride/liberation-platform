# Values-to-Vocation Matcher

[![License](https://img.shields.io/badge/license-Liberation--1.0-blue.svg)](./LICENSE)
[![npm version](https://badge.fury.io/js/%40thegreenfieldoverride%2Fvalues-vocation-matcher.svg)](https://badge.fury.io/js/%40thegreenfieldoverride%2Fvalues-vocation-matcher)

**Find meaningful work that aligns with your authentic values.**

The Values-to-Vocation Matcher helps you discover career paths that truly matter to you. Unlike traditional career assessments that focus on skills or personality types, this tool starts with what you value most deeply and matches you with work opportunities that honor those values.

## Why Values Matter More Than Skills

Your skills can be learned. Your personality can adapt. But your core values - what truly matters to you - remain constant throughout your life. When your work aligns with your values, you experience:

- **Authentic motivation** that doesn't require external pressure
- **Natural resilience** during challenging times  
- **Sustainable energy** instead of constant burnout
- **Clear decision-making** based on what truly matters
- **Deep satisfaction** that goes beyond just a paycheck

## Features

- **Comprehensive Values Assessment**: 60+ carefully crafted questions that reveal your authentic priorities
- **Intelligent Career Matching**: Algorithm that matches your values to real career opportunities
- **Liberation-Focused Database**: Career paths optimized for autonomy, flexibility, and meaningful work
- **Transition Planning**: Concrete steps and timelines for moving toward aligned work
- **Reality Check**: Honest assessment of income potential, difficulty, and market demand
- **Multiple Implementations**: React components, vanilla JavaScript, and core TypeScript

## Installation

```bash
npm install @greenfieldoverride/values-vocation-matcher
```

## Quick Start

### React Component

```jsx
import { ValuesVocationMatcher } from '@greenfieldoverride/values-vocation-matcher/react';

function App() {
  const handleComplete = (result) => {
    console.log('Career matches:', result.topMatches);
    console.log('User values:', result.userProfile.dominantValues);
  };

  return (
    <ValuesVocationMatcher 
      onComplete={handleComplete}
      showDetailedResults={true}
    />
  );
}
```

### Core API

```typescript
import { 
  getAssessmentQuestions,
  calculateValueProfile,
  matchVocationsToValues 
} from '@greenfieldoverride/values-vocation-matcher/core';

// Get the assessment questions
const questions = getAssessmentQuestions();

// Simulate user responses (1-5 scale for each question)
const responses = questions.map(q => ({
  questionId: q.id,
  importance: Math.floor(Math.random() * 5) + 1
}));

// Calculate the user's value profile
const valueProfile = calculateValueProfile({
  responses,
  currentRole: 'Software Developer',
  industry: 'Technology',
  yearsExperience: 5
});

// Find matching career paths
const matches = matchVocationsToValues(valueProfile, {
  preferredArrangements: ['remote_employee', 'freelancer'],
  prioritizeIncome: false,
  riskTolerance: 'medium'
});

console.log('Top 3 matches:', matches.topMatches.slice(0, 3));
```

### Vanilla JavaScript

```html
<div id="values-matcher"></div>

<script type="module">
  import { ValuesVocationMatcherVanilla } from '@greenfieldoverride/values-vocation-matcher/vanilla';
  
  // Initialize the matcher
  new ValuesVocationMatcherVanilla('values-matcher');
</script>
```

## Core Values Framework

The assessment evaluates 20 core values that drive career satisfaction:

### Autonomy & Control
- **Autonomy**: Freedom to make decisions and control your work
- **Mastery**: Developing deep expertise and craftsmanship
- **Challenge**: Complex problem-solving and intellectual stimulation

### Purpose & Impact  
- **Impact**: Making a meaningful difference in the world
- **Service**: Helping others and contributing to society
- **Justice**: Fighting unfairness and advocating for others
- **Spirituality**: Connecting to higher purpose and meaning

### Creativity & Growth
- **Creativity**: Expressing ideas, innovation, artistic pursuits
- **Growth**: Learning, developing skills, personal evolution
- **Knowledge**: Understanding, discovery, intellectual pursuit
- **Beauty**: Creating or working with aesthetically pleasing things

### Security & Balance
- **Security**: Stability, predictability, financial safety
- **Balance**: Work-life harmony, time for personal life
- **Family**: Prioritizing family relationships and time

### Connection & Recognition
- **Connection**: Building relationships, community, collaboration
- **Recognition**: Acknowledgment, respect, professional status
- **Leadership**: Guiding others, driving change, being in charge

### Experience & Adventure
- **Variety**: Diverse experiences, avoiding routine
- **Adventure**: Excitement, risk-taking, new experiences
- **Authenticity**: Being true to yourself, expressing your values

## Career Database

Our vocation database includes liberation-focused career paths across multiple categories:

### Technology
- Freelance Software Developer
- UX Design Consultant  
- Digital Marketing Consultant

### Creative Arts
- Content Creator & Educator
- Freelance Writer & Copywriter

### Consulting
- Independent Business Consultant
- Specialized Industry Consultant

### Social Impact
- Social Entrepreneur
- Mission-Driven Organization Leader

### Coaching & Development
- Life & Career Coach
- Skills Trainer & Educator

### Trades & Crafts
- Independent Craftsperson/Artisan
- Skilled Service Provider

### Healthcare & Wellness
- Independent Health Practitioner
- Wellness & Nutrition Consultant

### Real Estate & Finance
- Real Estate Investor/Wholesaler
- Financial Planning Consultant

Each vocation includes:
- **Values alignment** (primary, secondary, conflicting values)
- **Work arrangements** (remote, freelance, entrepreneurial, etc.)
- **Transition pathways** with concrete steps and timelines
- **Reality check** (income, difficulty, market demand)
- **Liberation potential** (autonomy, flexibility, growth ceiling)

## API Reference

### Core Functions

#### `getAssessmentQuestions(): ValueAssessmentQuestion[]`
Returns the complete set of values assessment questions.

#### `calculateValueProfile(inputs: ValueAssessmentInputs): ValueProfile`
Calculates a comprehensive value profile from assessment responses.

#### `matchVocationsToValues(profile: ValueProfile, preferences?: MatchingPreferences): VocationMatchingResult`
Finds and ranks career paths based on values alignment.

### Types

```typescript
interface ValueProfile {
  coreValues: Array<{
    value: CoreValue;
    score: number;
    percentage: number;
    rank: number;
  }>;
  dominantValues: CoreValue[];
  conflictingValues: Array<{
    value1: CoreValue;
    value2: CoreValue;
    tensionLevel: number;
  }>;
  authenticityScore: number;
}

interface VocationMatch {
  vocation: VocationOption;
  alignmentScore: number; // 0-100
  valueMatches: Array<{
    value: CoreValue;
    importance: number;
    vocationSupport: number;
    alignment: number;
  }>;
  transitionStrategy: {
    difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
    timeframe: string;
    keySteps: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
}
```

## Advanced Usage

### Custom Vocation Database

```typescript
import { VOCATION_DATABASE } from '@greenfieldoverride/values-vocation-matcher/core';

// Add custom vocations to the database
const customVocation = {
  id: 'custom_consultant',
  title: 'Specialized Consultant',
  category: 'consulting',
  description: 'Your specialized consulting practice',
  primaryValues: ['autonomy', 'mastery', 'impact'],
  // ... rest of vocation definition
};

// Use custom matching with filtered database
const customDatabase = [...VOCATION_DATABASE, customVocation];
```

### Integration with AI Co-Pilot

```typescript
import { ValuesVocationMatcher } from '@greenfieldoverride/values-vocation-matcher';
import { LiberationDataCollector } from '@greenfieldoverride/ai-copilot';

// Combine values assessment with AI-powered liberation planning
const handleValuesComplete = (valuesResult) => {
  const liberationContext = {
    // ... other context data
    dominantValues: valuesResult.userProfile.dominantValues,
    careerMatches: valuesResult.topMatches.slice(0, 3)
  };
  
  // Pass to AI Co-Pilot for enhanced recommendations
};
```

## Contributing

We welcome contributions that expand the vocation database, improve the matching algorithm, or enhance the user experience. See our [contribution guidelines](../../CONTRIBUTING.md) for details.

## License

Liberation License 1.0 - Designed for individual freedom, not corporate optimization.

## Support

- **Documentation**: [Full API docs](./docs/)
- **Issues**: [GitHub Issues](https://github.com/thegreenfieldoverride/liberation-platform/issues)
- **Community**: [Liberation Platform Discussions](https://github.com/thegreenfieldoverride/liberation-platform/discussions)

---

*Part of [The Greenfield Override](https://github.com/thegreenfieldoverride/liberation-platform) - Tools for escaping corporate exploitation and building authentic, sustainable work.*