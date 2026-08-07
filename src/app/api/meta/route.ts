// Meta Ads API Endpoint
// Fetches real campaign data from Meta Ads

import { NextRequest, NextResponse } from "next/server"

const isMockMode = !process.env.META_ACCESS_TOKEN

async function getMetaAccount() {
  const { getAdAccount } = await import(
    "@/mastra/mcp/meta-ads/src/sdk"
  )
  return getAdAccount(
    process.env.META_AD_ACCOUNT_ID || "1825876572152624",
    process.env.META_ACCESS_TOKEN!
  )
}

function serializeSdkObject(obj: any) {
  if (obj && obj._data) return obj._data
  return obj
}

// GET /api/meta - Fetch campaign data
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const action = url.searchParams.get("action") || "insights"
  const days = parseInt(url.searchParams.get("days") || "7")

  if (isMockMode) {
    return getMockData(action, days)
  }

  try {
    const account = await getMetaAccount()

    switch (action) {
      case "insights": {
        // Get account insights
        const insights = await account.getInsights({
          date_preset: days <= 7 ? "last_7d" : days <= 30 ? "last_30d" : "last_90d",
          fields: [
            "impressions",
            "clicks",
            "spend",
            "actions",
            "ctr",
            "cpc",
            "reach",
            "frequency",
          ],
        })

        const data = insights.map((i: any) => serializeSdkObject(i))

        // Aggregate data
        const aggregated = data.reduce(
          (acc: any, curr: any) => {
            acc.impressions += parseInt(curr.impressions || 0)
            acc.clicks += parseInt(curr.clicks || 0)
            acc.spend += parseFloat(curr.spend || 0)
            acc.reach += parseInt(curr.reach || 0)
            return acc
          },
          { impressions: 0, clicks: 0, spend: 0, reach: 0 }
        )

        // Calculate conversions from actions
        const totalConversions = data.reduce((acc: number, curr: any) => {
          const actions = curr.actions || []
          const conversions = actions.find(
            (a: any) => a.action_type === "offsite_conversion"
          )
          return acc + (conversions ? parseInt(conversions.value) : 0)
        }, 0)

        return NextResponse.json({
          success: true,
          data: {
            summary: {
              impressions: aggregated.impressions,
              clicks: aggregated.clicks,
              spend: aggregated.spend,
              reach: aggregated.reach,
              conversions: totalConversions,
              ctr:
                aggregated.impressions > 0
                  ? (aggregated.clicks / aggregated.impressions) * 100
                  : 0,
              cpc:
                aggregated.clicks > 0
                  ? aggregated.spend / aggregated.clicks
                  : 0,
              roas:
                totalConversions > 0
                  ? (totalConversions * 50) / aggregated.spend
                  : 0,
            },
            daily: data.map((d: any) => ({
              date: d.date_start,
              impressions: parseInt(d.impressions || 0),
              clicks: parseInt(d.clicks || 0),
              spend: parseFloat(d.spend || 0),
            })),
          },
        })
      }

      case "campaigns": {
        // Get all campaigns
        const campaigns = await account.getCampaigns(
          ["id", "name", "status", "effective_status", "objective", "daily_budget"],
          { limit: 50 }
        )

        const data = campaigns.map((c: any) => serializeSdkObject(c))

        return NextResponse.json({
          success: true,
          data: data.map((c: any) => ({
            id: c.id,
            name: c.name,
            status: c.effective_status || c.status,
            objective: c.objective,
            dailyBudget: c.daily_budget
              ? parseInt(c.daily_budget) / 100
              : null,
          })),
        })
      }

      case "platform-comparison": {
        // Get insights grouped by platform
        const insights = await account.getInsights({
          date_preset: "last_30d",
          fields: ["impressions", "clicks", "spend", "actions"],
          breakdowns: ["publisher_platform"],
        })

        const data = insights.map((i: any) => serializeSdkObject(i))

        // Group by platform
        const platformMap: Record<string, any> = {}
        for (const item of data) {
          const platform = item.publisher_platform || "unknown"
          if (!platformMap[platform]) {
            platformMap[platform] = {
              platform: platform.charAt(0).toUpperCase() + platform.slice(1),
              impressions: 0,
              clicks: 0,
              spend: 0,
              conversions: 0,
            }
          }
          platformMap[platform].impressions += parseInt(item.impressions || 0)
          platformMap[platform].clicks += parseInt(item.clicks || 0)
          platformMap[platform].spend += parseFloat(item.spend || 0)

          const actions = item.actions || []
          const conversions = actions.find(
            (a: any) => a.action_type === "offsite_conversion"
          )
          platformMap[platform].conversions += conversions
            ? parseInt(conversions.value)
            : 0
        }

        const platformData = Object.values(platformMap).map((p: any) => ({
          ...p,
          roas: p.conversions > 0 ? (p.conversions * 50) / p.spend : 0,
        }))

        return NextResponse.json({
          success: true,
          data: platformData,
        })
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error("Meta API error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

function getMockData(action: string, days: number) {
  const mockInsights = {
    summary: {
      impressions: 125000,
      clicks: 4500,
      spend: 8500,
      reach: 95000,
      conversions: 320,
      ctr: 3.6,
      cpc: 1.89,
      roas: 1.88,
    },
    daily: Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        impressions: Math.floor(Math.random() * 20000 + 10000),
        clicks: Math.floor(Math.random() * 800 + 400),
        spend: Math.floor(Math.random() * 1500 + 800),
      }
    }),
  }

  const mockCampaigns = [
    {
      id: "120249878450490361",
      name: "Website Traffic",
      status: "PAUSED",
      objective: "OUTCOME_TRAFFIC",
      dailyBudget: 25,
    },
    {
      id: "120249878449940361",
      name: "App Install Campaign",
      status: "PAUSED",
      objective: "OUTCOME_APP_PROMOTION",
      dailyBudget: 40,
    },
    {
      id: "120249878449620361",
      name: "Lead Gen - Free Trial",
      status: "PAUSED",
      objective: "OUTCOME_LEADS",
      dailyBudget: 75,
    },
    {
      id: "120249878449140361",
      name: "Brand Awareness Q3",
      status: "PAUSED",
      objective: "OUTCOME_AWARENESS",
      dailyBudget: 30,
    },
    {
      id: "120249878448650361",
      name: "Summer Sale 2026",
      status: "PAUSED",
      objective: "OUTCOME_SALES",
      dailyBudget: 50,
    },
    {
      id: "120249770337850361",
      name: "Adroit Test Campaign",
      status: "ACTIVE",
      objective: "OUTCOME_TRAFFIC",
      dailyBudget: 20,
    },
  ]

  const mockPlatforms = [
    { platform: "Facebook", impressions: 45000, clicks: 1800, spend: 3200, conversions: 120, roas: 1.88 },
    { platform: "Instagram", impressions: 38000, clicks: 1500, spend: 2800, conversions: 95, roas: 1.7 },
    { platform: "Audience Network", impressions: 25000, clicks: 800, spend: 1500, conversions: 65, roas: 2.17 },
    { platform: "Messenger", impressions: 17000, clicks: 400, spend: 1000, conversions: 40, roas: 2.0 },
  ]

  switch (action) {
    case "insights":
      return NextResponse.json({ success: true, data: mockInsights })
    case "campaigns":
      return NextResponse.json({ success: true, data: mockCampaigns })
    case "platform-comparison":
      return NextResponse.json({ success: true, data: mockPlatforms })
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
