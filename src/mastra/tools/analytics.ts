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
    campaigns: z.array(z.any()).optional().describe("Array of campaign data from Google/Meta Ads"),
    currentPeriod: z.any().optional().describe("Current period metrics for comparison"),
    previousPeriod: z.any().optional().describe("Previous period metrics for comparison"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { action, campaigns, currentPeriod, previousPeriod } = inputData || {};

    if (!action) {
      return { success: false, error: "action is required" };
    }

    if (action !== "compare-periods" && (!campaigns || !Array.isArray(campaigns))) {
      return { success: false, error: "campaigns array is required" };
    }

    const campaignsArray = campaigns as any[];

    switch (action) {
      case "aggregate-metrics": {
        const totals = campaignsArray.reduce(
          (acc, campaign) => ({
            spend: acc.spend + (campaign.metrics?.spend || campaign.cost || 0),
            impressions: acc.impressions + (campaign.metrics?.impressions || 0),
            clicks: acc.clicks + (campaign.metrics?.clicks || 0),
            conversions: acc.conversions + (campaign.metrics?.conversions || 0),
          }),
          { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
        );

        return {
          success: true,
          data: {
            totals,
            ctr: totals.clicks / totals.impressions || 0,
            cpc: totals.spend / totals.clicks || 0,
            conversionRate: totals.conversions / totals.clicks || 0,
          },
        };
      }

      case "detect-anomalies": {
        const anomalies = campaignsArray
          .filter((campaign: any) => {
            const ctr = campaign.metrics?.ctr || 0;
            const cpc = campaign.metrics?.cpc || campaign.metrics?.averageCpc || 0;
            return ctr < 0.01 || cpc > 5;
          })
          .map((campaign: any) => ({
            campaignId: campaign.id || campaign.campaignId,
            campaignName: campaign.name || campaign.campaignName,
            issue: (campaign.metrics?.ctr || 0) < 0.01 ? "Low CTR" : "High CPC",
            severity: "medium",
            metrics: campaign.metrics,
          }));

        return { success: true, data: { anomalies, count: anomalies.length } };
      }

      case "calculate-roas": {
        const totalRevenue = campaignsArray.reduce(
          (sum: number, c: any) => sum + (c.metrics?.conversionsValue || (c.metrics?.conversions || 0) * 50),
          0
        );
        const totalSpend = campaignsArray.reduce(
          (sum: number, c: any) => sum + (c.metrics?.spend || c.cost || 0),
          0
        );

        return {
          success: true,
          data: {
            roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
            totalRevenue,
            totalSpend,
          },
        };
      }

      case "compare-periods": {
        if (!currentPeriod || !previousPeriod) {
          return { success: false, error: "Both currentPeriod and previousPeriod are required" };
        }

        const changes = {
          spendChange: previousPeriod.spend > 0
            ? ((currentPeriod.spend - previousPeriod.spend) / previousPeriod.spend) * 100
            : 0,
          impressionsChange: previousPeriod.impressions > 0
            ? ((currentPeriod.impressions - previousPeriod.impressions) / previousPeriod.impressions) * 100
            : 0,
          clicksChange: previousPeriod.clicks > 0
            ? ((currentPeriod.clicks - previousPeriod.clicks) / previousPeriod.clicks) * 100
            : 0,
          conversionsChange: previousPeriod.conversions > 0
            ? ((currentPeriod.conversions - previousPeriod.conversions) / previousPeriod.conversions) * 100
            : 0,
        };

        return { success: true, data: changes };
      }

      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  },
});
