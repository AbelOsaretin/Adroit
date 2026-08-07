import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart2,
  FileText,
  Megaphone,
  Zap,
  ExternalLink,
  Code,
  DollarSign,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

const SERVICES = [
  {
    id: "seo-analysis",
    name: "SEO Analysis",
    description: "Analyze website SEO performance and get optimization recommendations",
    price: "0.01",
    category: "analytics",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "seo-analysis", "params": {"url": "https://example.com"}}',
  },
  {
    id: "campaign-audit",
    name: "Campaign Audit",
    description: "Comprehensive audit of ad campaign performance across platforms",
    price: "0.05",
    category: "analytics",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "campaign-audit", "params": {"platform": "meta", "accountId": "xxx"}}',
  },
  {
    id: "competitor-analysis",
    name: "Competitor Analysis",
    description: "Analyze competitor marketing strategies and identify opportunities",
    price: "0.03",
    category: "analytics",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "competitor-analysis", "params": {"competitors": ["competitor1.com"]}}',
  },
  {
    id: "content-generation",
    name: "Content Generation",
    description: "Generate marketing content for social media, blog articles, email campaigns",
    price: "0.02",
    category: "content",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "content-generation", "params": {"type": "social", "topic": "summer sale"}}',
  },
  {
    id: "content-optimization",
    name: "Content Optimization",
    description: "Optimize existing content for better engagement and conversions",
    price: "0.01",
    category: "content",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "content-optimization", "params": {"content": "...", "goal": "engagement"}}',
  },
  {
    id: "campaign-creation",
    name: "Campaign Creation",
    description: "Create and configure ad campaigns across Google, Meta, TikTok",
    price: "0.10",
    category: "campaign",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "campaign-creation", "params": {"platform": "meta", "objective": "traffic"}}',
  },
  {
    id: "budget-optimization",
    name: "Budget Optimization",
    description: "AI-powered budget allocation across campaigns for maximum ROAS",
    price: "0.05",
    category: "campaign",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "budget-optimization", "params": {"totalBudget": 1000}}',
  },
  {
    id: "audience-targeting",
    name: "Audience Targeting",
    description: "Create and optimize audience targeting for ad campaigns",
    price: "0.03",
    category: "campaign",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "audience-targeting", "params": {"platform": "meta", "interests": ["fitness"]}}',
  },
  {
    id: "marketing-strategy",
    name: "Marketing Strategy",
    description: "Get comprehensive marketing strategy tailored to your business",
    price: "0.20",
    category: "consulting",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "marketing-strategy", "params": {"business": "ecommerce", "budget": 5000}}',
  },
  {
    id: "growth-consultation",
    name: "Growth Consultation",
    description: "One-on-one AI consultation for growth marketing strategies",
    price: "0.50",
    category: "consulting",
    endpoint: "/api/services",
    method: "POST",
    example: '{"serviceId": "growth-consultation", "params": {"question": "How to scale?"}}',
  },
]

const CATEGORY_ICONS: Record<string, any> = {
  analytics: BarChart2,
  content: FileText,
  campaign: Megaphone,
  consulting: Zap,
}

export default function PublicServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Adroit<span className="text-blue-500">.</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/70 hover:text-white">
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI Marketing Services
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Access professional marketing services via API. Pay per use with USDC.
            Built for AI agents.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              x402 Payments
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              USDC on Arc
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Instant Results
            </span>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-12 bg-white/5">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code className="h-6 w-6" />
            API Documentation
          </h2>
          <div className="glass rounded-lg p-6">
            <h3 className="font-semibold mb-2">Base URL</h3>
            <code className="block p-3 bg-black/50 rounded mb-4 text-green-400">
              https://adroit.ai/api/services
            </code>

            <h3 className="font-semibold mb-2">List Services</h3>
            <code className="block p-3 bg-black/50 rounded mb-4 text-green-400">
              GET /api/services?action=list
            </code>

            <h3 className="font-semibold mb-2">Execute Service</h3>
            <code className="block p-3 bg-black/50 rounded mb-4 text-green-400">
              POST /api/services
            </code>

            <h3 className="font-semibold mb-2">Request Body</h3>
            <pre className="p-3 bg-black/50 rounded mb-4 text-sm overflow-x-auto">
{`{
  "serviceId": "seo-analysis",
  "params": {
    "url": "https://example.com"
  }
}`}
            </pre>

            <h3 className="font-semibold mb-2">Payment (x402)</h3>
            <p className="text-white/60 text-sm mb-2">
              Include x402 payment proof in request headers:
            </p>
            <code className="block p-3 bg-black/50 rounded text-green-400">
              X-Payment-Proof: &lt;signed-payment-proof&gt;
            </code>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Available Services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = CATEGORY_ICONS[service.category] || Zap
              return (
                <Card key={service.id} className="glass hover:border-white/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-blue-400" />
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                        {service.category}
                      </span>
                    </div>
                    <CardTitle className="mt-4">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/60 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="font-bold">{service.price} USDC</span>
                      </div>
                      <span className="text-xs text-white/50">per call</span>
                    </div>
                    <div className="p-3 bg-black/50 rounded-lg">
                      <p className="text-xs text-white/50 mb-1">Example Request:</p>
                      <code className="text-xs text-green-400 break-all">
                        {service.example}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-6 text-center text-sm text-white/50">
          <p>Adroit AI Marketing Agency - Powered by x402 Payments on Arc</p>
        </div>
      </footer>
    </div>
  )
}
