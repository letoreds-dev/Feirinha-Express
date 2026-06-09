'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'

// ============================================
// NOT FOUND PAGE (404)
// ============================================
// Página amigável para erros 404
// ============================================

export function NotFoundPage() {
  const [emojiIndex, setEmojiIndex] = useState(0)
  const emojis = ['🤔', '🔍', '📦', '❓', '🚶']

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiIndex(i => (i + 1) % emojis.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-brand-paper flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        {/* Emoji animado */}
        <div className="text-8xl mb-6 animate-bounce">
          {emojis[emojiIndex]}
        </div>

        {/* Código do erro */}
        <div className="text-6xl font-black text-brand-red mb-2">404</div>

        {/* Título */}
        <h1 className="text-xl font-bold text-brand-ink mb-3">
          Página não encontrada
        </h1>

        {/* Descrição */}
        <p className="text-brand-muted mb-8">
          Oops! A página que você procura não existe ou foi movida para outro lugar.
        </p>

        {/* Ilustração */}
        <div className="bg-white rounded-2xl border border-brand-line p-6 mb-8">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-sm text-brand-muted">
            Você pode ter se perdido no caminho...
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            🏠 Voltar ao início
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.history.back()}
          >
            ← Voltar
          </Button>
        </div>

        {/* Links úteis */}
        <div className="mt-8 pt-6 border-t border-brand-line">
          <p className="text-sm text-brand-muted mb-3">Ou vá direto para:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => window.location.href = '/user/stores'}
              className="px-3 py-1.5 text-xs bg-brand-soft text-brand-ink rounded-full hover:bg-brand-line transition-colors"
            >
              🛍️ Lojas
            </button>
            <button
              onClick={() => window.location.href = '/user/orders'}
              className="px-3 py-1.5 text-xs bg-brand-soft text-brand-ink rounded-full hover:bg-brand-line transition-colors"
            >
              📦 Pedidos
            </button>
            <button
              onClick={() => window.location.href = '/user/cart'}
              className="px-3 py-1.5 text-xs bg-brand-soft text-brand-ink rounded-full hover:bg-brand-line transition-colors"
            >
              🛒 Carrinho
            </button>
            <button
              onClick={() => window.location.href = '/user/help'}
              className="px-3 py-1.5 text-xs bg-brand-soft text-brand-ink rounded-full hover:bg-brand-line transition-colors"
            >
              ❓ Ajuda
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================
// SERVER ERROR PAGE (500)
// ============================================

export function ServerErrorPage() {
  return (
    <main className="min-h-screen bg-brand-paper flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-8xl mb-6">😵</div>
        <div className="text-6xl font-black text-brand-red mb-2">500</div>
        <h1 className="text-xl font-bold text-brand-ink mb-3">
          Erro no servidor
        </h1>
        <p className="text-brand-muted mb-8">
          Algo deu errado do nosso lado. Já estamos trabalhando para corrigir!
        </p>

        <div className="bg-white rounded-2xl border border-brand-line p-6 mb-8">
          <div className="text-4xl mb-2">⚙️</div>
          <p className="text-sm text-brand-muted">
            Nosso time foi notificado sobre o problema.
          </p>
        </div>

        <Button
          variant="primary"
          className="w-full mb-3"
          onClick={() => window.location.reload()}
        >
          🔄 Tentar novamente
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = '/'}
        >
          🏠 Voltar ao início
        </Button>
      </div>
    </main>
  )
}

// ============================================
// MAINTENANCE PAGE
// ============================================

export function MaintenancePage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 2))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-red/10 to-brand-paper flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-8xl mb-6 animate-pulse">🔧</div>
        <div className="text-6xl font-black text-brand-red mb-2">🚧</div>
        <h1 className="text-xl font-bold text-brand-ink mb-3">
          Em manutenção
        </h1>
        <p className="text-brand-muted mb-8">
          Estamos fazendo melhorias para você! Voltamos em breve.
        </p>

        <div className="bg-white rounded-2xl border border-brand-line p-6 mb-8">
          <div className="text-4xl mb-2">⚡</div>
          <p className="text-sm text-brand-muted mb-4">
            Progesso da manutenção:
          </p>
          <div className="w-full bg-brand-soft rounded-full h-3 overflow-hidden">
            <div
              className="bg-brand-red h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-brand-muted mt-2">{progress}% completo</p>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.reload()}
        >
          🔄 Verificar novamente
        </Button>

        <p className="text-xs text-brand-muted mt-6">
          Desculpe pelo inconvenience! 🙏
        </p>
      </div>
    </main>
  )
}

// ============================================
// DEMO PAGE
// ============================================

export default function NotFoundDemo() {
  const [activePage, setActivePage] = useState<'404' | '500' | 'maintenance'>('404')

  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-line sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto p-4">
          <h1 className="text-lg font-extrabold text-brand-ink">😕 Error Pages</h1>
          <p className="text-sm text-brand-muted">Páginas de erro do app</p>
        </div>

        {/* Tabs */}
        <div className="flex max-w-[390px] mx-auto px-4 gap-2">
          {[
            { key: '404' as const, label: '404 - Não encontrado' },
            { key: '500' as const, label: '500 - Servidor' },
            { key: 'maintenance' as const, label: 'Manutenção' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActivePage(tab.key)}
              className={`pb-3 px-2 text-xs font-medium transition-colors whitespace-nowrap ${
                activePage === tab.key
                  ? 'text-brand-red border-b-2 border-brand-red'
                  : 'text-brand-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="max-w-[390px] mx-auto p-4">
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden mb-6">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Preview da página
          </div>
          <div className="min-h-[500px]">
            {activePage === '404' && <NotFoundPage />}
            {activePage === '500' && <ServerErrorPage />}
            {activePage === 'maintenance' && <MaintenancePage />}
          </div>
        </div>
      </div>
    </main>
  )
}