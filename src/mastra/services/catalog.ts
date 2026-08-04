// Service catalog for Adroit AI Marketing Agency
// Each service has a price in USDC for agent payments

export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  price: string; // USDC amount (6 decimals)
  category: 'analytics' | 'content' | 'campaign' | 'consulting';
  endpoint: string;
  method: 'POST' | 'GET';
  requestSchema?: any;
  responseSchema?: any;
}

export const services: ServiceDefinition[] = [
  // Analytics Services
  {
    id: 'seo-analysis',
    name: 'SEO Analysis',
    description: 'Analyze website SEO performance and get optimization recommendations',
    price: '0.01',
    category: 'analytics',
    endpoint: '/api/services/seo-analysis',
    method: 'POST',
  },
  {
    id: 'campaign-audit',
    name: 'Campaign Audit',
    description: 'Comprehensive audit of ad campaign performance across platforms',
    price: '0.05',
    category: 'analytics',
    endpoint: '/api/services/campaign-audit',
    method: 'POST',
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis',
    description: 'Analyze competitor marketing strategies and identify opportunities',
    price: '0.03',
    category: 'analytics',
    endpoint: '/api/services/competitor-analysis',
    method: 'POST',
  },

  // Content Services
  {
    id: 'content-generation',
    name: 'Content Generation',
    description: 'Generate marketing content (social posts, blog articles, ad copy)',
    price: '0.02',
    category: 'content',
    endpoint: '/api/services/content-generation',
    method: 'POST',
  },
  {
    id: 'content-optimization',
    name: 'Content Optimization',
    description: 'Optimize existing content for better engagement and conversions',
    price: '0.01',
    category: 'content',
    endpoint: '/api/services/content-optimization',
    method: 'POST',
  },

  // Campaign Services
  {
    id: 'campaign-creation',
    name: 'Campaign Creation',
    description: 'Create and configure ad campaigns across multiple platforms',
    price: '0.10',
    category: 'campaign',
    endpoint: '/api/services/campaign-creation',
    method: 'POST',
  },
  {
    id: 'budget-optimization',
    name: 'Budget Optimization',
    description: 'Optimize ad spend allocation across campaigns and platforms',
    price: '0.05',
    category: 'campaign',
    endpoint: '/api/services/budget-optimization',
    method: 'POST',
  },
  {
    id: 'audience-targeting',
    name: 'Audience Targeting',
    description: 'Create and optimize audience targeting for ad campaigns',
    price: '0.03',
    category: 'campaign',
    endpoint: '/api/services/audience-targeting',
    method: 'POST',
  },

  // Consulting Services
  {
    id: 'marketing-strategy',
    name: 'Marketing Strategy',
    description: 'Get a comprehensive marketing strategy for your business',
    price: '0.20',
    category: 'consulting',
    endpoint: '/api/services/marketing-strategy',
    method: 'POST',
  },
  {
    id: 'growth-consultation',
    name: 'Growth Consultation',
    description: 'One-on-one consultation for growth marketing strategies',
    price: '0.50',
    category: 'consulting',
    endpoint: '/api/services/growth-consultation',
    method: 'POST',
  },
];

export function getServiceById(id: string): ServiceDefinition | undefined {
  return services.find(s => s.id === id);
}

export function getServicesByCategory(category: string): ServiceDefinition[] {
  return services.filter(s => s.category === category);
}

export function getServicePricing(): { id: string; name: string; price: string }[] {
  return services.map(s => ({ id: s.id, name: s.name, price: s.price }));
}
