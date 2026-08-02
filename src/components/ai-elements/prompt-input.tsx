'use client'

import { cn } from '@/lib/utils'
import { type ReactNode, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface PromptInputProps {
  children: ReactNode
  onSubmit: () => void
  className?: string
}

export function PromptInput({ children, onSubmit, className }: PromptInputProps) {
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        onSubmit()
      }}
      className={cn('relative', className)}
    >
      {children}
    </form>
  )
}

interface PromptInputBodyProps {
  children: ReactNode
  className?: string
}

export function PromptInputBody({ children, className }: PromptInputBodyProps) {
  return (
    <div className={cn('flex items-end gap-2', className)}>
      {children}
    </div>
  )
}

interface PromptInputTextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function PromptInputTextarea({
  value,
  onChange,
  placeholder = 'Type your message...',
  disabled = false,
  className,
}: PromptInputTextareaProps) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn('min-h-[60px] flex-1 resize-none', className)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          e.currentTarget.form?.requestSubmit()
        }
      }}
    />
  )
}

interface PromptInputSubmitProps {
  className?: string
  disabled?: boolean
}

export function PromptInputSubmit({ className, disabled }: PromptInputSubmitProps) {
  return (
    <Button type="submit" disabled={disabled} className={cn('shrink-0', className)}>
      Send
    </Button>
  )
}
