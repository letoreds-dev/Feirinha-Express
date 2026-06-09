import { cn } from '@/lib/utils'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  active?: boolean
}

export function Chip({ children, active, className, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        'flex-0-auto inline-flex items-center h-9 px-4 rounded-full',
        'border border-brand-line bg-white font-extrabold text-sm text-brand-muted',
        'transition-colors duration-200',
        active
          ? 'bg-brand-red text-white border-brand-red'
          : 'hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}