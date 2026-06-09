'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface Coupon {
  code: string
  discount: number
  type: 'percent' | 'fixed'
  minValue?: number
  maxDiscount?: number
  description: string
  expiresAt?: string
}

interface CouponInputProps {
  onApply?: (coupon: Coupon) => void
  onRemove?: () => void
  appliedCoupon?: Coupon | null
  cartTotal: number
}

export function CouponInput({
  onApply,
  onRemove,
  appliedCoupon,
  cartTotal
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Mock coupons para demo
  const availableCoupons: Coupon[] = [
    { code: 'PRIMEIRACOMPRA', discount: 10, type: 'percent', minValue: 50, maxDiscount: 20, description: '10% off na primeira compra' },
    { code: 'FRETE10', discount: 9.9, type: 'fixed', description: 'Frete grátis' },
    { code: 'DESCONTO15', discount: 15, type: 'percent', minValue: 100, maxDiscount: 30, description: '15% off em compras acima de R$100' },
    { code: 'BLACKFRIDAY', discount: 25, type: 'percent', minValue: 200, maxDiscount: 50, description: '25% off (max R$50)' },
  ]

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Digite um código')
      return
    }

    setIsLoading(true)

    // Simular validação
    await new Promise(resolve => setTimeout(resolve, 800))

    const coupon = availableCoupons.find(
      c => c.code.toUpperCase() === code.trim().toUpperCase()
    )

    if (!coupon) {
      toast.error('Código inválido', 'Este cupom não existe ou expirou')
      setIsLoading(false)
      return
    }

    if (coupon.minValue && cartTotal < coupon.minValue) {
      toast.error('Valor mínimo não atingido', `Compre mais R$ ${(coupon.minValue - cartTotal).toFixed(2)} para usar`)
      setIsLoading(false)
      return
    }

    toast.success('Cupom aplicado!', `${coupon.description}`)
    onApply?.(coupon)
    setCode('')
    setIsExpanded(false)
    setIsLoading(false)
  }

  const handleRemove = () => {
    onRemove?.()
    toast.info('Cupom removido')
  }

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.type === 'percent') {
      return `${coupon.discount}% OFF`
    }
    return `R$ ${coupon.discount.toFixed(2)}`
  }

  // Calcular desconto
  const calculateDiscount = (coupon: Coupon, total: number) => {
    if (coupon.type === 'percent') {
      let discount = total * (coupon.discount / 100)
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
      return discount
    }
    return coupon.discount
  }

  if (appliedCoupon) {
    return (
      <Card padding="md" className="bg-emerald-50 border-emerald-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg">
              🎟️
            </div>
            <div>
              <p className="font-bold text-emerald-800">{appliedCoupon.code}</p>
              <p className="text-xs text-emerald-600">{appliedCoupon.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-emerald-700">
              -{formatDiscount(appliedCoupon)}
            </span>
            <button
              onClick={handleRemove}
              className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Input simples */}
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Código do cupom"
          className="flex-1 px-4 py-3 border border-brand-line rounded-xl text-sm font-medium placeholder:text-brand-muted focus:outline-none focus:border-brand-red"
        />
        <button
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-red-dark transition-colors"
        >
          {isLoading ? '⏳' : 'Aplicar'}
        </button>
      </div>

      {/* Cupons disponíveis */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-brand-red hover:underline"
      >
        {isExpanded ? '▲ Esconder cupons' : '▼ Ver cupons disponíveis'}
      </button>

      {isExpanded && (
        <div className="space-y-2 animate-fade-up">
          {availableCoupons.map((coupon) => {
            const canUse = !coupon.minValue || cartTotal >= coupon.minValue
            return (
              <Card
                key={coupon.code}
                padding="sm"
                className={`cursor-pointer transition-colors ${
                  canUse ? 'hover:border-brand-red' : 'opacity-50'
                }`}
                onClick={() => {
                  if (canUse) {
                    setCode(coupon.code)
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-lg">
                      🎫
                    </div>
                    <div>
                      <p className="font-bold text-brand-ink text-sm">{coupon.code}</p>
                      <p className="text-xs text-brand-muted">{coupon.description}</p>
                      {coupon.minValue && (
                        <p className="text-xs text-amber-600">
                          Mínimo: R$ {coupon.minValue.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${canUse ? 'text-emerald-600' : 'text-brand-muted'}`}>
                    {formatDiscount(coupon)}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Hook para gerenciar cupons
interface UseCouponReturn {
  coupon: Coupon | null
  discount: number
  applyCoupon: (code: string) => Promise<boolean>
  removeCoupon: () => void
}

export function useCoupon(): UseCouponReturn {
  const [coupon, setCoupon] = useState<Coupon | null>(null)

  const availableCoupons: Coupon[] = [
    { code: 'PRIMEIRACOMPRA', discount: 10, type: 'percent', minValue: 50, maxDiscount: 20, description: '10% off na primeira compra' },
    { code: 'FRETE10', discount: 9.9, type: 'fixed', description: 'Frete grátis' },
    { code: 'DESCONTO15', discount: 15, type: 'percent', minValue: 100, maxDiscount: 30, description: '15% off em compras acima de R$100' },
  ]

  const applyCoupon = async (code: string): Promise<boolean> => {
    const found = availableCoupons.find(c => c.code === code.toUpperCase())
    if (found) {
      setCoupon(found)
      return true
    }
    return false
  }

  const removeCoupon = () => {
    setCoupon(null)
  }

  const calculateDiscountAmount = (cartTotal: number): number => {
    if (!coupon) return 0
    if (coupon.type === 'percent') {
      let discount = cartTotal * (coupon.discount / 100)
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
      return discount
    }
    return coupon.discount
  }

  return {
    coupon,
    discount: 0, // Calculado dinamicamente
    applyCoupon,
    removeCoupon
  }
}