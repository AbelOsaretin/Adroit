export const getPerformanceReportTool = {
  name: "google-ads-get-performance-report",
  description: "Get performance report with ROAS, CPC, CTR metrics",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      campaignIds: { type: "array", items: { type: "string" }, description: "Optional: specific campaign IDs" },
      dateRange: { type: "string", description: "Date range (e.g., 'LAST_30_DAYS')" },
    },
    required: ["accountId"],
  },
};

export const getConversionReportTool = {
  name: "google-ads-get-conversion-report",
  description: "Get conversion tracking report",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Google Ads customer ID" },
      dateRange: { type: "string", description: "Date range" },
    },
    required: ["accountId"],
  },
};
