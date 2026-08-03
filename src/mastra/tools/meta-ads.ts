import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const META_API_VERSION = 'v19.0';
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

interface MetaAuthConfig {
  accessToken: string;
  adAccountId: string;
}

async function metaApiRequest(
  endpoint: string,
  params: Record<string, string> = {},
  config: MetaAuthConfig,
  method: 'GET' | 'POST' = 'GET'
) {
  const url = new URL(`${META_BASE_URL}${endpoint}`);
  url.searchParams.append('access_token', config.accessToken);

  if (method === 'GET') {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(`Meta API error: ${response.statusText} - ${JSON.stringify(errorBody)}`);
    }
    return response.json();
  } else {
    const body = new URLSearchParams(params);
    body.append('access_token', config.accessToken);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(`Meta API error: ${response.statusText} - ${JSON.stringify(errorBody)}`);
    }
    return response.json();
  }
}

function getMetaConfig(accountId: string): MetaAuthConfig {
  const rawAccountId = accountId;
  const formattedId = rawAccountId?.startsWith('act_') ? rawAccountId : `act_${rawAccountId}`;
  return {
    accessToken: process.env.META_ACCESS_TOKEN!,
    adAccountId: formattedId,
  };
}

export const metaAdsGetCampaigns = createTool({
  id: 'meta-ads-get-campaigns',
  description: 'Fetch all campaigns from Meta Ads account',
  inputSchema: z.object({ accountId: z.string().describe('Meta Ad Account ID (act_XXXXXXXXX)') }),
  execute: async ({ accountId }) => {
    const config = getMetaConfig(accountId);
    const campaigns = await metaApiRequest(
      `/${config.adAccountId}/campaigns`,
      { fields: 'id,name,status,objective,daily_budget' },
      config
    );
    return campaigns.data;
  },
});

export const metaAdsGetCampaignMetrics = createTool({
  id: 'meta-ads-get-campaign-metrics',
  description: 'Get performance metrics for a specific campaign',
  inputSchema: z.object({ accountId: z.string(), campaignId: z.string(), dateRange: z.string().optional() }),
  execute: async ({ accountId, campaignId }) => {
    const config = getMetaConfig(accountId);
    const metrics = await metaApiRequest(
      `/${campaignId}/insights`,
      {
        fields: 'impressions,clicks,spend,actions,ctr,cpc',
        time_range: '{"since":"2026-01-01","until":"2026-07-30"}',
      },
      config
    );
    return metrics.data;
  },
});

export const metaAdsPauseCampaign = createTool({
  id: 'meta-ads-pause-campaign',
  description: 'Pause a Meta Ads campaign',
  inputSchema: z.object({ accountId: z.string(), campaignId: z.string() }),
  execute: async ({ accountId, campaignId }) => {
    const config = getMetaConfig(accountId);
    await metaApiRequest(`/${campaignId}`, { status: 'PAUSED' }, config, 'POST');
    return { success: true, paused: campaignId };
  },
});

export const metaAdsActivateCampaign = createTool({
  id: 'meta-ads-activate-campaign',
  description: 'Activate (unpause) a Meta Ads campaign',
  inputSchema: z.object({ accountId: z.string(), campaignId: z.string() }),
  execute: async ({ accountId, campaignId }) => {
    const config = getMetaConfig(accountId);
    await metaApiRequest(`/${campaignId}`, { status: 'ACTIVE' }, config, 'POST');
    return { success: true, activated: campaignId };
  },
});

export const metaAdsUpdateBudget = createTool({
  id: 'meta-ads-update-budget',
  description: 'Update campaign daily budget',
  inputSchema: z.object({ accountId: z.string(), campaignId: z.string(), budget: z.number() }),
  execute: async ({ accountId, campaignId, budget }) => {
    const config = getMetaConfig(accountId);
    await metaApiRequest(
      `/${campaignId}`,
      { daily_budget: (budget * 100).toString() },
      config,
      'POST'
    );
    return { success: true, updated: campaignId, newBudget: budget };
  },
});

export const metaAdsCreateCampaign = createTool({
  id: 'meta-ads-create-campaign',
  description: 'Create a new Meta Ads campaign',
  inputSchema: z.object({ accountId: z.string(), name: z.string(), objective: z.enum(['CONVERSIONS', 'REACH', 'TRAFFIC', 'ENGAGEMENT']), budget: z.number() }),
  execute: async ({ accountId, name, objective, budget }) => {
    const config = getMetaConfig(accountId);
    const campaignResponse = await metaApiRequest(
      `/${config.adAccountId}/campaigns`,
      {
        name,
        status: 'PAUSED',
        objective: objective || 'OUTCOME_TRAFFIC',
        daily_budget: (budget * 100).toString(),
        special_ad_categories: '[]',
      },
      config
    );
    return {
      success: true,
      campaignId: campaignResponse.id,
      name,
      objective,
      status: 'PAUSED',
      dailyBudget: budget,
    };
  },
});

export const metaAdsTools = {
  'meta-ads-get-campaigns': metaAdsGetCampaigns,
  'meta-ads-get-campaign-metrics': metaAdsGetCampaignMetrics,
  'meta-ads-pause-campaign': metaAdsPauseCampaign,
  'meta-ads-activate-campaign': metaAdsActivateCampaign,
  'meta-ads-update-budget': metaAdsUpdateBudget,
  'meta-ads-create-campaign': metaAdsCreateCampaign,
};
