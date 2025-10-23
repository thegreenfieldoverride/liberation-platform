import type { CognitiveDebtResponse, CognitiveDebtResult } from '@greenfieldoverride/types';
import { 
  createAssessmentQuestions, 
  calculateCognitiveDebt, 
  getCategoryDisplayName,
  getCategoryDescription
} from '../core';

export interface CognitiveDebtAssessmentConfig {
  containerId: string;
  onResult?: (result: CognitiveDebtResult) => void;
  theme?: 'light' | 'dark';
}

export class CognitiveDebtAssessmentWidget {
  private container: HTMLElement;
  private config: CognitiveDebtAssessmentConfig;
  private questions = createAssessmentQuestions();
  private currentQuestionIndex = 0;
  private responses: CognitiveDebtResponse[] = [];
  private result: CognitiveDebtResult | null = null;

  constructor(config: CognitiveDebtAssessmentConfig) {
    this.config = config;
    const container = document.getElementById(config.containerId);
    if (!container) {
      throw new Error(`Container with id "${config.containerId}" not found`);
    }
    this.container = container;
    this.render();
  }

  private render() {
    if (this.result) {
      this.renderResults();
    } else {
      this.renderQuestion();
    }
  }

  private renderQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;

    this.container.innerHTML = `
      <div class="cognitive-debt-assessment" style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Progress Bar -->
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">
            <span>Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</span>
            <span>${Math.round(progress)}% complete</span>
          </div>
          <div style="width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 8px;">
            <div style="background-color: #2563eb; height: 8px; border-radius: 9999px; transition: width 0.3s ease; width: ${progress}%;"></div>
          </div>
        </div>

        <!-- Question -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 600; color: #111827; margin-bottom: 1rem; line-height: 1.4;">
            ${question.question}
          </h2>
          ${question.description ? `
            <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 0;">
              ${question.description}
            </p>
          ` : ''}
        </div>

        <!-- Response Options -->
        <div style="margin-bottom: 2rem;">
          <p style="font-size: 0.875rem; color: #6b7280; text-align: center; margin-bottom: 1rem;">
            How often do you experience this?
          </p>
          <div style="display: grid; gap: 0.75rem;">
            ${[0, 1, 2, 3, 4].map(score => `
              <button 
                onclick="window.cognitiveDebtWidget.handleResponse(${score})"
                style="padding: 1rem; text-align: left; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: white; cursor: pointer; transition: all 0.2s;"
                onmouseover="this.style.borderColor='#93c5fd'; this.style.backgroundColor='#eff6ff';"
                onmouseout="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='white';"
              >
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 500; color: #111827;">
                    ${this.getScoreLabel(score)}
                  </span>
                  <div style="display: flex; gap: 0.25rem;">
                    ${[...Array(5)].map((_, i) => `
                      <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${i <= score ? '#2563eb' : '#e5e7eb'};"></div>
                    `).join('')}
                  </div>
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Navigation -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
          <button 
            onclick="window.cognitiveDebtWidget.previousQuestion()"
            ${this.currentQuestionIndex === 0 ? 'disabled' : ''}
            style="padding: 0.5rem 1.5rem; color: #6b7280; background: none; border: none; cursor: ${this.currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentQuestionIndex === 0 ? '0.5' : '1'};"
          >
            Previous
          </button>
          <span style="font-size: 0.875rem; color: #6b7280;">
            Privacy-first assessment • Data stays in your browser
          </span>
        </div>
      </div>
    `;

    // Make methods available globally for onclick handlers
    (window as any).cognitiveDebtWidget = this;
  }

  private renderResults() {
    if (!this.result) return;

    const riskColors = {
      low: { text: '#059669', bg: '#ecfdf5', border: '#bbf7d0' },
      moderate: { text: '#d97706', bg: '#fffbeb', border: '#fed7aa' },
      high: { text: '#ea580c', bg: '#fff7ed', border: '#fdba74' },
      critical: { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
    };

    const colors = riskColors[this.result.riskLevel];

    this.container.innerHTML = `
      <div class="cognitive-debt-results" style="max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 1rem;">
            Your Cognitive Debt Assessment
          </h2>
          <div style="display: inline-block; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: 2px solid ${colors.border}; background-color: ${colors.bg};">
            <span style="font-size: 1.125rem; font-weight: 600; color: ${colors.text}; text-transform: capitalize;">
              ${this.result.riskLevel} Risk Level
            </span>
            <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">
              ${this.result.percentageScore.toFixed(1)}% cognitive debt
            </div>
          </div>
        </div>

        <!-- Message -->
        <div style="padding: 1.5rem; border-radius: 0.5rem; border: 2px solid ${colors.border}; background-color: ${colors.bg}; margin-bottom: 2rem;">
          <p style="font-size: 1.125rem; line-height: 1.6; color: #374151; margin: 0;">
            ${this.result.message}
          </p>
        </div>

        <!-- Primary Concerns -->
        ${this.result.primaryConcerns.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 1rem;">Primary Areas of Concern</h3>
            <div style="display: grid; gap: 1rem;">
              ${this.result.primaryConcerns.map(concern => `
                <div style="padding: 1rem; background-color: #f9fafb; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h4 style="font-weight: 500; color: #111827; margin: 0;">
                      ${getCategoryDisplayName(concern)}
                    </h4>
                    <span style="font-size: 0.875rem; font-weight: 500; color: #6b7280;">
                      ${this.result!.categoryScores[concern].percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">
                    ${getCategoryDescription(concern)}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Recommendations -->
        ${this.result.recommendations.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 1rem;">Recommendations</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${this.result.recommendations.map(rec => `
                <li style="display: flex; align-items: flex-start; margin-bottom: 0.5rem;">
                  <span style="color: #2563eb; margin-right: 0.75rem; margin-top: 0.25rem;">•</span>
                  <span style="color: #374151;">${rec}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Restart Button -->
        <div style="text-align: center; padding-top: 1.5rem;">
          <button
            onclick="window.cognitiveDebtWidget.restart()"
            style="padding: 0.75rem 1.5rem; background-color: #374151; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;"
            onmouseover="this.style.backgroundColor='#4b5563';"
            onmouseout="this.style.backgroundColor='#374151';"
          >
            Take Assessment Again
          </button>
        </div>
      </div>
    `;
  }

  public handleResponse(score: number) {
    const question = this.questions[this.currentQuestionIndex];
    const newResponse: CognitiveDebtResponse = {
      questionId: question.id,
      score
    };
    
    this.responses.push(newResponse);
    
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.render();
    } else {
      // Assessment complete
      this.result = calculateCognitiveDebt({ responses: this.responses });
      this.config.onResult?.(this.result);
      this.render();
    }
  }

  public previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.responses.pop(); // Remove the last response
      this.render();
    }
  }

  public restart() {
    this.currentQuestionIndex = 0;
    this.responses = [];
    this.result = null;
    this.render();
  }

  private getScoreLabel(score: number): string {
    const labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
    return labels[score] || '';
  }
}

// Export for direct use
export function createCognitiveDebtAssessment(config: CognitiveDebtAssessmentConfig): CognitiveDebtAssessmentWidget {
  return new CognitiveDebtAssessmentWidget(config);
}