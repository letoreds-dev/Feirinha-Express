'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  thumb: string
  store: string
  notes?: string
}

interface PromoCode {
  code: string
  discount: number
  type: 'percent' | 'fixed' | 'freight'
}

export function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: 'Hambúrguer Artesanal', price: 32.90, quantity: 2, thumb: '🍔', store: 'Burguer House' },
    { id: '2', name: 'Batata Frita Média', price: 15.90, quantity: 1, thumb: '🍟', store: 'Burguer House' },
    { id: '3', name: 'Refrigerante 600ml', price: 6.90, quantity: 2, thumb: '🥤', store: 'Burguer House' },
  ])
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryFee = 5.90
  const discount = appliedPromo?.type === 'freight' ? deliveryFee :
                   appliedPromo?.type === 'fixed' ? appliedPromo.discount :
                   appliedPromo?.type === 'percent' ? subtotal * (appliedPromo.discount / 100) : 0
  const total = subtotal + deliveryFee - discount

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
    toast.info('Item removido do carrinho')
  }

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'FRETE10') {
      setAppliedPromo({ code: 'FRETE10', discount: 0, type: 'freight' })
      toast.success('Frete grátis aplicado!')
    } else if (promoCode.toUpperCase() === 'DESCONTO20') {
      setAppliedPromo({ code: 'DESCONTO20', discount: 20, type: 'fixed' })
      toast.success('R$ 20 de desconto!')
    } else if (promoCode.toUpperCase() === 'PRIMEIRACOMPRA') {
      setAppliedPromo({ code: 'PRIMEIRACOMPRA', discount: 15, type: 'percent' })
      toast.success('15% de desconto!')
    } else {
      toast.error('Código inválido')
    }
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-xl font-extrabold text-brand-ink mb-2">Carrinho vazio</h2>
        <p className="text-brand-muted mb-6">Adicione itens para fazer seu pedido</p>
        <Link href="/user/stores">
          <Button>Explorar lojas</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Store info */}
      <Card padding="md" className="bg-brand-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-xl">
            🍔
          </div>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">{items[0].store}</p>
            <p className="text-xs text-brand-muted">Entrega em 25-35 min</p>
          </div>
          <Badge variant="success" className="text-xs">🟢 Aberto</Badge>
        </div>
      </Card>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-brand-ink">Seus itens</h3>
          <button className="text-xs text-brand-red hover:underline">
            Adicionar mais itens
          </button>
        </div>

        {items.map(item => (
          <Card key={item.id} padding="md">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-xl bg-brand-soft flex items-center justify-center text-3xl flex-shrink-0">
                {item.thumb}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-brand-ink">{item.name}</p>
                    <p className="text-sm text-brand-muted">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    🗑️
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-brand-ink hover:bg-brand-line transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-brand-ink hover:bg-brand-line transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-extrabold text-brand-red">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Promo code */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">🎟️ Cupom de desconto</h3>
        {appliedPromo ? (
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
            <div>
              <p className="font-bold text-emerald-700">{appliedPromo.code}</p>
              <p className="text-xs text-emerald-600">
                {appliedPromo.type === 'freight' && 'Frete grátis!'}
                {appliedPromo.type === 'fixed' && `R$ ${appliedPromo.discount} de desconto`}
                {appliedPromo.type === 'percent' && `${appliedPromo.discount}% de desconto`}
              </p>
            </div>
            <button
              onClick={() => setAppliedPromo(null)}
              className="text-emerald-600 text-sm hover:underline"
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Digite o código"
              className="flex-1 px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red uppercase"
            />
            <Button onClick={applyPromo}>Aplicar</Button>
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Resumo do pedido</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} itens)</span>
            <span className="text-brand-ink">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Frete</span>
            <span className={discount > 0 && appliedPromo?.type === 'freight' ? 'text-emerald-600 line-through' : 'text-brand-ink'}>
              R$ {deliveryFee.toFixed(2).replace('.', ',')}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Desconto</span>
              <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-brand-line">
            <span className="font-bold text-brand-ink">Total</span>
            <span className="text-xl font-extrabold text-brand-red">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </Card>

      {/* Address */}
      <Card padding="md">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📍</span>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">Endereço de entrega</p>
            <p className="text-sm text-brand-muted mt-1">Rua das Flores, 123 - Casa</p>
            <p className="text-xs text-brand-muted">Jardim Primavera, São Paulo</p>
          </div>
          <Link href="/user/addresses" className="text-brand-red text-sm hover:underline">
            Alterar
          </Link>
        </div>
      </Card>

      {/* Payment */}
      <Card padding="md">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💳</span>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">Forma de pagamento</p>
            <p className="text-sm text-brand-muted mt-1">PIX</p>
          </div>
          <button className="text-brand-red text-sm hover:underline">
            Alterar
          </button>
        </div>
      </Card>

      {/* Checkout button */}
      <Link href="/user/confirmation">
        <Button className="w-full py-4 text-lg">
          Confirmar pedido • R$ {total.toFixed(2).replace('.', ',')}
        </Button>
      </Link>

      {/* Security note */}
      <p className="text-center text-xs text-brand-muted">
        🔒 Pagamento 100% seguro | Seus dados estão protegidos
      </p>
    </div>
  )
}