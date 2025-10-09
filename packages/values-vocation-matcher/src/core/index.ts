/**
 * Values-to-Vocation Matcher Core - Liberation-focused career alignment
 * Export all core functionality for values assessment and vocation matching
 */

export * from './values-assessment';
export * from './vocation-database';
export * from './matching-engine';

// Main API functions for easy integration
export { 
  calculateValueProfile,
  getAssessmentQuestions,
  generateValueInsights
} from './values-assessment';

export {
  VOCATION_DATABASE,
  getVocationsByCategory,
  getVocationsByArrangement,
  getAllCategories,
  getAllWorkArrangements
} from './vocation-database';

export {
  matchVocationsToValues
} from './matching-engine';