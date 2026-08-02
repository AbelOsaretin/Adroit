import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const mockCampaigns = [
  {
    id: "23850123456789012",
    name: "Summer Promotion",
    status: "ACTIVE",
    objective: "CONVERSIONS",
    dailyBudget: 75.0,
  },
  {
    id: "23850123456789013",
    name: "Brand Awareness Q3",
    status: "ACTIVE",
    objective: "REACH",
    dailyBudget: 150.0,
  },
  {
    id: "23850123456789014",
    name: "Retargeting - Website Visitors",
    status: "PAUSED",
    objective: "CONVERSIONS",
    dailyBudget: 50.0,
  },
];

export const metaAdsTool = createTool({
  id: "meta-ads",
  description: "Interact with Meta Marketing API for Facebook/Instagram ads",
  inputSchema: z.object({
    action: z.enum([
      "get-campaigns",
      "get-metrics",
      "pause-campaign",
      "update-budget",
      "create-campaign",
    ]),
    accountId: z.string().describe("Meta Ad Account ID (act_XXXXXXXXX)"),
    campaignId: z.string().optional().describe("Campaign ID for specific operations"),
    budget: z.number().optional().describe("New daily budget in USD"),
    name: z.string().optional().describe("Campaign name for create-campaign"),
    objective: z.enum(["CONVERSIONS", "REACH", "TRAFFIC", "ENGAGEMENT"]).optional().describe("Campaign objective for create-campaign"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { action, accountId, campaignId, budget, name, objective } = inputData;

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
                campaignId: campaignId || "23850123456789012",
                campaignName: "Summer Promotion",
                impressions: 67890,
                clicks: 2345,
                spend: 312.45,
                conversions: 67,
                cpc: 0.13,
                ctr: 0.0345,
                roas: 4.2,
              },
            ],
          },
        };

      case "pause-campaign":
        return {
          success: true,
          data: {
            paused: campaignId,
            success: true,
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
        const newCampaignId = Math.floor(Math.random() * 90000000000000000) + 10000000000000000;
        return {
          success: true,
          data: {
            campaignId: newCampaignId.toString(),
            name: name || "New Campaign",
            objective: objective || "CONVERSIONS",
            status: "ACTIVE",
            dailyBudget: budget || 50,
          },
        };

      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  },
});
