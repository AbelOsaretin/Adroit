"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BarChart2,
  FileText,
  Search,
  Share2,
  MessagesSquare,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  Megaphone,
  Wallet,
  Globe,
  Store,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Chat", href: "/dashboard/chat", icon: MessagesSquare },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Cards", href: "/dashboard/cards", icon: CreditCard },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { name: "Services", href: "/dashboard/services", icon: Store },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2, disabled: true },
  { name: "Content", href: "/dashboard/content", icon: FileText, disabled: true },
  { name: "SEO", href: "/dashboard/seo", icon: Search, disabled: true },
  { name: "Social Media", href: "/dashboard/social", icon: Share2, disabled: true },
]

const bottomNavigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const NavItem = ({ item, isBottom = false }) => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={item.disabled ? "#" : item.href}
          className={cn(
            "flex items-center w-full rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
            item.disabled && "opacity-50 cursor-not-allowed",
            isCollapsed && "justify-center px-2",
          )}
          onClick={(e) => item.disabled && e.preventDefault()}
        >
          <item.icon className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-2")} />
          {!isCollapsed && (
            <span className="flex items-center gap-2 truncate">
              {item.name}
              {item.disabled && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                  Soon
                </span>
              )}
            </span>
          )}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.name}
          {item.disabled && " (Coming Soon)"}
        </TooltipContent>
      )}
    </Tooltip>
  )

  return (
    <TooltipProvider>
      <>
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md shadow-md"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div
          className={cn(
            "fixed inset-y-0 z-20 flex flex-col bg-background transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen",
            isCollapsed ? "w-[60px]" : "w-56",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="border-b border-border">
            <div className={cn("flex h-12 items-center gap-2 px-3", isCollapsed && "justify-center px-2")}>
              {!isCollapsed && (
                <Link href="/" className="flex items-center font-semibold">
                  <span className="text-base">Adroit<span className="text-blue-500">.</span></span>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn("ml-auto h-8 w-8", isCollapsed && "ml-0")}
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} Sidebar</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <nav className="flex flex-col space-y-0.5 px-2 py-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className="border-t border-border p-2 flex-shrink-0">
            <nav className="flex flex-col space-y-0.5">
              {bottomNavigation.map((item) => (
                <NavItem key={item.name} item={item} isBottom />
              ))}
            </nav>
          </div>
        </div>
      </>
    </TooltipProvider>
  )
}
