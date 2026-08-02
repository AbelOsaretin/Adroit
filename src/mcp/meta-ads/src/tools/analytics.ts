export const detect_anomalies = {
  name: "meta-ads-detect-anomalies",
  description: "Detect anomalies in campaign performance",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      threshold: {
        type: "object",
        properties: {
          ctr: { type: "number", description: "CTR threshold" },
          cpc: { type: "number", description: "CPC threshold in USD" },
        },
      },
    },
    required: ["accountId"],
  },
};

export const calculate_roas = {
  name: "meta-ads-calculate-roas",
  description: "Calculate Return on Ad Spend",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      campaignIds: { type: "array", items: { type: "string" } },
    },
    required: ["accountId"],
  },
};

export const compare_periods = {
  name: "meta-ads-compare-periods",
  description: "Compare performance between two time periods",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      currentPeriod: { type: "string", description: "Current period" },
      previousPeriod: { type: "string", description: "Previous period" },
    },
    required: ["accountId"],
  },
};
