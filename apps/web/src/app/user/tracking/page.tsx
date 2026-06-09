'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, Badge, NavBar, BottomNav, Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'

interface OrderStatus {
  id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  timestamp: string
  description: string
}

const statusConfig: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
  pending: { label: 'Aguardando confirmação', icon: '⏳', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  confirmed: { label: 'Pedido confirmado', icon: '✅', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  preparing: { label: 'Preparando', icon: '👨‍🍳', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ready: { label: 'Pronto para entrega', icon: '📦', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  delivering: { label: 'Em entrega', icon: '🛵', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  delivered: { label: 'Entregue', icon: '🎉', color: 'text-brand-red', bgColor: 'bg-brand-soft' },
  cancelled: { label: 'Cancelado', icon: '❌', color: 'text-red-600', bgColor: 'bg-red-100' },
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  // Mock data - em produção, buscar da API
  const mockOrder = {
    id: orderId || 'FX-1234',
    orderNumber: orderId || 'FX-1234',
    storeName: 'Fanaticos FC + Mobile Prime',
    items: [
      { name: 'Camisa Brasil retrô', quantity: 1, price: 129.90, emoji: '👕' },
      { name: 'Carregador Turbo', quantity: 2, price: 69.90, emoji: '🔌' },
    ],
    total: 260.87,
    estimatedTime: '25-35 min',
    status: 'delivering' as const,
    driver: {
      name: 'Carlos Silva',
      phone: '(11) 99999-9999',
      rating: 4.9,
    },
    address: 'Av. Paulista, 1000 - Bela Vista',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  }

  const [statuses] = useState<OrderStatus[]>([
    { id: '1', status: 'confirmed', timestamp: new Date(Date.now() - 1800000).toISOString(), description: 'Pedido confirmado pela loja' },
    { id: '2', status: 'preparing', timestamp: new Date(Date.now() - 1200000).toISOString(), description: 'Loja iniciando preparação' },
    { id: '3', status: 'ready', timestamp: new Date(Date.now() - 600000).toISOString(), description: 'Pedido pronto para retirada' },
    { id: '4', status: 'delivering', timestamp: new Date(Date.now() - 300000).toISOString(), description: 'Entregador a caminho' },
  ])

  const currentStatusIndex = statuses.length - 1

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const callDriver = () => {
    window.location.href = `tel:${mockOrder.driver.phone}`
    toast.info('Ligando para entregador...')
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(mockOrder.orderNumber)
    toast.success('Código copiado!')
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-24">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <button onClick={() => history.back()} className="text-brand-muted hover:text-brand-ink">
            ←
          </button>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">Acompanhar Pedido</h1>
          <button onClick={copyOrderNumber} className="text-brand-red text-sm font-medium">
            📋 Copiar
          </button>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto space-y-4">
        {/* Order Header */}
        <Card padding="md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center text-3xl font-extrabold text-brand-red">
              {mockOrder.storeName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-brand-ink">#{mockOrder.orderNumber}</p>
              <p className="text-sm text-brand-muted">{mockOrder.storeName}</p>
            </div>
            <Badge variant="info" className="text-xs">
              {mockOrder.estimatedTime}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-red rounded-full transition-all duration-500"
                style={{ width: `${((currentStatusIndex + 1) / statuses.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {statuses.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx <= currentStatusIndex ? 'bg-brand-red' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className={`p-4 rounded-xl ${statusConfig[statuses[currentStatusIndex].status].bgColor}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{statusConfig[statuses[currentStatusIndex].status].icon}</span>
              <div>
                <p className={`font-bold ${statusConfig[statuses[currentStatusIndex].status].color}`}>
                  {statusConfig[statuses[currentStatusIndex].status].label}
                </p>
                <p className="text-xs text-brand-muted mt-0.5">
                  {formatTime(statuses[currentStatusIndex].timestamp)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Driver Info */}
        {mockOrder.status === 'delivering' && (
          <Card padding="md" className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl">
                🧑‍💼
              </div>
              <div className="flex-1">
                <p className="font-bold text-brand-ink">{mockOrder.driver.name}</p>
                <p className="text-sm text-brand-muted">Seu entregador</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-medium">{mockOrder.driver.rating}</span>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={callDriver}
              >
                📞 Ligar
              </Button>
            </div>

            {/* Fake location */}
            <div className="mt-4 p-3 bg-white rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-sm font-medium text-brand-ink">A caminho</p>
                  <p className="text-xs text-brand-muted">Chegando em breve</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Timeline */}
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">📍 Detalhes</h3>

          <div className="relative pl-4 space-y-4">
            {statuses.map((status, idx) => {
              const isCompleted = idx < currentStatusIndex
              const isCurrent = idx === currentStatusIndex

              return (
                <div key={status.id} className="relative">
                  {/* Line */}
                  {idx < statuses.length - 1 && (
                    <div
                      className={`absolute left-1.5 top-6 w-0.5 h-8 ${
                        isCompleted ? 'bg-brand-red' : 'bg-gray-300'
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
        </Card>

        {/* Order Items */}
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">🛒 Itens</h3>

          <div className="space-y-3">
            {mockOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center text-xl">
                  {item.emoji || '📦'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brand-ink">{item.name}</p>
                  <p className="text-xs text-brand-muted">x{item.quantity}</p>
                </div>
                <p className="font-bold text-brand-ink">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 mt-4 border-t border-brand-line">
            <span className="font-bold text-brand-ink">Total</span>
            <span className="font-extrabold text-brand-red text-lg">
              {formatCurrency(mockOrder.total)}
            </span>
          </div>
        </Card>

        {/* Delivery Address */}
        <Card padding="md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div>
              <p className="font-bold text-brand-ink">Entrega em</p>
              <p className="text-sm text-brand-muted">{mockOrder.address}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => toast.info('Chat em desenvolvimento')}
          >
            💬 Mensagem
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => toast.info('Ajuda em desenvolvimento')}
          >
            ❓ Ajuda
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-paper flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Carregando...</p>
        </div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}