"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

interface BudgetData {
  name: string
  value: number
  color: string
}

interface BudgetAllocationProps {
  data: BudgetData[]
  title?: string
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export function BudgetAllocation({
  data,
  title = "Budget Allocation",
}: BudgetAllocationProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold">${total.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Budget</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock budget data
export function getMockBudgetData(): BudgetData[] {
  return [
    { name: "Meta Ads", value: 12500, color: "#3b82f6" },
    { name: "Google Ads", value: 18000, color: "#10b981" },
    { name: "TikTok Ads", value: 5000, color: "#f59e0b" },
    { name: "LinkedIn Ads", value: 8000, color: "#8b5cf6" },
  ]
}
