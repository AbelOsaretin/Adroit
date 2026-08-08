"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Megaphone,
  DollarSign,
  MousePointerClick,
  TrendingUp,
  Pause,
  Play,
  RefreshCw,
  Loader2,
  ExternalLink,
} from "lucide-react"

interface Campaign {
  id: string
  name: string
  status: string
  objective: string
  dailyBudget: number | null
  platform: string
}

const PLATFORMS = [
  { id: "all", name: "All Platforms", color: "text-white" },
  { id: "meta", name: "Meta Ads", color: "text-blue-500", icon: "M" },
  { id: "google", name: "Google Ads", color: "text-red-500", icon: "G" },
  { id: "tiktok", name: "TikTok Ads", color: "text-pink-500", icon: "T" },
  { id: "linkedin", name: "LinkedIn Ads", color: "text-blue-600", icon: "L" },
  { id: "snapchat", name: "Snapchat Ads", color: "text-yellow-500", icon: "S" },
  { id: "pinterest", name: "Pinterest Ads", color: "text-red-600", icon: "P" },
]

export default function CampaignsPage() {
  const [activePlatform, setActivePlatform] = useState("all")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalSpend: 0,
    totalClicks: 0,
    roas: 0,
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const [campaignsRes, insightsRes] = await Promise.all([
        fetch("/api/meta?action=campaigns"),
        fetch("/api/meta?action=insights&days=30"),
      ])

      const campaignsData = await campaignsRes.json()
      const insightsData = await insightsRes.json()

      if (campaignsData.success) {
        // Tag all campaigns as "meta" platform
        const metaCampaigns = campaignsData.data.map((c: any) => ({
          ...c,
          platform: "meta",
        }))
        setCampaigns(metaCampaigns)
        setStats({
          activeCampaigns: metaCampaigns.filter(
            (c: Campaign) => c.status === "ACTIVE"
          ).length,
          totalSpend: insightsData.data?.summary?.spend || 0,
          totalClicks: insightsData.data?.summary?.clicks || 0,
          roas: insightsData.data?.summary?.roas || 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCampaignStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
    setCampaigns(
      campaigns.map((c) =>
        c.id === campaign.id ? { ...c, status: newStatus } : c
      )
    )
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    PAUSED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  }

  const filteredCampaigns =
    activePlatform === "all"
      ? campaigns
      : campaigns.filter((c) => c.platform === activePlatform)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your ad campaigns across all platforms
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCampaigns} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button>
            <Megaphone className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {PLATFORMS.slice(1).map((platform) => {
          const platformCampaigns = campaigns.filter(
            (c) => c.platform === platform.id
          )
          const isActive = platformCampaigns.some(
            (c) => c.status === "ACTIVE"
          )
          return (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all ${
                activePlatform === platform.id
                  ? "ring-2 ring-primary"
                  : "hover:shadow-md"
              }`}
              onClick={() => setActivePlatform(platform.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${platform.color} bg-current/10`}
                  >
                    {platform.icon}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <p className="text-sm font-medium">{platform.name}</p>
                <p className="text-xs text-muted-foreground">
                  {platformCampaigns.length} campaigns
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalSpend.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalClicks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.roas.toFixed(1)}x</div>
            <p className="text-xs text-muted-foreground">Return on ad spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {activePlatform === "all"
                ? "All Campaigns"
                : PLATFORMS.find((p) => p.id === activePlatform)?.name}
            </CardTitle>
            {activePlatform !== "meta" && activePlatform !== "all" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Connect in Settings</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No campaigns found</p>
              {activePlatform !== "meta" && activePlatform !== "all" && (
                <p className="text-sm text-muted-foreground">
                  Connect your {PLATFORMS.find((p) => p.id === activePlatform)?.name}{" "}
                  account in{" "}
                  <a href="/dashboard/settings" className="text-primary hover:underline">
                    Settings
                  </a>{" "}
                  to see campaigns here.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Campaign</th>
                    <th className="text-left py-3 px-4 font-medium">Platform</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Objective</th>
                    <th className="text-left py-3 px-4 font-medium">Daily Budget</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{campaign.name}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {PLATFORMS.find((p) => p.id === campaign.platform)?.name || campaign.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[campaign.status] || "bg-gray-100 text-gray-700"}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {campaign.objective?.replace("OUTCOME_", "") || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {campaign.dailyBudget ? `$${campaign.dailyBudget}/day` : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleCampaignStatus(campaign)}
                        >
                          {campaign.status === "ACTIVE" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
