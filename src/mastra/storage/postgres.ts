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
