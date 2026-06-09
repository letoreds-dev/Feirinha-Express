'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from './badge'

interface DeliveryEstimateProps {
  storeId?: string
  distance?: number
  onSelectTime?: (time: Date) => void
}

export function DeliveryTimeEstimator({
  storeId,
  distance = 2.5,
  onSelectTime,
}: DeliveryEstimateProps) {
  const [selectedOption, setSelectedOption] = useState<'now' | 'schedule'>('now')
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [isCalculating, setIsCalculating] = useState(true)
  const [estimate, setEstimate] = useState({ min: 25, max: 35 })

  useEffect(() => {
    // Simulate calculating delivery time based on distance
    const calculateTime = () => {
      setIsCalculating(true)
      setTimeout(() => {
        const baseTime = Math.round(15 + distance * 8)
        const min = Math.max(15, baseTime - 10)
        const max = baseTime + 10
        setEstimate({ min, max })
        setIsCalculating(false)
      }, 1000)
    }

    calculateTime()
  }, [distance])

  const timeSlots = [
    { label: 'Agora', value: 'now' },
    { label: 'Agendar', value: 'schedule' },
  ]

  const getAvailableSlots = () => {
    const now = new Date()
    const slots = []

    // Next 4 time slots (1 hour apart)
    for (let i = 0; i < 4; i++) {
      const time = new Date(now)
      time.setHours(now.getHours() + 1 + i, 0, 0, 0)
      slots.push(time)
    }

    // Tomorrow options
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)
    slots.push(tomorrow)

    const tomorrowAfternoon = new Date(tomorrow)
    tomorrowAfternoon.setHours(12, 0, 0, 0)
    slots.push(tomorrowAfternoon)

    return slots
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${formatTime(date)}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã às ${formatTime(date)}`
    }
    return date.toLocaleDateString('pt-BR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">🚚 Tempo de entrega</h3>

      {/* Option tabs */}
      <div className="flex gap-2 mb-4">
        {timeSlots.map(slot => (
          <button
            key={slot.value}
            onClick={() => setSelectedOption(slot.value as any)}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              selectedOption === slot.value
                ? 'bg-brand-red text-white'
                : 'bg-brand-soft text-brand-ink'
            }`}
          >
            {slot.label}
          </button>
        ))}
      </div>

      {/* Now option */}
      {selectedOption === 'now' && (
        <div className="animate-fade-up">
          {isCalculating ? (
            <div className="text-center py-4">
              <div className="text-3xl animate-bounce">⏱️</div>
              <p className="text-sm text-brand-muted mt-2">Calculando...</p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-brand-red to-red-600 text-white rounded-xl p-4 text-center">
              <p className="text-sm opacity-80">Entrega estimada em</p>
              <p className="text-3xl font-extrabold mt-1">
                {estimate.min}-{estimate.max} min
              </p>
              <p className="text-xs opacity-80 mt-2">
                📍 {distance.toFixed(1)} km de distância
              </p>
            </div>
          )}

          {/* Rush hour warning */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Horário de pico</p>
                <p className="text-xs text-yellow-700">
                  Pode levar mais tempo que o habitual
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule option */}
      {selectedOption === 'schedule' && (
        <div className="animate-fade-up space-y-4">
          <p className="text-sm text-brand-muted">
            Escolha um horário para receber seu pedido
          </p>

          {/* Today */}
          <div>
            <p className="text-xs font-medium text-brand-muted mb-2">HOJE</p>
            <div className="grid grid-cols-2 gap-2">
              {getAvailableSlots()
                .filter(s => s.getDate() === new Date().getDate())
                .map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedTime(slot)
                      onSelectTime?.(slot)
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedTime?.getTime() === slot.getTime()
                        ? 'border-brand-red bg-red-50'
                        : 'border-brand-line hover:border-brand-red'
                    }`}
                  >
                    <p className="font-bold text-brand-ink">{formatTime(slot)}</p>
                    <p className="text-xs text-brand-muted">
                      ~{estimate.min + 10}-{estimate.max + 10} min
                    </p>
                  </button>
                ))}
            </div>
          </div>

          {/* Tomorrow */}
          <div>
            <p className="text-xs font-medium text-brand-muted mb-2">AMANHÃ</p>
            <div className="grid grid-cols-2 gap-2">
              {getAvailableSlots()
                .filter(s => s.getDate() !== new Date().getDate())
                .map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedTime(slot)
                      onSelectTime?.(slot)
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedTime?.getTime() === slot.getTime()
                        ? 'border-brand-red bg-red-50'
                        : 'border-brand-line hover:border-brand-red'
                    }`}
                  >
                    <p className="font-bold text-brand-ink">{formatTime(slot)}</p>
                    <p className="text-xs text-brand-muted">
                      {slot.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </p>
                  </button>
                ))}
            </div>
          </div>

          {/* Selected time confirmation */}
          {selectedTime && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-bold text-emerald-800">
                    Pedido agendado
                  </p>
                  <p className="text-sm text-emerald-700">
                    {formatDate(selectedTime)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// ==================== LIVE DELIVERY TRACKER ====================

interface LiveTrackerProps {
  orderId: string
  estimatedTime: number
  driverName?: string
  driverPhone?: string
}

export function LiveDeliveryTracker({
  orderId,
  estimatedTime,
  driverName = 'Carlos',
  driverPhone = '(11) 99999-8888',
}: LiveTrackerProps) {
  const [currentTime, setCurrentTime] = useState(estimatedTime)
  const [status, setStatus] = useState<'confirmed' | 'preparing' | 'ready' | 'delivering'>('confirmed')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => Math.max(0, prev - 1))
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const formatTime = (minutes: number) => {
    if (minutes <= 0) return 'Chegou!'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const statuses = [
    { key: 'confirmed', label: 'Confirmado', icon: '✅', done: true },
    { key: 'preparing', label: 'Preparando', icon: '👨‍🍳', done: status !== 'confirmed' },
    { key: 'ready', label: 'Pronto', icon: '📦', done: status === 'ready' || status === 'delivering' },
    { key: 'delivering', label: 'Entregando', icon: '🛵', done: status === 'delivering' },
  ]

  return (
    <Card padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-brand-muted">Pedido #{orderId}</p>
          <p className="text-2xl font-extrabold text-brand-red">
            {formatTime(currentTime)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-brand-muted">Entregador</p>
          <p className="font-bold text-brand-ink">{driverName}</p>
          <a href={`tel:${driverPhone}`} className="text-sm text-brand-red">
            📞 Ligar
          </a>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {statuses.map((s, idx) => (
            <div key={s.key} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                s.done ? 'bg-brand-red text-white' : 'bg-brand-soft'
              }`}>
                {s.icon}
              </div>
              {idx < statuses.length - 1 && (
                <div className={`w-full h-1 mx-1 ${
                  statuses[idx + 1].done ? 'bg-brand-red' : 'bg-brand-soft'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-brand-muted">
          {statuses.map(s => (
            <span key={s.key}>{s.label}</span>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="h-32 bg-brand-soft rounded-xl flex items-center justify-center mb-4">
        <div className="text-center">
          <span className="text-4xl">🗺️</span>
          <p className="text-xs text-brand-muted mt-1">Mapa em tempo real</p>
        </div>
      </div>

      {/* Driver card */}
      <div className="flex items-center gap-4 p-3 bg-brand-soft rounded-xl">
        <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center text-white text-xl font-extrabold">
          {driverName.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-bold text-brand-ink">{driverName}</p>
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <span>⭐ 4.9</span>
            <span>•</span>
            <span>127 entregas</span>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`tel:${driverPhone}`}
            className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center"
          >
            📞
          </a>
          <a
            href={`https://wa.me/${driverPhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center"
          >
            💬
          </a>
        </div>
      </div>
    </Card>
  )
}