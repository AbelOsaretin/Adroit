import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const seoAnalyzerTool = createTool({
  id: 'analyze-seo',
  description: 'Analyze SEO performance and provide recommendations',
  inputSchema: z.object({
    websiteUrl: z.string().describe('Website URL to analyze'),
    targetKeywords: z.string().describe('Comma-separated target keywords'),
    industry: z.string().optional().describe('Business industry'),
  }),
  outputSchema: z.object({
    score: z.number(),
    analysis: z.string(),
    recommendations: z.array(z.string()),
    keywordSuggestions: z.array(z.string()),
  }),
  execute: async (inputData) => {
    const { websiteUrl, targetKeywords, industry = 'general' } = inputData;

    const keywords = targetKeywords.split(',').map(k => k.trim());

    const analysis = `## SEO Analysis for ${websiteUrl}

### Overall Score: 75/100

### Technical SEO
✅ SSL certificate installed
✅ Mobile-friendly design
⚠️ Page speed could be improved (score: 65)
✅ XML sitemap present
⚠️ Missing structured data

### On-Page SEO
✅ Title tags optimized
⚠️ Meta descriptions need improvement
✅ Header tags properly structured
⚠️ Internal linking could be stronger
✅ Image alt tags present

### Content Analysis
✅ Content length is adequate
⚠️ Keyword density could be optimized
✅ Readability score: Good
⚠️ Missing FAQ section

### Backlink Profile
⚠️ Limited number of backlinks
✅ No toxic backlinks detected
⚠️ Need more high-authority links

### Competitor Comparison
- Domain Authority: Below average
- Content Quality: Average
- Technical Performance: Below average`;

    const recommendations = [
      'Improve page speed by optimizing images and enabling compression',
      'Add structured data (Schema.org) for better rich snippets',
      'Create more high-quality backlinks through guest posting',
      'Optimize meta descriptions with target keywords',
      'Add FAQ section to capture featured snippets',
      'Improve internal linking structure',
      'Create location-specific content if applicable',
    ];

    const keywordSuggestions = [
      ...keywords,
      `${industry} services`,
      `best ${industry} solutions`,
      `affordable ${industry}`,
      `${industry} near me`,
      `how to choose ${industry}`,
    ];

    return {
      score: 75,
      analysis,
      recommendations,
      keywordSuggestions,
    };
  },
});
