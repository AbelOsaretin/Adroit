export const mockCampaigns = [
  { id: "snap_campaign_001", name: "Snapchat Story Ads", status: "ACTIVE", type: "STORY_AD", budget: 150, impressions: 28000, clicks: 1200, cpc: 0.125, ctr: 0.043 },
  { id: "snap_campaign_002", name: "Snap Collection Ad", status: "PAUSED", type: "COLLECTION_AD", budget: 250, impressions: 42000, clicks: 2100, cpc: 0.119, ctr: 0.05 },
];

export const get_campaigns = { name: "snap-ads-get-campaigns", description: "Fetch Snap Ads campaigns", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" } }, required: ["accountId"] } };
export const get_campaign_metrics = { name: "snap-ads-get-campaign-metrics", description: "Get Snap Ads metrics", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const pause_campaign = { name: "snap-ads-pause-campaign", description: "Pause Snap Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const activate_campaign = { name: "snap-ads-activate-campaign", description: "Activate Snap Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, campaignId: { type: "string" } }, required: ["accountId", "campaignId"] } };
export const create_campaign = { name: "snap-ads-create-campaign", description: "Create Snap Ads campaign", inputSchema: { type: "object" as const, properties: { accountId: { type: "string" }, name: { type: "string" }, type: { type: "string", enum: ["STORY_AD", "COLLECTION_AD", "SPOTLIGHT_AD", "AR_LENS"] }, budget: { type: "number" } }, required: ["accountId", "name", "type", "budget"] } };
