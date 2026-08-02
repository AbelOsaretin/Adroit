import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const contentCreatorTool = createTool({
  id: 'create-content',
  description: 'Generate marketing content for various platforms',
  inputSchema: z.object({
    platform: z.enum(['social-media', 'blog', 'email', 'ad-copy']).describe('Content platform'),
    topic: z.string().describe('Content topic or theme'),
    brandVoice: z.string().optional().describe('Brand voice (e.g., professional, casual, friendly)'),
    targetAudience: z.string().optional().describe('Target audience'),
  }),
  outputSchema: z.object({
    content: z.string(),
    platform: z.string(),
    wordCount: z.number(),
    suggestions: z.array(z.string()),
  }),
  execute: async (inputData) => {
    const { platform, topic } = inputData;

    let content = '';
    let suggestions: string[] = [];

    switch (platform) {
      case 'social-media':
        content = `🚀 ${topic}

Discover how ${topic} can transform your business. Whether you're a small business owner or an entrepreneur, understanding ${topic} is crucial for growth.

💡 Key Takeaways:
• Start small, think big
• Consistency is key
• Measure and optimize

What's your experience with ${topic}? Share below! 👇

#Marketing #SmallBusiness #Growth #${topic.replace(/\s+/g, '')}`;
        suggestions = [
          'Add relevant hashtags for your industry',
          'Include a call-to-action',
          'Post during peak engagement hours',
        ];
        break;

      case 'blog':
        content = `# ${topic}: A Comprehensive Guide

## Introduction
In today's competitive landscape, understanding ${topic} is essential for business success. This guide will walk you through everything you need to know.

## Why ${topic} Matters
${topic} plays a crucial role in business growth. Here's why you should pay attention:

1. **Increased Visibility** - Stand out from competitors
2. **Better Engagement** - Connect with your target audience
3. **Higher Conversions** - Turn visitors into customers

## How to Get Started
Step 1: Define your goals
Step 2: Identify your target audience
Step 3: Create a strategy
Step 4: Execute and measure

## Conclusion
${topic} is not just a trend—it's a necessity for modern businesses. Start implementing these strategies today to see results.`;
        suggestions = [
          'Add internal and external links',
          'Include relevant images or infographics',
          'Optimize for SEO with target keywords',
        ];
        break;

      case 'email':
        content = `Subject: Transform Your Business with ${topic}

Hi [Name],

I hope this email finds you well.

I wanted to share some exciting insights about ${topic} that could help grow your business.

Here's what you'll learn:
✅ Why ${topic} matters for your success
✅ Simple steps to implement today
✅ Real results from businesses like yours

Click here to learn more: [CTA Button]

Best regards,
[Your Brand]`;
        suggestions = [
          'Personalize the subject line',
          'A/B test different send times',
          'Include social proof or testimonials',
        ];
        break;

      case 'ad-copy':
        content = `Headline: ${topic} - Transform Your Business Today

Description: Discover how ${topic} can help you achieve your business goals. Join thousands of satisfied customers who have seen real results.

CTA: Start Your Free Trial

Benefits:
✓ Easy to implement
✓ Proven results
✓ 24/7 support`;
        suggestions = [
          'Test different headlines',
          'Use numbers and statistics',
          'Create urgency with limited-time offers',
        ];
        break;
    }

    return {
      content,
      platform,
      wordCount: content.split(/\s+/).length,
      suggestions,
    };
  },
});
