// Retargeting & Remarketing Tools

export const create_retargeting_audience = {
  name: "ads-create-retargeting-audience",
  description: "Create a retargeting audience from website visitors or app users",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", enum: ["google", "meta", "tiktok", "snap", "linkedin"], description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      name: { type: "string", description: "Audience name" },
      type: { type: "string", enum: ["website_visitors", "app_users", "customer_list", "engagement"], description: "Audience type" },
      pixelId: { type: "string", description: "Tracking pixel ID" },
      retentionDays: { type: "number", description: "Days to retain users in audience (30, 60, 90, 180, 365)" },
      rules: { type: "array", items: { type: "string" }, description: "URL rules (e.g., '/product/*', '/cart/*')" },
    },
    required: ["platform", "accountId", "name", "type", "retentionDays"],
  },
};

export const create_retargeting_campaign = {
  name: "ads-create-retargeting-campaign",
  description: "Create a retargeting campaign for specific audiences",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", enum: ["google", "meta", "tiktok", "snap", "linkedin"], description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      audienceId: { type: "string", description: "Retargeting audience ID" },
      name: { type: "string", description: "Campaign name" },
      strategy: { type: "string", enum: ["abandoned_cart", "product_view", "past_purchasers", "custom"], description: "Retargeting strategy" },
      budget: { type: "number", description: "Daily budget in USD" },
      offer: { type: "string", description: "Special offer or discount" },
    },
    required: ["platform", "accountId", "audienceId", "name", "strategy", "budget"],
  },
};

export const get_retargeting_performance = {
  name: "ads-get-retargeting-performance",
  description: "Get retargeting campaign performance (reach, frequency, conversion lift)",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Ad platform" },
      campaignId: { type: "string", description: "Campaign ID" },
    },
    required: ["platform", "campaignId"],
  },
};

// Remarketing (email-based)
export const create_remarketing_audience = {
  name: "ads-create-remarketing-audience",
  description: "Create a remarketing audience from email lists",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", enum: ["google", "meta"], description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      name: { type: "string", description: "Audience name" },
      emailListUrl: { type: "string", description: "URL to CSV with email addresses" },
      matchType: { type: "string", enum: ["exact", "broad"], description: "Email match type" },
    },
    required: ["platform", "accountId", "name", "emailListUrl"],
  },
};

export const create_drip_campaign = {
  name: "ads-create-drip-remarketing",
  description: "Create a drip remarketing sequence for past visitors",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", enum: ["google", "meta"], description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      name: { type: "string", description: "Campaign name" },
      sequence: { type: "array", items: { type: "object" }, description: "Sequence of ads with delays" },
      budget: { type: "number", description: "Total budget in USD" },
    },
    required: ["platform", "accountId", "name", "sequence", "budget"],
  },
};
