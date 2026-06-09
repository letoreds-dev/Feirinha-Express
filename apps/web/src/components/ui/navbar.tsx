'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface NavBarProps {
  children: ReactNode
  className?: string
}

export function NavBar({ children, className }: NavBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full max-w-[430px] mx-auto',
        'bg-white/95 backdrop-blur-xl',
        'border-b border-brand-line',
        'shadow-sm',
        className
      )}
    >
      <div className="px-4 py-3">
        {children}
      </div>
    </header>
  )
}
