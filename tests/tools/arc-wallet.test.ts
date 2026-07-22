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
