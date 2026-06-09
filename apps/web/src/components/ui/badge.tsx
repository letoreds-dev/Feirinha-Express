import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error' | 'filled' | 'outline' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-brand-muted',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
    error: 'bg-red-100 text-red-600',
    filled: 'bg-brand-red text-white',
    outline: 'bg-transparent border border-brand-red text-brand-red',
    danger: 'bg-red-100 text-red-600',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-extrabold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}