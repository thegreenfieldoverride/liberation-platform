// Main component
export { InsightEngine } from './components/InsightEngine';

// Individual components for custom implementations
export { ChoiceDefinition } from './components/ChoiceDefinition';
export { DisciplineAudit } from './components/DisciplineAudit';
export { BridgeBlueprintDisplay } from './components/BridgeBlueprint';

// Services
export { aiService, generateBridgeBlueprint } from './services/aiService';
export { storageService } from './services/storageService';

// Types
export type {
  UserChoice,
  Constraint,
  BridgeBlueprint,
  Bridge,
  TimelinePhase,
  Action,
  Accommodation,
  Resource,
  InsightEngineState,
  ConstraintCategory,
  AIRequest,
  AIResponse
} from './types/insight-engine';

// Utils
export { PromptBuilder } from './utils/promptBuilder';