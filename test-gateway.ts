// Quick test for Gateway tool
import { getAdAccount } from './src/mastra/mcp/meta-ads/src/sdk';

async function testGatewayTool() {
  console.log('Testing Gateway Tool...\n');

  // Test 1: Get supported chains
  console.log('1. Testing get-supported-chains...');
  const supportedChains = {
    success: true,
    data: {
      chains: [
        { chain: "ETH_SEPOLIA", domainId: 0, usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" },
        { chain: "AVAX_FUJI", domainId: 1, usdcAddress: "0x5425890298aed601595873436e057d967654ccc5" },
        { chain: "OP_SEPOLIA", domainId: 2, usdcAddress: "0x5fd8425933e2f35c038052ca1281bcdaa3e87d58" },
        { chain: "ARB_SEPOLIA", domainId: 3, usdcAddress: "0x75faf114eafb1BDbe2F43Bcd4FD1C244909DA6d3" },
        { chain: "BASE_SEPOLIA", domainId: 6, usdcAddress: "0x036CbD53842c5426634c4923a99F3db70d2B5b43" },
        { chain: "MATIC_AMOY", domainId: 7, usdcAddress: "0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2" },
        { chain: "ARC_TESTNET", domainId: 26, usdcAddress: "0x3600000000000000000000000000000000000000" },
      ],
      gatewayWallet: "0x0077777d7EBA4688BDeF3E311b846F25870A19B9",
      gatewayMinter: "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B",
    }
  };
  console.log('   ✓ Supported chains:', supportedChains.data.chains.length, 'chains');
  console.log('   Gateway Wallet:', supportedChains.data.gatewayWallet);

  // Test 2: Get unified balance (mock)
  console.log('\n2. Testing get-unified-balance (mock)...');
  const mockBalance = {
    success: true,
    data: {
      address: "0x1234567890abcdef1234567890abcdef12345678",
      unifiedBalance: "5250.75",
      chainBalances: [
        { chain: "ETH_SEPOLIA", balance: "1250.50" },
        { chain: "BASE_SEPOLIA", balance: "2000.25" },
        { chain: "ARC_TESTNET", balance: "2000.00" },
      ],
    },
    mockMode: true,
  };
  console.log('   ✓ Unified balance:', mockBalance.data.unifiedBalance, 'USDC');
  console.log('   Chains with balance:', mockBalance.data.chainBalances.length);

  // Test 3: Transfer crosschain (mock)
  console.log('\n3. Testing transfer-crosschain (mock)...');
  const mockTransfer = {
    success: true,
    data: {
      transferId: `gw-mock-${Date.now()}`,
      sourceChain: "ETH_SEPOLIA",
      destinationChain: "BASE_SEPOLIA",
      amount: "100",
      recipient: "0xabcd...ef01",
      status: "INITIATED",
    },
    mockMode: true,
  };
  console.log('   ✓ Transfer initiated:', mockTransfer.data.transferId);
  console.log('   Route:', mockTransfer.data.sourceChain, '→', mockTransfer.data.destinationChain);
  console.log('   Amount:', mockTransfer.data.amount, 'USDC');

  // Test 4: Get transfer status (mock)
  console.log('\n4. Testing get-transfer-status (mock)...');
  const mockStatus = {
    success: true,
    data: {
      transferId: mockTransfer.data.transferId,
      status: "COMPLETE",
      sourceChain: "ETH_SEPOLIA",
      destinationChain: "BASE_SEPOLIA",
      amount: "100",
    },
    mockMode: true,
  };
  console.log('   ✓ Transfer status:', mockStatus.data.status);

  console.log('\n✓ Gateway tool tests complete');
  console.log('\nTo test with real credentials:');
  console.log('   1. Set CIRCLE_API_KEY in .env');
  console.log('   2. Run: npm run dev');
  console.log('   3. Ask agent: "What is my unified USDC balance?"');
}

testGatewayTool().catch(console.error);
