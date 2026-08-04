// Agent Services Tool
// Exposes Adroit's marketing capabilities as paid services for other AI agents

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const isMockMode = !process.env.SELLER_ADDRESS;

const SERVICE_CATALOG = [
  {
    id: "seo-analysis",
    name: "SEO Analysis",
    description: "Analyze website SEO and get optimization recommendations",
    price: "0.01",
    category: "analytics",
  },
  {
    id: "campaign-audit",
    name: "Campaign Audit",
    description: "Audit ad campaign performance across platforms",
    price: "0.05",
    category: "analytics",
  },
  {
    id: "content-generation",
    name: "Content Generation",
    description: "Generate marketing content for social media, blogs, ads",
    price: "0.02",
    category: "content",
  },
  {
    id: "marketing-strategy",
    name: "Marketing Strategy",
    description: "Get comprehensive marketing strategy recommendations",
    price: "0.20",
    category: "consulting",
  },
];

export const agentServicesTool = createTool({
  id: "agent-services",
  description: isMockMode
    ? "Adroit marketing services available for AI agents (MOCK MODE)"
    : "Adroit marketing services - sell your AI marketing capabilities to other agents via USDC",
  inputSchema: z.object({
    action: z.enum([
      "list-services",
      "get-pricing",
      "execute-service",
      "get-service-status",
    ]),
    serviceId: z.string().optional().describe("Service ID to execute"),
    params: z.any().optional().describe("Service parameters"),
    transactionId: z.string().optional().describe("Transaction ID for status check"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    mockMode: z.boolean().optional(),
  }),
  execute: async (inputData) => {
    const { action, serviceId, params, transactionId } = inputData;

    if (isMockMode) {
      return handleMockAction(action, serviceId, params, transactionId);
    }

    try {
      switch (action) {
        case "list-services": {
          return {
            success: true,
            data: {
              services: SERVICE_CATALOG,
              total: SERVICE_CATALOG.length,
              currency: "USDC",
              chain: "ARC_TESTNET",
            },
          };
        }

        case "get-pricing": {
          return {
            success: true,
            data: {
              pricing: SERVICE_CATALOG.map(s => ({
                id: s.id,
                name: s.name,
                price: s.price,
              })),
              currency: "USDC",
              chain: "ARC_TESTNET",
              paymentMethod: "x402 Gateway Nanopayments",
            },
          };
        }

        case "execute-service": {
          if (!serviceId) {
            return { success: false, error: "serviceId is required" };
          }

          const service = SERVICE_CATALOG.find(s => s.id === serviceId);
          if (!service) {
            return { success: false, error: `Service not found: ${serviceId}` };
          }

          // In production, this would:
          // 1. Verify x402 payment
          // 2. Execute the service
          // 3. Return results

          const transactionId = `svc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          return {
            success: true,
            data: {
              transactionId,
              serviceId,
              serviceName: service.name,
              price: service.price,
              status: "EXECUTING",
              message: `Executing ${service.name}...`,
            },
          };
        }

        case "get-service-status": {
          if (!transactionId) {
            return { success: false, error: "transactionId is required" };
          }

          return {
            success: true,
            data: {
              transactionId,
              status: "COMPLETE",
              result: {
                summary: "Service executed successfully",
                metrics: {
                  processingTime: "1.2s",
                  confidence: 0.95,
                },
              },
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
  serviceId?: string,
  params?: any,
  transactionId?: string,
) {
  switch (action) {
    case "list-services":
      return {
        success: true,
        data: {
          services: SERVICE_CATALOG,
          total: SERVICE_CATALOG.length,
          currency: "USDC",
          chain: "ARC_TESTNET",
        },
        mockMode: true,
      };

    case "get-pricing":
      return {
        success: true,
        data: {
          pricing: SERVICE_CATALOG.map(s => ({
            id: s.id,
            name: s.name,
            price: s.price,
          })),
          currency: "USDC",
          chain: "ARC_TESTNET",
        },
        mockMode: true,
      };

    case "execute-service":
      const mockTransactionId = `svc-mock-${Date.now()}`;
      return {
        success: true,
        data: {
          transactionId: mockTransactionId,
          serviceId: serviceId || "seo-analysis",
          price: "0.01",
          status: "COMPLETE",
          result: {
            score: 85,
            recommendations: [
              "Optimize meta descriptions",
              "Improve page speed",
              "Add structured data",
            ],
          },
        },
        mockMode: true,
      };

    case "get-service-status":
      return {
        success: true,
        data: {
          transactionId: transactionId || `svc-mock-${Date.now()}`,
          status: "COMPLETE",
          result: {
            summary: "Service completed successfully",
          },
        },
        mockMode: true,
      };

    default:
      return { success: false, error: `Unknown action: ${action}`, mockMode: true };
  }
}
