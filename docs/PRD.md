# Product Requirements Document: Adroit

## 1. Product Overview

**Adroit** is an autonomous AI marketing agent that manages advertising campaigns for small and medium-sized businesses (SMEs) who cannot afford traditional marketing agencies. It uses AI to analyze, optimize, and execute marketing campaigns across Google Ads and Meta Ads, with autonomous USDC payments on Arc blockchain.

**Vision:** Democratize marketing automation — give every small business owner a 24/7 AI marketing team at a fraction of the cost.

---

## 2. Problem Statement

Small businesses and SMEs face three core challenges:
- **Cost barrier:** Marketing agencies charge $2,000–$10,000+/month — prohibitive for most small businesses
- **Complexity:** Managing Google Ads + Meta Ads + budgets + analytics requires specialized expertise
- **Time:** Business owners are too busy running operations to optimize campaigns daily

---

## 3. Target Users

| Persona | Description | Pain Point |
|---------|-------------|------------|
| **Solo Entrepreneur** | 1-person business, $500–$2K/mo ad budget | No time or expertise to manage ads |
| **Small Business Owner** | 2–20 employees, $2K–$10K/mo ad budget | Can't afford a marketing hire/agency |
| **Local Service Business** | Restaurants, salons, gyms, repair shops | Need local customers but don't know digital ads |
| **E-commerce Startup** | Online store, $1K–$5K/mo ad budget | Need ROAS optimization but lack data skills |

---

## 4. Current State (v0.1 — Hackathon MVP)

### What Exists
- **Campaign Optimizer Agent** — analyzes campaigns, generates recommendations
- **Google Ads Tool** — mock integration for campaign management
- **Meta Ads Tool** — mock integration for Facebook/Instagram ads
- **Arc Wallet Tool** — Circle Developer-Controlled Wallet for USDC (with mock fallback)
- **Analytics Tool** — metrics aggregation, anomaly detection, ROAS calculation
- **Approval Queue Workflow** — validates and routes recommendations
- **Campaign Executor Workflow** — executes approved actions

### What's Missing
- Real API integrations (all tools are mock)
- User authentication and multi-tenancy
- Production database (currently in-memory)
- Payment processing for ad spend
- Campaign creation from scratch (only optimization)
- Real-time monitoring and alerts
- Content/copy generation
- A/B testing automation

---

## 5. Product Phases & Roadmap

### Phase 1: Foundation (Months 1–2)
**Goal:** Replace mocks with real integrations, add authentication

| Feature | Description | Priority |
|---------|-------------|----------|
| Real Meta Ads API | Facebook Graph API integration | P0 |
| Real Google Ads API | Google Ads API v17 integration | P0 |
| User Authentication | Email/password + OAuth (Google) | P0 |
| Multi-tenancy | Isolated data per business | P0 |
| PostgreSQL Storage | Persistent data layer | P0 |
| Environment Config | Secure credential management | P0 |

### Phase 2: Core Automation (Months 3–4)
**Goal:** Agent can autonomously manage campaigns end-to-end

| Feature | Description | Priority |
|---------|-------------|----------|
| Auto-optimization | Agent pauses/boosts campaigns without approval for small changes | P0 |
| Budget Rules | Set daily/weekly/monthly spend limits | P0 |
| Campaign Creation | Create new campaigns from business goals | P1 |
| A/B Testing | Auto-create variants, measure, pick winners | P1 |
| Performance Alerts | Email/SMS when campaigns hit thresholds | P1 |
| Weekly Reports | Automated email digest of campaign performance | P1 |

### Phase 3: Content & Creative (Months 5–6)
**Goal:** Agent generates ad copy and creative suggestions

| Feature | Description | Priority |
|---------|-------------|----------|
| Ad Copy Generation | AI writes ad headlines/descriptions | P0 |
| Audience Suggestions | Recommend target demographics/interests | P1 |
| Landing Page Tips | Suggest improvements for conversion | P2 |
| Competitor Analysis | Benchmark against industry averages | P2 |

### Phase 4: Payments & Financial (Months 7–8)
**Goal:** Autonomous ad spend with USDC wallet

| Feature | Description | Priority |
|---------|-------------|----------|
| USDC Ad Payments | Pay for ads directly from wallet | P0 |
| Fiat On-ramp | Buy USDC with credit card via Circle | P1 |
| Invoice Generation | Auto-generate receipts for ad spend | P1 |
| Budget Forecasting | Predict monthly spend based on trends | P2 |
| Multi-currency Support | Handle different ad platform currencies | P2 |

### Phase 5: Scale & Intelligence (Months 9–12)
**Goal:** Multi-platform, predictive analytics, self-improving

| Feature | Description | Priority |
|---------|-------------|----------|
| TikTok Ads Integration | Expand to TikTok advertising | P1 |
| LinkedIn Ads Integration | B2B marketing channel | P2 |
| Predictive Analytics | ML models for campaign forecasting | P1 |
| Auto-learning | Agent improves strategies based on outcomes | P1 |
| Industry Templates | Pre-built strategies by business type | P2 |
| API for Partners | Let agencies resell to their clients | P2 |

---

## 6. Business Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | 1 platform, 3 campaigns, basic analytics |
| **Starter** | $29/mo | 2 platforms, 10 campaigns, auto-optimization |
| **Growth** | $79/mo | All platforms, unlimited campaigns, content generation |
| **Agency** | $199/mo | Multi-client, white-label, priority support |

**Revenue streams:**
- Subscription fees
- Transaction fees on USDC ad payments (1–2%)
- Premium AI features (content generation, predictive analytics)

---

## 7. Success Metrics

| Metric | Phase 1 Target | Phase 3 Target | Phase 5 Target |
|--------|----------------|----------------|----------------|
| Active Users | 50 | 500 | 5,000 |
| Avg. ROAS Improvement | 15% | 30% | 50% |
| Campaigns Managed | 100 | 2,000 | 50,000 |
| Monthly Ad Spend Managed | $10K | $200K | $5M |
| User Retention (30-day) | 40% | 60% | 75% |

---

## 8. Technical Architecture (Future State)

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Dashboard │  │ Mobile   │  │ API      │              │
│  │ (Next.js) │  │ App      │  │ (REST)   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       └──────────────┼──────────────┘                    │
│                      ▼                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Mastra Agent Framework               │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │   │
│  │  │ Campaign   │  │ Content    │  │ Analytics  │ │   │
│  │  │ Optimizer  │  │ Generator  │  │ Engine     │ │   │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘ │   │
│  │        └────────────────┼────────────────┘        │   │
│  └─────────────────────────┼─────────────────────────┘   │
│                            ▼                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │                   Tools Layer                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │
│  │  │ Google   │ │ Meta     │ │ TikTok   │          │   │
│  │  │ Ads      │ │ Ads      │ │ Ads      │          │   │
│  │  └──────────┘ └──────────┘ └──────────┘          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │
│  │  │ Arc      │ │ Analytics│ │ Content  │          │   │
│  │  │ Wallet   │ │ Engine   │ │ Gen      │          │   │
│  │  └──────────┘ └──────────┘ └──────────┘          │   │
│  └──────────────────────────────────────────────────┘   │
│                            ▼                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Data & Storage                        │   │
│  │  PostgreSQL │ Redis │ Vector DB │ Object Storage   │   │
│  └──────────────────────────────────────────────────┘   │
│                            ▼                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Blockchain Layer                      │   │
│  │  Arc (USDC) │ Circle Wallets │ CCTP Bridge        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API rate limits | High | Implement caching, batch requests, respect quotas |
| Ad platform policy changes | Medium | Abstract tool layer, quick adaptation |
| User trust (autonomous spending) | High | Approval workflow for large amounts, spending limits |
| LLM hallucinations in recommendations | High | Human-in-the-loop, confidence scoring, validation |
| Blockchain UX complexity | Medium | Abstract wallet details, fiat on-ramp |

---

## 10. Open Questions

1. Should the agent have full autonomy or always require approval?
2. How do we handle businesses without existing ad accounts?
3. What's the minimum viable ad budget for the product to be useful?
4. Should we integrate with Shopify/WooCommerce for e-commerce users?
5. How do we compete with free tools like Google's Performance Max?
