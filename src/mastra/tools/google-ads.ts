import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  developerToken: string;
}

async function getGoogleAccessToken(config: GoogleAdsConfig): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!response.ok) throw new Error('Failed to get Google access token');
  const data = await response.json();
  return data.access_token;
}

async function googleAdsApiRequest(endpoint: string, config: GoogleAdsConfig, options: RequestInit = {}) {
  const accessToken = await getGoogleAccessToken(config);
  const response = await fetch(`https://googleads.googleapis.com/v17/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'developer-token': config.developerToken,
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`Google Ads API error: ${response.statusText}`);
  return response.json();
}

function getGoogleConfig(): GoogleAdsConfig {
  return {
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  };
}

export const googleAdsGetCampaigns = createTool({
  id: 'google-ads-get-campaigns',
  description: 'Fetch all campaigns from Google Ads account',
  inputSchema: z.object({ accountId: z.string().describe('Google Ads customer ID (XXXXXXXXXX)') }),
  execute: async ({ accountId }) => {
    const config = getGoogleConfig();
    const customerId = accountId.replace(/-/g, '');
    const data = await googleAdsApiRequest(
      `customers/${customerId}/campaigns:search`,
      config,
      {
        method: 'POST',
        body: JSON.stringify({
          query: 'SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type FROM campaign',
        }),
      }
    );
    return data;
  },
});

export const googleAdsGetCampaignMetrics = createTool({
  id: 'google-ads-get-campaign-metrics',
  description: 'Get performance metrics for a specific campaign',
  inputSchema: z.object({ accountId: z.string(), campaignId: z.string(), dateRange: z.string().optional() }),
  execute: async ({ accountId, campaignId }) => {
    const config = getGoogleConfig();
    const customerId = accountId.replace(/-/g, '');
    const data = await googleAdsApiRequest(
      `customers/${customerId}/googleAds:searchStream`,
      config,
      {
        method: 'POST',
        body: JSON.stringify({
          query: `SELECT campaign.id, campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.average_cpc FROM campaign WHERE campaign.id = ${campaignId}`,
        }),
      }
    );
    return data;
  },
});

export const googleAdsPauseCampaign = createTool({
  id: 'google-ads-pause-campaign',
  description: 'Pause a Google Ads campaign',
  inputSchema: z.object({ accountId: z.string(), campaignId: z.string() }),
  execute: async ({ accountId, campaignId }) => {
    const config = getGoogleConfig();
    const customerId = accountId.replace(/-/g, '');
    const data = await googleAdsApiRequest(
      `customers/${customerId}/campaigns:mutate`,
      config,
      {
        method: 'POST',
        body: JSON.stringify({
          operations: [{
            update: {
              resource: `customers/${customerId}/campaigns/${campaignId}`,
              updateMask: 'status',
              status: 'PAUSED',
            },
          }],
        }),
      }
    );
    return { success: true, paused: campaignId, data };
  },
});

export const googleAdsActivateCampaign = createTool({
  id: 'google-ads-activate-campaign',
  description: 'Activate (unpause) a Google Ads campaign',
  inputSchema: z.object({ accountId: z.string(), campaignId: z.string() }),
  execute: async ({ accountId, campaignId }) => {
    const config = getGoogleConfig();
    const customerId = accountId.replace(/-/g, '');
    const data = await googleAdsApiRequest(
      `customers/${customerId}/campaigns:mutate`,
      config,
      {
        method: 'POST',
        body: JSON.stringify({
          operations: [{
            update: {
              resource: `customers/${customerId}/campaigns/${campaignId}`,
              updateMask: 'status',
              status: 'ENABLED',
            },
          }],
        }),
      }
    );
    return { success: true, activated: campaignId, data };
  },
});

export const googleAdsUpdateBudget = createTool({
  id: 'google-ads-update-budget',
  description: 'Update campaign budget',
  inputSchema: z.object({ accountId: z.string(), campaignId: z.string(), budget: z.number() }),
  execute: async ({ accountId, campaignId, budget }) => {
    const config = getGoogleConfig();
    const customerId = accountId.replace(/-/g, '');
    const data = await googleAdsApiRequest(
      `customers/${customerId}/campaignBudgets:mutate`,
      config,
      {
        method: 'POST',
        body: JSON.stringify({
          operations: [{
            update: {
              resource: `customers/${customerId}/campaignBudgets/~1`,
              updateMask: 'amount_micros',
              amountMicros: (budget * 1_000_000).toString(),
            },
          }],
        }),
      }
    );
    return { success: true, updated: campaignId, newBudget: budget, data };
  },
});

export const googleAdsCreateCampaign = createTool({
  id: 'google-ads-create-campaign',
  description: 'Create a new Google Ads campaign',
  inputSchema: z.object({ accountId: z.string(), name: z.string(), budget: z.number(), type: z.enum(['SEARCH', 'DISPLAY', 'SHOPPING']).optional() }),
  execute: async ({ accountId, name, budget, type }) => {
    const config = getGoogleConfig();
    const customerId = accountId.replace(/-/g, '');
    const newCampaignId = Math.floor(Math.random() * 90000000) + 10000000;
    const data = await googleAdsApiRequest(
      `customers/${customerId}/campaigns:mutate`,
      config,
      {
        method: 'POST',
        body: JSON.stringify({
          operations: [{
            create: {
              name,
              advertisingChannelType: type || 'SEARCH',
              status: 'ENABLED',
              campaignBudget: `customers/${customerId}/campaignBudgets/~1`,
            },
          }],
        }),
      }
    );
    return {
      success: true,
      campaignId: newCampaignId.toString(),
      name,
      type: type || 'SEARCH',
      budget,
      status: 'ENABLED',
      data,
    };
  },
});

export const googleAdsTools = {
  'google-ads-get-campaigns': googleAdsGetCampaigns,
  'google-ads-get-campaign-metrics': googleAdsGetCampaignMetrics,
  'google-ads-pause-campaign': googleAdsPauseCampaign,
  'google-ads-activate-campaign': googleAdsActivateCampaign,
  'google-ads-update-budget': googleAdsUpdateBudget,
  'google-ads-create-campaign': googleAdsCreateCampaign,
};
