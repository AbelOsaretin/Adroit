"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { Loader2, Check, Link as LinkIcon, Unlink } from "lucide-react"

interface Settings {
  account: {
    fullName: string
    email: string
    phone: string
    timezone: string
  }
  preferences: {
    language: string
    currency: string
    theme: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    campaignAlerts: boolean
    performanceReports: boolean
    frequency: string
  }
  integrations: {
    metaConnected: boolean
    metaAccountId: string | null
    metaAccountName: string | null
    googleConnected: boolean
    tiktokConnected: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    account: {
      fullName: "Admin User",
      email: "admin@adroit.ai",
      phone: "+1 (555) 123-4567",
      timezone: "utc-5",
    },
    preferences: {
      language: "en",
      currency: "usd",
      theme: "dark",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      campaignAlerts: true,
      performanceReports: true,
      frequency: "real-time",
    },
    integrations: {
      metaConnected: false,
      metaAccountId: null,
      metaAccountName: null,
      googleConnected: false,
      tiktokConnected: false,
    },
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  const saveSettings = async (section: string) => {
    setLoading(true)
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          data: settings[section as keyof Settings],
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateAccount = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      account: { ...prev.account, [field]: value },
    }))
  }

  const updatePreferences = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }))
  }

  const updateNotifications = (field: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }))
  }

  const toggleIntegration = (platform: string) => {
    setSettings((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [`${platform}Connected`]: !prev.integrations[`${platform}Connected` as keyof typeof prev.integrations],
      },
    }))
  }

  const handleMetaConnect = async () => {
    if (settings.integrations.metaConnected) {
      // Disconnect
      setSettings((prev) => ({
        ...prev,
        integrations: {
          ...prev.integrations,
          metaConnected: false,
          metaAccountId: null,
          metaAccountName: null,
        },
      }))
      return
    }

    // Get OAuth URL
    try {
      const res = await fetch("/api/auth/meta?action=auth")
      const data = await res.json()
      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    } catch (error) {
      console.error("Failed to get Meta auth URL:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Current Avatar</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback>
                      {settings.account.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={settings.account.fullName}
                  onChange={(e) => updateAccount("fullName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.account.email}
                  onChange={(e) => updateAccount("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.account.phone}
                  onChange={(e) => updateAccount("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.account.timezone}
                  onValueChange={(v) => updateAccount("timezone", v || "utc-5")}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc+0">Greenwich Mean Time (UTC+0)</SelectItem>
                    <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                    <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                    <SelectItem value="utc+9">Japan Standard Time (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings("account")} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : null}
                {saved ? "Saved!" : "Save Account Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(v) => updatePreferences("language", v || "en")}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.preferences.currency}
                    onValueChange={(v) => updatePreferences("currency", v || "usd")}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings("preferences")} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : null}
                {saved ? "Saved!" : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Notification Channels</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(v) =>
                        updateNotifications("emailNotifications", v)
                      }
                    />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(v) =>
                        updateNotifications("pushNotifications", v)
                      }
                    />
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notification Types</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="campaign-alerts"
                      checked={settings.notifications.campaignAlerts}
                      onCheckedChange={(v) =>
                        updateNotifications("campaignAlerts", v)
                      }
                    />
                    <Label htmlFor="campaign-alerts">Campaign Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="performance-reports"
                      checked={settings.notifications.performanceReports}
                      onCheckedChange={(v) =>
                        updateNotifications("performanceReports", v)
                      }
                    />
                    <Label htmlFor="performance-reports">Performance Reports</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Notification Frequency</Label>
                <Select
                  value={settings.notifications.frequency}
                  onValueChange={(v) => updateNotifications("frequency", v || "real-time")}
                >
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => saveSettings("notifications")}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : null}
                {saved ? "Saved!" : "Save Notification Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Ad Platform Integrations</CardTitle>
              <CardDescription>Connect your ad platforms to sync data and run campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Ads */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <span className="text-blue-500 font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-medium">Meta Ads</p>
                    <p className="text-sm text-muted-foreground">
                      Facebook, Instagram, Messenger
                    </p>
                    {settings.integrations.metaConnected && (
                      <p className="text-xs text-green-500 mt-1">
                        Connected to account: {settings.integrations.metaAccountId || "Unknown"}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant={settings.integrations.metaConnected ? "outline" : "default"}
                  onClick={() => handleMetaConnect()}
                >
                  {settings.integrations.metaConnected ? (
                    <>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Connected
                    </>
                  ) : (
                    "Connect Meta Ads"
                  )}
                </Button>
              </div>

              {/* Google Ads */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <span className="text-red-500 font-bold">G</span>
                  </div>
                  <div>
                    <p className="font-medium">Google Ads</p>
                    <p className="text-sm text-muted-foreground">
                      Search, Display, YouTube, Shopping
                    </p>
                  </div>
                </div>
                <Button
                  variant={
                    settings.integrations.googleConnected ? "outline" : "default"
                  }
                  onClick={() => toggleIntegration("google")}
                >
                  {settings.integrations.googleConnected ? (
                    <>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>

              {/* TikTok Ads */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <span className="text-pink-500 font-bold">T</span>
                  </div>
                  <div>
                    <p className="font-medium">TikTok Ads</p>
                    <p className="text-sm text-muted-foreground">
                      In-feed, Spark Ads, branded effects
                    </p>
                  </div>
                </div>
                <Button
                  variant={
                    settings.integrations.tiktokConnected ? "outline" : "default"
                  }
                  onClick={() => toggleIntegration("tiktok")}
                >
                  {settings.integrations.tiktokConnected ? (
                    <>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => saveSettings("integrations")}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : null}
                {saved ? "Saved!" : "Save Integration Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account's security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wallet Security</Label>
                <p className="text-sm text-muted-foreground">
                  Your wallet is secured by Circle's MPC technology. No private keys
                  are stored on our servers.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="session-timeout" defaultChecked />
                <Label htmlFor="session-timeout">
                  Auto-logout after 30 minutes of inactivity
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
