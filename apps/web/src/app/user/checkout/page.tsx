'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { createOrder } from '@/lib/api/orders'
import { toast } from '@/components/ui/toast'
import { Card, Button, Badge, NavBar, BottomNav } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

type PaymentMethod = 'pix' | 'credit' | 'debit'

interface Address {
  id: string
  label: string
  street: string
  number: string
  neighborhood: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const cart = useCartStore()
  const auth = useAuthStore()

  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [notes, setNotes] = useState('')

  // Mock addresses para demo
  const mockAddresses: Address[] = [
    { id: '1', label: 'Casa', street: 'Av. Paulista', number: '1000', neighborhood: 'Bela Vista' },
    { id: '2', label: 'Trabalho', street: 'Rua Oscar Freire', number: '250', neighborhood: 'Jardins' },
  ]

  useEffect(() => {
    // Em produção, buscar endereços da API
    setAddresses(mockAddresses)
    if (mockAddresses.length > 0 && !selectedAddress) {
      setSelectedAddress(mockAddresses[0].id)
    }
  }, [])

  const subtotal = cart.getSubtotal()
  const deliveryFee = cart.getDeliveryFee()
  const discount = paymentMethod === 'pix' ? subtotal * 0.05 : couponDiscount
  const total = subtotal + deliveryFee - discount

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Selecione um endereço')
      return
    }

    if (!auth.isAuthenticated()) {
      toast.error('Faça login para continuar')
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      const result = await createOrder({
        items: cart.getCheckoutItems(),
        addressId: selectedAddress,
        paymentMethod,
        couponCode: couponCode || undefined,
        notes: notes || undefined,
      })

      // Limpar carrinho após pedido criado
      cart.clearCart()

      if (result.pix && paymentMethod === 'pix') {
        // Mostrar QR Code do PIX
        router.push(`/user/order-confirmed?orderId=${result.order.id}&pix=true`)
      } else {
        router.push(`/user/order-confirmed?orderId=${result.order.id}`)
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      toast.error('Erro ao criar pedido', 'Tente novamente')
    } finally {
      setLoading(false)
    }
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'FEIRINHA10') {
      setCouponDiscount(subtotal * 0.1)
      toast.success('Cupom aplicado', '10% de desconto!')
    } else {
      toast.error('Cupom inválido')
    }
  }

  const selectedAddressData = addresses.find(a => a.id === selectedAddress)

  return (
    <div className="min-h-screen bg-brand-paper pb-32">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <button onClick={() => step === 'address' ? router.back() : setStep('address')} className="text-brand-muted hover:text-brand-ink">
            ←
          </button>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">Finalizar Pedido</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {['address', 'payment', 'confirmation'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-brand-red text-white' :
                (s === 'payment' && step === 'confirmation') || (s === 'address' && step !== 'address')
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-muted'
              }`}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-12 h-0.5 bg-brand-line" />}
            </div>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 'address' && (
          <>
            <Card padding="md">
              <h2 className="text-lg font-bold text-brand-ink mb-4">📍 Endereço de entrega</h2>

              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-brand-muted mb-3">Você ainda não tem endereços cadastrados</p>
                  <Button variant="outline" size="sm">+ Adicionar endereço</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                        selectedAddress === addr.id
                          ? 'border-brand-red bg-brand-soft'
                          : 'border-brand-line hover:border-brand-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{addr.label === 'Casa' ? '🏠' : '🏢'}</span>
                        <div>
                          <p className="font-bold text-brand-ink">{addr.label}</p>
                          <p className="text-sm text-brand-muted">
                            {addr.street}, {addr.number} - {addr.neighborhood}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Items Summary */}
            <Card padding="md">
              <h2 className="text-lg font-bold text-brand-ink mb-3">🛒 Itens do pedido</h2>
              <div className="space-y-3">
                {cart.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
                      {item.emoji || '📦'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-brand-ink">{item.title}</p>
                      <p className="text-xs text-brand-muted">x{item.quantity} • {item.storeName}</p>
                    </div>
                    <p className="font-bold text-brand-ink">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Button
              className="w-full"
              disabled={!selectedAddress}
              onClick={() => setStep('payment')}
            >
              Continuar para pagamento →
            </Button>
          </>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <>
            {/* Address Summary */}
            <Card padding="md" className="bg-brand-soft border-brand-red">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <div>
                  <p className="font-bold text-brand-ink">{selectedAddressData?.label}</p>
                  <p className="text-sm text-brand-muted">
                    {selectedAddressData?.street}, {selectedAddressData?.number}
                  </p>
                </div>
                <button onClick={() => setStep('address')} className="ml-auto text-brand-red text-sm">
                  Editar
                </button>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card padding="md">
              <h2 className="text-lg font-bold text-brand-ink mb-4">💳 Forma de pagamento</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                    paymentMethod === 'pix' ? 'border-brand-red bg-brand-soft' : 'border-brand-line'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💠</span>
                    <div className="flex-1">
                      <p className="font-bold text-brand-ink">PIX</p>
                      <p className="text-sm text-brand-green font-medium">5% de desconto</p>
                    </div>
                    {paymentMethod === 'pix' && (
                      <Badge variant="success" className="text-xs">Selecionado</Badge>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                    paymentMethod === 'credit' ? 'border-brand-red bg-brand-soft' : 'border-brand-line'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💳</span>
                    <div className="flex-1">
                      <p className="font-bold text-brand-ink">Cartão de Crédito</p>
                      <p className="text-sm text-brand-muted">Visa •••• 4242</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('debit')}
                  className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                    paymentMethod === 'debit' ? 'border-brand-red bg-brand-soft' : 'border-brand-line'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💳</span>
                    <div className="flex-1">
                      <p className="font-bold text-brand-ink">Cartão de Débito</p>
                      <p className="text-sm text-brand-muted">Mastercard •••• 8888</p>
                    </div>
                  </div>
                </button>
              </div>
            </Card>

            {/* Coupon */}
            <Card padding="md">
              <h2 className="text-lg font-bold text-brand-ink mb-3">🎟️ Cupom de desconto</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Digite seu cupom"
                  className="flex-1 px-4 py-3 rounded-xl border border-brand-line bg-white"
                />
                <Button variant="outline" onClick={applyCoupon}>
                  Aplicar
                </Button>
              </div>
              {couponDiscount > 0 && (
                <p className="text-sm text-brand-green mt-2 font-medium">
                  ✓ Cupom aplicado! -{formatCurrency(couponDiscount)}
                </p>
              )}
            </Card>

            {/* Notes */}
            <Card padding="md">
              <h2 className="text-lg font-bold text-brand-ink mb-3">📝 Observações</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Sem cebola, entrega após as 18h..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-brand-line bg-white resize-none"
              />
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('address')}>
                ← Voltar
              </Button>
              <Button
                className="flex-1"
                loading={loading}
                onClick={handlePlaceOrder}
              >
                Confirmar pedido
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-line p-4">
        <div className="max-w-[390px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-brand-muted">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-brand-muted">Taxa de entrega</span>
            <span className="font-medium">{formatCurrency(deliveryFee)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between mb-2 text-brand-green">
              <span>Desconto</span>
              <span className="font-medium">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-brand-line">
            <span className="text-lg font-bold text-brand-ink">Total</span>
            <span className="text-xl font-extrabold text-brand-red">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}