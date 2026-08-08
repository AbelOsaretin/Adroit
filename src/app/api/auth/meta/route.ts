// Meta Ads OAuth API
// Handles Meta Ads account connection via OAuth

import { NextRequest, NextResponse } from "next/server"

const META_APP_ID = process.env.META_APP_ID
const META_APP_SECRET = process.env.META_APP_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// Store connected accounts (in production, use database)
const connectedAccounts = new Map<string, any>()

// GET /api/auth/meta - Get OAuth URL or check connection status
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const userId = url.searchParams.get("userId") || "default-user"
  const action = url.searchParams.get("action") || "status"

  if (action === "status") {
    // Check if user has connected Meta account
    const account = connectedAccounts.get(userId)
    return NextResponse.json({
      connected: !!account,
      accountId: account?.accountId || null,
      accountName: account?.accountName || null,
    })
  }

  if (action === "auth") {
    // Generate OAuth URL
    if (!META_APP_ID) {
      return NextResponse.json({ error: "META_APP_ID not configured" }, { status: 500 })
    }

    const scopes = [
      "ads_management",
      "ads_read",
      "business_management",
      "pages_show_list",
      "pages_read_engagement",
    ].join(",")

    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI + "/api/auth/meta/callback")}&scope=${scopes}&state=${userId}`

    return NextResponse.json({ authUrl })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

// POST /api/auth/meta - Handle OAuth callback or disconnect
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, code } = body

    switch (action) {
      case "callback": {
        // Exchange authorization code for access token
        if (!META_APP_ID || !META_APP_SECRET) {
          return NextResponse.json({ error: "Meta credentials not configured" }, { status: 500 })
        }

        const tokenResponse = await fetch(
          `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI + "/api/auth/meta/callback")}&client_secret=${META_APP_SECRET}&code=${code}`,
          { method: "GET" }
        )

        const tokenData = await tokenResponse.json()

        if (tokenData.error) {
          return NextResponse.json({ error: tokenData.error.message }, { status: 400 })
        }

        // Get user info
        const userResponse = await fetch(
          `https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
        )
        const userData = await userResponse.json()

        // Get ad accounts
        const accountsResponse = await fetch(
          `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_status,currency&access_token=${tokenData.access_token}`
        )
        const accountsData = await accountsResponse.json()

        // Store connected account
        const account = {
          accessToken: tokenData.access_token,
          userId: userData.id,
          userName: userData.name,
          accountId: accountsData.data?.[0]?.id,
          accountName: accountsData.data?.[0]?.name,
          connectedAt: new Date().toISOString(),
        }

        connectedAccounts.set(userId || userData.id, account)

        return NextResponse.json({
          success: true,
          accessToken: account.accessToken,
          accountId: account.accountId,
          accountName: account.accountName,
        })
      }

      case "disconnect": {
        connectedAccounts.delete(userId)
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Meta auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
