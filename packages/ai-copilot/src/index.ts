// AI Co-Pilot main exports
export { AICoPilot } from './react/AICoPilot';
export { LiberationDashboard } from './react/LiberationDashboard';

// Modern factory-based API (recommended)
export { aiEngineFactory, AIEngineFactory } from './engines/ai-engine-factory';
export type { 
  ISovereignAI, 
  IAIEngine, 
  IPersonalizationEngine,
  AIStatus,
  AIInsights,
  AIEngineConfig,
  PersonalizationContext
} from './interfaces/ai-engine.interface';

// Convenience instance (uses factory internally)
export { sovereignAI } from './sovereign-ai';

// React components
export type { AICoPilotProps } from './react/AICoPilot';

// Legacy engines (for direct import if needed)
export { TransformersCDNEngine } from './engines/transformers-cdn.engine';
export { TemplateAIEngine } from './engines/template-ai.engine';
export { BrowserPersonalizationEngine } from './engines/personalization.engine';