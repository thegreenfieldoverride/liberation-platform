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