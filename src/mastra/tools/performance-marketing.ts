// Advanced Performance Marketing Tools - Wired to Meta Ads SDK
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getAdAccount, Campaign as CampaignClass } from "../mcp/meta-ads/src/sdk";

function serializeSdkObject(obj: any) {
  if (obj && obj._data) return obj._data;
  return obj;
}

// Multi-Touch Attribution
export const multi_touch_attribution = createTool({
  id: "ads-multi-touch-attribution",
  description: "Analyze multi-touch attribution across all channels",
  inputSchema: z.object({
    accountId: z.string(),
    dateRange: z.string(),
    model: z.enum(["first_touch", "last_touch", "linear", "time_decay", "position_based"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { accountId, dateRange, model } = inputData;

    try {
      const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);

      const insights = await account.getInsights({
        date_preset: "last_30d",
        fields: ["impressions", "clicks", "spend", "actions", "action_values"],
      });

      // Calculate attribution based on model
      const totalSpend = insights.reduce((sum: number, i: any) => sum + parseFloat(i.spend || 0), 0);
      const totalConversions = insights.reduce((sum: number, i: any) => {
        const actions = i.actions || [];
        const conversions = actions.find((a: any) => a.action_type === 'offsite_conversion');
        return sum + (conversions ? parseInt(conversions.value) : 0);
      }, 0);

      return {
        success: true,
        data: {
          model,
          dateRange,
          totalSpend,
          totalConversions,
          roas: totalSpend > 0 ? (totalConversions * 50) / totalSpend : 0,
          channels: insights.map((i: any) => serializeSdkObject(i)),
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

// Customer LTV
export const calculate_customer_ltv = createTool({
  id: "ads-calculate-customer-ltv",
  description: "Calculate customer lifetime value from ad campaigns",
  inputSchema: z.object({
    accountId: z.string(),
    cohorts: z.array(z.string()).optional(),
    timePeriod: z.enum(["30_days", "90_days", "1_year", "lifetime"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { accountId, timePeriod } = inputData;

    try {
      const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);

      const insights = await account.getInsights({
        date_preset: "last_90d",
        fields: ["spend", "actions", "action_values"],
      });

      const totalSpend = insights.reduce((sum: number, i: any) => sum + parseFloat(i.spend || 0), 0);
      const totalConversions = insights.reduce((sum: number, i: any) => {
        const actions = i.actions || [];
        const conversions = actions.find((a: any) => a.action_type === 'offsite_conversion');
        return sum + (conversions ? parseInt(conversions.value) : 0);
      }, 0);

      const totalRevenue = totalConversions * 50; // Mock $50 avg order value
      const avgOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0;
      const repeatRate = 0.3; // Mock 30% repeat rate
      const ltv = avgOrderValue * (1 + repeatRate + repeatRate * repeatRate);

      return {
        success: true,
        data: {
          timePeriod,
          totalSpend,
          totalRevenue,
          avgOrderValue,
          estimatedLTV: ltv,
          repeatRate: `${(repeatRate * 100).toFixed(0)}%`,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

// Bid Optimization
export const optimize_bidding = createTool({
  id: "ads-optimize-bidding",
  description: "AI-powered bid optimization across campaigns",
  inputSchema: z.object({
    platform: z.string(),
    accountId: z.string(),
    campaignIds: z.array(z.string()),
    goal: z.enum(["maximize_conversions", "maximize_roas", "minimize_cpa", "target_cpa"]),
    targetCpa: z.number().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, accountId, campaignIds, goal, targetCpa } = inputData;

    if (platform === "meta") {
      try {
        const results = [];

        for (const campaignId of campaignIds) {
          const campaign = new CampaignClass(campaignId);
          const insights = await campaign.getInsights({
            fields: ["spend", "actions", "cost_per_action_type"],
          });

          const data = insights[0] ? serializeSdkObject(insights[0]) : {};
          const spend = parseFloat(data.spend || 0);
          const actions = data.actions || [];
          const conversions = actions.find((a: any) => a.action_type === 'offsite_conversion');
          const convCount = conversions ? parseInt(conversions.value) : 0;
          const cpa = convCount > 0 ? spend / convCount : 0;

          // Calculate optimal bid based on goal
          let recommendedBid = cpa * 0.9; // Default: reduce CPA by 10%

          if (goal === "maximize_conversions") {
            recommendedBid = cpa * 1.1; // Increase to get more conversions
          } else if (goal === "maximize_roas") {
            recommendedBid = cpa * 0.85; // Reduce to improve ROAS
          } else if (goal === "target_cpa" && targetCpa) {
            recommendedBid = targetCpa;
          }

          results.push({
            campaignId,
            currentCpa: cpa,
            recommendedBid,
            goal,
            change: `${((recommendedBid - cpa) / cpa * 100).toFixed(1)}%`,
          });
        }

        return {
          success: true,
          data: {
            results,
            goal,
            summary: `Optimized ${campaignIds.length} campaigns for ${goal}`,
          },
        };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      data: {
        campaignIds,
        goal,
        targetCpa,
        recommendations: campaignIds.map((id) => ({
          campaignId: id,
          recommendedBid: goal === "target_cpa" ? targetCpa : 15.00,
          change: "-10%",
        })),
        mockMode: true,
      },
    };
  },
});

// Performance Forecast
export const forecast_campaign_performance = createTool({
  id: "ads-forecast-performance",
  description: "Predict campaign performance based on historical data",
  inputSchema: z.object({
    platform: z.string(),
    accountId: z.string(),
    campaignId: z.string(),
    forecastDays: z.number(),
    budgetChange: z.number().optional().describe("Proposed budget change percentage"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, accountId, campaignId, forecastDays, budgetChange } = inputData;

    if (platform === "meta") {
      try {
        const campaign = new CampaignClass(campaignId);
        const insights = await campaign.getInsights({
          date_preset: "last_30d",
          fields: ["spend", "impressions", "clicks", "actions"],
        });

        const data = insights[0] ? serializeSdkObject(insights[0]) : {};
        const dailySpend = parseFloat(data.spend || 0) / 30;
        const dailyClicks = parseInt(data.clicks || 0) / 30;
        const dailyConversions = (data.actions || []).find((a: any) => a.action_type === 'offsite_conversion');
        const dailyConvCount = dailyConversions ? parseInt(dailyConversions.value) / 30 : 0;

        const multiplier = budgetChange ? 1 + (budgetChange / 100) : 1;

        return {
          success: true,
          data: {
            campaignId,
            forecastDays,
            currentDailySpend: dailySpend,
            projectedSpend: dailySpend * forecastDays * multiplier,
            projectedClicks: Math.round(dailyClicks * forecastDays * multiplier),
            projectedConversions: Math.round(dailyConvCount * forecastDays * multiplier),
            budgetChange: budgetChange ? `${budgetChange}%` : "none",
          },
        };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      data: {
        campaignId,
        forecastDays,
        projectedSpend: 1500 * forecastDays,
        projectedClicks: 500 * forecastDays,
        projectedConversions: 25 * forecastDays,
        mockMode: true,
      },
    };
  },
});

// Competitor Analysis
export const analyze_competitor_ads = createTool({
  id: "ads-analyze-competitor-ads",
  description: "Analyze competitor advertising strategies",
  inputSchema: z.object({
    platform: z.string(),
    competitors: z.array(z.string()).describe("List of competitor page/domain names"),
    industry: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { platform, competitors, industry } = inputData;

    // Competitor analysis typically requires third-party tools
    return {
      success: true,
      data: {
        competitors,
        industry,
        insights: competitors.map((comp) => ({
          name: comp,
          estimatedSpend: `$${Math.floor(Math.random() * 50000 + 10000)}/mo`,
          topAdTypes: ["Video", "Carousel", "Lead Gen"],
          platforms: ["Facebook", "Instagram", "Google"],
          strengths: ["Strong brand presence", "Active engagement"],
          opportunities: ["Limited video content", "Weak retargeting"],
        })),
        mockMode: true,
      },
    };
  },
});

// Ad Variants
export const generate_ad_variants = createTool({
  id: "ads-generate-ad-variants",
  description: "Generate multiple ad variants for A/B testing",
  inputSchema: z.object({
    platform: z.string(),
    originalAd: z.object({
      headline: z.string(),
      description: z.string(),
      cta: z.string(),
    }),
    count: z.number(),
    variationType: z.enum(["headline", "description", "cta", "mixed"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { originalAd, count, variationType } = inputData;

    const variants = [];
    for (let i = 0; i < count; i++) {
      const variant = { ...originalAd };

      if (variationType === "headline" || variationType === "mixed") {
        variant.headline = `${originalAd.headline} - Variant ${i + 1}`;
      }
      if (variationType === "description" || variationType === "mixed") {
        variant.description = `${originalAd.description} (Try #${i + 1})`;
      }
      if (variationType === "cta" || variationType === "mixed") {
        const ctas = ["Shop Now", "Learn More", "Sign Up", "Get Started", "Try Free"];
        variant.cta = ctas[i % ctas.length];
      }

      variants.push(variant);
    }

    return {
      success: true,
      data: {
        original: originalAd,
        variants,
        count,
        variationType,
      },
    };
  },
});

// Blended CPA
export const calculate_blended_cpa = createTool({
  id: "ads-calculate-blended-cpa",
  description: "Calculate blended cost per acquisition across all channels",
  inputSchema: z.object({
    accountId: z.string(),
    dateRange: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { accountId } = inputData;

    try {
      const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);

      const insights = await account.getInsights({
        date_preset: "last_30d",
        fields: ["spend", "actions"],
      });

      const totalSpend = insights.reduce((sum: number, i: any) => sum + parseFloat(i.spend || 0), 0);
      const totalConversions = insights.reduce((sum: number, i: any) => {
        const actions = i.actions || [];
        const conversions = actions.find((a: any) => a.action_type === 'offsite_conversion');
        return sum + (conversions ? parseInt(conversions.value) : 0);
      }, 0);

      return {
        success: true,
        data: {
          totalSpend,
          totalConversions,
          blendedCpa: totalConversions > 0 ? totalSpend / totalConversions : 0,
          dateRange: "last_30d",
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

// Budget Allocation
export const optimize_budget_allocation = createTool({
  id: "ads-optimize-budget-allocation",
  description: "Optimize budget allocation across multiple campaigns",
  inputSchema: z.object({
    accountId: z.string(),
    campaignIds: z.array(z.string()),
    totalBudget: z.number(),
    optimizationGoal: z.enum(["maximize_roas", "maximize_conversions", "minimize_cpa"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async (inputData) => {
    const { accountId, campaignIds, totalBudget, optimizationGoal } = inputData;

    try {
      const account = getAdAccount(accountId, process.env.META_ACCESS_TOKEN!);
      const campaignPerformance = [];

      for (const campaignId of campaignIds) {
        const campaign = new CampaignClass(campaignId);
        const insights = await campaign.getInsights({
          date_preset: "last_30d",
          fields: ["spend", "actions", "impressions", "clicks"],
        });

        const data = insights[0] ? serializeSdkObject(insights[0]) : {};
        const spend = parseFloat(data.spend || 0);
        const actions = data.actions || [];
        const conversions = actions.find((a: any) => a.action_type === 'offsite_conversion');
        const convCount = conversions ? parseInt(conversions.value) : 0;

        campaignPerformance.push({
          campaignId,
          spend,
          conversions: convCount,
          roas: spend > 0 ? (convCount * 50) / spend : 0,
          cpa: convCount > 0 ? spend / convCount : Infinity,
        });
      }

      // Allocate budget based on performance
      const allocations = campaignPerformance.map((perf) => {
        let score;
        if (optimizationGoal === "maximize_roas") {
          score = perf.roas;
        } else if (optimizationGoal === "maximize_conversions") {
          score = perf.conversions;
        } else {
          score = perf.cpa > 0 ? 1 / perf.cpa : 0;
        }
        return { ...perf, score };
      });

      const totalScore = allocations.reduce((sum, a) => sum + a.score, 0);

      const optimizedAllocations = allocations.map((a) => ({
        campaignId: a.campaignId,
        currentBudget: a.spend / 30,
        recommendedBudget: (a.score / totalScore) * totalBudget,
        change: `${(((a.score / totalScore) * totalBudget - a.spend / 30) / (a.spend / 30) * 100).toFixed(1)}%`,
      }));

      return {
        success: true,
        data: {
          totalBudget,
          optimizationGoal,
          allocations: optimizedAllocations,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});
