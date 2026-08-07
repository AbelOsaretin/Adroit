"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

interface ChartData {
  date: string
  spend: number
  clicks: number
  impressions: number
  conversions: number
}

interface CampaignChartProps {
  data: ChartData[]
  title: string
  metric: "spend" | "clicks" | "impressions" | "conversions"
  color?: string
  showTrend?: boolean
}

export function CampaignChart({
  data,
  title,
  metric,
  color = "#3b82f6",
  showTrend = true,
}: CampaignChartProps) {
  const currentValue = data[data.length - 1]?.[metric] || 0
  const previousValue = data[data.length - 2]?.[metric] || 0
  const trend = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

  const formatValue = (value: number) => {
    if (metric === "spend") return `$${value.toLocaleString()}`
    if (metric === "impressions") return `${(value / 1000).toFixed(1)}K`
    return value.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {showTrend && (
            <div
              className={`flex items-center text-sm ${
                trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold">{formatValue(currentValue)}</div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatValue}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={color}
                fillOpacity={1}
                fill={`url(#gradient-${metric})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock data generator for demo
export function generateMockData(days: number = 7): ChartData[] {
  const data: ChartData[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      spend: Math.floor(Math.random() * 500 + 200),
      clicks: Math.floor(Math.random() * 1000 + 500),
      impressions: Math.floor(Math.random() * 50000 + 20000),
      conversions: Math.floor(Math.random() * 50 + 20),
    })
  }

  return data
}
