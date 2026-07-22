import { describe, it, expect, vi, beforeEach } from "vitest";
import { arcWalletTool } from "../../src/mastra/tools/arc-wallet";

describe("arcWalletTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct tool definition", () => {
    expect(arcWalletTool.id).toBe("arc-wallet");
    expect(arcWalletTool.description).toBeDefined();
  });

  it("should validate input schema for get-balance", () => {
    const validInput = { action: "get-balance", walletId: "wallet-123" };
    const result = arcWalletTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for send-payment", () => {
    const validInput = {
      action: "send-payment",
      walletId: "wallet-123",
      toAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      amount: 100,
    };
    const result = arcWalletTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for get-transaction-history", () => {
    const validInput = { action: "get-transaction-history", txId: "tx-123" };
    const result = arcWalletTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should validate input schema for create-wallet", () => {
    const validInput = { action: "create-wallet" };
    const result = arcWalletTool.inputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject invalid action", () => {
    const invalidInput = { action: "invalid-action" };
    const result = arcWalletTool.inputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should execute get-balance in mock mode", async () => {
    const result = await arcWalletTool.execute({
      action: "get-balance",
      walletId: "wallet-123",
    });

    expect(result.success).toBe(true);
    expect(result.data?.balances).toBeDefined();
    expect(result.data?.usdcBalance).toBeDefined();
    expect(result.mockMode).toBe(true);
  });

  it("should execute send-payment in mock mode", async () => {
    const result = await arcWalletTool.execute({
      action: "send-payment",
      walletId: "wallet-123",
      toAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      amount: 50,
    });

    expect(result.success).toBe(true);
    expect(result.data?.transactionId).toBeDefined();
    expect(result.data?.status).toBe("INITIATED");
    expect(result.mockMode).toBe(true);
  });

  it("should execute get-transaction-history in mock mode", async () => {
    const result = await arcWalletTool.execute({
      action: "get-transaction-history",
      txId: "tx-123",
    });

    expect(result.success).toBe(true);
    expect(result.data?.state).toBe("COMPLETE");
    expect(result.data?.txHash).toBeDefined();
    expect(result.mockMode).toBe(true);
  });

  it("should execute create-wallet in mock mode", async () => {
    const result = await arcWalletTool.execute({
      action: "create-wallet",
    });

    expect(result.success).toBe(true);
    expect(result.data?.walletId).toBeDefined();
    expect(result.data?.address).toBeDefined();
    expect(result.data?.blockchain).toBe("ARC-TESTNET");
    expect(result.mockMode).toBe(true);
  });
});
