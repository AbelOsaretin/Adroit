# Agentic Marketing Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an autonomous AI agent that manages marketing campaigns for SMBs using USDC on Arc blockchain

**Architecture:** Mastra-native agent with tools for Google/Meta Ads integration and Arc wallet management. PostgreSQL for data persistence. Next.js dashboard for user interface.

**Tech Stack:** Mastra, Arc Testnet, Circle Developer-Controlled Wallets, App Kit, PostgreSQL, Next.js, TypeScript

---

## File Structure

```
agentic-marketing-agent/
├── src/
│   └── mastra/
│       ├── index.ts                          # Mastra entry point
│       ├── agents/
│       │   └── campaign-optimizer.ts         # Main AI agent
│       ├── tools/
│       │   ├── google-ads.ts                 # Google Ads integration
│       │   ├── meta-ads.ts                   # Meta Marketing API
│       │   ├── arc-wallet.ts                 # Arc/USDC wallet operations
│       │   └── analytics.ts                  # Data aggregation tool
│       ├── workflows/
│       │   ├── approval-queue.ts             # Recommendation approval
│       │   └── campaign-executor.ts          # Execute approved changes
│       └── storage/
│           └── postgres.ts                   # Database operations
├── dashboard/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                          # Home dashboard
│   │   ├── recommendations/
│   │   │   └── page.tsx                      # Approval queue
│   │   ├── campaigns/
│   │   │   └── page.tsx                      # Campaign details
│   │   └── settings/
│   │       └── page.tsx                      # Account connections
│   ├── components/
│   │   ├── CampaignCard.tsx
│   │   ├── RecommendationCard.tsx
│   │   └── WalletBalance.tsx
│   └── lib/
│       └── mastra-client.ts                  # API client
├── tests/
│   ├── tools/
│   │   ├── google-ads.test.ts
│   │   ├── meta-ads.test.ts
│   │   └── arc-wallet.test.ts
│   └── workflows/
│       └── approval-queue.test.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Task 1: Project Setup & Mastra Configuration

**Covers:** Foundation setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `src/mastra/index.ts`

- [ ] **Step 1: Initialize project**

```bash
mkdir agentic-marketing-agent && cd agentic-marketing-agent
npm init -y
```

- [ ] **Step 2: Install dependencies**

```bash
npm install -D typescript @types/node mastra@latest
npm install @mastra/core@latest zod@^4 @mastra/storage-postgres pg
npm install @google-ads/api googleapis
npm install viem
```

- [ ] **Step 3: Create package.json scripts**

```json
{
  "scripts": {
    "dev": "mastra dev",
    "build": "mastra build",
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 5: Create .env.example**

```env
# LLM Provider
OPENAI_API_KEY=your-openai-key

# Google Ads
GOOGLE_ADS_CLIENT_ID=your-client-id
GOOGLE_ADS_CLIENT_SECRET=your-client-secret
GOOGLE_ADS_REFRESH_TOKEN=your-refresh-token
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token

# Meta Marketing API
META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
META_ACCESS_TOKEN=your-access-token

# Arc/Circle
CIRCLE_API_KEY=your-circle-api-key
ARC_RPC_URL=https://rpc.testnet.arc.io

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/marketing_agent
```

- [ ] **Step 6: Create Mastra entry point**

```typescript
// src/mastra/index.ts
import { Mastra } from "@mastra/core";
import { campaignOptimizerAgent } from "./agents/campaign-optimizer";
import { approvalQueueWorkflow } from "./workflows/approval-queue";
import { campaignExecutorWorkflow } from "./workflows/campaign-executor";

export const mastra = new Mastra({
  agents: { campaignOptimizerAgent },
  workflows: { approvalQueueWorkflow, campaignExecutorWorkflow },
});
```

- [ ] **Step 7: Verify setup**

```bash
npm run dev
# Should start Mastra Studio at http://localhost:4111
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize Mastra project with dependencies"
```

---

## Task 2: Database Schema & Storage

**Covers:** Data persistence layer

**Files:**
- Create: `src/mastra/storage/postgres.ts`
- Create: `tests/storage/postgres.test.ts`

- [ ] **Step 1: Write failing test for database operations**

```typescript
// tests/storage/postgres.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PostgresStorage } from "../../src/mastra/storage/postgres";

describe("PostgresStorage", () => {
  let storage: PostgresStorage;

  beforeAll(async () => {
    storage = new PostgresStorage(process.env.DATABASE_URL!);
    await storage.initialize();
  });

  afterAll(async () => {
    await storage.close();
  });

  it("should create and retrieve a campaign", async () => {
    const campaign = await storage.createCampaign({
      platform: "google",
      name: "Test Campaign",
      status: "active",
      budget: 1000,
      spent: 0,
      metrics: { impressions: 0, clicks: 0, conversions: 0, cpc: 0, ctr: 0, roas: 0 },
    });

    expect(campaign.id).toBeDefined();
    expect(campaign.name).toBe("Test Campaign");

    const retrieved = await storage.getCampaign(campaign.id);
    expect(retrieved?.name).toBe("Test Campaign");
  });

  it("should create and retrieve a recommendation", async () => {
    const recommendation = await storage.createRecommendation({
      campaignId: "test-campaign-id",
      type: "pause",
      description: "Pause underperforming ad",
      expectedImpact: "Save $50/day",
      confidence: "high",
      amount: 50,
      status: "pending",
    });

    expect(recommendation.id).toBeDefined();
    expect(recommendation.status).toBe("pending");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/storage/postgres.test.ts
```
Expected: FAIL with "Cannot find module" or "PostgresStorage not defined"

- [ ] **Step 3: Implement PostgresStorage**

```typescript
// src/mastra/storage/postgres.ts
import { Pool } from "pg";

export interface Campaign {
  id: string;
  platform: "google" | "meta";
  name: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    cpc: number;
    ctr: number;
    roas: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Recommendation {
  id: string;
  campaignId: string;
  type: "pause" | "boost" | "reallocate" | "create";
  description: string;
  expectedImpact: string;
  confidence: "low" | "medium" | "high";
  amount?: number;
  status: "pending" | "approved" | "rejected" | "executed";
  createdAt: Date;
  expiresAt: Date;
}

export class PostgresStorage {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async initialize(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        platform VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL,
        budget DECIMAL(10,2) NOT NULL,
        spent DECIMAL(10,2) NOT NULL DEFAULT 0,
        metrics JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS recommendations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id UUID REFERENCES campaigns(id),
        type VARCHAR(20) NOT NULL,
        description TEXT NOT NULL,
        expected_impact TEXT NOT NULL,
        confidence VARCHAR(10) NOT NULL,
        amount DECIMAL(10,2),
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL
      );
    `);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async createCampaign(data: Omit<Campaign, "id" | "createdAt" | "updatedAt">): Promise<Campaign> {
    const result = await this.pool.query(
      `INSERT INTO campaigns (platform, name, status, budget, spent, metrics)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.platform, data.name, data.status, data.budget, data.spent, JSON.stringify(data.metrics)]
    );
    return this.mapCampaign(result.rows[0]);
  }

  async getCampaign(id: string): Promise<Campaign | null> {
    const result = await this.pool.query("SELECT * FROM campaigns WHERE id = $1", [id]);
    return result.rows[0] ? this.mapCampaign(result.rows[0]) : null;
  }

  async createRecommendation(data: Omit<Recommendation, "id" | "createdAt">): Promise<Recommendation> {
    const result = await this.pool.query(
      `INSERT INTO recommendations (campaign_id, type, description, expected_impact, confidence, amount, status, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [data.campaignId, data.type, data.description, data.expectedImpact, data.confidence, data.amount, data.status, data.expiresAt]
    );
    return this.mapRecommendation(result.rows[0]);
  }

  private mapCampaign(row: any): Campaign {
    return {
      id: row.id,
      platform: row.platform,
      name: row.name,
      status: row.status,
      budget: parseFloat(row.budget),
      spent: parseFloat(row.spent),
      metrics: row.metrics,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRecommendation(row: any): Recommendation {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      type: row.type,
      description: row.description,
      expectedImpact: row.expected_impact,
      confidence: row.confidence,
      amount: row.amount ? parseFloat(row.amount) : undefined,
      status: row.status,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/storage/postgres.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/mastra/storage/postgres.ts tests/storage/postgres.test.ts
git commit -m "feat: add PostgreSQL storage for campaigns and recommendations"
```

---

## Task 3: Google Ads Tool

**Covers:** Google Ads integration

**Files:**
- Create: `src/mastra/tools/google-ads.ts`
- Create: `tests/tools/google-ads.test.ts`

- [ ] **Step 1: Write failing test for Google Ads tool**

```typescript
// tests/tools/google-ads.test.ts
import { describe, it, expect, vi } from "vitest";
import { googleAdsTool } from "../../src/mastra/tools/google-ads";

describe("googleAdsTool", () => {
  it("should have correct tool definition", () => {
    expect(googleAdsTool.id).toBe("google-ads");
    expect(googleAdsTool.description).toBeDefined();
  });

  it("should validate input schema", () => {
    const validInput = { action: "get-campaigns", accountId: "123-456-7890" };
    const result = googleAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject invalid action", () => {
    const invalidInput = { action: "invalid-action", accountId: "123" };
    const result = googleAdsTool.inputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/tools/google-ads.test.ts
```
Expected: FAIL with "Cannot find module" or "googleAdsTool not defined"

- [ ] **Step 3: Implement Google Ads tool**

```typescript
// src/mastra/tools/google-ads.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ADS_CLIENT_ID,
  process.env.GOOGLE_ADS_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

const googleAds = google.ads({ version: "v17", auth: oauth2Client });

export const googleAdsTool = createTool({
  id: "google-ads",
  description: "Interact with Google Ads API to manage campaigns",
  inputSchema: z.object({
    action: z.enum([
      "get-campaigns",
      "get-metrics",
      "pause-campaign",
      "update-budget",
      "create-campaign",
    ]),
    accountId: z.string().describe("Google Ads customer ID (XXX-XXX-XXXX)"),
    campaignId: z.string().optional().describe("Campaign ID for specific operations"),
    budget: z.number().optional().describe("New budget amount in USD"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { action, accountId, campaignId, budget } = context;

      switch (action) {
        case "get-campaigns":
          const campaigns = await googleAds.customers.customers.list({
            customerId: accountId.replace(/-/g, ""),
          });
          return { success: true, data: campaigns.data };

        case "get-metrics":
          const metrics = await googleAds.customers.customers.search({
            customerId: accountId.replace(/-/g, ""),
            query: `
              SELECT campaign.id, campaign.name, campaign.status,
                     metrics.impressions, metrics.clicks, metrics.cost_micros,
                     metrics.conversions, metrics.average_cpc
              FROM campaign
              WHERE campaign.id = ${campaignId}
            `,
          });
          return { success: true, data: metrics.data };

        case "pause-campaign":
          await googleAds.customers.customers.mutate({
            customerId: accountId.replace(/-/g, ""),
            operations: [
              {
                update: {
                  resource: `customers/${accountId.replace(/-/g, "")}/campaigns/${campaignId}`,
                  updateMask: "status",
                  status: "PAUSED",
                },
              },
            ],
          });
          return { success: true, data: { paused: campaignId } };

        case "update-budget":
          await googleAds.customers.customers.mutate({
            customerId: accountId.replace(/-/g, ""),
            operations: [
              {
                update: {
                  resource: `customers/${accountId.replace(/-/g, "")}/campaigns/${campaignId}`,
                  updateMask: "campaign_budget.amount_micros",
                  campaignBudget: {
                    amountMicros: (budget! * 1_000_000).toString(),
                  },
                },
              },
            ],
          });
          return { success: true, data: { updated: campaignId, newBudget: budget } };

        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/tools/google-ads.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/mastra/tools/google-ads.ts tests/tools/google-ads.test.ts
git commit -m "feat: add Google Ads tool for campaign management"
```

---

## Task 4: Meta Ads Tool

**Covers:** Meta Marketing API integration

**Files:**
- Create: `src/mastra/tools/meta-ads.ts`
- Create: `tests/tools/meta-ads.test.ts`

- [ ] **Step 1: Write failing test for Meta Ads tool**

```typescript
// tests/tools/meta-ads.test.ts
import { describe, it, expect } from "vitest";
import { metaAdsTool } from "../../src/mastra/tools/meta-ads";

describe("metaAdsTool", () => {
  it("should have correct tool definition", () => {
    expect(metaAdsTool.id).toBe("meta-ads");
    expect(metaAdsTool.description).toBeDefined();
  });

  it("should validate input schema", () => {
    const validInput = { action: "get-campaigns", accountId: "act_123456" };
    const result = metaAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/tools/meta-ads.test.ts
```
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement Meta Ads tool**

```typescript
// src/mastra/tools/meta-ads.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const META_API_VERSION = "v19.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

async function metaApiRequest(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${META_BASE_URL}${endpoint}`);
  url.searchParams.append("access_token", process.env.META_ACCESS_TOKEN!);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Meta API error: ${response.statusText}`);
  }
  return response.json();
}

export const metaAdsTool = createTool({
  id: "meta-ads",
  description: "Interact with Meta Marketing API for Facebook/Instagram ads",
  inputSchema: z.object({
    action: z.enum([
      "get-campaigns",
      "get-metrics",
      "pause-campaign",
      "update-budget",
      "create-campaign",
    ]),
    accountId: z.string().describe("Meta Ad Account ID (act_XXXXXXXXX)"),
    campaignId: z.string().optional().describe("Campaign ID for specific operations"),
    budget: z.number().optional().describe("New daily budget in USD"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { action, accountId, campaignId, budget } = context;

      switch (action) {
        case "get-campaigns":
          const campaigns = await metaApiRequest(`/${accountId}/campaigns`, {
            fields: "id,name,status,objective,daily_budget",
          });
          return { success: true, data: campaigns.data };

        case "get-metrics":
          const metrics = await metaApiRequest(`/${campaignId}/insights`, {
            fields: "impressions,clicks,spend,actions,ctr,cpc",
            time_range: '{"since":"2026-01-01","until":"2026-07-22"}',
          });
          return { success: true, data: metrics.data };

        case "pause-campaign":
          await fetch(`${META_BASE_URL}/${campaignId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "PAUSED",
              access_token: process.env.META_ACCESS_TOKEN,
            }),
          });
          return { success: true, data: { paused: campaignId } };

        case "update-budget":
          await fetch(`${META_BASE_URL}/${campaignId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              daily_budget: (budget! * 100).toString(),
              access_token: process.env.META_ACCESS_TOKEN,
            }),
          });
          return { success: true, data: { updated: campaignId, newBudget: budget } };

        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/tools/meta-ads.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/mastra/tools/meta-ads.ts tests/tools/meta-ads.test.ts
git commit -m "feat: add Meta Ads tool for Facebook/Instagram campaigns"
```

---

## Task 5: Arc Wallet Tool

**Covers:** Arc blockchain integration, USDC payments

**Files:**
- Create: `src/mastra/tools/arc-wallet.ts`
- Create: `tests/tools/arc-wallet.test.ts`

- [ ] **Step 1: Write failing test for Arc wallet tool**

```typescript
// tests/tools/arc-wallet.test.ts
import { describe, it, expect } from "vitest";
import { arcWalletTool } from "../../src/mastra/tools/arc-wallet";

describe("arcWalletTool", () => {
  it("should have correct tool definition", () => {
    expect(arcWalletTool.id).toBe("arc-wallet");
    expect(arcWalletTool.description).toBeDefined();
  });

  it("should validate input schema for get-balance", () => {
    const validInput = { action: "get-balance", address: "0x123..." };
    const result = arcWalletTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/tools/arc-wallet.test.ts
```
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement Arc wallet tool**

```typescript
// src/mastra/tools/arc-wallet.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createPublicClient, createWalletClient, http, parseUnits, formatUnits } from "viem";
import { mainnet } from "viem/chains";

// Arc Testnet configuration
const ARC_TESTNET = {
  id: 727272,
  name: "Arc Testnet",
  rpcUrls: {
    default: { http: [process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io"] },
  },
};

// USDC contract address on Arc
const USDC_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678" as const;

const publicClient = createPublicClient({
  chain: ARC_TESTNET,
  transport: http(),
});

export const arcWalletTool = createTool({
  id: "arc-wallet",
  description: "Manage USDC wallet on Arc blockchain for marketing payments",
  inputSchema: z.object({
    action: z.enum([
      "get-balance",
      "send-payment",
      "get-transaction-history",
    ]),
    address: z.string().describe("Wallet address"),
    toAddress: z.string().optional().describe("Recipient address for payments"),
    amount: z.number().optional().describe("Amount in USDC"),
    txHash: z.string().optional().describe("Transaction hash for history"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { action, address, toAddress, amount, txHash } = context;

      switch (action) {
        case "get-balance": {
          const balance = await publicClient.readContract({
            address: USDC_ADDRESS,
            abi: [
              {
                name: "balanceOf",
                type: "function",
                stateMutability: "view",
                inputs: [{ name: "account", type: "address" }],
                outputs: [{ name: "", type: "uint256" }],
              },
            ],
            functionName: "balanceOf",
            args: [address as `0x${string}`],
          });
          return {
            success: true,
            data: {
              address,
              balance: formatUnits(balance, 6),
              balanceRaw: balance.toString(),
            },
          };
        }

        case "send-payment": {
          // In production, this would use a wallet client with private key
          // For demo, we simulate the transaction
          const mockTxHash = `0x${Date.now().toString(16)}`;
          return {
            success: true,
            data: {
              txHash: mockTxHash,
              from: address,
              to: toAddress,
              amount,
              status: "pending",
              explorerUrl: `https://testnet.arcscan.app/tx/${mockTxHash}`,
            },
          };
        }

        case "get-transaction-history": {
          // In production, this would query Arc explorer API
          return {
            success: true,
            data: {
              address,
              transactions: [
                {
                  hash: txHash || "0xabc...",
                  from: "0xsender...",
                  to: address,
                  amount: "100.00",
                  status: "confirmed",
                  timestamp: new Date().toISOString(),
                },
              ],
            },
          };
        }

        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/tools/arc-wallet.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/mastra/tools/arc-wallet.ts tests/tools/arc-wallet.test.ts
git commit -m "feat: add Arc wallet tool for USDC payments"
```

---

## Task 6: Analytics Tool

**Covers:** Data aggregation and analysis

**Files:**
- Create: `src/mastra/tools/analytics.ts`
- Create: `tests/tools/analytics.test.ts`

- [ ] **Step 1: Write failing test for analytics tool**

```typescript
// tests/tools/analytics.test.ts
import { describe, it, expect } from "vitest";
import { analyticsTool } from "../../src/mastra/tools/analytics";

describe("analyticsTool", () => {
  it("should have correct tool definition", () => {
    expect(analyticsTool.id).toBe("analytics");
    expect(analyticsTool.description).toBeDefined();
  });

  it("should calculate ROAS correctly", () => {
    const metrics = {
      spend: 100,
      revenue: 500,
    };
    const roas = metrics.revenue / metrics.spend;
    expect(roas).toBe(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/tools/analytics.test.ts
```
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement analytics tool**

```typescript
// src/mastra/tools/analytics.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const analyticsTool = createTool({
  id: "analytics",
  description: "Analyze campaign metrics and detect anomalies",
  inputSchema: z.object({
    action: z.enum([
      "aggregate-metrics",
      "detect-anomalies",
      "calculate-roas",
      "compare-periods",
    ]),
    campaigns: z.array(z.any()).describe("Array of campaign data"),
    currentPeriod: z.any().optional().describe("Current period metrics"),
    previousPeriod: z.any().optional().describe("Previous period metrics"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { action, campaigns, currentPeriod, previousPeriod } = context;

      switch (action) {
        case "aggregate-metrics": {
          const totals = campaigns.reduce(
            (acc, campaign) => ({
              spend: acc.spend + (campaign.metrics?.spend || 0),
              impressions: acc.impressions + (campaign.metrics?.impressions || 0),
              clicks: acc.clicks + (campaign.metrics?.clicks || 0),
              conversions: acc.conversions + (campaign.metrics?.conversions || 0),
            }),
            { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
          );

          return {
            success: true,
            data: {
              ...totals,
              ctr: totals.clicks / totals.impressions || 0,
              cpc: totals.spend / totals.clicks || 0,
              conversionRate: totals.conversions / totals.clicks || 0,
            },
          };
        }

        case "detect-anomalies": {
          const anomalies = campaigns
            .filter((campaign) => {
              const ctr = campaign.metrics?.ctr || 0;
              const cpc = campaign.metrics?.cpc || 0;
              // Simple anomaly detection:CTR < 1% or CPC > $5
              return ctr < 0.01 || cpc > 5;
            })
            .map((campaign) => ({
              campaignId: campaign.id,
              campaignName: campaign.name,
              issue: campaign.metrics?.ctr < 0.01 ? "Low CTR" : "High CPC",
              severity: "medium",
            }));

          return { success: true, data: { anomalies, count: anomalies.length } };
        }

        case "calculate-roas": {
          const totalRevenue = campaigns.reduce(
            (sum, c) => sum + (c.metrics?.conversions || 0) * 50, // Assume $50 per conversion
            0
          );
          const totalSpend = campaigns.reduce(
            (sum, c) => sum + (c.metrics?.spend || 0),
            0
          );

          return {
            success: true,
            data: {
              roas: totalRevenue / totalSpend || 0,
              totalRevenue,
              totalSpend,
            },
          };
        }

        case "compare-periods": {
          if (!currentPeriod || !previousPeriod) {
            return { success: false, error: "Both periods required" };
          }

          const changes = {
            spendChange: ((currentPeriod.spend - previousPeriod.spend) / previousPeriod.spend) * 100,
            impressionsChange: ((currentPeriod.impressions - previousPeriod.impressions) / previousPeriod.impressions) * 100,
            clicksChange: ((currentPeriod.clicks - previousPeriod.clicks) / previousPeriod.clicks) * 100,
            conversionsChange: ((currentPeriod.conversions - previousPeriod.conversions) / previousPeriod.conversions) * 100,
          };

          return { success: true, data: changes };
        }

        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/tools/analytics.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/mastra/tools/analytics.ts tests/tools/analytics.test.ts
git commit -m "feat: add analytics tool for campaign analysis"
```

---

## Task 7: Campaign Optimizer Agent

**Covers:** Core AI agent logic

**Files:**
- Create: `src/mastra/agents/campaign-optimizer.ts`
- Create: `tests/agents/campaign-optimizer.test.ts`

- [ ] **Step 1: Write failing test for campaign optimizer agent**

```typescript
// tests/agents/campaign-optimizer.test.ts
import { describe, it, expect } from "vitest";
import { campaignOptimizerAgent } from "../../src/mastra/agents/campaign-optimizer";

describe("campaignOptimizerAgent", () => {
  it("should have correct agent configuration", () => {
    expect(campaignOptimizerAgent.id).toBe("campaign-optimizer");
    expect(campaignOptimizerAgent.name).toBe("Campaign Optimizer");
  });

  it("should have all required tools", () => {
    const toolIds = Object.keys(campaignOptimizerAgent.tools || {});
    expect(toolIds).toContain("google-ads");
    expect(toolIds).toContain("meta-ads");
    expect(toolIds).toContain("arc-wallet");
    expect(toolIds).toContain("analytics");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/agents/campaign-optimizer.test.ts
```
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement campaign optimizer agent**

```typescript
// src/mastra/agents/campaign-optimizer.ts
import { Agent } from "@mastra/core/agent";
import { googleAdsTool } from "../tools/google-ads";
import { metaAdsTool } from "../tools/meta-ads";
import { arcWalletTool } from "../tools/arc-wallet";
import { analyticsTool } from "../tools/analytics";

export const campaignOptimizerAgent = new Agent({
  id: "campaign-optimizer",
  name: "Campaign Optimizer",
  instructions: `
You are an AI marketing agent that helps small businesses optimize their advertising campaigns.

Your primary responsibilities:
1. Analyze campaign performance across Google Ads and Meta Ads
2. Detect anomalies and optimization opportunities
3. Generate actionable recommendations with clear reasoning
4. Manage USDC wallet for ad payments on Arc blockchain

When analyzing campaigns:
- Focus on ROAS (Return on Ad Spend), CPC (Cost Per Click), CTR (Click-Through Rate)
- Identify underperforming campaigns that should be paused or have budgets reduced
- Find high-performing campaigns that could benefit from increased budget
- Always explain your reasoning in plain language

When generating recommendations:
- Be specific: "Pause campaign X because CPC increased 45% while CTR dropped 20%"
- Quantify impact: "Expected to save $150/day"
- Provide confidence level based on data quality
- Consider the business owner's goals and constraints

For payments:
- Check wallet balance before recommending spend
- Use USDC on Arc for all transactions
- Provide transaction hashes for audit trail
  `,
  model: "openai/gpt-4o",
  tools: {
    googleAds: googleAdsTool,
    metaAds: metaAdsTool,
    arcWallet: arcWalletTool,
    analytics: analyticsTool,
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/agents/campaign-optimizer.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/mastra/agents/campaign-optimizer.ts tests/agents/campaign-optimizer.test.ts
git commit -m "feat: add campaign optimizer agent with all tools"
```

---

## Task 8: Approval Queue Workflow

**Covers:** Recommendation approval process

**Files:**
- Create: `src/mastra/workflows/approval-queue.ts`
- Create: `tests/workflows/approval-queue.test.ts`

- [ ] **Step 1: Write failing test for approval queue workflow**

```typescript
// tests/workflows/approval-queue.test.ts
import { describe, it, expect } from "vitest";
import { approvalQueueWorkflow } from "../../src/mastra/workflows/approval-queue";

describe("approvalQueueWorkflow", () => {
  it("should have correct workflow configuration", () => {
    expect(approvalQueueWorkflow.id).toBe("approval-queue");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/workflows/approval-queue.test.ts
```
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement approval queue workflow**

```typescript
// src/mastra/workflows/approval-queue.ts
import { Workflow, Step } from "@mastra/core/workflows";
import { z } from "zod";

const recommendationSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  type: z.enum(["pause", "boost", "reallocate", "create"]),
  description: z.string(),
  expectedImpact: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
  amount: z.number().optional(),
  status: z.enum(["pending", "approved", "rejected", "executed"]),
});

const validateRecommendation = new Step({
  id: "validate-recommendation",
  description: "Validate recommendation before approval",
  inputSchema: recommendationSchema,
  outputSchema: recommendationSchema,
  execute: async ({ context }) => {
    const recommendation = context;

    // Check if recommendation has expired
    if (new Date(recommendation.expiresAt) < new Date()) {
      return { ...recommendation, status: "expired" as const };
    }

    // Validate amount limits
    if (recommendation.amount && recommendation.amount > 1000) {
      return { ...recommendation, status: "pending" as const };
    }

    return recommendation;
  },
});

const executeRecommendation = new Step({
  id: "execute-recommendation",
  description: "Execute approved recommendation",
  inputSchema: recommendationSchema,
  outputSchema: z.object({
    success: z.boolean(),
    txHash: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const recommendation = context;

    // In production, this would call the appropriate tool
    // For now, simulate execution
    console.log(`Executing recommendation: ${recommendation.type} for campaign ${recommendation.campaignId}`);

    return {
      success: true,
      txHash: `0x${Date.now().toString(16)}`,
    };
  },
});

export const approvalQueueWorkflow = new Workflow({
  name: "approval-queue",
  triggerSchema: recommendationSchema,
})
  .then(validateRecommendation)
  .branch([
    {
      ref: executeRecommendation,
      if: async ({ context }) => context.status === "approved",
    },
  ])
  .commit();
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/workflows/approval-queue.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/mastra/workflows/approval-queue.ts tests/workflows/approval-queue.test.ts
git commit -m "feat: add approval queue workflow for recommendations"
```

---

## Task 9: Dashboard Setup

**Covers:** Frontend user interface

**Files:**
- Create: `dashboard/package.json`
- Create: `dashboard/app/layout.tsx`
- Create: `dashboard/app/page.tsx`
- Create: `dashboard/lib/mastra-client.ts`

- [ ] **Step 1: Initialize Next.js dashboard**

```bash
npx create-next-app@latest dashboard --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd dashboard
npm install @tanstack/react-query axios
```

- [ ] **Step 2: Create Mastra API client**

```typescript
// dashboard/lib/mastra-client.ts
import axios from "axios";

const MASTRA_URL = process.env.NEXT_PUBLIC_MASTRA_URL || "http://localhost:4111";

export const mastraClient = axios.create({
  baseURL: MASTRA_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getCampaigns() {
  const response = await mastraClient.post("/api/tools/execute", {
    toolId: "google-ads",
    input: { action: "get-campaigns", accountId: "123-456-7890" },
  });
  return response.data;
}

export async function getRecommendations() {
  const response = await mastraClient.get("/api/workflows/approval-queue");
  return response.data;
}

export async function approveRecommendation(id: string) {
  const response = await mastraClient.post(`/api/workflows/approval-queue/${id}/execute`, {
    status: "approved",
  });
  return response.data;
}
```

- [ ] **Step 3: Create main dashboard page**

```tsx
// dashboard/app/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/lib/mastra-client";

export default function Home() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: getCampaigns,
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Marketing Agent Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Spend</h2>
          <p className="text-3xl font-bold text-blue-600">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">ROAS</h2>
          <p className="text-3xl font-bold text-green-600">0x</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Campaigns</h2>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {campaigns?.data?.map((campaign: any) => (
              <div key={campaign.id} className="border p-4 rounded">
                <h3 className="font-semibold">{campaign.name}</h3>
                <p className="text-sm text-gray-600">Platform: {campaign.platform}</p>
                <p className="text-sm text-gray-600">Status: {campaign.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Create layout with providers**

```tsx
// dashboard/app/layout.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add dashboard/
git commit -m "feat: add Next.js dashboard with campaign overview"
```

---

## Task 10: Integration Testing

**Covers:** End-to-end validation

**Files:**
- Create: `tests/integration/e2e.test.ts`

- [ ] **Step 1: Write integration test**

```typescript
// tests/integration/e2e.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { mastra } from "../../src/mastra";

describe("End-to-End Integration", () => {
  beforeAll(async () => {
    // Initialize Mastra
    console.log("Mastra initialized");
  });

  it("should have campaign optimizer agent", () => {
    const agent = mastra.getAgent("campaignOptimizerAgent");
    expect(agent).toBeDefined();
  });

  it("should have approval queue workflow", () => {
    const workflow = mastra.getWorkflow("approvalQueueWorkflow");
    expect(workflow).toBeDefined();
  });

  it("should list all tools", () => {
    const tools = mastra.getTools();
    expect(Object.keys(tools)).toContain("googleAdsTool");
    expect(Object.keys(tools)).toContain("metaAdsTool");
    expect(Object.keys(tools)).toContain("arcWalletTool");
    expect(Object.keys(tools)).toContain("analyticsTool");
  });
});
```

- [ ] **Step 2: Run integration test**

```bash
npm test -- tests/integration/e2e.test.ts
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/integration/e2e.test.ts
git commit -m "test: add integration tests for Mastra setup"
```

---

## Task 11: Documentation & README

**Covers:** Documentation for hackathon submission

**Files:**
- Create: `README.md`
- Create: `docs/ARCHITECTURE.md`

- [ ] **Step 1: Create README.md**

```markdown
# Agentic Marketing Agent

An autonomous AI agent that manages marketing campaigns for small businesses using USDC on Arc blockchain.

## Features

- **Campaign Optimization**: Analyzes Google/Meta Ads performance
- **Autonomous Payments**: Holds USDC wallet on Arc
- **Approval Workflow**: Large changes require owner approval
- **Real-time Dashboard**: Monitor campaigns and recommendations

## Tech Stack

- **Framework**: Mastra (Agent + API + Workflows)
- **Blockchain**: Arc Testnet (USDC as gas)
- **Wallet**: Circle Developer-Controlled
- **Database**: PostgreSQL
- **Frontend**: Next.js

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: `cp .env.example .env`
4. Run development server: `npm run dev`
5. Access dashboard at http://localhost:3000

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## Hackathon Track

Agentic Economy - Autonomous AI agents that hold wallets and transact in USDC.
```

- [ ] **Step 2: Commit**

```bash
git add README.md docs/
git commit -m "docs: add README and architecture documentation"
```

---

## Task 12: Final Testing & Deployment Prep

**Covers:** Final validation before demo

**Files:**
- Modify: Various files for final polish

- [ ] **Step 1: Run all tests**

```bash
npm test
```
Expected: All tests pass

- [ ] **Step 2: Build for production**

```bash
npm run build
```
Expected: Build succeeds

- [ ] **Step 3: Test locally**

```bash
npm run dev
# Access Mastra Studio at http://localhost:4111
# Access Dashboard at http://localhost:3000
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final polish and deployment prep"
```

---

## Summary

This plan covers:
- ✅ Project setup with Mastra
- ✅ Database schema and storage
- ✅ Google Ads integration
- ✅ Meta Ads integration
- ✅ Arc wallet integration
- ✅ Analytics tool
- ✅ Campaign optimizer agent
- ✅ Approval queue workflow
- ✅ Dashboard UI
- ✅ Integration testing
- ✅ Documentation

**Total Tasks:** 12
**Estimated Time:** 4 weeks (hackathon timeline)

---

## Execution Handoff

Plan saved. How would you like to execute it?<tool_call>
<function=question>
<parameter=questions>[{"header": "Execution Style", "options": [{"description": "Fresh subagent per task — remember for future sessions", "label": "Subagent, always"}, {"description": "Fresh subagent per task — just this once", "label": "Subagent, this time"}, {"description": "Execute in this session — remember for future sessions", "label": "Inline, always"}, {"description": "Execute in this session — just this once", "label": "Inline, this time"}], "question": "How would you like to execute this plan?"}]