import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-extrabold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-brand-red text-white hover:bg-brand-red-dark active:scale-95',
    secondary: 'bg-white text-brand-red border border-red-200 hover:bg-brand-soft',
    ghost: 'bg-transparent text-brand-muted hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'bg-transparent text-brand-red border border-brand-red hover:bg-red-50',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-14 px-6 text-lg',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⟳</span>
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}