export const detectAnomaliesTool = {
  name: "google-ads-detect-anomalies",
  description: "Detect anomalies in campaign performance (low CTR, high CPC)",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      threshold: {
        type: "object",
        properties: {
          ctr: { type: "number", description: "CTR threshold (e.g., 0.01 for 1%)" },
          cpc: { type: "number", description: "CPC threshold in USD" },
        },
      },
    },
    required: ["accountId"],
  },
};

export const calculateROASTool = {
  name: "google-ads-calculate-roas",
  description: "Calculate Return on Ad Spend for campaigns",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      campaignIds: { type: "array", items: { type: "string" } },
    },
    required: ["accountId"],
  },
};

export const comparePeriodsTool = {
  name: "google-ads-compare-periods",
  description: "Compare performance between two time periods",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      currentPeriod: { type: "string", description: "Current period (e.g., 'LAST_7_DAYS')" },
      previousPeriod: { type: "string", description: "Previous period (e.g., 'LAST_14_DAYS')" },
    },
    required: ["accountId"],
  },
};
