// Test Meta Ads Tools - Campaign Types, Retargeting, Performance Marketing
import {
  create_video_campaign,
  get_video_performance,
  create_app_install_campaign,
  get_app_install_metrics,
  create_lead_gen_campaign,
  get_lead_gen_metrics,
} from './src/mastra/tools/campaign-types';
import {
  create_retargeting_audience,
  create_retargeting_campaign,
  get_retargeting_performance,
} from './src/mastra/tools/retargeting';
import {
  multi_touch_attribution,
  calculate_customer_ltv,
  optimize_bidding,
  forecast_campaign_performance,
  calculate_blended_cpa,
  optimize_budget_allocation,
} from './src/mastra/tools/performance-marketing';

const ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || '1825876572152624';

async function testTools() {
  console.log('Testing Meta Ads Tools...\n');

  // Test 1: Create Video Campaign
  console.log('1. Testing create_video_campaign...');
  const result1 = await create_video_campaign.execute({
    platform: 'meta',
    accountId: ACCOUNT_ID,
    name: 'Test Video Campaign',
    videoUrl: 'https://example.com/video.mp4',
    duration: '30s',
    objective: 'AWARENESS',
    budget: 50,
  }, { threadId: 'test', resourceId: 'test' });
  console.log('   Result:', JSON.stringify(result1).substring(0, 200) + '...');

  // Test 2: Create App Install Campaign
  console.log('\n2. Testing create_app_install_campaign...');
  const result2 = await create_app_install_campaign.execute({
    platform: 'meta',
    accountId: ACCOUNT_ID,
    name: 'Test App Install',
    appStoreUrl: 'https://play.google.com/store/apps/details?id=com.test',
    objective: 'APP_INSTALLS',
    budget: 30,
  }, { threadId: 'test', resourceId: 'test' });
  console.log('   Result:', JSON.stringify(result2).substring(0, 200) + '...');

  // Test 3: Create Lead Gen Campaign
  console.log('\n3. Testing create_lead_gen_campaign...');
  const result3 = await create_lead_gen_campaign.execute({
    platform: 'meta',
    accountId: ACCOUNT_ID,
    name: 'Test Lead Gen',
    formFields: ['email', 'name', 'phone'],
    headline: 'Get Free Quote',
    budget: 40,
  }, { threadId: 'test', resourceId: 'test' });
  console.log('   Result:', JSON.stringify(result3).substring(0, 200) + '...');

  // Test 4: Create Retargeting Audience
  console.log('\n4. Testing create_retargeting_audience...');
  const result4 = await create_retargeting_audience.execute({
    platform: 'meta',
    accountId: ACCOUNT_ID,
    name: 'Test Retargeting Audience',
    type: 'website_visitors',
    retentionDays: 30,
  }, { threadId: 'test', resourceId: 'test' });
  console.log('   Result:', JSON.stringify(result4).substring(0, 200) + '...');

  // Test 5: Multi-Touch Attribution
  console.log('\n5. Testing multi_touch_attribution...');
  const result5 = await multi_touch_attribution.execute({
    accountId: ACCOUNT_ID,
    dateRange: 'last_30_days',
    model: 'linear',
  }, { threadId: 'test', resourceId: 'test' });
  console.log('   Result:', JSON.stringify(result5).substring(0, 200) + '...');

  // Test 6: Blended CPA
  console.log('\n6. Testing calculate_blended_cpa...');
  const result6 = await calculate_blended_cpa.execute({
    accountId: ACCOUNT_ID,
    dateRange: 'last_30_days',
  }, { threadId: 'test', resourceId: 'test' });
  console.log('   Result:', JSON.stringify(result6).substring(0, 200) + '...');

  console.log('\n✓ All tool tests complete');
}

testTools().catch(console.error);
