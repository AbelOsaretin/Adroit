// Database schema and initialization for Adroit
// Uses LibSQL for storage

import { createClient } from "@libsql/client";

// Use file-based storage for LibSQL (not postgresql)
const DB_URL = "file:./mastra.db";

let db: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!db) {
    db = createClient({
      url: DB_URL,
    });
  }
  return db;
}

// Initialize database schema
export async function initDatabase() {
  const client = getDb();

  // Users table - wallet address is the primary key
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      wallet_address TEXT PRIMARY KEY,
      user_id TEXT,
      circle_user_id TEXT,
      email TEXT,
      name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT DEFAULT (datetime('now'))
    )
  `);

  // Onboarding data
  await client.execute(`
    CREATE TABLE IF NOT EXISTS onboarding (
      wallet_address TEXT PRIMARY KEY,
      company_name TEXT,
      industry TEXT,
      website TEXT,
      company_size TEXT,
      marketing_channels TEXT,
      monthly_budget TEXT,
      goals TEXT,
      target_audience TEXT,
      pain_points TEXT,
      competitors TEXT,
      brand_primary_color TEXT,
      brand_secondary_color TEXT,
      brand_voice TEXT,
      instagram TEXT,
      facebook TEXT,
      twitter TEXT,
      linkedin TEXT,
      tiktok TEXT,
      completed_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Integrations (Meta, Google, etc.)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS integrations (
      wallet_address TEXT NOT NULL,
      platform TEXT NOT NULL,
      access_token TEXT,
      account_id TEXT,
      account_name TEXT,
      connected_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (wallet_address, platform)
    )
  `);

  // Settings
  await client.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      wallet_address TEXT PRIMARY KEY,
      language TEXT DEFAULT 'en',
      currency TEXT DEFAULT 'usd',
      theme TEXT DEFAULT 'dark',
      notifications TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Campaigns cache
  await client.execute(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      wallet_address TEXT NOT NULL,
      platform TEXT NOT NULL,
      campaign_id TEXT,
      name TEXT,
      status TEXT,
      objective TEXT,
      daily_budget REAL,
      synced_at TEXT DEFAULT (datetime('now'))
    )
  `);

  console.log("Database initialized successfully");
}
