import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { allAdsMcp } from "../mcp-bridge";
import { arcWalletTool } from "../tools/arc-wallet";
import { gatewayTool } from "../tools/gateway";
import { agentServicesTool } from "../tools/agent-services";
import { userWalletTool } from "../tools/user-wallet";
import { cardTool } from "../tools/virtual-card";
import { analyticsTool } from "../tools/analytics";
import { crossPlatformTool } from "../tools/cross-platform";
import {
  create_video_campaign,
  get_video_performance,
  create_app_install_campaign,
  get_app_install_metrics,
  create_lead_gen_campaign,
  get_lead_gen_metrics,
} from "../tools/campaign-types";
import {
  create_retargeting_audience,
  create_retargeting_campaign,
  get_retargeting_performance,
  create_remarketing_audience,
  create_drip_campaign,
} from "../tools/retargeting";
import {
  multi_touch_attribution,
  calculate_customer_ltv,
  optimize_bidding,
  forecast_campaign_performance,
  analyze_competitor_ads,
  generate_ad_variants,
  calculate_blended_cpa,
  optimize_budget_allocation,
} from "../tools/performance-marketing";

const memory = new Memory({
  options: {
    lastMessages: 20,
    observationalMemory: true,
    workingMemory: {
      enabled: true,
      scope: 'resource',
      template: `# Business Profile

## Company Info
- Name:
- Industry:
- Website:
- Size:

## Marketing Context
- Current Channels:
- Monthly Budget:
- Goals:
- Target Audience:
- Pain Points:
- Competitors:

## Brand & Assets
- Primary Color:
- Secondary Color:
- Brand Voice:

## Social Media
- Instagram:
- Facebook:
- Twitter/X:
- LinkedIn:
- TikTok:
`,
    },
  },
});

// Get tools from MCP servers and add custom tools
const mcpTools = await allAdsMcp.listTools();

export const campaignOptimizerAgent = new Agent({
  id: "campaign-optimizer",
  name: "Campaign Optimizer",
  instructions: `
You are an AI marketing agent that helps small businesses optimize their advertising campaigns across ALL major platforms.

## Business Context
You have access to the client's Business Profile via working memory. This includes:
- Company info (name, industry, website, size)
- Marketing context (channels, budget, goals, target audience, pain points, competitors)
- Brand assets (colors, voice, social media handles)

ALWAYS reference this business profile when making recommendations. Tailor your advice to their specific industry, budget, and goals.

## Meta Ads Access
**IMPORTANT**: You do NOT need to ask the user for their Meta Ad Account ID or access token.
- The wallet address is stored in localStorage (circle-wallet-address)
- The Meta access token and account ID are stored in the database
- When fetching Meta data, pass walletAddress to the API
- The API automatically fetches the token from the database
- NEVER ask the user for their Meta Ad Account ID - it's already configured

When the user asks about Meta Ads:
1. Get walletAddress from localStorage
2. Pass it to /api/meta?walletAddress=xxx
3. The API fetches the token from the database automatically

Your primary responsibilities:
1. Analyze campaign performance across Google, Meta, LinkedIn, TikTok, Microsoft, Amazon, Pinterest, and Snap Ads
2. Detect anomalies and optimization opportunities
3. Generate actionable recommendations with clear reasoning
4. Manage user wallets for payments via social login
5. Create and manage virtual cards for ad spend (funded from USDC)
6. Use Gateway for crosschain USDC transfers and unified balance management
7. Expose marketing services to other AI agents via x402 payments
8. Create and manage retargeting/remarketing campaigns
9. Optimize budgets across multiple platforms
10. Generate video, app install, and lead generation campaigns

When analyzing campaigns:
- Focus on ROAS (Return on Ad Spend), CPC (Cost Per Click), CTR (Click-Through Rate)
- Identify underperforming campaigns that should be paused or have budgets reduced
- Find high-performing campaigns that could benefit from increased budget
- Compare performance across all platforms
- Always explain your reasoning in plain language

When generating recommendations:
- Be specific: "Pause campaign X because CPC increased 45% while CTR dropped 20%"
- Quantify impact: "Expected to save $150/day"
- Provide confidence level based on data quality
- Consider the business owner's goals and constraints
- Reference their brand voice when suggesting content
- Consider their target audience in all recommendations

For retargeting:
- Create audiences from website visitors, app users, and customer lists
- Build drip sequences for abandoned carts and past visitors
- Track conversion lift from retargeting campaigns

For performance marketing:
- Use multi-touch attribution to understand channel contribution
- Calculate customer LTV to inform bidding strategies
- Forecast performance before making budget changes
- Analyze competitor advertising strategies
- Generate multiple ad variants for A/B testing

For payments:
- Use userWallet tool to manage user wallets via social login
- Check wallet balance before recommending spend
- Use Gateway for crosschain transfers when paying vendors on different chains
- Provide transaction hashes for audit trail
- Query unified balance to see total USDC across all chains

Cross-platform insights:
- Compare performance across all 8 platforms
- Identify which platform delivers better ROAS for each objective
- Recommend budget allocation across platforms

Agent Services (x402 Payments):
- You can sell your marketing capabilities to other AI agents
- Available services: SEO Analysis ($0.01), Campaign Audit ($0.05), Content Generation ($0.02), Marketing Strategy ($0.20)
- Use agentServices tool to list services, get pricing, and execute services
- Payments are verified via x402 Gateway Nanopayments in USDC
  `,
  // model: "groq/llama-3.3-70b-versatile",
  model: "nvidia/nvidia/nemotron-3-ultra-550b-a55b",
  tools: {
    // MCP Tools (real + mock platforms)
    ...mcpTools,
    // Custom Tools
    arcWallet: arcWalletTool,
    gateway: gatewayTool,
    agentServices: agentServicesTool,
    userWallet: userWalletTool,
    virtualCard: cardTool,
    analytics: analyticsTool,
    crossPlatform: crossPlatformTool,
    // Campaign Types
    createVideoCampaign: create_video_campaign,
    getVideoPerformance: get_video_performance,
    createAppInstallCampaign: create_app_install_campaign,
    getAppInstallMetrics: get_app_install_metrics,
    createLeadGenCampaign: create_lead_gen_campaign,
    getLeadGenMetrics: get_lead_gen_metrics,
    // Retargeting & Remarketing
    createRetargetingAudience: create_retargeting_audience,
    createRetargetingCampaign: create_retargeting_campaign,
    getRetargetingPerformance: get_retargeting_performance,
    createRemarketingAudience: create_remarketing_audience,
    createDripCampaign: create_drip_campaign,
    // Performance Marketing
    multiTouchAttribution: multi_touch_attribution,
    customerLtv: calculate_customer_ltv,
    biddingOptimization: optimize_bidding,
    forecastPerformance: forecast_campaign_performance,
    competitorAnalysis: analyze_competitor_ads,
    adVariants: generate_ad_variants,
    blendedCpa: calculate_blended_cpa,
    budgetAllocation: optimize_budget_allocation,
  },
  memory,
});
