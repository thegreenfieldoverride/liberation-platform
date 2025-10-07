/**
 * Transformers.js WASM Engine - Self-hosted WASM version (future implementation)
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import { TemplateAIEngine } from './template-ai.engine';
import type { AIEngineConfig } from '../interfaces/ai-engine.interface';

export class TransformersWASMEngine extends TemplateAIEngine {
  constructor(config: AIEngineConfig) {
    super(config);
    console.log('🚧 Transformers WASM Engine - falling back to templates (not yet implemented)');
  }

  getMetadata() {
    return {
      name: 'Transformers.js WASM Engine (Fallback)',
      version: '0.1.0',
      type: 'local' as const,
      privacy: 'full' as const,
      dependencies: ['@xenova/transformers (self-hosted)']
    };
  }
}