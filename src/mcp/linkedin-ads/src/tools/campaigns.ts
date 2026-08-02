export const mockCampaigns = [
  {
    id: "li_campaign_001",
    name: "B2B Lead Gen Campaign",
    status: "ACTIVE",
    type: "SPONSORED_CONTENT",
    budget: 500,
    impressions: 12500,
    clicks: 450,
    leads: 23,
    cpc: 1.11,
    ctr: 0.036,
  },
  {
    id: "li_campaign_002",
    name: "Thought Leadership Ads",
    status: "PAUSED",
    type: "SPONSORED_INBOX",
    budget: 300,
    impressions: 8200,
    clicks: 310,
    leads: 12,
    cpc: 0.97,
    ctr: 0.038,
  },
];

export const get_campaigns = {
  name: "linkedin-ads-get-campaigns",
  description: "Fetch all campaigns from LinkedIn Ads account",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "LinkedIn Ad Account ID" },
    },
    required: ["accountId"],
  },
};

export const get_campaign_metrics = {
  name: "linkedin-ads-get-campaign-metrics",
  description: "Get performance metrics for a LinkedIn campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "LinkedIn Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID" },
    },
    required: ["accountId", "campaignId"],
  },
};

export const pause_campaign = {
  name: "linkedin-ads-pause-campaign",
  description: "Pause a LinkedIn Ads campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "LinkedIn Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID to pause" },
    },
    required: ["accountId", "campaignId"],
  },
};

export const activate_campaign = {
  name: "linkedin-ads-activate-campaign",
  description: "Activate a LinkedIn Ads campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "LinkedIn Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID to activate" },
    },
    required: ["accountId", "campaignId"],
  },
};

export const create_campaign = {
  name: "linkedin-ads-create-campaign",
  description: "Create a new LinkedIn Ads campaign",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "LinkedIn Ad Account ID" },
      name: { type: "string", description: "Campaign name" },
      type: { type: "string", enum: ["SPONSORED_CONTENT", "SPONSORED_INBOX", "SPONSORED_MESSAGING"], description: "Campaign type" },
      budget: { type: "number", description: "Daily budget in USD" },
    },
    required: ["accountId", "name", "type", "budget"],
  },
};
