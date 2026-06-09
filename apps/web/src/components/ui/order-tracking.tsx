/**
 * Feirinha Express - Real-Time Order Tracking
 * Live tracking with map integration and delivery status
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== TRACKING TYPES ====================

interface DeliveryLocation {
  lat: number
  lng: number
  timestamp: Date
  heading?: number
}

interface DeliveryPerson {
  name: string
  phone: string
  photo?: string
  rating: number
  vehicle: string
  emoji: string
}

interface OrderTrackingData {
  orderId: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picking_up' | 'delivering' | 'delivered'
  estimatedTime: Date
  store: {
    name: string
    emoji: string
    address: string
  }
  delivery: {
    address: string
    location: DeliveryLocation
  }
  timeline: TimelineEvent[]
}

interface TimelineEvent {
  status: string
  timestamp: Date
  description: string
  icon: string
}

// ==================== LIVE TRACKING MAP ====================

interface LiveTrackingMapProps {
  storeLocation: { lat: number; lng: number }
  deliveryLocation: DeliveryLocation
  destination: { lat: number; lng: number }
  onLocationUpdate?: (location: DeliveryLocation) => void
}

export function LiveTrackingMap({
  storeLocation,
  deliveryLocation,
  destination,
}: LiveTrackingMapProps) {
  const [animatedPosition, setAnimatedPosition] = useState(deliveryLocation)

  // Animate position changes smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedPosition(prev => ({
        ...prev,
        lat: prev.lat + (deliveryLocation.lat - prev.lat) * 0.1,
        lng: prev.lng + (deliveryLocation.lng - prev.lng) * 0.1,
      }))
    }, 100)
    return () => clearInterval(interval)
  }, [deliveryLocation])

  // Calculate map bounds
  const allLats = [storeLocation.lat, deliveryLocation.lat, destination.lat]
  const allLngs = [storeLocation.lng, deliveryLocation.lng, destination.lng]
  const minLat = Math.min(...allLats)
  const maxLat = Math.max(...allLats)
  const minLng = Math.min(...allLngs)
  const maxLng = Math.max(...allLngs)

  // Convert coordinates to percentage positions
  const toPercent = (val: number, min: number, max: number) => {
    const range = max - min || 1
    return ((val - min) / range) * 100
  }

  const storePercent = {
    x: toPercent(storeLocation.lng, minLng, maxLng),
    y: 100 - toPercent(storeLocation.lat, minLat, maxLat),
  }

  const deliveryPercent = {
    x: toPercent(animatedPosition.lng, minLng, maxLng),
    y: 100 - toPercent(animatedPosition.lat, minLat, maxLat),
  }

  const destPercent = {
    x: toPercent(destination.lng, minLng, maxLng),
    y: 100 - toPercent(destination.lat, minLat, maxLat),
  }

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-brand-soft to-brand-line rounded-2xl overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Grid lines */}
          {[...Array(10)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${i * 10}%`}
              x2="100%"
              y2={`${i * 10}%`}
              stroke="#ccc"
              strokeWidth="0.5"
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${i * 10}%`}
              y1="0"
              x2={`${i * 10}%`}
              y2="100%"
              stroke="#ccc"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full">
        <path
          d={`M ${storePercent.x}% ${storePercent.y}% Q 50% 20% ${destPercent.x}% ${destPercent.y}%`}
          fill="none"
          stroke="#FF6B6B"
          strokeWidth="3"
          strokeDasharray="8 4"
          opacity="0.5"
        />
      </svg>

      {/* Store marker */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
        style={{ left: `${storePercent.x}%`, top: `${storePercent.y}%` }}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl border-2 border-brand-red">
            🏪
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white rounded-full text-xs font-bold shadow">
            Loja
          </div>
        </div>
      </div>

      {/* Destination marker */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
        style={{ left: `${destPercent.x}%`, top: `${destPercent.y}%` }}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl border-2 border-emerald-500">
            🏠
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white rounded-full text-xs font-bold shadow">
            Você
          </div>
        </div>
      </div>

      {/* Delivery person marker */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10"
        style={{ left: `${deliveryPercent.x}%`, top: `${deliveryPercent.y}%` }}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-brand-red shadow-xl flex items-center justify-center text-2xl animate-bounce border-4 border-white">
            🛵
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-red rotate-45" />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 bg-white rounded-xl p-3 shadow-lg text-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-red" />
          <span>Entregador</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Destino</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-red" />
          <span>Loja</span>
        </div>
      </div>
    </div>
  )
}

// ==================== DELIVERY PERSON CARD ====================

interface DeliveryPersonCardProps {
  deliveryPerson: DeliveryPerson
  onCall?: () => void
  onMessage?: () => void
}

export function DeliveryPersonCard({ deliveryPerson, onCall, onMessage }: DeliveryPersonCardProps) {
  return (
    <Card padding="md" className="flex items-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-3xl">
          {deliveryPerson.emoji}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs border-2 border-white">
          ✓
        </div>
      </div>

      <div className="flex-1">
        <p className="font-bold text-brand-ink">{deliveryPerson.name}</p>
        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <span>⭐ {deliveryPerson.rating}</span>
          <span>•</span>
          <span>{deliveryPerson.vehicle}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onMessage}
          className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl hover:bg-brand-line transition-colors"
        >
          💬
        </button>
        <button
          onClick={onCall}
          className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-xl text-white hover:bg-red-600 transition-colors"
        >
          📞
        </button>
      </div>
    </Card>
  )
}

// ==================== TIMELINE COMPONENT ====================

interface TrackingTimelineProps {
  events: TimelineEvent[]
  currentStatus: string
}

export function TrackingTimeline({ events, currentStatus }: TrackingTimelineProps) {
  const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'picking_up', 'delivering', 'delivered']
  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const isActive = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={index} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
                  isCurrent
                    ? 'bg-brand-red text-white scale-110'
                    : isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-brand-soft text-brand-muted'
                }`}
              >
                {event.icon}
              </div>
              {index < events.length - 1 && (
                <div
                  className={`w-0.5 h-8 transition-colors ${
                    isActive ? 'bg-emerald-500' : 'bg-brand-soft'
                  }`}
                />
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 pb-6">
              <p className={`font-bold ${isActive ? 'text-brand-ink' : 'text-brand-muted'}`}>
                {event.description}
              </p>
              <p className="text-xs text-brand-muted">
                {new Date(event.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {isCurrent && (
                <Badge variant="success" className="mt-1">Ao vivo</Badge>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ==================== ESTIMATED TIME COMPONENT ====================

interface EstimatedTimeProps {
  estimatedArrival: Date
}

export function EstimatedArrival({ estimatedArrival }: EstimatedTimeProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [minutesLeft, setMinutesLeft] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const diff = estimatedArrival.getTime() - now.getTime()
      const minutes = Math.max(0, Math.floor(diff / 60000))

      setMinutesLeft(minutes)

      if (minutes === 0) {
        setTimeLeft('Chegando agora!')
      } else if (minutes < 60) {
        setTimeLeft(`${minutes} min`)
      } else {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        setTimeLeft(`${hours}h ${mins}min`)
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 30000)
    return () => clearInterval(interval)
  }, [estimatedArrival])

  return (
    <Card padding="md" className="text-center bg-gradient-to-br from-brand-red to-red-600 text-white">
      <p className="text-sm opacity-80">Tempo estimado</p>
      <p className="text-4xl font-extrabold my-2">{timeLeft}</p>
      <p className="text-sm opacity-80">
        Chegada às {estimatedArrival.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </p>

      {/* Progress bar */}
      <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${Math.max(5, 100 - minutesLeft * 2)}%` }}
        />
      </div>
    </Card>
  )
}

// ==================== FULL TRACKING PAGE ====================

export function OrderTrackingPage() {
  const [trackingData] = useState<OrderTrackingData>({
    orderId: 'PED-2024-001234',
    status: 'delivering',
    estimatedTime: new Date(Date.now() + 12 * 60000),
    store: {
      name: 'Burguer House',
      emoji: '🍔',
      address: 'Rua das Flores, 123 - Centro',
    },
    delivery: {
      address: 'Av. Paulista, 1000 - Bela Vista',
      location: {
        lat: -23.5615,
        lng: -46.6558,
        timestamp: new Date(),
      },
    },
    timeline: [
      { status: 'confirmed', timestamp: new Date(Date.now() - 45 * 60000), description: 'Pedido confirmado', icon: '✓' },
      { status: 'preparing', timestamp: new Date(Date.now() - 35 * 60000), description: 'Preparando seu pedido', icon: '👨‍🍳' },
      { status: 'ready', timestamp: new Date(Date.now() - 20 * 60000), description: 'Pedido pronto para retirada', icon: '📦' },
      { status: 'picking_up', timestamp: new Date(Date.now() - 15 * 60000), description: 'Entregador a caminho', icon: '🛵' },
      { status: 'delivering', timestamp: new Date(Date.now() - 5 * 60000), description: 'Em entrega', icon: '🚚' },
      { status: 'delivered', timestamp: new Date(), description: 'Pedido entregue', icon: '🏠' },
    ],
  })

  const [deliveryPerson] = useState<DeliveryPerson>({
    name: 'Carlos Silva',
    phone: '(11) 99999-8888',
    rating: 4.9,
    vehicle: 'Moto',
    emoji: '🏍️',
  })

  // Simulate live location updates
  const [liveLocation, setLiveLocation] = useState<DeliveryLocation>({
    lat: -23.5620,
    lng: -46.6560,
    timestamp: new Date(),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLocation(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.0005,
        lng: prev.lng + (Math.random() - 0.5) * 0.0005,
        timestamp: new Date(),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-brand-paper pb-20">
      {/* Header */}
      <div className="bg-brand-red text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Pedido</p>
            <p className="font-extrabold">{trackingData.orderId}</p>
          </div>
          <Badge variant="default" className="bg-white text-brand-red">
            🛵 Em entrega
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-[390px] mx-auto">
        {/* Map */}
        <LiveTrackingMap
          storeLocation={{ lat: -23.5630, lng: -46.6580 }}
          deliveryLocation={liveLocation}
          destination={{ lat: -23.5610, lng: -46.6550 }}
        />

        {/* Estimated time */}
        <EstimatedArrival estimatedArrival={trackingData.estimatedTime} />

        {/* Delivery person */}
        <DeliveryPersonCard
          deliveryPerson={deliveryPerson}
          onCall={() => window.open(`tel:${deliveryPerson.phone}`)}
          onMessage={() => {}}
        />

        {/* Order summary */}
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-3">📋 Resumo do Pedido</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">Loja</span>
              <span className="font-medium">{trackingData.store.emoji} {trackingData.store.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Entrega em</span>
              <span className="font-medium">{trackingData.delivery.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Itens</span>
              <span className="font-medium">3 itens</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-line">
              <span className="font-bold text-brand-ink">Total</span>
              <span className="font-bold text-brand-red">R$ 89,70</span>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">📍 Acompanhamento</h3>
          <TrackingTimeline
            events={trackingData.timeline}
            currentStatus={trackingData.status}
          />
        </Card>

        {/* Help */}
        <Button variant="ghost" className="w-full">
          ❓ Precisa de ajuda?
        </Button>
      </div>
    </div>
  )
}

// ==================== ORDER STATUS BADGE ====================

interface OrderStatusBadgeProps {
  status: OrderTrackingData['status']
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'error'; icon: string }> = {
    pending: { label: 'Pendente', variant: 'warning', icon: '⏳' },
    confirmed: { label: 'Confirmado', variant: 'info', icon: '✓' },
    preparing: { label: 'Preparando', variant: 'info', icon: '👨‍🍳' },
    ready: { label: 'Pronto', variant: 'success', icon: '📦' },
    picking_up: { label: 'Retirando', variant: 'info', icon: '🛵' },
    delivering: { label: 'Em entrega', variant: 'success', icon: '🚚' },
    delivered: { label: 'Entregue', variant: 'success', icon: '✅' },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {config.icon} {config.label}
    </Badge>
  )
}