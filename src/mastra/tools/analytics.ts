import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const analyticsTool = createTool({
  id: "analytics",
  description: "Analyze campaign metrics and detect anomalies",
  inputSchema: z.object({
    action: z.enum([
      "aggregate-metrics",
      "detect-anomalies",
      "calculate-roas",
      "compare-periods",
    ]),
    campaigns: z.array(z.any()).describe("Array of campaign data"),
    currentPeriod: z.any().optional().describe("Current period metrics"),
    previousPeriod: z.any().optional().describe("Previous period metrics"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { action, campaigns, currentPeriod, previousPeriod } = context;

      switch (action) {
        case "aggregate-metrics": {
          const totals = campaigns.reduce(
            (acc, campaign) => ({
              spend: acc.spend + (campaign.metrics?.spend || 0),
              impressions: acc.impressions + (campaign.metrics?.impressions || 0),
              clicks: acc.clicks + (campaign.metrics?.clicks || 0),
              conversions: acc.conversions + (campaign.metrics?.conversions || 0),
            }),
            { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
          );

          return {
            success: true,
            data: {
              ...totals,
              ctr: totals.clicks / totals.impressions || 0,
              cpc: totals.spend / totals.clicks || 0,
              conversionRate: totals.conversions / totals.clicks || 0,
            },
          };
        }

        case "detect-anomalies": {
          const anomalies = campaigns
            .filter((campaign) => {
              const ctr = campaign.metrics?.ctr || 0;
              const cpc = campaign.metrics?.cpc || 0;
              return ctr < 0.01 || cpc > 5;
            })
            .map((campaign) => ({
              campaignId: campaign.id,
              campaignName: campaign.name,
              issue: campaign.metrics?.ctr < 0.01 ? "Low CTR" : "High CPC",
              severity: "medium",
            }));

          return { success: true, data: { anomalies, count: anomalies.length } };
        }

        case "calculate-roas": {
          const totalRevenue = campaigns.reduce(
            (sum, c) => sum + (c.metrics?.conversions || 0) * 50,
            0
          );
          const totalSpend = campaigns.reduce(
            (sum, c) => sum + (c.metrics?.spend || 0),
            0
          );

          return {
            success: true,
            data: {
              roas: totalRevenue / totalSpend || 0,
              totalRevenue,
              totalSpend,
            },
          };
        }

        case "compare-periods": {
          if (!currentPeriod || !previousPeriod) {
            return { success: false, error: "Both periods required" };
          }

          const changes = {
            spendChange: ((currentPeriod.spend - previousPeriod.spend) / previousPeriod.spend) * 100,
            impressionsChange: ((currentPeriod.impressions - previousPeriod.impressions) / previousPeriod.impressions) * 100,
            clicksChange: ((currentPeriod.clicks - previousPeriod.clicks) / previousPeriod.clicks) * 100,
            conversionsChange: ((currentPeriod.conversions - previousPeriod.conversions) / previousPeriod.conversions) * 100,
          };

          return { success: true, data: changes };
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
