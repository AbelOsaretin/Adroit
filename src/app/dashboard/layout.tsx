"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <TopNav />
            <div className="container mx-auto p-6 max-w-7xl">
              <main className="w-full">{children}</main>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}
