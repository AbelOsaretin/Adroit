import { createTool } from "@mastra/core/tools";
import { z } from "zod";

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
    name: z.string().optional().describe("Campaign name for create-campaign"),
    type: z.enum(["SEARCH", "DISPLAY", "SHOPPING"]).optional().describe("Campaign type for create-campaign"),
    accountId: z.string().describe("Google Ads customer ID (XXXXXXXXXX)"),
    campaignId: z.string().optional().describe("Campaign ID for specific operations"),
    budget: z.number().optional().describe("New budget amount in USD"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { action, accountId, campaignId, budget, name, type } = inputData;

    switch (action) {
      case "get-campaigns":
        return {
          success: true,
          data: { campaigns: mockCampaigns },
        };

      case "get-metrics":
        return {
          success: true,
          data: {
            metrics: [
              {
                campaignId: campaignId || "12345678",
                campaignName: "Summer Sale Campaign",
                impressions: 45230,
                clicks: 1823,
                cost: 245.67,
                conversions: 89,
                averageCpc: 0.13,
                ctr: 0.0403,
                conversionsValue: 4450.0,
              },
            ],
          },
        };

      case "pause-campaign":
        return {
          success: true,
          data: {
            paused: campaignId,
            resourceName: `customers/${accountId}/campaigns/${campaignId}`,
          },
        };

      case "update-budget":
        return {
          success: true,
          data: {
            updated: campaignId,
            newBudget: budget,
          },
        };

      case "create-campaign":
        const newCampaignId = Math.floor(Math.random() * 90000000) + 10000000;
        return {
          success: true,
          data: {
            campaignId: newCampaignId.toString(),
            name: name || "New Campaign",
            type: type || "SEARCH",
            budget: budget || 100,
            status: "ENABLED",
            resourceName: `customers/${accountId}/campaigns/${newCampaignId}`,
          },
        };

      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  },
});
