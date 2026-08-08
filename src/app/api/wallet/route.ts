// User-Controlled Wallets API
// Based on Circle documentation: https://developers.circle.com/wallets/user-controlled/build-a-wallet-app.md

import { NextRequest, NextResponse } from 'next/server';

const CIRCLE_BASE_URL = process.env.NEXT_PUBLIC_CIRCLE_BASE_URL || 'https://api.circle.com';
const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY as string;

// POST /api/wallet - Unified backend route for Circle Wallet operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body ?? {};

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    // If no API key or network issues, use mock mode
    if (!CIRCLE_API_KEY) {
      return handleMockAction(action, params);
    }

    try {
      switch (action) {
      case 'createDeviceToken': {
        const { deviceId } = params;
        if (!deviceId) {
          return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });
        }

        const response = await fetch(`${CIRCLE_BASE_URL}/v1/w3s/users/social/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
          },
          body: JSON.stringify({
            idempotencyKey: crypto.randomUUID(),
            deviceId,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        // Returns: { deviceToken, deviceEncryptionKey }
        return NextResponse.json(data.data, { status: 200 });
      }

      case 'initializeUser': {
        const { userToken } = params;
        if (!userToken) {
          return NextResponse.json({ error: 'Missing userToken' }, { status: 400 });
        }

        const response = await fetch(`${CIRCLE_BASE_URL}/v1/w3s/user/initialize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
            'X-User-Token': userToken,
          },
          body: JSON.stringify({
            idempotencyKey: crypto.randomUUID(),
            accountType: 'SCA',
            blockchains: ['ARC-TESTNET'],
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        // Returns: { challengeId }
        return NextResponse.json(data.data, { status: 200 });
      }

      case 'listWallets': {
        const { userToken } = params;
        if (!userToken) {
          return NextResponse.json({ error: 'Missing userToken' }, { status: 400 });
        }

        const response = await fetch(`${CIRCLE_BASE_URL}/v1/w3s/wallets`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
            'X-User-Token': userToken,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        // Returns: { wallets: [...] }
        return NextResponse.json(data.data, { status: 200 });
      }

      case 'getTokenBalance': {
        const { userToken, walletId } = params;
        if (!userToken || !walletId) {
          return NextResponse.json(
            { error: 'Missing userToken or walletId' },
            { status: 400 }
          );
        }

        const response = await fetch(`${CIRCLE_BASE_URL}/v1/w3s/wallets/${walletId}/balances`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
            'X-User-Token': userToken,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        // Returns: { tokenBalances: [...] }
        return NextResponse.json(data.data, { status: 200 });
      }

      case 'sendPayment': {
        const { userToken, walletId, toAddress, amount, tokenAddress } = params;
        if (!userToken || !walletId || !toAddress || !amount) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        // For User-Controlled Wallets, we need to create a transaction challenge
        // The user will need to sign this challenge via the SDK
        const response = await fetch(`${CIRCLE_BASE_URL}/v1/w3s/user/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
            'X-User-Token': userToken,
          },
          body: JSON.stringify({
            walletId,
            toAddress,
            tokenAddress: tokenAddress || '0x3600000000000000000000000000000000000000', // USDC on Arc
            amount: amount.toString(),
            blockchain: 'ARC-TESTNET',
            fee: {
              type: 'level',
              config: {
                feeLevel: 'MEDIUM',
              },
            },
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        // Returns: { challengeId }
        return NextResponse.json({
          challengeId: data.data?.challengeId,
          status: 'PENDING_SIGNATURE',
          message: 'Transaction created. User must sign via SDK.',
        }, { status: 200 });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
    } catch (fetchError) {
      console.error('Circle API fetch error:', fetchError);
      // Fall back to mock mode on network errors
      return handleMockAction(action, params);
    }
  } catch (error) {
    console.error('Wallet API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function handleMockAction(action: string, params: any) {
  const mockUserId = params?.userId || `mock-user-${Date.now()}`;

  switch (action) {
    case 'createDeviceToken':
      return NextResponse.json({
        deviceToken: `mock-device-token-${Date.now()}`,
        deviceEncryptionKey: `mock-encryption-key-${Date.now()}`,
        mockMode: true,
      });

    case 'initializeUser':
      return NextResponse.json({
        challengeId: `mock-challenge-${Date.now()}`,
        mockMode: true,
      });

    case 'listWallets':
      return NextResponse.json({
        wallets: [
          {
            id: 'mock-wallet-1',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            blockchain: 'ARC-TESTNET',
            accountType: 'SCA',
          },
        ],
        mockMode: true,
      });

    case 'getTokenBalance':
      return NextResponse.json({
        tokenBalances: [
          { token: { symbol: 'USDC', name: 'USD Coin' }, amount: '1250.50' },
          { token: { symbol: 'ETH', name: 'Ethereum' }, amount: '0.5' },
        ],
        mockMode: true,
      });

    case 'sendPayment':
      return NextResponse.json({
        transactionId: `mock-tx-${Date.now()}`,
        status: 'INITIATED',
        mockMode: true,
      });

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
}
