export interface Constraint {
  id: string;
  description: string;
  category: 'truth' | 'problem' | 'uncategorized';
}

export interface UserChoice {
  id: string;
  statusQuo: string;
  greenfieldPull: string;
  constraints: Constraint[];
  createdAt: Date;
}

export interface Bridge {
  id: string;
  title: string;
  description: string;
  timeline: string;
  resources: Resource[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Accommodation {
  id: string;
  title: string;
  description: string;
  strategies: string[];
  constraintId: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'tool' | 'guide' | 'calculator' | 'service';
  description?: string;
}

export interface TimelinePhase {
  id: string;
  title: string;
  timeframe: string;
  actions: Action[];
  milestones: string[];
}

export interface Action {
  id: string;
  description: string;
  resources: Resource[];
  completed: boolean;
  estimatedTime: string;
}

export interface BridgeBlueprint {
  id: string;
  userChoiceId: string;
  score: number;
  summary: string;
  bridges: Bridge[];
  accommodations: Accommodation[];
  timeline: TimelinePhase[];
  createdAt: Date;
}

export interface InsightEngineState {
  currentStep: 'choice' | 'constraints' | 'audit' | 'results';
  userChoice?: UserChoice;
  blueprint?: BridgeBlueprint;
  isGenerating: boolean;
  error?: string;
}

export type ConstraintCategory = 'truth' | 'problem';

export interface AIRequest {
  statusQuo: string;
  greenfieldPull: string;
  truthsToAccommodate: string[];
  problemsToSolve: string[];
}

export interface AIResponse {
  bridges: Omit<Bridge, 'id'>[];
  accommodations: Omit<Accommodation, 'id' | 'constraintId'>[];
  timeline: Omit<TimelinePhase, 'id'>[];
  score: number;
  summary: string;
}