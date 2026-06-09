'use client'

import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { toast } from '@/components/ui/toast'

export function OrderConfirmation() {
  const orderDetails = {
    orderNumber: 'FE-2024-1234',
    estimatedTime: '25-35 min',
    store: {
      name: 'Burguer House',
      logo: '🍔',
    },
    items: [
      { name: 'Hambúrguer Artesanal', quantity: 2, price: 32.90 },
      { name: 'Batata Frita Média', quantity: 1, price: 15.90 },
      { name: 'Refrigerante 600ml', quantity: 2, price: 6.90 },
    ],
    subtotal: 95.40,
    deliveryFee: 5.90,
    discount: 5.00,
    total: 96.30,
    paymentMethod: 'PIX',
    deliveryAddress: 'Rua das Flores, 123 - Jardim Primavera',
    customerName: 'Carlos Silva',
  }

  const handleShare = () => {
    navigator.clipboard.writeText(orderDetails.orderNumber)
    toast.success('Código copiado!')
  }

  return (
    <div className="space-y-6">
      {/* Success animation */}
      <div className="text-center py-6">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <span className="text-5xl">✅</span>
        </div>
        <h1 className="text-2xl font-extrabold text-brand-ink">Pedido confirmado!</h1>
        <p className="text-brand-muted mt-2">Você receberá atualizações por notificação</p>
      </div>

      {/* Order number */}
      <Card padding="md" className="bg-brand-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-muted">Número do pedido</p>
            <p className="text-2xl font-extrabold text-brand-ink">{orderDetails.orderNumber}</p>
          </div>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-white border border-brand-line rounded-lg text-sm font-medium hover:bg-brand-line transition-colors"
          >
            📋 Copiar
          </button>
        </div>
      </Card>

      {/* Store info */}
      <Card padding="md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-red flex items-center justify-center text-2xl text-white font-extrabold">
            {orderDetails.store.logo}
          </div>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">{orderDetails.store.name}</p>
            <p className="text-sm text-brand-muted">Preparando seu pedido</p>
          </div>
          <Badge variant="warning" className="text-xs">👨‍🍳 Preparando</Badge>
        </div>
      </Card>

      {/* Timeline */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Acompanhe seu pedido</h3>
        <div className="space-y-4">
          {[
            { step: 'Pedido recebido', time: 'Agora', done: true, icon: '✅' },
            { step: 'Preparando', time: '5-10 min', done: true, icon: '👨‍🍳' },
            { step: 'Saindo para entrega', time: '15-20 min', done: false, icon: '🛵' },
            { step: 'Entregue', time: '25-35 min', done: false, icon: '🎉' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.done ? 'bg-emerald-100' : 'bg-brand-soft'
              }`}>
                <span>{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className={`font-medium ${item.done ? 'text-brand-ink' : 'text-brand-muted'}`}>
                  {item.step}
                </p>
                <p className="text-xs text-brand-muted">{item.time}</p>
              </div>
              {item.done && (
                <span className="text-emerald-500">✓</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-brand-line">
          <p className="text-sm text-brand-muted">
            ⏱️ Previsão de entrega: <span className="font-bold text-brand-ink">{orderDetails.estimatedTime}</span>
          </p>
        </div>
      </Card>

      {/* Items */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Resumo do pedido</h3>
        <div className="space-y-3">
          {orderDetails.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-brand-muted">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium text-brand-ink">
                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-brand-line space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Subtotal</span>
            <span className="text-brand-ink">R$ {orderDetails.subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Frete</span>
            <span className="text-brand-ink">R$ {orderDetails.deliveryFee.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Desconto</span>
            <span>-R$ {orderDetails.discount.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-brand-line">
            <span className="font-bold text-brand-ink">Total</span>
            <span className="text-xl font-extrabold text-brand-red">
              R$ {orderDetails.total.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </Card>

      {/* Delivery info */}
      <Card padding="md">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📍</span>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">Endereço de entrega</p>
            <p className="text-sm text-brand-muted mt-1">{orderDetails.deliveryAddress}</p>
            <p className="text-sm text-brand-muted">Para: {orderDetails.customerName}</p>
          </div>
        </div>
      </Card>

      {/* Payment */}
      <Card padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💠</span>
            <div>
              <p className="font-bold text-brand-ink">{orderDetails.paymentMethod}</p>
              <p className="text-xs text-brand-muted">Pago</p>
            </div>
          </div>
          <Badge variant="success" className="text-xs">✅ Confirmado</Badge>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button className="w-full">
          🛵 Acompanhar entrega
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/user/orders">
            <Button variant="outline" className="w-full">
              📋 Meus pedidos
            </Button>
          </Link>
          <Button variant="outline" className="w-full">
            📞 Falar com loja
          </Button>
        </div>
        <Link href="/user">
          <Button variant="ghost" className="w-full">
            ← Continuar comprando
          </Button>
        </Link>
      </div>
    </div>
  )
}