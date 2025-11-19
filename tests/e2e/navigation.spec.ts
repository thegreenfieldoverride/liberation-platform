import { test, expect } from '@playwright/test';

/**
 * Navigation and Layout E2E Tests
 * 
 * Tests cover:
 * 1. Navigation visibility on all pages
 * 2. Proper spacing (pt-24) on tool pages
 * 3. Breadcrumb functionality
 * 4. Mobile navigation
 */

const toolPages = [
  { path: '/tools/runway-calculator', name: 'Runway Calculator' },
  { path: '/real-hourly-wage', name: 'Real Hourly Wage' },
  { path: '/small-bets-portfolio', name: 'Small Bets Portfolio' },
  { path: '/cognitive-debt-assessment', name: 'Cognitive Debt' },
  { path: '/values-vocation-matcher', name: 'Values' },
  { path: '/insight-engine', name: 'Insight Engine' },
  { path: '/ai-copilot', name: 'AI Copilot' },
];

test.describe('Navigation and Layout', () => {
  test('navigation should be visible and opaque on all tool pages', async ({ page }) => {
    for (const tool of toolPages) {
      await page.goto(tool.path);
      
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      
      // Check that navigation has a background (not transparent)
      const navBg = await nav.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      expect(navBg).not.toBe('rgba(0, 0, 0, 0)');
      expect(navBg).not.toBe('transparent');
    }
  });

  test('all tool pages should have proper top padding to avoid nav overlap', async ({ page }) => {
    const pagesToCheck = [
      '/tools/runway-calculator',
      '/real-hourly-wage',
      '/small-bets-portfolio'
    ];
    
    for (const pagePath of pagesToCheck) {
      await page.goto(pagePath);
      
      // Get the main content container
      const mainContent = page.locator('div[class*="min-h-screen"]').first();
      
      // Check for pt-24 or similar padding
      const paddingTop = await mainContent.evaluate((el) => {
        return window.getComputedStyle(el).paddingTop;
      });
      
      // Convert to pixels (pt-24 is 96px in Tailwind)
      const paddingValue = parseInt(paddingTop);
      expect(paddingValue).toBeGreaterThanOrEqual(80); // At least pt-20 (80px)
    }
  });

  test('breadcrumb links should work on all tool pages', async ({ page }) => {
    const pagesWithBreadcrumbs = [
      '/tools/runway-calculator',
      '/real-hourly-wage',
      '/small-bets-portfolio'
    ];
    
    for (const pagePath of pagesWithBreadcrumbs) {
      await page.goto(pagePath);
      
      const breadcrumb = page.getByRole('link', { name: /back to tools/i });
      await expect(breadcrumb).toBeVisible();
      
      // Verify breadcrumb is not covered by navigation
      const breadcrumbBox = await breadcrumb.boundingBox();
      const navBox = await page.locator('nav').first().boundingBox();
      
      if (breadcrumbBox && navBox) {
        expect(breadcrumbBox.y).toBeGreaterThan(navBox.y + navBox.height);
      }
    }
  });

  test('navigation links should be clickable and visible', async ({ page }) => {
    await page.goto('/');
    
    // Desktop navigation
    const toolsLink = page.locator('a:has-text("Tools")').first();
    await expect(toolsLink).toBeVisible();
    
    await toolsLink.click();
    await expect(page).toHaveURL('/tools');
  });

  test('mobile navigation should work', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Simulate mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
    }
    
    await page.goto('/');
    
    // Find and click mobile menu button
    const mobileMenuButton = page.locator('button').filter({ hasText: /menu/i }).or(
      page.locator('button[aria-label*="menu"]')
    );
    
    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.first().click();
      
      // Menu should be visible
      const toolsLink = page.locator('text=Tools').last();
      await expect(toolsLink).toBeVisible();
      
      // Click a link
      await toolsLink.click();
      await expect(page).toHaveURL('/tools');
    }
  });

  test('logo should link to homepage', async ({ page }) => {
    await page.goto('/tools');
    
    // Click logo
    const logo = page.locator('a[href="/"]').first();
    await logo.click();
    
    await expect(page).toHaveURL('/');
  });

  test('Begin Liberation button should be visible', async ({ page }) => {
    await page.goto('/');
    
    const beginButton = page.locator('text=Begin Liberation');
    await expect(beginButton.first()).toBeVisible();
    
    await beginButton.first().click();
    await expect(page).toHaveURL(/runway-calculator/);
  });

  test('navigation should adapt background on scroll', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav').first();
    
    // Get initial background (might be transparent on hero)
    const initialBg = await nav.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    // Get background after scroll
    const scrolledBg = await nav.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Background should not be fully transparent after scroll
    expect(scrolledBg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('page content should not be hidden by fixed navigation', async ({ page }) => {
    const pages = [
      '/',
      '/tools',
      '/tools/runway-calculator',
      '/about'
    ];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Get first heading
      const firstHeading = page.locator('h1').first();
      if (await firstHeading.count() > 0) {
        await expect(firstHeading).toBeVisible();
        
        // Verify heading is not covered by nav
        const headingBox = await firstHeading.boundingBox();
        const navBox = await page.locator('nav').first().boundingBox();
        
        if (headingBox && navBox) {
          // Heading should be below navigation
          expect(headingBox.y).toBeGreaterThan(navBox.y + navBox.height - 10);
        }
      }
    }
  });
});
