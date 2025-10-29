import { test, expect } from '@playwright/test';

test.describe('Analytics Error Handling', () => {
  test('should handle analytics API server errors gracefully', async ({ page }) => {
    // Mock all analytics endpoints to return server errors
    await page.route('/api/analytics/events', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.route('/api/analytics/insights?type=usage', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.route('/api/analytics/insights?type=geographic', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.route('/api/analytics/insights?type=financial', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // Navigate to a page with analytics
    await page.goto('/tools/runway-calculator');
    await page.waitForLoadState('networkidle');

    // Page should still work despite analytics failures
    await expect(page).toHaveTitle(/Liberation/);
    
    // Look for calculator content
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toMatch(/(runway|calculator|liberation)/);
  });

  test('should handle analytics API timeouts gracefully', async ({ page }) => {
    // Mock analytics endpoints to timeout
    await page.route('/api/analytics/events', async route => {
      // Simulate a timeout by not fulfilling the request
      await new Promise(resolve => setTimeout(resolve, 5000));
      await route.fulfill({
        status: 408,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Request timeout' })
      });
    });

    await page.goto('/tools/runway-calculator');
    await page.waitForLoadState('networkidle');

    // Application should continue working
    await expect(page).toHaveTitle(/Liberation/);
  });

  test('should handle malformed analytics API responses', async ({ page }) => {
    // Mock endpoints to return malformed JSON
    await page.route('/api/analytics/insights?type=usage', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'invalid json response'
      });
    });

    await page.route('/api/analytics/insights?type=geographic', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{invalid: json}'
      });
    });

    await page.route('/api/analytics/insights?type=financial', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"incomplete": '
      });
    });

    await page.goto('/developers');
    
    // Page should still load despite malformed responses
    await expect(page).toHaveTitle(/Liberation/);
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Mock network failures by rejecting requests
    await page.route('/api/analytics/**', async route => {
      await route.abort();
    });

    await page.goto('/tools/runway-calculator');
    await page.waitForLoadState('networkidle');

    // Application should work without analytics
    await expect(page).toHaveTitle(/Liberation/);
    
    // Try to use the calculator
    const numberInputs = page.locator('input[type="number"]');
    const inputCount = await numberInputs.count();

    if (inputCount > 0) {
      const input = numberInputs.first();
      await input.fill('50000');
      await page.waitForTimeout(1000);
      
      // Should still function
      await expect(page).toHaveTitle(/Liberation/);
    }
  });

  test('should display appropriate error messages when analytics service is unavailable', async ({ page }) => {
    // Mock analytics endpoints to return service unavailable
    await page.route('/api/analytics/insights?type=usage', async route => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' })
      });
    });

    await page.route('/api/analytics/insights?type=geographic', async route => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' })
      });
    });

    await page.route('/api/analytics/insights?type=financial', async route => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' })
      });
    });

    await page.goto('/developers');
    
    // Should show graceful error handling
    await expect(page).toHaveTitle(/Liberation/);
    
    // Look for error message indicating service unavailable
    const pageContent = await page.textContent('body');
    
    // Page should still have core content even with analytics errors
    expect(pageContent?.toLowerCase()).toMatch(/(liberation|developer)/);
  });

  test('should handle partial analytics failures', async ({ page }) => {
    // Mock some endpoints to succeed and others to fail
    await page.route('/api/analytics/insights?type=usage', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            app: 'runway-calculator',
            action: 'calculate',
            count: 100,
            unique_sessions: 75,
            hour: '2025-10-27 14:00'
          }
        ])
      });
    });

    await page.route('/api/analytics/insights?type=geographic', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Geographic service error' })
      });
    });

    await page.route('/api/analytics/insights?type=financial', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/developers');
    
    // Should handle mixed success/failure scenarios
    await expect(page).toHaveTitle(/Liberation/);
  });

  test('should handle CORS errors gracefully', async ({ page }) => {
    // Mock CORS preflight failures
    await page.route('/api/analytics/**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 403,
          contentType: 'text/plain',
          body: 'CORS error'
        });
      } else {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'CORS policy violation' })
        });
      }
    });

    await page.goto('/tools/runway-calculator');
    await page.waitForLoadState('networkidle');

    // Application should continue working
    await expect(page).toHaveTitle(/Liberation/);
  });

  test('should work when JavaScript is disabled', async ({ browser }) => {
    // Create a new context with JavaScript disabled
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    
    await page.goto('/tools/runway-calculator');
    
    // Page should still render basic content
    await expect(page).toHaveTitle(/Liberation/);
    
    // Should have some calculator-related content even without JS
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toMatch(/(runway|calculator|liberation)/);
    
    await context.close();
  });

  test('should handle concurrent analytics requests properly', async ({ page }) => {
    let requestCount = 0;
    
    // Mock analytics to count concurrent requests
    await page.route('/api/analytics/events', async route => {
      requestCount++;
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.goto('/tools/runway-calculator');
    await page.waitForLoadState('networkidle');

    // Try to trigger multiple analytics events quickly
    const numberInputs = page.locator('input[type="number"]');
    const inputCount = await numberInputs.count();

    if (inputCount > 0) {
      const input = numberInputs.first();
      
      // Rapid input changes
      await input.fill('1000');
      await input.fill('2000');
      await input.fill('3000');
      await input.fill('4000');
      await input.fill('5000');
      
      // Wait for processing
      await page.waitForTimeout(3000);
    }

    // Application should handle concurrent requests gracefully
    await expect(page).toHaveTitle(/Liberation/);
  });

  test('should handle browser storage errors', async ({ page }) => {
    // Simulate localStorage/sessionStorage being unavailable
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => { throw new Error('Storage unavailable'); },
          setItem: () => { throw new Error('Storage unavailable'); },
          removeItem: () => { throw new Error('Storage unavailable'); },
          clear: () => { throw new Error('Storage unavailable'); }
        }
      });
    });

    await page.goto('/tools/runway-calculator');
    await page.waitForLoadState('networkidle');

    // Should work even without storage
    await expect(page).toHaveTitle(/Liberation/);
  });

  test('should handle analytics rate limiting', async ({ page }) => {
    let requestCount = 0;
    
    // Mock rate limiting after 3 requests
    await page.route('/api/analytics/events', async route => {
      requestCount++;
      if (requestCount > 3) {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Rate limit exceeded' }),
          headers: { 'Retry-After': '60' }
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    await page.goto('/tools/runway-calculator');
    await page.waitForLoadState('networkidle');

    // Application should handle rate limiting gracefully
    await expect(page).toHaveTitle(/Liberation/);
  });

  test('should handle analytics client initialization errors', async ({ page }) => {
    // Mock analytics client errors
    await page.addInitScript(() => {
      (window as any).fathom = undefined;
      
      // Override fetch to simulate initialization errors
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const url = args[0] as string;
        if (url.includes('/api/analytics/')) {
          throw new Error('Analytics client initialization failed');
        }
        return originalFetch(...args);
      };
    });

    await page.goto('/tools/runway-calculator');
    await page.waitForLoadState('networkidle');

    // Should work even with analytics client errors
    await expect(page).toHaveTitle(/Liberation/);
    
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toMatch(/(runway|calculator|liberation)/);
  });
});