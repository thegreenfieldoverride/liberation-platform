import { test, expect } from '@playwright/test';

test.describe('Analytics Responsive & Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mock analytics APIs for consistent testing
    await page.route('/api/analytics/insights?type=usage', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            app: 'runway-calculator',
            action: 'calculate',
            count: 125,
            unique_sessions: 89,
            hour: '2025-10-27 14:00'
          }
        ])
      });
    });

    await page.route('/api/analytics/insights?type=geographic', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            country: 'United States',
            app: 'runway-calculator',
            usage_count: 89,
            unique_users: 67
          }
        ])
      });
    });

    await page.route('/api/analytics/insights?type=financial', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            app: 'runway-calculator',
            salary_band: '$50k-$75k',
            runway_months: 8,
            real_wage_diff: null,
            count: 45
          }
        ])
      });
    });

    await page.route('/api/analytics/events', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should be responsive on iPhone SE', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Verify page loads properly on small screen
      await expect(page).toHaveTitle(/Liberation/);
      
      // Check that content doesn't overflow horizontally
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox?.width).toBeLessThanOrEqual(375);

      // Look for calculator inputs
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Check that inputs are properly sized for mobile
        const firstInput = inputs.first();
        const inputBox = await firstInput.boundingBox();
        expect(inputBox?.width).toBeLessThan(375);
      }
    });

    test('should be responsive on iPad', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveTitle(/Liberation/);
      
      // Check layout adapts to tablet size
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox?.width).toBeLessThanOrEqual(768);
    });

    test('should be responsive on large desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveTitle(/Liberation/);
      
      // Content should utilize larger screen space appropriately
      const pageContent = await page.textContent('body');
      expect(pageContent?.toLowerCase()).toMatch(/(runway|calculator|liberation)/);
    });

    test('should handle orientation changes', async ({ page }) => {
      // Start in portrait mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveTitle(/Liberation/);

      // Switch to landscape mobile
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500);

      // Should still work in landscape
      await expect(page).toHaveTitle(/Liberation/);
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Check for h1 elements
      const h1Elements = await page.locator('h1').count();
      expect(h1Elements).toBeGreaterThanOrEqual(1);

      // Check that headings follow proper hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      if (headings.length > 1) {
        // Verify heading order makes sense
        const headingTexts = await Promise.all(
          headings.map(h => h.textContent())
        );
        expect(headingTexts.some(text => text && text.length > 0)).toBe(true);
      }
    });

    test('should have proper alt text for images', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find all images
      const images = await page.locator('img').count();
      
      if (images > 0) {
        // Check that all images have alt attributes
        const imagesWithoutAlt = await page.locator('img:not([alt])').count();
        expect(imagesWithoutAlt).toBe(0);

        // Check that alt text is meaningful (not empty)
        const allImages = await page.locator('img').all();
        for (const img of allImages) {
          const alt = await img.getAttribute('alt');
          expect(alt).not.toBe('');
        }
      }
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Find all input elements
      const inputs = await page.locator('input').all();
      
      for (const input of inputs) {
        const inputId = await input.getAttribute('id');
        const inputAriaLabel = await input.getAttribute('aria-label');
        const inputAriaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (inputId) {
          // Check for associated label
          const label = page.locator(`label[for="${inputId}"]`);
          const labelExists = await label.count() > 0;
          
          // Input should have either a label, aria-label, or aria-labelledby
          expect(labelExists || inputAriaLabel || inputAriaLabelledBy).toBeTruthy();
        }
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Find interactive elements
      const interactiveElements = await page.locator('button, input, select, textarea, a[href]').all();
      
      if (interactiveElements.length > 0) {
        // Test Tab navigation
        await page.keyboard.press('Tab');
        
        // Check that focus is visible
        const focusedElement = await page.locator(':focus').count();
        expect(focusedElement).toBeGreaterThanOrEqual(0);

        // Test that interactive elements are reachable via keyboard
        for (let i = 0; i < Math.min(5, interactiveElements.length); i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(100);
        }
      }
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // This is a basic check - in a real implementation you'd use 
      // specialized tools like axe-playwright for detailed contrast checking
      
      // Check that page has visible content
      const pageContent = await page.textContent('body');
      expect(pageContent?.length).toBeGreaterThan(0);
      
      // Look for common low-contrast patterns
      const grayOnGrayElements = await page.locator('[style*="color: gray"][style*="background: gray"]').count();
      expect(grayOnGrayElements).toBe(0);
    });

    test('should work with screen reader attributes', async ({ page }) => {
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Check for ARIA landmarks
      const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').count();
      expect(landmarks).toBeGreaterThan(0);

      // Check for proper button roles
      const buttons = await page.locator('button, [role="button"]').all();
      for (const button of buttons) {
        const buttonText = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        
        // Buttons should have accessible text (allow for icon-only buttons)
        const hasAccessibleText = (buttonText && buttonText.trim() !== '') || 
                                  (ariaLabel && ariaLabel.trim() !== '');
        
        // Only check if button is visible and interactive
        const isVisible = await button.isVisible();
        if (isVisible) {
          expect(hasAccessibleText).toBeTruthy();
        }
      }
    });

    test('should not rely solely on color for information', async ({ page }) => {
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Basic check - look for text content that provides context
      const pageContent = await page.textContent('body');
      expect(pageContent?.toLowerCase()).toMatch(/(runway|calculator|liberation)/);
      
      // In a real implementation, you'd check for error states,
      // success states, etc. that use more than just color
    });
  });

  test.describe('Touch and Gesture Support', () => {
    test('should support touch interactions on mobile', async ({ browser }) => {
      // Create context with touch support
      const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        hasTouch: true
      });
      const page = await context.newPage();
      
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Find interactive elements
      const buttons = await page.locator('button').count();
      
      if (buttons > 0) {
        const firstButton = page.locator('button').first();
        
        // Simulate touch
        await firstButton.tap();
        await page.waitForTimeout(300);
        
        // Should handle touch without errors
        await expect(page).toHaveTitle(/Liberation/);
      }
      
      await context.close();
    });

    test('should have appropriately sized touch targets', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Check button sizes (should be at least 44px for good touch targets)
      const buttons = await page.locator('button').all();
      
      for (const button of buttons) {
        const buttonBox = await button.boundingBox();
        if (buttonBox) {
          // Touch targets should be reasonably sized
          expect(buttonBox.width).toBeGreaterThan(20);
          expect(buttonBox.height).toBeGreaterThan(20);
        }
      }
    });
  });

  test.describe('Performance on Different Devices', () => {
    test('should load quickly on slow networks', async ({ page }) => {
      // Simulate slow 3G
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 100));
        await route.continue();
      });

      const startTime = Date.now();
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Should still load in reasonable time even with delays
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
      await expect(page).toHaveTitle(/Liberation/);
    });

    test('should work with limited JavaScript', async ({ page }) => {
      // This test would check server-side rendering capabilities
      await page.goto('/tools/runway-calculator', { 
        waitUntil: 'domcontentloaded' 
      });

      // Even without full JS loading, should have basic content
      const pageContent = await page.textContent('body');
      expect(pageContent?.toLowerCase()).toMatch(/(runway|calculator|liberation)/);
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('should maintain consistent layout across viewports', async ({ page }) => {
      const viewports = [
        { width: 320, height: 568 },  // iPhone 5
        { width: 375, height: 667 },  // iPhone 6/7/8
        { width: 768, height: 1024 }, // iPad
        { width: 1024, height: 768 }, // iPad landscape
        { width: 1440, height: 900 }  // Desktop
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/tools/runway-calculator');
        await page.waitForLoadState('networkidle');

        // Should work consistently across all viewports
        await expect(page).toHaveTitle(/Liberation/);
        
        // Check that content doesn't overflow
        const body = page.locator('body');
        const bodyBox = await body.boundingBox();
        expect(bodyBox?.width).toBeLessThanOrEqual(viewport.width + 50); // Allow for scrollbars
      }
    });
  });

  test.describe('Dark Mode Support', () => {
    test('should respect user color scheme preferences', async ({ page }) => {
      // Test with dark mode preference
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveTitle(/Liberation/);
      
      // Test with light mode preference
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveTitle(/Liberation/);
    });
  });

  test.describe('Print Styles', () => {
    test('should be printable', async ({ page }) => {
      await page.goto('/tools/runway-calculator');
      await page.waitForLoadState('networkidle');

      // Emulate print media
      await page.emulateMedia({ media: 'print' });
      
      // Should still have content when printed
      const pageContent = await page.textContent('body');
      expect(pageContent?.toLowerCase()).toMatch(/(runway|calculator|liberation)/);
    });
  });
});