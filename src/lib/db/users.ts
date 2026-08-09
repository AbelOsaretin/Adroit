// User management functions
// Wallet address is the user identity

import { getDb } from "./schema";

export interface User {
  wallet_address: string;
  user_id: string;
  circle_user_id: string;
  email: string;
  name: string;
  created_at: string;
  last_login: string;
}

export interface OnboardingData {
  wallet_address: string;
  company_name: string;
  industry: string;
  website: string;
  company_size: string;
  marketing_channels: string;
  monthly_budget: string;
  goals: string;
  target_audience: string;
  pain_points: string;
  competitors: string;
  brand_primary_color: string;
  brand_secondary_color: string;
  brand_voice: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
}

export interface Integration {
  wallet_address: string;
  platform: string;
  access_token: string;
  account_id: string;
  account_name: string;
  connected_at: string;
}

// Check if user exists by wallet address
export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE wallet_address = ?",
    args: [walletAddress],
  });
  return result.rows[0] as User | null;
}

// Create new user
export async function createUser(walletAddress: string, data?: Partial<User>): Promise<User> {
  const db = getDb();
  await db.execute({
    sql: `INSERT OR REPLACE INTO users (wallet_address, user_id, circle_user_id, email, name)
          VALUES (?, ?, ?, ?, ?)`,
    args: [
      walletAddress,
      data?.user_id || walletAddress,
      data?.circle_user_id || "",
      data?.email || "",
      data?.name || "",
    ],
  });
  return getUserByWallet(walletAddress) as Promise<User>;
}

// Update user last login
export async function updateUserLogin(walletAddress: string): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: "UPDATE users SET last_login = datetime('now') WHERE wallet_address = ?",
    args: [walletAddress],
  });
}

// Save onboarding data
export async function saveOnboarding(walletAddress: string, data: OnboardingData): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `INSERT OR REPLACE INTO onboarding 
          (wallet_address, company_name, industry, website, company_size,
           marketing_channels, monthly_budget, goals, target_audience,
           pain_points, competitors, brand_primary_color, brand_secondary_color,
           brand_voice, instagram, facebook, twitter, linkedin, tiktok)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      walletAddress,
      data.company_name,
      data.industry,
      data.website,
      data.company_size,
      data.marketing_channels,
      data.monthly_budget,
      data.goals,
      data.target_audience,
      data.pain_points,
      data.competitors,
      data.brand_primary_color,
      data.brand_secondary_color,
      data.brand_voice,
      data.instagram,
      data.facebook,
      data.twitter,
      data.linkedin,
      data.tiktok,
    ],
  });
}

// Get onboarding data
export async function getOnboarding(walletAddress: string): Promise<OnboardingData | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM onboarding WHERE wallet_address = ?",
    args: [walletAddress],
  });
  return result.rows[0] as OnboardingData | null;
}

// Save integration
export async function saveIntegration(
  walletAddress: string,
  platform: string,
  data: { access_token: string; account_id: string; account_name: string }
): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `INSERT OR REPLACE INTO integrations 
          (wallet_address, platform, access_token, account_id, account_name)
          VALUES (?, ?, ?, ?, ?)`,
    args: [walletAddress, platform, data.access_token, data.account_id, data.account_name],
  });
}

// Get integration
export async function getIntegration(walletAddress: string, platform: string): Promise<Integration | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM integrations WHERE wallet_address = ? AND platform = ?",
    args: [walletAddress, platform],
  });
  return result.rows[0] as Integration | null;
}

// Get all integrations for user
export async function getIntegrations(walletAddress: string): Promise<Integration[]> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM integrations WHERE wallet_address = ?",
    args: [walletAddress],
  });
  return result.rows as Integration[];
}

// Delete integration
export async function deleteIntegration(walletAddress: string, platform: string): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: "DELETE FROM integrations WHERE wallet_address = ? AND platform = ?",
    args: [walletAddress, platform],
  });
}

// Save settings
export async function saveSettings(walletAddress: string, settings: {
  language?: string;
  currency?: string;
  theme?: string;
  notifications?: string;
}): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `INSERT OR REPLACE INTO settings (wallet_address, language, currency, theme, notifications)
          VALUES (?, ?, ?, ?, ?)`,
    args: [
      walletAddress,
      settings.language || "en",
      settings.currency || "usd",
      settings.theme || "dark",
      settings.notifications || "{}",
    ],
  });
}

// Get settings
export async function getSettings(walletAddress: string): Promise<any | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM settings WHERE wallet_address = ?",
    args: [walletAddress],
  });
  return result.rows[0] || null;
}
