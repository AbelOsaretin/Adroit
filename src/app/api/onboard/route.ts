import { NextRequest, NextResponse } from 'next/server'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'

interface OnboardingData {
  companyName: string
  industry: string
  website: string
  companySize: string
  logo: string
  currentChannels: string[]
  monthlyBudget: string
  painPoints: string
  marketingGoals: string[]
  targetAudience: string
  competitors: string
  instagram: string
  facebook: string
  twitter: string
  linkedin: string
  tiktok: string
  brandPrimaryColor: string
  brandSecondaryColor: string
  brandVoice: string
}

function buildWorkingMemory(data: OnboardingData): string {
  const socialHandles = [
    data.instagram && `- Instagram: ${data.instagram}`,
    data.facebook && `- Facebook: ${data.facebook}`,
    data.twitter && `- Twitter/X: ${data.twitter}`,
    data.linkedin && `- LinkedIn: ${data.linkedin}`,
    data.tiktok && `- TikTok: ${data.tiktok}`,
  ]
    .filter(Boolean)
    .join('\n')

  return `# Business Profile

## Company Info
- Name: ${data.companyName}
- Industry: ${data.industry}
- Website: ${data.website}
- Size: ${data.companySize}

## Marketing Context
- Current Channels: ${data.currentChannels.join(', ') || 'None'}
- Monthly Budget: ${data.monthlyBudget}
- Goals: ${data.marketingGoals.join(', ')}
- Target Audience: ${data.targetAudience || 'Not specified'}
- Pain Points: ${data.painPoints || 'Not specified'}
- Competitors: ${data.competitors || 'Not specified'}

## Brand & Assets
- Primary Color: ${data.brandPrimaryColor}
- Secondary Color: ${data.brandSecondaryColor}
- Brand Voice: ${data.brandVoice}
${socialHandles ? `\n## Social Media\n${socialHandles}` : ''}
`
}

export async function POST(request: NextRequest) {
  try {
    const data: OnboardingData = await request.json()

    // Generate a simple user ID (in production, use auth)
    const userId = `user-${Date.now()}`
    const threadId = `onboard-${userId}`

    // Create memory instance with persistent storage
    const memory = new Memory({
      storage: new LibSQLStore({
        id: 'mastra-storage',
        url: 'file:./mastra.db',
      }),
      options: {
        workingMemory: {
          enabled: true,
          scope: 'resource',
        },
      },
    })

    // Create thread with working memory
    await memory.createThread({
      threadId,
      resourceId: userId,
      title: `${data.companyName} - Business Profile`,
      metadata: {
        workingMemory: buildWorkingMemory(data),
        onboardingComplete: true,
        onboardingDate: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      userId,
      threadId,
      message: 'Onboarding complete. Business profile saved.',
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
