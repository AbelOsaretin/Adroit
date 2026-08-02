export const mockCampaigns = [
  { id: "tt_campaign_001", name: "Viral Dance Challenge", status: "ACTIVE", type: "IN_FEED_VIDEO", budget: 200, impressions: 45000, clicks: 2100, cpc: 0.095, ctr: 0.047 },
  { id: "tt_campaign_002", name: "Brand Takeover Ad", status: "PAUSED", type: "BRAND_TAKEOVER", budget: 500, impressions: 120000, clicks: 8500, cpc: 0.059, ctr: 0.071 },
];

export const get_campaigns = { name: "tiktok-ads-get-campaigns", description: "Fetch TikTok Ads campaigns", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" } }, required: ["accountId"] } };
export const get_campaign_metrics = { name: "tiktok-ads-get-campaign-metrics", description: "Get TikTok campaign metrics", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const pause_campaign = { name: "tiktok-ads-pause-campaign", description: "Pause TikTok campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const activate_campaign = { name: "tiktok-ads-activate-campaign", description: "Activate TikTok campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const create_campaign = { name: "tiktok-ads-create-campaign", description: "Create TikTok campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, name: { type: "string" }, type: { type: "string", enum: ["IN_FEED_VIDEO", "BRAND_TAKEOVER", "TOP_VIEW", "SPARK_ADS"] }, budget: { type: "number" } }, required: ["accountId", "name", "type", "budget"] } };
