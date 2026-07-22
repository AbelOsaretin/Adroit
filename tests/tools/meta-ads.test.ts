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
