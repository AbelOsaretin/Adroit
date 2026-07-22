import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyticsTool } from "../../src/mastra/tools/analytics";

describe("analyticsTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct tool definition", () => {
    expect(analyticsTool.id).toBe("analytics");
    expect(analyticsTool.description).toBeDefined();
  });

  it("should validate input schema for aggregate-metrics", () => {
    const validInput = {
      action: "aggregate-metrics",
      campaigns: [{ metrics: { spend: 100, impressions: 1000, clicks: 50, conversions: 5 } }],
    };
    const result = analyticsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for detect-anomalies", () => {
    const validInput = {
      action: "detect-anomalies",
      campaigns: [{ id: "1", name: "Test", metrics: { ctr: 0.005, cpc: 0.5 } }],
    };
    const result = analyticsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for calculate-roas", () => {
    const validInput = {
      action: "calculate-roas",
      campaigns: [{ metrics: { spend: 100, conversions: 10, conversionsValue: 500 } }],
    };
    const result = analyticsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for compare-periods", () => {
    const validInput = {
      action: "compare-periods",
      campaigns: [],
      currentPeriod: { spend: 200, impressions: 2000, clicks: 100, conversions: 10 },
      previousPeriod: { spend: 100, impressions: 1000, clicks: 50, conversions: 5 },
    };
    const result = analyticsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject invalid action", () => {
    const invalidInput = { action: "invalid-action", campaigns: [] };
    const result = analyticsTool.inputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should execute aggregate-metrics", async () => {
    const result = await analyticsTool.execute({
      action: "aggregate-metrics",
      campaigns: [
        { metrics: { spend: 100, impressions: 1000, clicks: 50, conversions: 5 } },
        { metrics: { spend: 200, impressions: 2000, clicks: 100, conversions: 10 } },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.data?.totals).toBeDefined();
    expect(result.data?.totals.spend).toBe(300);
    expect(result.data?.totals.impressions).toBe(3000);
    expect(result.data?.totals.clicks).toBe(150);
    expect(result.data?.totals.conversions).toBe(15);
    expect(result.data?.ctr).toBe(0.05);
    expect(result.data?.cpc).toBe(2);
  });

  it("should execute detect-anomalies", async () => {
    const result = await analyticsTool.execute({
      action: "detect-anomalies",
      campaigns: [
        { id: "1", name: "Good Campaign", metrics: { ctr: 0.05, cpc: 0.5 } },
        { id: "2", name: "Bad CTR Campaign", metrics: { ctr: 0.005, cpc: 0.5 } },
        { id: "3", name: "High CPC Campaign", metrics: { ctr: 0.05, cpc: 10 } },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.data?.anomalies).toHaveLength(2);
    expect(result.data?.count).toBe(2);
  });

  it("should execute calculate-roas", async () => {
    const result = await analyticsTool.execute({
      action: "calculate-roas",
      campaigns: [
        { metrics: { spend: 100, conversions: 10, conversionsValue: 500 } },
        { metrics: { spend: 200, conversions: 20, conversionsValue: 1000 } },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.data?.roas).toBe(5);
    expect(result.data?.totalRevenue).toBe(1500);
    expect(result.data?.totalSpend).toBe(300);
  });

  it("should execute compare-periods", async () => {
    const result = await analyticsTool.execute({
      action: "compare-periods",
      campaigns: [],
      currentPeriod: { spend: 200, impressions: 2000, clicks: 100, conversions: 10 },
      previousPeriod: { spend: 100, impressions: 1000, clicks: 50, conversions: 5 },
    });

    expect(result.success).toBe(true);
    expect(result.data?.spendChange).toBe(100);
    expect(result.data?.impressionsChange).toBe(100);
    expect(result.data?.clicksChange).toBe(100);
    expect(result.data?.conversionsChange).toBe(100);
  });

  it("should return error for compare-periods without periods", async () => {
    const result = await analyticsTool.execute({
      action: "compare-periods",
      campaigns: [],
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("required");
  });

  it("should return error for missing campaigns", async () => {
    const result = await analyticsTool.execute({
      action: "aggregate-metrics",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("campaigns");
  });
});
