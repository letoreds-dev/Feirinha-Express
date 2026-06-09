'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'

// ============================================
// MICRO-INTERACTIONS
// ============================================
// Animações sutis para feedback visual
// ============================================

// ============================================
// ANIMATED BUTTON
// ============================================

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  success?: boolean
  className?: string
}) {
  const [pressed, setPressed] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || success) return

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 600)

    onClick?.()
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  const variantClasses = {
    primary: 'bg-brand-red text-white hover:bg-brand-red/90',
    outline: 'border-2 border-brand-red text-brand-red hover:bg-brand-red/10',
    ghost: 'text-brand-red hover:bg-brand-red/10',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      disabled={loading || success}
      className={`
        relative overflow-hidden rounded-xl font-bold transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${pressed ? 'scale-95' : 'hover:scale-[1.02] active:scale-95'}
        ${loading ? 'opacity-70 cursor-wait' : ''}
        ${success ? 'bg-emerald-500' : ''}
        ${className}
      `}
    >
      {/* Ripples */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
          }}
        />
      ))}

      {/* Content */}
      <span className={`flex items-center justify-center gap-2 ${loading || success ? 'opacity-0' : ''}`}>
        {loading && <span className="animate-spin">⏳</span>}
        {success && '✅ '}
        {children}
      </span>
    </button>
  )
}

// ============================================
// LIKE BUTTON (HEART)
// ============================================

export function LikeButton({
  initialLiked = false,
  initialCount = 0,
  onToggle,
  size = 'md',
}: {
  initialLiked?: boolean
  initialCount?: number
  onToggle?: (liked: boolean, count: number) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [animating, setAnimating] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = () => {
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : count - 1

    setLiked(newLiked)
    setCount(newCount)

    if (newLiked) {
      setAnimating(true)
      // Create heart particles
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 40 - 20,
        y: Math.random() * -30 - 10,
      }))
      setParticles(prev => [...prev, ...newParticles])
      setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id))), 600)
    }

    setTimeout(() => setAnimating(false), 300)
    onToggle?.(newLiked, newCount)
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-14 h-14 text-2xl'
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        onClick={handleClick}
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          transition-all duration-200
          ${liked ? 'bg-red-50 text-red-500' : 'bg-brand-soft text-brand-muted hover:text-red-400'}
          ${animating ? 'scale-125' : 'hover:scale-110'}
        `}
      >
        {liked ? '❤️' : '🤍'}

        {/* Particles */}
        {particles.map(p => (
          <span
            key={p.id}
            className="absolute text-red-500 animate-particle pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
            }}
          >
            ❤️
          </span>
        ))}
      </button>
      {count > 0 && (
        <span className={`text-sm font-bold ${liked ? 'text-red-500' : 'text-brand-muted'}`}>
          {count}
        </span>
      )}
    </div>
  )
}

// ============================================
// ANIMATED TOGGLE
// ============================================

export function AnimatedToggle({
  checked = false,
  onChange,
  label,
  disabled = false,
}: {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
}) {
  const [isOn, setIsOn] = useState(checked)

  const handleToggle = () => {
    if (disabled) return
    const newState = !isOn
    setIsOn(newState)
    onChange?.(newState)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={disabled}
      className={`
        flex items-center gap-3
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div
        className={`
          relative w-14 h-8 rounded-full transition-all duration-300
          ${isOn ? 'bg-brand-red' : 'bg-brand-line'}
        `}
      >
        <div
          className={`
            absolute top-1 w-6 h-6 rounded-full bg-white shadow-md
            transition-all duration-300
            ${isOn ? 'left-7' : 'left-1'}
          `}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-brand-ink">{label}</span>
      )}
    </button>
  )
}

// ============================================
// ADD TO CART BUTTON
// ============================================

export function AddToCartButton({
  onAdd,
  disabled = false,
  showSuccess = true,
}: {
  onAdd?: () => void | Promise<void>
  disabled?: boolean
  showSuccess?: boolean
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleClick = async () => {
    if (state !== 'idle' || disabled) return

    setState('loading')

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 800))

    if (showSuccess) {
      setState('success')
      onAdd?.()
      setTimeout(() => setState('idle'), 1500)
    } else {
      setState('idle')
      onAdd?.()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={`
        px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2
        transition-all duration-200
        ${state === 'success'
          ? 'bg-emerald-500 text-white scale-105'
          : state === 'loading'
          ? 'bg-brand-red/70 text-white cursor-wait'
          : disabled
          ? 'bg-brand-line text-brand-muted cursor-not-allowed'
          : 'bg-brand-red text-white hover:bg-brand-red/90 hover:scale-[1.02] active:scale-95'
        }
      `}
    >
      {state === 'loading' && <span className="animate-spin">⏳</span>}
      {state === 'success' && '✓ Adicionado!'}
      {state === 'idle' && <>🛒 Adicionar</>}
    </button>
  )
}

// ============================================
// HEART BURST ANIMATION
// ============================================

export function HeartBurst({ active }: { active: boolean }) {
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number }[]>([])

  useEffect(() => {
    if (active) {
      const newHearts = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        delay: i * 50,
      }))
      setHearts(newHearts)
      setTimeout(() => setHearts([]), 1000)
    }
  }, [active])

  if (hearts.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map(heart => (
        <span
          key={heart.id}
          className="absolute top-1/2 left-1/2 text-2xl animate-heart-burst"
          style={{
            '--x': `${heart.x}px`,
            animationDelay: `${heart.delay}ms`,
          } as React.CSSProperties}
        >
          ❤️
        </span>
      ))}
    </div>
  )
}

// ============================================
// PROGRESS STEPS
// ============================================

export function ProgressSteps({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              transition-all duration-300
              ${index < currentStep
                ? 'bg-brand-red text-white'
                : index === currentStep
                ? 'bg-brand-red text-white ring-4 ring-brand-red/20'
                : 'bg-brand-line text-brand-muted'
              }
            `}
          >
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span className={`text-xs mt-1 ${index <= currentStep ? 'text-brand-ink' : 'text-brand-muted'}`}>
            {step}
          </span>
        </div>
      ))}

      {/* Connector lines */}
      <div className="flex-1 h-0.5 bg-brand-line -mt-6 mx-2">
        <div
          className="h-full bg-brand-red transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ============================================
// SWIPE TO REVEAL
// ============================================

export function SwipeToReveal({
  children,
  onReveal,
  label = 'Deslize para confirmar',
}: {
  children: React.ReactNode
  onReveal?: () => void
  label?: string
}) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)

  const maxOffset = (containerRef.current?.offsetWidth ?? 280) - 60

  const handleMove = (clientX: number) => {
    if (confirmed) return
    const newOffset = Math.max(0, Math.min(clientX - startX.current, maxOffset))
    setOffset(newOffset)
  }

  const handleEnd = () => {
    setDragging(false)
    if (offset > maxOffset * 0.8) {
      setConfirmed(true)
      onReveal?.()
    } else {
      setOffset(0)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl bg-brand-line"
    >
      {/* Background reveal */}
      <div
        className="absolute inset-0 bg-brand-red flex items-center justify-end pr-4"
        style={{ opacity: offset / maxOffset }}
      >
        <span className="text-white font-bold">✓</span>
      </div>

      {/* Content */}
      <div
        className={`relative bg-white transition-transform ${dragging ? 'transition-none' : ''}`}
        style={{ transform: `translateX(${offset}px)` }}
      >
        <div
          className="px-4 py-3 flex items-center gap-3"
          onMouseDown={(e) => {
            if (confirmed) return
            setDragging(true)
            startX.current = e.clientX - offset
          }}
          onMouseMove={(e) => dragging && handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => {
            if (confirmed) return
            setDragging(true)
            startX.current = e.touches[0].clientX - offset
          }}
          onTouchMove={(e) => dragging && handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          {/* Handle */}
          <div className={`
            w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center
            transition-all duration-200
            ${dragging ? 'scale-110' : ''}
          `}>
            <span className="text-brand-red">→</span>
          </div>

          {/* Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>

      {/* Confirmed state */}
      {confirmed && (
        <div className="absolute inset-0 bg-emerald-500 flex items-center justify-center">
          <span className="text-white font-bold text-lg">✓ Confirmado!</span>
        </div>
      )}
    </div>
  )
}

// ============================================
// ANIMATED COUNTER
// ============================================

export function AnimatedCounter({
  value,
  duration = 500,
  prefix = '',
  suffix = '',
}: {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(value)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      setDisplay(Math.round(start + (end - start) * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
    prevValue.current = value
  }, [value, duration])

  return (
    <span>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}

// ============================================
// SHAKE ON ERROR
// ============================================

export function ShakeOnError({
  children,
  hasError,
}: {
  children: React.ReactNode
  hasError: boolean
}) {
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (hasError) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }, [hasError])

  return (
    <div className={shaking ? 'animate-shake' : ''}>
      {children}
    </div>
  )
}

// ============================================
// DEMO PAGE
// ============================================

export default function MicroInteractionsDemo() {
  const [counter, setCounter] = useState(0)
  const [toggle, setToggle] = useState(false)
  const [likeLiked, setLikeLiked] = useState(false)

  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-line sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto p-4">
          <h1 className="text-lg font-extrabold text-brand-ink">✨ Micro-interactions</h1>
          <p className="text-sm text-brand-muted">Animações e feedback visual</p>
        </div>
      </div>

      <div className="max-w-[390px] mx-auto p-4 space-y-6">
        {/* Animated Button */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Animated Button
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            <AnimatedButton onClick={() => alert('Clicado!')}>Primary</AnimatedButton>
            <AnimatedButton variant="outline" onClick={() => alert('Clicado!')}>Outline</AnimatedButton>
            <AnimatedButton variant="ghost" onClick={() => alert('Clicado!')}>Ghost</AnimatedButton>
            <AnimatedButton loading>Carrregando...</AnimatedButton>
            <AnimatedButton success>Sucesso!</AnimatedButton>
          </div>
        </div>

        {/* Like Button */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Like Button (Heart)
          </div>
          <div className="p-4 flex items-center gap-6">
            <LikeButton
              initialLiked={likeLiked}
              initialCount={42}
              onToggle={(liked) => setLikeLiked(liked)}
            />
            <LikeButton size="lg" />
            <LikeButton size="sm" initialCount={128} />
          </div>
        </div>

        {/* Toggle */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Animated Toggle
          </div>
          <div className="p-4 flex flex-col gap-4">
            <AnimatedToggle
              checked={toggle}
              onChange={setToggle}
              label="Notificações"
            />
            <AnimatedToggle label="Modo escuro" />
            <AnimatedToggle checked={true} label="Ativado" />
            <AnimatedToggle disabled label="Desabilitado" />
          </div>
        </div>

        {/* Add to Cart */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Add to Cart Button
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            <AddToCartButton onAdd={() => alert('Adicionado!')} />
            <AddToCartButton showSuccess={false} onAdd={() => alert('Adicionado sem feedback!')} />
            <AddToCartButton disabled />
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Progress Steps
          </div>
          <div className="p-4 pt-8">
            <ProgressSteps
              steps={['Carrinho', 'Endereço', 'Pagamento', 'Confirmação']}
              currentStep={counter % 4}
            />
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setCounter(c => Math.max(0, c - 1))}
                className="px-3 py-1.5 bg-brand-soft rounded-lg text-sm"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setCounter(c => c + 1)}
                className="px-3 py-1.5 bg-brand-red text-white rounded-lg text-sm"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>

        {/* Swipe to Reveal */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Swipe to Confirm
          </div>
          <div className="p-4">
            <SwipeToReveal
              label="Deslize para confirmar pedido"
              onReveal={() => alert('Pedido confirmado!')}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📦</span>
                <div>
                  <p className="font-bold">Confirmar Pedido</p>
                  <p className="text-sm text-brand-muted">Pedido #1234 - R$ 89,90</p>
                </div>
              </div>
            </SwipeToReveal>
          </div>
        </div>

        {/* Animated Counter */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Animated Counter
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="text-center">
              <p className="text-4xl font-black text-brand-red">
                <AnimatedCounter value={counter * 1234} prefix="R$ " />
              </p>
              <p className="text-sm text-brand-muted">Valor total</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-brand-ink">
                <AnimatedCounter value={counter * 999} />
              </p>
              <p className="text-sm text-brand-muted">Itens vendidos</p>
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCounter(c => c - 1)}
                className="px-4 py-2 bg-brand-soft rounded-lg font-bold"
              >
                -
              </button>
              <button
                onClick={() => setCounter(c => c + 1)}
                className="px-4 py-2 bg-brand-red text-white rounded-lg font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Shake on Error */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Shake on Error
          </div>
          <div className="p-4">
            <ShakeOnError hasError={counter % 3 === 0}>
              <div className={`p-4 border-2 rounded-xl ${counter % 3 === 0 ? 'border-red-500' : 'border-brand-line'}`}>
                <p className="font-bold">Campo de exemplo</p>
                <p className="text-sm text-brand-muted">
                  {counter % 3 === 0 ? 'Erro detectado!' : 'Digite algo...'}
                </p>
              </div>
            </ShakeOnError>
            <p className="text-xs text-brand-muted mt-2">
              Clique em + 3 vezes para ver o shake
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">💡 Como funciona</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ripple effect nos botões</li>
            <li>• Coração com partículas ao favoritar</li>
            <li>• Toggle com animação suave</li>
            <li>• Contador animado com easing</li>
            <li>• Swipe para confirmar ações</li>
          </ul>
        </div>
      </div>
    </main>
  )
}