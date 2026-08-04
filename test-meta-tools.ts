// Quick test for Meta Ads tools
import { getAdAccount } from './src/mastra/mcp/meta-ads/src/sdk';

const accessToken = process.env.META_ACCESS_TOKEN;
const accountId = process.env.META_AD_ACCOUNT_ID;

async function testTools() {
  console.log('Testing Meta Ads tools...\n');

  if (!accessToken || !accountId) {
    console.error('Missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID');
    process.exit(1);
  }

  const account = getAdAccount(accountId, accessToken);
  console.log('Account ID:', accountId);

  // Test 1: Get campaigns
  try {
    console.log('\n1. Testing meta-get-campaigns...');
    const campaigns = await account.getCampaigns(['id', 'name', 'status', 'objective', 'effective_status', 'daily_budget'], { limit: 10 });
    console.log('   Found', campaigns.length, 'campaigns');
    campaigns.forEach((c: any) => {
      console.log('   -', c.name);
      console.log('     ID:', c.id);
      console.log('     Status:', c.status || c.effective_status || 'N/A');
      console.log('     Objective:', c.objective || 'N/A');
      console.log('     Budget:', c.daily_budget || 'N/A');
    });
  } catch (error: any) {
    console.error('   Error:', error.message);
  }

  // Test 2: Get account insights
  try {
    console.log('\n2. Testing meta-get-account-insights...');
    const insights = await account.getInsights({
      date_preset: 'last_30d',
      fields: ['impressions', 'clicks', 'spend', 'ctr', 'actions'],
    });
    console.log('   Found', insights.length, 'insight rows');
    if (insights.length > 0) {
      insights.forEach((i: any) => {
        console.log('   - Spend:', i.spend, '| Clicks:', i.clicks, '| CTR:', i.ctr);
      });
    }
  } catch (error: any) {
    console.error('   Error:', error.message);
  }

  // Test 3: Get custom audiences
  try {
    console.log('\n3. Testing meta-get-custom-audiences...');
    const audiences = await account.getCustomAudiences(['id', 'name', 'subtype', 'approximate_count'], { limit: 10 });
    console.log('   Found', audiences.length, 'audiences');
    audiences.forEach((a: any) => {
      console.log('   -', a.name, '(' + a.subtype + ')');
    });
  } catch (error: any) {
    console.error('   Error:', error.message);
  }

  // Test 4: Get ad creatives
  try {
    console.log('\n4. Testing meta-get-ad-creatives...');
    const creatives = await account.getAdCreatives(['id', 'name', 'title'], { limit: 10 });
    console.log('   Found', creatives.length, 'creatives');
    creatives.forEach((cr: any) => {
      console.log('   -', cr.name);
    });
  } catch (error: any) {
    console.error('   Error:', error.message);
  }

  // Test 5: Get ad sets
  try {
    console.log('\n5. Testing meta-get-adsets...');
    const adSets = await account.getAdSets(['id', 'name', 'status', 'daily_budget', 'campaign_id'], { limit: 10 });
    console.log('   Found', adSets.length, 'ad sets');
    adSets.forEach((a: any) => {
      console.log('   -', a.name, '(' + a.status + ')');
    });
  } catch (error: any) {
    console.error('   Error:', error.message);
  }

  console.log('\n✓ Tool tests complete');
}

testTools().catch(console.error);
