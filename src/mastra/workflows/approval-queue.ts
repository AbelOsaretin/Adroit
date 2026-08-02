import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const recommendationSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  type: z.enum(["pause", "boost", "reallocate", "create"]),
  description: z.string(),
  expectedImpact: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
  amount: z.number().optional(),
  status: z.enum(["pending", "approved", "rejected", "executed"]),
  expiresAt: z.string(),
});

const validateRecommendation = createStep({
  id: "validate-recommendation",
  inputSchema: recommendationSchema,
  outputSchema: recommendationSchema,
  execute: async ({ inputData }) => {
    const recommendation = inputData;

    if (new Date(recommendation.expiresAt) < new Date()) {
      return { ...recommendation, status: "rejected" as const };
    }

    return recommendation;
  },
});

const executeRecommendation = createStep({
  id: "execute-recommendation",
  inputSchema: recommendationSchema,
  outputSchema: z.object({
    success: z.boolean(),
    txHash: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    const recommendation = inputData;

    console.log(`Executing recommendation: ${recommendation.type} for campaign ${recommendation.campaignId}`);

    return {
      success: true,
      txHash: `0x${Date.now().toString(16)}`,
    };
  },
});

export const approvalQueueWorkflow = createWorkflow({
  id: "approval-queue",
  inputSchema: recommendationSchema,
  outputSchema: z.object({
    success: z.boolean(),
    txHash: z.string().optional(),
    error: z.string().optional(),
  }),
})
  .then(validateRecommendation)
  .then(executeRecommendation)
  .commit();
