export const mockCampaigns = [
  { id: "pin_campaign_001", name: "Summer Fashion Pins", status: "ACTIVE", type: "STANDARD_PIN", budget: 100, impressions: 18000, clicks: 920, cpc: 0.11, ctr: 0.051 },
  { id: "pin_campaign_002", name: "Holiday Gift Guide", status: "PAUSED", type: "SHOPPING_PIN", budget: 200, impressions: 32000, clicks: 1800, cpc: 0.11, ctr: 0.056 },
];

export const get_campaigns = { name: "pinterest-ads-get-campaigns", description: "Fetch Pinterest Ads campaigns", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" } }, required: ["accountId"] } };
export const get_campaign_metrics = { name: "pinterest-ads-get-campaign-metrics", description: "Get Pinterest Ads metrics", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const pause_campaign = { name: "pinterest-ads-pause-campaign", description: "Pause Pinterest campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const activate_campaign = { name: "pinterest-ads-activate-campaign", description: "Activate Pinterest campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const create_campaign = { name: "pinterest-ads-create-campaign", description: "Create Pinterest campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, name: { type: "string" }, type: { type: "string", enum: ["STANDARD_PIN", "SHOPPING_PIN", "CAROUSEL_PIN"] }, budget: { type: "number" } }, required: ["accountId", "name", "type", "budget"] } };
