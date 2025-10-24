# Liberation Analytics Architecture

## 🎯 Vision & Philosophy

**Track the liberation movement, not individuals.** 

Liberation Analytics is designed to understand aggregate patterns that help the liberation movement grow while maintaining radical privacy for individuals seeking freedom from corporate hell.

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Liberation Tools Ecosystem               │
├─────────────────────────────────────────────────────────────┤
│  Runway Calculator  │  Real Hourly Wage  │  Cognitive Debt │
│  Values Matcher     │  AI Co-Pilot       │  Small Bets     │
│  Custom Tools...    │                    │                 │
└─────────────┬───────────────────┬───────────────────┬───────┘
              │                   │                   │
              │ JavaScript Client │                   │
              │ (client.js)       │                   │
              │                   │                   │
┌─────────────▼───────────────────▼───────────────────▼───────┐
│                 Liberation Analytics Service                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   REST API  │  │  GeoIP      │  │    CORS Handler     │  │
│  │  (Fastify)  │  │ (Country)   │  │   (Cross-Origin)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Event Processing Engine                    │ │
│  │  • Privacy filtering • Geo aggregation • Validation   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    DuckDB                               │ │
│  │  ┌─────────────────┐ ┌─────────────────┐               │ │
│  │  │ liberation_events│ │    Indexes      │               │ │
│  │  │ ┌─────────────┐ │ │ ┌─────────────┐ │               │ │
│  │  │ │ app         │ │ │ │ app_action  │ │               │ │
│  │  │ │ action      │ │ │ │ timestamp   │ │               │ │
│  │  │ │ attributes  │ │ │ │ geo_hint    │ │               │ │
│  │  │ │ timestamp   │ │ │ │ session_id  │ │               │ │
│  │  │ │ geo_hint    │ │ │ └─────────────┘ │               │ │
│  │  │ │ session_id  │ │ └─────────────────┘               │ │
│  │  │ └─────────────┘ │                                   │ │
│  │  └─────────────────┘                                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Insights API                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Usage     │  │ Geographic  │  │     Financial       │  │
│  │  Patterns   │  │  Hotspots   │  │     Insights        │  │
│  │             │  │             │  │                     │  │
│  │ • Peak times│  │ • Country   │  │ • Avg runway        │  │
│  │ • Tool combo│  │   activity  │  │ • Wage gaps         │  │
│  │ • Completion│  │ • Regional  │  │ • Liberation        │  │
│  │   rates     │  │   trends    │  │   timelines         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│               Liberation Dashboard (Future)                 │
├─────────────────────────────────────────────────────────────┤
│  Real-time liberation metrics • Geographic heatmaps        │
│  Tool effectiveness analysis • Anonymous cohort insights   │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Event Tracking Flow
```
User Interaction → Liberation Tool → JavaScript Client → Analytics API → DuckDB
     │                   │               │                    │           │
     │                   │               │                    │           ▼
     │                   │               │                    │     ┌──────────┐
     │                   │               │                    │     │ Raw Event│
     │                   │               │                    │     │  Storage │
     │                   │               │                    │     └──────────┘
     │                   │               │                    │
     │                   │               │                    ▼
     │                   │               │           ┌─────────────────┐
     │                   │               │           │ Privacy Filter  │
     │                   │               │           │ • Remove PII    │
     │                   │               │           │ • Aggregate geo │
     │                   │               │           │ • Validate data │
     │                   │               │           └─────────────────┘
     │                   │               │
     │                   │               ▼
     │                   │      ┌─────────────────┐
     │                   │      │ Session Mgmt    │
     │                   │      │ • Generate ID   │
     │                   │      │ • Link events   │
     │                   │      │ • No persistence│
     │                   │      └─────────────────┘
     │                   │
     │                   ▼
     │          ┌─────────────────┐
     │          │ Tool Integration│
     │          │ • Track action  │
     │          │ • Add context   │
     │          │ • Send event    │
     │          └─────────────────┘
     │
     ▼
┌─────────────────┐
│ User Action     │
│ • Calculate     │
│ • Complete      │
│ • Navigate      │
└─────────────────┘
```

### Insights Generation Flow
```
Analytics Query → DuckDB Aggregation → Privacy Check → JSON Response
       │                │                    │              │
       │                │                    │              ▼
       │                │                    │        ┌──────────────┐
       │                │                    │        │ Dashboard/   │
       │                │                    │        │ Visualization│
       │                │                    │        └──────────────┘
       │                │                    │
       │                │                    ▼
       │                │           ┌─────────────────┐
       │                │           │ Privacy Filter  │
       │                │           │ • No individuals│
       │                │           │ • Min thresholds│
       │                │           │ • Aggregate only│
       │                │           └─────────────────┘
       │                │
       │                ▼
       │       ┌─────────────────┐
       │       │ Fast Analytics  │
       │       │ • GROUP BY      │
       │       │ • Time windows  │
       │       │ • Statistical   │
       │       │   aggregations  │
       │       └─────────────────┘
       │
       ▼
┌─────────────────┐
│ Query Types     │
│ • Usage patterns│
│ • Geographic    │
│ • Financial     │
│ • Health check  │
└─────────────────┘
```

## 🏢 Deployment Architecture

### Production Setup
```
┌─────────────────────────────────────────────────────────────┐
│                      Production Server                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Caddy Reverse Proxy                 │ │
│  │  analytics.greenfieldoverride.com → :8080              │ │
│  │  • Automatic SSL (Let's Encrypt)                       │ │
│  │  • CORS headers                                        │ │
│  │  • Rate limiting                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                │                            │
│                                ▼                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Docker Container                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │          Liberation Analytics Service               │ │ │
│  │  │  Port: 8080                                         │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐                  │ │ │
│  │  │  │   Go API    │  │   DuckDB    │                  │ │ │
│  │  │  │   Server    │  │  Database   │                  │ │ │
│  │  │  └─────────────┘  └─────────────┘                  │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Persistent Storage                      │ │
│  │  /opt/liberation-analytics/data/                        │ │
│  │  ├── analytics.db (DuckDB file)                         │ │
│  │  ├── analytics.db-wal                                   │ │
│  │  └── GeoLite2-Country.mmdb (optional)                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Integration with Liberation Platform
```
┌─────────────────────────────────────────────────────────────┐
│              Liberation Platform Ecosystem                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │            Main Liberation Platform                     │ │
│  │  https://greenfieldoverride.com                         │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │   Runway    │ │ Real Wage   │ │ Cognitive   │       │ │
│  │  │ Calculator  │ │ Calculator  │ │ Debt Tool   │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  │           │              │              │               │ │
│  │           └──────────────┼──────────────┘               │ │
│  │                          │                              │ │
│  │                          ▼                              │ │
│  │               ┌─────────────────┐                       │ │
│  │               │ Analytics Client│                       │ │
│  │               │   (client.js)   │                       │ │
│  │               └─────────────────┘                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                │                            │
│                                │ HTTPS POST                 │
│                                ▼                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           Analytics Service                             │ │
│  │  https://analytics.greenfieldoverride.com              │ │
│  │  Port: 8080 (behind Caddy)                             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🛠 Technology Stack

### Backend (Go Service)
- **Language**: Go 1.21+
- **Framework**: Gorilla Mux (HTTP routing)
- **Database**: DuckDB (analytical workloads)
- **CORS**: rs/cors (cross-origin requests)
- **GeoIP**: MaxMind GeoLite2 (optional)

### Frontend Integration
- **Client**: Vanilla JavaScript (no dependencies)
- **Transport**: Fetch API with JSON
- **Fallbacks**: Silent failure (never break user experience)

### Infrastructure
- **Containerization**: Docker with Alpine Linux
- **Reverse Proxy**: Caddy (automatic SSL)
- **Storage**: Local filesystem (DuckDB files)
- **Monitoring**: Health check endpoint

## 🔒 Privacy Architecture

### Data Minimization
```
Raw User Data → Privacy Filter → Stored Analytics Data
      │              │                    │
      ▼              ▼                    ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ • Personal   │ │ Remove:      │ │ • App name   │
│   financial  │ │ • IP details │ │ • Action     │
│   details    │ │ • Exact      │ │ • Country    │
│ • Exact IP   │ │   timestamps │ │   code only  │
│ • Browser    │ │ • Browser    │ │ • Time       │
│   details    │ │   fingerprint│ │   windows    │
│ • Session    │ │ • Personal   │ │ • Session    │
│   state      │ │   identifiers│ │   hash       │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Aggregation Guarantees
- **Minimum Thresholds**: No insights shown for <10 events
- **Time Windows**: Aggregate by hour/day/week, never exact times
- **Geographic**: Country-level only (US, CA, UK, etc.)
- **Financial**: Salary bands, not exact amounts
- **Sessions**: Anonymous hashes, rotate frequently

### Privacy Principles
1. **Individual Anonymity**: Cannot identify specific users
2. **Movement Insights**: Understand liberation patterns
3. **Minimal Collection**: Only what serves liberation goals
4. **User Control**: Tools work without analytics
5. **Transparency**: Open source, auditable code

## 📊 Event Schema

### Universal Event Structure
```javascript
{
  "app": "runway-calculator",      // Tool identifier
  "action": "calculate",           // User action
  "attributes": {                  // Tool-specific data
    "runway_months": 8.5,          // Financial insight
    "savings_band": "10k-25k",     // Privacy-friendly ranges
    "industry": "tech"             // Liberation context
  },
  "timestamp": "2025-01-23T21:45:00Z", // When it happened
  "geo_hint": "US",               // Country only
  "session_id": "sess_abc123"     // Anonymous session
}
```

### Tool-Specific Schemas

**Runway Calculator:**
```javascript
{
  "app": "runway-calculator",
  "action": "calculate",
  "attributes": {
    "runway_months": 8.5,
    "savings_band": "10k-25k",     // "0-5k", "5k-10k", "10k-25k", "25k-50k", "50k+"
    "expenses_band": "2k-4k",      // "0-1k", "1k-2k", "2k-4k", "4k-6k", "6k+"
    "industry": "tech"             // Optional context
  }
}
```

**Real Hourly Wage:**
```javascript
{
  "app": "real-hourly-wage",
  "action": "reveal",
  "attributes": {
    "salary_band": "80k-100k",     // "40k-60k", "60k-80k", "80k-100k", "100k+"
    "real_wage_diff": -23.5,       // Percentage difference
    "commute_minutes": 45,         // Daily commute
    "industry": "finance"
  }
}
```

**Cognitive Debt Assessment:**
```javascript
{
  "app": "cognitive-debt-assessment",
  "action": "complete",
  "attributes": {
    "debt_score": 72,              // 0-100 scale
    "primary_category": "burnout", // Main issue area
    "recommendation": "immediate"   // Urgency level
  }
}
```

## 🎯 Analytics Goals

### Usage Patterns
- **Peak Liberation Times**: When do people plan their escape?
- **Tool Effectiveness**: Which tools drive the most action?
- **Journey Flows**: Runway → Wage → Values → Action?
- **Completion Rates**: Where do people drop off?

### Geographic Liberation Hotspots
- **Corporate Exodus Centers**: Where is liberation happening?
- **Regional Patterns**: Tech hubs vs. other industries?
- **Tool Popularity**: Different needs by geography?

### Financial Liberation Insights
- **Average Runways**: How long do people plan for?
- **Salary Illusions**: How big is the wage gap reality?
- **Industry Patterns**: Which sectors have the biggest gaps?
- **Liberation Economics**: Financial patterns of freedom seekers

## 🚀 Future Enhancements

### Phase 2: Real-time Dashboard
- Live liberation metrics
- Geographic heatmaps
- Tool effectiveness scoring
- Anonymous cohort analysis

### Phase 3: Predictive Insights
- Liberation success patterns
- Optimal tool sequences
- Risk factor analysis
- Community trend detection

### Phase 4: Federation
- Multiple liberation platform support
- Cross-platform insights
- Decentralized analytics
- Privacy-preserving federation

---

**Built for the liberation movement** - Understanding freedom patterns while protecting individual privacy.