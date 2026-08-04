// Services API Route Handler
// Provides pay-per-call marketing services for AI agents

import { NextRequest, NextResponse } from 'next/server';
import { services, getServiceById, getServicePricing } from '@/mastra/services/catalog';
import { verifyPayment, createPaymentRequiredResponse, withPayment } from '../payments/middleware';

// GET /api/services - List all available services
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  // List all services
  if (!action || action === 'list') {
    return NextResponse.json({
      services: services.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        category: s.category,
        endpoint: s.endpoint,
        method: s.method,
      })),
      total: services.length,
    });
  }

  // Get pricing for all services
  if (action === 'pricing') {
    return NextResponse.json({
      pricing: getServicePricing(),
      currency: 'USDC',
      chain: 'ARC_TESTNET',
    });
  }

  // Get specific service details
  if (action === 'details') {
    const serviceId = url.searchParams.get('serviceId');
    if (!serviceId) {
      return NextResponse.json(
        { error: "serviceId parameter required" },
        { status: 400 }
      );
    }

    const service = getServiceById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: `Service not found: ${serviceId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  }

  return NextResponse.json(
    { error: "Invalid action" },
    { status: 400 }
  );
}

// POST /api/services - Execute a service (requires payment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, params } = body;

    if (!serviceId) {
      return NextResponse.json(
        { error: "serviceId is required" },
        { status: 400 }
      );
    }

    const service = getServiceById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: `Service not found: ${serviceId}` },
        { status: 404 }
      );
    }

    // Verify payment
    const paymentResult = await verifyPayment(request, service.price);

    if (!paymentResult.verified) {
      return createPaymentRequiredResponse(
        service.id,
        service.price,
        process.env.SELLER_ADDRESS || "0x0077777d7EBA4688BDeF3E311b846F25870A19B9",
        "ARC_TESTNET"
      );
    }

    // Execute the service
    const result = await executeService(serviceId, params || {});

    return NextResponse.json({
      success: true,
      serviceId,
      payment: {
        verified: true,
        amount: service.price,
        payer: paymentResult.payerAddress,
        transactionHash: paymentResult.transactionHash,
      },
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Service execution functions
async function executeService(serviceId: string, params: any): Promise<any> {
  // In production, these would call the actual AI agent/tools
  // For now, return mock results

  switch (serviceId) {
    case 'seo-analysis':
      return {
        score: 75,
        recommendations: [
          "Optimize meta descriptions for target keywords",
          "Improve page load speed",
          "Add structured data markup",
        ],
        technicalIssues: 3,
        contentGaps: 5,
      };

    case 'campaign-audit':
      return {
        overallScore: 82,
        platforms: {
          google: { score: 85, spend: 1500, conversions: 45 },
          meta: { score: 78, spend: 1200, conversions: 38 },
        },
        recommendations: [
          "Increase budget on high-performing Google campaigns",
          "Pause underperforming Meta ad sets",
          "Test new audience segments",
        ],
      };

    case 'content-generation':
      return {
        content: {
          socialMedia: [
            "🚀 Ready to transform your marketing? AI-powered insights are here!",
            "📊 Data-driven decisions = Better ROI. Let's optimize your campaigns!",
          ],
          blogPost: {
            title: "How AI is Revolutionizing Marketing for Small Businesses",
            summary: "Discover how artificial intelligence can help your business grow...",
          },
        },
        wordCount: 1500,
        readingTime: "6 min",
      };

    case 'marketing-strategy':
      return {
        strategy: {
          objectives: ["Increase brand awareness", "Drive qualified leads", "Improve conversion rate"],
          channels: ["Content Marketing", "Paid Ads", "Email Marketing", "Social Media"],
          budget: {
            recommended: 5000,
            allocation: {
              content: 30,
              paidAds: 40,
              email: 15,
              social: 15,
            },
          },
          timeline: "3 months",
        },
        kpis: [
          { metric: "Website Traffic", target: "+50%", current: "10,000/month" },
          { metric: "Lead Generation", target: "200/month", current: "80/month" },
          { metric: "Conversion Rate", target: "3%", current: "1.8%" },
        ],
      };

    default:
      return { message: `Service ${serviceId} executed successfully` };
  }
}
