/**
 * End-to-End Liberation Journey Flow Test
 * Tests complete user journey from first tool use through milestone completion
 */

import { test, expect } from '@playwright/test';

test.describe('Liberation Journey Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
  });

  test('should complete full liberation journey flow across tools', async ({ page }) => {
    // Start at homepage
    await page.goto('/');

    // Step 1: Navigate to runway calculator and enter data
    await page.click('text=Runway Calculator');
    await expect(page).toHaveURL('/tools/runway-calculator');

    // Check that Liberation Journey Widget is visible
    await expect(page.locator('[data-testid="liberation-journey-widget"]')).toBeVisible();

    // Fill in basic financial data
    await page.fill('[placeholder="0"]:nth-of-type(1)', '2000'); // Housing
    await page.fill('[placeholder="0"]:nth-of-type(2)', '600'); // Food
    await page.fill('[placeholder="0"]:nth-of-type(3)', '300'); // Utilities
    await page.fill('input[type="text"]:last-of-type', '15000'); // Savings

    // Check that first milestone is triggered
    await page.waitForTimeout(1000); // Allow time for milestone update
    
    // Expand liberation journey widget to check progress
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=First Step Taken')).toBeVisible();
    await expect(page.locator('text=Basic Info Provided')).toBeVisible();

    // Step 2: Navigate to Real Hourly Wage Calculator
    await page.goto('/real-hourly-wage');
    await expect(page).toHaveURL('/real-hourly-wage');

    // Fill in salary and work information
    await page.fill('input[placeholder*="salary" i]', '60000');
    await page.fill('input[placeholder*="hours" i]', '45');

    // Wait for calculation to complete
    await page.waitForTimeout(1500);

    // Check that real wage milestone is triggered
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=Real Wage Calculated')).toBeVisible();

    // Step 3: Navigate to Cognitive Debt Assessment
    await page.goto('/cognitive-debt-assessment');
    await expect(page).toHaveURL('/cognitive-debt-assessment');

    // Complete the assessment (simulate clicking through questions)
    // Note: This would need to be adapted based on actual assessment structure
    const questions = await page.locator('input[type="radio"]').count();
    for (let i = 0; i < Math.min(questions, 10); i++) {
      await page.locator(`input[type="radio"]:nth-of-type(${(i % 4) + 1})`).click();
    }

    // Submit assessment
    const submitButton = page.locator('button:has-text("Submit"), button:has-text("Complete")').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(1000);
    }

    // Check that cognitive debt milestone is triggered
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=Cognitive Debt Assessed')).toBeVisible();

    // Step 4: Navigate to Values-Vocation Matcher
    await page.goto('/values-vocation-matcher');
    await expect(page).toHaveURL('/values-vocation-matcher');

    // Complete values assessment (simulate)
    const valuesQuestions = await page.locator('input[type="checkbox"], input[type="radio"]').count();
    for (let i = 0; i < Math.min(valuesQuestions, 15); i++) {
      await page.locator(`input[type="checkbox"]:nth-of-type(${(i % 3) + 1}), input[type="radio"]:nth-of-type(${(i % 3) + 1})`).first().click();
    }

    // Submit values assessment
    const valuesSubmit = page.locator('button:has-text("Submit"), button:has-text("Complete"), button:has-text("Find Matches")').first();
    if (await valuesSubmit.isVisible()) {
      await valuesSubmit.click();
      await page.waitForTimeout(1500);
    }

    // Check that values milestone is triggered
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=Values Identified')).toBeVisible();

    // Step 5: Navigate to Insight Engine
    await page.goto('/insight-engine');
    await expect(page).toHaveURL('/insight-engine');

    // Create a strategic insight
    await page.fill('textarea[placeholder*="current situation" i]', 'Working in corporate job, feeling burnt out');
    await page.fill('input[placeholder*="option" i]', 'Stay in current job');
    await page.fill('input[placeholder*="option" i]:nth-of-type(2)', 'Start freelancing');

    // Generate insight
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Create")').first();
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(3000); // Allow time for AI generation
    }

    // Save the insight
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Save Blueprint")');
    if (await saveButton.isVisible()) {
      await saveButton.click();
    }

    // Check that insight milestone is triggered
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=Strategic Insight Generated')).toBeVisible();

    // Make a decision
    const decisionModal = page.locator('button:has-text("Make Decision"), button:has-text("Record Decision")');
    if (await decisionModal.isVisible()) {
      await decisionModal.click();
      await page.check('input[value="A"]'); // Choose option A
      await page.fill('textarea[placeholder*="reasoning" i]', 'Following AI recommendation');
      await page.click('button:has-text("Save My Decision")');
    }

    // Check that decision milestone is triggered
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=First Strategic Decision')).toBeVisible();

    // Step 6: Navigate to Small Bets Portfolio
    await page.goto('/small-bets-portfolio');
    await expect(page).toHaveURL('/small-bets-portfolio');

    // Add a small bet
    const addBetButton = page.locator('button:has-text("Add"), button:has-text("New Bet")').first();
    if (await addBetButton.isVisible()) {
      await addBetButton.click();
      
      await page.fill('input[placeholder*="name" i]', 'Freelance Writing');
      await page.fill('textarea[placeholder*="description" i]', 'Content writing for tech companies');
      await page.fill('input[placeholder*="investment" i]', '500');
      await page.fill('input[placeholder*="revenue" i]', '1000');
      
      await page.click('button:has-text("Save"), button:has-text("Create")');
    }

    // Check that action milestone is triggered
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=Action Initiated')).toBeVisible();

    // Verify overall progress
    const overallScore = await page.locator('[data-testid="overall-score"]').textContent();
    const scoreValue = parseInt(overallScore?.replace('%', '') || '0');
    expect(scoreValue).toBeGreaterThan(20); // Should have significant progress

    // Check phase progression
    const currentPhase = await page.locator('[data-testid="current-phase"]').textContent();
    expect(currentPhase).toMatch(/Planning|Building|Transitioning|Liberated/);

    // Verify achievements
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    const achievements = await page.locator('[data-testid="achievement"]').count();
    expect(achievements).toBeGreaterThan(3);
  });

  test('should persist journey state across sessions', async ({ page }) => {
    // Complete some milestones in one session
    await page.goto('/tools/runway-calculator');
    
    // Fill in data to trigger milestones
    await page.fill('[placeholder="0"]:nth-of-type(1)', '2000');
    await page.fill('input[type="text"]:last-of-type', '10000');
    await page.waitForTimeout(1000);

    // Check initial progress
    await page.click('[aria-label="Expand journey widget"]');
    const initialScore = await page.locator('[data-testid="overall-score"]').textContent();
    const initialPhase = await page.locator('[data-testid="current-phase"]').textContent();

    // Reload page to simulate new session
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify state is preserved
    await page.click('[aria-label="Expand journey widget"]');
    const persistedScore = await page.locator('[data-testid="overall-score"]').textContent();
    const persistedPhase = await page.locator('[data-testid="current-phase"]').textContent();

    expect(persistedScore).toBe(initialScore);
    expect(persistedPhase).toBe(initialPhase);

    // Verify milestones are still completed
    await expect(page.locator('text=First Step Taken')).toBeVisible();
    await expect(page.locator('text=Basic Info Provided')).toBeVisible();
  });

  test('should handle mobile responsive behavior', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');

    // Should show mobile trigger button instead of sidebar
    await expect(page.locator('[aria-label="Open liberation journey"]')).toBeVisible();
    
    // Click to open mobile drawer
    await page.click('[aria-label="Open liberation journey"]');
    await expect(page.locator('text=Liberation Journey')).toBeVisible();

    // Should be able to close by clicking overlay
    await page.click('.fixed .bg-black'); // Overlay
    await expect(page.locator('text=Liberation Journey')).not.toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test with corrupted localStorage
    await page.evaluate(() => {
      localStorage.setItem('liberation-journey-state', 'invalid json');
    });

    await page.goto('/');
    
    // Should still render with default state
    await expect(page.locator('[data-testid="liberation-journey-widget"]')).toBeVisible();
    
    // Should show discovery phase (default)
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=Discovery Phase')).toBeVisible();
  });

  test('should track cross-tool milestone dependencies correctly', async ({ page }) => {
    // Start journey and complete prerequisites for advanced milestones
    await page.goto('/tools/runway-calculator');
    
    // Complete financial milestones first
    await page.fill('[placeholder="0"]:nth-of-type(1)', '2000');
    await page.fill('[placeholder="0"]:nth-of-type(2)', '600');
    await page.fill('input[type="text"]:last-of-type', '15000');
    await page.waitForTimeout(1000);

    // Check that basic milestones are complete
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=Financial Clarity Achieved')).toBeVisible();

    // Now complete values assessment
    await page.goto('/values-vocation-matcher');
    // Simulate completing assessment
    await page.waitForTimeout(2000);

    // Check that planning phase milestones unlock
    await page.click('[aria-label="Expand journey widget"]');
    await expect(page.locator('text=Planning Phase')).toBeVisible();

    // Verify phase progression logic
    const phaseProgress = await page.locator('[data-testid="phase-progress"]').textContent();
    expect(phaseProgress).toMatch(/[1-9]/); // Should show some progress
  });

  test('should reset journey state when requested', async ({ page }) => {
    // Complete some milestones
    await page.goto('/tools/runway-calculator');
    await page.fill('[placeholder="0"]:nth-of-type(1)', '2000');
    await page.fill('input[type="text"]:last-of-type', '10000');
    await page.waitForTimeout(1000);

    // Verify progress exists
    await page.click('[aria-label="Expand journey widget"]');
    const scoreBeforeReset = await page.locator('[data-testid="overall-score"]').textContent();
    expect(parseInt(scoreBeforeReset?.replace('%', '') || '0')).toBeGreaterThan(0);

    // Reset journey (this would typically be a debug/admin function)
    await page.evaluate(() => {
      window.localStorage.removeItem('liberation-journey-state');
    });
    await page.reload();

    // Verify reset to default state
    await page.click('[aria-label="Expand journey widget"]');
    const scoreAfterReset = await page.locator('[data-testid="overall-score"]').textContent();
    expect(scoreAfterReset).toBe('0%');
    expect(page.locator('text=Discovery Phase')).toBeVisible();
  });
});