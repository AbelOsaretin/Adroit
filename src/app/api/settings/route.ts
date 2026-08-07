// Settings API Route
import { NextRequest, NextResponse } from "next/server"

// In production, this would use a database
const settingsStore = new Map<string, any>()

// GET /api/settings - Get user settings
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const userId = url.searchParams.get("userId") || "default-user"

  const settings = settingsStore.get(userId) || {
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
      googleConnected: false,
      tiktokConnected: false,
    },
  }

  return NextResponse.json({ success: true, data: settings })
}

// POST /api/settings - Update user settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default-user", section, data } = body

    const currentSettings = settingsStore.get(userId) || {}
    const updatedSettings = {
      ...currentSettings,
      [section]: {
        ...currentSettings[section],
        ...data,
      },
    }

    settingsStore.set(userId, updatedSettings)

    return NextResponse.json({
      success: true,
      message: `${section} settings updated`,
      data: updatedSettings[section],
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
