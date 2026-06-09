'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { useCartStore, type CartItem } from '@/store/cart'
import { Button } from '@/components/ui'

export function FloatingCart() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { items, getCount, getSubtotal, removeItem, updateQuantity } = useCartStore()

  const itemCount = getCount()
  const subtotal = getSubtotal()

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Expanded view */}
      {isExpanded && (
        <div className="absolute bottom-14 right-0 w-72 max-h-96 bg-white rounded-2xl shadow-2xl border border-brand-line overflow-hidden animate-fade-up">
          <div className="p-3 bg-brand-red text-white font-bold flex items-center justify-between">
            <span>🛒 Seu carrinho ({itemCount})</span>
            <button onClick={() => setIsExpanded(false)}>✕</button>
          </div>

          <div className="max-h-64 overflow-y-auto p-2 space-y-2">
            {items.map(item => (
              <div key={item.productId} className="flex gap-2 p-2 bg-brand-soft rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-lg">
                  {item.thumb || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-brand-ink truncate">{item.title}</p>
                  <p className="text-sm text-brand-red font-bold">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-5 h-5 rounded-full bg-white text-xs font-bold hover:bg-brand-red hover:text-white transition-colors"
                  >
                    +
                  </button>
                  <span className="text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeItem(item.productId)
                      } else {
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    }}
                    className="w-5 h-5 rounded-full bg-white text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-brand-line bg-brand-paper">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-brand-muted">Subtotal:</span>
              <span className="font-bold text-brand-ink">
                R$ {subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <Link href="/user/checkout" className="block">
              <Button className="w-full">
                Finalizar compra
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          bg-brand-red text-white text-xl
          transition-all duration-300 hover:scale-110 active:scale-95
          ${isExpanded ? 'rotate-45' : ''}
        `}
      >
        🛒
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-brand-red text-xs font-bold rounded-full flex items-center justify-center border-2 border-brand-red">
          {itemCount}
        </span>
      </button>
    </div>
  )
}