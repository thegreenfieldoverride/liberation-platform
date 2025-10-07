/**
 * AI Engine Factory - Creates appropriate AI engines based on environment and config
 * Handles fallbacks, compatibility detection, and engine selection
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { 
  IAIEngineFactory, 
  ISovereignAI, 
  AIEngineConfig, 
  AICapabilities 
} from '../interfaces/ai-engine.interface';

export class AIEngineFactory implements IAIEngineFactory {
  private static instance: AIEngineFactory;
  
  public static getInstance(): AIEngineFactory {
    if (!AIEngineFactory.instance) {
      AIEngineFactory.instance = new AIEngineFactory();
    }
    return AIEngineFactory.instance;
  }

  /**
   * Create the best available AI engine for current environment
   */
  async createEngine(config?: Partial<AIEngineConfig>): Promise<ISovereignAI> {
    const finalConfig = config ? 
      { ...await this.detectBestEngine(), ...config } : 
      await this.detectBestEngine();

    console.log(`🏭 Creating AI engine: ${finalConfig.name} (${finalConfig.type})`);

    switch (finalConfig.type) {
      case 'transformers-cdn':
        const { TransformersCDNEngine } = await import('./transformers-cdn.engine');
        return new TransformersCDNEngine(finalConfig);
        
      case 'transformers-wasm':
        const { TransformersWASMEngine } = await import('./transformers-wasm.engine');
        return new TransformersWASMEngine(finalConfig);
        
      case 'custom':
        const { CustomAIEngine } = await import('./custom-ai.engine');
        return new CustomAIEngine(finalConfig);
        
      case 'templates':
      default:
        const { TemplateAIEngine } = await import('./template-ai.engine');
        return new TemplateAIEngine(finalConfig);
    }
  }

  /**
   * List all available engine configurations
   */
  listAvailableEngines(): AIEngineConfig[] {
    const baseCapabilities: AICapabilities = {
      sentimentAnalysis: false,
      textGeneration: false,
      classification: false,
      semanticSearch: false,
      personalization: true, // All engines support basic personalization
      offlineMode: true
    };

    return [
      {
        name: 'Transformers.js CDN',
        type: 'transformers-cdn',
        privacy: 'full',
        capabilities: {
          ...baseCapabilities,
          sentimentAnalysis: true,
          classification: true,
          semanticSearch: true
        },
        initialization: {
          fallbackToTemplates: true,
          maxInitTime: 30000
        },
        personalization: {
          enabled: true,
          storage: 'indexeddb',
          vectorSearch: true
        }
      },
      {
        name: 'Transformers.js WASM',
        type: 'transformers-wasm',
        privacy: 'full',
        capabilities: {
          ...baseCapabilities,
          sentimentAnalysis: true,
          textGeneration: true,
          classification: true,
          semanticSearch: true
        },
        initialization: {
          fallbackToTemplates: true,
          maxInitTime: 60000
        },
        personalization: {
          enabled: true,
          storage: 'indexeddb',
          vectorSearch: true
        }
      },
      {
        name: 'Custom Sovereign AI',
        type: 'custom',
        privacy: 'full',
        capabilities: {
          ...baseCapabilities,
          sentimentAnalysis: true,
          textGeneration: true,
          classification: true,
          semanticSearch: true
        },
        initialization: {
          fallbackToTemplates: false,
          maxInitTime: 45000
        },
        personalization: {
          enabled: true,
          storage: 'indexeddb',
          vectorSearch: true
        }
      },
      {
        name: 'Smart Templates',
        type: 'templates',
        privacy: 'full',
        capabilities: baseCapabilities,
        initialization: {
          fallbackToTemplates: false,
          maxInitTime: 2000
        },
        personalization: {
          enabled: true,
          storage: 'localstorage',
          vectorSearch: false
        }
      }
    ];
  }

  /**
   * Detect the best AI engine for current environment
   */
  async detectBestEngine(): Promise<AIEngineConfig> {
    const available = this.listAvailableEngines();
    
    // Environment detection
    const hasWebAssembly = typeof WebAssembly !== 'undefined';
    const hasIndexedDB = typeof indexedDB !== 'undefined';
    const hasWebGPU = 'gpu' in navigator;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isSlowConnection = 'connection' in navigator && 
      (navigator as any).connection?.effectiveType?.includes('2g');

    console.log('🔍 Environment detection:', {
      hasWebAssembly,
      hasIndexedDB,
      hasWebGPU,
      isMobile,
      isSlowConnection
    });

    // Selection logic
    if (isSlowConnection || isMobile) {
      console.log('📱 Mobile/slow connection detected, using templates');
      return available.find(e => e.type === 'templates')!;
    }

    if (hasWebAssembly && hasIndexedDB && !isMobile) {
      console.log('🚀 Full capabilities detected, using CDN Transformers');
      return available.find(e => e.type === 'transformers-cdn')!;
    }

    if (hasWebAssembly) {
      console.log('⚡ WebAssembly detected, using basic Transformers');
      return available.find(e => e.type === 'transformers-wasm')!;
    }

    console.log('📋 Limited environment, using smart templates');
    return available.find(e => e.type === 'templates')!;
  }

  /**
   * Test if a specific engine type is available
   */
  async testEngineAvailability(type: AIEngineConfig['type']): Promise<boolean> {
    try {
      switch (type) {
        case 'transformers-cdn':
          // Test if we can load from CDN
          const response = await fetch('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js', 
            { method: 'HEAD' });
          return response.ok;
          
        case 'transformers-wasm':
          // Test WebAssembly availability
          return typeof WebAssembly !== 'undefined';
          
        case 'custom':
          // Test if custom engine is built
          try {
            await import('./custom-ai.engine');
            return true;
          } catch {
            return false;
          }
          
        case 'templates':
          // Templates are always available
          return true;
          
        default:
          return false;
      }
    } catch (error) {
      console.warn(`Engine ${type} availability test failed:`, error);
      return false;
    }
  }

  /**
   * Create engine with automatic fallback
   */
  async createEngineWithFallback(preferredType?: AIEngineConfig['type']): Promise<ISovereignAI> {
    const available = this.listAvailableEngines();
    
    // Try preferred type first
    if (preferredType) {
      const preferred = available.find(e => e.type === preferredType);
      if (preferred && await this.testEngineAvailability(preferredType)) {
        try {
          return await this.createEngine(preferred);
        } catch (error) {
          console.warn(`Failed to create preferred engine ${preferredType}:`, error);
        }
      }
    }

    // Try detected best engine
    try {
      const bestConfig = await this.detectBestEngine();
      if (await this.testEngineAvailability(bestConfig.type)) {
        return await this.createEngine(bestConfig);
      }
    } catch (error) {
      console.warn('Failed to create detected best engine:', error);
    }

    // Fallback to templates (always works)
    console.log('🔄 Falling back to template engine');
    const templateConfig = available.find(e => e.type === 'templates')!;
    return await this.createEngine(templateConfig);
  }

  /**
   * Get engine recommendation based on use case
   */
  getEngineRecommendation(useCase: 'development' | 'production' | 'privacy-first' | 'performance'): AIEngineConfig {
    const available = this.listAvailableEngines();
    
    switch (useCase) {
      case 'development':
        // Fast iteration, good debugging
        return available.find(e => e.type === 'templates') || available[0];
        
      case 'production':
        // Best user experience
        return available.find(e => e.type === 'transformers-cdn') || available[0];
        
      case 'privacy-first':
        // Maximum privacy, no external dependencies
        return available.find(e => e.type === 'custom') || 
               available.find(e => e.type === 'transformers-wasm') || 
               available[0];
        
      case 'performance':
        // Best performance regardless of setup complexity
        return available.find(e => e.type === 'transformers-wasm') || available[0];
        
      default:
        return available[0];
    }
  }
}

// Export singleton instance
export const aiEngineFactory = AIEngineFactory.getInstance();