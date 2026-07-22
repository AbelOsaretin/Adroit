import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const executionSchema = z.object({
  campaignId: z.string(),
  action: z.enum(["pause", "boost", "reallocate"]),
  amount: z.number().optional(),
  platform: z.enum(["google", "meta"]),
});

const executeAction = createStep({
  id: "execute-action",
  inputSchema: executionSchema,
  outputSchema: z.object({
    success: z.boolean(),
    result: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    const { campaignId, action, amount, platform } = inputData;

    console.log(`Executing ${action} on ${platform} campaign ${campaignId}`);

    return {
      success: true,
      result: {
        campaignId,
        action,
        platform,
        timestamp: new Date().toISOString(),
      },
    };
  },
});

export const campaignExecutorWorkflow = createWorkflow({
  id: "campaign-executor",
  inputSchema: executionSchema,
  outputSchema: z.object({
    success: z.boolean(),
    result: z.any().optional(),
    error: z.string().optional(),
  }),
})
  .then(executeAction)
  .commit();
