import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { metaApiRequest, MetaAuthConfig } from "./auth/meta.js";
import {
  get_campaigns,
  get_campaign_metrics,
  pause_campaign,
  activate_campaign,
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
  activate_campaign,
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

  const rawAccountId = (args as any).accountId;
  const accountId = rawAccountId?.startsWith("act_") ? rawAccountId : `act_${rawAccountId}`;

  const config: MetaAuthConfig = {
    accessToken: process.env.META_ACCESS_TOKEN!,
    adAccountId: accountId,
  };

  try {
    switch (name) {
      case "meta-ads-get-campaigns": {
        const campaigns = await metaApiRequest(
          `/${accountId}/campaigns`,
          { fields: "id,name,status,objective,daily_budget" },
          config
        );
        return {
          content: [{ type: "text", text: JSON.stringify(campaigns.data) }],
        };
      }

      case "meta-ads-get-campaign-metrics": {
        const metrics = await metaApiRequest(
          `/${(args as any).campaignId}/insights`,
          {
            fields: "impressions,clicks,spend,actions,ctr,cpc",
            time_range: '{"since":"2026-01-01","until":"2026-07-30"}',
          },
          config
        );
        return {
          content: [{ type: "text", text: JSON.stringify(metrics.data) }],
        };
      }

      case "meta-ads-pause-campaign": {
        await metaApiRequest(
          `/${(args as any).campaignId}`,
          { status: "PAUSED" },
          config,
          "POST"
        );
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, paused: (args as any).campaignId }) }],
        };
      }

      case "meta-ads-activate-campaign": {
        await metaApiRequest(
          `/${(args as any).campaignId}`,
          { status: "ACTIVE" },
          config,
          "POST"
        );
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, activated: (args as any).campaignId }) }],
        };
      }

      case "meta-ads-update-budget": {
        await metaApiRequest(
          `/${(args as any).campaignId}`,
          { daily_budget: ((args as any).budget * 100).toString() },
          config,
          "POST"
        );
        return {
          content: [{ type: "text", text: JSON.stringify({ success: true, updated: (args as any).campaignId, newBudget: (args as any).budget }) }],
        };
      }

      case "meta-ads-create-campaign": {
        const campaignResponse = await metaApiRequest(
          `/${accountId}/campaigns`,
          {
            name: (args as any).name,
            status: "PAUSED",
            objective: (args as any).objective || "OUTCOME_TRAFFIC",
            daily_budget: ((args as any).budget * 100).toString(),
            special_ad_categories: "[]",
          },
          config
        );
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              campaignId: campaignResponse.id,
              name: (args as any).name,
              objective: (args as any).objective,
              status: "PAUSED",
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
  console.error("Meta Ads MCP server running on stdio");
}

main().catch(console.error);
