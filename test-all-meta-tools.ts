// Comprehensive Test for All Meta Ads Tools
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
const results: any[] = [];

async function testTool(name: string, fn: () => Promise<any>) {
  try {
    const result = await fn();
    results.push({ name, status: result.success ? '✓' : '✗', result });
    console.log(`${result.success ? '✓' : '✗'} ${name}`);
    return result;
  } catch (error: any) {
    results.push({ name, status: '✗', error: error.message });
    console.log(`✗ ${name}: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('=== Meta Ads Tools Test Suite ===\n');

  // Campaign Types
  console.log('--- Campaign Types ---');
  const video = await testTool('Create Video Campaign', () =>
    create_video_campaign.execute({
      platform: 'meta',
      accountId: ACCOUNT_ID,
      name: `Test Video ${Date.now()}`,
      videoUrl: 'https://example.com/video.mp4',
      duration: '30s',
      objective: 'AWARENESS',
      budget: 25,
    }, { threadId: 'test', resourceId: 'test' })
  );

  const appInstall = await testTool('Create App Install Campaign', () =>
    create_app_install_campaign.execute({
      platform: 'meta',
      accountId: ACCOUNT_ID,
      name: `Test App Install ${Date.now()}`,
      appStoreUrl: 'https://play.google.com/store/apps/details?id=com.test',
      objective: 'APP_INSTALLS',
      budget: 20,
    }, { threadId: 'test', resourceId: 'test' })
  );

  const leadGen = await testTool('Create Lead Gen Campaign', () =>
    create_lead_gen_campaign.execute({
      platform: 'meta',
      accountId: ACCOUNT_ID,
      name: `Test Lead Gen ${Date.now()}`,
      formFields: ['email', 'name'],
      headline: 'Get Free Quote',
      budget: 30,
    }, { threadId: 'test', resourceId: 'test' })
  );

  // Get campaign ID for further tests
  const campaignId = video?.data?.id;

  if (campaignId) {
    await testTool('Get Video Performance', () =>
      get_video_performance.execute({
        platform: 'meta',
        campaignId,
      }, { threadId: 'test', resourceId: 'test' })
    );

    await testTool('Get App Install Metrics', () =>
      get_app_install_metrics.execute({
        platform: 'meta',
        campaignId,
      }, { threadId: 'test', resourceId: 'test' })
    );

    await testTool('Get Lead Gen Metrics', () =>
      get_lead_gen_metrics.execute({
        platform: 'meta',
        campaignId,
      }, { threadId: 'test', resourceId: 'test' })
    );
  }

  // Retargeting
  console.log('\n--- Retargeting ---');
  const audience = await testTool('Create Retargeting Audience', () =>
    create_retargeting_audience.execute({
      platform: 'meta',
      accountId: ACCOUNT_ID,
      name: `Test Audience ${Date.now()}`,
      type: 'website_visitors',
      retentionDays: 30,
    }, { threadId: 'test', resourceId: 'test' })
  );

  if (campaignId) {
    await testTool('Get Retargeting Performance', () =>
      get_retargeting_performance.execute({
        platform: 'meta',
        campaignId,
      }, { threadId: 'test', resourceId: 'test' })
    );
  }

  // Performance Marketing
  console.log('\n--- Performance Marketing ---');
  await testTool('Multi-Touch Attribution', () =>
    multi_touch_attribution.execute({
      accountId: ACCOUNT_ID,
      dateRange: 'last_30_days',
      model: 'linear',
    }, { threadId: 'test', resourceId: 'test' })
  );

  await testTool('Calculate Customer LTV', () =>
    calculate_customer_ltv.execute({
      accountId: ACCOUNT_ID,
      timePeriod: '90_days',
    }, { threadId: 'test', resourceId: 'test' })
  );

  await testTool('Calculate Blended CPA', () =>
    calculate_blended_cpa.execute({
      accountId: ACCOUNT_ID,
      dateRange: 'last_30_days',
    }, { threadId: 'test', resourceId: 'test' })
  );

  if (campaignId) {
    await testTool('Forecast Performance', () =>
      forecast_campaign_performance.execute({
        platform: 'meta',
        accountId: ACCOUNT_ID,
        campaignId,
        forecastDays: 30,
      }, { threadId: 'test', resourceId: 'test' })
    );

    await testTool('Optimize Bidding', () =>
      optimize_bidding.execute({
        platform: 'meta',
        accountId: ACCOUNT_ID,
        campaignIds: [campaignId],
        goal: 'maximize_conversions',
      }, { threadId: 'test', resourceId: 'test' })
    );

    await testTool('Optimize Budget Allocation', () =>
      optimize_budget_allocation.execute({
        accountId: ACCOUNT_ID,
        campaignIds: [campaignId],
        totalBudget: 1000,
        optimizationGoal: 'maximize_roas',
      }, { threadId: 'test', resourceId: 'test' })
    );
  }

  // Summary
  console.log('\n=== Test Summary ===');
  const passed = results.filter(r => r.status === '✓').length;
  const failed = results.filter(r => r.status === '✗').length;
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);

  return results;
}

runTests().catch(console.error);
