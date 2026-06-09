'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrderSummary, OrderReceipt } from '@/components/ui/order-summary'
import { NavBar } from '@/components/ui/navbar'
import { Button, Card, Badge } from '@/components/ui'
import { toast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

function OrderConfirmedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const isPix = searchParams.get('pix') === 'true'

  const [orderNumber] = useState(`FX-${Math.floor(Math.random() * 9000) + 1000}`)
  const [showQrCode, setShowQrCode] = useState(false)
  const [countdown, setCountdown] = useState(300)

  const mockOrder = {
    orderId: orderId || orderNumber,
    storeName: 'Fanaticos FC + Mobile Prime',
    items: [
      { name: 'Camisa Brasil retrô', quantity: 1, price: 129.90 },
      { name: 'Carregador Turbo', quantity: 2, price: 69.90 },
    ],
    subtotal: 269.70,
    deliveryFee: 4.90,
    discount: isPix ? 13.73 : 0,
    total: isPix ? 260.87 : 274.60,
    paymentMethod: isPix ? 'pix' : 'credit',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    estimatedTime: '25-35 min',
    status: 'pending' as const,
  }

  useEffect(() => {
    if (isPix) {
      setShowQrCode(true)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            toast.error('QR Code expirado', 'Gere um novo código PIX')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPix])

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136feirinha@pix.com52040000530398654042300005802BR5925FEIRINHA6009SAO PAULO62070503***6304')
    toast.success('Código PIX copiado!')
  }

  return (
    <main className="min-h-screen bg-brand-paper pb-24">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink w-full text-center">
          {isPix ? 'Aguardando Pagamento' : 'Pedido Confirmado!'}
        </h1>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto space-y-6">
        {/* Success Animation */}
        <div className="text-center py-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce ${
            isPix ? 'bg-amber-100' : 'bg-emerald-100'
          }`}>
            <span className="text-5xl">{isPix ? '⏳' : '🎉'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-brand-ink">Pedido #{orderNumber}</h2>
          <p className="text-brand-muted mt-2">
            {isPix ? 'Efetue o pagamento para confirmar' : 'Sua encomenda está sendo preparada'}
          </p>
        </div>

        {/* PIX Payment Section */}
        {isPix && (
          <Card padding="md" className="bg-gradient-to-br from-brand-red to-red-700 text-white">
            <div className="text-center mb-4">
              <p className="text-sm opacity-80">Valor a pagar</p>
              <p className="text-3xl font-extrabold">{formatCurrency(mockOrder.total)}</p>
              <p className="text-xs opacity-80 mt-1">
                Expira em: <span className="font-bold">{formatCountdown(countdown)}</span>
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl p-4">
              <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <div className="text-center">
                  <span className="text-5xl block mb-2">📱</span>
                  <p className="text-xs text-brand-muted">QR Code PIX</p>
                </div>
              </div>
              <p className="text-center text-xs text-brand-muted">
                Escaneie com o app do seu banco
              </p>
            </div>

            {/* Copy Code Button */}
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/20"
                onClick={copyPixCode}
              >
                📋 Copiar código PIX
              </Button>
            </div>
          </Card>
        )}

        {/* Order Summary */}
        <OrderSummary {...mockOrder} />

        {/* Actions */}
        <div className="space-y-3">
          {isPix ? (
            <>
              <Button
                className="w-full"
                onClick={() => router.push(`/user/tracking/${mockOrder.orderId}`)}
              >
                🔄 Já fiz o pagamento
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/user/home')}
              >
                ← Cancelar e voltar
              </Button>
            </>
          ) : (
            <>
              <Link href={`/user/tracking/${mockOrder.orderId}`} className="block">
                <Button className="w-full py-4 text-lg">
                  📍 Acompanhar pedido
                </Button>
              </Link>
              <Link href="/user/home" className="block">
                <Button variant="outline" className="w-full">
                  ← Continuar comprando
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Help */}
        <Card padding="md" className="bg-brand-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">
              💬
            </div>
            <div className="flex-1">
              <p className="font-bold text-brand-ink">Precisa de ajuda?</p>
              <p className="text-sm text-brand-muted">Fale com nosso suporte</p>
            </div>
            <Button variant="ghost" size="sm">
              Chat
            </Button>
          </div>
        </Card>

        {/* Receipt */}
        <details className="group">
          <summary className="cursor-pointer text-center text-brand-red font-medium hover:underline">
            📄 Ver comprovante
          </summary>
          <div className="mt-4 animate-fade-up">
            <OrderReceipt order={mockOrder} />
          </div>
        </details>
      </div>
    </main>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-paper flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Carregando...</p>
        </div>
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  )
}