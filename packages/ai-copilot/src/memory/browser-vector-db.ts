/**
 * Browser Vector Database - Client-side semantic search and context storage
 * Enables personalized AI without sending data to servers
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  timestamp: number;
}

export interface SearchResult {
  document: VectorDocument;
  similarity: number;
}

export interface LiberationMemory {
  skillAssessments: VectorDocument[];
  burnoutPatterns: VectorDocument[];
  incomeExperiments: VectorDocument[];
  reflections: VectorDocument[];
  milestones: VectorDocument[];
}

export class BrowserVectorDB {
  private documents: Map<string, VectorDocument> = new Map();
  private embedder: any = null;
  private isInitialized = false;
  private dbName = 'liberation-memory';
  private version = 1;

  constructor() {
    console.log('🧠 Initializing Liberation Memory System...');
  }

  /**
   * Initialize the vector database with embedding model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('📦 Loading embedding model for semantic search...');
      
      // Load a small, fast embedding model
      // all-MiniLM-L6-v2 is 80MB, very fast, good quality
      const transformers = await import('@xenova/transformers');
      const { pipeline } = transformers;
      
      this.embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        {
          quantized: true,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`⬇️ Embedding model: ${Math.round(progress.progress || 0)}%`);
            }
          }
        }
      );

      // Load existing documents from IndexedDB
      await this.loadFromStorage();
      
      this.isInitialized = true;
      console.log(`✅ Liberation Memory ready! ${this.documents.size} memories loaded.`);
    } catch (error) {
      console.error('Failed to initialize vector database:', error);
      throw error;
    }
  }

  /**
   * Add a document with automatic embedding generation
   */
  async addDocument(content: string, metadata: Record<string, any> = {}): Promise<string> {
    await this.initialize();

    const id = this.generateId();
    const embedding = await this.generateEmbedding(content);
    
    const document: VectorDocument = {
      id,
      content,
      embedding,
      metadata,
      timestamp: Date.now()
    };

    this.documents.set(id, document);
    await this.persistToStorage();
    
    console.log(`💾 Added memory: ${content.substring(0, 50)}...`);
    return id;
  }

  /**
   * Semantic search across stored documents
   */
  async search(query: string, k: number = 5, filter?: (doc: VectorDocument) => boolean): Promise<SearchResult[]> {
    await this.initialize();

    if (this.documents.size === 0) {
      return [];
    }

    console.log(`🔍 Searching memories for: "${query}"`);
    
    const queryEmbedding = await this.generateEmbedding(query);
    const results: SearchResult[] = [];

    for (const doc of this.documents.values()) {
      // Apply filter if provided
      if (filter && !filter(doc)) {
        continue;
      }

      const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
      results.push({ document: doc, similarity });
    }

    // Sort by similarity and return top k
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, k);
  }

  /**
   * Add specific liberation context types
   */
  async addSkillAssessment(skills: string[], assessment: string, context?: any): Promise<string> {
    const content = `Skills: ${skills.join(', ')}. Assessment: ${assessment}`;
    return this.addDocument(content, {
      type: 'skill-assessment',
      skills,
      assessment,
      context,
      category: 'skills'
    });
  }

  async addBurnoutPattern(cognitiveDebt: number, triggers: string[], notes: string): Promise<string> {
    const content = `Cognitive debt: ${cognitiveDebt}%. Triggers: ${triggers.join(', ')}. Notes: ${notes}`;
    return this.addDocument(content, {
      type: 'burnout-pattern',
      cognitiveDebt,
      triggers,
      notes,
      category: 'wellbeing'
    });
  }

  async addIncomeExperiment(description: string, outcome: string, amount?: number): Promise<string> {
    const content = `Experiment: ${description}. Outcome: ${outcome}${amount ? `. Amount: $${amount}` : ''}`;
    return this.addDocument(content, {
      type: 'income-experiment',
      description,
      outcome,
      amount,
      category: 'income'
    });
  }

  async addReflection(reflection: string, mood?: string, context?: any): Promise<string> {
    return this.addDocument(reflection, {
      type: 'reflection',
      mood,
      context,
      category: 'reflections'
    });
  }

  async addMilestone(milestone: string, category: string, impact?: string): Promise<string> {
    const content = `Milestone: ${milestone}${impact ? `. Impact: ${impact}` : ''}`;
    return this.addDocument(content, {
      type: 'milestone',
      milestone,
      category: 'milestones',
      subcategory: category,
      impact
    });
  }

  /**
   * Contextual searches for liberation planning
   */
  async findSimilarSkillAssessments(currentSkills: string[]): Promise<SearchResult[]> {
    const query = `Skills: ${currentSkills.join(', ')}`;
    return this.search(query, 5, doc => doc.metadata.type === 'skill-assessment');
  }

  async findBurnoutPatterns(currentTriggers: string[]): Promise<SearchResult[]> {
    const query = `Burnout triggers: ${currentTriggers.join(', ')}`;
    return this.search(query, 5, doc => doc.metadata.type === 'burnout-pattern');
  }

  async findRelevantExperiments(context: string): Promise<SearchResult[]> {
    return this.search(context, 3, doc => doc.metadata.type === 'income-experiment');
  }

  async findMotivationalReflections(currentMood: string): Promise<SearchResult[]> {
    return this.search(`feeling ${currentMood}`, 3, doc => doc.metadata.type === 'reflection');
  }

  /**
   * Generate context-aware insights
   */
  async generatePersonalInsights(currentContext: any): Promise<string[]> {
    const insights: string[] = [];
    
    // Find patterns in skill development
    const skillAssessments = await this.search('skills progress development', 10, 
      doc => doc.metadata.type === 'skill-assessment');
    
    if (skillAssessments.length >= 3) {
      insights.push('📈 You have a consistent pattern of skill development over time');
    }

    // Find burnout recovery patterns
    const burnoutPatterns = await this.search('cognitive debt recovery', 5,
      doc => doc.metadata.type === 'burnout-pattern');
    
    if (burnoutPatterns.length >= 2) {
      const avgCognitiveDebt = burnoutPatterns
        .reduce((sum, result) => sum + (result.document.metadata.cognitiveDebt || 0), 0) / burnoutPatterns.length;
      
      if (avgCognitiveDebt > currentContext.cognitiveDebtPercentage) {
        insights.push('💚 Your cognitive debt has improved compared to your historical average');
      }
    }

    // Find successful income experiments
    const successfulExperiments = await this.search('successful positive outcome', 5,
      doc => doc.metadata.type === 'income-experiment' && 
             doc.metadata.outcome?.toLowerCase().includes('success'));
    
    if (successfulExperiments.length >= 2) {
      insights.push('🎯 You have a track record of successful income diversification experiments');
    }

    return insights;
  }

  /**
   * Export all user data for privacy/backup
   */
  async exportData(): Promise<LiberationMemory> {
    await this.initialize();
    
    const data: LiberationMemory = {
      skillAssessments: [],
      burnoutPatterns: [],
      incomeExperiments: [],
      reflections: [],
      milestones: []
    };

    for (const doc of this.documents.values()) {
      switch (doc.metadata.type) {
        case 'skill-assessment':
          data.skillAssessments.push(doc);
          break;
        case 'burnout-pattern':
          data.burnoutPatterns.push(doc);
          break;
        case 'income-experiment':
          data.incomeExperiments.push(doc);
          break;
        case 'reflection':
          data.reflections.push(doc);
          break;
        case 'milestone':
          data.milestones.push(doc);
          break;
      }
    }

    return data;
  }

  /**
   * Import user data from backup
   */
  async importData(data: LiberationMemory): Promise<void> {
    await this.initialize();
    
    const allDocs = [
      ...data.skillAssessments,
      ...data.burnoutPatterns,
      ...data.incomeExperiments,
      ...data.reflections,
      ...data.milestones
    ];

    for (const doc of allDocs) {
      this.documents.set(doc.id, doc);
    }

    await this.persistToStorage();
    console.log(`📥 Imported ${allDocs.length} memories`);
  }

  /**
   * Clear all data (for privacy)
   */
  async clearAllData(): Promise<void> {
    this.documents.clear();
    await this.persistToStorage();
    console.log('🗑️ All liberation memories cleared');
  }

  /**
   * Private methods
   */
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
      
      // Use IndexedDB for larger storage capacity
      const request = indexedDB.open(this.dbName, this.version);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['documents'], 'readwrite');
          const store = transaction.objectStore('documents');
          
          store.clear(); // Clear existing data
          
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
            store.createIndex('type', 'metadata.type', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
      });
    } catch (error) {
      console.warn('Failed to persist to IndexedDB, falling back to localStorage:', error);
      
      // Fallback to localStorage (with size limits)
      const data = Array.from(this.documents.values());
      localStorage.setItem(`${this.dbName}-documents`, JSON.stringify(data));
    }
  }

  private async loadFromStorage(): Promise<void> {
    try {
      // Try IndexedDB first
      const request = indexedDB.open(this.dbName, this.version);
      
      return new Promise((resolve) => {
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
            const documents = getAllRequest.result as VectorDocument[];
            for (const doc of documents) {
              this.documents.set(doc.id, doc);
            }
            console.log(`📂 Loaded ${documents.length} memories from IndexedDB`);
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
            store.createIndex('type', 'metadata.type', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
      });
    } catch (error) {
      console.warn('IndexedDB not available, using localStorage:', error);
      this.loadFromLocalStorage();
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(`${this.dbName}-documents`);
      if (stored) {
        const documents = JSON.parse(stored) as VectorDocument[];
        for (const doc of documents) {
          this.documents.set(doc.id, doc);
        }
        console.log(`📂 Loaded ${documents.length} memories from localStorage`);
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }

  /**
   * Get storage statistics
   */
  getStats(): { documentCount: number; categories: Record<string, number>; storageSize: string } {
    const categories: Record<string, number> = {};
    
    for (const doc of this.documents.values()) {
      const type = doc.metadata.type || 'unknown';
      categories[type] = (categories[type] || 0) + 1;
    }

    // Estimate storage size
    const dataSize = JSON.stringify(Array.from(this.documents.values())).length;
    const storageSizeKB = Math.round(dataSize / 1024);
    
    return {
      documentCount: this.documents.size,
      categories,
      storageSize: storageSizeKB > 1024 ? `${Math.round(storageSizeKB / 1024)}MB` : `${storageSizeKB}KB`
    };
  }
}

// Singleton instance
export const liberationMemory = new BrowserVectorDB();