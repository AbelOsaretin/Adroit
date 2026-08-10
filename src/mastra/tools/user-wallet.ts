// User-Controlled Wallets Tool
// Mastra tool for Circle User-Controlled Wallets with Social Login

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const isMockMode = !process.env.CIRCLE_API_KEY;

export const userWalletTool = createTool({
  id: "user-wallet",
  description: isMockMode
    ? "Manage user wallets with social login (MOCK MODE)"
    : "Manage user wallets with social login - create wallets, check balances, send transactions",
  inputSchema: z.object({
    action: z.enum([
      "create-user",
      "create-wallet",
      "list-wallets",
      "get-balance",
      "send-transaction",
      "get-transaction-status",
    ]),
    userId: z.string().optional().describe("User ID for wallet operations"),
    walletId: z.string().optional().describe("Wallet ID for balance/transactions"),
    toAddress: z.string().optional().describe("Recipient address for transactions"),
    amount: z.number().optional().describe("Amount in USDC"),
    tokenAddress: z.string().optional().describe("Token contract address"),
    transactionId: z.string().optional().describe("Transaction ID for status check"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    mockMode: z.boolean().optional(),
  }),
  execute: async (inputData) => {
    const { action, userId, walletId, toAddress, amount, tokenAddress, transactionId } = inputData;

    if (isMockMode) {
      return handleMockAction(action, userId, walletId, toAddress, amount, transactionId);
    }

    try {
      // Map tool actions to API actions (kebab-case to camelCase)
      const actionMap: Record<string, string> = {
        'create-user': 'initializeUser',
        'create-wallet': 'createWallet',
        'list-wallets': 'listWallets',
        'get-balance': 'getTokenBalance',
        'send-transaction': 'sendPayment',
        'get-transaction-status': 'getTokenBalance',
      };

      const apiAction = actionMap[action] || action;

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: apiAction,
          userId,
          walletId,
          toAddress,
          amount,
          tokenAddress,
          transactionId,
          userToken: params.userToken,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

function handleMockAction(
  action: string,
  userId?: string,
  walletId?: string,
  toAddress?: string,
  amount?: number,
  transactionId?: string,
) {
  const mockUserId = userId || `mock-user-${Date.now()}`;

  switch (action) {
    case 'create-user':
      return {
        success: true,
        data: {
          userId: mockUserId,
          status: 'created',
        },
        mockMode: true,
      };

    case 'create-wallet':
      return {
        success: true,
        data: {
          walletId: `wallet-${Date.now()}`,
          address: `0x${Date.now().toString(16).padStart(40, '0')}`,
          blockchain: 'ETH-SEPOLIA',
        },
        mockMode: true,
      };

    case 'list-wallets':
      return {
        success: true,
        data: {
          wallets: [
            {
              id: 'mock-wallet-1',
              address: '0x1234567890abcdef1234567890abcdef12345678',
              blockchain: 'ETH-SEPOLIA',
              accountType: 'EOA',
            },
          ],
        },
        mockMode: true,
      };

    case 'get-balance':
      return {
        success: true,
        data: {
          balances: [
            { symbol: 'USDC', amount: '1250.50' },
            { symbol: 'ETH', amount: '0.5' },
          ],
        },
        mockMode: true,
      };

    case 'send-transaction':
      return {
        success: true,
        data: {
          transactionId: `tx-${Date.now()}`,
          from: walletId || 'mock-wallet-1',
          to: toAddress,
          amount: amount || 100,
          status: 'INITIATED',
        },
        mockMode: true,
      };

    case 'get-transaction-status':
      return {
        success: true,
        data: {
          transactionId: transactionId || `tx-${Date.now()}`,
          status: 'COMPLETE',
          confirmations: 12,
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
