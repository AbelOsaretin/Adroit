import { getAdAccount, AdSet } from '../sdk';

export const getAdSetsTool = {
  name: 'meta-ads-get-adsets',
  description: 'Get all ad sets from a Meta Ads account',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      status: { type: 'string', description: 'Filter by status: ACTIVE, PAUSED, DELETED, ALL', default: 'ALL' },
      limit: { type: 'number', description: 'Max ad sets to return', default: 25 },
    },
    required: ['accountId'],
  },
};

export const createAdSetTool = {
  name: 'meta-ads-create-adset',
  description: 'Create a new ad set with targeting options',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignId: { type: 'string', description: 'Parent campaign ID' },
      name: { type: 'string', description: 'Ad set name' },
      dailyBudget: { type: 'number', description: 'Daily budget in cents' },
      bidStrategy: { type: 'string', description: 'Bid strategy: LOWEST_COST_WITHOUT_CAP, LOWEST_COST_WITH_BID_CAP, COST_CAP', default: 'LOWEST_COST_WITHOUT_CAP' },
      targeting: { type: 'object', description: 'Targeting specification (age_min, age_max, geo_locations, interests, etc.)' },
      status: { type: 'string', description: 'Status: PAUSED or ACTIVE', default: 'PAUSED' },
    },
    required: ['accountId', 'campaignId', 'name', 'dailyBudget'],
  },
};

export const pauseAdSetTool = {
  name: 'meta-ads-pause-adset',
  description: 'Pause an ad set',
  inputSchema: {
    type: 'object' as const,
    properties: {
      adSetId: { type: 'string', description: 'Ad Set ID to pause' },
    },
    required: ['adSetId'],
  },
};

export const activateAdSetTool = {
  name: 'meta-ads-activate-adset',
  description: 'Activate an ad set',
  inputSchema: {
    type: 'object' as const,
    properties: {
      adSetId: { type: 'string', description: 'Ad Set ID to activate' },
    },
    required: ['adSetId'],
  },
};

export const updateAdSetBudgetTool = {
  name: 'meta-ads-update-adset-budget',
  description: 'Update ad set daily budget',
  inputSchema: {
    type: 'object' as const,
    properties: {
      adSetId: { type: 'string', description: 'Ad Set ID' },
      dailyBudget: { type: 'number', description: 'New daily budget in cents' },
    },
    required: ['adSetId', 'dailyBudget'],
  },
};

export const getAdSetInsightsTool = {
  name: 'meta-ads-get-adset-insights',
  description: 'Get performance insights for an ad set',
  inputSchema: {
    type: 'object' as const,
    properties: {
      adSetId: { type: 'string', description: 'Ad Set ID' },
      datePreset: { type: 'string', description: 'Date range preset', default: 'last_30d' },
    },
    required: ['adSetId'],
  },
};

export const getAdSetAdsTool = {
  name: 'meta-ads-get-adset-ads',
  description: 'Get all ads in an ad set',
  inputSchema: {
    type: 'object' as const,
    properties: {
      adSetId: { type: 'string', description: 'Ad Set ID' },
    },
    required: ['adSetId'],
  },
};

// Execute functions
export async function executeGetAdSets(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const fields = ['name', 'status', 'effective_status', 'daily_budget', 'bid_strategy', 'campaign_id', 'targeting'];
  const params: any = { limit: args.limit || 25 };
  if (args.status && args.status !== 'ALL') {
    params.effective_status = args.status;
  }
  const adSets = await account.getAdSets(fields, params);
  return adSets.map((a: any) => a.exportAll());
}

export async function executeCreateAdSet(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    campaign_id: args.campaignId,
    name: args.name,
    daily_budget: args.dailyBudget.toString(),
    bid_strategy: args.bidStrategy || 'LOWEST_COST_WITHOUT_CAP',
    status: args.status || 'PAUSED',
    targeting: args.targeting || { geo_locations: { countries: ['US'] } },
  };
  const adSet = await account.createAdSet([], params);
  return adSet.exportAll();
}

export async function executePauseAdSet(args: any, accessToken: string) {
  const adSet = new AdSet(args.adSetId);
  await adSet.update({ status: 'PAUSED' });
  return { success: true, adSetId: args.adSetId, status: 'PAUSED' };
}

export async function executeActivateAdSet(args: any, accessToken: string) {
  const adSet = new AdSet(args.adSetId);
  await adSet.update({ status: 'ACTIVE' });
  return { success: true, adSetId: args.adSetId, status: 'ACTIVE' };
}

export async function executeUpdateAdSetBudget(args: any, accessToken: string) {
  const adSet = new AdSet(args.adSetId);
  await adSet.update({ daily_budget: args.dailyBudget.toString() });
  return { success: true, adSetId: args.adSetId, dailyBudget: args.dailyBudget };
}

export async function executeGetAdSetInsights(args: any, accessToken: string) {
  const adSet = new AdSet(args.adSetId);
  const insights = await adSet.getInsights({
    date_preset: args.datePreset || 'last_30d',
    fields: ['impressions', 'clicks', 'spend', 'actions', 'ctr', 'cpc', 'reach', 'frequency', 'cost_per_action_type'],
  });
  return insights.map((i: any) => i.exportAll());
}

export async function executeGetAdSetAds(args: any, accessToken: string) {
  const adSet = new AdSet(args.adSetId);
  const ads = await adSet.getAds(['name', 'status', 'effective_status', 'creative']);
  return ads.map((a: any) => a.exportAll());
}
