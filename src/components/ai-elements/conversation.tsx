'use client'

import { cn } from '@/lib/utils'
import { type ReactNode, useRef, useEffect } from 'react'

interface ConversationProps {
  children: ReactNode
  className?: string
}

export function Conversation({ children, className }: ConversationProps) {
  return (
    <div className={cn('flex flex-col overflow-hidden', className)}>
      {children}
    </div>
  )
}

interface ConversationContentProps {
  children: ReactNode
  className?: string
}

export function ConversationContent({ children, className }: ConversationContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [children])

  return (
    <div ref={scrollRef} className={cn('flex-1 overflow-y-auto', className)}>
      {children}
    </div>
  )
}

export function ConversationScrollButton() {
  return null
}
