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
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    expect(recommendation.id).toBeDefined();
    expect(recommendation.status).toBe("pending");
  });
});
