'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: ReactNode
  threshold?: number
  className?: string
}

/**
 * Componente que detecta o gesto de "puxar para baixo" e dispara refresh
 * Funciona em mobile e desktop (com mouse drag)
 */
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const isPulling = pullDistance > 0

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isRefreshing) return
      if (container.scrollTop > 0) return

      currentY.current = e.touches[0].clientY
      const distance = Math.max(0, currentY.current - startY.current)

      // Resistência para movimento mais natural
      const resistedDistance = Math.min(distance * 0.5, threshold * 1.5)
      setPullDistance(resistedDistance)
    }

    const handleTouchEnd = async () => {
      if (isRefreshing) return
      if (pullDistance >= threshold) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }
      setPullDistance(0)
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onRefresh, pullDistance, isRefreshing, threshold])

  const progress = Math.min((pullDistance / threshold) * 100, 100)
  const isReady = pullDistance >= threshold

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
    >
      {/* Indicador de pull */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-10 transition-transform"
        style={{
          top: -50,
          transform: `translateY(${pullDistance}px)`,
          height: 50
        }}
      >
        <div
          className={`
            w-10 h-10 rounded-full bg-brand-red text-white
            flex items-center justify-center text-lg
            shadow-lg
            ${isRefreshing ? 'animate-spin' : ''}
            ${isReady ? 'scale-110' : 'scale-100'}
            transition-transform
          `}
        >
          {isRefreshing ? '⟳' : progress >= 100 ? '↓' : '↻'}
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling && !isRefreshing ? 'none' : 'transform 0.2s ease'
        }}
      >
        {children}
      </div>
    </div>
  )
}