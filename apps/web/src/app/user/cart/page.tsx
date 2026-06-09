'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { Card, Button, NavBar, BottomNav, Badge } from '@/components/ui'
import { toast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const cart = useCartStore()

  const [loading, setLoading] = useState(false)

  const items = cart.items
  const subtotal = cart.getSubtotal()
  const deliveryFee = cart.getDeliveryFee()
  const total = subtotal + deliveryFee
  const itemCount = cart.getCount()

  // Agrupar itens por loja
  const itemsByStore = cart.getItemsByStore()

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      cart.removeItem(id)
    } else {
      cart.updateQuantity(id, quantity)
    }
  }

  const handleRemoveItem = (id: string, title: string) => {
    cart.removeItem(id)
    toast.info('Item removido', title)
  }

  const handleClearCart = () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      cart.clearCart()
      toast.success('Carrinho limpo')
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Carrinho vazio', 'Adicione itens para continuar')
      return
    }
    router.push('/user/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-paper">
        <NavBar>
          <h1 className="text-lg font-extrabold text-brand-ink w-full text-center">Carrinho</h1>
        </NavBar>

        <div className="px-4 py-16 max-w-[390px] mx-auto text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-extrabold text-brand-ink mb-2">Carrinho vazio</h2>
          <p className="text-brand-muted mb-8">
            Parece que você ainda não adicionou nada ao carrinho.
          </p>
          <Button onClick={() => router.push('/user/home')}>
            Explorar lojas
          </Button>
        </div>

        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-36">
      <NavBar>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-extrabold text-brand-ink">
            Carrinho ({itemCount})
          </h1>
          <button
            onClick={handleClearCart}
            className="text-sm text-brand-red hover:underline"
          >
            Limpar
          </button>
        </div>
      </NavBar>

      <div className="px-4 py-4 max-w-[390px] mx-auto space-y-4">
        {/* Items by Store */}
        {Array.from(itemsByStore.entries()).map(([storeId, storeItems]) => (
          <div key={storeId}>
            {/* Store Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏪</span>
              <span className="font-bold text-brand-ink">
                {storeItems[0].storeName}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {storeItems.map((item) => (
                <Card key={item.id} padding="md">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-xl bg-brand-soft flex items-center justify-center text-3xl flex-shrink-0">
                      {item.emoji || '📦'}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-brand-ink line-clamp-2">{item.title}</p>
                          {item.options && item.options.length > 0 && (
                            <p className="text-xs text-brand-muted mt-1">
                              + {item.options.map(o => o.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.title)}
                          className="text-brand-muted hover:text-red-500 p-1"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-lg font-extrabold text-brand-red mt-1">
                        {formatCurrency(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center bg-brand-soft rounded-full">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-brand-line rounded-full transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-brand-line rounded-full transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-medium text-brand-muted">
                          Subtotal: {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Promo Banner */}
        <Card padding="md" className="bg-gradient-to-r from-brand-red to-red-600 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div className="flex-1">
              <p className="font-bold">Desconto PIX</p>
              <p className="text-sm opacity-80">5% off no pagamento via PIX</p>
            </div>
          </div>
        </Card>

        {/* More Products Hint */}
        <Card padding="md" className="bg-brand-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-bold text-brand-ink">Continue explorando</p>
                <p className="text-sm text-brand-muted">Adicione mais itens ao pedido</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/user/home')}
            >
              Ver mais
            </Button>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-brand-line p-4 shadow-lg">
        <div className="max-w-[390px] mx-auto">
          {/* Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Subtotal ({itemCount} itens)</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Taxa de entrega</span>
              <span className="font-medium">{formatCurrency(deliveryFee)}</span>
            </div>
            {Array.from(itemsByStore.entries()).length > 1 && (
              <div className="flex justify-between text-xs text-brand-green">
                <span>Taxa reduzida por pedido agrupado</span>
                <span>-R$ 2,90</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-brand-line">
              <span className="text-lg font-bold text-brand-ink">Total</span>
              <span className="text-xl font-extrabold text-brand-red">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            className="w-full py-4 text-lg"
            onClick={handleCheckout}
            loading={loading}
          >
            Finalizar Pedido →
          </Button>

          {/* PIX Hint */}
          <p className="text-xs text-center text-brand-muted mt-2">
            💠 Pague com PIX e ganhe 5% de desconto
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}