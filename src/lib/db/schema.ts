// Database schema and initialization for Adroit
// Uses LibSQL for storage - Turso in production, local file in development

import { createClient } from "@libsql/client";

// Use Turso in production, local file in development
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

let db: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!db) {
    db = createClient({
      url: TURSO_URL || "file:./mastra.db",
      authToken: TURSO_AUTH_TOKEN,
    });
  }
  return db;
}

// Initialize database schema
export async function initDatabase() {
  const client = getDb();

  // Migration: Drop old tables if they exist (without wallet_id)
  // This ensures the schema is up to date
  try {
    await client.execute("DROP TABLE IF EXISTS onboarding");
    await client.execute("DROP TABLE IF EXISTS integrations");
    await client.execute("DROP TABLE IF EXISTS settings");
    await client.execute("DROP TABLE IF EXISTS campaigns");
    await client.execute("DROP TABLE IF EXISTS users");
  } catch (e) {
    // Ignore errors if tables don't exist
  }

  // Users table - wallet address and wallet_id are the user identifiers
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      wallet_address TEXT PRIMARY KEY,
      wallet_id TEXT,
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
      wallet_id TEXT,
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
      wallet_id TEXT,
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
      wallet_id TEXT,
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
      wallet_id TEXT,
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
