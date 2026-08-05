// User-Controlled Wallets API
// Backend API for Circle User-Controlled Wallets with Social Login

import { NextRequest, NextResponse } from 'next/server';

const isMockMode = !process.env.CIRCLE_API_KEY || !process.env.CIRCLE_APP_ID;

// POST /api/wallet - Create wallet or handle auth
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, walletId, toAddress, amount, tokenAddress, transactionId } = body;

    // Use mock mode for now - real SDK integration requires careful type handling
    return handleMockAction(action, userId, walletId, toAddress, amount, transactionId);
  } catch (error) {
    console.error('Wallet API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({
        success: true,
        data: {
          userId: mockUserId,
          status: 'created',
          mockMode: true,
        },
      });

    case 'create-wallet':
      return NextResponse.json({
        success: true,
        data: {
          walletId: `wallet-${Date.now()}`,
          address: `0x${Date.now().toString(16).padStart(40, '0')}`,
          blockchain: 'ETH-SEPOLIA',
          mockMode: true,
        },
      });

    case 'get-wallets':
      return NextResponse.json({
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
          mockMode: true,
        },
      });

    case 'get-balance':
      return NextResponse.json({
        success: true,
        data: {
          balances: [
            { symbol: 'USDC', amount: '1250.50', tokenAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' },
            { symbol: 'ETH', amount: '0.5', tokenAddress: '0x0000000000000000000000000000000000000000' },
          ],
          mockMode: true,
        },
      });

    case 'create-challenge':
      return NextResponse.json({
        success: true,
        data: {
          challengeId: `challenge-${Date.now()}`,
          challenge: { id: `challenge-${Date.now()}`, status: 'PENDING' },
          mockMode: true,
        },
      });

    case 'execute-challenge':
      return NextResponse.json({
        success: true,
        data: {
          transactionId: `tx-${Date.now()}`,
          status: 'INITIATED',
          mockMode: true,
        },
      });

    default:
      return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
      );
  }
}
