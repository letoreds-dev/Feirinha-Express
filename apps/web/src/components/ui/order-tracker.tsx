'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface OrderStatus {
  id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered'
  timestamp: string
  description: string
}

interface OrderTrackerProps {
  orderId: string
  orderNumber: string
  store: { name: string; logo?: string }
  estimatedTime: string
  currentStatus: OrderStatus['status']
  statuses: OrderStatus[]
}

const statusConfig: Record<OrderStatus['status'], { label: string; icon: string; color: string; bgColor: string }> = {
  pending: { label: 'Aguardando confirmação', icon: '⏳', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  confirmed: { label: 'Pedido confirmado', icon: '✅', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  preparing: { label: 'Preparando', icon: '👨‍🍳', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ready: { label: 'Pronto para entrega', icon: '📦', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  delivering: { label: 'Em entrega', icon: '🛵', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  delivered: { label: 'Entregue', icon: '🎉', color: 'text-brand-red', bgColor: 'bg-brand-soft' },
}

export function OrderTracker({ orderNumber, store, estimatedTime, statuses }: OrderTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const currentStatusIndex = statuses.findIndex(s => s.status === 'delivered') !== -1
    ? statuses.length - 1
    : statuses.filter(s => {
      const idx = statuses.findIndex(st => st.status === s.status)
      return idx !== -1
    }).length - 1

  const currentStatus = statuses[currentStatusIndex] || statuses[0]

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card padding="md" className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-xl font-extrabold text-brand-red">
            {store.logo || store.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-brand-ink">Pedido #{orderNumber}</p>
            <p className="text-xs text-brand-muted">{store.name}</p>
          </div>
        </div>
        <Badge variant="success" className="text-xs">
          {estimatedTime}
        </Badge>
      </div>

      {/* Current Status */}
      <div className={`p-4 rounded-xl ${statusConfig[currentStatus.status].bgColor} mb-4`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{statusConfig[currentStatus.status].icon}</span>
          <div>
            <p className={`font-bold ${statusConfig[currentStatus.status].color}`}>
              {statusConfig[currentStatus.status].label}
            </p>
            <p className="text-xs text-brand-muted mt-0.5">
              {formatTime(currentStatus.timestamp)}
            </p>
          </div>
        </div>

        {currentStatus.status === 'delivering' && (
          <div className="mt-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg">
              🧑‍💼
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-ink">João - Entregador</p>
              <p className="text-xs text-brand-muted">Chegando em breve!</p>
            </div>
            <a
              href="tel:+5511999999999"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
            >
              📞
            </a>
          </div>
        )}
      </div>

      {/* Timeline */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm text-brand-muted hover:text-brand-ink"
      >
        <span>Ver detalhes do pedido</span>
        <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-up">
          {/* Progress bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-red rounded-full transition-all duration-500"
                style={{ width: `${((currentStatusIndex + 1) / statuses.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {statuses.map((status, idx) => (
                <div
                  key={status.id}
                  className={`w-3 h-3 rounded-full ${
                    idx <= currentStatusIndex ? 'bg-brand-red' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-4">
            {statuses.map((status, idx) => {
              const isCompleted = idx <= currentStatusIndex
              const isCurrent = idx === currentStatusIndex

              return (
                <div key={status.id} className="relative pb-4 last:pb-0">
                  {/* Line */}
                  {idx < statuses.length - 1 && (
                    <div
                      className={`absolute left-1.5 top-6 w-0.5 h-full ${
                        idx < currentStatusIndex ? 'bg-brand-red' : 'bg-gray-300'
                      }`}
                    />
                  )}

                  {/* Dot */}
                  <div
                    className={`absolute left-0 top-1 w-3 h-3 rounded-full ${
                      isCurrent
                        ? 'bg-brand-red ring-4 ring-red-100'
                        : isCompleted
                          ? 'bg-brand-red'
                          : 'bg-gray-300'
                    }`}
                  />

                  {/* Content */}
                  <div className="pl-6">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-brand-ink' : 'text-brand-muted'}`}>
                      {statusConfig[status.status].label}
                    </p>
                    <p className="text-xs text-brand-muted mt-0.5">
                      {formatTime(status.timestamp)}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-brand-red mt-1 font-medium">
                        ← Status atual
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order details */}
          <div className="pt-4 border-t border-brand-line">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Hambúrguer Artesanal</span>
                <span className="text-brand-ink">R$ 32,90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Batata Frita</span>
                <span className="text-brand-ink">R$ 15,90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Frete</span>
                <span className="text-brand-ink">R$ 5,90</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-line font-bold">
                <span className="text-brand-ink">Total</span>
                <span className="text-brand-red">R$ 54,70</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(orderNumber)}
              className="flex-1 py-2 text-sm text-brand-red border border-brand-red rounded-lg hover:bg-red-50 transition-colors"
            >
              📋 Copiar código
            </button>
            <button className="flex-1 py-2 text-sm text-brand-ink border border-brand-line rounded-lg hover:bg-brand-soft transition-colors">
              📞 Ajuda
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

// Demo component for the tracking page
export function OrderTrackingDemo() {
  const statuses: OrderStatus[] = [
    { id: '1', status: 'confirmed', timestamp: new Date(Date.now() - 1800000).toISOString(), description: 'Pedido confirmado' },
    { id: '2', status: 'preparing', timestamp: new Date(Date.now() - 1200000).toISOString(), description: 'Preparando seu pedido' },
    { id: '3', status: 'ready', timestamp: new Date(Date.now() - 300000).toISOString(), description: 'Pronto para entrega' },
    { id: '4', status: 'delivering', timestamp: new Date(Date.now() - 120000).toISOString(), description: 'Saiu para entrega' },
  ]

  return (
    <div className="space-y-4">
      <OrderTracker
        orderId="1"
        orderNumber="2024-001"
        store={{ name: 'Burguer House' }}
        estimatedTime="~15 min"
        currentStatus="delivering"
        statuses={statuses}
      />
    </div>
  )
}