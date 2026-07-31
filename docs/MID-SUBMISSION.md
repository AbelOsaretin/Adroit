# Adroit — Mid-Submission Checkpoint

## Track: Payments (Agentic Economy)

## What We've Built

**Adroit** is an autonomous AI marketing agency platform that manages advertising campaigns and processes payments using USDC on Arc blockchain.

### Core Features (Working)

1. **Multi-Platform Ad Management**
   - Real Google Ads integration via MCP (Model Context Protocol)
   - Real Meta Ads integration via MCP
   - 6 additional platforms (LinkedIn, TikTok, Microsoft, Amazon, Pinterest, Snap) with mock implementations
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

### What's Working
- Real Google Ads API calls (create, pause, activate, update budget)
- Real Meta Ads API calls (create, pause, activate, update budget)
- USDC wallet balance checking and payments
- Cross-platform analytics and comparison
- AI-powered campaign recommendations
- Mock implementations for 6 additional ad platforms
- Mock retargeting, remarketing, and performance marketing tools

### What's Next
- User authentication and multi-tenancy
- Production database setup
- Real API integrations for remaining platforms
- Content generation (ad copy, blog posts)
- Email marketing automation
- Social media scheduling
- SEO optimization tools

## Video Script (2-3 mins)

**0:00-0:30** — Intro
"Hi, I'm Abel and this is Adroit — an autonomous AI marketing agency that manages ad campaigns and processes payments using USDC on Arc blockchain."

**0:30-1:00** — Problem
"Small businesses can't afford marketing agencies that charge $2,000-$10,000 per month. Adroit gives them a 24/7 AI marketing team at a fraction of the cost."

**1:00-1:45** — Demo
[Show Mastra Studio dashboard]
"Here's the Campaign Optimizer agent. It has access to 50+ tools across 8 ad platforms — Google, Meta, LinkedIn, TikTok, and more."

[Show Meta Ads tool working]
"I can ask it to show my Meta Ads campaigns, and it fetches real data from the API."

[Show campaign creation]
"Let's create a test campaign — the agent handles the API call, tracks the budget, and can pause or activate campaigns."

**1:45-2:15** — Payments
"The real magic is USDC payments on Arc. The agent holds a Circle wallet and can autonomously pay for ad spend using USDC — no ETH needed for gas."

[Show wallet balance and transaction]

**2:15-2:45** — Architecture
"Built on Mastra framework with MCP servers for each platform. The agent uses Groq's free LLM model for inference. Everything runs on Arc Testnet."

**2:45-3:00** — Closing
"Adroit makes enterprise-level marketing accessible to every small business. Thanks to Arc for making gas-free USDC payments possible."

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
- `src/mastra/agents/campaign-optimizer.ts` — Main AI agent
- `src/mastra/mcp-bridge.ts` — MCP server connections
- `src/mcp/google-ads/` — Google Ads integration
- `src/mcp/meta-ads/` — Meta Ads integration
- `src/mastra/tools/` — Custom tools (analytics, retargeting, performance)
- `docs/PRD.md` — Full product requirements
