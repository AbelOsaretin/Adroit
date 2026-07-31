import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const isMockMode = !process.env.CIRCLE_API_KEY || !process.env.ENTITY_SECRET;

async function getCircleClient() {
  const { initiateDeveloperControlledWalletsClient } = await import(
    "@circle-fin/developer-controlled-wallets"
  );

  const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
    entitySecret: process.env.ENTITY_SECRET!,
  });

  return client;
}

export const arcWalletTool = createTool({
  id: "arc-wallet",
  description: isMockMode
    ? "Manage USDC wallet on Arc blockchain (MOCK MODE - no credentials)"
    : "Manage USDC wallet on Arc blockchain for marketing payments",
  inputSchema: z.object({
    action: z.enum([
      "get-balance",
      "send-payment",
      "get-transaction-history",
      "create-wallet",
    ]),
    walletId: z.string().optional().describe("Wallet ID for balance/history"),
    address: z.string().optional().describe("Wallet address"),
    toAddress: z.string().optional().describe("Recipient address for payments"),
    amount: z.number().optional().describe("Amount in USDC"),
    transactionId: z
      .string()
      .optional()
      .describe("Transaction UUID for status check (not tx hash)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    mockMode: z.boolean().optional(),
  }),
  execute: async (inputData) => {
    const { action, walletId, address, toAddress, amount, transactionId } =
      inputData;

    if (isMockMode) {
      return handleMockAction(
        action,
        walletId,
        address,
        toAddress,
        amount,
        transactionId,
      );
    }

    try {
      const client = await getCircleClient();

      switch (action) {
        case "get-balance": {
          if (!walletId) {
            return {
              success: false,
              error: "walletId is required for get-balance",
            };
          }

          const balanceResponse = await client.getWalletTokenBalance({
            id: walletId,
          });

          const tokenBalances = balanceResponse.data?.tokenBalances ?? [];
          const usdcBalance = tokenBalances.find(
            (t) => t.token?.symbol === "USDC",
          );

          return {
            success: true,
            data: {
              walletId,
              balances: tokenBalances.map((t) => ({
                symbol: t.token?.symbol,
                amount: t.amount,
                tokenAddress: t.token?.tokenAddress,
                date: t.updateDate,
              })),
              usdcBalance: usdcBalance?.amount || "0",
            },
          };
        }

        case "send-payment": {
          if (!walletId || !toAddress || !amount) {
            return {
              success: false,
              error: "walletId, toAddress, and amount are required",
            };
          }

          const usdcTokenAddress = "0x3600000000000000000000000000000000000000";
          const idempotencyKey = crypto.randomUUID();

          const transferResponse = await client.createTransaction({
            idempotencyKey,
            walletId,
            tokenAddress: usdcTokenAddress,
            blockchain: "ARC-TESTNET" as any,
            destinationAddress: toAddress,
            amount: [amount.toString()],
            fee: {
              type: "level",
              config: {
                feeLevel: "MEDIUM",
              },
            },
          });

          const transactionId = transferResponse.data?.id;

          return {
            success: true,
            data: {
              transactionId,
              from: walletId,
              to: toAddress,
              amount,
              status: "INITIATED",
              explorerUrl: `https://testnet.arcscan.app/tx/${transactionId}`,
            },
          };
        }

        case "get-transaction-history": {
          if (!transactionId) {
            return {
              success: false,
              error: "transactionId is required (UUID format, not tx hash)",
            };
          }

          const txResponse = await client.getTransaction({
            id: transactionId,
          });

          const tx = txResponse.data?.transaction;

          return {
            success: true,
            data: {
              transactionId: tx?.id,
              state: tx?.state,
              txHash: tx?.txHash,
              from: tx?.sourceAddress,
              to: tx?.destinationAddress,
              amount: tx?.amounts?.[0],
              createdAt: tx?.createDate,
              updatedAt: tx?.updateDate,
            },
          };
        }

        case "create-wallet": {
          const walletSetResponse = await client.createWalletSet({
            name: `Marketing-Agent-${Date.now()}`,
          });

          const walletSetId = walletSetResponse.data?.walletSet?.id;

          if (!walletSetId) {
            return { success: false, error: "Failed to create wallet set" };
          }

          const walletResponse = await client.createWallets({
            walletSetId,
            blockchains: ["ARC-TESTNET"],
            count: 1,
            accountType: "EOA",
          });

          const wallet = walletResponse.data?.wallets?.[0];

          return {
            success: true,
            data: {
              walletId: wallet?.id,
              address: wallet?.address,
              blockchain: wallet?.blockchain,
              walletSetId,
              explorerUrl: `https://testnet.arcscan.app/address/${wallet?.address}`,
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

function handleMockAction(
  action: string,
  walletId?: string,
  address?: string,
  toAddress?: string,
  amount?: number,
  transactionId?: string,
) {
  switch (action) {
    case "get-balance":
      return {
        success: true,
        data: {
          walletId: walletId || "mock-wallet-123",
          balances: [
            {
              symbol: "USDC",
              amount: "1250.50",
              tokenAddress: "0x3600000000000000000000000000000000000000",
            },
          ],
          usdcBalance: "1250.50",
        },
        mockMode: true,
      };

    case "send-payment":
      const mockTxId = `tx-${Date.now()}`;
      return {
        success: true,
        data: {
          transactionId: mockTxId,
          from: walletId || "mock-wallet-123",
          to: toAddress,
          amount: amount || 100,
          status: "INITIATED",
          explorerUrl: `https://testnet.arcscan.app/tx/${mockTxId}`,
        },
        mockMode: true,
      };

    case "get-transaction-history":
      return {
        success: true,
        data: {
          transactionId: transactionId || `tx-${Date.now()}`,
          state: "COMPLETE",
          txHash: `0x${Date.now().toString(16)}`,
          from: "0x1234567890abcdef1234567890abcdef12345678",
          to: "0xabcdef1234567890abcdef1234567890abcdef12",
          amount: "50.00",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        mockMode: true,
      };

    case "create-wallet":
      const mockAddress = `0x${Date.now().toString(16).padStart(40, "0")}`;
      return {
        success: true,
        data: {
          walletId: `wallet-${Date.now()}`,
          address: mockAddress,
          blockchain: "ARC-TESTNET",
          walletSetId: `ws-${Date.now()}`,
          explorerUrl: `https://testnet.arcscan.app/address/${mockAddress}`,
        },
        mockMode: true,
      };

    default:
      return {
        success: false,
        error: `Unknown action: ${action}`,
        mockMode: true,
      };
  }
}
