'use client'

import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'

interface WalletCoupon {
  id: string
  code: string
  title: string
  description: string
  discount: string
  type: 'percent' | 'fixed' | 'frete'
  minOrder?: number
  expiresAt: string
  isUsed: boolean
}

const mockCoupons: WalletCoupon[] = [
  {
    id: '1',
    code: 'PRIMEIRACOMPRA',
    title: '10% off',
    description: 'Desconto de 10% na primeira compra',
    discount: '10%',
    type: 'percent',
    minOrder: 50,
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    isUsed: false
  },
  {
    id: '2',
    code: 'FRETE10',
    title: 'Frete grátis',
    description: 'Frete grátis em qualquer pedido',
    discount: 'R$ 9,90',
    type: 'frete',
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    isUsed: false
  },
  {
    id: '3',
    code: 'DESCONTO20',
    title: 'R$ 20 off',
    description: 'R$ 20 de desconto em compras acima de R$100',
    discount: 'R$ 20',
    type: 'fixed',
    minOrder: 100,
    expiresAt: new Date(Date.now() + 3 * 86400000).toISOString(),
    isUsed: false
  },
  {
    id: '4',
    code: 'BLACKFRIDAY23',
    title: '25% off',
    description: '25% de desconto (máx R$50)',
    discount: '25%',
    type: 'percent',
    minOrder: 200,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    isUsed: false
  },
  {
    id: '5',
    code: 'USADO2023',
    title: 'R$ 5 off',
    description: 'R$ 5 de desconto',
    discount: 'R$ 5',
    type: 'fixed',
    expiresAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    isUsed: true
  },
]

export function WalletPage() {
  const [filter, setFilter] = useState<'available' | 'used' | 'expired'>('available')

  const coupons = mockCoupons.filter(c => {
    if (filter === 'available') return !c.isUsed && new Date(c.expiresAt) > new Date()
    if (filter === 'used') return c.isUsed
    if (filter === 'expired') return !c.isUsed && new Date(c.expiresAt) <= new Date()
    return true
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const isExpiringSoon = (dateStr: string) => {
    const daysUntil = (new Date(dateStr).getTime() - Date.now()) / 86400000
    return daysUntil <= 3 && daysUntil > 0
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {([
          { key: 'available', label: 'Disponíveis', count: mockCoupons.filter(c => !c.isUsed && new Date(c.expiresAt) > new Date()).length },
          { key: 'used', label: 'Usados', count: mockCoupons.filter(c => c.isUsed).length },
          { key: 'expired', label: 'Expirados', count: mockCoupons.filter(c => !c.isUsed && new Date(c.expiresAt) <= new Date()).length },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
              filter === key
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Coupons list */}
      {coupons.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-2">
            {filter === 'available' ? '🎟️' : filter === 'used' ? '✅' : '⏰'}
          </p>
          <p className="font-bold text-brand-ink">
            {filter === 'available' ? 'Nenhum cupom disponível' :
             filter === 'used' ? 'Nenhum cupom usado' :
             'Nenhum cupom expirado'}
          </p>
          <p className="text-sm text-brand-muted mt-1">
            {filter === 'available' && 'Aproveite as promoções!'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {coupons.map(coupon => (
            <Card key={coupon.id} padding="md" className={coupon.isUsed ? 'opacity-60' : ''}>
              <div className="flex gap-3">
                {/* Discount badge */}
                <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center ${
                  coupon.type === 'frete' ? 'bg-emerald-100' :
                  coupon.type === 'percent' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  <span className="text-xl font-extrabold text-brand-ink">
                    {coupon.type === 'frete' ? 'FREE' : coupon.discount}
                  </span>
                  {coupon.type === 'frete' && <span className="text-xs text-emerald-700">FRETE</span>}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-brand-ink">{coupon.title}</h4>
                      <p className="text-xs text-brand-muted mt-0.5">{coupon.description}</p>
                    </div>
                    {isExpiringSoon(coupon.expiresAt) && !coupon.isUsed && (
                      <Badge variant="warning" className="text-xs">Expira em breve</Badge>
                    )}
                    {coupon.isUsed && (
                      <Badge variant="outline" className="text-xs">Usado</Badge>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <code className="text-xs bg-brand-soft px-2 py-1 rounded font-mono font-bold text-brand-ink">
                        {coupon.code}
                      </code>
                      {coupon.minOrder && (
                        <p className="text-xs text-amber-600 mt-1">
                          Mín: R$ {coupon.minOrder}
                        </p>
                      )}
                    </div>
                    {!coupon.isUsed && (
                      <div className="text-right">
                        <p className="text-xs text-brand-muted">Expira em</p>
                        <p className={`text-sm font-bold ${isExpiringSoon(coupon.expiresAt) ? 'text-red-500' : 'text-brand-ink'}`}>
                          {formatDate(coupon.expiresAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  {!coupon.isUsed && (
                    <button
                      onClick={() => navigator.clipboard.writeText(coupon.code)}
                      className="mt-2 text-xs text-brand-red hover:underline"
                    >
                      📋 Copiar código
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add new coupon */}
      <Card padding="md" className="border-dashed border-2 border-brand-line">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
            🎫
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-brand-ink">Tem um cupom?</h4>
            <p className="text-xs text-brand-muted mt-0.5">
              Digite o código e clique em aplicar
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Código do cupom"
            className="flex-1 px-4 py-2 border border-brand-line rounded-xl text-sm focus:outline-none focus:border-brand-red"
          />
          <button className="px-4 py-2 bg-brand-red text-white rounded-xl text-sm font-bold hover:bg-brand-red-dark transition-colors">
            Aplicar
          </button>
        </div>
      </Card>
    </div>
  )
}

// Import useState
import { useState } from 'react'