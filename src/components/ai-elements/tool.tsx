'use client'

import { cn } from '@/lib/utils'
import { type ReactNode, useState } from 'react'

interface ToolProps {
  children: ReactNode
  className?: string
}

export function Tool({ children, className }: ToolProps) {
  return (
    <div className={cn('rounded-lg border bg-muted/50 p-3', className)}>
      {children}
    </div>
  )
}

interface ToolHeaderProps {
  type: string
  state: string
  className?: string
}

export function ToolHeader({ type, state, className }: ToolHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between text-sm font-medium', className)}>
      <span className="text-muted-foreground">{type}</span>
      <span className="text-xs text-muted-foreground">{state}</span>
    </div>
  )
}

interface ToolContentProps {
  children: ReactNode
  className?: string
}

export function ToolContent({ children, className }: ToolContentProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('mt-2', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        {isOpen ? 'Hide details' : 'Show details'}
      </button>
      {isOpen && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  )
}

interface ToolInputProps {
  input: Record<string, unknown>
  className?: string
}

export function ToolInput({ input, className }: ToolInputProps) {
  return (
    <div className={cn('text-xs', className)}>
      <span className="font-medium">Input:</span>
      <pre className="mt-1 overflow-x-auto rounded bg-muted p-2">
        {JSON.stringify(input, null, 2)}
      </pre>
    </div>
  )
}

interface ToolOutputProps {
  output?: unknown
  errorText?: string
  className?: string
}

export function ToolOutput({ output, errorText, className }: ToolOutputProps) {
  return (
    <div className={cn('text-xs', className)}>
      {errorText ? (
        <div className="text-destructive">
          <span className="font-medium">Error:</span>
          <pre className="mt-1 overflow-x-auto rounded bg-destructive/10 p-2">{errorText}</pre>
        </div>
      ) : output ? (
        <div>
          <span className="font-medium">Output:</span>
          <pre className="mt-1 overflow-x-auto rounded bg-muted p-2">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
