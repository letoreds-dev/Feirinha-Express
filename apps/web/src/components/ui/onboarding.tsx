/**
 * Feirinha Express - Complete Onboarding Flow
 * Welcome screens and first-time user experience
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import Link from 'next/link'

// ==================== TYPES ====================

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

interface OnboardingData {
  completed: boolean
  currentStep: number
  preferences: {
    notifications: boolean
    location: boolean
    favoriteCategories: string[]
  }
}

// ==================== ONBOARDING STEPS ====================

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo à Feirinha! 👋',
    description: 'Sua delivery app favorita com as melhores lojas da região.',
    icon: '🎉',
    features: [
      'Pedidos rápidos e fáceis',
      'Entrega em minutos',
      'Pagamento seguro',
    ],
  },
  {
    id: 'explore',
    title: 'Explore as melhores lojas 🏪',
    description: 'Encontre de tudo: lanches, pizzas, açaí, sushi e muito mais!',
    icon: '🔍',
    features: [
      'Filtros por categoria',
      'Avaliações reais',
      'Comparação de preços',
    ],
  },
  {
    id: 'order',
    title: 'Monte seu pedido 🛒',
    description: 'Adicione itens ao carrinho e receba em casa.',
    icon: '🍔',
    features: [
      'Carrinho inteligente',
      'Cupons de desconto',
      'Frete grátis',
    ],
  },
  {
    id: 'track',
    title: 'Acompanhe em tempo real 🚚',
    description: 'Veja cada etapa do seu pedido até a entrega.',
    icon: '📍',
    features: [
      'Status atualizado',
      'Tempo estimado',
      'Chat com entregador',
    ],
  },
]

// ==================== ONBOARDING SLIDER ====================

interface OnboardingSliderProps {
  onComplete: () => void
}

export function OnboardingSlider({ onComplete }: OnboardingSliderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const totalSteps = onboardingSteps.length

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        setIsAnimating(false)
      }, 200)
    } else {
      onComplete()
    }
  }

  const goPrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => prev - 1)
        setIsAnimating(false)
      }, 200)
    }
  }

  const step = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-brand-paper flex flex-col">
      {/* Progress bar */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-brand-muted mb-2">
          <span>{currentStep + 1} de {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-brand-line rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-red transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center justify-center px-6 transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-8xl mb-8 animate-bounce">
          {step.icon}
        </div>
        <h1 className="text-2xl font-extrabold text-brand-ink text-center mb-4">
          {step.title}
        </h1>
        <p className="text-brand-muted text-center mb-8 max-w-xs">
          {step.description}
        </p>

        {/* Features */}
        <div className="space-y-3 w-full max-w-xs">
          {step.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">
                ✓
              </span>
              <span className="text-brand-ink">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-3">
        <Button
          variant="primary"
          onClick={goNext}
          className="w-full"
        >
          {currentStep === totalSteps - 1 ? 'Começar!' : 'Próximo →'}
        </Button>

        <div className="flex justify-center gap-2">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true)
                setTimeout(() => {
                  setCurrentStep(index)
                  setIsAnimating(false)
                }, 200)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-brand-red w-6'
                  : 'bg-brand-line'
              }`}
            />
          ))}
        </div>

        {currentStep > 0 && (
          <button
            onClick={onComplete}
            className="w-full text-sm text-brand-muted hover:text-brand-red"
          >
            Pular introdução
          </button>
        )}
      </div>
    </div>
  )
}

// ==================== LOCATION PERMISSION STEP ====================

interface LocationPermissionProps {
  onAccept: () => void
  onSkip: () => void
}

export function LocationPermission({ onAccept, onSkip }: LocationPermissionProps) {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')

  const handleRequest = async () => {
    setStatus('requesting')
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      setStatus('granted')
      setTimeout(onAccept, 1500)
    } catch {
      setStatus('denied')
    }
  }

  return (
    <div className="min-h-screen bg-brand-paper flex flex-col items-center justify-center px-6">
      <div className="text-8xl mb-8">📍</div>
      <h1 className="text-2xl font-extrabold text-brand-ink text-center mb-4">
        Ative sua localização
      </h1>
      <p className="text-brand-muted text-center mb-8 max-w-xs">
        Para encontrar as melhores lojas perto de você
      </p>

      {status === 'idle' && (
        <>
          <Button variant="primary" onClick={handleRequest} className="w-full max-w-xs">
            Ativar localização
          </Button>
          <button onClick={onSkip} className="mt-4 text-sm text-brand-muted hover:text-brand-red">
            Pular por agora
          </button>
        </>
      )}

      {status === 'requesting' && (
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-line border-t-brand-red rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Solicitando...</p>
        </div>
      )}

      {status === 'granted' && (
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-emerald-600 font-medium">Localização ativada!</p>
        </div>
      )}

      {status === 'denied' && (
        <div className="text-center space-y-4">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-brand-muted">Não foi possível acessar sua localização</p>
          <Button variant="outline" onClick={handleRequest}>
            Tentar novamente
          </Button>
          <button onClick={onSkip} className="block w-full text-sm text-brand-muted hover:text-brand-red">
            Pular por agora
          </button>
        </div>
      )}
    </div>
  )
}

// ==================== CATEGORY SELECTION ====================

interface CategorySelectionProps {
  onComplete: (categories: string[]) => void
}

export function CategorySelection({ onComplete }: CategorySelectionProps) {
  const [selected, setSelected] = useState<string[]>([])

  const categories = [
    { id: 'burgers', name: 'Lanches', emoji: '🍔' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'acai', name: 'Açaí', emoji: '🧊' },
    { id: 'sushi', name: 'Sushi', emoji: '🍣' },
    { id: 'pasta', name: 'Massas', emoji: '🍝' },
    { id: 'desserts', name: 'Sobremesas', emoji: '🍰' },
    { id: 'drinks', name: 'Bebidas', emoji: '🥤' },
    { id: 'healthy', name: 'Saudável', emoji: '🥗' },
    { id: 'breakfast', name: 'Café', emoji: '☕' },
    { id: 'icecream', name: 'Sorvetes', emoji: '🍦' },
    { id: 'asian', name: 'Asiática', emoji: '🍜' },
    { id: 'bbq', name: 'Churrasco', emoji: '🥩' },
  ]

  const toggleCategory = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-20">
      <div className="p-6">
        <div className="text-6xl mb-4 text-center">🍽️</div>
        <h1 className="text-2xl font-extrabold text-brand-ink text-center mb-2">
          O que você mais gosta?
        </h1>
        <p className="text-brand-muted text-center mb-6">
          Selecione suas categorias favoritas
        </p>

        <div className="grid grid-cols-3 gap-3">
          {categories.map(cat => {
            const isSelected = selected.includes(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`
                  p-4 rounded-2xl flex flex-col items-center gap-2 transition-all
                  ${isSelected
                    ? 'bg-brand-red text-white scale-95'
                    : 'bg-white text-brand-ink hover:bg-brand-soft'
                  }
                `}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-medium">{cat.name}</span>
                {isSelected && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-white text-brand-red rounded-full text-xs flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-brand-paper">
        <Button
          variant="primary"
          onClick={() => onComplete(selected)}
          disabled={selected.length === 0}
          className="w-full"
        >
          Continuar ({selected.length} selecionada{selected.length !== 1 ? 's' : ''})
        </Button>
      </div>
    </div>
  )
}

// ==================== NOTIFICATION PERMISSION ====================

interface NotificationPermissionProps {
  onAccept: () => void
  onSkip: () => void
}

export function NotificationPermission({ onAccept, onSkip }: NotificationPermissionProps) {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')

  const handleRequest = async () => {
    setStatus('requesting')
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setStatus('granted')
      } else {
        setStatus('denied')
      }
    } catch {
      setStatus('denied')
    }
  }

  return (
    <div className="min-h-screen bg-brand-paper flex flex-col items-center justify-center px-6">
      <div className="text-8xl mb-8">🔔</div>
      <h1 className="text-2xl font-extrabold text-brand-ink text-center mb-4">
        Fique por dentro!
      </h1>
      <p className="text-brand-muted text-center mb-8 max-w-xs">
        Receba notificações sobre seus pedidos, promoções e novidades
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
          <span className="text-2xl">📦</span>
          <span className="text-sm text-brand-ink">Status do pedido em tempo real</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
          <span className="text-2xl">🎁</span>
          <span className="text-sm text-brand-ink">Promoções exclusivas</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
          <span className="text-2xl">⭐</span>
          <span className="text-sm text-brand-ink">Novas lojas e produtos</span>
        </div>
      </div>

      {status === 'idle' && (
        <>
          <Button variant="primary" onClick={handleRequest} className="w-full max-w-xs mt-8">
            Ativar notificações
          </Button>
          <button onClick={onSkip} className="mt-4 text-sm text-brand-muted hover:text-brand-red">
            Talvez depois
          </button>
        </>
      )}

      {status === 'requesting' && (
        <div className="mt-8 text-brand-muted">Solicitando...</div>
      )}

      {status === 'granted' && (
        <div className="mt-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-emerald-600 font-medium">Notificações ativadas!</p>
        </div>
      )}

      {status === 'denied' && (
        <div className="mt-8 text-center space-y-3">
          <p className="text-brand-muted">As notificações podem ser ativadas depois nas configurações.</p>
          <Button variant="outline" onClick={onSkip}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  )
}

// ==================== COMPLETE ONBOARDING PAGE ====================

interface CompleteOnboardingProps {
  onFinish: () => void
}

export function CompleteOnboarding({ onFinish }: CompleteOnboardingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-red to-red-700 flex flex-col items-center justify-center px-6">
      <div className="text-8xl mb-8 animate-bounce">
        🎊
      </div>
      <h1 className="text-3xl font-extrabold text-white text-center mb-4">
        Tudo pronto!
      </h1>
      <p className="text-white text-opacity-90 text-center mb-8">
        Sua conta foi configurada. Bom apetite! 🍽️
      </p>
      <Button
        variant="secondary"
        onClick={onFinish}
        className="w-full max-w-xs bg-white text-brand-red border-0"
      >
        Começar a pedir!
      </Button>
    </div>
  )
}

// ==================== FULL ONBOARDING FLOW ====================

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    completed: false,
    currentStep: 0,
    preferences: {
      notifications: false,
      location: false,
      favoriteCategories: [],
    },
  })

  useEffect(() => {
    const saved = localStorage.getItem('onboarding')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.completed) {
          setStep(-1) // Skip onboarding
        }
      } catch {}
    }
  }, [])

  const completeOnboarding = (data?: Partial<OnboardingData['preferences']>) => {
    const finalData = {
      ...onboardingData,
      completed: true,
      preferences: {
        ...onboardingData.preferences,
        ...data,
      },
    }
    localStorage.setItem('onboarding', JSON.stringify(finalData))
    setOnboardingData(finalData)
  }

  const finish = () => {
    window.location.href = '/user'
  }

  if (step === -1) {
    return null // Skip to app
  }

  if (step === 0) {
    return <OnboardingSlider onComplete={() => setStep(1)} />
  }

  if (step === 1) {
    return <LocationPermission onAccept={() => {
      setOnboardingData(prev => ({ ...prev, preferences: { ...prev.preferences, location: true } }))
      setStep(2)
    }} onSkip={() => setStep(2)} />
  }

  if (step === 2) {
    return <CategorySelection onComplete={(categories) => {
      setOnboardingData(prev => ({ ...prev, preferences: { ...prev.preferences, favoriteCategories: categories } }))
      setStep(3)
    }} />
  }

  if (step === 3) {
    return <NotificationPermission onAccept={() => {
      completeOnboarding({ notifications: true })
      setStep(4)
    }} onSkip={() => {
      completeOnboarding()
      setStep(4)
    }} />
  }

  if (step === 4) {
    return <CompleteOnboarding onFinish={finish} />
  }

  return null
}

// ==================== ONBOARDING DEMO PAGE ====================

export default function OnboardingDemoPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  if (showOnboarding) {
    return <OnboardingFlow />
  }

  return (
    <main className="min-h-screen bg-brand-paper flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="text-8xl">🎉</div>
        <h1 className="text-2xl font-extrabold text-brand-ink">Feirinha Express</h1>
        <p className="text-brand-muted max-w-xs">
          Bem-vindo! Toque no botão abaixo para iniciar o tour.
        </p>
        <Button variant="primary" onClick={() => setShowOnboarding(true)} className="w-full">
          Iniciar Tour
        </Button>
        <Link href="/user" className="block text-brand-red hover:underline">
          Pular para o app →
        </Link>
      </div>
    </main>
  )
}