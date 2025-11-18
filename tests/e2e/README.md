# Liberation Platform E2E Tests

Comprehensive end-to-end tests using Playwright to prevent regressions and ensure critical functionality works.

## Test Coverage

### 1. Small Bets Portfolio (`small-bets-portfolio.spec.ts`)
- ✅ IndexedDB keyPath error prevention
- ✅ Navigation visibility and spacing
- ✅ Adding and managing bets
- ✅ Portfolio calculations
- ✅ Data persistence across reloads
- ✅ Liberation journey milestone tracking

### 2. Real Hourly Wage (`real-hourly-wage.spec.ts`)
- ✅ Accurate wage calculations (prevents tiny decimal storage bug)
- ✅ Proper value storage in localStorage
- ✅ Liberation journey integration
- ✅ Navigation and page layout
- ✅ Wage comparison messages
- ✅ Liberation scenarios display

### 3. AI Copilot (`ai-copilot.spec.ts`)
- ✅ Markdown stripping from AI responses
- ✅ Context persistence across tab switches
- ✅ Real data display (not sample data)
- ✅ Plan generation and storage
- ✅ Dashboard metrics display

### 4. Navigation and Layout (`navigation.spec.ts`)
- ✅ Navigation visibility on all pages
- ✅ Proper spacing (pt-24) on tool pages
- ✅ Breadcrumb functionality
- ✅ Mobile navigation
- ✅ No content covered by fixed nav

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run specific test file
```bash
npx playwright test tests/e2e/small-bets-portfolio.spec.ts
```

### Run tests in UI mode (for debugging)
```bash
npx playwright test --ui
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Strategy

### Regression Prevention
These tests specifically target issues found in production:

1. **IndexedDB KeyPath Error** - Ensures UserContext has proper `id` field for IndexedDB
2. **Real Wage Storage Bug** - Validates hourly wage is stored as reasonable number (not tiny decimal)
3. **Markdown in AI Responses** - Checks that markdown is stripped from displayed text
4. **Navigation Overlap** - Verifies all tool pages have proper padding to avoid nav covering content
5. **Data Persistence** - Ensures localStorage and IndexedDB work correctly across sessions

### Coverage Areas

**Critical User Flows:**
- Tool usage (calculations, inputs, outputs)
- Data persistence (localStorage, IndexedDB)
- Navigation (breadcrumbs, menus, links)
- Liberation journey tracking
- Cross-tool data integration

**Visual/UX:**
- Navigation visibility and styling
- Proper spacing and layout
- Mobile responsiveness
- No content overlap

**Data Integrity:**
- Accurate calculations
- Proper data types in storage
- No data loss on page reload
- Liberation milestones tracked correctly

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Merges to main
- Pre-deployment checks

## Adding New Tests

When adding new features or fixing bugs:

1. Create a new test file in `tests/e2e/`
2. Follow naming convention: `feature-name.spec.ts`
3. Document what the tests cover in this README
4. Include regression tests for any bugs fixed
5. Test both happy path and edge cases

## Debugging Failed Tests

1. **Screenshots**: Check `playwright-report/` for failure screenshots
2. **Traces**: View trace files in Playwright's trace viewer
3. **UI Mode**: Run `npx playwright test --ui` to debug interactively
4. **Headed Mode**: Run with `--headed` to see browser actions

## Dependencies

- `@playwright/test` - Test framework
- Node.js 18+ - Runtime
- Next.js dev server - Must be running for tests

## Known Issues

None currently. This test suite was created to prevent regressions of:
- Issue #1: IndexedDB keyPath error in Small Bets Portfolio
- Issue #2: Real hourly wage stored as tiny decimal
- Issue #3: Markdown formatting showing in AI Copilot
- Issue #4: Navigation covering page content on tool pages
