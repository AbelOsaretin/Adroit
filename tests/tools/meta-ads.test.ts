import { describe, it, expect, vi, beforeEach } from "vitest";
import { metaAdsTool } from "../../src/mastra/tools/meta-ads";

describe("metaAdsTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct tool definition", () => {
    expect(metaAdsTool.id).toBe("meta-ads");
    expect(metaAdsTool.description).toBeDefined();
  });

  it("should validate input schema for get-campaigns", () => {
    const validInput = { action: "get-campaigns", accountId: "act_12345678" };
    const result = metaAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for get-metrics", () => {
    const validInput = {
      action: "get-metrics",
      accountId: "act_12345678",
      campaignId: "23850123456789012",
    };
    const result = metaAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for pause-campaign", () => {
    const validInput = {
      action: "pause-campaign",
      accountId: "act_12345678",
      campaignId: "23850123456789012",
    };
    const result = metaAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for update-budget", () => {
    const validInput = {
      action: "update-budget",
      accountId: "act_12345678",
      campaignId: "23850123456789012",
      budget: 100,
    };
    const result = metaAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for create-campaign", () => {
    const validInput = {
      action: "create-campaign",
      accountId: "act_12345678",
      name: "Test Campaign",
      objective: "CONVERSIONS",
      budget: 50,
    };
    const result = metaAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject invalid action", () => {
    const invalidInput = { action: "invalid-action", accountId: "act_123" };
    const result = metaAdsTool.inputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should execute get-campaigns", async () => {
    const result = await metaAdsTool.execute({
      action: "get-campaigns",
      accountId: "act_12345678",
    });

    expect(result.success).toBe(true);
    expect(result.data?.campaigns).toBeDefined();
    expect(Array.isArray(result.data?.campaigns)).toBe(true);
  });

  it("should execute get-metrics", async () => {
    const result = await metaAdsTool.execute({
      action: "get-metrics",
      accountId: "act_12345678",
      campaignId: "23850123456789012",
    });

    expect(result.success).toBe(true);
    expect(result.data?.metrics).toBeDefined();
  });

  it("should execute pause-campaign", async () => {
    const result = await metaAdsTool.execute({
      action: "pause-campaign",
      accountId: "act_12345678",
      campaignId: "23850123456789012",
    });

    expect(result.success).toBe(true);
    expect(result.data?.paused).toBe("23850123456789012");
  });

  it("should execute update-budget", async () => {
    const result = await metaAdsTool.execute({
      action: "update-budget",
      accountId: "act_12345678",
      campaignId: "23850123456789012",
      budget: 200,
    });

    expect(result.success).toBe(true);
    expect(result.data?.updated).toBe("23850123456789012");
    expect(result.data?.newBudget).toBe(200);
  });

  it("should execute create-campaign", async () => {
    const result = await metaAdsTool.execute({
      action: "create-campaign",
      accountId: "act_12345678",
      name: "New Test Campaign",
      objective: "TRAFFIC",
      budget: 75,
    });

    expect(result.success).toBe(true);
    expect(result.data?.campaignId).toBeDefined();
    expect(result.data?.name).toBe("New Test Campaign");
    expect(result.data?.objective).toBe("TRAFFIC");
    expect(result.data?.dailyBudget).toBe(75);
  });
});
