export const mockCampaigns = [
  { id: "amz_campaign_001", name: "Sponsored Products", status: "ENABLED", type: "SPONSORED_PRODUCTS", budget: 300, impressions: 22000, clicks: 1800, cpc: 0.17, ctr: 0.082, acos: 0.15 },
  { id: "amz_campaign_002", name: "Sponsored Brands", status: "PAUSED", type: "SPONSORED_BRANDS", budget: 500, impressions: 45000, clicks: 2100, cpc: 0.24, ctr: 0.047, acos: 0.22 },
];

export const get_campaigns = { name: "amazon-ads-get-campaigns", description: "Fetch Amazon Ads campaigns", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" } }, required: ["accountId"] } };
export const get_campaign_metrics = { name: "amazon-ads-get-campaign-metrics", description: "Get Amazon Ads metrics", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const pause_campaign = { name: "amazon-ads-pause-campaign", description: "Pause Amazon Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const activate_campaign = { name: "amazon-ads-activate-campaign", description: "Activate Amazon Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const create_campaign = { name: "amazon-ads-create-campaign", description: "Create Amazon Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, name: { type: "string" }, type: { type: "string", enum: ["SPONSORED_PRODUCTS", "SPONSORED_BRANDS", "SPONSORED_DISPLAY"] }, budget: { type: "number" } }, required: ["accountId", "name", "type", "budget"] } };
