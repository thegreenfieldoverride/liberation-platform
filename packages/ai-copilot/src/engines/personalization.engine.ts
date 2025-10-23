/**
 * Browser Personalization Engine - Vector database and context management
 * Open source, privacy-first personalization system
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { IPersonalizationEngine } from '../interfaces/ai-engine.interface';
import type { LiberationContext } from '@greenfieldoverride/types';

export interface PersonalDocument {
  id: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, any>;
  timestamp: number;
  category: string;
  type: string;
}

export interface SearchResult {
  content: string;
  metadata: Record<string, any>;
  relevance: number;
}

export class BrowserPersonalizationEngine implements IPersonalizationEngine {
  private documents: Map<string, PersonalDocument> = new Map();
  private embedder: any = null;
  private isInitialized = false;
  private dbName = 'liberation-context';
  private version = 1;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🧠 Initializing Liberation Context Engine...');
      
      // Load embedding model if available
      try {
        if (typeof window !== 'undefined' && (window as any).Transformers) {
          const { pipeline } = (window as any).Transformers;
          this.embedder = await pipeline(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2',
            { quantized: true }
          );
          console.log('✅ Vector search enabled');
        }
      } catch (error) {
        console.log('📝 Vector search not available, using keyword matching');
      }

      await this.loadFromStorage();
      this.isInitialized = true;
      console.log(`✅ Liberation Context ready! ${this.documents.size} contexts loaded.`);
      
    } catch (error) {
      console.error('Failed to initialize personalization engine:', error);
      throw error;
    }
  }

  async addContext(type: string, content: string, metadata: Record<string, any> = {}): Promise<string> {
    await this.initialize();

    const id = this.generateId();
    let embedding: number[] | undefined;
    
    if (this.embedder) {
      try {
        embedding = await this.generateEmbedding(content);
      } catch (error) {
        console.warn('Failed to generate embedding:', error);
      }
    }
    
    const document: PersonalDocument = {
      id,
      content,
      embedding,
      metadata,
      timestamp: Date.now(),
      category: metadata.category || 'general',
      type
    };

    this.documents.set(id, document);
    await this.persistToStorage();
    
    console.log(`💾 Added context: ${type} - ${content.substring(0, 50)}...`);
    return id;
  }

  async searchContext(
    query: string, 
    filters: Record<string, any> = {}
  ): Promise<SearchResult[]> {
    await this.initialize();

    if (this.documents.size === 0) {
      return [];
    }

    console.log(`🔍 Searching context for: "${query}"`);
    
    if (this.embedder) {
      return this.semanticSearch(query, filters);
    } else {
      return this.keywordSearch(query, filters);
    }
  }

  async generateInsights(currentContext: LiberationContext): Promise<string[]> {
    await this.initialize();
    
    const insights: string[] = [];
    
    // Analyze skill development patterns
    const skillDocs = await this.searchContext('skills development progress', { type: 'skill-assessment' });
    if (skillDocs.length >= 3) {
      insights.push('📈 You have a consistent pattern of skill development over time');
    }

    // Analyze burnout patterns
    const burnoutDocs = await this.searchContext('cognitive debt burnout stress', { type: 'burnout-pattern' });
    if (burnoutDocs.length >= 2) {
      insights.push('🔄 Historical data shows recurring stress patterns - consider preventive measures');
    }

    // Analyze successful experiments
    const successDocs = await this.searchContext('successful positive outcome', { type: 'income-experiment' });
    if (successDocs.length >= 2) {
      insights.push('🎯 You have a track record of successful income experiments');
    }

    // Analyze reflection patterns
    const recentReflections = await this.searchContext('motivation progress goals', { 
      type: 'reflection',
      timeframe: 'recent'
    });
    if (recentReflections.length >= 3) {
      insights.push('💭 Your reflection practice shows strong self-awareness');
    }

    // Context-specific insights
    if (currentContext.cognitiveDebtPercentage >= 70) {
      const recoveryDocs = await this.searchContext('recovery rest mental health', { type: 'milestone' });
      if (recoveryDocs.length > 0) {
        insights.push('🌱 You\'ve successfully managed high stress before - apply those same strategies');
      }
    }

    return insights;
  }

  async exportData(): Promise<any> {
    await this.initialize();
    
    const data = {
      version: this.version,
      exportDate: Date.now(),
      documents: Array.from(this.documents.values()),
      stats: this.getStats()
    };

    return data;
  }

  async importData(data: any): Promise<void> {
    await this.initialize();
    
    if (data.documents && Array.isArray(data.documents)) {
      for (const doc of data.documents) {
        this.documents.set(doc.id, doc);
      }
      
      await this.persistToStorage();
      console.log(`📥 Imported ${data.documents.length} contexts`);
    }
  }

  async clearData(): Promise<void> {
    this.documents.clear();
    await this.persistToStorage();
    console.log('🗑️ All liberation contexts cleared');
  }

  getStats(): {
    itemCount: number;
    categories: Record<string, number>;
    storageSize: string;
    lastUpdated: number;
  } {
    const categories: Record<string, number> = {};
    let lastUpdated = 0;
    
    for (const doc of this.documents.values()) {
      const category = doc.category || 'unknown';
      categories[category] = (categories[category] || 0) + 1;
      lastUpdated = Math.max(lastUpdated, doc.timestamp);
    }

    const dataSize = JSON.stringify(Array.from(this.documents.values())).length;
    const storageSizeKB = Math.round(dataSize / 1024);
    
    return {
      itemCount: this.documents.size,
      categories,
      storageSize: storageSizeKB > 1024 ? `${Math.round(storageSizeKB / 1024)}MB` : `${storageSizeKB}KB`,
      lastUpdated
    };
  }

  // Convenience methods for specific context types
  async addSkillAssessment(skills: string[], assessment: string, context?: any): Promise<string> {
    const content = `Skills: ${skills.join(', ')}. Assessment: ${assessment}`;
    return this.addContext('skill-assessment', content, {
      skills,
      assessment,
      context,
      category: 'skills'
    });
  }

  async addBurnoutPattern(cognitiveDebt: number, triggers: string[], notes: string): Promise<string> {
    const content = `Cognitive debt: ${cognitiveDebt}%. Triggers: ${triggers.join(', ')}. Notes: ${notes}`;
    return this.addContext('burnout-pattern', content, {
      cognitiveDebt,
      triggers,
      notes,
      category: 'wellbeing'
    });
  }

  async addIncomeExperiment(description: string, outcome: string, amount?: number): Promise<string> {
    const content = `Experiment: ${description}. Outcome: ${outcome}${amount ? `. Amount: $${amount}` : ''}`;
    return this.addContext('income-experiment', content, {
      description,
      outcome,
      amount,
      category: 'income'
    });
  }

  async addReflection(reflection: string, mood?: string, context?: any): Promise<string> {
    return this.addContext('reflection', reflection, {
      mood,
      context,
      category: 'reflections'
    });
  }

  async addMilestone(milestone: string, category: string, impact?: string): Promise<string> {
    const content = `Milestone: ${milestone}${impact ? `. Impact: ${impact}` : ''}`;
    return this.addContext('milestone', content, {
      milestone,
      category: 'milestones',
      subcategory: category,
      impact
    });
  }

  // Private methods
  private async semanticSearch(query: string, filters: Record<string, any>): Promise<SearchResult[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      const results: SearchResult[] = [];

      for (const doc of this.documents.values()) {
        // Apply filters
        if (!this.matchesFilters(doc, filters)) {
          continue;
        }

        if (doc.embedding) {
          const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
          results.push({
            content: doc.content,
            metadata: doc.metadata,
            relevance: similarity
          });
        }
      }

      results.sort((a, b) => b.relevance - a.relevance);
      return results.slice(0, 10);
      
    } catch (error) {
      console.warn('Semantic search failed, falling back to keyword search:', error);
      return this.keywordSearch(query, filters);
    }
  }

  private keywordSearch(query: string, filters: Record<string, any>): Promise<SearchResult[]> {
    const queryWords = query.toLowerCase().split(/\s+/);
    const results: SearchResult[] = [];

    for (const doc of this.documents.values()) {
      if (!this.matchesFilters(doc, filters)) {
        continue;
      }

      const contentLower = doc.content.toLowerCase();
      let relevance = 0;
      
      for (const word of queryWords) {
        const count = (contentLower.match(new RegExp(word, 'g')) || []).length;
        relevance += count;
      }

      if (relevance > 0) {
        results.push({
          content: doc.content,
          metadata: doc.metadata,
          relevance: relevance / queryWords.length // Normalize by query length
        });
      }
    }

    results.sort((a, b) => b.relevance - a.relevance);
    return Promise.resolve(results.slice(0, 10));
  }

  private matchesFilters(doc: PersonalDocument, filters: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'timeframe' && value === 'recent') {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (doc.timestamp < weekAgo) return false;
      } else if (doc[key as keyof PersonalDocument] !== value && doc.metadata[key] !== value) {
        return false;
      }
    }
    return true;
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const result = await this.embedder(text, {
      pooling: 'mean',
      normalize: true
    });
    
    return Array.from(result.data);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  private async persistToStorage(): Promise<void> {
    try {
      const data = Array.from(this.documents.values());
      
      // Try IndexedDB first
      if (typeof indexedDB !== 'undefined') {
        await this.saveToIndexedDB(data);
      } else {
        this.saveToLocalStorage(data);
      }
    } catch (error) {
      console.warn('Failed to persist data:', error);
    }
  }

  private async saveToIndexedDB(data: PersonalDocument[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['documents'], 'readwrite');
        const store = transaction.objectStore('documents');
        
        store.clear();
        
        for (const doc of data) {
          store.add(doc);
        }
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('documents')) {
          const store = db.createObjectStore('documents', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private saveToLocalStorage(data: PersonalDocument[]): void {
    localStorage.setItem(`${this.dbName}-documents`, JSON.stringify(data));
  }

  private async loadFromStorage(): Promise<void> {
    try {
      if (typeof indexedDB !== 'undefined') {
        await this.loadFromIndexedDB();
      } else {
        this.loadFromLocalStorage();
      }
    } catch (error) {
      console.warn('Failed to load from storage:', error);
      this.loadFromLocalStorage();
    }
  }

  private async loadFromIndexedDB(): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onsuccess = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains('documents')) {
          resolve();
          return;
        }
        
        const transaction = db.transaction(['documents'], 'readonly');
        const store = transaction.objectStore('documents');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          const documents = getAllRequest.result as PersonalDocument[];
          for (const doc of documents) {
            this.documents.set(doc.id, doc);
          }
          console.log(`📂 Loaded ${documents.length} contexts from IndexedDB`);
          resolve();
        };
        
        getAllRequest.onerror = () => {
          this.loadFromLocalStorage();
          resolve();
        };
      };
      
      request.onerror = () => {
        this.loadFromLocalStorage();
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('documents')) {
          const store = db.createObjectStore('documents', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(`${this.dbName}-documents`);
      if (stored) {
        const documents = JSON.parse(stored) as PersonalDocument[];
        for (const doc of documents) {
          this.documents.set(doc.id, doc);
        }
        console.log(`📂 Loaded ${documents.length} contexts from localStorage`);
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }
}