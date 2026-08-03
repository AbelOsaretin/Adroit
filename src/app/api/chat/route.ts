import { handleChatStream } from '@mastra/ai-sdk'
import { createUIMessageStreamResponse } from 'ai'
import { mastra } from '@/mastra'

export async function POST(req: Request) {
  const params = await req.json()

  // Extract userId from params or use a default for demo
  const userId = params.userId || 'default-user'
  const threadId = params.threadId || `thread-${userId}`

  const stream = await handleChatStream({
    mastra,
    agentId: 'campaignOptimizerAgent',
    params: {
      ...params,
      memory: {
        resource: userId,
        thread: threadId,
      },
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createUIMessageStreamResponse({ stream: stream as any })
}

export async function GET() {
  return Response.json([])
}
