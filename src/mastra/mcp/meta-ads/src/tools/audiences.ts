import { getAdAccount, CustomAudience } from '../sdk';

export const getCustomAudiencesTool = {
  name: 'meta-get-custom-audiences',
  description: 'Get all custom audiences from an account',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      limit: { type: 'number', description: 'Max audiences to return', default: 25 },
    },
    required: ['accountId'],
  },
};

export const createCustomAudienceTool = {
  name: 'meta-create-custom-audience',
  description: 'Create a custom audience for retargeting',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      name: { type: 'string', description: 'Audience name' },
      subtype: { type: 'string', description: 'Audience subtype: CUSTOM, WEBSITE, APP, ENGAGEMENT', default: 'CUSTOM' },
      description: { type: 'string', description: 'Audience description' },
      customerFileSource: { type: 'string', description: 'Customer file source: USER_PROVIDED_ONLY, ADVERTISER_MANAGED', default: 'USER_PROVIDED_ONLY' },
    },
    required: ['accountId', 'name'],
  },
};

export const createWebsiteCustomAudienceTool = {
  name: 'meta-create-website-audience',
  description: 'Create a website custom audience for retargeting website visitors',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      name: { type: 'string', description: 'Audience name' },
      pixelId: { type: 'string', description: 'Facebook Pixel ID' },
      retentionDays: { type: 'number', description: 'Days to retain users (1-180)', default: 30 },
      rules: { type: 'array', description: 'Custom audience rules for website traffic' },
    },
    required: ['accountId', 'name', 'pixelId'],
  },
};

export const createLookalikeAudienceTool = {
  name: 'meta-create-lookalike-audience',
  description: 'Create a lookalike audience based on a source audience',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      name: { type: 'string', description: 'Lookalike audience name' },
      sourceAudienceId: { type: 'string', description: 'Source audience ID to create lookalike from' },
      country: { type: 'string', description: 'Target country code (e.g., US, GB)' },
      startRatio: { type: 'number', description: 'Start ratio (0-0.1)', default: 0 },
      endRatio: { type: 'number', description: 'End ratio (0-0.1)', default: 0.01 },
    },
    required: ['accountId', 'name', 'sourceAudienceId', 'country'],
  },
};

export const deleteCustomAudienceTool = {
  name: 'meta-delete-custom-audience',
  description: 'Delete a custom audience',
  inputSchema: {
    type: 'object' as const,
    properties: {
      audienceId: { type: 'string', description: 'Custom Audience ID to delete' },
    },
    required: ['audienceId'],
  },
};

export const getAudienceSizeTool = {
  name: 'meta-get-audience-size',
  description: 'Get the estimated size of a custom audience',
  inputSchema: {
    type: 'object' as const,
    properties: {
      audienceId: { type: 'string', description: 'Custom Audience ID' },
    },
    required: ['audienceId'],
  },
};

// Execute functions
export async function executeGetCustomAudiences(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const audiences = await account.getCustomAudiences(['name', 'description', 'subtype', 'approximate_count', 'time_updated'], { limit: args.limit || 25 });
  return audiences.map((a: any) => a.exportAll());
}

export async function executeCreateCustomAudience(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    name: args.name,
    subtype: args.subtype || 'CUSTOM',
    customer_file_source: args.customerFileSource || 'USER_PROVIDED_ONLY',
  };
  if (args.description) params.description = args.description;
  const audience = await account.createCustomAudience([], params);
  return audience.exportAll();
}

export async function executeCreateWebsiteCustomAudience(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    name: args.name,
    subtype: 'WEBSITE',
    customer_file_source: 'ADVERTISER_MANAGED',
  };
  if (args.pixelId) {
    params.rule = JSON.stringify({
      events: [{ id: args.pixelId, name: 'PAGE_VIEW', retention_days: args.retentionDays || 30 }],
    });
  }
  if (args.rules) {
    params.rule = JSON.stringify(args.rules);
  }
  const audience = await account.createCustomAudience([], params);
  return audience.exportAll();
}

export async function executeCreateLookalikeAudience(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    name: args.name,
    origin: args.sourceAudienceId,
    country: args.country,
    start_ratio: args.startRatio || 0,
    end_ratio: args.endRatio || 0.01,
  };
  const audience = await account.createLookalike([], params);
  return audience.exportAll();
}

export async function executeDeleteCustomAudience(args: any, accessToken: string) {
  const audience = new CustomAudience(args.audienceId);
  await audience.delete();
  return { success: true, deleted: args.audienceId };
}

export async function executeGetAudienceSize(args: any, accessToken: string) {
  const audience = new CustomAudience(args.audienceId);
  const data = await audience.get(['approximate_count']);
  return { audienceId: args.audienceId, approximateCount: (data as any).approximate_count };
}
