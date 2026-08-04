import { getAdAccount, Campaign as CampaignClass } from '../sdk';

function serializeSdkObject(obj: any) {
  if (obj && obj._data) {
    return obj._data;
  }
  return obj;
}

function serializeSdkArray(arr: any[]) {
  return arr.map(serializeSdkObject);
}

export const getCampaignsTool = {
  name: 'meta-get-campaigns',
  description: 'Get all campaigns from a Meta Ads account',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID (act_XXXXXXXXX)' },
      status: { type: 'string', description: 'Filter by status: ACTIVE, PAUSED, DELETED, ALL', default: 'ALL' },
      limit: { type: 'number', description: 'Max campaigns to return', default: 25 },
    },
    required: ['accountId'],
  },
};

export const getCampaignMetricsTool = {
  name: 'meta-get-campaign-metrics',
  description: 'Get performance metrics for a specific campaign',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignId: { type: 'string', description: 'Campaign ID' },
      datePreset: { type: 'string', description: 'Date range: today, yesterday, last_7d, last_30d, this_month, last_month', default: 'last_30d' },
    },
    required: ['accountId', 'campaignId'],
  },
};

export const createCampaignTool = {
  name: 'meta-create-campaign',
  description: 'Create a new Meta Ads campaign',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      name: { type: 'string', description: 'Campaign name' },
      objective: {
        type: 'string',
        description: 'Campaign objective',
        enum: ['OUTCOME_AWARENESS', 'OUTCOME_ENGAGEMENT', 'OUTCOME_LEADS', 'OUTCOME_SALES', 'OUTCOME_TRAFFIC', 'OUTCOME_APP_PROMOTION'],
      },
      status: { type: 'string', description: 'Campaign status: PAUSED or ACTIVE', default: 'PAUSED' },
      dailyBudget: { type: 'number', description: 'Daily budget in cents (e.g., 1000 = $10/day)' },
      specialAdCategories: { type: 'array', items: { type: 'string' }, description: 'Special ad categories: CREDIT, EMPLOYMENT, HOUSING, CREDIT_OPPOURTUNITY, EMPLOYMENT_OPPOURTUNITY, HOUSING_OPPOURTUNITY' },
    },
    required: ['accountId', 'name', 'objective'],
  },
};

export const pauseCampaignTool = {
  name: 'meta-pause-campaign',
  description: 'Pause a Meta Ads campaign',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignId: { type: 'string', description: 'Campaign ID to pause' },
    },
    required: ['accountId', 'campaignId'],
  },
};

export const activateCampaignTool = {
  name: 'meta-activate-campaign',
  description: 'Activate (unpause) a Meta Ads campaign',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignId: { type: 'string', description: 'Campaign ID to activate' },
    },
    required: ['accountId', 'campaignId'],
  },
};

export const updateCampaignBudgetTool = {
  name: 'meta-update-campaign-budget',
  description: 'Update campaign daily budget',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignId: { type: 'string', description: 'Campaign ID' },
      dailyBudget: { type: 'number', description: 'New daily budget in cents' },
    },
    required: ['accountId', 'campaignId', 'dailyBudget'],
  },
};

export const deleteCampaignTool = {
  name: 'meta-delete-campaign',
  description: 'Delete a Meta Ads campaign',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignId: { type: 'string', description: 'Campaign ID to delete' },
    },
    required: ['accountId', 'campaignId'],
  },
};

export const getCampaignAdSetsTool = {
  name: 'meta-get-campaign-adsets',
  description: 'Get all ad sets for a specific campaign',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignId: { type: 'string', description: 'Campaign ID' },
    },
    required: ['accountId', 'campaignId'],
  },
};

export const getCampaignAdsTool = {
  name: 'meta-get-campaign-ads',
  description: 'Get all ads for a specific campaign',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignId: { type: 'string', description: 'Campaign ID' },
    },
    required: ['accountId', 'campaignId'],
  },
};

// Execute functions
export async function executeGetCampaigns(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const fields = ['id', 'name', 'objective', 'status', 'effective_status', 'daily_budget', 'created_time', 'updated_time'];
  const params: any = { limit: args.limit || 25 };
  if (args.status && args.status !== 'ALL') {
    params.effective_status = args.status;
  }
  const campaigns = await account.getCampaigns(fields, params);
  return serializeSdkArray(campaigns);
}

export async function executeGetCampaignMetrics(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const insights = await (account as any).getCampaignInsights([args.campaignId], {
    date_preset: args.datePreset || 'last_30d',
    fields: ['impressions', 'clicks', 'spend', 'actions', 'ctr', 'cpc', 'cpp', 'reach', 'frequency'],
  });
  return serializeSdkArray(insights);
}

export async function executeCreateCampaign(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    name: args.name,
    objective: args.objective,
    status: args.status || 'PAUSED',
    special_ad_categories: args.specialAdCategories || [],
  };
  if (args.dailyBudget) {
    params.daily_budget = args.dailyBudget.toString();
  }
  const campaign = await account.createCampaign([], params);
  return serializeSdkObject(campaign);
}

export async function executePauseCampaign(args: any, accessToken: string) {
  const campaign = new CampaignClass(args.campaignId);
  await campaign.update({ status: 'PAUSED' });
  return { success: true, campaignId: args.campaignId, status: 'PAUSED' };
}

export async function executeActivateCampaign(args: any, accessToken: string) {
  const campaign = new CampaignClass(args.campaignId);
  await campaign.update({ status: 'ACTIVE' });
  return { success: true, campaignId: args.campaignId, status: 'ACTIVE' };
}

export async function executeUpdateCampaignBudget(args: any, accessToken: string) {
  const campaign = new CampaignClass(args.campaignId);
  await campaign.update({ daily_budget: args.dailyBudget.toString() });
  return { success: true, campaignId: args.campaignId, dailyBudget: args.dailyBudget };
}

export async function executeDeleteCampaign(args: any, accessToken: string) {
  const campaign = new CampaignClass(args.campaignId);
  await campaign.delete();
  return { success: true, deleted: args.campaignId };
}

export async function executeGetCampaignAdSets(args: any, accessToken: string) {
  const campaign = new CampaignClass(args.campaignId);
  const adSets = await campaign.getAdSets(['name', 'status', 'effective_status', 'daily_budget', 'bid_strategy']);
  return serializeSdkArray(adSets);
}

export async function executeGetCampaignAds(args: any, accessToken: string) {
  const campaign = new CampaignClass(args.campaignId);
  const ads = await campaign.getAds(['name', 'status', 'effective_status', 'adset_id', 'creative']);
  return serializeSdkArray(ads);
}
