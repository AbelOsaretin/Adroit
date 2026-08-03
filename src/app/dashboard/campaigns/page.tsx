"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  Megaphone, 
  DollarSign, 
  MousePointerClick, 
  TrendingUp,
  MoreHorizontal,
  Pause,
  Play,
  Pencil
} from "lucide-react"

const campaignStats = [
  {
    title: "Active Campaigns",
    value: "12",
    icon: Megaphone,
    description: "Across all platforms",
  },
  {
    title: "Total Spend",
    value: "$24,500",
    icon: DollarSign,
    description: "This month",
  },
  {
    title: "Total Clicks",
    value: "145,230",
    icon: MousePointerClick,
    description: "+8% from last month",
  },
  {
    title: "ROAS",
    value: "4.2x",
    icon: TrendingUp,
    description: "Return on ad spend",
  },
]

const googleCampaigns = [
  {
    id: "1",
    name: "Summer Sale 2026",
    status: "ACTIVE",
    budget: "$500/day",
    impressions: "45,230",
    clicks: "3,420",
    conversions: "156",
    roas: "4.8x",
  },
  {
    id: "2",
    name: "Brand Awareness",
    status: "ACTIVE",
    budget: "$300/day",
    impressions: "89,100",
    clicks: "5,670",
    conversions: "89",
    roas: "3.2x",
  },
  {
    id: "3",
    name: "Product Launch",
    status: "PAUSED",
    budget: "$750/day",
    impressions: "23,450",
    clicks: "1,890",
    conversions: "45",
    roas: "5.1x",
  },
  {
    id: "4",
    name: "Retargeting Campaign",
    status: "ACTIVE",
    budget: "$200/day",
    impressions: "34,560",
    clicks: "2,340",
    conversions: "112",
    roas: "6.2x",
  },
]

const metaCampaigns = [
  {
    id: "5",
    name: "Instagram Stories",
    status: "ACTIVE",
    budget: "$400/day",
    impressions: "67,890",
    clicks: "4,560",
    conversions: "234",
    roas: "3.9x",
  },
  {
    id: "6",
    name: "Facebook Retargeting",
    status: "ACTIVE",
    budget: "$250/day",
    impressions: "45,670",
    clicks: "3,210",
    conversions: "178",
    roas: "5.4x",
  },
  {
    id: "7",
    name: "Lead Generation",
    status: "PAUSED",
    budget: "$350/day",
    impressions: "23,450",
    clicks: "1,890",
    conversions: "67",
    roas: "2.8x",
  },
]

const statusColors = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  PAUSED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const allCampaigns = [...googleCampaigns, ...metaCampaigns]
  const displayCampaigns = activeTab === "all" 
    ? allCampaigns 
    : activeTab === "google" 
      ? googleCampaigns 
      : metaCampaigns

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your ad campaigns across all platforms
          </p>
        </div>
        <Button>
          <Megaphone className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {campaignStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All Platforms</TabsTrigger>
              <TabsTrigger value="google">Google Ads</TabsTrigger>
              <TabsTrigger value="meta">Meta Ads</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Campaign</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Budget</th>
                      <th className="text-left py-3 px-4 font-medium">Impressions</th>
                      <th className="text-left py-3 px-4 font-medium">Clicks</th>
                      <th className="text-left py-3 px-4 font-medium">Conversions</th>
                      <th className="text-left py-3 px-4 font-medium">ROAS</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{campaign.name}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{campaign.budget}</td>
                        <td className="py-3 px-4">{campaign.impressions}</td>
                        <td className="py-3 px-4">{campaign.clicks}</td>
                        <td className="py-3 px-4">{campaign.conversions}</td>
                        <td className="py-3 px-4 font-medium">{campaign.roas}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              {campaign.status === "ACTIVE" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
