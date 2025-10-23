# Cognitive Debt Assessment 🧠

> Measure the hidden mental costs of corporate burnout

[![npm version](https://badge.fury.io/js/%40thegreenfieldoverride%2Fcognitive-debt-assessment.svg)](https://badge.fury.io/js/%40thegreenfieldoverride%2Fcognitive-debt-assessment)
[![License](https://img.shields.io/badge/license-Liberation--1.0-blue.svg)](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md)

Just like technical debt slows down software, cognitive debt accumulates when workplace stress overwhelms your mental capacity. This assessment reveals the hidden costs: decreased creativity, decision fatigue, emotional exhaustion, and the compound interest of burnout.

## 🌟 Features

- **🧩 Multi-Dimensional Assessment**: Cognitive load, emotional debt, creative depletion
- **📊 Burnout Scoring**: Scientific metrics with actionable insights  
- **🎯 Recovery Pathways**: Personalized strategies for cognitive restoration
- **📈 Progress Tracking**: Monitor your mental health over time
- **🔒 100% Private**: All data stays in your browser
- **🎨 Thoughtful UX**: Gentle, non-judgmental interface design

## 🚀 Quick Start

### Installation

```bash
npm install @greenfieldoverride/cognitive-debt-assessment
```

### React Component

```jsx
import { CognitiveDebtAssessment } from '@greenfieldoverride/cognitive-debt-assessment/react';

function MyApp() {
  return (
    <div>
      <h1>Check Your Mental Load</h1>
      <CognitiveDebtAssessment />
    </div>
  );
}
```

### Vanilla JavaScript

```html
<div id="cognitive-assessment"></div>
<script src="https://unpkg.com/@greenfieldoverride/cognitive-debt-assessment/vanilla"></script>
<script>
  new VanillaCognitiveAssessment({
    containerId: 'cognitive-assessment'
  });
</script>
```

### Core Logic Only

```javascript
import { assessCognitiveDebt } from '@greenfieldoverride/cognitive-debt-assessment/core';

const result = assessCognitiveDebt({
  cognitiveLoad: {
    mentalFatigue: 8,        // 1-10 scale
    decisionFatigue: 9,
    informationOverload: 7,
    multitaskingStrain: 8
  },
  emotionalDebt: {
    workStress: 9,
    interpersonalStrain: 6,
    imposterSyndrome: 7,
    workLifeBlur: 8
  },
  creativeDepletion: {
    problemSolvingEnergy: 3,  // 1-10 (inverted - lower is worse)
    innovationCapacity: 2,
    curiosityLevel: 4,
    learningMotivation: 3
  },
  physicalImpact: {
    sleepQuality: 4,
    energyLevels: 3,
    tensionHeadaches: 7,
    digestiveIssues: 6
  }
});

console.log(result.overallScore);     // "Severe Cognitive Debt (74/100)"
console.log(result.primaryConcerns);  // ["Decision Fatigue", "Creative Depletion"]
console.log(result.recoveryPlan);     // Personalized action steps
```

## 🔧 Assessment Dimensions

### 1. Cognitive Load
- **Mental Fatigue**: How mentally exhausted you feel
- **Decision Fatigue**: Difficulty making choices, even small ones
- **Information Overload**: Struggling to process incoming information
- **Multitasking Strain**: Cost of constant context switching

### 2. Emotional Debt
- **Work Stress**: Anxiety, pressure, overwhelm from job demands
- **Interpersonal Strain**: Draining interactions, office politics
- **Imposter Syndrome**: Self-doubt, feeling like a fraud
- **Work-Life Blur**: Inability to disconnect from work mentally

### 3. Creative Depletion
- **Problem-Solving Energy**: Capacity for complex thinking
- **Innovation Capacity**: Ability to generate new ideas
- **Curiosity Level**: Interest in learning and exploring
- **Learning Motivation**: Drive to grow and develop skills

### 4. Physical Impact
- **Sleep Quality**: Rest affected by work stress
- **Energy Levels**: Physical vitality and stamina
- **Tension Symptoms**: Headaches, neck pain, eye strain
- **Digestive Health**: Stress impact on eating and digestion

## 📊 Scoring & Interpretation

### Cognitive Debt Levels
- **0-25**: Optimal cognitive health
- **26-50**: Manageable cognitive load
- **51-75**: Concerning cognitive debt
- **76-100**: Severe cognitive debt requiring intervention

### Sample Results
```javascript
{
  overallScore: 68,
  level: "Concerning Cognitive Debt",
  breakdown: {
    cognitiveLoad: 82,     // Critical
    emotionalDebt: 71,     // High  
    creativeDepletion: 45, // Moderate
    physicalImpact: 73     // High
  },
  primaryConcerns: [
    "Decision Fatigue",
    "Work-Life Boundary Erosion",
    "Sleep Disruption"
  ],
  recoveryPlan: [
    "Implement decision batching techniques",
    "Establish hard work cutoff times", 
    "Practice cognitive restoration exercises"
  ]
}
```

## 🛠️ Recovery Strategies

### Immediate Relief (0-7 days)
- **Cognitive Breaks**: 5-minute mental resets every hour
- **Decision Batching**: Group similar decisions together
- **Information Diet**: Reduce news/social media consumption

### Short-term Recovery (1-4 weeks)
- **Boundary Setting**: Clear work start/stop times
- **Stress Reduction**: Meditation, exercise, nature exposure
- **Sleep Hygiene**: Consistent sleep schedule and environment

### Long-term Restoration (1-6 months)
- **Role Redesign**: Negotiate workload and responsibilities
- **Skill Development**: Learn stress management and productivity techniques
- **Career Planning**: Consider role changes or career transitions

## 🎯 Use Cases

- **Personal Awareness**: Understand your current mental state
- **Team Health**: Assess collective cognitive debt (anonymized)
- **Role Evaluation**: Is this job sustainable long-term?
- **Recovery Planning**: Track progress in cognitive restoration
- **Prevention**: Early warning system for burnout

## 🔬 Scientific Basis

This assessment is based on research in:
- **Cognitive Load Theory** (Sweller, 1988)
- **Decision Fatigue** (Baumeister et al., 1998)
- **Burnout Research** (Maslach & Leiter, 2016)
- **Stress & Cognition** (Lupien et al., 2009)
- **Creative Cognition** (Beaty et al., 2016)

## 🤝 Contributing

Mental health tools require extra care and sensitivity:

1. Fork the repository
2. Create a feature branch  
3. Test thoroughly (this affects people's wellbeing)
4. Ensure non-judgmental, supportive language
5. Submit a pull request

## ⚠️ Important Note

This tool is for educational and self-awareness purposes only. It is not a substitute for professional mental health assessment or treatment. If you're experiencing severe burnout or mental health concerns, please consult with a healthcare professional.

## 📄 License

Licensed under [Liberation License v1.0](https://github.com/liberationlicense/license/blob/v1.0.0/LICENSE.md) - ensuring these tools serve human liberation, not corporate exploitation.

---

*"Your mind is not a machine. It needs rest, not more productivity hacks."*