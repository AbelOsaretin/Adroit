export const getCampaignsTool = {
  name: "google-ads-get-campaigns",
  description: "Fetch all campaigns from Google Ads account",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID (XXXXXXXXXX)" },
    },
    required: ["accountId"],
  },
};

export const getCampaignMetricsTool = {
  name: "google-ads-get-campaign-metrics",
  description: "Get performance metrics for a specific campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      campaignId: { type: "string", description: "Campaign ID" },
      dateRange: { type: "string", description: "Date range (e.g., 'LAST_30_DAYS')" },
    },
    required: ["accountId", "campaignId"],
  },
};

export const pauseCampaignTool = {
  name: "google-ads-pause-campaign",
  description: "Pause a Google Ads campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      campaignId: { type: "string", description: "Campaign ID to pause" },
    },
    required: ["accountId", "campaignId"],
  },
};

export const updateBudgetTool = {
  name: "google-ads-update-budget",
  description: "Update campaign budget",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      campaignId: { type: "string", description: "Campaign ID" },
      budget: { type: "number", description: "New daily budget in USD" },
    },
    required: ["accountId", "campaignId", "budget"],
  },
};

export const createCampaignTool = {
  name: "google-ads-create-campaign",
  description: "Create a new Google Ads campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      name: { type: "string", description: "Campaign name" },
      budget: { type: "number", description: "Daily budget in USD" },
      type: { type: "string", enum: ["SEARCH", "DISPLAY", "SHOPPING"], description: "Campaign type" },
    },
    required: ["accountId", "name", "budget"],
  },
};
