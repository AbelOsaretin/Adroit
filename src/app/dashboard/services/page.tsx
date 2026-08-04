"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, Zap, BarChart2, FileText, Megaphone, DollarSign, ExternalLink } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: string
  category: string
  enabled: boolean
}

const SERVICES: Service[] = [
  { id: "seo-analysis", name: "SEO Analysis", description: "Analyze website SEO and get optimization recommendations", price: "0.01", category: "analytics", enabled: true },
  { id: "campaign-audit", name: "Campaign Audit", description: "Audit ad campaign performance across platforms", price: "0.05", category: "analytics", enabled: true },
  { id: "competitor-analysis", name: "Competitor Analysis", description: "Analyze competitor marketing strategies", price: "0.03", category: "analytics", enabled: true },
  { id: "content-generation", name: "Content Generation", description: "Generate marketing content for social media, blogs, ads", price: "0.02", category: "content", enabled: true },
  { id: "content-optimization", name: "Content Optimization", description: "Optimize existing content for better engagement", price: "0.01", category: "content", enabled: true },
  { id: "campaign-creation", name: "Campaign Creation", description: "Create and configure ad campaigns across platforms", price: "0.10", category: "campaign", enabled: true },
  { id: "budget-optimization", name: "Budget Optimization", description: "Optimize ad spend allocation across campaigns", price: "0.05", category: "campaign", enabled: true },
  { id: "audience-targeting", name: "Audience Targeting", description: "Create and optimize audience targeting", price: "0.03", category: "campaign", enabled: true },
  { id: "marketing-strategy", name: "Marketing Strategy", description: "Get comprehensive marketing strategy recommendations", price: "0.20", category: "consulting", enabled: true },
  { id: "growth-consultation", name: "Growth Consultation", description: "One-on-one consultation for growth marketing", price: "0.50", category: "consulting", enabled: true },
]

const CATEGORY_ICONS: Record<string, any> = {
  analytics: BarChart2,
  content: FileText,
  campaign: Megaphone,
  consulting: Zap,
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [services, setServices] = useState<Service[]>(SERVICES)

  const categories = ["all", "analytics", "content", "campaign", "consulting"]

  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter(s => s.category === selectedCategory)

  const totalRevenue = services.reduce((sum, s) => sum + parseFloat(s.price), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Your AI marketing services available for other agents via USDC payments
          </p>
        </div>
        <Button>
          <Store className="h-4 w-4 mr-2" />
          List New Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">Available for agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
            <p className="text-xs text-muted-foreground">Service categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">USDC</div>
            <p className="text-xs text-muted-foreground">x402 Gateway Nanopayments</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => {
          const Icon = CATEGORY_ICONS[service.category] || Zap
          return (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{service.category}</span>
                </div>
                <CardTitle className="mt-4">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{service.price} USDC</span>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* API Endpoint Info */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2">List services:</p>
            <p>GET /api/services</p>
            <p className="text-muted-foreground mt-4 mb-2">Execute service:</p>
            <p>POST /api/services {"{ serviceId: 'seo-analysis' }"}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Other AI agents can call these endpoints with x402 payment proof to use your services.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
