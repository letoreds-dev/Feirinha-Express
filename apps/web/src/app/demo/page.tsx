'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, Button, Badge } from '@/components/ui'

// ============================================
// FEIRINHA EXPRESS - DEMO PAGE
// ============================================
// Página principal de demonstração de componentes
// ============================================

const demoPages = [
  {
    category: '📭 Estados Vazios',
    items: [
      { name: 'Empty States', path: '/user/empty-states', emoji: '📭', desc: 'Estados vazios do app' },
    ]
  },
  {
    category: '😕 Páginas de Erro',
    items: [
      { name: '404 / 500 / Manutenção', path: '/error-pages', emoji: '😕', desc: 'Páginas de erro amigáveis' },
    ]
  },
  {
    category: '📤 Compartilhamento',
    items: [
      { name: 'Share Button', path: '/share', emoji: '📤', desc: 'Compartilhar produtos e pedidos' },
    ]
  },
  {
    category: '✨ Micro-interactions',
    items: [
      { name: 'Micro-interactions', path: '/user/micro-interactions', emoji: '✨', desc: 'Animações e feedback visual' },
    ]
  },
  {
    category: '🔍 Busca',
    items: [
      { name: 'Recent Searches', path: '/user/search-demo', emoji: '🔍', desc: 'Histórico e sugestões' },
    ]
  },
  {
    category: '🍔 Página Principal',
    items: [
      { name: 'Home', path: '/', emoji: '🏠', desc: 'Página inicial' },
      { name: 'Área do Cliente', path: '/user', emoji: '👤', desc: 'Dashboard do usuário' },
    ]
  },
  {
    category: '🛍️ Lojas',
    items: [
      { name: 'Catálogo', path: '/user/catalog', emoji: '📚', desc: 'Catálogo de produtos' },
      { name: 'Lojas', path: '/user/stores', emoji: '🏪', desc: 'Lista de lojas' },
      { name: 'Busca', path: '/user/search', emoji: '🔍', desc: 'Buscar produtos' },
    ]
  },
  {
    category: '🛒 Carrinho',
    items: [
      { name: 'Carrinho', path: '/user/cart', emoji: '🛒', desc: 'Carrinho de compras' },
      { name: 'Checkout', path: '/user/checkout', emoji: '💳', desc: 'Finalizar pedido' },
    ]
  },
  {
    category: '📦 Pedidos',
    items: [
      { name: 'Pedidos', path: '/user/orders', emoji: '📦', desc: 'Histórico de pedidos' },
      { name: 'Rastreio', path: '/user/tracking', emoji: '🚚', desc: 'Rastrear pedido' },
    ]
  },
  {
    category: '💰 Pagamento',
    items: [
      { name: 'Carteira', path: '/user/wallet', emoji: '👛', desc: 'Carteira digital' },
      { name: 'Pagamentos', path: '/user/payment', emoji: '💳', desc: 'Métodos de pagamento' },
    ]
  },
  {
    category: '⭐ Avaliações',
    items: [
      { name: 'Reviews', path: '/user/reviews', emoji: '⭐', desc: 'Minhas avaliações' },
      { name: 'Escrever Review', path: '/user/reviews-write', emoji: '✍️', desc: 'Avaliar pedido' },
    ]
  },
  {
    category: '🎮 Gamificação',
    items: [
      { name: 'Rewards', path: '/user/rewards', emoji: '🎁', desc: 'Recompensas e pontos' },
      { name: 'Loyalty', path: '/user/loyalty', emoji: '🏆', desc: 'Programa de fidelidade' },
    ]
  },
  {
    category: '🔧 Demo Components',
    items: [
      { name: 'Onboarding', path: '/onboarding', emoji: '🎯', desc: 'Tutorial de onboarding' },
      { name: 'Notifications', path: '/user/notifications-demo', emoji: '🔔', desc: 'Sistema de notificações' },
      { name: 'Offline Demo', path: '/user/offline-demo', emoji: '📡', desc: 'Funcionamento offline' },
      { name: 'Micro-interactions', path: '/user/micro-interactions', emoji: '✨', desc: 'Animações e interações' },
    ]
  },
]

export default function MainDemoPage() {
  const [search, setSearch] = useState('')

  const filteredPages = demoPages.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-red to-brand-red/80 text-white sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto p-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🍔</span>
            <div>
              <h1 className="text-xl font-black">Feirinha Express</h1>
              <p className="text-white/80 text-sm">Demonstração de componentes</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">🔍</span>
            <input
              type="text"
              placeholder="Buscar páginas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-brand-ink placeholder:text-brand-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[390px] mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-black text-brand-red">100+</p>
            <p className="text-xs text-brand-muted">Componentes</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-black text-brand-red">15</p>
            <p className="text-xs text-brand-muted">Páginas</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-black text-brand-red">10</p>
            <p className="text-xs text-brand-muted">Agentes</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-3">⚡ Ações Rápidas</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={() => window.location.href = '/'}>
              🏠 Home
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/user'}>
              👤 Usuário
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/merchant'}>
              🏪 Lojista
            </Button>
          </div>
        </Card>

        {/* Categories */}
        {filteredPages.map((category, catIndex) => (
          <div key={catIndex}>
            <h3 className="font-bold text-brand-ink mb-3">{category.category}</h3>
            <div className="space-y-2">
              {category.items.map((page, pageIndex) => (
                <Link
                  key={pageIndex}
                  href={page.path}
                  className="block bg-white rounded-xl border border-brand-line p-4 hover:border-brand-red/50 hover:shadow-sm transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{page.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-ink">{page.name}</p>
                      <p className="text-sm text-brand-muted truncate">{page.desc}</p>
                    </div>
                    <span className="text-brand-muted">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl">🔍</span>
            <p className="text-brand-muted mt-4">Nenhuma página encontrada</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-brand-line">
          <p className="text-sm text-brand-muted">
            Feirinha Express v2.0 • Powered by Claude AI
          </p>
          <p className="text-xs text-brand-muted/50 mt-1">
            10 agentes implementando funcionalidades
          </p>
        </div>
      </div>
    </main>
  )
}