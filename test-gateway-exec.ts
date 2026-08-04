// Test actual Gateway tool execution
import { gatewayTool } from './src/mastra/tools/gateway';

async function testGatewayExecution() {
  console.log('Testing Gateway Tool Execution...\n');

  // Test 1: get-supported-chains
  console.log('1. Testing get-supported-chains...');
  const result1 = await gatewayTool.execute({
    action: "get-supported-chains",
  });
  console.log('   Result:', JSON.stringify(result1, null, 2).substring(0, 200) + '...');

  // Test 2: get-unified-balance (mock mode)
  console.log('\n2. Testing get-unified-balance...');
  const result2 = await gatewayTool.execute({
    action: "get-unified-balance",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
  });
  console.log('   Result:', JSON.stringify(result2, null, 2).substring(0, 200) + '...');

  // Test 3: transfer-crosschain (mock mode)
  console.log('\n3. Testing transfer-crosschain...');
  const result3 = await gatewayTool.execute({
    action: "transfer-crosschain",
    sourceChain: "ETH_SEPOLIA",
    destinationChain: "BASE_SEPOLIA",
    recipient: "0xabcd1234567890abcdef1234567890abcdef1234",
    amount: "100",
  });
  console.log('   Result:', JSON.stringify(result3, null, 2).substring(0, 200) + '...');

  console.log('\n✓ Gateway tool execution tests complete');
}

testGatewayExecution().catch(console.error);
