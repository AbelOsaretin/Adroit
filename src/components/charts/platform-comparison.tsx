"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface PlatformData {
  platform: string
  spend: number
  clicks: number
  conversions: number
  roas: number
}

interface PlatformComparisonProps {
  data: PlatformData[]
}

export function PlatformComparison({ data }: PlatformComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Platform Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#666" fontSize={12} />
              <YAxis
                dataKey="platform"
                type="category"
                stroke="#666"
                fontSize={12}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="spend" name="Spend ($)" fill="#3b82f6" />
              <Bar dataKey="conversions" name="Conversions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock platform data
export function getMockPlatformData(): PlatformData[] {
  return [
    { platform: "Meta", spend: 12500, clicks: 45000, conversions: 320, roas: 4.2 },
    { platform: "Google", spend: 18000, clicks: 62000, conversions: 480, roas: 3.8 },
    { platform: "TikTok", spend: 5000, clicks: 28000, conversions: 150, roas: 2.9 },
    { platform: "LinkedIn", spend: 8000, clicks: 12000, conversions: 95, roas: 3.1 },
  ]
}
