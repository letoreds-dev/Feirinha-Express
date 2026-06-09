import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  buttonText?: string
  onButtonClick?: () => void
}

export function SearchBar({ onClear, buttonText = 'Limpar', onButtonClick, className, ...props }: SearchBarProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_auto] gap-2 p-2',
        'bg-white rounded-xl border border-brand-line shadow-soft',
        className
      )}
    >
      <input
        className="h-10 px-3 border-0 outline-none placeholder:text-brand-muted"
        {...props}
      />
      {onClear && (
        <button
          onClick={onButtonClick || onClear}
          className="h-10 px-4 bg-brand-red text-white rounded-xl font-extrabold text-sm hover:bg-brand-red-dark transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}