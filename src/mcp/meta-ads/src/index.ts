import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import adsSdk from "facebook-nodejs-business-sdk";
import {
  get_campaigns,
  get_campaign_metrics,
  pause_campaign,
  update_budget,
  create_campaign,
} from "./tools/campaigns.js";
import {
  get_performance_report,
  get_insights,
} from "./tools/reports.js";
import {
  detect_anomalies,
  calculate_roas,
  compare_periods,
} from "./tools/analytics.js";

const server = new Server(
  { name: "meta-ads-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

const tools = [
  get_campaigns,
  get_campaign_metrics,
  pause_campaign,
  update_budget,
  create_campaign,
  get_performance_report,
  get_insights,
  detect_anomalies,
  calculate_roas,
  compare_periods,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const accessToken = process.env.META_ACCESS_TOKEN!;
  const AdAccount = adsSdk.AdAccount;
  const Campaign = adsSdk.Campaign;

  // Initialize the API
  adsSdk.FacebookAdsApi.init(accessToken);

  // Ensure account ID has act_ prefix
  const rawAccountId = (args as any).accountId;
  const accountId = rawAccountId?.startsWith("act_") ? rawAccountId : `act_${rawAccountId}`;

  try {
    switch (name) {
      case "meta-ads-get-campaigns": {
        const account = new AdAccount(accountId);
        const campaigns = await account.getCampaigns([
          Campaign.Fields.id,
          Campaign.Fields.name,
          Campaign.Fields.status,
          Campaign.Fields.objective,
          Campaign.Fields.daily_budget,
        ]);
        return {
          content: [{ type: "text", text: JSON.stringify(campaigns) }],
        };
      }

      case "meta-ads-get-campaign-metrics": {
        const campaignId = (args as any).campaignId;
        const campaign = new Campaign(campaignId);
        const insights = await campaign.getInsights([
          "impressions",
          "clicks",
          "spend",
          "actions",
          "ctr",
          "cpc",
        ]);
        return {
          content: [{ type: "text", text: JSON.stringify(insights) }],
        };
      }

      case "meta-ads-pause-campaign": {
        const campaignId = (args as any).campaignId;
        const campaign = new Campaign(campaignId);
        await campaign.update({
          [Campaign.Fields.status]: "PAUSED",
        });
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, paused: campaignId }) }],
        };
      }

      case "meta-ads-update-budget": {
        const campaignId = (args as any).campaignId;
        const budget = (args as any).budget;
        const campaign = new Campaign(campaignId);
        await campaign.update({
          [Campaign.Fields.daily_budget]: (budget * 100).toString(),
        });
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, updated: campaignId, newBudget: budget }) }],
        };
      }

      case "meta-ads-create-campaign": {
        const account = new AdAccount(accountId);
        const newCampaign = await account.createCampaign([], {
          [Campaign.Fields.name]: (args as any).name,
          [Campaign.Fields.status]: "ACTIVE",
          [Campaign.Fields.objective]: (args as any).objective || "OUTCOME_TRAFFIC",
          [Campaign.Fields.daily_budget]: ((args as any).budget * 100).toString(),
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              campaignId: newCampaign.id,
              name: (args as any).name,
              objective: (args as any).objective,
              status: "ACTIVE",
              dailyBudget: (args as any).budget,
            }),
          }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error: any) {
    // Meta SDK throws detailed errors
    const errorMessage = error.message || error.toString();
    const errorResponse = error.response?.body?.error || error;
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: errorMessage,
          details: errorResponse,
        }),
      }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Meta Ads MCP server running on stdio");
}

main().catch(console.error);
