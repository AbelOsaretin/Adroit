// Create sample data for testing Meta Ads tools
import { getAdAccount } from './src/mastra/mcp/meta-ads/src/sdk';

const accessToken = process.env.META_ACCESS_TOKEN;
const accountId = process.env.META_AD_ACCOUNT_ID;

async function createSampleData() {
  console.log('Creating sample data for Meta Ads...\n');

  if (!accessToken || !accountId) {
    console.error('Missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID');
    process.exit(1);
  }

  const account = getAdAccount(accountId, accessToken);
  console.log('Account ID:', accountId);

  // 1. Get existing campaigns
  console.log('\n1. Getting existing campaigns...');
  const campaigns = await account.getCampaigns(['id', 'name'], { limit: 10 });
  console.log('   Found', campaigns.length, 'campaigns');

  // 2. Create sample ad sets for first campaign
  if (campaigns.length > 0) {
    console.log('\n2. Creating sample ad sets...');
    const campaign = campaigns[0] as any;
    const campaignId = campaign.id;

    const adSetData = [
      { name: 'Young Adults 18-34', dailyBudget: '2000', targeting: { geo_locations: { countries: ['US'] }, age_min: 18, age_max: 34 } },
      { name: 'Professionals 35-54', dailyBudget: '3000', targeting: { geo_locations: { countries: ['US'] }, age_min: 35, age_max: 54 } },
      { name: 'Retargeting - Website Visitors', dailyBudget: '1500', targeting: { geo_locations: { countries: ['US'] }, age_min: 25, age_max: 65 } },
    ];

    for (const data of adSetData) {
      try {
        const adSet = await account.createAdSet([], {
          campaign_id: campaignId,
          name: data.name,
          daily_budget: data.dailyBudget,
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          billing_event: 'IMPRESSIONS',
          optimization_goal: 'REACH',
          status: 'PAUSED',
          targeting: data.targeting,
        });
        console.log('   ✓ Created:', data.name);
      } catch (error: any) {
        console.error('   ✗ Failed:', data.name, '-', error.message);
      }
    }
  }

  // 3. Create sample ad creatives with proper format
  console.log('\n3. Creating sample ad creatives...');
  const creativeData = [
    { name: 'Summer Sale - Image Ad', title: '50% Off Summer Collection', body: 'Shop our biggest sale of the year!' },
    { name: 'Lead Gen - Video Ad', title: 'Free 14-Day Trial', body: 'Try our platform free for 14 days' },
    { name: 'Brand Awareness - Carousel', title: 'Meet Adroit', body: 'Your AI-powered marketing assistant' },
  ];

  for (const data of creativeData) {
    try {
      const creative = await account.createAdCreative([], {
        name: data.name,
        object_story_spec: {
          page_id: '123456789',
          link_data: {
            link: 'https://adroit.ai',
            message: data.body,
            name: data.title,
          },
        },
      });
      console.log('   ✓ Created:', data.name);
    } catch (error: any) {
      console.error('   ✗ Failed:', data.name, '-', error.message);
    }
  }

  // 4. Get account insights
  console.log('\n4. Getting account insights...');
  try {
    const insights = await account.getInsights({
      date_preset: 'last_30d',
      fields: ['impressions', 'clicks', 'spend', 'actions'],
    });
    console.log('   Found', insights.length, 'insight rows');
  } catch (error: any) {
    console.error('   Error:', error.message);
  }

  console.log('\n✓ Sample data creation complete!');
}

createSampleData().catch(console.error);
