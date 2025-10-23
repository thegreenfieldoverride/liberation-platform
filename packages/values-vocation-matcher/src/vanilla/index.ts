/**
 * Values-to-Vocation Matcher Vanilla JavaScript Implementation
 * Standalone implementation for non-React environments
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { VocationMatchingResult } from '@greenfieldoverride/types';
import { 
  getAssessmentQuestions,
  calculateValueProfile,
  matchVocationsToValues
} from '../core';

class ValuesVocationMatcherVanilla {
  private container: HTMLElement;
  private currentStep: 'assessment' | 'preferences' | 'results' = 'assessment';
  private responses: Array<{ questionId: string; importance: number }> = [];
  private result: VocationMatchingResult | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    this.render();
  }

  private render() {
    switch (this.currentStep) {
      case 'assessment':
        this.renderAssessment();
        break;
      case 'preferences':
        this.renderPreferences();
        break;
      case 'results':
        this.renderResults();
        break;
    }
  }

  private renderAssessment() {
    const questions = getAssessmentQuestions();
    
    this.container.innerHTML = `
      <div class="values-assessment-vanilla" style="max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">Values Assessment</h1>
          <p style="color: #666; margin-bottom: 2rem;">Discover what truly matters to you in your work and life</p>
          <div id="progress-bar" style="width: 100%; background: #e5e7eb; border-radius: 0.5rem; height: 0.5rem; margin-bottom: 1rem;">
            <div id="progress-fill" style="width: 0%; background: linear-gradient(to right, #3b82f6, #14b8a6); height: 100%; border-radius: 0.5rem; transition: width 0.3s;"></div>
          </div>
          <div id="question-counter" style="color: #666; font-size: 0.875rem;">Question 1 of ${questions.length}</div>
        </div>
        
        <div id="question-container" style="background: white; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; margin-bottom: 2rem;">
          <!-- Question content will be inserted here -->
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button id="prev-btn" style="padding: 0.5rem 1.5rem; background: #f3f4f6; color: #374151; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem; font-weight: 500;">Previous</button>
          <div id="value-indicator" style="color: #666; font-size: 0.875rem;"></div>
          <button id="next-btn" style="padding: 0.5rem 1.5rem; background: linear-gradient(to right, #3b82f6, #14b8a6); color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem; font-weight: 500;">Next</button>
        </div>
      </div>
    `;

    this.renderCurrentQuestion(0);
    this.setupAssessmentEvents();
  }

  private renderCurrentQuestion(questionIndex: number) {
    const questions = getAssessmentQuestions();
    const question = questions[questionIndex];
    const currentResponse = this.responses.find(r => r.questionId === question.id);
    
    const questionContainer = document.getElementById('question-container');
    if (!questionContainer) return;

    questionContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #111827;">${question.scenario}</h3>
        <p style="color: #374151; line-height: 1.6;">${question.description}</p>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <p style="text-align: center; font-size: 0.875rem; font-weight: 500; color: #4b5563;">How important is this to you?</p>
      </div>
      
      <div id="importance-buttons" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem;">
        ${[
          { value: 1, label: 'Not Important', color: '#f3f4f6' },
          { value: 2, label: 'Slightly Important', color: '#fef3c7' },
          { value: 3, label: 'Moderately Important', color: '#fed7aa' },
          { value: 4, label: 'Very Important', color: '#dbeafe' },
          { value: 5, label: 'Extremely Important', color: '#e0e7ff' }
        ].map(({ value, label, color }) => `
          <button 
            data-value="${value}"
            class="importance-btn"
            style="
              padding: 1rem; 
              background: ${currentResponse?.importance === value ? '#3b82f6' : color}; 
              color: ${currentResponse?.importance === value ? 'white' : '#374151'};
              border: ${currentResponse?.importance === value ? '2px solid #1d4ed8' : '1px solid #d1d5db'};
              border-radius: 0.5rem; 
              cursor: pointer; 
              text-align: center; 
              font-size: 0.875rem; 
              font-weight: 500;
              transition: all 0.2s;
            "
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
          >
            <div style="font-size: 1.125rem; font-weight: bold; margin-bottom: 0.25rem;">${value}</div>
            <div style="font-size: 0.75rem;">${label}</div>
          </button>
        `).join('')}
      </div>
    `;

    // Update progress
    const progress = ((questionIndex + 1) / questions.length) * 100;
    const progressFill = document.getElementById('progress-fill');
    const questionCounter = document.getElementById('question-counter');
    const valueIndicator = document.getElementById('value-indicator');
    
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (questionCounter) questionCounter.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    if (valueIndicator) valueIndicator.textContent = `Value: ${question.value.replace('_', ' ')}`;

    // Add click handlers for importance buttons
    const importanceButtons = document.querySelectorAll('.importance-btn');
    importanceButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const value = parseInt((e.target as HTMLElement).dataset.value || '0');
        this.handleImportanceSelect(question.id, value);
        this.renderCurrentQuestion(questionIndex); // Re-render to show selection
      });
    });
  }

  private setupAssessmentEvents() {
    let currentQuestionIndex = 0;
    const questions = getAssessmentQuestions();

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          this.renderCurrentQuestion(currentQuestionIndex);
          this.updateNavButtons(currentQuestionIndex, questions.length);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const currentQuestion = questions[currentQuestionIndex];
        const hasResponse = this.responses.some(r => r.questionId === currentQuestion.id);
        
        if (!hasResponse) return;

        if (currentQuestionIndex < questions.length - 1) {
          currentQuestionIndex++;
          this.renderCurrentQuestion(currentQuestionIndex);
        } else {
          this.currentStep = 'preferences';
          this.render();
        }
        this.updateNavButtons(currentQuestionIndex, questions.length);
      });
    }

    this.updateNavButtons(currentQuestionIndex, questions.length);
  }

  private updateNavButtons(currentIndex: number, totalQuestions: number) {
    const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
    const currentQuestion = getAssessmentQuestions()[currentIndex];
    const hasResponse = this.responses.some(r => r.questionId === currentQuestion.id);

    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    }

    if (nextBtn) {
      nextBtn.disabled = !hasResponse;
      nextBtn.style.opacity = !hasResponse ? '0.5' : '1';
      nextBtn.textContent = currentIndex === totalQuestions - 1 ? 'Complete Assessment' : 'Next';
    }
  }

  private handleImportanceSelect(questionId: string, importance: number) {
    const existingIndex = this.responses.findIndex(r => r.questionId === questionId);
    if (existingIndex >= 0) {
      this.responses[existingIndex] = { questionId, importance };
    } else {
      this.responses.push({ questionId, importance });
    }
  }

  private renderPreferences() {
    this.container.innerHTML = `
      <div class="preferences-vanilla" style="max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem;">Tell us about your preferences</h2>
          <p style="color: #666;">This helps us personalize your career matches</p>
        </div>
        
        <div style="background: white; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; margin-bottom: 2rem;">
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Current Situation</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Current Role (optional)</label>
                <input type="text" id="current-role" placeholder="e.g., Software Developer" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem;">
              </div>
              <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Industry (optional)</label>
                <input type="text" id="industry" placeholder="e.g., Technology" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem;">
              </div>
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Years of Experience</label>
              <input type="number" id="experience" min="0" max="50" value="0" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem;">
            </div>
          </div>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Risk Tolerance</h3>
            <div id="risk-tolerance" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
              ${[
                { value: 'low', label: 'Low Risk', description: 'Prefer stability' },
                { value: 'medium', label: 'Moderate Risk', description: 'Balanced approach' },
                { value: 'high', label: 'High Risk', description: 'Comfortable with uncertainty' }
              ].map(({ value, label, description }) => `
                <button 
                  data-risk="${value}"
                  class="risk-btn"
                  style="
                    padding: 1rem; 
                    text-align: center; 
                    border: 2px solid #d1d5db; 
                    border-radius: 0.5rem; 
                    background: white; 
                    cursor: pointer; 
                    transition: all 0.2s;
                  "
                >
                  <div style="font-weight: 500; font-size: 0.875rem; margin-bottom: 0.25rem;">${label}</div>
                  <div style="font-size: 0.75rem; color: #6b7280;">${description}</div>
                </button>
              `).join('')}
            </div>
          </div>
          
          <div>
            <label style="display: flex; align-items: center; margin-bottom: 1rem;">
              <input type="checkbox" id="prioritize-income" style="margin-right: 0.75rem; width: 1rem; height: 1rem;">
              <span>Prioritize high income potential</span>
            </label>
          </div>
        </div>
        
        <div style="text-align: center;">
          <button id="find-matches-btn" style="padding: 0.75rem 2rem; background: linear-gradient(to right, #3b82f6, #14b8a6); color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-weight: 500;">
            Find My Career Matches
          </button>
        </div>
      </div>
    `;

    this.setupPreferencesEvents();
  }

  private setupPreferencesEvents() {
    let selectedRisk = 'medium';

    // Risk tolerance buttons
    const riskButtons = document.querySelectorAll('.risk-btn');
    riskButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const risk = (e.currentTarget as HTMLElement).dataset.risk || 'medium';
        selectedRisk = risk;
        
        // Update button styles
        riskButtons.forEach(b => {
          (b as HTMLElement).style.borderColor = '#d1d5db';
          (b as HTMLElement).style.background = 'white';
        });
        (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6';
        (e.currentTarget as HTMLElement).style.background = '#eff6ff';
      });
    });

    // Set default selection
    const defaultRiskBtn = document.querySelector('[data-risk="medium"]') as HTMLElement;
    if (defaultRiskBtn) {
      defaultRiskBtn.style.borderColor = '#3b82f6';
      defaultRiskBtn.style.background = '#eff6ff';
    }

    // Find matches button
    const findMatchesBtn = document.getElementById('find-matches-btn');
    if (findMatchesBtn) {
      findMatchesBtn.addEventListener('click', () => {
        const currentRole = (document.getElementById('current-role') as HTMLInputElement)?.value;
        const industry = (document.getElementById('industry') as HTMLInputElement)?.value;
        const experience = parseInt((document.getElementById('experience') as HTMLInputElement)?.value || '0');
        const prioritizeIncome = (document.getElementById('prioritize-income') as HTMLInputElement)?.checked;

        // Calculate value profile
        const valueProfile = calculateValueProfile({
          responses: this.responses,
          currentRole: currentRole || undefined,
          industry: industry || undefined,
          yearsExperience: experience || undefined
        });

        // Generate matches
        this.result = matchVocationsToValues(valueProfile, {
          prioritizeIncome,
          riskTolerance: selectedRisk as 'low' | 'medium' | 'high'
        });

        this.currentStep = 'results';
        this.render();
      });
    }
  }

  private renderResults() {
    if (!this.result) return;

    const { userProfile, topMatches, insights } = this.result;

    this.container.innerHTML = `
      <div class="results-vanilla" style="max-width: 1000px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 2.25rem; font-weight: bold; margin-bottom: 1rem;">Your Career Matches</h2>
          <p style="color: #666; max-width: 600px; margin: 0 auto;">
            Based on your values assessment, here are career paths that align with what truly matters to you.
          </p>
        </div>

        <!-- Value Profile Summary -->
        <div style="background: linear-gradient(to right, #eff6ff, #f0fdfa); border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #bfdbfe; margin-bottom: 2rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Your Top Values</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${userProfile.dominantValues.slice(0, 5).map((value, index) => {
              const valueData = userProfile.coreValues.find(cv => cv.value === value);
              return `
                <span style="
                  padding: 0.25rem 0.75rem; 
                  background: #dbeafe; 
                  color: #1e40af; 
                  border-radius: 9999px; 
                  font-size: 0.875rem; 
                  font-weight: 500;
                ">
                  #${index + 1} ${value.replace('_', ' ')} (${valueData?.percentage.toFixed(0)}%)
                </span>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Top Matches -->
        <div style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Your Best Matches</h3>
          <div style="display: grid; gap: 1rem;">
            ${topMatches.slice(0, 5).map((match, index) => `
              <div style="
                padding: 1.5rem; 
                border-radius: 0.75rem; 
                border: 2px solid #e5e7eb; 
                background: white;
                transition: all 0.2s;
              " onmouseover="this.style.borderColor='#d1d5db'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
                <div style="display: flex; align-items: start; justify-content: space-between;">
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                      <div style="
                        width: 2rem; 
                        height: 2rem; 
                        background: linear-gradient(to right, #3b82f6, #14b8a6); 
                        color: white; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-weight: bold; 
                        font-size: 0.875rem;
                        margin-right: 0.75rem;
                      ">
                        #${index + 1}
                      </div>
                      <h4 style="font-size: 1.125rem; font-weight: 600; margin: 0;">${match.vocation.title}</h4>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.5;">
                      ${match.vocation.description}
                    </p>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                      ${match.vocation.primaryValues.slice(0, 3).map(value => `
                        <span style="
                          padding: 0.25rem 0.5rem; 
                          background: #f3e8ff; 
                          color: #7c3aed; 
                          border-radius: 0.25rem; 
                          font-size: 0.75rem; 
                          font-weight: 500;
                        ">
                          ${value.replace('_', ' ')}
                        </span>
                      `).join('')}
                    </div>

                    <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.875rem;">
                      <div style="display: flex; align-items: center;">
                        <span style="color: #6b7280; margin-right: 0.25rem;">Match:</span>
                        <span style="
                          padding: 0.25rem 0.5rem; 
                          background: ${match.alignmentScore >= 80 ? '#dcfce7' : match.alignmentScore >= 60 ? '#dbeafe' : '#fef3c7'}; 
                          color: ${match.alignmentScore >= 80 ? '#166534' : match.alignmentScore >= 60 ? '#1e40af' : '#a16207'}; 
                          border-radius: 0.25rem; 
                          font-weight: 500;
                        ">
                          ${match.alignmentScore.toFixed(0)}%
                        </span>
                      </div>
                      
                      <div style="display: flex; align-items: center;">
                        <span style="color: #6b7280; margin-right: 0.25rem;">Transition:</span>
                        <span style="
                          padding: 0.25rem 0.5rem; 
                          background: ${
                            match.transitionStrategy.difficulty === 'easy' ? '#dcfce7' :
                            match.transitionStrategy.difficulty === 'moderate' ? '#dbeafe' :
                            match.transitionStrategy.difficulty === 'challenging' ? '#fef3c7' : '#fee2e2'
                          }; 
                          color: ${
                            match.transitionStrategy.difficulty === 'easy' ? '#166534' :
                            match.transitionStrategy.difficulty === 'moderate' ? '#1e40af' :
                            match.transitionStrategy.difficulty === 'challenging' ? '#a16207' : '#dc2626'
                          }; 
                          border-radius: 0.25rem; 
                          font-weight: 500;
                          text-transform: capitalize;
                        ">
                          ${match.transitionStrategy.difficulty}
                        </span>
                      </div>

                      <div style="display: flex; align-items: center;">
                        <span style="color: #6b7280; margin-right: 0.25rem;">Income:</span>
                        <span style="color: #374151; font-weight: 500;">${match.vocation.realityCheck.averageIncome}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Insights -->
        <div style="background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; margin-bottom: 2rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Key Insights</h3>
          
          <div style="margin-bottom: 1rem;">
            <h4 style="font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Values Alignment</h4>
            <p style="color: #6b7280; font-size: 0.875rem;">${insights.valueAlignment}</p>
          </div>

          ${insights.recommendations.length > 0 ? `
            <div>
              <h4 style="font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Recommendations</h4>
              <ul style="margin: 0; padding-left: 1rem;">
                ${insights.recommendations.map(rec => `
                  <li style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.25rem;">${rec}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Restart button -->
        <div style="text-align: center; padding-top: 1.5rem;">
          <button id="restart-btn" style="
            padding: 0.5rem 1.5rem; 
            background: #f3f4f6; 
            color: #6b7280; 
            border: none; 
            border-radius: 0.5rem; 
            cursor: pointer; 
            font-size: 0.875rem;
          ">
            Take Assessment Again
          </button>
        </div>
      </div>
    `;

    // Setup restart functionality
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.currentStep = 'assessment';
        this.responses = [];
        this.result = null;
        this.render();
      });
    }
  }
}

// Export for direct usage
export { ValuesVocationMatcherVanilla };