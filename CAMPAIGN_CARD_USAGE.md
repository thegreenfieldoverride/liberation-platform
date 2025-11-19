# CampaignCard Design Pattern - Usage Guide

## Overview

The `CampaignCard` component provides a reusable dark hero card design for highlighting campaigns, features, or special announcements across the platform.

## Design Philosophy

**Visual Identity:**
- Dark slate background (`bg-slate-900`)
- Light text for high contrast
- Subtle gradient glow in corner (customizable color)
- Clean, professional look with rounded corners
- Emphasis through color and typography

**When to Use:**
- Special campaigns (funding, projects)
- Feature announcements
- Tool launches
- Important announcements
- Call-to-action sections

## Component API

```tsx
<CampaignCard
  title="Campaign Title"
  description="Description or React node"
  status="Active" // Optional badge
  statusColor="emerald" // emerald | blue | purple | orange
  glowColor="emerald" // Gradient glow color
  progress={{
    current: 500,
    goal: 1500,
  }}
  action={{
    label: "Take Action",
    href: "https://...",
    icon: HeartIcon, // Optional Lucide icon
  }}
  footer="Optional footer note or React node"
/>
```

## Current Usage

### 1. **Funding Page** (`/funding`)
- **Sprint Campaign**: The Artisan's LLM Training Fund
- Showcases active fundraising goals with progress tracking
- Green/emerald theme for sustainability

## Recommended Future Usage

### 2. **Tool Launch Announcements**
```tsx
<CampaignCard
  title="New Tool: Small Bets Portfolio"
  description="Track your liberation-focused income streams..."
  status="Just Launched"
  statusColor="blue"
  glowColor="blue"
  action={{
    label: "Try it Now",
    href: "/small-bets-portfolio",
    icon: ArrowRight
  }}
/>
```

### 3. **Feature Announcements**
```tsx
<CampaignCard
  title="DAON Beta Access"
  description="Be among the first to test..."
  status="Beta"
  statusColor="purple"
  glowColor="purple"
  action={{
    label: "Join Waitlist",
    href: "/daon/waitlist"
  }}
/>
```

### 4. **Community Initiatives**
```tsx
<CampaignCard
  title="The Collective Strategist"
  description="Collaborative decision-making tool..."
  status="Community Vote"
  statusColor="orange"
  glowColor="orange"
  progress={{
    current: 120,
    goal: 500,
    label: "votes"
  }}
  action={{
    label: "Cast Your Vote",
    href: "/community/vote"
  }}
/>
```

### 5. **Security Announcements**
```tsx
<CampaignCard
  title="Security Update Required"
  description="Important update to protect your data..."
  status="Action Required"
  statusColor="orange"
  glowColor="orange"
  action={{
    label: "Update Now",
    href: "/security/update"
  }}
/>
```

### 6. **Homepage Hero**
Could replace gradient hero sections with dark campaign cards for:
- Latest tool releases
- Featured campaigns
- Important announcements

### 7. **Tool Pages**
- Feature spotlights within tool interfaces
- Premium feature promotions
- Integration announcements

## Design System Integration

### Color Themes
- **Emerald**: Funding, sustainability, growth
- **Blue**: New features, tools, general announcements
- **Purple**: Beta features, experiments, R&D
- **Orange**: Urgent actions, warnings, time-sensitive

### Typography
- Title: `text-2xl font-bold`
- Description: `text-slate-300`
- Status badge: `text-xs font-bold uppercase`

### Spacing
- Padding: `p-8` (responsive)
- Gaps: `gap-4` to `gap-8`
- Margin bottom: `mb-6` to `mb-8`

## Companion Component: GoalCard

The `GoalCard` component complements `CampaignCard` for displaying ongoing goals (like Marathon items):

```tsx
<GoalCard
  icon={Cpu}
  iconColor="blue"
  title="Goal Title"
  goal={9800}
  current={2000} // Optional, shows progress bar
  description="Goal description..."
/>
```

Use `GoalCard` for:
- Monthly funding goals
- Milestone tracking
- Metric displays
- Progress indicators

## Best Practices

1. **Limit Usage**: Don't overuse - maximum 1-2 per page for impact
2. **Clear CTAs**: Always include a clear action button
3. **Concise Copy**: Keep descriptions under 2-3 sentences
4. **Status Badges**: Use sparingly for urgency/importance
5. **Progress Bars**: Only show when tracking quantifiable goals
6. **Footer Notes**: Use for important context or disclaimers

## Examples in the Wild

### Current
- `/funding` - LLM Training Fund campaign

### Planned
- `/` - Homepage hero for latest campaign
- Tool launch pages
- Community voting pages
- Feature announcement modals

## Technical Notes

- Server component compatible
- Client component for interactive features
- Lucide icons for consistency
- Tailwind for styling
- Fully responsive (mobile-first)

## Migration Path

To adopt this pattern across the platform:

1. ✅ **Funding page** - Complete
2. **Homepage** - Replace gradient hero with campaign card
3. **Tool pages** - Add feature spotlights
4. **Community page** - Voting/proposals
5. **About/Manifesto** - Key principle highlights

---

**Next Steps**: As you build new features or update existing pages, consider if the CampaignCard pattern fits. It's particularly effective for anything requiring user action or highlighting something important.
