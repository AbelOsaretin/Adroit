export const get_performance_report = {
  name: "meta-ads-get-performance-report",
  description: "Get performance report with ROAS, CPC, CTR metrics",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      campaignIds: { type: "array", items: { type: "string" }, description: "Optional: specific campaign IDs" },
      dateRange: { type: "string", description: "Date range" },
    },
    required: ["accountId"],
  },
};

export const get_insights = {
  name: "meta-ads-get-insights",
  description: "Get detailed insights breakdown by age, gender, placement",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Meta Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID" },
      breakdown: { type: "string", enum: ["age", "gender", "placement"], description: "Breakdown type" },
    },
    required: ["accountId"],
  },
};
