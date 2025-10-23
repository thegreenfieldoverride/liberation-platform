/**
 * AI Engine Interface - Abstraction for swappable AI implementations
 * Designed for open source release and future extensibility
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { LiberationContext, LiberationPlan, LiberationPhase } from '@greenfieldoverride/types';

export interface AIResponse {
  content: string;
  confidence: number;
  sources: string[];
  type: 'guidance' | 'analysis' | 'plan' | 'support';
  metadata?: Record<string, any>;
}

export interface AIStatus {
  initialized: boolean;
  modelsLoaded: string[];
  loading?: boolean;
  error?: string;
  mode: 'real-ai' | 'smart-templates' | 'loading' | 'error';
  capabilities?: AICapabilities;
}

export interface AICapabilities {
  sentimentAnalysis: boolean;
  textGeneration: boolean;
  classification: boolean;
  semanticSearch: boolean;
  personalization: boolean;
  offlineMode: boolean;
}

export interface AIInsights {
  sentiment?: {
    label: string;
    confidence: number;
    analysis: string;
  };
  classification?: {
    category: string;
    confidence: number;
    alternatives: string[];
  };
  riskAssessment?: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    mitigation: string[];
  };
  opportunities?: {
    primary: string;
    secondary: string[];
    timeline: string;
  };
}

export interface PersonalizationContext {
  historicalPatterns?: any[];
  preferences?: Record<string, any>;
  learnings?: Record<string, any>;
  contextualRecommendations?: string[];
}

/**
 * Core AI Engine Interface
 * All implementations must conform to this interface
 */
export interface IAIEngine {
  /**
   * Initialize the AI engine
   */
  initialize(): Promise<void>;

  /**
   * Generate comprehensive liberation plan
   */
  generateLiberationPlan(
    context: LiberationContext, 
    personalization?: PersonalizationContext
  ): Promise<LiberationPlan>;

  /**
   * Analyze user context and provide insights
   */
  analyzeContext(context: LiberationContext): Promise<AIInsights>;

  /**
   * Assess liberation readiness with detailed scoring
   */
  assessLiberationReadiness(context: LiberationContext): Promise<{
    score: number;
    level: 'building' | 'ready' | 'optimal';
    factors: { name: string; score: number; impact: string }[];
    recommendations: string[];
  }>;

  /**
   * Generate contextual recommendations
   */
  generateRecommendations(
    context: LiberationContext,
    category: 'skills' | 'financial' | 'network' | 'wellbeing' | 'strategy'
  ): Promise<string[]>;

  /**
   * Get current status and capabilities
   */
  getStatus(): AIStatus;

  /**
   * Get engine metadata for debugging/monitoring
   */
  getMetadata(): {
    name: string;
    version: string;
    type: 'local' | 'hybrid' | 'cloud';
    privacy: 'full' | 'partial' | 'none';
    dependencies: string[];
  };
}

/**
 * Memory/Personalization Interface
 * Separate from core AI for modularity
 */
export interface IPersonalizationEngine {
  /**
   * Initialize memory system
   */
  initialize(): Promise<void>;

  /**
   * Add context to personalization memory
   */
  addContext(type: string, content: string, metadata?: Record<string, any>): Promise<string>;

  /**
   * Search personal context semantically
   */
  searchContext(query: string, filters?: Record<string, any>): Promise<Array<{
    content: string;
    metadata: Record<string, any>;
    relevance: number;
  }>>;

  /**
   * Generate personal insights from stored context
   */
  generateInsights(currentContext: LiberationContext): Promise<string[]>;

  /**
   * Export all personal data
   */
  exportData(): Promise<any>;

  /**
   * Import personal data
   */
  importData(data: any): Promise<void>;

  /**
   * Clear all personal data
   */
  clearData(): Promise<void>;

  /**
   * Get storage statistics
   */
  getStats(): {
    itemCount: number;
    categories: Record<string, number>;
    storageSize: string;
    lastUpdated: number;
  };
}

/**
 * Combined interface for AI + Personalization
 */
export interface ISovereignAI extends IAIEngine {
  /**
   * Access to personalization engine
   */
  readonly memory: IPersonalizationEngine;

  /**
   * Generate plan with full personalization
   */
  generatePersonalizedPlan(context: LiberationContext): Promise<LiberationPlan & {
    personalInsights: string[];
    historicalContext: string[];
    adaptiveRecommendations: string[];
  }>;
}

/**
 * Configuration interface for different AI engines
 */
export interface AIEngineConfig {
  name: string;
  type: 'transformers-cdn' | 'transformers-wasm' | 'custom' | 'templates';
  privacy: 'full' | 'partial' | 'none';
  capabilities: AICapabilities;
  initialization?: {
    modelUrls?: string[];
    fallbackToTemplates?: boolean;
    maxInitTime?: number;
  };
  personalization?: {
    enabled: boolean;
    storage: 'indexeddb' | 'localstorage' | 'memory';
    vectorSearch?: boolean;
  };
}

/**
 * Factory interface for creating AI engines
 */
export interface IAIEngineFactory {
  createEngine(config: AIEngineConfig): Promise<ISovereignAI>;
  listAvailableEngines(): AIEngineConfig[];
  detectBestEngine(): Promise<AIEngineConfig>;
}

/**
 * Events interface for AI engine lifecycle
 */
export interface AIEngineEvents {
  onInitializationStart?: () => void;
  onInitializationProgress?: (progress: { stage: string; percent: number }) => void;
  onInitializationComplete?: (status: AIStatus) => void;
  onInitializationError?: (error: Error) => void;
  onPlanGenerated?: (plan: LiberationPlan) => void;
  onInsightsGenerated?: (insights: AIInsights) => void;
  onPersonalizationUpdate?: (stats: any) => void;
}