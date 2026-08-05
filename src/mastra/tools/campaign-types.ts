// Campaign Types Tools - Wired to Meta Ads SDK
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getAdAccount, Campaign as CampaignClass } from "../mcp/meta-ads/src/sdk";

const META_OBJECTIVES: Record<string, string> = {
  "AWARENESS": "OUTCOME_AWARENESS",
  "CONSIDERATION": "OUTCOME_ENGAGEMENT",
  "CONVERSIONS": "OUTCOME_SALES",
  "APP_INSTALLS": "OUTCOME_APP_PROMOTION",
  "APP_ENGAGEMENT": "OUTCOME_ENGAGEMENT",
  "APP_RETARGETING": "OUTCOME_SALES",
  "LEADS": "OUTCOME_LEADS",
};

function serializeSdkObject(obj: any) {
  if (obj && obj._data) return obj._data;
  return obj;
}

// Video Ads Campaigns
export const create_video_campaign = createTool({
  id: "ads-create-video-campaign",
  description: "Create a video ad campaign (YouTube, TikTok, Reels, etc.)",
  inputSchema: z.object({
    platform: z.enum(["google", "meta", "tiktok", "youtube"]),
    accountId: z.string(),
    name: z.string(),
    videoUrl: z.string(),
    duration: z.enum(["6s", "15s", "30s", "60s"]),
    objective: z.enum(["AWARENESS", "CONSIDERATION", "CONVERSIONS"]),
    budget: z.number(),
    targetAudience: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, accountId, name, videoUrl, duration, objective, budget, targetAudience } = inputData;

    if (platform === "meta") {
      try {
        const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);
        const metaObjective = META_OBJECTIVES[objective] || "OUTCOME_TRAFFIC";

        const campaign = await account.createCampaign([], {
          name,
          objective: metaObjective,
          status: "PAUSED",
          daily_budget: (budget * 100).toString(),
          special_ad_categories: [],
        });

        return {
          success: true,
          data: {
            ...serializeSdkObject(campaign),
            videoUrl,
            duration,
            platform: "meta",
          },
        };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    // Mock for other platforms
    return {
      success: true,
      data: {
        id: `mock-${Date.now()}`,
        name,
        platform,
        videoUrl,
        duration,
        objective,
        budget,
        status: "PAUSED",
        mockMode: true,
      },
    };
  },
});

export const get_video_performance = createTool({
  id: "ads-get-video-performance",
  description: "Get video ad performance metrics (views, watch time, completion rate)",
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
          fields: ["impressions", "clicks", "spend", "video_30_sec_watched_actions", "video_p25_watched_actions"],
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
        views: 12500,
        watchTime: "45s",
        completionRate: "32%",
        mockMode: true,
      },
    };
  },
});

// App Install Campaigns
export const create_app_install_campaign = createTool({
  id: "ads-create-app-install-campaign",
  description: "Create an app install campaign",
  inputSchema: z.object({
    platform: z.enum(["google", "meta", "tiktok", "snap"]),
    accountId: z.string(),
    name: z.string(),
    appStoreUrl: z.string(),
    appIcon: z.string().optional(),
    objective: z.enum(["APP_INSTALLS", "APP_ENGAGEMENT", "APP_RETARGETING"]),
    budget: z.number(),
    targetDevices: z.enum(["ios", "android", "both"]).optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, accountId, name, appStoreUrl, objective, budget } = inputData;

    if (platform === "meta") {
      try {
        const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);
        const metaObjective = META_OBJECTIVES[objective] || "OUTCOME_APP_PROMOTION";

        const campaign = await account.createCampaign([], {
          name,
          objective: metaObjective,
          status: "PAUSED",
          daily_budget: (budget * 100).toString(),
          special_ad_categories: [],
        });

        return {
          success: true,
          data: {
            ...serializeSdkObject(campaign),
            appStoreUrl,
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
        id: `mock-${Date.now()}`,
        name,
        platform,
        appStoreUrl,
        objective,
        budget,
        status: "PAUSED",
        mockMode: true,
      },
    };
  },
});

export const get_app_install_metrics = createTool({
  id: "ads-get-app-install-metrics",
  description: "Get app install campaign metrics (installs, CPI, engagement)",
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
          fields: ["impressions", "clicks", "spend", "actions", "cost_per_action_type"],
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
        installs: 450,
        cpi: 2.50,
        engagement: "18%",
        mockMode: true,
      },
    };
  },
});

// Lead Generation Campaigns
export const create_lead_gen_campaign = createTool({
  id: "ads-create-lead-gen-campaign",
  description: "Create a lead generation campaign with form",
  inputSchema: z.object({
    platform: z.enum(["google", "meta", "linkedin"]),
    accountId: z.string(),
    name: z.string(),
    formFields: z.array(z.string()),
    thankYouUrl: z.string().optional(),
    headline: z.string(),
    description: z.string().optional(),
    budget: z.number(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, accountId, name, formFields, headline, budget } = inputData;

    if (platform === "meta") {
      try {
        const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);

        const campaign = await account.createCampaign([], {
          name,
          objective: "OUTCOME_LEADS",
          status: "PAUSED",
          daily_budget: (budget * 100).toString(),
          special_ad_categories: [],
        });

        return {
          success: true,
          data: {
            ...serializeSdkObject(campaign),
            formFields,
            headline,
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
        id: `mock-${Date.now()}`,
        name,
        platform,
        formFields,
        headline,
        budget,
        status: "PAUSED",
        mockMode: true,
      },
    };
  },
});

export const get_lead_gen_metrics = createTool({
  id: "ads-get-lead-gen-metrics",
  description: "Get lead generation metrics (leads, CPL, conversion rate)",
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
          fields: ["impressions", "clicks", "spend", "actions", "cost_per_action_type"],
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
        leads: 125,
        cpl: 8.50,
        conversionRate: "3.2%",
        mockMode: true,
      },
    };
  },
});
