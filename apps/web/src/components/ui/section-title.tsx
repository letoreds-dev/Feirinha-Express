import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  action?: { label: string; href: string }
  className?: string
}

export function SectionTitle({ eyebrow, title, action, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-3', className)}>
      {eyebrow && (
        <span className="text-xs font-extrabold uppercase text-brand-red">
          {eyebrow}
        </span>
      )}
      <div className="flex items-center justify-between">
        <h2 className={cn('text-2xl font-extrabold text-brand-ink mt-1 leading-tight', !eyebrow && 'text-3xl')}>
          {title}
        </h2>
        {action && (
          <a href={action.href} className="text-sm text-brand-red font-medium hover:underline">
            {action.label}
          </a>
        )}
      </div>
    </div>
  )
}