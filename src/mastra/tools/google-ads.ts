import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { GoogleAdsApi } from "google-ads-api";

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

export const googleAdsTool = createTool({
  id: "google-ads",
  description: "Interact with Google Ads API to manage campaigns",
  inputSchema: z.object({
    action: z.enum([
      "get-campaigns",
      "get-metrics",
      "pause-campaign",
      "update-budget",
      "create-campaign",
    ]),
    accountId: z.string().describe("Google Ads customer ID (XXXXXXXXXX)"),
    campaignId: z.string().optional().describe("Campaign ID for specific operations"),
    budget: z.number().optional().describe("New budget amount in USD"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { action, accountId, campaignId, budget } = context;
      const customerId = accountId.replace(/-/g, "");

      const customer = client.Customer({
        customer_id: customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      });

      switch (action) {
        case "get-campaigns": {
          const query = `
            SELECT
              campaign.id,
              campaign.name,
              campaign.status,
              campaign.advertising_channel_type,
              campaign_budget.amount_micros
            FROM campaign
            ORDER BY campaign.id
          `;

          const response = await customer.queryStream(query);
          const campaigns = [];

          for await (const row of response) {
            campaigns.push({
              id: row.campaign?.id?.toString(),
              name: row.campaign?.name,
              status: row.campaign?.status,
              type: row.campaign?.advertisingChannelType,
              budget: row.campaignBudget?.amountMicros
                ? parseInt(row.campaignBudget.amountMicros) / 1_000_000
                : null,
            });
          }

          return { success: true, data: { campaigns } };
        }

        case "get-metrics": {
          if (!campaignId) {
            return { success: false, error: "campaignId is required for get-metrics" };
          }

          const query = `
            SELECT
              campaign.id,
              campaign.name,
              metrics.impressions,
              metrics.clicks,
              metrics.cost_micros,
              metrics.conversions,
              metrics.average_cpc,
              metrics ctr,
              metrics.conversions_value
            FROM campaign
            WHERE campaign.id = ${campaignId}
          `;

          const response = await customer.queryStream(query);
          const metrics = [];

          for await (const row of response) {
            metrics.push({
              campaignId: row.campaign?.id?.toString(),
              campaignName: row.campaign?.name,
              impressions: parseInt(row.metrics?.impressions?.toString() || "0"),
              clicks: parseInt(row.metrics?.clicks?.toString() || "0"),
              cost: row.metrics?.costMicros
                ? parseInt(row.metrics.costMicros) / 1_000_000
                : 0,
              conversions: parseFloat(row.metrics?.conversions?.toString() || "0"),
              averageCpc: row.metrics?.averageCpc
                ? parseInt(row.metrics.averageCpc) / 1_000_000
                : 0,
              ctr: parseFloat(row.metrics?.ctr?.toString() || "0"),
              conversionsValue: row.metrics?.conversionsValue
                ? parseInt(row.metrics.conversionsValue) / 1_000_000
                : 0,
            });
          }

          return { success: true, data: { metrics } };
        }

        case "pause-campaign": {
          if (!campaignId) {
            return { success: false, error: "campaignId is required for pause-campaign" };
          }

          const resourceName = `customers/${customerId}/campaigns/${campaignId}`;

          const operation = {
            update: {
              resourceName,
              status: "PAUSED",
            },
            updateMask: "status",
          };

          const response = await customer.campaigns.mutate([operation]);

          return {
            success: true,
            data: {
              paused: campaignId,
              resourceName: response.results?.[0]?.resourceName,
            },
          };
        }

        case "update-budget": {
          if (!campaignId || !budget) {
            return { success: false, error: "campaignId and budget are required for update-budget" };
          }

          const query = `
            SELECT
              campaign.id,
              campaign.campaign_budget
            FROM campaign
            WHERE campaign.id = ${campaignId}
          `;

          const response = await customer.queryStream(query);
          let budgetResourceName = "";

          for await (const row of response) {
            budgetResourceName = row.campaign?.campaignBudget || "";
          }

          if (!budgetResourceName) {
            return { success: false, error: "Could not find campaign budget" };
          }

          const amountMicros = (budget * 1_000_000).toString();

          const operation = {
            update: {
              resourceName: budgetResourceName,
              amountMicros,
            },
            updateMask: "amount_micros",
          };

          await customer.campaignBudgets.mutate([operation]);

          return {
            success: true,
            data: {
              updated: campaignId,
              newBudget: budget,
              budgetResourceName,
            },
          };
        }

        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
