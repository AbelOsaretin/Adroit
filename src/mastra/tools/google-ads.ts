import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const isMockMode = !process.env.GOOGLE_ADS_REFRESH_TOKEN;

const mockCampaigns = [
  {
    id: "12345678",
    name: "Summer Sale Campaign",
    status: "ENABLED",
    type: "SEARCH",
    budget: 500,
  },
  {
    id: "12345679",
    name: "Brand Awareness",
    status: "ENABLED",
    type: "DISPLAY",
    budget: 1000,
  },
  {
    id: "12345680",
    name: "Retargeting Campaign",
    status: "PAUSED",
    type: "SEARCH",
    budget: 300,
  },
];

const mockMetrics = {
  "12345678": {
    campaignId: "12345678",
    campaignName: "Summer Sale Campaign",
    impressions: 45230,
    clicks: 1823,
    cost: 245.67,
    conversions: 89,
    averageCpc: 0.13,
    ctr: 0.0403,
    conversionsValue: 4450.0,
  },
  "12345679": {
    campaignId: "12345679",
    campaignName: "Brand Awareness",
    impressions: 128450,
    clicks: 3210,
    cost: 892.34,
    conversions: 45,
    averageCpc: 0.28,
    ctr: 0.025,
    conversionsValue: 2250.0,
  },
};

async function getRealClient() {
  const { GoogleAdsApi } = await import("google-ads-api");

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  return client;
}

export const googleAdsTool = createTool({
  id: "google-ads",
  description: isMockMode
    ? "Interact with Google Ads API (MOCK MODE - no credentials)"
    : "Interact with Google Ads API to manage campaigns",
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
    mockMode: z.boolean().optional(),
  }),
  execute: async (inputData) => {
    const { action, accountId, campaignId, budget } = inputData;

    if (isMockMode) {
      return handleMockAction(action, campaignId, budget);
    }

    try {
      const customerId = accountId.replace(/-/g, "");
      const client = await getRealClient();

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
              metrics.ctr,
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
            return { success: false, error: "campaignId and budget are required" };
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

function handleMockAction(action: string, campaignId?: string, budget?: number) {
  switch (action) {
    case "get-campaigns":
      return {
        success: true,
        data: { campaigns: mockCampaigns },
        mockMode: true,
      };

    case "get-metrics": {
      if (!campaignId) {
        return { success: false, error: "campaignId is required", mockMode: true };
      }

      const metrics = mockMetrics[campaignId as keyof typeof mockMetrics];
      if (!metrics) {
        return {
          success: true,
          data: {
            metrics: [
              {
                campaignId,
                campaignName: `Campaign ${campaignId}`,
                impressions: Math.floor(Math.random() * 50000),
                clicks: Math.floor(Math.random() * 2000),
                cost: Math.round(Math.random() * 500 * 100) / 100,
                conversions: Math.floor(Math.random() * 100),
                averageCpc: Math.round(Math.random() * 0.5 * 100) / 100,
                ctr: Math.round(Math.random() * 0.1 * 10000) / 10000,
                conversionsValue: Math.floor(Math.random() * 5000),
              },
            ],
          },
          mockMode: true,
        };
      }

      return {
        success: true,
        data: { metrics: [metrics] },
        mockMode: true,
      };
    }

    case "pause-campaign":
      return {
        success: true,
        data: {
          paused: campaignId,
          resourceName: `customers/1234567890/campaigns/${campaignId}`,
        },
        mockMode: true,
      };

    case "update-budget":
      return {
        success: true,
        data: {
          updated: campaignId,
          newBudget: budget,
          budgetResourceName: `customers/1234567890/campaignBudgets/${Date.now()}`,
        },
        mockMode: true,
      };

    default:
      return { success: false, error: `Unknown action: ${action}`, mockMode: true };
  }
}
