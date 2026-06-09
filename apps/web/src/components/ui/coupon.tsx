'use client'

import { useState } from 'react'
import { Card } from './card'
import { Button } from './button'
import { Input } from './input'

// ==================== COUPON BADGE ====================

interface CouponBadgeProps {
  code: string
  title: string
  type: 'percentage' | 'fixed' | 'free_delivery' | 'first_order'
  value: number
  onApply?: () => void
  onRemove?: () => void
  isApplied?: boolean
  isExpired?: boolean
}

export function CouponBadge({
  code,
  title,
  type,
  value,
  onApply,
  onRemove,
  isApplied = false,
  isExpired = false,
}: CouponBadgeProps) {
  const getIcon = () => {
    switch (type) {
      case 'percentage': return '💯'
      case 'fixed': return '💰'
      case 'free_delivery': return '🚚'
      case 'first_order': return '🎁'
      default: return '🎫'
    }
  }

  const getValueText = () => {
    switch (type) {
      case 'percentage': return `${value}% OFF`
      case 'fixed': return `R$ ${value.toFixed(2)} OFF`
      case 'free_delivery': return 'Frete Grátis'
      case 'first_order': return '1ª Compra'
      default: return ''
    }
  }

  return (
    <div
      className={`relative p-4 rounded-xl border-2 ${
        isExpired
          ? 'border-gray-200 opacity-60'
          : isApplied
          ? 'border-green-500 bg-green-50'
          : 'border-dashed border-brand-red bg-red-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-ink">{getValueText()}</span>
            {isApplied && (
              <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">
                Aplicado
              </span>
            )}
          </div>
          <p className="text-sm text-brand-ink font-medium">{title}</p>
          <p className="text-xs text-brand-muted">Código: {code}</p>
        </div>
        {!isExpired && (
          <button
            onClick={isApplied ? onRemove : onApply}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isApplied
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-brand-red text-white hover:bg-brand-red-dark'
            }`}
          >
            {isApplied ? 'Remover' : 'Usar'}
          </button>
        )}
      </div>
      {isExpired && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <span className="text-sm font-medium text-gray-500">Expirado</span>
        </div>
      )}
    </div>
  )
}

// ==================== COUPON INPUT ====================

interface CouponInputProps {
  onApply: (code: string) => Promise<{ valid: boolean; discount: number; title: string }>
  onRemove: () => void
  appliedCoupon?: { code: string; discount: number; title: string } | null
  minOrderValue?: number
}

export function CouponInput({ onApply, onRemove, appliedCoupon, minOrderValue = 0 }: CouponInputProps) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) return
    setIsLoading(true)
    setError('')
    try {
      const result = await onApply(code.trim().toUpperCase())
      if (!result.valid) {
        setError('Cupom inválido ou expirado')
      }
    } catch {
      setError('Erro ao validar cupom')
    } finally {
      setIsLoading(false)
    }
  }

  if (appliedCoupon) {
    return (
      <div className="space-y-3">
        <CouponBadge
          code={appliedCoupon.code}
          title={appliedCoupon.title}
          type="fixed"
          value={appliedCoupon.discount}
          isApplied={true}
          onRemove={onRemove}
        />
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <span className="text-sm text-green-700">
            Desconto de <strong>R$ {appliedCoupon.discount.toFixed(2)}</strong> aplicado!
          </span>
          <button onClick={onRemove} className="text-sm text-green-700 hover:underline">
            Remover
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Digite o código do cupom"
          className="flex-1"
        />
        <Button onClick={handleApply} disabled={!code.trim() || isLoading}>
          {isLoading ? '...' : 'Aplicar'}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {minOrderValue > 0 && (
        <p className="text-xs text-brand-muted">
          Pedido mínimo: R$ {minOrderValue.toFixed(2)}
        </p>
      )}
    </div>
  )
}

// ==================== COUPON LIST ====================

interface Coupon {
  id: string
  code: string
  title: string
  description?: string
  type: string
  value: number
  minOrderValue: number
  expiresAt: string
  isGlobal: boolean
  merchantId?: string
}

interface CouponListProps {
  coupons: Coupon[]
  onSelect: (coupon: Coupon) => void
  selectedCouponId?: string
}

export function CouponList({ coupons, onSelect, selectedCouponId }: CouponListProps) {
  const now = new Date()

  return (
    <div className="space-y-3">
      {coupons.map((coupon) => {
        const expiresAt = new Date(coupon.expiresAt)
        const isExpired = expiresAt < now

        return (
          <CouponBadge
            key={coupon.id}
            code={coupon.code}
            title={coupon.title}
            type={coupon.type as any}
            value={coupon.value}
            isApplied={selectedCouponId === coupon.id}
            isExpired={isExpired}
            onApply={() => onSelect(coupon)}
          />
        )
      })}
      {coupons.length === 0 && (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🎫</p>
          <p className="text-brand-muted">Nenhum cupom disponível</p>
        </div>
      )}
    </div>
  )
}
