import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const crossPlatformTool = createTool({
  id: "cross-platform",
  description: "Compare performance across Google Ads and Meta Ads",
  inputSchema: z.object({
    action: z.enum([
      "compare-roas",
      "compare-cpc",
      "compare-ctr",
      "recommend-allocation",
    ]),
    googleData: z.any().optional().describe("Google Ads metrics"),
    metaData: z.any().optional().describe("Meta Ads metrics"),
    totalBudget: z.number().optional().describe("Total budget to allocate"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { action, googleData, metaData, totalBudget } = inputData;

    switch (action) {
      case "compare-roas": {
        const googleRoas = googleData?.roas || 0;
        const metaRoas = metaData?.roas || 0;
        const winner = googleRoas > metaRoas ? "google" : "meta";
        const difference = Math.abs(googleRoas - metaRoas);

        return {
          success: true,
          data: {
            googleRoas,
            metaRoas,
            winner,
            difference,
            recommendation: winner === "google"
              ? `Google Ads has ${difference.toFixed(2)}x better ROAS`
              : `Meta Ads has ${difference.toFixed(2)}x better ROAS`,
          },
        };
      }

      case "recommend-allocation": {
        const googleRoas = googleData?.roas || 1;
        const metaRoas = metaData?.roas || 1;
        const totalRoas = googleRoas + metaRoas;
        const googleShare = (googleRoas / totalRoas) * 100;
        const metaShare = (metaRoas / totalRoas) * 100;

        return {
          success: true,
          data: {
            googleAllocation: totalBudget ? totalBudget * (googleShare / 100) : googleShare,
            metaAllocation: totalBudget ? totalBudget * (metaShare / 100) : metaShare,
            googlePercentage: googleShare,
            metaPercentage: metaShare,
            reasoning: `Allocate ${googleShare.toFixed(0)}% to Google, ${metaShare.toFixed(0)}% to Meta based on ROAS`,
          },
        };
      }

      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  },
});
