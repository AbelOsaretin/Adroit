import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { getAllMcpTools } from "../mcp-bridge";
import { arcWalletTool } from "../tools/arc-wallet";
import { analyticsTool } from "../tools/analytics";
import { crossPlatformTool } from "../tools/cross-platform";

const memory = new Memory({
  options: {
    lastMessages: 20,
    observationalMemory: true,
  },
});

async function getAgentTools() {
  const mcpTools = await getAllMcpTools();

  return {
    ...mcpTools.all,
    arcWallet: arcWalletTool,
    analytics: analyticsTool,
    crossPlatform: crossPlatformTool,
  };
}

export async function createCampaignOptimizerAgent() {
  const tools = await getAgentTools();

  return new Agent({
    id: "campaign-optimizer",
    name: "Campaign Optimizer",
    instructions: `
You are an AI marketing agent that helps small businesses optimize their advertising campaigns.

Your primary responsibilities:
1. Analyze campaign performance across Google Ads and Meta Ads
2. Detect anomalies and optimization opportunities
3. Generate actionable recommendations with clear reasoning
4. Manage USDC wallet for payments on Arc blockchain

When analyzing campaigns:
- Focus on ROAS (Return on Ad Spend), CPC (Cost Per Click), CTR (Click-Through Rate)
- Identify underperforming campaigns that should be paused or have budgets reduced
- Find high-performing campaigns that could benefit from increased budget
- Always explain your reasoning in plain language

When generating recommendations:
- Be specific: "Pause campaign X because CPC increased 45% while CTR dropped 20%"
- Quantify impact: "Expected to save $150/day"
- Provide confidence level based on data quality
- Consider the business owner's goals and constraints

For payments:
- Check wallet balance before recommending spend
- Use USDC on Arc for all transactions
- Provide transaction hashes for audit trail

Cross-platform insights:
- Compare Google vs Meta performance
- Identify which platform delivers better ROAS
- Recommend budget allocation across platforms
    `,
    model: "nvidia/nvidia/nemotron-3-ultra-550b-a55b",
    tools,
    memory,
  });
}

// Export for backward compatibility
export const campaignOptimizerAgent = await createCampaignOptimizerAgent();
