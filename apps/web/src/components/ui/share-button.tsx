'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui'

// ============================================
// SHARE BUTTON COMPONENT
// ============================================
// Compartilha produtos, pedidos e lojas
// ============================================

export interface ShareData {
  title: string
  text: string
  url: string
}

export function useShare() {
  const [isSupported, setIsSupported] = useState(
    typeof navigator !== 'undefined' && !!navigator.share
  )

  const share = useCallback(async (data: ShareData) => {
    if (isSupported) {
      try {
        await navigator.share(data)
        return true
      } catch (err) {
        // Usuário cancelou ou erro
        console.log('Share cancelled or failed:', err)
        return false
      }
    } else {
      // Fallback: copiar para clipboard
      try {
        await navigator.clipboard.writeText(data.url)
        return true
      } catch {
        return false
      }
    }
  }, [isSupported])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }, [])

  return { share, copyToClipboard, isSupported }
}

// ============================================
// SHARE BUTTON
// ============================================

export function ShareButton({
  data,
  variant = 'ghost',
  size = 'md',
  label = 'Compartilhar'
}: {
  data: ShareData
  variant?: 'ghost' | 'outline' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  label?: string
}) {
  const { share, copyToClipboard, isSupported } = useShare()
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const success = await share(data)
    if (success) {
      setShowMenu(false)
    }
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(data.url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setShowMenu(false)
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowMenu(!showMenu)}
        className={sizeClasses[size]}
      >
        {showMenu ? '✕' : '📤'} {label}
      </Button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-brand-line z-20 min-w-[180px] overflow-hidden">
            {isSupported ? (
              <button
                onClick={handleShare}
                className="w-full px-4 py-3 text-left hover:bg-brand-soft flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">📱</span>
                <span className="text-sm font-medium">Compartilhar...</span>
              </button>
            ) : null}

            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-3 text-left hover:bg-brand-soft flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">{copied ? '✅' : '📋'}</span>
              <span className="text-sm font-medium">
                {copied ? 'Copiado!' : 'Copiar link'}
              </span>
            </button>

            <hr className="border-brand-line" />

            <button
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(data.text + ' ' + data.url)}`, '_blank')}
              className="w-full px-4 py-3 text-left hover:bg-brand-soft flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium">WhatsApp</span>
            </button>

            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`, '_blank')}
              className="w-full px-4 py-3 text-left hover:bg-brand-soft flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">🐦</span>
              <span className="text-sm font-medium">Twitter</span>
            </button>

            <button
              onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
              className="w-full px-4 py-3 text-left hover:bg-brand-soft flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">📸</span>
              <span className="text-sm font-medium">Instagram</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// SHARE PRODUCT CARD
// ============================================

export function ProductShare({ product }: { product: { name: string; price: number; emoji: string } }) {
  return (
    <ShareButton
      data={{
        title: `${product.emoji} ${product.name} - R$ ${product.price.toFixed(2)}`,
        text: `Olha esse produto no Feirinha Express: ${product.emoji} ${product.name} por R$ ${product.price.toFixed(2)}!`,
        url: window.location.href
      }}
      label="Compartilhar"
    />
  )
}

// ============================================
// SHARE ORDER
// ============================================

export function OrderShare({ order }: { order: { id: string; total: number; items: number } }) {
  return (
    <ShareButton
      data={{
        title: `Pedido #${order.id}`,
        text: `Meu pedido #${order.id} no Feirinha Express: ${order.items} itens, total R$ ${order.total.toFixed(2)} 🎉`,
        url: `${window.location.origin}/user/tracking/${order.id}`
      }}
      label="Compartilhar pedido"
    />
  )
}

// ============================================
// SHARE STORE
// ============================================

export function StoreShare({ store }: { store: { name: string; rating: number; emoji: string } }) {
  return (
    <ShareButton
      data={{
        title: `${store.emoji} ${store.name}`,
        text: `Conhece essa loja no Feirinha Express? ${store.emoji} ${store.name} - Nota ${store.rating} ⭐`,
        url: window.location.href
      }}
      label="Indicar loja"
    />
  )
}

// ============================================
// SHARE REFERRAL
// ============================================

export function ReferralShare({ code, reward }: { code: string; reward: number }) {
  const referralUrl = `${window.location.origin}/register?ref=${code}`

  return (
    <ShareButton
      data={{
        title: 'Convide seus amigos!',
        text: `Use meu código ${code} no Feirinha Express e ganhe R$ ${reward.toFixed(2)} de desconto! 🚀`,
        url: referralUrl
      }}
      label="Convidar amigos"
    />
  )
}

// ============================================
// DEMO PAGE
// ============================================

export default function ShareButtonDemo() {
  const [showResult, setShowResult] = useState<string | null>(null)

  const demoProduct = {
    name: 'X-Burger Especial',
    price: 29.90,
    emoji: '🍔'
  }

  const demoOrder = {
    id: 'FE2024001234',
    total: 89.70,
    items: 3
  }

  const demoStore = {
    name: 'Burguer House',
    rating: 4.8,
    emoji: '🍔'
  }

  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-line sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto p-4">
          <h1 className="text-lg font-extrabold text-brand-ink">📤 Share Button</h1>
          <p className="text-sm text-brand-muted">Compartilhamento de conteúdo</p>
        </div>
      </div>

      <div className="max-w-[390px] mx-auto p-4 space-y-6">
        {/* Share Product */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Compartilhar Produto
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{demoProduct.emoji}</span>
              <div>
                <p className="font-bold">{demoProduct.name}</p>
                <p className="text-brand-red font-bold">R$ {demoProduct.price.toFixed(2)}</p>
              </div>
            </div>
            <ProductShare product={demoProduct} />
          </div>
        </div>

        {/* Share Order */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Compartilhar Pedido
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📦</span>
              <div>
                <p className="font-bold">#{demoOrder.id}</p>
                <p className="text-sm text-brand-muted">{demoOrder.items} itens • R$ {demoOrder.total.toFixed(2)}</p>
              </div>
            </div>
            <OrderShare order={demoOrder} />
          </div>
        </div>

        {/* Share Store */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Indicar Loja
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{demoStore.emoji}</span>
              <div>
                <p className="font-bold">{demoStore.name}</p>
                <p className="text-sm text-brand-muted">⭐ {demoStore.rating}</p>
              </div>
            </div>
            <StoreShare store={demoStore} />
          </div>
        </div>

        {/* Share Referral */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Convidar Amigos
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold">Ganhe R$ 10 de desconto</p>
                <p className="text-sm text-brand-muted">Convide amigos e ganhe!</p>
              </div>
              <span className="text-4xl">🎁</span>
            </div>
            <div className="bg-brand-soft rounded-xl p-3 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-muted">Seu código</p>
                <p className="font-bold text-lg tracking-wider">KAUAN2024</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('KAUAN2024')
                  setShowResult('Código copiado!')
                  setTimeout(() => setShowResult(null), 2000)
                }}
                className="px-3 py-1.5 bg-brand-red text-white text-sm rounded-lg"
              >
                📋 Copiar
              </button>
            </div>
            <ReferralShare code="KAUAN2024" reward={10} />
          </div>
        </div>

        {/* Result Toast */}
        {showResult && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-brand-ink text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
            ✅ {showResult}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">💡 Como funciona</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Em dispositivos móveis: abre nativo do sistema</li>
            <li>• No desktop: copia link ou abre WhatsApp/Twitter</li>
            <li>• Funciona offline (copia URL)</li>
          </ul>
        </div>
      </div>
    </main>
  )
}