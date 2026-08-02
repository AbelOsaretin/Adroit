export const mockCampaigns = [
  { id: "ms_campaign_001", name: "Bing Search Campaign", status: "ACTIVE", type: "SEARCH", budget: 150, impressions: 8900, clicks: 320, cpc: 0.47, ctr: 0.036 },
  { id: "ms_campaign_002", name: "Microsoft Shopping Ads", status: "PAUSED", type: "SHOPPING", budget: 250, impressions: 15200, clicks: 890, cpc: 0.28, ctr: 0.059 },
];

export const get_campaigns = { name: "microsoft-ads-get-campaigns", description: "Fetch Microsoft Ads campaigns", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" } }, required: ["accountId"] } };
export const get_campaign_metrics = { name: "microsoft-ads-get-campaign-metrics", description: "Get Microsoft Ads metrics", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const pause_campaign = { name: "microsoft-ads-pause-campaign", description: "Pause Microsoft Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const activate_campaign = { name: "microsoft-ads-activate-campaign", description: "Activate Microsoft Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const create_campaign = { name: "microsoft-ads-create-campaign", description: "Create Microsoft Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, name: { type: "string" }, type: { type: "string", enum: ["SEARCH", "SHOPPING", "DISPLAY"] }, budget: { type: "number" } }, required: ["accountId", "name", "type", "budget"] } };
