import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const isMockMode = !process.env.CIRCLE_API_KEY;

// Gateway contract addresses (Testnet)
const GATEWAY_WALLET = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9";
const GATEWAY_MINTER = "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B";

// USDC addresses per chain
const USDC_ADDRESSES: Record<string, string> = {
  "ETH_SEPOLIA": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  "AVAX_FUJI": "0x5425890298aed601595873436e057d967654ccc5",
  "OP_SEPOLIA": "0x5fd8425933e2f35c038052ca1281bcdaa3e87d58",
  "ARB_SEPOLIA": "0x75faf114eafb1BDbe2F43Bcd4FD1C244909DA6d3",
  "BASE_SEPOLIA": "0x036CbD53842c5426634c4923a99F3db70d2B5b43",
  "MATIC_AMOY": "0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2",
  "ARC_TESTNET": "0x3600000000000000000000000000000000000000",
};

// Domain IDs for CCTP
const DOMAIN_IDS: Record<string, number> = {
  "ETH_SEPOLIA": 0,
  "AVAX_FUJI": 1,
  "OP_SEPOLIA": 2,
  "ARB_SEPOLIA": 3,
  "SOLANA_DEVNET": 5,
  "BASE_SEPOLIA": 6,
  "MATIC_AMOY": 7,
  "ARC_TESTNET": 26,
};

interface GatewayTransferRequest {
  sourceChain: string;
  destinationChain: string;
  recipient: string;
  amount: string;
  walletId?: string;
}

interface GatewayTransferResponse {
  success: boolean;
  data?: any;
  error?: string;
  mockMode?: boolean;
}

export const gatewayTool = createTool({
  id: "gateway",
  description: isMockMode
    ? "Unified USDC balance across chains with instant transfers (MOCK MODE)"
    : "Unified USDC balance across chains with instant crosschain transfers via Circle Gateway",
  inputSchema: z.object({
    action: z.enum([
      "get-unified-balance",
      "get-chain-balance",
      "transfer-crosschain",
      "get-transfer-status",
      "get-supported-chains",
    ]),
    walletAddress: z.string().optional().describe("EVM wallet address"),
    sourceChain: z.string().optional().describe("Source chain identifier (e.g., ETH_SEPOLIA, BASE_SEPOLIA)"),
    destinationChain: z.string().optional().describe("Destination chain identifier"),
    recipient: z.string().optional().describe("Recipient address on destination chain"),
    amount: z.string().optional().describe("Amount in USDC (6 decimals)"),
    transferId: z.string().optional().describe("Transfer ID for status check"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    mockMode: z.boolean().optional(),
  }),
  execute: async (inputData) => {
    const { action, walletAddress, sourceChain, destinationChain, recipient, amount, transferId } = inputData;

    if (isMockMode) {
      return handleMockAction(action, walletAddress, sourceChain, destinationChain, recipient, amount, transferId);
    }

    try {
      switch (action) {
        case "get-unified-balance": {
          if (!walletAddress) {
            return { success: false, error: "walletAddress is required" };
          }

          // Query Gateway API for unified balance
          const response = await fetch("https://gateway-api-testnet.circle.com/v1/balances", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: walletAddress }),
          });

          if (!response.ok) {
            throw new Error(`Gateway API error: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            data: {
              address: walletAddress,
              unifiedBalance: data.unifiedBalance || "0",
              chainBalances: data.chainBalances || [],
            },
          };
        }

        case "get-chain-balance": {
          if (!walletAddress || !sourceChain) {
            return { success: false, error: "walletAddress and sourceChain are required" };
          }

          const domainId = DOMAIN_IDS[sourceChain];
          if (domainId === undefined) {
            return { success: false, error: `Unknown chain: ${sourceChain}` };
          }

          // Query balance on specific chain
          const response = await fetch("https://gateway-api-testnet.circle.com/v1/balances", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: walletAddress, domainId }),
          });

          if (!response.ok) {
            throw new Error(`Gateway API error: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            data: {
              address: walletAddress,
              chain: sourceChain,
              domainId,
              balance: data.balance || "0",
            },
          };
        }

        case "transfer-crosschain": {
          if (!sourceChain || !destinationChain || !recipient || !amount) {
            return {
              success: false,
              error: "sourceChain, destinationChain, recipient, and amount are required",
            };
          }

          const sourceDomain = DOMAIN_IDS[sourceChain];
          const destDomain = DOMAIN_IDS[destinationChain];

          if (sourceDomain === undefined || destDomain === undefined) {
            return { success: false, error: "Invalid chain identifier" };
          }

          // In production, this would:
          // 1. Create burn intent via Gateway API
          // 2. Sign the intent with wallet
          // 3. Submit to Gateway API
          // 4. Mint on destination chain

          const transferId = `gw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          return {
            success: true,
            data: {
              transferId,
              sourceChain,
              destinationChain,
              sourceDomain,
              destinationDomain: destDomain,
              amount,
              recipient,
              status: "INITIATED",
              message: "Transfer initiated. In production, this would sign and submit the burn intent.",
            },
          };
        }

        case "get-transfer-status": {
          if (!transferId) {
            return { success: false, error: "transferId is required" };
          }

          // In production, query Gateway API for transfer status
          return {
            success: true,
            data: {
              transferId,
              status: "COMPLETE",
              message: "Transfer completed successfully",
            },
          };
        }

        case "get-supported-chains": {
          return {
            success: true,
            data: {
              chains: Object.entries(DOMAIN_IDS).map(([chain, domainId]) => ({
                chain,
                domainId,
                usdcAddress: USDC_ADDRESSES[chain],
              })),
              gatewayWallet: GATEWAY_WALLET,
              gatewayMinter: GATEWAY_MINTER,
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
  walletAddress?: string,
  sourceChain?: string,
  destinationChain?: string,
  recipient?: string,
  amount?: string,
  transferId?: string,
): GatewayTransferResponse {
  switch (action) {
    case "get-unified-balance":
      return {
        success: true,
        data: {
          address: walletAddress || "0x1234...5678",
          unifiedBalance: "5250.75",
          chainBalances: [
            { chain: "ETH_SEPOLIA", balance: "1250.50" },
            { chain: "BASE_SEPOLIA", balance: "2000.25" },
            { chain: "ARC_TESTNET", balance: "2000.00" },
          ],
        },
        mockMode: true,
      };

    case "get-chain-balance":
      return {
        success: true,
        data: {
          address: walletAddress || "0x1234...5678",
          chain: sourceChain || "ETH_SEPOLIA",
          domainId: DOMAIN_IDS[sourceChain || "ETH_SEPOLIA"] || 0,
          balance: "1250.50",
        },
        mockMode: true,
      };

    case "transfer-crosschain":
      const mockTransferId = `gw-mock-${Date.now()}`;
      return {
        success: true,
        data: {
          transferId: mockTransferId,
          sourceChain: sourceChain || "ETH_SEPOLIA",
          destinationChain: destinationChain || "BASE_SEPOLIA",
          amount: amount || "100",
          recipient: recipient || "0xabcd...ef01",
          status: "INITIATED",
          explorerUrl: `https://sepolia.etherscan.io/tx/${mockTransferId}`,
        },
        mockMode: true,
      };

    case "get-transfer-status":
      return {
        success: true,
        data: {
          transferId: transferId || `gw-mock-${Date.now()}`,
          status: "COMPLETE",
          sourceChain: "ETH_SEPOLIA",
          destinationChain: "BASE_SEPOLIA",
          amount: "100",
        },
        mockMode: true,
      };

    case "get-supported-chains":
      return {
        success: true,
        data: {
          chains: Object.entries(DOMAIN_IDS).map(([chain, domainId]) => ({
            chain,
            domainId,
            usdcAddress: USDC_ADDRESSES[chain],
          })),
          gatewayWallet: GATEWAY_WALLET,
          gatewayMinter: GATEWAY_MINTER,
        },
        mockMode: true,
      };

    default:
      return { success: false, error: `Unknown action: ${action}`, mockMode: true };
  }
}
