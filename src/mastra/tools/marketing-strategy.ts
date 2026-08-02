import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const marketingStrategyTool = createTool({
  id: 'create-marketing-strategy',
  description: 'Create a comprehensive marketing strategy for a business',
  inputSchema: z.object({
    businessName: z.string().describe('Name of the business'),
    businessType: z.string().describe('Type of business (e.g., restaurant, e-commerce, SaaS)'),
    targetAudience: z.string().describe('Target audience description'),
    budget: z.string().describe('Monthly marketing budget'),
    goals: z.string().describe('Marketing goals (e.g., increase brand awareness, drive sales)'),
  }),
  outputSchema: z.object({
    strategy: z.string(),
    channels: z.array(z.string()),
    timeline: z.string(),
    budgetAllocation: z.string(),
  }),
  execute: async (inputData) => {
    const { businessName, businessType, targetAudience, budget, goals } = inputData;

    const strategy = `## Marketing Strategy for ${businessName}

### Business Overview
- **Type:** ${businessType}
- **Target Audience:** ${targetAudience}
- **Monthly Budget:** ${budget}
- **Goals:** ${goals}

### Recommended Marketing Channels
1. **Social Media Marketing** - Build brand presence and engage with audience
2. **Content Marketing** - Establish thought leadership and drive organic traffic
3. **Email Marketing** - Nurture leads and retain customers
4. **Paid Advertising** - Target specific audiences for conversions
5. **SEO** - Improve organic visibility and long-term traffic

### Budget Allocation
- Social Media Ads: 30%
- Content Creation: 25%
- Email Marketing: 15%
- Paid Search: 20%
- SEO & Analytics: 10%

### 90-Day Action Plan
**Month 1:** Foundation & Setup
- Audit current marketing efforts
- Set up analytics and tracking
- Create brand guidelines
- Build content calendar

**Month 2:** Launch & Optimize
- Launch initial campaigns
- A/B test ad creatives
- Build email sequences
- Start content publication

**Month 3:** Scale & Refine
- Analyze performance data
- Scale winning campaigns
- Refine targeting
- Plan next quarter`;

    return {
      strategy,
      channels: ['Social Media', 'Content Marketing', 'Email Marketing', 'Paid Ads', 'SEO'],
      timeline: '90 days',
      budgetAllocation: 'Social Media 30%, Content 25%, Email 15%, Paid Ads 20%, SEO 10%',
    };
  },
});
