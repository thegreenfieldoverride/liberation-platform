import { test, expect } from '@playwright/test';

/**
 * Smoke Tests - Basic validation that site loads
 * Run these first to verify Playwright setup
 */

test.describe('Smoke Tests', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('/');
    
    // Should show the site title or logo (use first match)
    await expect(page.locator('text=Greenfield Override').first()).toBeVisible({ timeout: 10000 });
  });

  test('tools page should load', async ({ page }) => {
    await page.goto('/tools');
    
    // Should show tools heading
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });
});
