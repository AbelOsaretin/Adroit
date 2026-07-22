import { describe, it, expect } from "vitest";
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
