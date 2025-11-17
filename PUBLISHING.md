# 📦 Publishing Packages to NPM

## Current Strategy: Manual Publishing

We use **manual version management** and **manual publishing** for all packages.

## Publishing Workflow

### 1. Update Package Version

Before publishing, manually update the version in the package's `package.json`:

```bash
# For liberation-ui
cd packages/liberation-ui
# Edit package.json and bump version following semver
```

**Semantic Versioning (SemVer):**
- `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features, backwards compatible (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes, backwards compatible (1.0.0 → 1.0.1)

### 2. Build the Package

```bash
# From package directory
pnpm build
```

### 3. Publish to NPM

#### Single Package:
```bash
# From root directory
pnpm publish:ui              # Liberation UI
pnpm publish:runway          # Runway Calculator
pnpm publish:hourly-wage     # Real Hourly Wage
pnpm publish:ai-copilot      # AI Copilot
pnpm publish:cognitive-debt  # Cognitive Debt Assessment
pnpm publish:values-matcher  # Values Vocation Matcher
pnpm publish:user-context    # User Context
pnpm publish:small-bets      # Small Bets Portfolio
pnpm publish:types           # Shared Types
```

#### All Packages:
```bash
pnpm publish:all
```

### 4. Tag the Release (Optional but Recommended)

```bash
git tag liberation-ui-v1.0.0
git push origin liberation-ui-v1.0.0
```

## Package-Specific Notes

### @greenfieldoverride/liberation-ui

**Current Version:** `1.0.0`

**What to bump:**
- **Patch** (1.0.x): Bug fixes, style tweaks
- **Minor** (1.x.0): New icons, new component variants
- **Major** (x.0.0): Breaking API changes, removed components

**Before Publishing:**
- [ ] Test component viewer: `cd packages/liberation-ui && pnpm components`
- [ ] Verify build: `pnpm build`
- [ ] Check exports work in web app
- [ ] Update README.md if API changed

## NPM Authentication

Make sure you're logged in to NPM:

```bash
npm login
# or if using a token
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
```

## Future: Automated Publishing

Consider adding:
- **Changesets** for automated version management
- **GitHub Action** to publish on release
- **Conventional Commits** for automatic CHANGELOG generation

Example GitHub Action (for future):
```yaml
name: Publish Packages
on:
  release:
    types: [published]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm publish:all
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

**"Package already exists"**
- Bump the version number in package.json
- You cannot overwrite published versions

**"Authentication required"**
- Run `npm login` or set NPM_TOKEN

**"Build failed"**
- Ensure dependencies are installed: `pnpm install`
- Check TypeScript errors: `pnpm build`
