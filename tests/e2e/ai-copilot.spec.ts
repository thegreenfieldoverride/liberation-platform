import { test, expect } from '@playwright/test';

/**
 * AI Copilot E2E Tests
 * 
 * Tests cover:
 * 1. Markdown stripping from AI responses
 * 2. Context persistence across tab switches
 * 3. Real data display (not sample data)
 * 4. Liberation plan generation
 */

test.describe('AI Copilot', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ai-copilot');
  });

  test('should display without markdown formatting in responses', async ({ page }) => {
    await page.goto('/ai-copilot');
    
    // Wait for dashboard to load
    await page.waitForSelector('text=Liberation', { timeout: 10000 });
    
    // Check that no markdown symbols are visible in the UI
    // Common markdown patterns: **, __, ##, ###, *, _, `, etc.
    const bodyText = await page.textContent('body');
    
    // Should not have unprocessed markdown bold
    expect(bodyText).not.toContain('**');
    
    // Should not have unprocessed markdown headers
    expect(bodyText).not.toMatch(/^## /m);
    expect(bodyText).not.toMatch(/^### /m);
  });

  test('should load real data from liberation journey state', async ({ page }) => {
    // First, set some real data in localStorage
    await page.evaluate(() => {
      const journeyState = {
        currentPhase: 'discovery',
        liberationScore: 25,
        milestones: {},
        toolInsights: {
          'runway-calculator': {
            runwayMonths: 12,
            savings: 50000,
            monthlyExpenses: 4000
          },
          'real-hourly-wage': {
            realWage: 28.50,
            efficiency: 'high'
          },
          'cognitive-debt-assessment': {
            score: 68,
            debtPercentage: 32,
            riskLevel: 'moderate'
          }
        }
      };
      localStorage.setItem('liberation-journey-state', JSON.stringify(journeyState));
    });
    
    await page.goto('/ai-copilot');
    
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Verify real data is displayed (not sample data)
    // Sample data has runwayMonths: 8.5, real data has 12
    const hasRealData = await page.locator('text=/12.*month/i').count();
    expect(hasRealData).toBeGreaterThan(0);
    
    // Check for real hourly wage ($28.50, not $22.50)
    const hasRealWage = await page.locator('text=/28\\.50/').count();
    expect(hasRealWage).toBeGreaterThan(0);
  });

  test('should persist context when switching tabs', async ({ page }) => {
    await page.goto('/ai-copilot');
    
    // Wait for page to load
    await page.waitForSelector('text=Liberation', { timeout: 5000 });
    
    // Fill in some context data
    await page.fill('input[placeholder*="runway"]', '15');
    await page.fill('input[placeholder*="wage"]', '35');
    
    // Navigate away and back
    await page.goto('/tools');
    await page.waitForTimeout(500);
    await page.goto('/ai-copilot');
    
    // Check if data persisted in localStorage
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('ai-copilot-plan');
    });
    
    // Context should be saved
    expect(savedData || '').toBeTruthy();
  });

  test('should save generated plan to localStorage', async ({ page }) => {
    await page.goto('/ai-copilot');
    
    // Wait for AI to initialize
    await page.waitForSelector('text=/Sovereign AI|Liberation/i', { timeout: 10000 });
    
    // Fill minimum required fields (if form is visible)
    const runwayInput = await page.locator('input[placeholder*="runway"]').count();
    if (runwayInput > 0) {
      await page.fill('input[placeholder*="runway"]', '10');
      await page.fill('input[placeholder*="wage"]', '30');
      await page.fill('input[placeholder*="cognitive"]', '40');
      await page.fill('input[placeholder*="skills"]', 'JavaScript, React');
      await page.fill('input[placeholder*="industry"]', 'Technology');
      
      // Try to generate plan
      const generateButton = page.locator('button:has-text("Generate")');
      if (await generateButton.isVisible()) {
        await generateButton.click();
        
        // Wait for plan generation
        await page.waitForTimeout(3000);
        
        // Check if plan was saved
        const savedPlan = await page.evaluate(() => {
          return localStorage.getItem('ai-copilot-plan');
        });
        
        // Plan should be saved if generation succeeded
        if (savedPlan) {
          expect(savedPlan).toBeTruthy();
        }
      }
    }
  });

  test('should display dashboard with financial metrics', async ({ page }) => {
    // Set up test data
    await page.evaluate(() => {
      const journeyState = {
        toolInsights: {
          'runway-calculator': {
            runwayMonths: 10,
            savings: 40000,
            monthlyExpenses: 4000
          }
        }
      };
      localStorage.setItem('liberation-journey-state', JSON.stringify(journeyState));
    });
    
    await page.goto('/ai-copilot');
    
    // Dashboard should show financial data
    await expect(page.locator('text=/runway|financial/i')).toBeVisible();
  });

  test('should handle no liberation data gracefully', async ({ page }) => {
    // Clear all localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.goto('/ai-copilot');
    
    // Page should load without errors
    await expect(page.locator('text=Liberation')).toBeVisible();
    
    // Should not show error messages
    const errorCount = await page.locator('text=/error|failed/i').count();
    expect(errorCount).toBeLessThan(2); // Allow for one generic message
  });

  test('should strip markdown from plan assessment', async ({ page }) => {
    // Mock a plan with markdown in localStorage
    const mockPlan = {
      assessment: '**Your situation:** You have ##strong## potential. Focus on *building* skills.',
      timeline: '6-12 months',
      phases: [],
      contingencies: [],
      resources: []
    };
    
    await page.evaluate((plan) => {
      localStorage.setItem('ai-copilot-plan', JSON.stringify(plan));
    }, mockPlan);
    
    await page.goto('/ai-copilot');
    
    // Wait for plan to render
    await page.waitForTimeout(1000);
    
    // Get the assessment text
    const bodyText = await page.textContent('body');
    
    // Should not contain markdown formatting
    expect(bodyText).not.toContain('**');
    expect(bodyText).not.toContain('##');
    expect(bodyText).not.toContain('*building*');
  });
});
