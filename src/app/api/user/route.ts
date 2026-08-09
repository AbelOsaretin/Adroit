// User API Route
// Manages user data by wallet address

import { NextRequest, NextResponse } from "next/server";
import { initDatabase, getDb } from "@/lib/db/schema";
import { getUserByWallet, createUser, updateUserLogin, saveOnboarding, getOnboarding, saveIntegration, getIntegration, getIntegrations, saveSettings, getSettings } from "@/lib/db/users";

// Initialize database on first request
let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// GET /api/user?wallet=xxx - Get user data
export async function GET(request: NextRequest) {
  await ensureDb();
  
  const url = new URL(request.url);
  const walletAddress = url.searchParams.get("wallet");
  const action = url.searchParams.get("action") || "profile";

  if (!walletAddress) {
    return NextResponse.json({ error: "wallet parameter required" }, { status: 400 });
  }

  try {
    switch (action) {
      case "profile": {
        const user = await getUserByWallet(walletAddress);
        if (!user) {
          return NextResponse.json({ exists: false });
        }
        return NextResponse.json({ exists: true, user });
      }

      case "onboarding": {
        const onboarding = await getOnboarding(walletAddress);
        return NextResponse.json({ onboarding });
      }

      case "integrations": {
        const integrations = await getIntegrations(walletAddress);
        return NextResponse.json({ integrations });
      }

      case "settings": {
        const settings = await getSettings(walletAddress);
        return NextResponse.json({ settings });
      }

      case "full": {
        const user = await getUserByWallet(walletAddress);
        const onboarding = await getOnboarding(walletAddress);
        const integrations = await getIntegrations(walletAddress);
        const settings = await getSettings(walletAddress);
        return NextResponse.json({
          exists: !!user,
          user,
          onboarding,
          integrations,
          settings,
        });
      }

      case "all": {
        // Return all data from all tables (for debugging)
        const db = getDb();
        const users = await db.execute("SELECT * FROM users");
        const onboardingData = await db.execute("SELECT * FROM onboarding");
        const integrationsData = await db.execute("SELECT * FROM integrations");
        const settingsData = await db.execute("SELECT * FROM settings");
        return NextResponse.json({
          users: users.rows,
          onboarding: onboardingData.rows,
          integrations: integrationsData.rows,
          settings: settingsData.rows,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}

// POST /api/user - Create or update user data
export async function POST(request: NextRequest) {
  await ensureDb();

  try {
    const body = await request.json();
    const { action, walletAddress, data } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress required" }, { status: 400 });
    }

    const walletId = data?.walletId || body.walletId || "";

    switch (action) {
      case "create-user": {
        const user = await createUser(walletAddress, walletId, data);
        return NextResponse.json({ success: true, user });
      }

      case "update-login": {
        await updateUserLogin(walletAddress);
        return NextResponse.json({ success: true });
      }

      case "save-onboarding": {
        await saveOnboarding(walletAddress, walletId, data);
        return NextResponse.json({ success: true });
      }

      case "save-integration": {
        await saveIntegration(walletAddress, data.platform, data);
        return NextResponse.json({ success: true });
      }

      case "save-settings": {
        await saveSettings(walletAddress, data);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json({ error: "Failed to save user data" }, { status: 500 });
  }
}
