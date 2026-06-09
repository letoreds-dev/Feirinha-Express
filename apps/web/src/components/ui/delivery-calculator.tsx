'use client'

import { useState } from 'react'
import { Card } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { toast } from './toast'

interface AddressData {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
  instructions?: string
}

interface DeliveryFeeCalculatorProps {
  storeAddress?: {
    street: string
    neighborhood: string
    lat: number
    lng: number
  }
  onSelectAddress?: () => void
}

export function DeliveryFeeCalculator({
  storeAddress = {
    street: 'Av. Paulista',
    neighborhood: 'Bela Vista',
    lat: -23.5629,
    lng: -46.6544,
  },
  onSelectAddress,
}: DeliveryFeeCalculatorProps) {
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
    street: '',
    number: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '',
    instructions: '',
  })
  const [distance, setDistance] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [feeResult, setFeeResult] = useState<{
    fee: number
    distance: number
    estimatedTime: string
    freeShipping: boolean
  } | null>(null)

  // Simulate distance calculation
  const calculateFee = () => {
    if (!deliveryAddress.street || !deliveryAddress.number) {
      toast.error('Preencha o endereço completo')
      return
    }

    setIsCalculating(true)

    // Simulate API call
    setTimeout(() => {
      // Random distance between 0.5 and 10 km
      const randomDistance = 0.5 + Math.random() * 9.5
      setDistance(randomDistance)

      // Calculate fee based on distance
      let fee = 0
      const freeShippingThreshold = 50 // Free shipping for orders over R$50
      const baseFee = 5.90
      const perKmRate = 0.50

      fee = baseFee + (randomDistance * perKmRate)

      // Simulate free shipping eligibility
      const orderTotal = 75 // Would come from cart
      const freeShipping = orderTotal >= freeShippingThreshold

      if (freeShipping) {
        fee = 0
      }

      // Calculate estimated time
      const baseTime = 20 // base minutes
      const timePerKm = 3 // minutes per km
      const estimatedMinutes = baseTime + (randomDistance * timePerKm)

      setFeeResult({
        fee: Math.round(fee * 100) / 100,
        distance: Math.round(randomDistance * 10) / 10,
        estimatedTime: `${Math.round(estimatedMinutes - 5)}-${Math.round(estimatedMinutes + 5)} min`,
        freeShipping,
      })

      setIsCalculating(false)
    }, 1500)
  }

  const zones = [
    { name: 'Zona de Entrega Gratuita', distance: '0-2km', fee: 0, color: 'emerald' },
    { name: 'Zona 1', distance: '2-5km', fee: 5.90, color: 'yellow' },
    { name: 'Zona 2', distance: '5-10km', fee: 8.90, color: 'orange' },
    { name: 'Zona 3', distance: '10-15km', fee: 12.90, color: 'red' },
  ]

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">🚚 Calcular Frete</h3>

      {/* Address form */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Endereço</label>
          <input
            type="text"
            value={deliveryAddress.street}
            onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
            placeholder="Rua, Avenida..."
            className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-brand-ink mb-1">Número</label>
            <input
              type="text"
              value={deliveryAddress.number}
              onChange={(e) => setDeliveryAddress(prev => ({ ...prev, number: e.target.value }))}
              placeholder="123"
              className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-brand-ink mb-1">Complemento</label>
            <input
              type="text"
              value={deliveryAddress.complement}
              onChange={(e) => setDeliveryAddress(prev => ({ ...prev, complement: e.target.value }))}
              placeholder="Apto, Bloco..."
              className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-brand-ink mb-1">Bairro</label>
            <input
              type="text"
              value={deliveryAddress.neighborhood}
              onChange={(e) => setDeliveryAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
              placeholder="Bairro"
              className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-ink mb-1">CEP</label>
            <input
              type="text"
              value={deliveryAddress.postalCode}
              onChange={(e) => setDeliveryAddress(prev => ({ ...prev, postalCode: e.target.value }))}
              placeholder="00000-000"
              className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={calculateFee}
        loading={isCalculating}
        className="w-full mb-4"
      >
        {isCalculating ? 'Calculando...' : 'Calcular Frete'}
      </Button>

      {/* Result */}
      {feeResult && (
        <div className="animate-fade-up space-y-4">
          <div className={`p-4 rounded-xl ${
            feeResult.freeShipping
              ? 'bg-emerald-100 border border-emerald-200'
              : 'bg-brand-soft'
          }`}>
            {feeResult.freeShipping ? (
              <div className="text-center">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-bold text-emerald-700">Frete Grátis!</p>
                <p className="text-sm text-emerald-600">Você ganhou frete grátis neste pedido</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-brand-muted">Valor do frete</p>
                <p className="text-3xl font-extrabold text-brand-red">
                  R$ {feeResult.fee.toFixed(2).replace('.', ',')}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span className="text-brand-muted">Distância:</span>
              <span className="font-bold text-brand-ink">{feeResult.distance} km</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span className="text-brand-muted">Tempo:</span>
              <span className="font-bold text-brand-ink">{feeResult.estimatedTime}</span>
            </div>
          </div>

          {feeResult.fee > 0 && (
            <div className="p-3 bg-yellow-50 rounded-xl text-sm">
              <p className="text-yellow-700">
                💡 Pedindo mais R$ {(50 - 75).toFixed(2).replace('.', ',')} você ganha frete grátis!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Zone table */}
      <div className="mt-6 pt-4 border-t border-brand-line">
        <h4 className="text-sm font-bold text-brand-ink mb-3">📊 Tabela de Frete</h4>
        <div className="space-y-2">
          {zones.map((zone, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${
                  zone.color === 'emerald' ? 'emerald-500' :
                  zone.color === 'yellow' ? 'yellow-500' :
                  zone.color === 'orange' ? 'orange-500' : 'red-500'
                }`} />
                <span className="text-brand-ink">{zone.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-brand-muted">{zone.distance}</span>
                <span className="font-bold text-brand-ink">
                  {zone.fee === 0 ? 'Grátis' : `R$ ${zone.fee.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store location */}
      <div className="mt-4 p-3 bg-brand-soft rounded-xl">
        <p className="text-sm font-medium text-brand-ink mb-1">📍 Localização da loja</p>
        <p className="text-xs text-brand-muted">{storeAddress.street}, {storeAddress.neighborhood}</p>
      </div>
    </Card>
  )
}

// ==================== ORDER TOTAL CALCULATOR ====================

interface OrderTotalCalculatorProps {
  subtotal: number
  deliveryFee: number
  discount: number
  serviceFee?: number
  onApplyCoupon?: (code: string) => Promise<{ valid: boolean; discount?: number; message?: string }>
}

export function OrderTotalCalculator({
  subtotal,
  deliveryFee,
  discount,
  serviceFee = 2.90,
  onApplyCoupon,
}: OrderTotalCalculatorProps) {
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)
    setCouponError('')

    try {
      if (onApplyCoupon) {
        const result = await onApplyCoupon(couponCode)
        if (result.valid) {
          setCouponDiscount(result.discount || 0)
          toast.success('Cupom aplicado!')
        } else {
          setCouponError(result.message || 'Cupom inválido')
        }
      } else {
        // Simulate validation
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (couponCode.toUpperCase() === 'DESCONTO10') {
          const discountAmount = subtotal * 0.1
          setCouponDiscount(discountAmount)
          toast.success('10% de desconto aplicado!')
        } else {
          setCouponError('Cupom inválido ou expirado')
        }
      }
    } catch {
      setCouponError('Erro ao aplicar cupom')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    setCouponError('')
  }

  const total = subtotal + deliveryFee + serviceFee - discount - couponDiscount
  const finalTotal = Math.max(0, total)

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">💰 Resumo do Pedido</h3>

      {/* Coupon input */}
      {couponDiscount === 0 ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-brand-ink mb-2">Cupom de desconto</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Digite seu cupom"
              className="flex-1 px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
            />
            <Button
              onClick={handleApplyCoupon}
              loading={isApplyingCoupon}
              disabled={!couponCode.trim()}
              variant="outline"
            >
              Aplicar
            </Button>
          </div>
          {couponError && (
            <p className="text-red-500 text-sm mt-1">{couponError}</p>
          )}
        </div>
      ) : (
        <div className="mb-4 p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              ✓ Cupom {couponCode} aplicado
            </p>
            <p className="text-xs text-emerald-600">
              -{couponDiscount > 1 ? `R$ ${couponDiscount.toFixed(2).replace('.', ',')}` : `${couponDiscount * 100}%`}
            </p>
          </div>
          <button
            onClick={removeCoupon}
            className="text-emerald-600 hover:text-emerald-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Breakdown */}
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
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Taxa de serviço</span>
          <span className="text-brand-ink">R$ {serviceFee.toFixed(2).replace('.', ',')}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Promoção</span>
            <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Cupom</span>
            <span>-R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between pt-3 border-t border-brand-line">
        <span className="font-bold text-brand-ink">Total</span>
        <div className="text-right">
          {finalTotal < subtotal + deliveryFee && (
            <span className="text-sm text-brand-muted line-through block">
              R$ {(subtotal + deliveryFee).toFixed(2).replace('.', ',')}
            </span>
          )}
          <span className="text-xl font-extrabold text-brand-red">
            R$ {finalTotal.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Savings */}
      {(discount > 0 || couponDiscount > 0) && (
        <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-center">
          <p className="text-emerald-700 font-medium">
            🎉 Você economizou R$ {(discount + couponDiscount).toFixed(2).replace('.', ',')}!
          </p>
        </div>
      )}
    </Card>
  )
}