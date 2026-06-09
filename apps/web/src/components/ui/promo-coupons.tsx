/**
 * Feirinha Express - Promotions & Coupons System
 * Complete coupon management and deals
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

// ==================== TYPES ====================

interface Coupon {
  id: string
  code: string
  title: string
  description: string
  type: 'percent' | 'fixed' | 'freight' | 'cashback'
  value: number
  minOrder?: number
  maxDiscount?: number
  expiresAt: Date
  used: boolean
  usedAt?: Date
  storeId?: string
  storeName?: string
  category?: string
  icon: string
  color: string
}

interface Promotion {
  id: string
  title: string
  subtitle: string
  type: 'banner' | 'deal' | 'combo' | 'flash'
  icon: string
  image?: string
  discount: string
  validUntil: Date
  products?: { id: string; name: string; emoji: string; originalPrice: number; promoPrice: number }[]
  background: string
}

// ==================== COUPON CARD ====================

interface CouponCardProps {
  coupon: Coupon
  onUse: () => void
  onCopy: () => void
}

export function CouponCard({ coupon, onUse, onCopy }: CouponCardProps) {
  const isExpired = new Date(coupon.expiresAt) < new Date()
  const isUsed = coupon.used

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  }

  const formatValue = () => {
    switch (coupon.type) {
      case 'percent':
        return `${coupon.value}% OFF`
      case 'fixed':
        return `R$ ${coupon.value} OFF`
      case 'freight':
        return 'Frete grátis'
      case 'cashback':
        return `${coupon.value}% cashback`
      default:
        return ''
    }
  }

  return (
    <Card padding="md" className={`${isExpired || isUsed ? 'opacity-60' : ''}`}>
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: coupon.color + '20' }}
        >
          {coupon.icon}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-extrabold text-brand-ink">{coupon.title}</p>
              <p className="text-sm text-brand-muted">{coupon.description}</p>
            </div>
            {isUsed && <Badge variant="default">Usado</Badge>}
            {isExpired && !isUsed && <Badge variant="error">Expirado</Badge>}
          </div>

          {/* Value */}
          <p className="text-2xl font-extrabold text-brand-red mt-2">
            {formatValue()}
          </p>

          {/* Code */}
          {!isUsed && !isExpired && (
            <div className="flex items-center gap-2 mt-2">
              <code className="px-3 py-1 bg-brand-soft rounded-lg font-mono text-sm font-bold">
                {coupon.code}
              </code>
              <button
                onClick={onCopy}
                className="text-sm text-brand-red hover:underline"
              >
                Copiar
              </button>
            </div>
          )}

          {/* Conditions */}
          <div className="flex items-center gap-3 mt-2 text-xs text-brand-muted">
            {coupon.minOrder && (
              <span>Pedido mínimo: R$ {coupon.minOrder.toFixed(2).replace('.', ',')}</span>
            )}
            {coupon.maxDiscount && (
              <span>Max: R$ {coupon.maxDiscount.toFixed(2).replace('.', ',')}</span>
            )}
            <span>Valido até {formatDate(coupon.expiresAt)}</span>
          </div>

          {coupon.storeName && (
            <Badge variant="info" className="mt-2">
              🏪 {coupon.storeName}
            </Badge>
          )}
        </div>
      </div>

      {/* Action */}
      {!isUsed && !isExpired && (
        <Button variant="primary" className="w-full mt-4" onClick={onUse}>
          Usar cupom
        </Button>
      )}
    </Card>
  )
}

// ==================== PROMO CODE INPUT ====================

interface PromoCodeInputProps {
  onApply: (code: string) => void
  appliedCode?: string
  onRemove?: () => void
  error?: string
}

export function PromoCodeInput({ onApply, appliedCode, onRemove, error }: PromoCodeInputProps) {
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return
    setIsApplying(true)
    await new Promise(r => setTimeout(r, 500))
    onApply(code.toUpperCase())
    setIsApplying(false)
  }

  if (appliedCode) {
    return (
      <Card padding="sm" className="bg-emerald-50 border border-emerald-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <div>
              <p className="font-medium text-emerald-800">{appliedCode}</p>
              <p className="text-xs text-emerald-600">Cupom aplicado!</p>
            </div>
          </div>
          <button onClick={onRemove} className="text-emerald-600 hover:text-emerald-800">
            ✕
          </button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Código do cupom"
            error={error}
          />
        </div>
        <Button
          variant="primary"
          onClick={handleApply}
          loading={isApplying}
          disabled={!code.trim()}
        >
          Aplicar
        </Button>
      </div>
    </div>
  )
}

// ==================== PROMOTIONS BANNER ====================

interface PromotionsBannerProps {
  promotions: Promotion[]
  onPromotionClick: (promo: Promotion) => void
}

export function PromotionsBanner({ promotions, onPromotionClick }: PromotionsBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">🔥 Ofertas</h3>
        <Button variant="ghost" size="sm">Ver todas</Button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-3">
          {promotions.map((promo, index) => (
            <button
              key={promo.id}
              onClick={() => onPromotionClick(promo)}
              className="flex-shrink-0 w-64 p-4 rounded-2xl text-left transition-transform hover:scale-102"
              style={{ background: promo.background }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{promo.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-white text-opacity-80">{promo.subtitle}</p>
                  <p className="font-extrabold text-white">{promo.title}</p>
                  <div className="mt-2 px-2 py-1 bg-white bg-opacity-20 rounded-lg inline-block">
                    <span className="text-sm font-bold text-white">{promo.discount}</span>
                  </div>
                </div>
              </div>
              {promo.type === 'flash' && (
                <Badge variant="warning" className="mt-2 bg-yellow-400">
                  ⚡ Flash Sale
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-brand-red' : 'bg-brand-line'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ==================== DEAL OF THE DAY ====================

interface DealOfDayProps {
  product: {
    id: string
    name: string
    emoji: string
    originalPrice: number
    promoPrice: number
    store: string
    discount: number
  }
  onAddToCart: () => void
  onBuyNow: () => void
}

export function DealOfDay({ product, onAddToCart, onBuyNow }: DealOfDayProps) {
  const progress = 75 // Fake progress
  const remaining = 12 // Fake remaining

  return (
    <Card padding="md" className="bg-gradient-to-br from-red-500 to-orange-500 text-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚡</span>
        <h3 className="font-extrabold">OFERTA DO DIA</h3>
      </div>

      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-5xl">
          {product.emoji}
        </div>
        <div className="flex-1">
          <p className="font-bold">{product.name}</p>
          <p className="text-sm text-white text-opacity-80">{product.store}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-extrabold">R$ {product.promoPrice.toFixed(2).replace('.', ',')}</span>
            <span className="text-sm line-through text-white text-opacity-60">
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
            <Badge variant="warning" className="bg-yellow-400 text-yellow-900">
              -{product.discount}%
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white text-opacity-80">{remaining} restantes</span>
          <span className="text-white text-opacity-80">{progress}% vendido</span>
        </div>
        <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button variant="secondary" className="flex-1 bg-white text-red-600 border-0" onClick={onAddToCart}>
          🛒 Adicionar
        </Button>
        <Button variant="secondary" className="flex-1 bg-yellow-400 text-red-700 border-0" onClick={onBuyNow}>
          Comprar Agora
        </Button>
      </div>
    </Card>
  )
}

// ==================== COMBO DEAL ====================

interface ComboDealProps {
  combo: {
    id: string
    name: string
    items: { emoji: string; name: string }[]
    originalPrice: number
    comboPrice: number
    store: string
    storeEmoji: string
  }
  onAdd: () => void
}

export function ComboDeal({ combo, onAdd }: ComboDealProps) {
  const savings = combo.originalPrice - combo.comboPrice

  return (
    <Card padding="md" className="bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1">
          <p className="text-xs text-brand-muted">{combo.storeEmoji} {combo.store}</p>
          <p className="font-bold text-brand-ink">{combo.name}</p>
        </div>
        <Badge variant="success">Combo</Badge>
      </div>

      {/* Items */}
      <div className="flex items-center justify-center gap-2 my-4">
        {combo.items.map((item, index) => (
          <div key={index} className="text-center">
            <span className="text-3xl">{item.emoji}</span>
            <p className="text-xs text-brand-muted mt-1">{item.name}</p>
            {index < combo.items.length - 1 && <span className="text-brand-muted">+</span>}
          </div>
        ))}
      </div>

      {/* Prices */}
      <div className="text-center">
        <span className="text-sm text-brand-muted line-through">
          R$ {combo.originalPrice.toFixed(2).replace('.', ',')}
        </span>
        <p className="text-2xl font-extrabold text-brand-red">
          R$ {combo.comboPrice.toFixed(2).replace('.', ',')}
        </p>
        <Badge variant="success" className="mt-1">
          Economia de R$ {savings.toFixed(2).replace('.', ',')}
        </Badge>
      </div>

      <Button variant="primary" className="w-full mt-4" onClick={onAdd}>
        Adicionar combo
      </Button>
    </Card>
  )
}

// ==================== FULL PROMOTIONS PAGE ====================

export function PromotionsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'PRIMEIRACOMPRA',
      title: '10% na primeira compra',
      description: 'Desconto válido para novos clientes',
      type: 'percent',
      value: 10,
      minOrder: 30,
      maxDiscount: 15,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      used: false,
      icon: '🎁',
      color: '#ef4444',
    },
    {
      id: '2',
      code: 'FRETE10',
      title: 'Frete grátis',
      description: 'Frete grátis em qualquer pedido',
      type: 'freight',
      value: 0,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      used: false,
      icon: '🚚',
      color: '#3b82f6',
    },
    {
      id: '3',
      code: 'PIZZA30',
      title: 'R$ 30 OFF',
      description: 'R$ 30 de desconto em pizzas',
      type: 'fixed',
      value: 30,
      minOrder: 80,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      used: false,
      storeId: 'pizza-express',
      storeName: 'Pizza Express',
      icon: '🍕',
      color: '#f97316',
    },
    {
      id: '4',
      code: 'CASH5',
      title: '5% de cashback',
      description: '5% de cashback em todos os pedidos',
      type: 'cashback',
      value: 5,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      used: true,
      usedAt: new Date(),
      icon: '💰',
      color: '#10b981',
    },
    {
      id: '5',
      code: 'EXPIRADO2024',
      title: '20% OFF',
      description: 'Cupom expirado',
      type: 'percent',
      value: 20,
      expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      used: false,
      icon: '⏰',
      color: '#6b7280',
    },
  ])

  const [promotions] = useState<Promotion[]>([
    {
      id: '1',
      title: 'Combo Família',
      subtitle: 'Pizzas + Bebidas',
      type: 'combo',
      icon: '🍕',
      discount: 'até 35% OFF',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      background: 'linear-gradient(135deg, #ef4444, #f97316)',
    },
    {
      id: '2',
      title: 'Flash Sale',
      subtitle: 'Por tempo limitado',
      type: 'flash',
      icon: '⚡',
      discount: 'até 50% OFF',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
    {
      id: '3',
      title: 'Sobremesas',
      subtitle: 'Doces irresistíveis',
      type: 'deal',
      icon: '🍰',
      discount: '2ª com 30% OFF',
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      background: 'linear-gradient(135deg, #ec4899, #f472b6)',
    },
  ])

  const filteredCoupons = coupons.filter(c => {
    if (activeTab === 'available') return !c.used && new Date(c.expiresAt) > new Date()
    if (activeTab === 'used') return c.used
    if (activeTab === 'expired') return !c.used && new Date(c.expiresAt) < new Date()
    return true
  })

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleApplyCode = (code: string) => {
    const coupon = coupons.find(c => c.code === code && !c.used)
    if (coupon && new Date(coupon.expiresAt) > new Date()) {
      setAppliedCode(code)
    }
  }

  const handleUseCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, used: true, usedAt: new Date() } : c))
  }

  return (
    <div className="space-y-6">
      {/* Promo Code Input */}
      <PromoCodeInput
        onApply={handleApplyCode}
        appliedCode={appliedCode || undefined}
        onRemove={() => setAppliedCode(null)}
      />

      {/* Promotions Banner */}
      <PromotionsBanner
        promotions={promotions}
        onPromotionClick={(p) => console.log('Promo clicked:', p.title)}
      />

      {/* Deal of the Day */}
      <DealOfDay
        product={{
          id: '1',
          name: 'X-Burger Especial',
          emoji: '🍔',
          originalPrice: 39.90,
          promoPrice: 29.90,
          store: 'Burguer House',
          discount: 25,
        }}
        onAddToCart={() => {}}
        onBuyNow={() => {}}
      />

      {/* Combo Deals */}
      <div>
        <h3 className="font-bold text-brand-ink mb-3">🎁 Combos</h3>
        <ComboDeal
          combo={{
            id: '1',
            name: 'Combo Família',
            items: [
              { emoji: '🍕', name: 'Pizza Média' },
              { emoji: '🍟', name: 'Batata' },
              { emoji: '🥤', name: 'Refri 2L' },
            ],
            originalPrice: 89.70,
            comboPrice: 69.90,
            store: 'Pizza Express',
            storeEmoji: '🍕',
          }}
          onAdd={() => {}}
        />
      </div>

      {/* Coupons Tabs */}
      <div>
        <div className="flex gap-2 mb-4">
          {(['available', 'used', 'expired'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-ink'
              }`}
            >
              {tab === 'available' ? 'Disponíveis' : tab === 'used' ? 'Usados' : 'Expirados'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onUse={() => handleUseCoupon(coupon.id)}
              onCopy={() => handleCopyCode(coupon.code)}
            />
          ))}

          {filteredCoupons.length === 0 && (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🎫</p>
              <p className="text-brand-muted">Nenhum cupom nesta categoria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}