'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface OrderSummaryProps {
  orderId?: string
  storeName: string
  storeLogo?: string
  items: Array<{
    name: string
    quantity: number
    price: number
    notes?: string
  }>
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  paymentMethod: string
  address: string
  estimatedTime?: string
  status?: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
}

export function OrderSummary({
  orderId = '#FE-1234',
  storeName,
  storeLogo,
  items,
  subtotal,
  deliveryFee,
  discount,
  total,
  paymentMethod,
  address,
  estimatedTime = '25-35 min',
  status = 'pending',
}: OrderSummaryProps) {
  const [expanded, setExpanded] = useState(false)

  const statusConfig = {
    pending: { label: 'Aguardando confirmação', color: 'warning', icon: '⏳' },
    preparing: { label: 'Preparando', color: 'info', icon: '👨‍🍳' },
    ready: { label: 'Pronto', color: 'success', icon: '✅' },
    delivering: { label: 'Saiu para entrega', color: 'info', icon: '🛵' },
    delivered: { label: 'Entregue', color: 'success', icon: '🎉' },
    cancelled: { label: 'Cancelado', color: 'error', icon: '❌' },
  }

  const currentStatus = statusConfig[status]

  const paymentIcons: Record<string, string> = {
    pix: '📱 PIX',
    credit: '💳 Cartão',
    debit: '💳 Débito',
    ticket: '🎫 Vale',
    money: '💵 Dinheiro',
  }

  return (
    <Card padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-white text-xl font-extrabold">
            {storeLogo || storeName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-brand-ink">{storeName}</p>
            <p className="text-sm text-brand-muted">Pedido {orderId}</p>
          </div>
        </div>
        <Badge variant={currentStatus.color as any} className="text-xs">
          {currentStatus.icon} {currentStatus.label}
        </Badge>
      </div>

      {/* Items preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left mb-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-muted">
            {items.length} item{items.length > 1 ? 's' : ''}
          </p>
          <span className="text-brand-red text-sm">
            {expanded ? '↑ Recolher' : '↓ Ver detalhes'}
          </span>
        </div>

        {expanded && (
          <div className="mt-3 space-y-2 animate-fade-up">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>
                  <span className="text-brand-ink">{item.quantity}x {item.name}</span>
                  {item.notes && (
                    <p className="text-xs text-brand-muted">Obs: {item.notes}</p>
                  )}
                </div>
                <span className="text-brand-ink">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        )}
      </button>

      {/* Summary */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Subtotal</span>
          <span className="text-brand-ink">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Frete</span>
          <span className={discount > 0 ? 'line-through text-brand-muted' : 'text-brand-ink'}>
            R$ {deliveryFee.toFixed(2).replace('.', ',')}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Desconto</span>
            <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-brand-line">
          <span className="font-bold text-brand-ink">Total</span>
          <span className="text-lg font-extrabold text-brand-red">
            R$ {total.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 pt-4 border-t border-brand-line">
        <div className="flex items-start gap-3">
          <span className="text-lg">🚚</span>
          <div>
            <p className="text-sm font-medium text-brand-ink">Entrega</p>
            <p className="text-xs text-brand-muted">Estimativa: {estimatedTime}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-lg">📍</span>
          <div>
            <p className="text-sm font-medium text-brand-ink">Endereço</p>
            <p className="text-xs text-brand-muted">{address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-lg">💳</span>
          <div>
            <p className="text-sm font-medium text-brand-ink">Pagamento</p>
            <p className="text-xs text-brand-muted">{paymentIcons[paymentMethod] || paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-brand-line">
          <p className="text-xs text-brand-muted text-center mb-3">
            Cancelar em até 5 minutos sem cobranças
          </p>
          <Button variant="outline" className="w-full text-red-500 border-red-200">
            ❌ Cancelar pedido
          </Button>
        </div>
      )}

      {status === 'delivered' && (
        <div className="mt-4 pt-4 border-t border-brand-line">
          <div className="flex gap-2">
            <Link href={`/user/orders/${orderId}/review`} className="flex-1">
              <Button variant="outline" className="w-full">
                ⭐ Avaliar
              </Button>
            </Link>
            <Button variant="outline" className="flex-1">
              🔄 Pedir novamente
            </Button>
          </div>
        </div>
      )}

      {status === 'delivering' && (
        <div className="mt-4 pt-4 border-t border-brand-line">
          <Link href={`/user/tracking/${orderId}`}>
            <Button className="w-full">
              🗺️ Acompanhar entrega
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}

// ==================== ORDER TIMELINE ====================

interface TimelineStep {
  status: string
  label: string
  time?: string
  description?: string
}

export function OrderTimeline({
  steps,
  currentStep,
}: {
  steps: TimelineStep[]
  currentStep: number
}) {
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep
        const isCurrent = idx === currentStep
        const isPending = idx > currentStep

        return (
          <div key={idx} className="flex gap-4">
            {/* Line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                isCompleted ? 'bg-emerald-500 text-white' :
                isCurrent ? 'bg-brand-red text-white' :
                'bg-brand-soft'
              }`}>
                {isCompleted ? '✓' : isCurrent ? '●' : '○'}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-0.5 flex-1 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-brand-soft'
                }`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 ${idx < steps.length - 1 ? '' : 'pb-0'}`}>
              <p className={`font-bold ${
                isPending ? 'text-brand-muted' : 'text-brand-ink'
              }`}>
                {step.label}
              </p>
              {step.time && (
                <p className="text-xs text-brand-muted">{step.time}</p>
              )}
              {step.description && (
                <p className="text-sm text-brand-muted mt-1">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ==================== ORDER RECIEPT ====================

export function OrderReceipt({
  order,
}: {
  order: OrderSummaryProps
}) {
  return (
    <Card padding="md" className="bg-white">
      {/* Header */}
      <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-red flex items-center justify-center text-3xl mx-auto mb-3">
          🍎
        </div>
        <p className="font-extrabold text-xl text-brand-ink">Feirinha Express</p>
        <p className="text-sm text-brand-muted">feirinha.app</p>
      </div>

      {/* Order info */}
      <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
        <p className="text-lg font-bold text-brand-ink">COMPROVANTE</p>
        <p className="text-sm text-brand-muted">Pedido {order.orderId}</p>
        <p className="text-sm text-brand-muted">
          {new Date().toLocaleDateString('pt-BR')} às{' '}
          {new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>

      {/* Items */}
      <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
        <p className="font-bold text-brand-ink mb-2">{order.storeName}</p>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm py-1">
            <span>{item.quantity}x {item.name}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-b border-dashed border-gray-300 pb-4 mb-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Frete</span>
          <span>R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Desconto</span>
            <span>-R$ {order.discount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span className="text-brand-red">R$ {order.total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="text-center text-sm text-brand-muted">
        <p>Pagamento: {order.paymentMethod.toUpperCase()}</p>
        <p className="text-xs mt-1">CNPJ: 00.000.000/0001-00</p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-brand-muted">
        <p>Obrigado pela preferência!</p>
        <p className="mt-1">Volte sempre 🍎</p>
      </div>
    </Card>
  )
}