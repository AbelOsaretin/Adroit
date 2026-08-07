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
    description: "Manage your USDC wallet and send payments",
    icon: Wallet,
    href: "/dashboard/wallet",
    disabled: false,
  },
  {
    title: "Gateway",
    description: "Unified USDC balance across chains with instant transfers",
    icon: Globe,
    href: "/dashboard/gateway",
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
  const [chartData, setChartData] = useState(generateMockData(7))
  const [platformData, setPlatformData] = useState(getMockPlatformData())
  const [budgetData, setBudgetData] = useState(getMockBudgetData())
  const [loading, setLoading] = useState(false)

  // Calculate stats from data
  const totalSpend = chartData.reduce((sum, d) => sum + d.spend, 0)
  const totalClicks = chartData.reduce((sum, d) => sum + d.clicks, 0)
  const totalConversions = chartData.reduce((sum, d) => sum + d.conversions, 0)
  const avgROAS = totalSpend > 0 ? (totalConversions * 50) / totalSpend : 0

  const refreshData = () => {
    setLoading(true)
    // In production, this would fetch real data from Meta/Google APIs
    setTimeout(() => {
      setChartData(generateMockData(7))
      setPlatformData(getMockPlatformData())
      setBudgetData(getMockBudgetData())
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your marketing performance.
          </p>
        </div>
        <Button variant="outline" onClick={refreshData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgROAS.toFixed(1)}x</div>
            <p className="text-xs text-muted-foreground">Return on Ad Spend</p>
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
          title="Conversions Over Time"
          metric="conversions"
          color="#f59e0b"
        />
      </div>

      {/* Platform and Budget */}
      <div className="grid gap-4 md:grid-cols-2">
        <PlatformComparison data={platformData} />
        <BudgetAllocation data={budgetData} />
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
