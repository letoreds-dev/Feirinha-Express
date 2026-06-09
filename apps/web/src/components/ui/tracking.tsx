'use client'

import { Card } from './card'
import { Button } from './button'

// ==================== ORDER TRACKING STATUS ====================

type OrderStatus = 'pending' | 'confirmed' | 'separating' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled'

interface OrderTrackingProps {
  status: OrderStatus
  estimatedTime?: number
  currentLat?: number
  currentLng?: number
  onContactMerchant?: () => void
  onContactDriver?: () => void
}

export function OrderTracking({
  status,
  estimatedTime,
  currentLat,
  currentLng,
  onContactMerchant,
  onContactDriver,
}: OrderTrackingProps) {
  const steps = [
    { key: 'pending', label: 'Pedido\nrecebido', icon: '📝' },
    { key: 'confirmed', label: 'Confirmado', icon: '✓' },
    { key: 'separating', label: 'Separando', icon: '📦' },
    { key: 'ready', label: 'Pronto', icon: '✅' },
    { key: 'on_the_way', label: 'A caminho', icon: '🛵' },
    { key: 'delivered', label: 'Entregue', icon: '🎉' },
  ]

  const statusIndex = steps.findIndex((s) => s.key === status)
  const isDelivered = status === 'delivered'
  const isCancelled = status === 'cancelled'
  const isOnTheWay = status === 'on_the_way'

  const getStepState = (index: number) => {
    if (isCancelled) return 'cancelled'
    if (index < statusIndex) return 'completed'
    if (index === statusIndex) return 'active'
    return 'pending'
  }

  return (
    <Card padding="lg" className="space-y-6">
      {/* Status Header */}
      <div className="text-center">
        <div className={`text-4xl mb-2 ${isCancelled ? 'grayscale' : ''}`}>
          {isCancelled ? '❌' : isDelivered ? '🎉' : isOnTheWay ? '🛵' : '⏳'}
        </div>
        <h3 className="text-lg font-bold text-brand-ink">
          {isCancelled
            ? 'Pedido Cancelado'
            : isDelivered
            ? 'Pedido Entregue!'
            : isOnTheWay
            ? 'A caminho de você!'
            : status === 'pending'
            ? 'Aguardando confirmação...'
            : status === 'confirmed'
            ? 'Pedido confirmado!'
            : status === 'separating'
            ? 'Separando seu pedido...'
            : status === 'ready'
            ? 'Pedido pronto!'
            : 'Processando...'}
        </h3>
        {estimatedTime && !isDelivered && !isCancelled && (
          <p className="text-sm text-brand-muted mt-1">
            Tempo estimado: <strong>{estimatedTime} min</strong>
          </p>
        )}
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-brand-soft" />
        <div
          className="absolute top-5 left-0 h-1 bg-brand-red transition-all duration-500"
          style={{ width: `${Math.max(0, (statusIndex / (steps.length - 1)) * 100)}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.slice(0, -1).map((step, idx) => {
            const state = getStepState(idx)
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${
                    state === 'completed'
                      ? 'bg-brand-red text-white'
                      : state === 'active'
                      ? 'bg-brand-red text-white animate-pulse'
                      : state === 'cancelled'
                      ? 'bg-red-500 text-white'
                      : 'bg-brand-soft text-brand-muted'
                  }`}
                >
                  {step.icon}
                </div>
                <p className="text-xs text-center mt-2 whitespace-pre-line text-brand-muted">
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Map Preview */}
      {isOnTheWay && (currentLat || currentLng) && (
        <div className="aspect-video bg-brand-soft rounded-xl flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-2">🗺️</p>
            <p className="text-sm text-brand-muted">Rastreamento em tempo real</p>
            <p className="text-xs text-brand-muted">
              {currentLat && currentLng ? `${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}` : 'Carregando...'}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isDelivered && !isCancelled && (
        <div className="flex gap-3">
          {onContactMerchant && (
            <Button variant="outline" onClick={onContactMerchant} className="flex-1">
              💬 Loja
            </Button>
          )}
          {onContactDriver && isOnTheWay && (
            <Button variant="outline" onClick={onContactDriver} className="flex-1">
              💬 Entregador
            </Button>
          )}
        </div>
      )}

      {isDelivered && (
        <div className="space-y-2">
          <p className="text-center text-green-600 font-medium">✅ Pedido entregue com sucesso!</p>
          <Button variant="outline" className="w-full">
            ✏️ Avaliar Pedido
          </Button>
        </div>
      )}
    </Card>
  )
}

// ==================== DRIVER CARD ====================

interface Driver {
  id: string
  name: string
  avatar?: string
  phone?: string
  rating: number
  vehicleType: string
  currentLat?: number
  currentLng?: number
}

interface DriverCardProps {
  driver: Driver
  onCall?: () => void
  onMessage?: () => void
}

export function DriverCard({ driver, onCall, onMessage }: DriverCardProps) {
  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-2xl">
          {driver.avatar || '🧑‍🚀'}
        </div>
        <div className="flex-1">
          <p className="font-bold text-brand-ink">{driver.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-brand-ink">{driver.rating.toFixed(1)}</span>
            <span className="text-brand-muted">•</span>
            <span className="text-sm text-brand-muted">
              {driver.vehicleType === 'bike' ? '🚲' : driver.vehicleType === 'motorcycle' ? '🏍️' : '🚗'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {driver.phone && onCall && (
          <Button onClick={onCall} className="flex-1">
            📞 Ligar
          </Button>
        )}
        {onMessage && (
          <Button variant="outline" onClick={onMessage} className="flex-1">
            💬 Mensagem
          </Button>
        )}
      </div>
    </Card>
  )
}

// ==================== DELIVERY TIMELINE ====================

interface TimelineEvent {
  status: OrderStatus
  timestamp: string
  description: string
}

interface DeliveryTimelineProps {
  events: TimelineEvent[]
}

export function DeliveryTimeline({ events }: DeliveryTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, idx) => {
        const isLast = idx === events.length - 1
        return (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${
                isLast ? 'bg-brand-red' : 'bg-brand-line'
              }`} />
              {!isLast && <div className="w-0.5 h-full bg-brand-line" />}
            </div>
            <div className="pb-6">
              <p className="font-medium text-brand-ink text-sm">{event.description}</p>
              <p className="text-xs text-brand-muted">
                {new Date(event.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}