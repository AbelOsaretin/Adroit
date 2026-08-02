'use client'

import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface MessageProps {
  from: 'user' | 'assistant'
  children: ReactNode
  className?: string
}

export function Message({ from, children, className }: MessageProps) {
  return (
    <div className={cn('flex w-full gap-4', from === 'user' ? 'justify-end' : 'justify-start', className)}>
      {children}
    </div>
  )
}

interface MessageContentProps {
  children: ReactNode
  className?: string
}

export function MessageContent({ children, className }: MessageContentProps) {
  return (
    <div className={cn('max-w-[80%] rounded-lg px-4 py-2', className)}>
      {children}
    </div>
  )
}

interface MessageResponseProps {
  children: ReactNode
  className?: string
}

export function MessageResponse({ children, className }: MessageResponseProps) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert', className)}>
      {children}
    </div>
  )
}
