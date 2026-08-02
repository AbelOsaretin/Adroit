export const get_campaigns = {
  name: "meta-ads-get-campaigns",
  description: "Fetch all campaigns from Meta Ads account",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID (act_XXXXXXXXX)" },
    },
    required: ["accountId"],
  },
};

export const get_campaign_metrics = {
  name: "meta-ads-get-campaign-metrics",
  description: "Get performance metrics for a specific campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID" },
      dateRange: { type: "string", description: "Date range (e.g., 'last_30_days')" },
    },
    required: ["accountId", "campaignId"],
  },
};

export const pause_campaign = {
  name: "meta-ads-pause-campaign",
  description: "Pause a Meta Ads campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID to pause" },
    },
    required: ["accountId", "campaignId"],
  },
};

export const activate_campaign = {
  name: "meta-ads-activate-campaign",
  description: "Activate (unpause) a Meta Ads campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID to activate" },
    },
    required: ["accountId", "campaignId"],
  },
};

export const update_budget = {
  name: "meta-ads-update-budget",
  description: "Update campaign daily budget",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID" },
      budget: { type: "number", description: "New daily budget in USD" },
    },
    required: ["accountId", "campaignId", "budget"],
  },
};

export const create_campaign = {
  name: "meta-ads-create-campaign",
  description: "Create a new Meta Ads campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      name: { type: "string", description: "Campaign name" },
      objective: { type: "string", enum: ["CONVERSIONS", "REACH", "TRAFFIC", "ENGAGEMENT"], description: "Campaign objective" },
      budget: { type: "number", description: "Daily budget in USD" },
    },
    required: ["accountId", "name", "objective", "budget"],
  },
};
