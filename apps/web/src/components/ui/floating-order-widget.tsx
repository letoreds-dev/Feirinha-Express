/**
 * Feirinha Express - Floating Order Widget
 * Persistent widget showing active order status
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== TYPES ====================

interface ActiveOrder {
  id: string
  storeName: string
  storeEmoji: string
  status: 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered'
  estimatedMinutes: number
  itemsCount: number
  total: number
}

// ==================== FLOATING ORDER WIDGET ====================

interface FloatingOrderWidgetProps {
  onClick?: () => void
  onClose?: () => void
  order?: ActiveOrder | null
}

export function FloatingOrderWidget({ onClick, onClose, order }: FloatingOrderWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)

  // Simulated active order
  const activeOrder = order || {
    id: 'PED-2024-001234',
    storeName: 'Burguer House',
    storeEmoji: '🍔',
    status: 'delivering',
    estimatedMinutes: 12,
    itemsCount: 3,
    total: 89.70,
  }

  useEffect(() => {
    setTimeLeft(activeOrder.estimatedMinutes)
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 60000)
    return () => clearInterval(interval)
  }, [activeOrder.estimatedMinutes])

  if (!isVisible) return null

  const statusConfig = {
    confirmed: { color: 'bg-blue-500', label: 'Confirmado', icon: '✓' },
    preparing: { color: 'bg-yellow-500', label: 'Preparando', icon: '👨‍🍳' },
    ready: { color: 'bg-emerald-500', label: 'Pronto', icon: '📦' },
    delivering: { color: 'bg-brand-red', label: 'Em entrega', icon: '🛵' },
    delivered: { color: 'bg-green-500', label: 'Entregue', icon: '✅' },
  }

  const status = statusConfig[activeOrder.status]

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-24 right-4 z-40"
        onClick={() => setIsMinimized(false)}
      >
        <div className={`${status.color} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform`}>
          <span className="text-2xl">{activeOrder.storeEmoji}</span>
          <div>
            <p className="font-bold text-sm">{activeOrder.storeName}</p>
            <p className="text-xs opacity-80">{timeLeft} min restantes</p>
          </div>
          <span className="text-lg animate-bounce">→</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 max-w-[320px]">
      <Card padding="md" className="shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeOrder.storeEmoji}</span>
            <div>
              <p className="font-bold text-brand-ink">{activeOrder.storeName}</p>
              <p className="text-xs text-brand-muted">{activeOrder.id}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center hover:bg-brand-line"
            >
              −
            </button>
            <button
              onClick={() => {
                setIsVisible(false)
                onClose?.()
              }}
              className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center hover:bg-red-100 text-red-500"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${status.color} flex items-center justify-center text-white`}>
            {status.icon}
          </div>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">{status.label}</p>
            <p className="text-sm text-brand-muted">Chegada em {timeLeft} min</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-brand-red">{timeLeft}</p>
            <p className="text-xs text-brand-muted">min</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-brand-muted mb-1">
            <span>Loja</span>
            <span>A caminho</span>
            <span>Você</span>
          </div>
          <div className="h-2 bg-brand-soft rounded-full overflow-hidden">
            <div
              className={`h-full ${status.color} transition-all duration-500`}
              style={{
                width: activeOrder.status === 'confirmed' ? '20%' :
                       activeOrder.status === 'preparing' ? '40%' :
                       activeOrder.status === 'ready' ? '60%' :
                       activeOrder.status === 'delivering' ? '85%' : '100%'
              }}
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="flex items-center justify-between py-3 border-t border-brand-line">
          <div>
            <p className="text-sm text-brand-muted">{activeOrder.itemsCount} item(ns)</p>
            <p className="font-bold text-brand-ink">R$ {activeOrder.total.toFixed(2).replace('.', ',')}</p>
          </div>
          <Button size="sm" onClick={onClick}>
            Ver detalhes
          </Button>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 pt-3 border-t border-brand-line">
          <button className="flex-1 py-2 rounded-lg bg-brand-soft text-brand-ink text-sm font-medium hover:bg-brand-line">
            📞 Ligar
          </button>
          <button className="flex-1 py-2 rounded-lg bg-brand-soft text-brand-ink text-sm font-medium hover:bg-brand-line">
            💬 Chat
          </button>
        </div>
      </Card>
    </div>
  )
}

// ==================== ORDER TIMELINE COMPACT ====================

interface OrderTimelineCompactProps {
  status: ActiveOrder['status']
}

export function OrderTimelineCompact({ status }: OrderTimelineCompactProps) {
  const steps = [
    { key: 'confirmed', icon: '✓', label: 'Confirmado' },
    { key: 'preparing', icon: '👨‍🍳', label: 'Preparando' },
    { key: 'ready', icon: '📦', label: 'Pronto' },
    { key: 'delivering', icon: '🛵', label: 'Entregando' },
    { key: 'delivered', icon: '🏠', label: 'Entregue' },
  ]

  const currentIndex = steps.findIndex(s => s.key === status)

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isCurrent
                    ? 'bg-brand-red text-white ring-4 ring-red-200'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-brand-soft text-brand-muted'
                }`}
              >
                {step.icon}
              </div>
              <span className={`text-xs mt-1 ${isCompleted ? 'text-brand-ink' : 'text-brand-muted'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${index < currentIndex ? 'bg-emerald-500' : 'bg-brand-soft'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ==================== DELIVERY ESTIMATE CALCULATOR ====================

interface DeliveryEstimateProps {
  distance: number // in km
  timeOfDay: 'breakfast' | 'lunch' | 'afternoon' | 'dinner' | 'night'
}

export function DeliveryEstimateCalculator({ distance, timeOfDay }: DeliveryEstimateProps) {
  // Base time calculation
  let baseTime = distance * 3 // 3 min per km base

  // Rush hour multipliers
  const rushMultipliers = {
    breakfast: 1.2,
    lunch: 1.5,
    afternoon: 1.1,
    dinner: 1.6,
    night: 1.0,
  }

  const multiplier = rushMultipliers[timeOfDay]
  const estimatedTime = Math.ceil(baseTime * multiplier)

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }

  return (
    <Card padding="md" className="bg-gradient-to-br from-brand-soft to-white">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-brand-red text-white flex items-center justify-center text-2xl">
          🚚
        </div>
        <div className="flex-1">
          <p className="text-sm text-brand-muted">Tempo estimado</p>
          <p className="text-2xl font-extrabold text-brand-ink">
            {formatTime(estimatedTime)}
          </p>
          <p className="text-xs text-brand-muted">
            {distance.toFixed(1)} km • Rush hour: {multiplier > 1.3 ? '⚠️' : '✓'}
          </p>
        </div>
      </div>
    </Card>
  )
}

// ==================== ORDER STATUS SELECTOR (FOR TESTING) ====================

export function OrderStatusSelector({ onSelect }: { onSelect: (status: ActiveOrder['status']) => void }) {
  const statuses: ActiveOrder['status'][] = ['confirmed', 'preparing', 'ready', 'delivering', 'delivered']

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-3">Selecionar Status (Demo)</h3>
      <div className="grid grid-cols-5 gap-2">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => onSelect(status)}
            className="py-2 px-3 bg-brand-soft rounded-lg text-xs font-medium hover:bg-brand-line"
          >
            {status}
          </button>
        ))}
      </div>
    </Card>
  )
}