import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const socialMediaTool = createTool({
  id: 'manage-social-media',
  description: 'Manage social media content and scheduling',
  inputSchema: z.object({
    platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok']).describe('Social media platform'),
    action: z.enum(['create-post', 'analyze-performance', 'get-content-ideas']).describe('Action to perform'),
    businessType: z.string().optional().describe('Type of business'),
    topic: z.string().optional().describe('Content topic'),
  }),
  outputSchema: z.object({
    result: z.string(),
    platform: z.string(),
    action: z.string(),
    nextSteps: z.array(z.string()),
  }),
  execute: async (inputData) => {
    const { platform, action, businessType = 'business', topic } = inputData;

    let result = '';
    let nextSteps: string[] = [];

    switch (action) {
      case 'create-post':
        result = createPlatformPost(platform, businessType, topic || 'business tips');
        nextSteps = [
          'Review and customize the post',
          'Add relevant images or videos',
          'Schedule for optimal posting time',
          'Engage with comments after posting',
        ];
        break;

      case 'analyze-performance':
        result = `## ${platform} Performance Analysis

### Key Metrics (Last 30 Days)
- **Reach:** 12,500 (+15% from last month)
- **Engagement Rate:** 4.2% (Industry avg: 2.5%)
- **Follower Growth:** +340 new followers
- **Best Performing Post:** Product showcase (8.5% engagement)
- **Worst Performing Post:** Text-only update (1.2% engagement)

### Insights
✅ Visual content performs 3x better than text-only
✅ Posts between 6-8 PM get highest engagement
⚠️ Weekend posting shows lower reach
✅ Stories drive 2x more profile visits

### Recommendations
1. Focus on visual content (images, videos, carousels)
2. Post consistently between 6-8 PM on weekdays
3. Use more interactive content (polls, questions)
4. Leverage trending hashtags`;
        nextSteps = [
          'Implement visual content strategy',
          'Optimize posting schedule',
          'Create more interactive content',
          'Test new content formats',
        ];
        break;

      case 'get-content-ideas':
        result = `## Content Ideas for ${platform}

### Trending Topics
1. Behind-the-scenes content
2. User-generated content
3. Educational tips and tutorials
4. Industry news and updates
5. Team spotlights

### Content Calendar Suggestions
**Monday:** Motivational quote or tip
**Tuesday:** Educational content
**Wednesday:** Behind-the-scenes
**Thursday:** User spotlight or testimonial
**Friday:** Fun/engaging content

### Hashtag Strategy
- Use 3-5 relevant hashtags
- Mix popular and niche hashtags
- Create branded hashtag for campaigns`;
        nextSteps = [
          'Plan content calendar for next week',
          'Research trending hashtags',
          'Create content templates',
          'Schedule content in advance',
        ];
        break;
    }

    return {
      result,
      platform,
      action,
      nextSteps,
    };
  },
});

function createPlatformPost(platform: string, businessType: string, topic: string): string {
  const posts: Record<string, string> = {
    instagram: `📸 Instagram Post Idea

"${topic}" is transforming how ${businessType} connects with customers.

Here's what you need to know:
✨ Start with authenticity
✨ Show behind-the-scenes
✨ Engage with your community

Ready to level up your ${businessType}? 

#MarketingTips #SmallBusiness #${topic.replace(/\s+/g, '')} #GrowthMindset`,

    facebook: `📢 Facebook Post

Did you know? ${topic} can increase your ${businessType}'s reach by up to 40%!

Our top 3 tips:
1️⃣ Be consistent with your posting
2️⃣ Engage with your audience
3️⃣ Use data to drive decisions

What's been your biggest challenge with ${topic}? Let us know in the comments! 👇`,

    twitter: `🐦 Twitter Thread

🧵 Thread: Why ${topic} matters for ${businessType}

1/ Many ${businessType} owners overlook the power of ${topic}

2/ Here's why it's crucial:
- Builds trust with customers
- Increases brand visibility
- Drives sustainable growth

3/ Quick win: Start by auditing your current approach

4/ Pro tip: Consistency beats perfection

What's your experience? Reply below! 👇`,

    linkedin: `💼 LinkedIn Article

The Future of ${topic} in ${businessType}

In today's rapidly evolving digital landscape, understanding ${topic} isn't just an advantage—it's a necessity.

Key insights:
📌 ${topic} is evolving faster than ever
📌 Small businesses can compete with larger brands
📌 Data-driven decisions lead to better outcomes

The businesses that embrace ${topic} now will be the leaders of tomorrow.

What are your thoughts on the future of ${topic}?`,

    tiktok: `🎬 TikTok Script

HOOK: "POV: You're a ${businessType} owner who just discovered ${topic}"

CONTENT:
*[Show transformation/results]*

"Before: Struggling to reach customers
After: ${topic} changed everything"

"Here's the secret:
1. Start small
2. Be consistent
3. Track everything"

CTA: "Follow for more ${businessType} tips! 🚀"`,
  };

  return posts[platform] || posts.instagram;
}
