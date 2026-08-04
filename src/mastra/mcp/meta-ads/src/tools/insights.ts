import { getAdAccount } from '../sdk';

export const getAccountInsightsTool = {
  name: 'meta-get-account-insights',
  description: 'Get performance insights for an ad account',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      datePreset: { type: 'string', description: 'Date range: today, yesterday, last_7d, last_30d, this_month, last_month', default: 'last_30d' },
      breakdowns: { type: 'array', items: { type: 'string' }, description: 'Breakdowns: age, gender, country, placement, device_platform' },
      level: { type: 'string', description: 'Reporting level: account, campaign, adset, ad' },
    },
    required: ['accountId'],
  },
};

export const getCampaignInsightsTool = {
  name: 'meta-get-campaign-insights',
  description: 'Get insights for all campaigns in an account',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      campaignIds: { type: 'array', items: { type: 'string' }, description: 'Specific campaign IDs (optional, defaults to all)' },
      datePreset: { type: 'string', description: 'Date range preset', default: 'last_30d' },
      breakdowns: { type: 'array', items: { type: 'string' }, description: 'Breakdowns' },
    },
    required: ['accountId'],
  },
};

export const detectAnomaliesTool = {
  name: 'meta-detect-anomalies',
  description: 'Detect performance anomalies in campaigns',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      datePreset: { type: 'string', description: 'Date range', default: 'last_30d' },
    },
    required: ['accountId'],
  },
};

export const calculateROASTool = {
  name: 'meta-calculate-roas',
  description: 'Calculate Return on Ad Spend for campaigns',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      conversionValue: { type: 'number', description: 'Default conversion value per conversion' },
      datePreset: { type: 'string', description: 'Date range', default: 'last_30d' },
    },
    required: ['accountId'],
  },
};

export const comparePeriodsTool = {
  name: 'meta-compare-periods',
  description: 'Compare performance between two time periods',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      currentPeriod: { type: 'string', description: 'Current period preset' },
      previousPeriod: { type: 'string', description: 'Previous period preset' },
    },
    required: ['accountId', 'currentPeriod', 'previousPeriod'],
  },
};

export const getReachEstimateTool = {
  name: 'meta-get-reach-estimate',
  description: 'Get reach estimate for a targeting specification',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      targeting: { type: 'object', description: 'Targeting specification' },
      optimizationGoal: { type: 'string', description: 'Optimization goal: REACH, IMPRESSIONS, LINK_CLICKS' },
    },
    required: ['accountId', 'targeting'],
  },
};

// Execute functions
export async function executeGetAccountInsights(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    date_preset: args.datePreset || 'last_30d',
    fields: ['impressions', 'clicks', 'spend', 'reach', 'frequency', 'ctr', 'cpc', 'actions', 'cost_per_action_type'],
  };
  if (args.breakdowns) params.breakdowns = args.breakdowns;
  if (args.level) params.level = args.level;
  const insights = await account.getInsights(params);
  return insights;
}

export async function executeGetCampaignInsights(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    date_preset: args.datePreset || 'last_30d',
    fields: ['campaign_name', 'impressions', 'clicks', 'spend', 'reach', 'ctr', 'cpc', 'actions', 'cost_per_action_type'],
  };
  if (args.breakdowns) params.breakdowns = args.breakdowns;
  if (args.campaignIds) params.filtering = [{ field: 'campaign.id', operator: 'IN', value: args.campaignIds }];
  const insights = await account.getInsights(params);
  return insights;
}

export async function executeDetectAnomalies(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const campaigns = await account.getCampaigns(['id', 'name', 'status', 'effective_status'], { effective_status: 'ACTIVE' });
  const anomalies: any[] = [];

  for (const campaign of campaigns) {
    const insights = await (account as any).getCampaignInsights([(campaign as any).id], {
      date_preset: args.datePreset || 'last_30d',
      fields: ['impressions', 'clicks', 'spend', 'ctr', 'cpc'],
    });

    if (insights.length > 0) {
      const data = insights[0];
      const ctr = parseFloat(data.ctr) || 0;
      const cpc = parseFloat(data.cpc) || 0;
      const spend = parseFloat(data.spend) || 0;

      if (ctr < 0.01 && spend > 10) {
        anomalies.push({
          type: 'LOW_CTR',
          campaignId: (campaign as any).id,
          campaignName: (campaign as any).name,
          value: ctr,
          threshold: 0.01,
          spend,
        });
      }
      if (cpc > 5 && spend > 10) {
        anomalies.push({
          type: 'HIGH_CPC',
          campaignId: (campaign as any).id,
          campaignName: (campaign as any).name,
          value: cpc,
          threshold: 5,
          spend,
        });
      }
    }
  }

  return anomalies;
}

export async function executeCalculateROAS(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const insights = await account.getInsights({
    date_preset: args.datePreset || 'last_30d',
    fields: ['campaign_name', 'spend', 'actions'],
    level: 'campaign',
  });

  const defaultConversionValue = args.conversionValue || 50;

  return insights.map((i: any) => {
    const data = i;
    const spend = parseFloat(data.spend) || 0;
    const conversions = data.actions?.find((a: any) => a.action_type === 'offsite_conversion')?.value || 0;
    const revenue = conversions * defaultConversionValue;
    return {
      campaignName: data.campaign_name,
      spend,
      conversions: parseInt(conversions),
      revenue,
      roas: spend > 0 ? revenue / spend : 0,
    };
  });
}

export async function executeComparePeriods(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);

  const currentInsights = await account.getInsights({
    date_preset: args.currentPeriod,
    fields: ['spend', 'impressions', 'clicks', 'actions'],
  });

  const previousInsights = await account.getInsights({
    date_preset: args.previousPeriod,
    fields: ['spend', 'impressions', 'clicks', 'actions'],
  });

  const sumField = (data: any[], field: string) => data.reduce((sum, i) => sum + (parseFloat((i)[field]) || 0), 0);

  const current = {
    spend: sumField(currentInsights, 'spend'),
    impressions: sumField(currentInsights, 'impressions'),
    clicks: sumField(currentInsights, 'clicks'),
  };

  const previous = {
    spend: sumField(previousInsights, 'spend'),
    impressions: sumField(previousInsights, 'impressions'),
    clicks: sumField(previousInsights, 'clicks'),
  };

  const calcChange = (curr: number, prev: number) => prev > 0 ? ((curr - prev) / prev) * 100 : 0;

  return {
    current,
    previous,
    changes: {
      spendChange: calcChange(current.spend, previous.spend),
      impressionsChange: calcChange(current.impressions, previous.impressions),
      clicksChange: calcChange(current.clicks, previous.clicks),
    },
  };
}

export async function executeGetReachEstimate(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const reachEstimate = await (account as any).getReachEstimate({
    targeting_spec: args.targeting,
    optimization_goal: args.optimizationGoal || 'REACH',
  });
  return reachEstimate;
}
