/**
 * User Context Storage Engine
 * Privacy-first client-side storage for cross-tool data persistence
 */

import { 
  UserContext, 
  UserIdentity, 
  StorageConfig, 
  UserContextEvent,
  UserDataExport
} from '@greenfieldoverride/types';

export class UserContextStorage {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor(config: Partial<StorageConfig> = {}) {
    this.dbName = config.dbName || 'liberation-user-context';
    this.version = config.version || 1;
  }

  /**
   * Initialize storage - creates IndexedDB stores
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        console.warn('IndexedDB not available, falling back to localStorage');
        resolve();
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ User context storage initialized');
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to initialize user context storage');
        reject(request.error);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('userContext')) {
          const userStore = db.createObjectStore('userContext', { keyPath: 'id' });
          userStore.createIndex('lastUpdated', 'identity.lastUpdated');
        }

        if (!db.objectStoreNames.contains('smallBets')) {
          const betsStore = db.createObjectStore('smallBets', { keyPath: 'id' });
          betsStore.createIndex('status', 'status');
          betsStore.createIndex('category', 'category');
        }

        if (!db.objectStoreNames.contains('sessionData')) {
          db.createObjectStore('sessionData', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Get complete user context
   */
  async getUserContext(): Promise<UserContext | null> {
    if (this.db) {
      return this.getFromIndexedDB();
    } else {
      return this.getFromLocalStorage();
    }
  }

  /**
   * Save complete user context
   */
  async saveUserContext(context: UserContext): Promise<void> {
    context.identity.lastUpdated = new Date();
    
    if (this.db) {
      await this.saveToIndexedDB(context);
    } else {
      this.saveToLocalStorage(context);
    }

    // Notify listeners
    this.emit('context_updated', context);
  }

  /**
   * Update specific section of user context
   */
  async updateContext<T extends keyof UserContext>(
    section: T, 
    data: Partial<UserContext[T]>
  ): Promise<void> {
    const context = await this.getUserContext();
    if (!context) {
      throw new Error('No user context found. Initialize context first.');
    }

    // Merge data
    if (typeof context[section] === 'object' && context[section] !== null) {
      context[section] = { ...(context[section] as any), ...data } as UserContext[T];
    } else {
      context[section] = data as UserContext[T];
    }
    context.identity.lastUpdated = new Date();

    await this.saveUserContext(context);
  }

  /**
   * Create new user context with identity
   */
  async createUserContext(preferences: UserIdentity['preferences'] = {
    theme: 'auto',
    privacy: 'standard',
    dataRetention: 'persistent'
  }): Promise<UserContext> {
    const identity: UserIdentity = {
      id: this.generateUserId(),
      createdAt: new Date(),
      lastUpdated: new Date(),
      preferences
    };

    const context: UserContext = {
      identity,
      financial: {},
      career: {},
      smallBets: {
        bets: [],
        totalInvestment: 0,
        totalRevenue: 0,
        totalProfit: 0,
        averageHoursPerWeek: 0,
        portfolioMetrics: {
          diversificationScore: 0,
          riskLevel: 'low',
          monthlyBurnRate: 0,
          monthlyIncome: 0,
          runway: 0
        },
        goals: [],
        lastUpdated: new Date()
      },
      ai: {
        learningContext: [],
        preferences: [],
        conversationHistory: [],
        customPrompts: []
        // TODO: Add insightDecisions once types are properly distributed
      },
      liberationScore: 0,
      liberationPhase: 'discovery',
      dataVersion: '1.0.0'
    };

    await this.saveUserContext(context);
    return context;
  }

  /**
   * Export user data for backup/transfer
   */
  async exportUserData(): Promise<UserDataExport> {
    const context = await this.getUserContext();
    if (!context) {
      throw new Error('No user context to export');
    }

    const exportData: UserDataExport = {
      version: '1.0.0',
      exportedAt: new Date(),
      userContext: context,
      metadata: {
        toolsUsed: this.getUsedTools(context),
        totalDataSize: JSON.stringify(context).length,
        checksum: this.generateChecksum(context)
      }
    };

    return exportData;
  }

  /**
   * Import user data from backup
   */
  async importUserData(exportData: UserDataExport): Promise<void> {
    // Validate checksum
    const expectedChecksum = this.generateChecksum(exportData.userContext);
    if (expectedChecksum !== exportData.metadata.checksum) {
      throw new Error('Data integrity check failed');
    }

    exportData.userContext.imported = true;
    exportData.userContext.identity.lastUpdated = new Date();
    
    await this.saveUserContext(exportData.userContext);
  }

  /**
   * Event system for cross-tool communication
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Private storage methods
  private async getFromIndexedDB(): Promise<UserContext | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userContext'], 'readonly');
      const store = transaction.objectStore('userContext');
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result;
        if (results.length > 0) {
          // Remove the top-level id field (it's a duplicate of identity.id)
          const { id, ...context } = results[0];
          resolve(context as UserContext);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async saveToIndexedDB(context: UserContext): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userContext'], 'readwrite');
      const store = transaction.objectStore('userContext');
      
      // Add top-level id field for IndexedDB keyPath compatibility
      const contextWithId = {
        ...context,
        id: context.identity.id
      };
      
      store.clear();
      store.add(contextWithId);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  private getFromLocalStorage(): UserContext | null {
    try {
      const stored = localStorage.getItem('liberation-user-context');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.reviveDates(parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.warn('Failed to load user context from localStorage:', error);
      return null;
    }
  }

  private saveToLocalStorage(context: UserContext): void {
    try {
      localStorage.setItem('liberation-user-context', JSON.stringify(context));
    } catch (error) {
      console.warn('Failed to save user context to localStorage:', error);
    }
  }

  private reviveDates(obj: any): void {
    const dateKeys = ['createdAt', 'lastUpdated', 'startDate', 'targetDate', 'completedDate', 'timestamp'];
    
    const revive = (current: any) => {
      if (typeof current === 'object' && current !== null) {
        for (const key in current) {
          if (dateKeys.includes(key) && typeof current[key] === 'string') {
            current[key] = new Date(current[key]);
          } else if (typeof current[key] === 'object') {
            revive(current[key]);
          }
        }
      }
    };
    
    revive(obj);
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  private getUsedTools(context: UserContext): string[] {
    const tools: string[] = [];
    
    if (Object.keys(context.financial).length > 0) {
      tools.push('runway-calculator', 'real-hourly-wage', 'cognitive-debt-assessment');
    }
    if (Object.keys(context.career).length > 0) {
      tools.push('values-vocation-matcher');
    }
    if (context.smallBets.bets.length > 0) {
      tools.push('small-bets-portfolio');
    }
    if (context.ai.conversationHistory.length > 0) {
      tools.push('ai-copilot');
    }
    
    return tools;
  }

  private generateChecksum(context: UserContext): string {
    const str = JSON.stringify(context);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}