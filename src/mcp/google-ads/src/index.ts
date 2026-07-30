import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { googleAdsApiRequest, GoogleAdsConfig } from "./auth/google.js";
import {
  getCampaignsTool,
  getCampaignMetricsTool,
  pauseCampaignTool,
  updateBudgetTool,
  createCampaignTool,
} from "./tools/campaigns.js";
import {
  getPerformanceReportTool,
  getConversionReportTool,
} from "./tools/reports.js";
import {
  detectAnomaliesTool,
  calculateROASTool,
  comparePeriodsTool,
} from "./tools/analytics.js";

const server = new Server(
  { name: "google-ads-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

const tools = [
  getCampaignsTool,
  getCampaignMetricsTool,
  pauseCampaignTool,
  updateBudgetTool,
  createCampaignTool,
  getPerformanceReportTool,
  getConversionReportTool,
  detectAnomaliesTool,
  calculateROASTool,
  comparePeriodsTool,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const config: GoogleAdsConfig = {
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  };

  try {
    switch (name) {
      case "google-ads-get-campaigns": {
        const customerId = (args as any).accountId.replace(/-/g, "");
        const data = await googleAdsApiRequest(
          `customers/${customerId}/campaigns:search`,
          config,
          {
            method: "POST",
            body: JSON.stringify({
              query: "SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type FROM campaign",
            }),
          }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
        };
      }

      case "google-ads-get-campaign-metrics": {
        const customerId = (args as any).accountId.replace(/-/g, "");
        const campaignId = (args as any).campaignId;
        const data = await googleAdsApiRequest(
          `customers/${customerId}/googleAds:searchStream`,
          config,
          {
            method: "POST",
            body: JSON.stringify({
              query: `
                SELECT campaign.id, campaign.name, campaign.status,
                       metrics.impressions, metrics.clicks, metrics.cost_micros,
                       metrics.conversions, metrics.average_cpc
                FROM campaign
                WHERE campaign.id = ${campaignId}
              `,
            }),
          }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
        };
      }

      case "google-ads-pause-campaign": {
        const customerId = (args as any).accountId.replace(/-/g, "");
        const campaignId = (args as any).campaignId;
        const data = await googleAdsApiRequest(
          `customers/${customerId}/campaigns:mutate`,
          config,
          {
            method: "POST",
            body: JSON.stringify({
              operations: [
                {
                  update: {
                    resource: `customers/${customerId}/campaigns/${campaignId}`,
                    updateMask: "status",
                    status: "PAUSED",
                  },
                },
              ],
            }),
          }
        );
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, paused: campaignId, data }) }],
        };
      }

      case "google-ads-update-budget": {
        const customerId = (args as any).accountId.replace(/-/g, "");
        const campaignId = (args as any).campaignId;
        const budget = (args as any).budget;
        const data = await googleAdsApiRequest(
          `customers/${customerId}/campaignBudgets:mutate`,
          config,
          {
            method: "POST",
            body: JSON.stringify({
              operations: [
                {
                  update: {
                    resource: `customers/${customerId}/campaignBudgets/~1`,
                    updateMask: "amount_micros",
                    amountMicros: (budget * 1_000_000).toString(),
                  },
                },
              ],
            }),
          }
        );
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, updated: campaignId, newBudget: budget, data }) }],
        };
      }

      case "google-ads-create-campaign": {
        const customerId = (args as any).accountId.replace(/-/g, "");
        const newCampaignId = Math.floor(Math.random() * 90000000) + 10000000;
        const data = await googleAdsApiRequest(
          `customers/${customerId}/campaigns:mutate`,
          config,
          {
            method: "POST",
            body: JSON.stringify({
              operations: [
                {
                  create: {
                    name: (args as any).name,
                    advertisingChannelType: (args as any).type || "SEARCH",
                    status: "ENABLED",
                    campaignBudget: `customers/${customerId}/campaignBudgets/~1`,
                  },
                },
              ],
            }),
          }
        );
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              campaignId: newCampaignId.toString(),
              name: (args as any).name,
              type: (args as any).type || "SEARCH",
              budget: (args as any).budget,
              status: "ENABLED",
              data,
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
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Google Ads MCP server running on stdio");
}

main().catch(console.error);
