'use client'

import { useEffect, useState } from 'react'
import { DefaultChatTransport, ToolUIPart } from 'ai'
import { useChat } from '@ai-sdk/react'

import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation'
import { PromptInput, PromptInputBody, PromptInputTextarea } from '@/components/ai-elements/prompt-input'
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool'
import { Button } from '@/components/ui/button'

export default function DashboardChatPage() {
  const [input, setInput] = useState<string>('')

  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch('/api/chat')
      const data = await res.json()
      setMessages([...data])
    }
    fetchMessages()
  }, [setMessages])

  const handleSubmit = async () => {
    if (!input.trim()) return

    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="relative h-[calc(100vh-12rem)]">
      <div className="flex h-full flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Marketing Assistant</h1>
          <p className="text-muted-foreground">
            Ask me about marketing strategy, content creation, SEO, or ad campaigns
          </p>
        </div>

        <Conversation className="h-full flex-1">
          <ConversationContent>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="max-w-md space-y-4">
                  <h2 className="text-xl font-semibold">How can I help?</h2>
                  <p className="text-muted-foreground">
                    I can help you with marketing strategy, content creation, SEO analysis,
                    and managing your ad campaigns.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      'Create a marketing strategy',
                      'Analyze my Google Ads performance',
                      'Generate social media content',
                      'Get content ideas',
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(suggestion)
                          setTimeout(() => {
                            sendMessage({ text: suggestion })
                          }, 100)
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id}>
                {message.parts?.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <Message key={`${message.id}-${i}`} from={message.role as 'user' | 'assistant'}>
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                      </Message>
                    )
                  }

                  if (part.type?.startsWith('tool-')) {
                    const toolPart = part as ToolUIPart
                    const toolInput = (toolPart.input || {}) as Record<string, unknown>
                    return (
                      <Tool key={`${message.id}-${i}`}>
                        <ToolHeader
                          type={toolPart.type}
                          state={toolPart.state || 'output-available'}
                          className="cursor-pointer"
                        />
                        <ToolContent>
                          <ToolInput input={toolInput} />
                          <ToolOutput
                            output={toolPart.output}
                            errorText={toolPart.errorText}
                          />
                        </ToolContent>
                      </Tool>
                    )
                  }

                  return null
                })}
              </div>
            ))}
            <ConversationScrollButton />
          </ConversationContent>
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              className="md:leading-10"
              value={input}
              placeholder="Ask me about marketing strategy, content creation, SEO, or ad campaigns..."
              disabled={status !== 'ready'}
            />
            <Button type="submit" disabled={status !== 'ready' || !input.trim()}>
              Send
            </Button>
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  )
}
