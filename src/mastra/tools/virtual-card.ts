// Virtual Cards Tool
// Mastra tool for managing virtual cards for ad spend

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const cardTool = createTool({
  id: "virtual-card",
  description: "Manage virtual cards for ad spend - create, fund, view details, lock/unlock cards",
  inputSchema: z.object({
    action: z.enum([
      "create-card",
      "fund-card",
      "get-card-details",
      "list-cards",
      "lock-card",
      "link-to-platform",
    ]),
    userId: z.string().optional().describe("User ID"),
    cardId: z.string().optional().describe("Card ID"),
    amount: z.number().optional().describe("Amount to fund card (USD)"),
    platform: z.string().optional().describe("Ad platform to link card to (Meta, Google, TikTok)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { action, userId, cardId, amount, platform } = inputData;

    try {
      // Map tool actions to API actions
      const actionMap: Record<string, string> = {
        'create-card': 'create',
        'fund-card': 'fund',
        'get-card-details': 'get-details',
        'list-cards': 'list',
        'lock-card': 'lock',
        'link-to-platform': 'link-platform',
      };

      const apiAction = actionMap[action] || action;

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: apiAction,
          userId: userId || 'default-user',
          cardId,
          amount,
          cardDetails: { platform },
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
