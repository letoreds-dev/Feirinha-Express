/**
 * Feirinha Express - Micro Interactions
 * Animations, transitions, and micro-interactions for delightful UX
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ==================== ANIMATION VARIANTS ====================

export const animationVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  fadeLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  fadeRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },

  scaleUp: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -20 },
  },

  // Slide animations
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },

  slideDown: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  },

  // Bounce
  bounce: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
  },
}

// ==================== SPRING TRANSITIONS ====================

export const springTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
}

export const smoothTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
}

// ==================== HOOKS ====================

/**
 * Animate number counting
 */
export function useCountUp(
  end: number,
  duration: number = 1000,
  start: number = 0,
  decimals: number = 0
) {
  const [count, setCount] = useState(start)
  const [isAnimating, setIsAnimating] = useState(false)
  const frameRef = useRef<number>()

  const startAnimation = useCallback(() => {
    setIsAnimating(true)
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * easeOut

      setCount(Number(current.toFixed(decimals)))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
  }, [end, start, duration, decimals])

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return { count, startAnimation, isAnimating }
}

/**
 * Typing effect
 */
export function useTypingEffect(
  text: string,
  speed: number = 50,
  delay: number = 0
) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsTyping(true)

    let timeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return { displayedText, isTyping }
}

/**
 * Shake animation hook
 */
export function useShake() {
  const [isShaking, setIsShaking] = useState(false)

  const shake = useCallback(() => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }, [])

  return { isShaking, shake }
}

/**
 * Pulse animation hook
 */
export function usePulse() {
  const [isPulsing, setIsPulsing] = useState(false)

  const pulse = useCallback(() => {
    setIsPulsing(true)
    setTimeout(() => setIsPulsing(false), 300)
  }, [])

  return { isPulsing, pulse }
}

/**
 * Hover scale effect
 */
export function useHoverScale(scale: number = 1.05) {
  const [isHovered, setIsHovered] = useState(false)

  return {
    isHovered,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      transform: isHovered ? `scale(${scale})` : 'scale(1)',
      transition: 'transform 0.2s ease',
    },
  }
}

/**
 * Press effect (scale down on click)
 */
export function usePressEffect() {
  const [isPressed, setIsPressed] = useState(false)

  return {
    isPressed,
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
    style: {
      transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      transition: 'transform 0.1s ease',
    },
  }
}

/**
 * Staggered children animation
 */
export function useStaggeredAnimation(
  childrenCount: number,
  delay: number = 50
) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount < childrenCount) {
      const timeout = setTimeout(() => {
        setVisibleCount(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [visibleCount, childrenCount, delay])

  return visibleCount
}

/**
 * In-view animation trigger
 */
export function useInView(threshold: number = 0.1) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// ==================== COMPONENTS ====================

interface AnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  const { count, startAnimation, isAnimating } = useCountUp(value, duration, 0, decimals)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!hasAnimated) {
      startAnimation()
      setHasAnimated(true)
    }
  }, [hasAnimated, startAnimation])

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{count.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}

interface AnimatedTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  cursor?: boolean
}

export function AnimatedText({
  text,
  speed = 50,
  delay = 0,
  className = '',
  cursor = true,
}: AnimatedTextProps) {
  const { displayedText, isTyping } = useTypingEffect(text, speed, delay)

  return (
    <span className={className}>
      {displayedText}
      {cursor && isTyping && <span className="animate-pulse">|</span>}
    </span>
  )
}

interface ShakingContainerProps {
  children: React.ReactNode
  shake: boolean
  className?: string
}

export function ShakingContainer({ children, shake, className = '' }: ShakingContainerProps) {
  return (
    <div
      className={className}
      style={{
        animation: shake ? 'shake 0.5s ease-in-out' : 'none',
      }}
    >
      {children}
    </div>
  )
}

// ==================== FEEDBACK EFFECTS ====================

interface SuccessAnimationProps {
  show: boolean
  onComplete?: () => void
  children?: React.ReactNode
}

export function SuccessAnimation({ show, onComplete, children }: SuccessAnimationProps) {
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    if (show) {
      setDisplay(true)
      const timeout = setTimeout(() => {
        onComplete?.()
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [show, onComplete])

  if (!display) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className="bg-white rounded-full p-8 shadow-2xl animate-scale-in"
        style={{
          animation: 'scaleIn 0.3s ease-out forwards',
        }}
      >
        <span className="text-6xl animate-bounce">✅</span>
      </div>
    </div>
  )
}

interface LoadingDotsProps {
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingDots({ color = 'text-brand-red', size = 'md' }: LoadingDotsProps) {
  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`${sizes[size]} ${color} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

interface PulseRingProps {
  color?: string
  size?: number
}

export function PulseRing({ color = '#FF6B6B', size = 40 }: PulseRingProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-75"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

// ==================== CSS KEYFRAMES (add to globals.css) ====================

/*
Add these keyframes to your globals.css or tailwind config:

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-shake { animation: shake 0.5s ease-in-out; }
.animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
.animate-fade-up { animation: fadeUp 0.3s ease-out forwards; }
*/

export const microInteractions = {
  // Button states
  buttonHover: 'hover:scale-105 hover:shadow-lg transition-all duration-200',
  buttonPress: 'active:scale-95 transition-transform duration-100',
  buttonDisabled: 'opacity-50 cursor-not-allowed',

  // Card states
  cardHover: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
  cardPress: 'active:scale-[0.98] transition-transform duration-100',

  // List items
  listItemHover: 'hover:bg-brand-soft transition-colors duration-200',
  listItemActive: 'bg-brand-soft',

  // Focus states
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2',

  // Loading
  loadingPulse: 'animate-pulse',
  loadingSpinner: 'animate-spin',
}
