import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-bold text-brand-ink">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full h-11 px-4 rounded-xl border bg-white',
          'border-brand-line focus:border-brand-red focus:outline-none',
          'placeholder:text-brand-muted',
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}