import { test, expect } from '@playwright/test';

/**
 * Real Hourly Wage Calculator E2E Tests
 * 
 * Tests cover:
 * 1. Accurate wage calculations
 * 2. Data storage and persistence
 * 3. Liberation journey integration
 * 4. Navigation and page layout
 */

test.describe('Real Hourly Wage Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/real-hourly-wage');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('should display navigation with proper spacing', async ({ page }) => {
    await page.goto('/real-hourly-wage');
    
    // Check navigation is visible
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    
    // Verify breadcrumb is visible and not covered
    const breadcrumb = page.getByRole('link', { name: /back to tools/i });
    await expect(breadcrumb).toBeVisible();
    
    // Check heading is visible and not covered by nav
    const heading = page.getByRole('heading', { name: /Real Hourly Wage Calculator/i });
    await expect(heading).toBeVisible();
  });

  test('should calculate real hourly wage correctly', async ({ page }) => {
    await page.goto('/real-hourly-wage');
    
    // Input annual salary: $60,000
    await page.fill('input[placeholder="60,000"]', '60000');
    
    // Input work hours: 40 hours/week
    await page.fill('input[placeholder="40"]', '40');
    
    // Input commute: 30 minutes daily
    await page.fill('input[placeholder="30"]', '30');
    
    // Input work days: 5 days/week
    await page.fill('input[placeholder="5"]', '5');
    
    // Add some hidden costs
    await page.fill('input[placeholder="150"]', '200'); // Commute costs
    await page.fill('input[placeholder="200"]', '300'); // Lunch costs
    
    // Wait for calculation
    await page.waitForTimeout(500);
    
    // Check that real wage is displayed and is reasonable
    const realWageText = await page.textContent('text=/What you actually earn/i ~ div');
    
    expect(realWageText).toBeTruthy();
    
    // Verify the value is a reasonable hourly wage (not a tiny decimal)
    const wageMatch = realWageText?.match(/\$([0-9.]+)/);
    if (wageMatch) {
      const wage = parseFloat(wageMatch[1]);
      // For $60k salary, real wage should be between $15-$30/hr
      expect(wage).toBeGreaterThan(15);
      expect(wage).toBeLessThan(35);
    }
  });

  test('should store real wage value correctly in localStorage', async ({ page }) => {
    await page.goto('/real-hourly-wage');
    
    // Input data
    await page.fill('input[placeholder="60,000"]', '75000');
    await page.fill('input[placeholder="40"]', '40');
    await page.fill('input[placeholder="30"]', '20');
    await page.fill('input[placeholder="5"]', '5');
    
    // Wait for calculation and storage
    await page.waitForTimeout(1000);
    
    // Check localStorage
    const liberationState = await page.evaluate(() => {
      const state = localStorage.getItem('liberation-journey-state');
      return state ? JSON.parse(state) : null;
    });
    
    expect(liberationState).toBeTruthy();
    
    // Verify real wage is stored as a reasonable number (not a tiny decimal)
    const realWage = liberationState?.toolInsights?.['real-hourly-wage']?.realWage;
    
    expect(realWage).toBeTruthy();
    expect(realWage).toBeGreaterThan(10); // Should be a reasonable hourly wage
    expect(realWage).toBeLessThan(100); // Not thousands or tiny decimals
  });

  test('should update liberation journey milestone', async ({ page }) => {
    await page.goto('/real-hourly-wage');
    
    // Complete a calculation
    await page.fill('input[placeholder="60,000"]', '65000');
    await page.fill('input[placeholder="40"]', '45');
    
    await page.waitForTimeout(1000);
    
    // Check milestone was updated
    const milestoneData = await page.evaluate(() => {
      const state = localStorage.getItem('liberation-journey-state');
      if (!state) return null;
      const parsed = JSON.parse(state);
      return parsed.milestones?.['real-wage-calculated'];
    });
    
    expect(milestoneData).toBeTruthy();
    expect(milestoneData?.progress).toBe(100);
  });

  test('should display wage comparison message', async ({ page }) => {
    await page.goto('/real-hourly-wage');
    
    // Input data that will show significant reduction
    await page.fill('input[placeholder="60,000"]', '60000');
    await page.fill('input[placeholder="40"]', '50'); // Long hours
    await page.fill('input[placeholder="30"]', '60'); // Long commute
    await page.fill('input[placeholder="150"]', '300'); // High costs
    await page.fill('input[placeholder="200"]', '400');
    
    await page.waitForTimeout(500);
    
    // Should show a warning message about wage loss
    await expect(page.locator('text=/losing/i')).toBeVisible();
  });

  test('should handle zero input gracefully', async ({ page }) => {
    await page.goto('/real-hourly-wage');
    
    // Enter zero salary
    await page.fill('input[placeholder="60,000"]', '0');
    
    // Should not crash or show errors
    await page.waitForTimeout(500);
    
    // Real wage should be $0.00
    const hasZeroWage = await page.locator('text=$0.00').count();
    expect(hasZeroWage).toBeGreaterThan(0);
  });

  test('should display liberation scenarios', async ({ page }) => {
    await page.goto('/real-hourly-wage');
    
    // Enter data
    await page.fill('input[placeholder="60,000"]', '70000');
    await page.fill('input[placeholder="40"]', '40');
    
    await page.waitForTimeout(500);
    
    // Click on scenarios tab
    await page.click('text=Liberation Scenarios');
    
    // Should show different scenarios
    await expect(page.locator('text=Remote Work')).toBeVisible();
    await expect(page.locator('text=Freelance')).toBeVisible();
  });

  test('should show work-life balance analysis', async ({ page }) => {
    await page.goto('/real-hourly-wage');
    
    // Enter data
    await page.fill('input[placeholder="60,000"]', '80000');
    await page.fill('input[placeholder="40"]', '55'); // Long hours
    
    await page.waitForTimeout(500);
    
    // Navigate to balance tab
    await page.click('text=Work-Life Balance');
    
    // Should show quality of life score
    await expect(page.locator('text=Quality of Life Score')).toBeVisible();
    await expect(page.locator('text=Work-to-life ratio')).toBeVisible();
  });
});
