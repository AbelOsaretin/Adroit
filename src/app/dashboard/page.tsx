"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Megaphone,
  FileText,
  Search,
  Share2,
  TrendingUp,
  DollarSign,
  MousePointerClick,
  ArrowUpRight,
  Wallet,
  Globe,
  Store,
  RefreshCw,
  Users,
  Target,
} from "lucide-react"
import Link from "next/link"
import {
  CampaignChart,
  generateMockData,
} from "@/components/charts/campaign-chart"
import {
  PlatformComparison,
  getMockPlatformData,
} from "@/components/charts/platform-comparison"
import {
  BudgetAllocation,
  getMockBudgetData,
} from "@/components/charts/budget-allocation"

interface InsightsData {
  summary: {
    impressions: number
    clicks: number
    spend: number
    reach: number
    conversions: number
    ctr: number
    cpc: number
    roas: number
  }
  daily: Array<{
    date: string
    impressions: number
    clicks: number
    spend: number
  }>
}

interface CampaignData {
  id: string
  name: string
  status: string
  objective: string
  dailyBudget: number | null
}

interface PlatformData {
  platform: string
  impressions: number
  clicks: number
  spend: number
  conversions: number
  roas: number
}

const services = [
  {
    title: "Campaigns",
    description: "Manage your ad campaigns across Google, Meta, and more",
    icon: Megaphone,
    href: "/dashboard/campaigns",
    disabled: false,
  },
  {
    title: "Wallet",
    description: "Manage your funds, send payments, and add funds across chains",
    icon: Wallet,
    href: "/dashboard/wallet",
    disabled: false,
  },
  {
    title: "Services",
    description: "Sell your AI marketing services to other agents",
    icon: Store,
    href: "/dashboard/services",
    disabled: false,
  },
  {
    title: "Content Creation",
    description: "Generate engaging content for social media, blogs, and ads",
    icon: FileText,
    href: "#",
    disabled: true,
  },
  {
    title: "SEO Analysis",
    description: "Optimize your online presence and track performance",
    icon: Search,
    href: "#",
    disabled: true,
  },
  {
    title: "Social Media",
    description: "Manage and optimize your social media presence",
    icon: Share2,
    href: "#",
    disabled: true,
  },
]

export default function DashboardPage() {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [platformData, setPlatformData] = useState<PlatformData[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => {
    fetchAllData()
  }, [days])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Get Meta access token from localStorage (set during OAuth)
      const metaToken = localStorage.getItem("meta-access-token")
      const metaAccountId = localStorage.getItem("meta-account-id")
      
      // Build query params with token if available
      const tokenParam = metaToken ? `&userToken=${metaToken}` : ""
      const accountParam = metaAccountId ? `&accountId=${metaAccountId}` : ""
      
      const [insightsRes, campaignsRes, platformRes] = await Promise.all([
        fetch(`/api/meta?action=insights&days=${days}${tokenParam}${accountParam}`),
        fetch(`/api/meta?action=campaigns${tokenParam}${accountParam}`),
        fetch(`/api/meta?action=platform-comparison${tokenParam}${accountParam}`),
      ])

      const insightsData = await insightsRes.json()
      const campaignsData = await campaignsRes.json()
      const platformDataResult = await platformRes.json()

      if (insightsData.success) setInsights(insightsData.data)
      if (campaignsData.success) setCampaigns(campaignsData.data)
      if (platformDataResult.success) setPlatformData(platformDataResult.data)
    } catch (error) {
      console.error("Failed to fetch Meta data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Convert insights to chart format
  const chartData =
    insights?.daily?.map((d) => ({
      date: d.date,
      spend: d.spend,
      clicks: d.clicks,
      impressions: d.impressions,
      conversions: 0,
    })) || generateMockData(days)

  // Calculate budget allocation from campaigns
  const budgetData = campaigns.reduce(
    (acc, c) => {
      if (c.dailyBudget) {
        const existing = acc.find((a) => a.name === c.objective)
        if (existing) {
          existing.value += c.dailyBudget * 30 // Monthly
        } else {
          acc.push({
            name: c.objective.replace("OUTCOME_", ""),
            value: c.dailyBudget * 30,
          })
        }
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your marketing performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg border bg-background text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <Button variant="outline" onClick={fetchAllData} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${insights?.summary?.spend?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Last {days} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.summary?.impressions?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Last {days} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.summary?.clicks?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              CTR: {insights?.summary?.ctr?.toFixed(1) || "0"}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.summary?.roas?.toFixed(1) || "0"}x
            </div>
            <p className="text-xs text-muted-foreground">
              ${insights?.summary?.cpc?.toFixed(2) || "0"} CPC
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CampaignChart
          data={chartData}
          title="Spend Over Time"
          metric="spend"
          color="#3b82f6"
        />
        <CampaignChart
          data={chartData}
          title="Clicks Over Time"
          metric="clicks"
          color="#10b981"
        />
        <CampaignChart
          data={chartData}
          title="Impressions Over Time"
          metric="impressions"
          color="#f59e0b"
        />
      </div>

      {/* Platform and Campaigns */}
      <div className="grid gap-4 md:grid-cols-2">
        <PlatformComparison data={platformData} />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaigns.slice(0, 5).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.objective.replace("OUTCOME_", "")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      campaign.status === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              ))}
              {campaigns.length > 5 && (
                <Link
                  href="/dashboard/campaigns"
                  className="text-sm text-primary hover:underline block text-center"
                >
                  View all {campaigns.length} campaigns
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className={`relative overflow-hidden ${
                service.disabled
                  ? "opacity-60"
                  : "hover:shadow-md transition-shadow"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <service.icon className="h-8 w-8 text-primary" />
                  {service.disabled && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
                <CardTitle className="mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
                {!service.disabled && (
                  <Link
                    href={service.href}
                    className="inline-flex items-center mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Get Started <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
