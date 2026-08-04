import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { allAdsMcp } from "../mcp-bridge";
import { arcWalletTool } from "../tools/arc-wallet";
import { gatewayTool } from "../tools/gateway";
import { agentServicesTool } from "../tools/agent-services";
import { analyticsTool } from "../tools/analytics";
import { crossPlatformTool } from "../tools/cross-platform";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
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

// Wrap tool definitions as Mastra tools
const videoCampaignTool = createTool({
  id: create_video_campaign.name,
  description: create_video_campaign.description,
  inputSchema: create_video_campaign.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(create_video_campaign.name, inputData),
});

const videoPerformanceTool = createTool({
  id: get_video_performance.name,
  description: get_video_performance.description,
  inputSchema: get_video_performance.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(get_video_performance.name, inputData),
});

const appInstallCampaignTool = createTool({
  id: create_app_install_campaign.name,
  description: create_app_install_campaign.description,
  inputSchema: create_app_install_campaign.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(create_app_install_campaign.name, inputData),
});

const appInstallMetricsTool = createTool({
  id: get_app_install_metrics.name,
  description: get_app_install_metrics.description,
  inputSchema: get_app_install_metrics.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(get_app_install_metrics.name, inputData),
});

const leadGenCampaignTool = createTool({
  id: create_lead_gen_campaign.name,
  description: create_lead_gen_campaign.description,
  inputSchema: create_lead_gen_campaign.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(create_lead_gen_campaign.name, inputData),
});

const leadGenMetricsTool = createTool({
  id: get_lead_gen_metrics.name,
  description: get_lead_gen_metrics.description,
  inputSchema: get_lead_gen_metrics.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(get_lead_gen_metrics.name, inputData),
});

const retargetingAudienceTool = createTool({
  id: create_retargeting_audience.name,
  description: create_retargeting_audience.description,
  inputSchema: create_retargeting_audience.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(create_retargeting_audience.name, inputData),
});

const retargetingCampaignTool = createTool({
  id: create_retargeting_campaign.name,
  description: create_retargeting_campaign.description,
  inputSchema: create_retargeting_campaign.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(create_retargeting_campaign.name, inputData),
});

const retargetingPerformanceTool = createTool({
  id: get_retargeting_performance.name,
  description: get_retargeting_performance.description,
  inputSchema: get_retargeting_performance.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(get_retargeting_performance.name, inputData),
});

const remarketingAudienceTool = createTool({
  id: create_remarketing_audience.name,
  description: create_remarketing_audience.description,
  inputSchema: create_remarketing_audience.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(create_remarketing_audience.name, inputData),
});

const dripCampaignTool = createTool({
  id: create_drip_campaign.name,
  description: create_drip_campaign.description,
  inputSchema: create_drip_campaign.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(create_drip_campaign.name, inputData),
});

const multiTouchAttributionTool = createTool({
  id: multi_touch_attribution.name,
  description: multi_touch_attribution.description,
  inputSchema: multi_touch_attribution.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(multi_touch_attribution.name, inputData),
});

const customerLtvTool = createTool({
  id: calculate_customer_ltv.name,
  description: calculate_customer_ltv.description,
  inputSchema: calculate_customer_ltv.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(calculate_customer_ltv.name, inputData),
});

const biddingOptimizationTool = createTool({
  id: optimize_bidding.name,
  description: optimize_bidding.description,
  inputSchema: optimize_bidding.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) => mockExecute(optimize_bidding.name, inputData),
});

const forecastPerformanceTool = createTool({
  id: forecast_campaign_performance.name,
  description: forecast_campaign_performance.description,
  inputSchema: forecast_campaign_performance.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(forecast_campaign_performance.name, inputData),
});

const competitorAnalysisTool = createTool({
  id: analyze_competitor_ads.name,
  description: analyze_competitor_ads.description,
  inputSchema: analyze_competitor_ads.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(analyze_competitor_ads.name, inputData),
});

const adVariantsTool = createTool({
  id: generate_ad_variants.name,
  description: generate_ad_variants.description,
  inputSchema: generate_ad_variants.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(generate_ad_variants.name, inputData),
});

const blendedCpaTool = createTool({
  id: calculate_blended_cpa.name,
  description: calculate_blended_cpa.description,
  inputSchema: calculate_blended_cpa.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(calculate_blended_cpa.name, inputData),
});

const budgetAllocationTool = createTool({
  id: optimize_budget_allocation.name,
  description: optimize_budget_allocation.description,
  inputSchema: optimize_budget_allocation.inputSchema as any,
  outputSchema: create_tool_output_schema(),
  execute: async (inputData) =>
    mockExecute(optimize_budget_allocation.name, inputData),
});

function create_tool_output_schema() {
  return z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    mockMode: z.boolean().optional(),
  });
}

function mockExecute(toolName: string, inputData: any) {
  const mockId = `${toolName.split("-").slice(-1)[0]}_${Date.now()}`;
  return {
    success: true,
    mockMode: true,
    data: {
      id: mockId,
      tool: toolName,
      input: inputData,
      message: `MOCK: ${toolName} executed successfully`,
      createdAt: new Date().toISOString(),
    },
  };
}

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

Your primary responsibilities:
1. Analyze campaign performance across Google, Meta, LinkedIn, TikTok, Microsoft, Amazon, Pinterest, and Snap Ads
2. Detect anomalies and optimization opportunities
3. Generate actionable recommendations with clear reasoning
4. Manage USDC wallet for payments on Arc blockchain
5. Use Gateway for crosschain USDC transfers and unified balance management
6. Expose marketing services to other AI agents via x402 payments
7. Create and manage retargeting/remarketing campaigns
8. Optimize budgets across multiple platforms
9. Generate video, app install, and lead generation campaigns

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
- Check wallet balance before recommending spend
- Use Gateway for crosschain transfers when paying vendors on different chains
- Use USDC on Arc for direct transactions
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
    analytics: analyticsTool,
    crossPlatform: crossPlatformTool,
    // Campaign Types
    videoCampaign: videoCampaignTool,
    videoPerformance: videoPerformanceTool,
    appInstallCampaign: appInstallCampaignTool,
    appInstallMetrics: appInstallMetricsTool,
    leadGenCampaign: leadGenCampaignTool,
    leadGenMetrics: leadGenMetricsTool,
    // Retargeting & Remarketing
    retargetingAudience: retargetingAudienceTool,
    retargetingCampaign: retargetingCampaignTool,
    retargetingPerformance: retargetingPerformanceTool,
    remarketingAudience: remarketingAudienceTool,
    dripCampaign: dripCampaignTool,
    // Performance Marketing
    multiTouchAttribution: multiTouchAttributionTool,
    customerLtv: customerLtvTool,
    biddingOptimization: biddingOptimizationTool,
    forecastPerformance: forecastPerformanceTool,
    competitorAnalysis: competitorAnalysisTool,
    adVariants: adVariantsTool,
    blendedCpa: blendedCpaTool,
    budgetAllocation: budgetAllocationTool,
  },
  memory,
});
