import { test, expect } from '@playwright/test';

/**
 * Small Bets Portfolio E2E Tests
 * 
 * Tests cover:
 * 1. IndexedDB storage (regression test for keyPath error)
 * 2. Navigation visibility and spacing
 * 3. Adding and managing bets
 * 4. Portfolio calculations
 */

test.describe('Small Bets Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.goto('/small-bets-portfolio');
    await page.evaluate(() => {
      localStorage.clear();
      indexedDB.deleteDatabase('liberation-user-context');
    });
    await page.reload();
  });

  test('should display navigation with proper styling and spacing', async ({ page }) => {
    await page.goto('/small-bets-portfolio');
    
    // Check navigation is visible and not transparent
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    
    // Verify navigation has background (not transparent)
    const navBg = await nav.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(navBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(navBg).not.toBe('transparent');
    
    // Verify page content is not covered by nav
    const heading = page.getByRole('heading', { name: 'Small Bets Portfolio Builder' });
    await expect(heading).toBeVisible();
    
    // Check that heading is below the navigation (not covered)
    const headingBox = await heading.boundingBox();
    const navBox = await nav.boundingBox();
    
    expect(headingBox?.y).toBeGreaterThan(navBox ? navBox.y + navBox.height : 0);
  });

  test('should show breadcrumb navigation', async ({ page }) => {
    await page.goto('/small-bets-portfolio');
    
    const breadcrumb = page.getByRole('link', { name: /back to tools/i });
    await expect(breadcrumb).toBeVisible();
    
    await breadcrumb.click();
    await expect(page).toHaveURL('/tools');
  });

  test('should initialize user context in IndexedDB without errors', async ({ page }) => {
    await page.goto('/small-bets-portfolio');
    
    // Wait for component to load
    await page.waitForSelector('text=Small Bets Portfolio', { timeout: 5000 });
    
    // Check that no console errors about IndexedDB keyPath
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit for any errors to appear
    await page.waitForTimeout(2000);
    
    // Filter for IndexedDB-related errors
    const indexedDBErrors = consoleErrors.filter(err => 
      err.includes('IndexedDB') || 
      err.includes('keyPath') || 
      err.includes('DataError')
    );
    
    expect(indexedDBErrors).toHaveLength(0);
  });

  test('should successfully add a small bet to IndexedDB', async ({ page }) => {
    await page.goto('/small-bets-portfolio');
    
    // Navigate to Add Bet tab
    await page.click('text=Add Bet');
    
    // Fill out the form
    await page.fill('input[placeholder*="Freelance Writing"]', 'Test Consulting Service');
    await page.selectOption('select', 'service');
    await page.fill('input[type="number"]', '500');
    await page.fill('textarea', 'Test small bet for consulting services');
    
    // Submit
    await page.click('button:has-text("Add Small Bet")');
    
    // Verify bet was added (should navigate to Bets tab)
    await expect(page.locator('text=Test Consulting Service')).toBeVisible();
    
    // Verify data is in IndexedDB
    const hasData = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const request = indexedDB.open('liberation-user-context');
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['userContext'], 'readonly');
          const store = transaction.objectStore('userContext');
          const getRequest = store.getAll();
          
          getRequest.onsuccess = () => {
            const results = getRequest.result;
            resolve(results.length > 0 && results[0].smallBets?.bets?.length > 0);
          };
          getRequest.onerror = () => resolve(false);
        };
        request.onerror = () => resolve(false);
      });
    });
    
    expect(hasData).toBeTruthy();
  });

  test('should display portfolio metrics', async ({ page }) => {
    await page.goto('/small-bets-portfolio');
    
    // Check for key metrics
    await expect(page.locator('text=Monthly Income')).toBeVisible();
    await expect(page.locator('text=Active Bets')).toBeVisible();
    
    // Metrics should show zero initially
    const monthlyIncome = page.locator('text=$0').first();
    await expect(monthlyIncome).toBeVisible();
  });

  test('should persist bet data across page reloads', async ({ page }) => {
    await page.goto('/small-bets-portfolio');
    
    // Add a bet
    await page.click('text=Add Bet');
    await page.fill('input[placeholder*="Freelance Writing"]', 'Persistent Test Bet');
    await page.click('button:has-text("Add Small Bet")');
    
    // Wait for bet to be saved
    await page.waitForSelector('text=Persistent Test Bet');
    
    // Reload page
    await page.reload();
    
    // Verify bet still exists
    await expect(page.locator('text=Persistent Test Bet')).toBeVisible();
  });

  test('should track liberation journey milestones', async ({ page }) => {
    await page.goto('/small-bets-portfolio');
    
    // Add first bet
    await page.click('text=Add Bet');
    await page.fill('input[placeholder*="Freelance Writing"]', 'First Income Stream');
    await page.click('button:has-text("Add Small Bet")');
    
    // Check localStorage for milestone tracking
    const milestoneData = await page.evaluate(() => {
      const state = localStorage.getItem('liberation-journey-state');
      return state ? JSON.parse(state) : null;
    });
    
    expect(milestoneData).toBeTruthy();
    expect(milestoneData?.milestones).toBeTruthy();
  });

  test('should handle mobile navigation', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }
    
    await page.goto('/small-bets-portfolio');
    
    // On mobile, check for hamburger menu
    const mobileMenuButton = page.locator('button[aria-label*="menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Menu should be visible
      await expect(page.locator('text=Tools')).toBeVisible();
      await expect(page.locator('text=Begin Liberation')).toBeVisible();
    }
  });
});
