// Test Agent Services Tool
import { agentServicesTool } from './src/mastra/tools/agent-services';

async function testAgentServices() {
  console.log('Testing Agent Services Tool...\n');

  // Test 1: List services
  console.log('1. Testing list-services...');
  const result1 = await agentServicesTool.execute({
    action: "list-services",
  }, { threadId: "test", resourceId: "test" });
  console.log('   Result:', JSON.stringify(result1).substring(0, 200) + '...');

  console.log('\n✓ Agent Services tool test complete');
}

testAgentServices().catch(console.error);
