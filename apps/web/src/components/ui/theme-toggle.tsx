'use client'

import { useTheme } from '@/store/theme'
import clsx from 'clsx'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'w-10 h-10 rounded-full flex items-center justify-center',
        'transition-all duration-300',
        'hover:scale-110 active:scale-95',
        'bg-brand-soft border border-brand-line',
        'text-lg'
      )}
      title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}