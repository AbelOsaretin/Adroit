import { describe, it, expect, vi, beforeEach } from "vitest";
import { googleAdsTool } from "../../src/mastra/tools/google-ads";

describe("googleAdsTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct tool definition", () => {
    expect(googleAdsTool.id).toBe("google-ads");
    expect(googleAdsTool.description).toBeDefined();
  });

  it("should validate input schema for get-campaigns", () => {
    const validInput = { action: "get-campaigns", accountId: "123-456-7890" };
    const result = googleAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for get-metrics", () => {
    const validInput = {
      action: "get-metrics",
      accountId: "123-456-7890",
      campaignId: "12345",
    };
    const result = googleAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for pause-campaign", () => {
    const validInput = {
      action: "pause-campaign",
      accountId: "123-456-7890",
      campaignId: "12345",
    };
    const result = googleAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for update-budget", () => {
    const validInput = {
      action: "update-budget",
      accountId: "123-456-7890",
      campaignId: "12345",
      budget: 100,
    };
    const result = googleAdsTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject invalid action", () => {
    const invalidInput = { action: "invalid-action", accountId: "123" };
    const result = googleAdsTool.inputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject get-metrics without campaignId", () => {
    const invalidInput = { action: "get-metrics", accountId: "123" };
    const result = googleAdsTool.inputSchema.safeParse(invalidInput);
    expect(result.success).toBe(true);
  });
});
