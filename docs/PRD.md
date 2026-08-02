# Product Requirements Document: Adroit

## 1. Product Overview

**Adroit** is an autonomous AI marketing agency platform that provides end-to-end marketing services for small and medium-sized businesses (SMEs) who cannot afford traditional marketing agencies. It uses AI to manage advertising campaigns, create content, optimize SEO, handle social media, and execute full marketing strategies — all with autonomous USDC payments on Arc blockchain.

**Vision:** Democratize marketing — give every small business owner a 24/7 AI marketing agency at a fraction of the cost.

---

## 2. Problem Statement

Small businesses and SMEs face three core challenges:

- **Cost barrier:** Marketing agencies charge $2,000–$10,000+/month — prohibitive for most small businesses
- **Complexity:** Managing ads, SEO, content, social media, email requires specialized expertise across dozens of disciplines
- **Time:** Business owners are too busy running operations to execute marketing strategies daily

---

## 3. Target Users

| Persona                    | Description                              | Pain Point                                            |
| -------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| **Solo Entrepreneur**      | 1-person business, $500–$2K/mo ad budget | No time or expertise to manage any marketing          |
| **Small Business Owner**   | 2–20 employees, $2K–$10K/mo ad budget    | Can't afford a marketing hire/agency                  |
| **Local Service Business** | Restaurants, salons, gyms, repair shops  | Need local customers but don't know digital marketing |
| **E-commerce Startup**     | Online store, $1K–$5K/mo ad budget       | Need full marketing stack but lack skills             |

---

## 4. Current State (v0.2 — Hackathon MVP)

### Platforms (2 real + 6 mock)

| Platform      | Status  | Tools    | Integration |
| ------------- | ------- | -------- | ----------- |
| Google Ads    | ✅ Real  | 11 tools | MCP + API   |
| Meta Ads      | ✅ Real  | 11 tools | MCP + API   |
| LinkedIn Ads  | 🔧 Mock | 5 tools  | MCP (mock)  |
| TikTok Ads    | 🔧 Mock | 5 tools  | MCP (mock)  |
| Microsoft Ads | 🔧 Mock | 5 tools  | MCP (mock)  |
| Amazon Ads    | 🔧 Mock | 5 tools  | MCP (mock)  |
| Pinterest Ads | 🔧 Mock | 5 tools  | MCP (mock)  |
| Snap Ads      | 🔧 Mock | 5 tools  | MCP (mock)  |

### Campaign Types

| Type                      | Status      | Platforms                  |
| ------------------------- | ----------- | -------------------------- |
| Search ads                | ✅ Supported | Google, Microsoft          |
| Display ads               | ✅ Supported | Google, Microsoft          |
| Shopping ads              | ✅ Supported | Google, Amazon             |
| Video ads                 | 🔧 Mock     | All platforms              |
| App install campaigns     | 🔧 Mock     | Google, Meta, TikTok, Snap |
| Lead generation campaigns | 🔧 Mock     | Google, Meta, LinkedIn     |
| Retargeting               | 🔧 Mock     | All platforms              |
| Remarketing               | 🔧 Mock     | Google, Meta               |

### Features

| Feature                  | Status  | Tools                                       |
| ------------------------ | ------- | ------------------------------------------- |
| Campaign management      | ✅ Real  | Create, pause, activate, update budget      |
| Cross-platform analytics | ✅ Real  | ROAS, CPC, CTR comparison                   |
| USDC wallet              | ✅ Real  | Arc blockchain payments                     |
| Approval workflow        | ✅ Real  | Human-in-the-loop                           |
| Retargeting audiences    | 🔧 Mock | Website visitors, app users, customer lists |
| Drip remarketing         | 🔧 Mock | Abandoned cart, past visitors               |
| Multi-touch attribution  | 🔧 Mock | First/last touch, linear, time decay        |
| Customer LTV             | 🔧 Mock | Cohort analysis                             |
| Bid optimization         | 🔧 Mock | AI-powered bidding                          |
| Performance forecasting  | 🔧 Mock | Predict future results                      |
| Competitor analysis      | 🔧 Mock | Ad intelligence                             |
| A/B testing variants     | 🔧 Mock | Generate ad variants                        |
| Blended CPA              | 🔧 Mock | Cross-channel CPA                           |
| Budget allocation        | 🔧 Mock | AI-powered reallocation                     |

### What's Built

- **Campaign Optimizer Agent** — 50+ tools across all platforms
- **Google Ads MCP Server** — real API integration
- **Meta Ads MCP Server** — real API integration
- **6 Mock MCP Servers** — LinkedIn, TikTok, Microsoft, Amazon, Pinterest, Snap
- **Arc Wallet Tool** — Circle Developer-Controlled Wallet for USDC
- **Analytics Tool** — metrics aggregation, anomaly detection, ROAS calculation
- **Cross-platform Analytics** — compare all 8 platforms
- **Campaign Type Tools** — video, app install, lead gen
- **Retargeting Tools** — audiences, campaigns, drip sequences
- **Performance Marketing Tools** — attribution, LTV, bidding, forecasting
- **Approval Queue Workflow** — validates and routes recommendations
- **Campaign Executor Workflow** — executes approved actions

### What's Missing (for production)

- User authentication and multi-tenancy
- Production database (currently in-memory)
- Real API integrations for mock platforms
- Content/copy generation
- SEO tools and integration
- Social media management
- Email marketing
- Website services
- Branding tools
- Marketing strategy tools

---

## 5. Product Phases & Roadmap

### Phase 1: Foundation (Months 1–2)

**Goal:** Real integrations, authentication, production-ready infrastructure

| Feature             | Description                              | Priority |
| ------------------- | ---------------------------------------- | -------- |
| Real Meta Ads API   | Facebook Graph API integration via MCP   | P0       |
| Real Google Ads API | Google Ads API v17 integration via MCP   | P0       |
| User Authentication | Email/password + OAuth (Google)          | P0       |
| Multi-tenancy       | Isolated data per business               | P0       |
| PostgreSQL Storage  | Persistent data layer                    | P0       |
| Dashboard UI        | Next.js frontend for campaign management | P0       |

### Phase 2: Core Automation (Months 3–4)

**Goal:** Agent autonomously manages ad campaigns end-to-end

| Feature            | Description                                    | Priority |
| ------------------ | ---------------------------------------------- | -------- |
| Auto-optimization  | Agent pauses/boosts campaigns without approval | P0       |
| Budget Rules       | Set daily/weekly/monthly spend limits          | P0       |
| Campaign Creation  | Create new campaigns from business goals       | P1       |
| A/B Testing        | Auto-create variants, measure, pick winners    | P1       |
| Performance Alerts | Email/SMS when campaigns hit thresholds        | P1       |
| Weekly Reports     | Automated email digest of performance          | P1       |

### Phase 3: Content & SEO (Months 5–6)

**Goal:** Agent generates content and optimizes for search

| Feature               | Description                          | Priority |
| --------------------- | ------------------------------------ | -------- |
| **Content Marketing** |                                      |          |
| Ad Copy Generation    | AI writes ad headlines/descriptions  | P0       |
| Blog Writing          | Generate SEO-optimized blog posts    | P1       |
| Website Copy          | Landing page and website content     | P1       |
| Product Descriptions  | E-commerce product copy              | P1       |
| Email Copy            | Newsletter and campaign content      | P1       |
| **SEO**               |                                      |          |
| Keyword Research      | AI-powered keyword discovery         | P0       |
| On-page SEO           | Content optimization recommendations | P0       |
| Technical SEO         | Site health audits and fixes         | P1       |
| Local SEO             | Google Business Profile optimization | P1       |
| SEO Reporting         | Track rankings and organic traffic   | P1       |

### Phase 4: Social Media & Email (Months 7–8)

**Goal:** Multi-channel marketing automation

| Feature                    | Description                                                  | Priority |
| -------------------------- | ------------------------------------------------------------ | -------- |
| **Social Media Marketing** |                                                              |          |
| Social Media Strategy      | AI-generated content calendar                                | P0       |
| Content Scheduling         | Auto-post across platforms                                   | P0       |
| Platform Support           | Facebook, Instagram, LinkedIn, TikTok, X, YouTube, Pinterest | P0       |
| Community Management       | Respond to comments and DMs                                  | P1       |
| Influencer Outreach        | Find and contact relevant influencers                        | P1       |
| Social Listening           | Monitor brand mentions and sentiment                         | P2       |
| **Email Marketing**        |                                                              |          |
| Email Strategy             | AI-generated email campaigns                                 | P0       |
| Automation Sequences       | Welcome, drip, abandoned cart flows                          | P0       |
| Newsletter Creation        | Weekly/monthly email digests                                 | P1       |
| A/B Testing                | Subject line and content optimization                        | P1       |
| List Segmentation          | AI-powered audience grouping                                 | P2       |

### Phase 5: Branding & Strategy (Months 9–10)

**Goal:** Full-service marketing agency capabilities

| Feature                        | Description                               | Priority |
| ------------------------------ | ----------------------------------------- | -------- |
| **Marketing Strategy**         |                                           |          |
| Marketing Strategy Development | AI-generated marketing plans              | P0       |
| Go-to-Market Strategy          | Product launch planning                   | P1       |
| Market Research                | Industry and audience analysis            | P1       |
| Competitor Analysis            | Automated competitor benchmarking         | P1       |
| Customer Persona Development   | AI-generated buyer personas               | P1       |
| Customer Journey Mapping       | Touchpoint optimization                   | P2       |
| **Branding**                   |                                           |          |
| Brand Identity Design          | AI-generated logo concepts                | P1       |
| Brand Guidelines               | Color, typography, voice standards        | P1       |
| Brand Messaging                | Value proposition and messaging framework | P1       |
| Tagline Creation               | AI-generated taglines                     | P2       |
| Visual Identity                | Style guide generation                    | P2       |

### Phase 6: Website Services (Months 11–12)

**Goal:** Complete website and e-commerce support

| Feature                    | Description                  | Priority |
| -------------------------- | ---------------------------- | -------- |
| **Website Services**       |                              |          |
| Landing Page Design        | AI-generated landing pages   | P0       |
| Website Optimization       | CRO recommendations          | P1       |
| UX/UI Design               | User experience audits       | P1       |
| Speed Optimization         | Performance improvements     | P1       |
| Accessibility Optimization | WCAG compliance              | P2       |
| **E-commerce**             |                              |          |
| Shopify Integration        | Product and campaign sync    | P1       |
| WooCommerce Integration    | WordPress e-commerce support | P1       |
| Product Feed Management    | Catalog optimization         | P2       |

### Phase 7: Analytics & Intelligence (Months 13–14)

**Goal:** Advanced analytics and predictive capabilities

| Feature                   | Description                      | Priority |
| ------------------------- | -------------------------------- | -------- |
| **Analytics & Reporting** |                                  |          |
| Marketing Dashboards      | Real-time performance views      | P0       |
| KPI Reporting             | Automated metric tracking        | P0       |
| Attribution Analysis      | Multi-touch attribution          | P1       |
| ROI Reporting             | Revenue impact analysis          | P1       |
| Funnel Analysis           | Conversion funnel optimization   | P1       |
| Heatmaps                  | User behavior visualization      | P2       |
| **Intelligence**          |                                  |          |
| Predictive Analytics      | ML forecasting models            | P1       |
| Auto-learning             | Agent improves from outcomes     | P1       |
| Industry Templates        | Pre-built strategies by vertical | P2       |

### Phase 8: Scale & Platform (Months 15–18)

**Goal:** Multi-tenant platform and partner ecosystem

| Feature            | Description                    | Priority |
| ------------------ | ------------------------------ | -------- |
| Agency White-label | Rebrand for marketing agencies | P1       |
| Partner API        | Let resellers integrate        | P1       |
| Mobile App         | iOS/Android management         | P2       |
| Multi-language     | International support          | P2       |
| Marketplace        | Third-party tool integrations  | P2       |

---

## 6. Service Categories (Detailed)

### 1. Marketing Strategy

- Marketing strategy development
- Go-to-market (GTM) strategy
- Market research
- Competitor analysis
- Customer persona development
- Customer journey mapping
- Product positioning
- Brand positioning
- Pricing strategy
- Marketing audits
- Marketing consulting
- Fractional CMO services
- Marketing roadmap planning

### 2. Branding

- Brand identity design
- Logo design
- Brand guidelines
- Brand messaging
- Brand voice development
- Rebranding
- Naming services
- Tagline creation
- Brand storytelling
- Visual identity
- Packaging design
- Employer branding

### 3. Website Services

- Website design
- Website development
- Landing page design
- UX/UI design
- Website optimization
- Website maintenance
- Website speed optimization
- Conversion rate optimization (CRO)
- Accessibility optimization
- CMS development
- WordPress development
- Shopify development
- Webflow development
- E-commerce development

### 4. Search Engine Optimization (SEO)

- Technical SEO
- On-page SEO
- Off-page SEO
- Local SEO
- International SEO
- Keyword research
- Link building
- SEO audits
- Content optimization
- Google Business Profile optimization
- Schema markup
- Site migration SEO
- SEO reporting

### 5. Content Marketing

- Content strategy
- Blog writing
- Copywriting
- Website copy
- Sales copy
- Email copy
- Product descriptions
- Whitepapers
- Case studies
- E-books
- Newsletters
- Ghostwriting
- Press releases
- Script writing
- Technical writing

### 6. Social Media Marketing

- Social media strategy
- Account setup
- Content planning
- Content creation
- Graphic design
- Community management
- Social media scheduling
- Influencer outreach
- Social listening
- Reputation management
- Hashtag research
- Trend research
- Engagement campaigns

**Supported Platforms:**

- Facebook
- Instagram
- LinkedIn
- TikTok
- X (Twitter)
- YouTube
- Pinterest
- Snapchat
- Threads

### 7. Email Marketing

- Email strategy
- Newsletter creation
- Automation
- Welcome sequences
- Drip campaigns
- Abandoned cart campaigns
- Promotional campaigns
- Transactional emails
- Email design
- A/B testing
- List segmentation
- Deliverability optimization

### 8. Analytics & Reporting

- Marketing dashboards
- KPI reporting
- Attribution analysis
- ROI reporting
- Funnel analysis
- Customer analytics
- Heatmaps
- User behavior analysis
- Event tracking
- Conversion tracking
- Data visualization

---

## 7. Frontend Architecture

### Dashboard Pages

```
/dashboard
├── /campaigns          # Ad campaign management
├── /content            # Content marketing tools
├── /seo                # SEO optimization
├── /social             # Social media management
├── /email              # Email marketing
├── /analytics          # Analytics & reporting
├── /strategy           # Marketing strategy
├── /branding           # Branding tools
├── /website            # Website services
├── /settings           # Account & integrations
└── /billing            # USDC payments
```

### UI Components

- **Service Selector** — Choose which marketing service to use
- **AI Chat Interface** — Interact with specialized agents
- **Campaign Cards** — Visual campaign management
- **Content Editor** — Write and edit marketing content
- **Analytics Dashboard** — Charts, graphs, KPIs
- **Calendar View** — Content scheduling
- **Task Queue** — Approval workflow for recommendations

---

## 8. Business Model

| Tier        | Price   | Features                                         |
| ----------- | ------- | ------------------------------------------------ |
| **Free**    | $0/mo   | 1 platform, 3 campaigns, basic analytics         |
| **Starter** | $29/mo  | 2 platforms, 10 campaigns, content generation    |
| **Growth**  | $79/mo  | All platforms, unlimited campaigns, SEO + social |
| **Agency**  | $199/mo | Multi-client, white-label, all services          |

**Service Add-ons:**

- Content Pack: $19/mo (50 blog posts, 100 social posts)
- SEO Pack: $29/mo (keyword research, on-page optimization)
- Email Pack: $19/mo (unlimited automation sequences)

**Revenue streams:**

- Subscription fees
- Transaction fees on USDC ad payments (1–2%)
- Premium AI features (content generation, predictive analytics)
- Service add-on fees

---

## 9. Technical Architecture (Future State)

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Dashboard │  │ Mobile   │  │ API      │  │ Widget   │       │
│  │ (Next.js) │  │ App      │  │ (REST)   │  │ (Embed)  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       └──────────────┼──────────────┼──────────────┘             │
│                      ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Mastra Agent Framework                  │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │ Campaign   │ │ Content    │ │ Strategy   │           │   │
│  │  │ Optimizer  │ │ Generator  │ │ Agent      │           │   │
│  │  └────────────┘ └────────────┘ └────────────┘           │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │ SEO        │ │ Social     │ │ Email      │           │   │
│  │  │ Agent      │ │ Media Agent│ │ Agent      │           │   │
│  │  └────────────┘ └────────────┘ └────────────┘           │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │ Branding   │ │ Website    │ │ Analytics  │           │   │
│  │  │ Agent      │ │ Agent      │ │ Engine     │           │   │
│  │  └────────────┘ └────────────┘ └────────────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      Tools Layer                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │ Google   │ │ Meta     │ │ TikTok   │ │ LinkedIn │    │   │
│  │  │ Ads MCP  │ │ Ads MCP  │ │ Ads MCP  │ │ Ads MCP  │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │ SEO      │ │ Email    │ │ Social   │ │ Content  │    │   │
│  │  │ Tools    │ │ Tools    │ │ Media API│ │ Gen AI   │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │ Website  │ │ Design   │ │ Analytics│ │ Arc      │    │   │
│  │  │ Builder  │ │ Tools    │ │ APIs     │ │ Wallet   │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     Data & Storage                        │   │
│  │  PostgreSQL │ Redis │ Vector DB │ Object Storage          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Blockchain Layer                        │   │
│  │  Arc (USDC) │ Circle Wallets │ CCTP Bridge                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Success Metrics

| Metric                  | Phase 1 | Phase 4 | Phase 7 | Phase 8 |
| ----------------------- | ------- | ------- | ------- | ------- |
| Active Users            | 50      | 1,000   | 10,000  | 50,000  |
| Avg. ROAS Improvement   | 15%     | 30%     | 50%     | 50%     |
| Campaigns Managed       | 100     | 5,000   | 100,000 | 500,000 |
| Monthly Ad Spend        | $10K    | $500K   | $10M    | $50M    |
| Content Pieces/Month    | 0       | 10,000  | 100,000 | 1M      |
| User Retention (30-day) | 40%     | 60%     | 75%     | 80%     |
| MRR                     | $1K     | $50K    | $500K   | $2M     |

---

## 11. Risks & Mitigations

| Risk                             | Impact | Mitigation                              |
| -------------------------------- | ------ | --------------------------------------- |
| API rate limits                  | High   | Caching, batch requests, respect quotas |
| Ad platform policy changes       | Medium | Abstract tool layer, quick adaptation   |
| User trust (autonomous spending) | High   | Approval workflow, spending limits      |
| LLM hallucinations               | High   | Human-in-the-loop, confidence scoring   |
| Blockchain UX complexity         | Medium | Abstract wallet details, fiat on-ramp   |
| Content quality                  | High   | Human review option, quality scoring    |
| SEO algorithm changes            | Medium | Diversified strategy, rapid adaptation  |

---

## 12. Open Questions

1. Should the agent have full autonomy or always require approval?
2. How do we handle businesses without existing ad accounts?
3. What's the minimum viable ad budget for the product to be useful?
4. Should we integrate with Shopify/WooCommerce for e-commerce users?
5. How do we compete with free tools like Google's Performance Max?
6. What AI models to use for content generation vs. strategy?
7. How to handle multi-language content for international businesses?
8. What's the right balance between AI automation and human oversight?
