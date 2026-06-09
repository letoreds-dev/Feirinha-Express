'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { toast } from '@/components/ui/toast'

// ==================== ANIMATIONS ====================

export const animations = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  fadeUp: 'animate-fade-up',
  fadeDown: 'animate-fade-down',

  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  bounce: 'animate-bounce-soft',

  // Slide animations
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',

  // Spin
  spin: 'animate-spin-slow',

  // Pulse
  pulse: 'animate-pulse-soft',

  // Shimmer (loading)
  shimmer: 'animate-shimmer',
}

// ==================== MICRO-INTERACTIONS ====================

interface UseMicroInteractionOptions {
  onClick?: () => void
  onSuccess?: () => void
  onError?: () => void
  successMessage?: string
  errorMessage?: string
}

export function useMicroInteraction(options: UseMicroInteractionOptions = {}) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const trigger = useCallback(async (callback?: () => void) => {
    setIsAnimating(true)
    setState('loading')

    try {
      await callback?.()
      setState('success')
      options.onSuccess?.()
      if (options.successMessage) {
        toast.success(options.successMessage)
      }
    } catch {
      setState('error')
      options.onError?.()
      if (options.errorMessage) {
        toast.error(options.errorMessage)
      }
    } finally {
      setTimeout(() => {
        setIsAnimating(false)
        setState('idle')
      }, 1000)
    }
  }, [options])

  return {
    isAnimating,
    state,
    trigger,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
  }
}

// ==================== BUTTON STATES ====================

export function useButtonState() {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePress = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
  }

  const handleClick = async (callback: () => Promise<void> | void) => {
    setIsLoading(true)
    try {
      await callback()
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isPressed,
    isHovered,
    isLoading,
    isSuccess,
    handlePress,
    handleClick,
    setIsHovered,
  }
}

// ==================== TOUCH FEEDBACK ====================

export function useTouchFeedback() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const addRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    let x: number, y: number

    if ('touches' in event) {
      x = event.touches[0].clientX - rect.left
      y = event.touches[0].clientY - rect.top
    } else {
      x = event.clientX - rect.left
      y = event.clientY - rect.top
    }

    const id = Date.now()
    setRipples(prev => [...prev, { id, x, y }])

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 600)
  }, [])

  return { ripples, addRipple }
}

// ==================== LIKE/FAVORITE ANIMATION ====================

export function useFavoriteAnimation() {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const toggle = () => {
    setIsAnimating(true)
    setIsFavorite(prev => !prev)
    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos!')
    setTimeout(() => setIsAnimating(false), 500)
  }

  return { isFavorite, isAnimating, toggle }
}

// ==================== NUMBER COUNTER ====================

export function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  const start = useCallback(() => {
    if (hasStarted) return
    setHasStarted(true)

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, hasStarted])

  const reset = () => {
    setCount(0)
    setHasStarted(false)
  }

  return { count, start, reset }
}

// ==================== TYPEWRITER EFFECT ====================

export function useTypewriter(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const start = useCallback(() => {
    setIsTyping(true)
    let index = 0
    setDisplayedText('')

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  const reset = () => {
    setDisplayedText('')
    setIsTyping(false)
  }

  return { displayedText, isTyping, start, reset }
}

// ==================== HOVER TILT ====================

export function useHoverTilt() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 10
    const y = (e.clientX - rect.left - rect.width / 2) / 10
    setRotation({ x, y })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 })
  }, [])

  return {
    rotation,
    style: {
      transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      transition: 'transform 0.15s ease-out',
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  }
}

// ==================== SWIPE GESTURES ====================

export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
  }

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isSwiping: touchEnd !== null && Math.abs(touchStart! - touchEnd) > 10,
    direction: touchEnd !== null && touchStart !== null
      ? (touchStart - touchEnd > 0 ? 'left' : 'right')
      : null,
  }
}

// ==================== COPY TO CLIPBOARD ====================

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copiado para a área de transferência!')
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch {
      toast.error('Erro ao copiar')
      return false
    }
  }

  return { copied, copy }
}

// ==================== LONG PRESS ====================

export function useLongPress(
  callback: () => void,
  { threshold = 500 } = {}
) {
  const [isLongPressing, setIsLongPressing] = useState(false)
  const timeoutRef = { current: null as NodeJS.Timeout | null }
  const intervalRef = { current: null as NodeJS.Timeout | null }

  const start = useCallback(() => {
    setIsLongPressing(true)
    timeoutRef.current = setTimeout(() => {
      callback()
      // Continue calling periodically while pressed
      intervalRef.current = setInterval(callback, 100)
    }, threshold)
  }, [callback, threshold])

  const stop = useCallback(() => {
    setIsLongPressing(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  return {
    isLongPressing,
    handlers: {
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchEnd: stop,
    },
  }
}

// ==================== ANIMATED GRADIENT ====================

export function useAnimatedGradient(colors: string[], interval: number = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % colors.length)
    }, interval)

    return () => clearInterval(timer)
  }, [colors.length, interval])

  const currentColor = colors[currentIndex]
  const nextColor = colors[(currentIndex + 1) % colors.length]

  return {
    currentColor,
    nextColor,
    gradient: `linear-gradient(135deg, ${currentColor}, ${nextColor})`,
  }
}

// ==================== CONFETTI BURST ====================

export function useConfetti() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    color: string
    size: number
    angle: number
  }>>([])

  const burst = (x: number, y: number, count: number = 20) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
      size: Math.random() * 8 + 4,
      angle: (Math.random() * 360),
    }))

    setParticles(prev => [...prev, ...newParticles])

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)))
    }, 1000)
  }

  return { particles, burst }
}

// ==================== SHAKE ANIMATION ====================

export function useShake() {
  const [isShaking, setIsShaking] = useState(false)

  const shake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  return { isShaking, shake }
}

// ==================== PULSE ANIMATION ====================

export function usePulse() {
  const [isPulsing, setIsPulsing] = useState(false)

  const pulse = () => {
    setIsPulsing(true)
    setTimeout(() => setIsPulsing(false), 300)
  }

  return { isPulsing, pulse }
}

// ==================== SKELETON LOADING ====================

export function useSkeletonLoading(
  loading: boolean,
  fallback: ReactNode
) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    )
  }

  return fallback
}