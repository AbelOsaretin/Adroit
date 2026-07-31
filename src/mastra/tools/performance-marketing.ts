// Advanced Performance Marketing Tools

export const multi_touch_attribution = {
  name: "ads-multi-touch-attribution",
  description: "Analyze multi-touch attribution across all channels",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Master Account ID" },
      dateRange: { type: "string", description: "Date range (e.g., 'last_30_days')" },
      model: { type: "string", enum: ["first_touch", "last_touch", "linear", "time_decay", "position_based"], description: "Attribution model" },
    },
    required: ["accountId", "dateRange", "model"],
  },
};

export const calculate_customer_ltv = {
  name: "ads-calculate-customer-ltv",
  description: "Calculate customer lifetime value from ad campaigns",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Account ID" },
      cohorts: { type: "array", items: { type: "string" }, description: "Customer cohorts to analyze" },
      timePeriod: { type: "string", enum: ["30_days", "90_days", "1_year", "lifetime"], description: "LTV calculation period" },
    },
    required: ["accountId", "timePeriod"],
  },
};

export const optimize_bidding = {
  name: "ads-optimize-bidding",
  description: "AI-powered bid optimization across campaigns",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      campaignIds: { type: "array", items: { type: "string" }, description: "Campaigns to optimize" },
      goal: { type: "string", enum: ["maximize_conversions", "maximize_roas", "minimize_cpa", "target_cpa"], description: "Optimization goal" },
      targetCpa: { type: "number", description: "Target CPA (if using target_cpa goal)" },
    },
    required: ["platform", "accountId", "campaignIds", "goal"],
  },
};

export const forecast_campaign_performance = {
  name: "ads-forecast-performance",
  description: "Predict campaign performance based on historical data",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID to forecast" },
      forecastDays: { type: "number", description: "Days to forecast (7, 14, 30)" },
      budgetChange: { type: "number", description: "Proposed budget change percentage" },
    },
    required: ["platform", "accountId", "campaignId", "forecastDays"],
  },
};

export const analyze_competitor_ads = {
  name: "ads-analyze-competitor-ads",
  description: "Analyze competitor advertising strategies",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Ad platform" },
      competitorDomain: { type: "string", description: "Competitor website domain" },
      industry: { type: "string", description: "Industry category" },
    },
    required: ["platform", "competitorDomain"],
  },
};

export const generate_ad_variants = {
  name: "ads-generate-ad-variants",
  description: "Generate multiple ad variants for A/B testing",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Ad platform" },
      accountId: { type: "string", description: "Ad Account ID" },
      campaignId: { type: "string", description: "Campaign ID" },
      variantCount: { type: "number", description: "Number of variants to generate (2-10)" },
      focus: { type: "string", enum: ["headlines", "descriptions", "images", "ctas", "all"], description: "What to vary" },
    },
    required: ["platform", "accountId", "variantCount", "focus"],
  },
};

export const calculate_blended_cpa = {
  name: "ads-calculate-blended-cpa",
  description: "Calculate blended cost per acquisition across all channels",
  inputSchema: {
    type: "object" as const,
    properties: {
      accountId: { type: "string", description: "Account ID" },
      dateRange: { type: "string", description: "Date range" },
      includeOrganic: { type: "boolean", description: "Include organic conversions" },
    },
    required: ["accountId", "dateRange"],
  },
};

export const optimize_budget_allocation = {
  name: "ads-optimize-budget-allocation",
  description: "AI-powered budget reallocation across platforms",
  inputSchema: {
    type: "object" as const,
    properties: {
      totalBudget: { type: "number", description: "Total monthly budget" },
      platforms: { type: "array", items: { type: "string" }, description: "Platforms to allocate across" },
      goal: { type: "string", enum: ["maximize_roas", "maximize_conversions", "maximize_reach"], description: "Allocation goal" },
      constraints: { type: "object", description: "Min/max per platform" },
    },
    required: ["totalBudget", "platforms", "goal"],
  },
};
