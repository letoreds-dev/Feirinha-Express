'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { toast } from './toast'

interface SpinWheelProps {
  onSpinEnd?: (prize: Prize | null) => void
  minBet?: number
}

interface Prize {
  id: string
  label: string
  probability: number
  type: 'discount' | 'freight' | 'points' | 'nudge' | 'nothing'
  value?: string | number | null
  color: string
}

const defaultPrizes: Prize[] = [
  { id: '1', label: '10% OFF', probability: 0.15, type: 'discount', value: 10, color: '#FF6B6B' },
  { id: '2', label: 'Frete Grátis', probability: 0.10, type: 'freight', value: 'free', color: '#4ECDC4' },
  { id: '3', label: '50 pontos', probability: 0.20, type: 'points', value: 50, color: '#FFE66D' },
  { id: '4', label: 'Tente novamente', probability: 0.25, type: 'nudge', value: null, color: '#95E1D3' },
  { id: '5', label: '5% OFF', probability: 0.15, type: 'discount', value: 5, color: '#F38181' },
  { id: '6', label: '100 pontos', probability: 0.10, type: 'points', value: 100, color: '#AA96DA' },
  { id: '7', label: '🍀 Sorte grande', probability: 0.03, type: 'discount', value: 25, color: '#FCBAD3' },
  { id: '8', label: 'Nada :(', probability: 0.02, type: 'nothing', value: null, color: '#A8D8EA' },
]

export function SpinWheel({ onSpinEnd, minBet = 0 }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [hasSpun, setHasSpun] = useState(false)
  const [dailySpins, setDailySpins] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wheelRef = useRef<{ prizes: Prize[]; ctx: CanvasRenderingContext2D | null }>({
    prizes: defaultPrizes,
    ctx: null,
  })

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    wheelRef.current.ctx = ctx
    const { prizes } = wheelRef.current

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10
    const sliceAngle = (2 * Math.PI) / prizes.length

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw slices
    prizes.forEach((prize, idx) => {
      const startAngle = idx * sliceAngle - Math.PI / 2
      const endAngle = startAngle + sliceAngle

      // Slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = prize.color
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#333'
      ctx.font = 'bold 12px sans-serif'
      ctx.fillText(prize.label, radius - 20, 4)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#FF6B6B'
    ctx.lineWidth = 3
    ctx.stroke()
  }, [])

  const spin = () => {
    if (isSpinning || dailySpins <= 0) return

    setIsSpinning(true)
    setDailySpins(prev => prev - 1)
    setHasSpun(true)

    // Calculate winning prize based on probabilities
    const { prizes } = wheelRef.current
    const random = Math.random()
    let cumulative = 0
    let winningIndex = prizes.length - 1

    for (let i = 0; i < prizes.length; i++) {
      cumulative += prizes[i].probability
      if (random <= cumulative) {
        winningIndex = i
        break
      }
    }

    // Calculate rotation
    const sliceAngle = 360 / prizes.length
    const targetRotation = 360 * 5 + (360 - winningIndex * sliceAngle - sliceAngle / 2)
    const duration = 4000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const currentRotation = targetRotation * easeOut

      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        const prize = prizes[winningIndex]
        onSpinEnd?.(prize)
        showPrizeResult(prize)
      }
    }

    requestAnimationFrame(animate)
  }

  const showPrizeResult = (prize: Prize) => {
    if (prize.type === 'nothing') {
      toast.info('Não foi desta vez! Tente amanhã.')
    } else if (prize.type === 'nudge') {
      toast.info('Quase! Gire novamente!')
      setDailySpins(prev => prev + 1) // Free spin
    } else {
      toast.success(`🎉 Você ganhou: ${prize.label}!`)
    }
  }

  return (
    <div className="text-center">
      {/* Daily spins */}
      <div className="mb-4">
        <p className="text-sm text-brand-muted mb-2">Giros disponíveis hoje</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map(day => (
            <div
              key={day}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                day <= dailySpins
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-muted'
              }`}
            >
              🎰
            </div>
          ))}
        </div>
      </div>

      {/* Wheel */}
      <div className="relative w-64 h-64 mx-auto mb-6">
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-brand-red mx-auto" />
        </div>

        {/* Wheel */}
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          className="w-full h-full transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: '0ms',
          }}
        />

        {/* Spin overlay */}
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <span className="text-3xl animate-pulse">🎯</span>
            </div>
          </div>
        )}
      </div>

      {/* Spin button */}
      <Button
        onClick={spin}
        disabled={isSpinning || dailySpins <= 0}
        className="px-8 py-4 text-lg"
      >
        {isSpinning ? '🎡 Girando...' : dailySpins > 0 ? '🎰 Girar!' : '😊 Amanhã mais!'}
      </Button>

      {/* Info */}
      <p className="text-xs text-brand-muted mt-4">
        {dailySpins > 0
          ? `Você tem ${dailySpins} giro${dailySpins > 1 ? 's' : ''} hoje!`
          : 'Volte amanhã para mais giros!'}
      </p>
    </div>
  )
}

// ==================== LUCKY NUMBER GAME ====================

interface LuckyNumberProps {
  onWin?: (prize: string) => void
}

export function LuckyNumber({ onWin }: LuckyNumberProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [gamesLeft, setGamesLeft] = useState(3)

  const numbers = Array.from({ length: 10 }, (_, i) => i)

  const play = () => {
    if (selectedNumber === null || isRevealing) return

    setIsRevealing(true)
    setGamesLeft(prev => prev - 1)

    // Reveal animation
    let count = 0
    const interval = setInterval(() => {
      setWinningNumber(Math.floor(Math.random() * 10))
      count++
      if (count >= 10) {
        clearInterval(interval)
        const finalNumber = Math.floor(Math.random() * 10)
        setWinningNumber(finalNumber)

        setTimeout(() => {
          setIsRevealing(false)
          if (finalNumber === selectedNumber) {
            toast.success('🎉 Parabéns! Você acertou!')
            onWin?.('10% OFF')
          } else {
            toast.info(`O número era ${finalNumber}. Tente novamente!`)
          }
        }, 500)
      }
    }, 100)
  }

  const reset = () => {
    setSelectedNumber(null)
    setWinningNumber(null)
  }

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4 text-center">🎰 Número da Sorte</h3>

      <p className="text-sm text-brand-muted text-center mb-4">
        Escolha um número de 0 a 9 e tente a sorte!
      </p>

      {/* Number grid */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {numbers.map(num => (
          <button
            key={num}
            onClick={() => !isRevealing && gamesLeft > 0 && setSelectedNumber(num)}
            disabled={isRevealing || gamesLeft <= 0}
            className={`aspect-square rounded-xl font-bold text-xl transition-all ${
              selectedNumber === num && !winningNumber
                ? 'bg-brand-red text-white scale-110'
                : winningNumber === num
                ? winningNumber === selectedNumber
                  ? 'bg-emerald-500 text-white scale-110'
                  : 'bg-red-100'
                : 'bg-brand-soft hover:bg-brand-line'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Winning number display */}
      <div className="text-center mb-4">
        {winningNumber !== null && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            winningNumber === selectedNumber
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700'
          }`}>
            <span className="text-sm">Número sorteado:</span>
            <span className="text-2xl font-extrabold">{winningNumber}</span>
          </div>
        )}
      </div>

      {/* Games left */}
      <p className="text-center text-sm text-brand-muted mb-4">
        Jogos restantes: {gamesLeft}
      </p>

      {/* Action button */}
      {winningNumber !== null && gamesLeft > 0 ? (
        <Button onClick={reset} variant="outline" className="w-full">
          Jogar novamente
        </Button>
      ) : (
        <Button
          onClick={play}
          disabled={selectedNumber === null || isRevealing || gamesLeft <= 0}
          className="w-full"
        >
          {isRevealing ? '🎰 Sorteando...' : 'Sortear!'}
        </Button>
      )}

      {gamesLeft <= 0 && (
        <p className="text-center text-sm text-brand-muted mt-4">
          Volte amanhã para mais jogos! 🎮
        </p>
      )}
    </Card>
  )
}

// ==================== PROMO BANNER GAME ====================

export function PromoGameBanner() {
  const [showGame, setShowGame] = useState(false)

  return (
    <>
      <Card
        padding="md"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => setShowGame(true)}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">🎰</span>
          <div className="flex-1">
            <p className="font-extrabold text-lg">Gire e ganhe!</p>
            <p className="text-white text-opacity-80 text-sm">
              Participate e ganhe prêmios exclusivos
            </p>
          </div>
          <span className="text-2xl">→</span>
        </div>
      </Card>

      {/* Game Modal */}
      {showGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card padding="lg" className="w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-brand-ink">🎰 Jogos Exclusivos</h3>
              <button
                onClick={() => setShowGame(false)}
                className="text-brand-muted hover:text-brand-ink"
              >
                ✕
              </button>
            </div>

            <SpinWheel onSpinEnd={(prize) => {
              // Handle prize
            }} />

            <div className="mt-4 pt-4 border-t border-brand-line">
              <LuckyNumber onWin={(prize) => {
                toast.success(`Você ganhou: ${prize}!`)
              }} />
            </div>
          </Card>
        </div>
      )}
    </>
  )
}