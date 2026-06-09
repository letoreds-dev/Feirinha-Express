import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function Card({ children, className, padding = 'md', onClick }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-brand-line',
        'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]',
        'transition-all duration-200',
        paddingStyles[padding],
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
