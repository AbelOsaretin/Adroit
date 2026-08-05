// Retargeting & Remarketing Tools - Wired to Meta Ads SDK
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getAdAccount, CustomAudience, Campaign as CampaignClass } from "../mcp/meta-ads/src/sdk";

function serializeSdkObject(obj: any) {
  if (obj && obj._data) return obj._data;
  return obj;
}

// Retargeting Audiences
export const create_retargeting_audience = createTool({
  id: "ads-create-retargeting-audience",
  description: "Create a retargeting audience from website visitors or app users",
  inputSchema: z.object({
    platform: z.enum(["google", "meta", "tiktok", "snap", "linkedin"]),
    accountId: z.string(),
    name: z.string(),
    type: z.enum(["website_visitors", "app_users", "customer_list", "engagement"]),
    pixelId: z.string().optional(),
    retentionDays: z.number(),
    rules: z.array(z.string()).optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, accountId, name, type, pixelId, retentionDays } = inputData;

    if (platform === "meta") {
      try {
        const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);

        const audience = await account.createCustomAudience([], {
          name,
          subtype: "CUSTOM",
          description: `Retargeting audience: ${type}`,
          customer_file_source: "USER_PROVIDED_ONLY",
        });

        return {
          success: true,
          data: {
            ...serializeSdkObject(audience),
            type,
            retentionDays,
            platform: "meta",
          },
        };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      data: {
        id: `mock-audience-${Date.now()}`,
        name,
        platform,
        type,
        retentionDays,
        size: 15000,
        mockMode: true,
      },
    };
  },
});

export const create_retargeting_campaign = createTool({
  id: "ads-create-retargeting-campaign",
  description: "Create a retargeting campaign for specific audiences",
  inputSchema: z.object({
    platform: z.enum(["google", "meta", "tiktok", "snap", "linkedin"]),
    accountId: z.string(),
    audienceId: z.string(),
    name: z.string(),
    strategy: z.enum(["abandoned_cart", "product_view", "past_purchasers", "custom"]),
    budget: z.number(),
    offer: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, accountId, audienceId, name, strategy, budget, offer } = inputData;

    if (platform === "meta") {
      try {
        const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);

        const campaign = await account.createCampaign([], {
          name: `${name} - Retargeting`,
          objective: "OUTCOME_SALES",
          status: "PAUSED",
          daily_budget: (budget * 100).toString(),
          special_ad_categories: [],
        });

        return {
          success: true,
          data: {
            ...serializeSdkObject(campaign),
            audienceId,
            strategy,
            offer,
            platform: "meta",
          },
        };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      data: {
        id: `mock-campaign-${Date.now()}`,
        name,
        platform,
        audienceId,
        strategy,
        budget,
        offer,
        status: "PAUSED",
        mockMode: true,
      },
    };
  },
});

export const get_retargeting_performance = createTool({
  id: "ads-get-retargeting-performance",
  description: "Get retargeting campaign performance (reach, frequency, conversion lift)",
  inputSchema: z.object({
    platform: z.string(),
    campaignId: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, campaignId } = inputData;

    if (platform === "meta") {
      try {
        const campaign = new CampaignClass(campaignId);
        const insights = await campaign.getInsights({
          fields: ["impressions", "reach", "frequency", "clicks", "spend", "actions"],
        });

        return {
          success: true,
          data: serializeSdkObject(insights[0] || {}),
        };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      data: {
        campaignId,
        platform,
        reach: 25000,
        frequency: 2.8,
        conversionLift: "+15%",
        mockMode: true,
      },
    };
  },
});

// Remarketing
export const create_remarketing_audience = createTool({
  id: "ads-create-remarketing-audience",
  description: "Create a remarketing audience from past customers",
  inputSchema: z.object({
    platform: z.enum(["google", "meta", "linkedin"]),
    accountId: z.string(),
    name: z.string(),
    customerList: z.array(z.string()).optional(),
    purchaseWindow: z.number().describe("Days since last purchase"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, accountId, name, purchaseWindow } = inputData;

    if (platform === "meta") {
      try {
        const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);

        const audience = await account.createCustomAudience([], {
          name,
          subtype: "CUSTOM",
          description: `Remarketing audience: ${purchaseWindow} day window`,
          customer_file_source: "USER_PROVIDED_ONLY",
        });

        return {
          success: true,
          data: {
            ...serializeSdkObject(audience),
            purchaseWindow,
            platform: "meta",
          },
        };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      data: {
        id: `mock-remarketing-${Date.now()}`,
        name,
        platform,
        purchaseWindow,
        size: 8500,
        mockMode: true,
      },
    };
  },
});

export const create_drip_campaign = createTool({
  id: "ads-create-drip-campaign",
  description: "Create a drip email sequence for abandoned carts",
  inputSchema: z.object({
    platform: z.enum(["google", "meta", "email"]),
    accountId: z.string(),
    name: z.string(),
    steps: z.number().describe("Number of email steps"),
    interval: z.number().describe("Days between emails"),
    triggerEvent: z.string().describe("Trigger event (e.g., cart_abandoned)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, name, steps, interval, triggerEvent } = inputData;

    // Drip campaigns are typically email-based
    return {
      success: true,
      data: {
        id: `mock-drip-${Date.now()}`,
        name,
        platform,
        steps,
        interval,
        triggerEvent,
        status: "ACTIVE",
        mockMode: true,
      },
    };
  },
});
