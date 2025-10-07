/**
 * Sovereign AI - Factory-based convenience instance
 * Provides backward compatibility while using the new modular architecture
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import { aiEngineFactory } from './engines/ai-engine-factory';
import type { ISovereignAI } from './interfaces/ai-engine.interface';

class SovereignAIProxy {
  private engine: ISovereignAI | null = null;
  private initPromise: Promise<ISovereignAI> | null = null;

  private async getEngine(): Promise<ISovereignAI> {
    if (this.engine) return this.engine;
    
    if (!this.initPromise) {
      this.initPromise = this.createEngine();
    }
    
    return this.initPromise;
  }

  private async createEngine(): Promise<ISovereignAI> {
    try {
      // Try to create the best available engine with fallback
      this.engine = await aiEngineFactory.createEngineWithFallback('transformers-cdn');
      await this.engine.initialize();
      return this.engine;
    } catch (error) {
      console.error('Failed to create AI engine:', error);
      throw error;
    }
  }

  // Proxy all ISovereignAI methods
  async initialize() {
    const engine = await this.getEngine();
    return engine.initialize();
  }

  async generateLiberationPlan(context: any, personalization?: any) {
    const engine = await this.getEngine();
    return engine.generateLiberationPlan(context, personalization);
  }

  async generatePersonalizedPlan(context: any) {
    const engine = await this.getEngine();
    return engine.generatePersonalizedPlan(context);
  }

  async analyzeContext(context: any) {
    const engine = await this.getEngine();
    return engine.analyzeContext(context);
  }

  async assessLiberationReadiness(context: any) {
    const engine = await this.getEngine();
    return engine.assessLiberationReadiness(context);
  }

  async generateRecommendations(context: any, category: any) {
    const engine = await this.getEngine();
    return engine.generateRecommendations(context, category);
  }

  getStatus() {
    if (!this.engine) {
      return {
        initialized: false,
        modelsLoaded: [],
        mode: 'loading' as const,
        capabilities: {
          sentimentAnalysis: false,
          textGeneration: false,
          classification: false,
          semanticSearch: false,
          personalization: false,
          offlineMode: true
        }
      };
    }
    
    return this.engine.getStatus();
  }

  getMetadata() {
    if (!this.engine) {
      return {
        name: 'Sovereign AI (Initializing)',
        version: '1.0.0',
        type: 'local' as const,
        privacy: 'full' as const,
        dependencies: []
      };
    }
    
    return this.engine.getMetadata();
  }

  get memory() {
    if (!this.engine) {
      throw new Error('Engine not initialized - call initialize() first');
    }
    return this.engine.memory;
  }

  // Convenience method to switch engines
  async switchEngine(type: 'transformers-cdn' | 'transformers-wasm' | 'custom' | 'templates') {
    this.engine = await aiEngineFactory.createEngineWithFallback(type);
    await this.engine.initialize();
    return this.engine;
  }

  // Get direct access to the underlying engine
  async getDirectEngine(): Promise<ISovereignAI> {
    return this.getEngine();
  }
}

// Export singleton instance for backward compatibility
export const sovereignAI = new SovereignAIProxy();