/**
 * User Context Types - Cross-tool data persistence
 * Enables seamless data flow between all liberation tools
 */

import { CoreValue, ValueProfile, VocationMatch } from './index';

// Base types for user identity and preferences
export interface UserIdentity {
  id: string; // Generated client-side UUID
  createdAt: Date;
  lastUpdated: Date;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    privacy: 'minimal' | 'standard' | 'detailed';
    dataRetention: 'session' | 'persistent' | 'encrypted';
  };
}

// Financial context from Tier 1 tools
export interface FinancialContext {
  runwayMonths?: number;
  monthlyExpenses?: number;
  currentSavings?: number;
  realHourlyWage?: number;
  cognitiveDebtPercentage?: number;
  lastCalculated?: Date;
}

// Career context from Values-Vocation Matcher
export interface CareerContext {
  valueProfile?: ValueProfile;
  topMatches?: VocationMatch[];
  currentRole?: string;
  industry?: string;
  yearsExperience?: number;
  assessmentCompleted?: Date;
}

// Small Bets Portfolio context
export interface SmallBet {
  id: string;
  name: string;
  description: string;
  category: 'service' | 'product' | 'content' | 'investment' | 'skill' | 'other';
  status: 'idea' | 'testing' | 'active' | 'paused' | 'successful' | 'failed';
  startDate: Date;
  
  // Financial tracking
  initialInvestment: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  totalRevenue: number;
  totalProfit: number;
  
  // Time tracking
  hoursPerWeek: number;
  totalHoursInvested: number;
  
  // Progress tracking
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    targetDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  }>;
  
  // Learning & insights
  lessonsLearned: string[];
  skills: string[];
  connections: string[];
  
  // Values alignment
  alignedValues: CoreValue[];
  satisfactionScore: number; // 1-10
  
  // Next actions
  nextSteps: string[];
  
  tags: string[];
  notes: string;
}

export interface SmallBetsPortfolio {
  bets: SmallBet[];
  totalInvestment: number;
  totalRevenue: number;
  totalProfit: number;
  averageHoursPerWeek: number;
  portfolioMetrics: {
    diversificationScore: number; // 1-10
    riskLevel: 'low' | 'medium' | 'high';
    monthlyBurnRate: number;
    monthlyIncome: number;
    runway: number; // months of runway from portfolio
  };
  goals: Array<{
    id: string;
    title: string;
    description: string;
    targetAmount?: number;
    targetDate?: Date;
    status: 'active' | 'completed' | 'cancelled';
  }>;
  lastUpdated: Date;
}

// AI Co-Pilot personalized insights
export interface AIPersonalization {
  learningContext: string[];
  preferences: string[];
  conversationHistory: Array<{
    timestamp: Date;
    topic: string;
    insights: string[];
  }>;
  customPrompts: string[];
}

// Complete user context combining all tool data
export interface UserContext {
  identity: UserIdentity;
  financial: FinancialContext;
  career: CareerContext;
  smallBets: SmallBetsPortfolio;
  ai: AIPersonalization;
  
  // Cross-tool insights
  liberationScore: number; // 0-100 composite score
  liberationPhase: 'discovery' | 'planning' | 'building' | 'transitioning' | 'liberated';
  
  // Privacy and data management
  dataVersion: string;
  exportedAt?: Date;
  imported?: boolean;
}

// Events for cross-tool communication
export type UserContextEvent = 
  | { type: 'financial_updated'; data: Partial<FinancialContext> }
  | { type: 'career_updated'; data: Partial<CareerContext> }
  | { type: 'small_bet_added'; data: SmallBet }
  | { type: 'small_bet_updated'; data: Partial<SmallBet> & { id: string } }
  | { type: 'liberation_score_changed'; data: { score: number; phase: string } };

// Storage configuration
export interface StorageConfig {
  version: number;
  dbName: string;
  stores: string[];
  encryptionEnabled: boolean;
  maxStorageSize: number; // MB
}

// Export/Import formats
export interface UserDataExport {
  version: string;
  exportedAt: Date;
  userContext: UserContext;
  metadata: {
    toolsUsed: string[];
    totalDataSize: number;
    checksum: string;
  };
}