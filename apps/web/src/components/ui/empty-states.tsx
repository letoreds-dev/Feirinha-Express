'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

// ============================================
// EMPTY STATE COMPONENT
// ============================================
// Estados vazios elegantes para quando não há dados
// ============================================

export interface EmptyStateProps {
  title: string
  description?: string
  emoji?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, description, emoji = '📭', action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-lg font-bold text-brand-ink mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-brand-muted max-w-[280px] mb-6">{description}</p>
      )}
      <div className="flex flex-col gap-2">
        {action && (
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================
// EMPTY STATES ESPECÍFICOS
// ============================================

export function EmptyCart() {
  const [count, setCount] = useState(0)
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        <span className="text-7xl">🛒</span>
        <span className="absolute -top-2 -right-2 text-2xl animate-bounce">
          {count > 0 ? '✅' : '❓'}
        </span>
      </div>
      <h3 className="text-xl font-bold text-brand-ink mt-4 mb-2">Carrinho vazio</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Adicione produtos para começar suas compras
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/stores'}>
        🛍️ Ver lojas
      </Button>
      <button
        className="mt-4 text-sm text-brand-muted underline"
        onClick={() => setCount(c => c + 1)}
      >
        debug: {count}
      </button>
    </div>
  )
}

export function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">📦</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Nenhum pedido ainda</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Quando você fizer pedidos, eles aparecerão aqui
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/stores'}>
        🛍️ Fazer primeiro pedido
      </Button>
    </div>
  )
}

export function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">❤️</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Sem favoritos</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Salve seus produtos e lojas favoritas para encontrar rápido depois
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/stores'}>
        🔍 Explorar lojas
      </Button>
    </div>
  )
}

export function EmptySearch({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">🔍</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Nenhum resultado</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        {query
          ? `Não encontramos resultados para "${query}"`
          : 'Tente buscar com outros termos'}
      </p>
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        <Button variant="outline" onClick={() => window.history.back()}>
          ← Voltar
        </Button>
        <Button variant="ghost" onClick={() => window.location.href = '/user/stores'}>
          Ver todas as lojas
        </Button>
      </div>
    </div>
  )
}

export function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">🔔</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Sem notificações</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Suas notificações aparecerão aqui
      </p>
      <Button variant="outline" onClick={() => window.location.href = '/user'}>
        ← Voltar ao início
      </Button>
    </div>
  )
}

export function EmptyAddress() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">📍</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Nenhum endereço cadastrado</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Cadastre um endereço para receber seus pedidos
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/address-delivery'}>
        ➕ Cadastrar endereço
      </Button>
    </div>
  )
}

export function EmptyRewards() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">🎁</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Sem recompensas</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Faça pedidos para acumular pontos e ganhar recompensas
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/stores'}>
        🛍️ Fazer pedido
      </Button>
    </div>
  )
}

export function EmptyReviews() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">⭐</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Nenhuma avaliação</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Avalie seus pedidos para ajudar outros clientes
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/orders'}>
        📝 Ver pedidos
      </Button>
    </div>
  )
}

export function EmptyProduct() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">📦</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Produto não encontrado</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Este produto pode ter sido removido ou estar indisponível
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/stores'}>
        🛍️ Ver outras lojas
      </Button>
    </div>
  )
}

export function EmptyStore() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">🏪</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Loja não encontrada</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Esta loja pode ter fechado ou mudou de nome
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/stores'}>
        🔍 Ver outras lojas
      </Button>
    </div>
  )
}

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">💬</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Nenhuma mensagem</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Inicie uma conversa com o suporte
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/help'}>
        💬 Falar com suporte
      </Button>
    </div>
  )
}

export function EmptyPayments() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">💳</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Nenhum pagamento</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Adicione um método de pagamento para fazer suas compras
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/user/payment'}>
        ➕ Adicionar pagamento
      </Button>
    </div>
  )
}

// ============================================
// LOADING STATE
// ============================================

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-brand-soft rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-brand-muted">{message}</p>
    </div>
  )
}

// ============================================
// ERROR STATE
// ============================================

export function ErrorState({
  message = 'Algo deu errado',
  onRetry
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">😕</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">{message}</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Tente novamente em alguns instantes
      </p>
      {onRetry ? (
        <Button variant="primary" onClick={onRetry}>
          🔄 Tentar novamente
        </Button>
      ) : (
        <Button variant="outline" onClick={() => window.location.reload()}>
          🔄 Recarregar página
        </Button>
      )}
    </div>
  )
}

// ============================================
// OFFLINE STATE
// ============================================

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-7xl mb-4">📡</span>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Você está offline</h3>
      <p className="text-brand-muted text-center mb-6 max-w-[260px]">
        Verifique sua conexão com a internet
      </p>
      {onRetry ? (
        <Button variant="primary" onClick={onRetry}>
          🔄 Tentar novamente
        </Button>
      ) : (
        <Button variant="outline" onClick={() => window.location.reload()}>
          🔄 Recarregar
        </Button>
      )}
    </div>
  )
}

// ============================================
// DEMO PAGE
// ============================================

export default function EmptyStatesDemo() {
  const states = [
    { name: 'EmptyCart', component: <EmptyCart /> },
    { name: 'EmptyOrders', component: <EmptyOrders /> },
    { name: 'EmptyFavorites', component: <EmptyFavorites /> },
    { name: 'EmptySearch', component: <EmptySearch query="X-Burger" /> },
    { name: 'EmptyNotifications', component: <EmptyNotifications /> },
    { name: 'EmptyAddress', component: <EmptyAddress /> },
    { name: 'EmptyRewards', component: <EmptyRewards /> },
    { name: 'EmptyReviews', component: <EmptyReviews /> },
    { name: 'EmptyProduct', component: <EmptyProduct /> },
    { name: 'EmptyStore', component: <EmptyStore /> },
    { name: 'EmptyChat', component: <EmptyChat /> },
    { name: 'EmptyPayments', component: <EmptyPayments /> },
    { name: 'LoadingState', component: <LoadingState /> },
    { name: 'ErrorState', component: <ErrorState /> },
    { name: 'OfflineState', component: <OfflineState /> },
  ]

  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-line sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto p-4">
          <h1 className="text-lg font-extrabold text-brand-ink">📭 Empty States</h1>
          <p className="text-sm text-brand-muted">Estados vazios do app</p>
        </div>
      </div>

      {/* Grid de demonstrações */}
      <div className="max-w-[390px] mx-auto p-4">
        <div className="grid grid-cols-1 gap-6">
          {states.map((state, index) => (
            <div key={index} className="bg-white rounded-2xl border border-brand-line overflow-hidden">
              <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
                {state.name}
              </div>
              <div className="min-h-[200px]">
                {state.component}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State Genérico */}
      <div className="max-w-[390px] mx-auto p-4 mt-6">
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            EmptyState (genérico)
          </div>
          <EmptyState
            emoji="🎯"
            title="Nenhum item encontrado"
            description="Adicione itens para continuar"
            action={{
              label: "Adicionar",
              onClick: () => alert('Adicionar clicked!')
            }}
            secondaryAction={{
              label: "Cancelar",
              onClick: () => alert('Cancelar clicked!')
            }}
          />
        </div>
      </div>
    </main>
  )
}