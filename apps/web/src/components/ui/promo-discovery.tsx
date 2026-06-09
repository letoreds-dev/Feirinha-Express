'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import Link from 'next/link'

interface PromoCode {
  id: string
  code: string
  description: string
  discount: string
  type: 'percent' | 'fixed' | 'freight'
  minOrder?: number
  expiresAt: string
  isActive: boolean
  usageCount: number
  maxUsage?: number
}

const availablePromos: PromoCode[] = [
  {
    id: '1',
    code: 'PRIMEIRACOMPRA',
    description: '15% de desconto na primeira compra',
    discount: '15%',
    type: 'percent',
    minOrder: 30,
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    isActive: true,
    usageCount: 0,
    maxUsage: 1,
  },
  {
    id: '2',
    code: 'FRETE10',
    description: 'Frete grátis em qualquer pedido',
    discount: 'FRETE',
    type: 'freight',
    minOrder: 40,
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    isActive: true,
    usageCount: 0,
    maxUsage: 3,
  },
  {
    id: '3',
    code: 'DESCONTO20',
    description: 'R$ 20 de desconto em compras acima de R$100',
    discount: 'R$ 20',
    type: 'fixed',
    minOrder: 100,
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    isActive: true,
    usageCount: 2,
    maxUsage: 5,
  },
]

export function PromoDiscovery() {
  const [promos, setPromos] = useState<PromoCode[]>(availablePromos)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86400000)

    if (diffDays <= 0) return 'Expirado'
    if (diffDays === 1) return 'Expira amanhã'
    if (diffDays <= 7) return `Expira em ${diffDays} dias`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  const isExpiringSoon = (dateStr: string) => {
    const diffDays = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
    return diffDays <= 3 && diffDays > 0
  }

  const getIcon = (type: PromoCode['type']) => {
    switch (type) {
      case 'percent': return '💯'
      case 'fixed': return '💰'
      case 'freight': return '🚚'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">🎟️ Cupons disponíveis</h3>
        <Link href="/user/wallet" className="text-xs text-brand-red hover:underline">
          Ver todos →
        </Link>
      </div>

      {/* Promo cards */}
      <div className="space-y-3">
        {promos.map(promo => (
          <Card key={promo.id} padding="md" className="relative overflow-hidden">
            {/* Expiring soon badge */}
            {isExpiringSoon(promo.expiresAt) && (
              <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
                ⏰ Expira em breve!
              </div>
            )}

            <div className="flex gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-red to-red-600 flex items-center justify-center text-2xl text-white flex-shrink-0">
                {getIcon(promo.type)}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-extrabold text-brand-ink">{promo.description}</p>
                    {promo.minOrder && (
                      <p className="text-xs text-brand-muted mt-1">
                        Mínimo: R$ {promo.minOrder}
                      </p>
                    )}
                  </div>
                  <Badge variant={promo.type === 'freight' ? 'info' : 'success'} className="text-xs">
                    {promo.discount}
                  </Badge>
                </div>

                {/* Code */}
                <div className="flex items-center gap-2 mt-3">
                  <code className="flex-1 px-3 py-2 bg-brand-soft rounded-lg font-mono font-bold text-brand-ink text-sm">
                    {promo.code}
                  </code>
                  <Button
                    size="sm"
                    variant={copiedCode === promo.code ? 'outline' : 'primary'}
                    onClick={() => copyCode(promo.code)}
                  >
                    {copiedCode === promo.code ? '✓ Copiado!' : '📋 Copiar'}
                  </Button>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-line">
                  <div className="flex items-center gap-3 text-xs text-brand-muted">
                    <span>{formatDate(promo.expiresAt)}</span>
                    {promo.maxUsage && (
                      <>
                        <span>•</span>
                        <span>
                          {promo.usageCount}/{promo.maxUsage} usado{promo.maxUsage > 1 ? 's' : ''}
                        </span>
                      </>
                    )}
                  </div>
                  {promo.maxUsage && promo.usageCount >= promo.maxUsage && (
                    <Badge variant="danger" className="text-xs">Esgotado</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Link href="/user/wallet">
        <Button variant="outline" className="w-full">
          Gerenciar cupons →
        </Button>
      </Link>
    </div>
  )
}