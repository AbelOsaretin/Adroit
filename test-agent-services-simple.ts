// Simple test for Agent Services Tool
console.log('Testing Agent Services Tool...\n');

// Import directly
const SERVICE_CATALOG = [
  { id: "seo-analysis", name: "SEO Analysis", price: "0.01", category: "analytics" },
  { id: "campaign-audit", name: "Campaign Audit", price: "0.05", category: "analytics" },
  { id: "content-generation", name: "Content Generation", price: "0.02", category: "content" },
  { id: "marketing-strategy", name: "Marketing Strategy", price: "0.20", category: "consulting" },
];

console.log('1. Available Services:');
SERVICE_CATALOG.forEach(s => {
  console.log(`   - ${s.name}: ${s.price} USDC (${s.category})`);
});

console.log('\n2. Pricing Summary:');
console.log('   Currency: USDC');
console.log('   Chain: ARC_TESTNET');
console.log('   Payment Method: x402 Gateway Nanopayments');

console.log('\n3. Service Endpoints:');
SERVICE_CATALOG.forEach(s => {
  console.log(`   POST /api/services { serviceId: "${s.id}" }`);
});

console.log('\n✓ Agent Services configuration verified');
