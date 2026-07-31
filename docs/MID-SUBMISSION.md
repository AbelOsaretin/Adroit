# Adroit — Mid-Submission Checkpoint

## Track: Payments (Agentic Economy)

## Vision

**Adroit** is an autonomous AI marketing agency platform that provides the same holistic marketing experience a business would get from a real marketing agency — but powered by AI and accessible to small businesses, SMEs, and entrepreneurs who can't afford traditional agencies ($2,000–$10,000+/month).

A real marketing agency offers:

- Marketing strategy & planning
- Brand identity & positioning
- Website design & development
- SEO & content marketing
- Paid advertising (PPC)
- Social media management
- Email marketing
- Analytics & reporting

**Adroit will do all of this** — autonomously, 24/7, at a fraction of the cost.

## Hackathon MVP: Paid Advertising (PPC)

For this hackathon, we're **niching down to paid advertising** to demonstrate the core autonomous payment capabilities on Arc. This is the foundation that proves the concept: an AI agent that can manage campaigns and make autonomous USDC payments.

### What We've Built (MVP)

1. **Multi-Platform Ad Management**
   
   - Real Google Ads integration via MCP (Model Context Protocol)
   - Real Meta Ads integration via MCP
   - 6 additional platforms mocked (LinkedIn, TikTok, Microsoft, Amazon, Pinterest, Snap)
   - 50+ tools across all platforms

2. **USDC Payments on Arc**
   
   - Circle Developer-Controlled Wallet integration
   - Autonomous ad spend using USDC
   - Transaction tracking and audit trail
   - Gas-abstracted payments (no ETH needed)

3. **AI Campaign Optimizer Agent**
   
   - Analyzes campaign performance (ROAS, CPC, CTR)
   - Detects anomalies and optimization opportunities
   - Generates actionable recommendations
   - Cross-platform budget allocation

4. **Advanced Marketing Tools**
   
   - Retargeting & remarketing campaigns
   - Video, app install, and lead generation campaigns
   - Multi-touch attribution
   - Customer lifetime value calculation
   - Bid optimization and performance forecasting
   - Competitor analysis
   - A/B testing variant generation

### Tech Stack

- **Framework:** Mastra (AI Agent + Workflows)
- **Blockchain:** Arc Testnet (USDC as gas)
- **Wallet:** Circle Developer-Controlled
- **Frontend:** Next.js Dashboard
- **Storage:** PostgreSQL + LibSQL

## Full Roadmap (Post-Hackathon)

After the hackathon, we'll expand Adroit to cover the complete marketing agency experience:

| Phase   | Services                                      | Timeline     |
| ------- | --------------------------------------------- | ------------ |
| Phase 3 | Content Marketing (blog, copy, email content) | Months 5–6   |
| Phase 4 | Social Media & Email Marketing                | Months 7–8   |
| Phase 5 | Branding & Marketing Strategy                 | Months 9–10  |
| Phase 6 | Website Services (design, development, CRO)   | Months 11–12 |
| Phase 7 | SEO & Analytics                               | Months 13–14 |
| Phase 8 | Platform & Partner Ecosystem                  | Months 15–18 |

**The vision:** One AI agent that handles everything a marketing agency does — from strategy to execution to payment — all autonomous, all on-chain.

## Why Arc?

Arc makes this possible because:

1. **USDC as gas** — No need to hold ETH or other native tokens
2. **Gas-abstracted payments** — Users just pay with USDC
3. **Sub-second finality** — Fast campaign budget changes
4. **Stable fees** — Predictable costs for small businesses

Adroit uses Arc to autonomously pay for ad spend across Google, Meta, and other platforms — all in USDC.

## What's Next

1. User authentication and multi-tenancy
2. Production database setup
3. Real API integrations for remaining platforms
4. Content generation (ad copy, blog posts)
5. Email marketing automation
6. Social media scheduling
7. SEO optimization tools
8. Branding and strategy tools

## Video Script (2-3 mins)

**0:00-0:30** — Intro
"Hi, I'm Abel and this is Adroit — an autonomous AI marketing agency that gives small businesses the same enterprise-level marketing services that big agencies charge thousands for."

**0:30-1:00** — Vision
"A real marketing agency handles strategy, branding, websites, SEO, ads, social media, email — everything. Adroit will do all of this autonomously. For this hackathon, we're niching down to paid advertising to prove the core concept: an AI agent that manages campaigns and pays for them using USDC on Arc."

**1:00-1:45** — Demo
[Show Mastra Studio dashboard]
"Here's the Campaign Optimizer agent with 50+ tools across 8 ad platforms."

[Show real Meta Ads integration]
"I can ask it to show my Meta Ads campaigns — this is a real API call, not mock data."

[Show campaign creation]
"Let's create a campaign. The agent handles the API call, tracks the budget, and can pause or activate campaigns."

**1:45-2:15** — Payments
"The real magic is USDC payments on Arc. The agent holds a Circle wallet and can autonomously pay for ad spend — no ETH needed for gas."

[Show wallet balance and transaction]

**2:15-2:45** — Architecture & Roadmap
"Built on Mastra framework with MCP servers for each platform. After the hackathon, we'll expand to content, social media, email, SEO, and branding — making Adroit a complete AI marketing agency."

**2:45-3:00** — Closing
"Adroit makes enterprise marketing accessible to every small business. Thanks to Arc for making gas-free USDC payments possible."

## GitHub Repository

https://github.com/AbelOsaretin/Adroit

## Environment Setup

```bash
npm install
cp .env.example .env
# Add your credentials
npm run dev
```

## Key Files

- `src/mastra/agents/campaign-optimizer.ts` — Main AI agent (50+ tools)
- `src/mastra/mcp-bridge.ts` — MCP server connections (8 platforms)
- `src/mcp/google-ads/` — Google Ads integration (real)
- `src/mcp/meta-ads/` — Meta Ads integration (real)
- `src/mcp/linkedin-ads/` through `src/mcp/snap-ads/` — Mock platforms
- `src/mastra/tools/` — Custom tools (analytics, retargeting, performance)
- `docs/PRD.md` — Full product roadmap
