"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, FileText, Search, Share2, TrendingUp, DollarSign, MousePointerClick, ArrowUpRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "Campaigns",
    description: "Manage your ad campaigns across Google, Meta, and more",
    icon: Megaphone,
    href: "/dashboard/campaigns",
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

const campaignStats = [
  {
    title: "Active Campaigns",
    value: "12",
    change: "+2 this month",
    icon: Megaphone,
  },
  {
    title: "Total Spend",
    value: "$24,500",
    change: "+12% from last month",
    icon: DollarSign,
  },
  {
    title: "Total Clicks",
    value: "145,230",
    change: "+8% from last month",
    icon: MousePointerClick,
  },
  {
    title: "ROAS",
    value: "4.2x",
    change: "+0.3x from last month",
    icon: TrendingUp,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your marketing performance.
        </p>
      </div>

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {campaignStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card 
              key={service.title} 
              className={`relative overflow-hidden ${service.disabled ? 'opacity-60' : 'hover:shadow-md transition-shadow'}`}
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
                <p className="text-sm text-muted-foreground">{service.description}</p>
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium">Campaign "Summer Sale" activated</p>
                <p className="text-xs text-muted-foreground">Google Ads • 2 hours ago</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium">Budget updated for "Brand Awareness"</p>
                <p className="text-xs text-muted-foreground">Meta Ads • 5 hours ago</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Updated
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New campaign created</p>
                <p className="text-xs text-muted-foreground">Google Ads • 1 day ago</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                Paused
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
