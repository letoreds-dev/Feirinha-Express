'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

interface ToastStore {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
}

// Simple state management
let toasts: ToastProps[] = []
let listeners: ((toasts: ToastProps[]) => void)[] = []

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]))
}

export const toastStore: ToastStore = {
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    toasts = [...toasts, { ...toast, id }]
    notifyListeners()
  },
  removeToast: (id) => {
    toasts = toasts.filter(t => t.id !== id)
    notifyListeners()
  }
}

export const toast = {
  success: (title: string, message?: string) => {
    toastStore.addToast({ type: 'success', title, message })
  },
  error: (title: string, message?: string) => {
    toastStore.addToast({ type: 'error', title, message })
  },
  info: (title: string, message?: string) => {
    toastStore.addToast({ type: 'info', title, message })
  },
  warning: (title: string, message?: string) => {
    toastStore.addToast({ type: 'warning', title, message })
  }
}

// Hook para usar toast
export function useToast() {
  return {
    success: (title: string, message?: string) => toast.success(title, message),
    error: (title: string, message?: string) => toast.error(title, message),
    info: (title: string, message?: string) => toast.info(title, message),
    warning: (title: string, message?: string) => toast.warning(title, message),
  }
}

// Toast item component
function ToastItem({ toast, onClose }: { toast: ToastProps; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 4000)
    return () => clearTimeout(timer)
  }, [toast.duration, onClose])

  const typeStyles = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500'
  }

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  }

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg text-white max-w-sm',
        'animate-slide-in transform transition-all duration-300',
        typeStyles[toast.type]
      )}
    >
      <span className="text-lg font-bold">{typeIcons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-xs opacity-90 mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  )
}

// Toast container - must be used in a client component
export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    listeners.push(setCurrentToasts)
    setCurrentToasts([...toasts])
    return () => {
      listeners = listeners.filter(l => l !== setCurrentToasts)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {currentToasts.map(t => (
        <ToastItem
          key={t.id}
          toast={t}
          onClose={() => toastStore.removeToast(t.id)}
        />
      ))}
    </div>
  )
}