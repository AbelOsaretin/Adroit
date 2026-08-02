// Video Ads Campaigns
export const create_video_campaign = {
  name: "ads-create-video-campaign",
  description: "Create a video ad campaign (YouTube, TikTok, Reels, etc.)",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", enum: ["google", "meta", "tiktok", "youtube"], description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      name: { type: "string", description: "Campaign name" },
      videoUrl: { type: "string", description: "URL of the video creative" },
      duration: { type: "string", enum: ["6s", "15s", "30s", "60s"], description: "Video duration" },
      objective: { type: "string", enum: ["AWARENESS", "CONSIDERATION", "CONVERSIONS"], description: "Campaign objective" },
      budget: { type: "number", description: "Daily budget in USD" },
      targetAudience: { type: "string", description: "Target audience description" },
    },
    required: ["platform", "accountId", "name", "videoUrl", "duration", "objective", "budget"],
  },
};

export const get_video_performance = {
  name: "ads-get-video-performance",
  description: "Get video ad performance metrics (views, watch time, completion rate)",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Ad platform" },
      campaignId: { type: "string", description: "Campaign ID" },
    },
    required: ["platform", "campaignId"],
  },
};

// App Install Campaigns
export const create_app_install_campaign = {
  name: "ads-create-app-install-campaign",
  description: "Create an app install campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", enum: ["google", "meta", "tiktok", "snap"], description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      name: { type: "string", description: "Campaign name" },
      appStoreUrl: { type: "string", description: "App Store / Play Store URL" },
      appIcon: { type: "string", description: "App icon URL" },
      objective: { type: "string", enum: ["APP_INSTALLS", "APP_ENGAGEMENT", "APP_RETARGETING"], description: "Campaign objective" },
      budget: { type: "number", description: "Daily budget in USD" },
      targetDevices: { type: "string", enum: ["ios", "android", "both"], description: "Target devices" },
    },
    required: ["platform", "accountId", "name", "appStoreUrl", "objective", "budget"],
  },
};

export const get_app_install_metrics = {
  name: "ads-get-app-install-metrics",
  description: "Get app install campaign metrics (installs, CPI, engagement)",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Ad platform" },
      campaignId: { type: "string", description: "Campaign ID" },
    },
    required: ["platform", "campaignId"],
  },
};

// Lead Generation Campaigns
export const create_lead_gen_campaign = {
  name: "ads-create-lead-gen-campaign",
  description: "Create a lead generation campaign with form",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", enum: ["google", "meta", "linkedin"], description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      name: { type: "string", description: "Campaign name" },
      formFields: { type: "array", items: { type: "string" }, description: "Form fields (email, name, phone, etc.)" },
      thankYouUrl: { type: "string", description: "Thank you page URL" },
      headline: { type: "string", description: "Ad headline" },
      description: { type: "string", description: "Ad description" },
      budget: { type: "number", description: "Daily budget in USD" },
    },
    required: ["platform", "accountId", "name", "formFields", "headline", "budget"],
  },
};

export const get_lead_gen_metrics = {
  name: "ads-get-lead-gen-metrics",
  description: "Get lead generation metrics (leads, CPL, conversion rate)",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Ad platform" },
      campaignId: { type: "string", description: "Campaign ID" },
    },
    required: ["platform", "campaignId"],
  },
};
