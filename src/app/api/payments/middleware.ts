// x402 Payment Middleware for Adroit AI Marketing Agency
// Enables USDC pay-per-call for AI agent services

import { NextRequest, NextResponse } from 'next/server';

const isMockMode = !process.env.SELLER_ADDRESS;

// Gateway contract addresses (Testnet)
const GATEWAY_WALLET = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9";

interface PaymentRequirement {
  price: string;
  sellerAddress: string;
  chain: string;
  token: string;
}

interface PaymentVerified {
  verified: boolean;
  payerAddress?: string;
  amount?: string;
  transactionHash?: string;
  error?: string;
}

/**
 * Verify x402 payment from request headers
 * In production, this would verify the cryptographic proof
 */
export async function verifyPayment(
  request: NextRequest,
  requiredPrice: string
): Promise<PaymentVerified> {
  if (isMockMode) {
    // Mock mode - skip verification
    return {
      verified: true,
      payerAddress: "0xMOCK_AGENT_ADDRESS",
      amount: requiredPrice,
      transactionHash: `mock-tx-${Date.now()}`,
    };
  }

  // Get payment proof from headers
  const paymentProof = request.headers.get('x-payment-proof');
  const payerAddress = request.headers.get('x-payer-address');

  if (!paymentProof || !payerAddress) {
    return {
      verified: false,
      error: "Missing payment proof headers",
    };
  }

  // In production, verify the x402 payment proof:
  // 1. Decode the payment proof
  // 2. Verify the signature
  // 3. Check the amount matches required price
  // 4. Verify the seller address matches
  // 5. Check the chain is correct

  // For now, return mock verification
  return {
    verified: true,
    payerAddress,
    amount: requiredPrice,
    transactionHash: `verified-${Date.now()}`,
  };
}

/**
 * Create 402 Payment Required response
 */
export function createPaymentRequiredResponse(
  serviceId: string,
  price: string,
  sellerAddress: string,
  chain: string = "ARC_TESTNET"
): NextResponse {
  const paymentRequirement: PaymentRequirement = {
    price,
    sellerAddress,
    chain,
    token: "USDC",
  };

  return NextResponse.json(
    {
      error: "Payment Required",
      message: `This service requires ${price} USDC payment`,
      serviceId,
      paymentRequirement,
      documentation: "https://developers.circle.com/gateway/nanopayments",
    },
    {
      status: 402,
      headers: {
        "X-Payment-Required": "true",
        "X-Payment-Price": price,
        "X-Payment-Token": "USDC",
        "X-Payment-Seller": sellerAddress,
        "X-Payment-Chain": chain,
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * Middleware factory for creating payment-protected endpoints
 */
export function withPayment(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: {
    serviceId: string;
    price: string;
    sellerAddress?: string;
    chain?: string;
  }
) {
  const sellerAddress = options.sellerAddress || process.env.SELLER_ADDRESS || GATEWAY_WALLET;
  const chain = options.chain || "ARC_TESTNET";

  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // Verify payment
    const paymentResult = await verifyPayment(request, options.price);

    if (!paymentResult.verified) {
      return createPaymentRequiredResponse(
        options.serviceId,
        options.price,
        sellerAddress,
        chain
      );
    }

    // Add payment info to request headers for the handler
    const modifiedRequest = new NextRequest(request.url, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        "x-verified-payer": paymentResult.payerAddress || "",
        "x-verified-amount": paymentResult.amount || "",
        "x-payment-tx": paymentResult.transactionHash || "",
      },
      body: request.body,
    });

    // Call the original handler
    return handler(modifiedRequest, context);
  };
}

/**
 * Get payment status for a transaction
 */
export async function getPaymentStatus(
  transactionHash: string
): Promise<{ status: string; details?: any }> {
  if (isMockMode) {
    return {
      status: "COMPLETE",
      details: {
        transactionHash,
        amount: "0.01",
        payer: "0xMOCK_AGENT_ADDRESS",
        seller: process.env.SELLER_ADDRESS || GATEWAY_WALLET,
      },
    };
  }

  // In production, query the blockchain or Gateway API
  return {
    status: "UNKNOWN",
    details: { transactionHash },
  };
}
