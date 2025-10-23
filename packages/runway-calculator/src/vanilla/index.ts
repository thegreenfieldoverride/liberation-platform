// Vanilla JavaScript wrapper for embedding
import { calculateRunway, createDefaultExpenses, updateExpenseAmount, addExpenseCategory, removeExpenseCategory } from '../core/calculator';
import type { ExpenseCategory } from '@greenfieldoverride/types';

interface RunwayCalculatorOptions {
  containerId: string;
  showPrivacyStatement?: boolean;
  theme?: 'light' | 'dark';
  onCalculationChange?: (calculation: any) => void;
}

export class VanillaRunwayCalculator {
  private container: HTMLElement;
  private expenses: ExpenseCategory[] = createDefaultExpenses();
  private savings: number = 0;
  private options: RunwayCalculatorOptions;

  constructor(options: RunwayCalculatorOptions) {
    this.options = options;
    const container = document.getElementById(options.containerId);
    if (!container) {
      throw new Error(`Container with id "${options.containerId}" not found`);
    }
    this.container = container;
    this.init();
  }

  private init() {
    this.render();
    this.attachEventListeners();
  }

  private render() {
    const calculation = calculateRunway({ expenses: this.expenses, savings: this.savings });
    
    this.container.innerHTML = `
      <div class="runway-calculator" style="max-width: 600px; margin: 0 auto; font-family: system-ui, sans-serif;">
        <!-- Header -->
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; font-weight: 300; color: #1f2937; margin-bottom: 0.5rem;">
            Your Runway Calculator
          </h1>
          <p style="color: #6b7280; line-height: 1.6;">
            Transform your financial anxiety into a clear, achievable number. This is your path to freedom.
          </p>
        </div>

        ${this.options.showPrivacyStatement !== false ? `
        <!-- Privacy Statement -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 1rem; margin-bottom: 2rem;">
          <p style="font-size: 0.875rem; color: #166534; margin: 0;">
            🔒 <strong>Your data is yours.</strong> Everything stays in your browser. We don't store, track, or share anything.
          </p>
        </div>
        ` : ''}

        <!-- Expenses -->
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 500; color: #374151; margin-bottom: 1rem;">
            Monthly Essential Expenses
          </h2>
          <div id="expenses-container">
            ${this.renderExpenses()}
          </div>
          <button id="add-expense" style="color: #2563eb; background: none; border: none; font-size: 0.875rem; font-weight: 500; cursor: pointer; margin-top: 0.5rem;">
            + Add another expense
          </button>
        </div>

        <!-- Savings -->
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 500; color: #374151; margin-bottom: 1rem;">
            Current Liquid Savings
          </h2>
          <input 
            type="number" 
            id="savings-input"
            value="${this.savings || ''}"
            placeholder="$0"
            style="width: 100%; padding: 0.75rem 1rem; font-size: 1.125rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;"
          />
          <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">
            Money you can access immediately for your transition
          </p>
        </div>

        <!-- Results -->
        <div style="background: linear-gradient(to right, #eff6ff, #f0fdf4); border-radius: 0.5rem; padding: 1.5rem; text-align: center;">
          <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Your runway to freedom:</p>
          <div style="font-size: 2.5rem; font-weight: 300; color: #1f2937; margin-bottom: 1rem;">
            ${calculation.runwayDisplay}
          </div>
          <p style="color: #6b7280;">
            Real Number: <span style="font-weight: 500;">$${calculation.totalMonthlyExpenses.toLocaleString()}/month</span>
          </p>
          ${calculation.runwayMonths > 0 ? `
          <p style="font-size: 0.875rem; color: #059669; margin-top: 0.75rem;">
            ${calculation.runwayMonths >= 6 
              ? "You have solid breathing room to plan your next move." 
              : calculation.runwayMonths >= 3
              ? "You have time to build your escape plan."
              : "Every day you take action is a day closer to freedom."
            }
          </p>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderExpenses(): string {
    return this.expenses.map(expense => `
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div style="flex: 1;">
          <label style="display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">
            ${expense.name}
          </label>
          <input
            type="number"
            data-expense-id="${expense.id}"
            value="${expense.amount || ''}"
            placeholder="$0"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;"
          />
        </div>
        ${this.expenses.length > 1 ? `
        <button 
          data-remove-expense="${expense.id}"
          style="color: #ef4444; background: none; border: none; font-size: 0.875rem; cursor: pointer; padding: 0.25rem 0.5rem;"
        >
          Remove
        </button>
        ` : ''}
      </div>
    `).join('');
  }

  private attachEventListeners() {
    // Savings input
    const savingsInput = this.container.querySelector('#savings-input') as HTMLInputElement;
    savingsInput?.addEventListener('input', (e) => {
      this.savings = parseFloat((e.target as HTMLInputElement).value) || 0;
      this.updateCalculation();
    });

    // Expense inputs
    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.dataset.expenseId) {
        const amount = parseFloat(target.value) || 0;
        this.expenses = updateExpenseAmount(this.expenses, target.dataset.expenseId, amount);
        this.updateCalculation();
      }
    });

    // Add expense button
    const addButton = this.container.querySelector('#add-expense');
    addButton?.addEventListener('click', () => {
      const name = prompt("What's this expense category?");
      if (name) {
        this.expenses = addExpenseCategory(this.expenses, name, true);
        this.render();
        this.attachEventListeners();
      }
    });

    // Remove expense buttons
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.dataset.removeExpense) {
        this.expenses = removeExpenseCategory(this.expenses, target.dataset.removeExpense);
        this.render();
        this.attachEventListeners();
      }
    });
  }

  private updateCalculation() {
    const calculation = calculateRunway({ expenses: this.expenses, savings: this.savings });
    this.options.onCalculationChange?.(calculation);
    
    // Update just the results section
    const resultsSection = this.container.querySelector('[style*="linear-gradient"]');
    if (resultsSection) {
      resultsSection.innerHTML = `
        <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Your runway to freedom:</p>
        <div style="font-size: 2.5rem; font-weight: 300; color: #1f2937; margin-bottom: 1rem;">
          ${calculation.runwayDisplay}
        </div>
        <p style="color: #6b7280;">
          Real Number: <span style="font-weight: 500;">$${calculation.totalMonthlyExpenses.toLocaleString()}/month</span>
        </p>
        ${calculation.runwayMonths > 0 ? `
        <p style="font-size: 0.875rem; color: #059669; margin-top: 0.75rem;">
          ${calculation.runwayMonths >= 6 
            ? "You have solid breathing room to plan your next move." 
            : calculation.runwayMonths >= 3
            ? "You have time to build your escape plan."
            : "Every day you take action is a day closer to freedom."
          }
        </p>
        ` : ''}
      `;
    }
  }
}

// Global access for script tag usage
(window as any).VanillaRunwayCalculator = VanillaRunwayCalculator;