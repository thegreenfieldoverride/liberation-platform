/**
 * Greenfield Override Shared Types - Liberation tool type definitions
 * Core types for financial freedom and corporate escape planning tools
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  isEssential: boolean;
}

export interface RunwayCalculation {
  totalMonthlyExpenses: number;
  currentSavings: number;
  runwayMonths: number;
  runwayDisplay: string; // e.g., "6.5 months"
  scenarios?: RunwayScenario[];
  stressTests?: StressTestScenario[];
  insights?: string[];
}

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

export interface RunwayInputs {
  expenses: ExpenseCategory[];
  savings: number;
}

// Real Hourly Wage types (for future module)
export interface WorkHours {
  weeklyHours: number;
  commuteDailyMinutes: number;
  workDaysPerWeek: number;
}

export interface WorkCosts {
  commuteMonthlyCost: number;
  workLunchesMonthlyCost: number;
  workClothingMonthlyCost: number;
  stressSpendingMonthlyCost: number;
}

export interface RealWageCalculation {
  statedHourlyWage: number;
  realHourlyWage: number;
  monthlyRealIncome: number;
  totalMonthlyHours: number;
}

// Cognitive Debt Assessment types
export interface CognitiveDebtQuestion {
  id: string;
  category: CognitiveDebtCategory;
  question: string;
  description?: string;
  weight: number; // Impact multiplier for scoring
}

export type CognitiveDebtCategory = 
  | 'mental_fog'           // Reduced cognitive function, can't think clearly
  | 'emotional_exhaustion' // Drained, overwhelmed, cynical
  | 'creative_shutdown'    // Loss of inspiration, innovation, original thinking
  | 'relationship_decay'   // Damaged personal relationships, isolation
  | 'physical_symptoms'    // Stress-induced health issues
  | 'identity_erosion';    // Loss of sense of self, purpose, values

export interface CognitiveDebtResponse {
  questionId: string;
  score: number; // 0-4 scale (Never, Rarely, Sometimes, Often, Always)
}

export interface CognitiveDebtInputs {
  responses: CognitiveDebtResponse[];
}

export interface CognitiveDebtResult {
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  categoryScores: Record<CognitiveDebtCategory, {
    score: number;
    maxScore: number;
    percentage: number;
  }>;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  primaryConcerns: CognitiveDebtCategory[];
  recommendations: string[];
  message: string;
}

// AI Co-Pilot types
export interface LiberationContext {
  runwayMonths: number;
  realHourlyWage: number;
  cognitiveDebtPercentage: number;
  skills: string[];
  industry: string;
  riskTolerance: 'low' | 'medium' | 'high';
  goals: string[];
}

export interface LiberationPhase {
  name: string;
  duration: string;
  actions: string[];
  milestones: string[];
}

export interface LiberationPlan {
  assessment: string;
  timeline: string;
  phases: LiberationPhase[];
  contingencies: string[];
  resources: string[];
}

export interface AIStatus {
  initialized: boolean;
  modelsLoaded: string[];
  loading?: boolean;
  error?: string;
}

// Values-to-Vocation Matcher types
export type CoreValue = 
  | 'autonomy'           // Freedom to make decisions and control your work
  | 'creativity'         // Expressing ideas, innovation, artistic pursuits
  | 'impact'             // Making a meaningful difference in the world
  | 'growth'             // Learning, developing skills, personal evolution
  | 'security'           // Stability, predictability, safety
  | 'balance'            // Work-life harmony, time for personal life
  | 'connection'         // Building relationships, community, collaboration
  | 'recognition'        // Acknowledgment, respect, status
  | 'challenge'          // Problem-solving, pushing limits, intellectual stimulation
  | 'service'            // Helping others, contributing to society
  | 'authenticity'       // Being true to yourself, expressing your values
  | 'mastery'            // Becoming excellent at something, deep expertise
  | 'variety'            // Diverse experiences, avoiding routine
  | 'leadership'         // Guiding others, driving change, being in charge
  | 'adventure'          // Excitement, risk-taking, new experiences
  | 'spirituality'       // Purpose beyond material, meaning, transcendence
  | 'justice'            // Fairness, equality, fighting wrongs
  | 'beauty'             // Aesthetics, design, creating beautiful things
  | 'knowledge'          // Learning, understanding, intellectual pursuit
  | 'family';            // Prioritizing family relationships and time

export interface ValueAssessmentQuestion {
  id: string;
  value: CoreValue;
  scenario: string;
  description: string;
  weight: number; // Importance multiplier (1.0 = standard, 1.5 = high impact)
}

export interface ValueResponse {
  questionId: string;
  importance: number; // 1-5 scale (Not Important, Slightly, Moderately, Very, Extremely)
}

export interface ValueAssessmentInputs {
  responses: ValueResponse[];
  currentRole?: string;
  industry?: string;
  yearsExperience?: number;
}

export interface ValueProfile {
  coreValues: Array<{
    value: CoreValue;
    score: number;
    percentage: number;
    rank: number;
  }>;
  valueDistribution: Record<CoreValue, number>;
  dominantValues: CoreValue[]; // Top 5 values
  conflictingValues: Array<{
    value1: CoreValue;
    value2: CoreValue;
    tensionLevel: number;
  }>;
  authenticityScore: number; // How aligned current work is with values
}

export type WorkArrangement = 
  | 'remote_employee'
  | 'hybrid_employee'
  | 'traditional_employee'
  | 'freelancer'
  | 'consultant'
  | 'contractor'
  | 'entrepreneur'
  | 'solopreneur'
  | 'co_founder'
  | 'digital_nomad'
  | 'portfolio_career'
  | 'part_time_multi'
  | 'seasonal_work'
  | 'project_based';

export type VocationCategory = 
  | 'technology'
  | 'creative_arts'
  | 'healthcare'
  | 'education'
  | 'business'
  | 'science'
  | 'social_impact'
  | 'trades'
  | 'hospitality'
  | 'finance'
  | 'legal'
  | 'media'
  | 'environment'
  | 'government'
  | 'manufacturing'
  | 'transportation'
  | 'real_estate'
  | 'agriculture'
  | 'consulting'
  | 'coaching';

export interface VocationOption {
  id: string;
  title: string;
  category: VocationCategory;
  description: string;
  primaryValues: CoreValue[];
  secondaryValues: CoreValue[];
  conflictingValues: CoreValue[];
  arrangements: WorkArrangement[];
  skillsRequired: string[];
  pathways: Array<{
    name: string;
    description: string;
    timeframe: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    steps: string[];
  }>;
  realityCheck: {
    averageIncome: string;
    timeToViability: string;
    difficultyLevel: number; // 1-10
    marketDemand: 'low' | 'moderate' | 'high';
    growthPotential: 'declining' | 'stable' | 'growing' | 'exploding';
  };
  liberationPotential: {
    autonomyLevel: number; // 1-10
    flexibilityLevel: number; // 1-10
    incomeStability: number; // 1-10
    growthCeiling: number; // 1-10
    timeToFreedom: string;
  };
}

export interface VocationMatch {
  vocation: VocationOption;
  alignmentScore: number; // 0-100
  valueMatches: Array<{
    value: CoreValue;
    importance: number;
    vocationSupport: number;
    alignment: number;
  }>;
  conflictAreas: Array<{
    value: CoreValue;
    conflictSeverity: number;
    description: string;
  }>;
  recommendedArrangements: Array<{
    arrangement: WorkArrangement;
    suitabilityScore: number;
    reasoning: string;
  }>;
  transitionStrategy: {
    difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
    timeframe: string;
    keySteps: string[];
    skillGaps: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface VocationMatchingResult {
  userProfile: ValueProfile;
  topMatches: VocationMatch[];
  insights: {
    valueAlignment: string;
    careerThemes: string[];
    strengthAreas: string[];
    cautionAreas: string[];
    recommendations: string[];
  };
  explorationSuggestions: Array<{
    action: string;
    purpose: string;
    timeframe: string;
  }>;
}

// Export user context types
export * from './user-context';