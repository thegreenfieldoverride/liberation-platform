import { UserChoice, BridgeBlueprint, InsightEngineState } from '../types/insight-engine';

const STORAGE_KEYS = {
  USER_CHOICES: 'insight-engine-choices',
  BLUEPRINTS: 'insight-engine-blueprints',
  CURRENT_SESSION: 'insight-engine-session',
} as const;

class StorageService {
  private isClient = typeof window !== 'undefined';

  // User Choices
  saveUserChoice(choice: UserChoice): void {
    if (!this.isClient) return;
    
    const existing = this.getUserChoices();
    const updated = [...existing.filter(c => c.id !== choice.id), choice];
    localStorage.setItem(STORAGE_KEYS.USER_CHOICES, JSON.stringify(updated));
  }

  getUserChoices(): UserChoice[] {
    if (!this.isClient) return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_CHOICES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading user choices:', error);
      return [];
    }
  }

  getUserChoice(id: string): UserChoice | null {
    const choices = this.getUserChoices();
    return choices.find(c => c.id === id) || null;
  }

  // Blueprints
  saveBlueprint(blueprint: BridgeBlueprint): void {
    if (!this.isClient) return;
    
    const existing = this.getBlueprints();
    const updated = [...existing.filter(b => b.id !== blueprint.id), blueprint];
    localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(updated));
  }

  getBlueprints(): BridgeBlueprint[] {
    if (!this.isClient) return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BLUEPRINTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading blueprints:', error);
      return [];
    }
  }

  getBlueprint(id: string): BridgeBlueprint | null {
    const blueprints = this.getBlueprints();
    return blueprints.find(b => b.id === id) || null;
  }

  // Current Session
  saveSession(state: Partial<InsightEngineState>): void {
    if (!this.isClient) return;
    
    try {
      const current = this.getSession();
      const updated = { ...current, ...state };
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  getSession(): Partial<InsightEngineState> {
    if (!this.isClient) return {};
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading session:', error);
      return {};
    }
  }

  clearSession(): void {
    if (!this.isClient) return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  // Export/Import functionality
  exportData(): string {
    const data = {
      userChoices: this.getUserChoices(),
      blueprints: this.getBlueprints(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.userChoices || !Array.isArray(data.userChoices)) {
        return { success: false, error: 'Invalid data format: missing userChoices array' };
      }
      
      if (!data.blueprints || !Array.isArray(data.blueprints)) {
        return { success: false, error: 'Invalid data format: missing blueprints array' };
      }

      // Import data
      localStorage.setItem(STORAGE_KEYS.USER_CHOICES, JSON.stringify(data.userChoices));
      localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(data.blueprints));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Cleanup old data
  cleanupOldData(daysToKeep: number = 30): void {
    if (!this.isClient) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Clean old choices
    const choices = this.getUserChoices().filter(choice => 
      new Date(choice.createdAt) > cutoffDate
    );
    localStorage.setItem(STORAGE_KEYS.USER_CHOICES, JSON.stringify(choices));

    // Clean old blueprints
    const blueprints = this.getBlueprints().filter(blueprint => 
      new Date(blueprint.createdAt) > cutoffDate
    );
    localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(blueprints));
  }

  // Clear all data
  clearAllData(): void {
    if (!this.isClient) return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new StorageService();