/**
 * Feirinha Express - Empty States Collection
 * Beautiful empty states for all app sections
 */

'use client'

import { Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { useState } from 'react'

// ==================== BASE EMPTY STATE ====================

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-brand-soft flex items-center justify-center text-5xl mb-6 animate-pulse">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-ink mb-2">{title}</h3>
      <p className="text-brand-muted max-w-xs mb-6">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="mt-3 text-sm text-brand-red hover:underline"
        >
          {secondaryAction.label}
        </button>
      )}
    </div>
  )
}

// ==================== SPECIFIC EMPTY STATES ====================

export function EmptyCart() {
  return (
    <EmptyState
      icon="🛒"
      title="Seu carrinho está vazio"
      description="Adicione produtos para começar seu pedido"
      action={{
        label: 'Explorar produtos',
        onClick: () => console.log('Navigate to catalog'),
      }}
    />
  )
}

export function EmptyOrders() {
  return (
    <EmptyState
      icon="📦"
      title="Nenhum pedido ainda"
      description="Faça seu primeiro pedido e acompanhe aqui"
      action={{
        label: 'Fazer primeiro pedido',
        onClick: () => console.log('Navigate to catalog'),
      }}
    />
  )
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon="❤️"
      title="Sem favoritos ainda"
      description="Salve seus produtos e lojas preferidos"
      action={{
        label: 'Explorar',
        onClick: () => console.log('Navigate to catalog'),
      }}
    />
  )
}

export function EmptySearch() {
  return (
    <EmptyState
      icon="🔍"
      title="Busque por algo"
      description="Encontre produtos, lojas e categorias"
      action={{
        label: 'Ver categorias',
        onClick: () => console.log('Navigate to categories'),
      }}
    />
  )
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon="🔔"
      title="Sem notificações"
      description="Suas notificações aparecerão aqui"
      action={{
        label: 'Ativar notificações',
        onClick: () => console.log('Enable notifications'),
      }}
    />
  )
}

export function EmptyAddress() {
  return (
    <EmptyState
      icon="📍"
      title="Nenhum endereço cadastrado"
      description="Adicione um endereço para deliveries"
      action={{
        label: 'Adicionar endereço',
        onClick: () => console.log('Navigate to add address'),
      }}
    />
  )
}

export function EmptyRewards() {
  return (
    <EmptyState
      icon="🎁"
      title="Sem recompensas ainda"
      description="Faça pedidos para ganhar pontos e recompensas"
      action={{
        label: 'Fazer pedido',
        onClick: () => console.log('Navigate to catalog'),
      }}
    />
  )
}

export function EmptyReviews() {
  return (
    <EmptyState
      icon="⭐"
      title="Sem avaliações"
      description="Avalie seus pedidos para ajudar outros usuários"
      action={{
        label: 'Ver pedidos',
        onClick: () => console.log('Navigate to orders'),
      }}
    />
  )
}

export function EmptyProduct() {
  return (
    <EmptyState
      icon="📦"
      title="Produto não encontrado"
      description="Este produto pode ter sido removido ou estar indisponível"
      action={{
        label: 'Voltar',
        onClick: () => console.log('Go back'),
      }}
    />
  )
}

export function EmptyStore() {
  return (
    <EmptyState
      icon="🏪"
      title="Loja não encontrada"
      description="Esta loja pode ter fechado ou não existe mais"
      action={{
        label: 'Explorar outras lojas',
        onClick: () => console.log('Navigate to stores'),
      }}
    />
  )
}

export function EmptyChat() {
  return (
    <EmptyState
      icon="💬"
      title="Nenhuma mensagem"
      description="Suas conversas aparecerão aqui"
      action={{
        label: 'Iniciar conversa',
        onClick: () => console.log('Start chat'),
      }}
    />
  )
}

export function EmptyPayments() {
  return (
    <EmptyState
      icon="💳"
      title="Nenhum pagamento cadastrado"
      description="Adicione uma forma de pagamento"
      action={{
        label: 'Adicionar cartão',
        onClick: () => console.log('Navigate to add payment'),
      }}
    />
  )
}

// ==================== LOADING STATES ====================

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingState({ message = 'Carregando...', fullScreen = false }: LoadingStateProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-brand-line rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-brand-red rounded-full animate-spin" />
      </div>
      <p className="text-brand-muted">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-brand-paper flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  )
}

// ==================== ERROR STATES ====================

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Algo deu errado',
  message = 'Tente novamente em alguns instantes',
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-5xl mb-6">
        😕
      </div>
      <h3 className="text-xl font-bold text-brand-ink mb-2">{title}</h3>
      <p className="text-brand-muted max-w-xs mb-6">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}

export function OfflineState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center text-5xl mb-6">
        📡
      </div>
      <h3 className="text-xl font-bold text-brand-ink mb-2">Você está offline</h3>
      <p className="text-brand-muted max-w-xs mb-6">
        Verifique sua conexão com a internet
      </p>
      <Button variant="primary" onClick={() => window.location.reload()}>
        Tentar novamente
      </Button>
    </div>
  )
}

// ==================== DEMO PAGE ====================

export default function EmptyStatesDemo() {
  const [activeState, setActiveState] = useState<string | null>(null)

  const states = [
    { key: 'cart', component: <EmptyCart />, name: 'Carrinho' },
    { key: 'orders', component: <EmptyOrders />, name: 'Pedidos' },
    { key: 'favorites', component: <EmptyFavorites />, name: 'Favoritos' },
    { key: 'search', component: <EmptySearch />, name: 'Busca' },
    { key: 'notifications', component: <EmptyNotifications />, name: 'Notificações' },
    { key: 'address', component: <EmptyAddress />, name: 'Endereços' },
    { key: 'rewards', component: <EmptyRewards />, name: 'Recompensas' },
    { key: 'reviews', component: <EmptyReviews />, name: 'Avaliações' },
    { key: 'product', component: <EmptyProduct />, name: 'Produto' },
    { key: 'store', component: <EmptyStore />, name: 'Loja' },
    { key: 'loading', component: <LoadingState />, name: 'Loading' },
    { key: 'error', component: <ErrorState onRetry={() => {}} />, name: 'Erro' },
    { key: 'offline', component: <OfflineState />, name: 'Offline' },
  ]

  return (
    <div className="min-h-screen bg-brand-paper pb-20">
      <div className="p-4 bg-white border-b border-brand-line">
        <h1 className="text-lg font-extrabold text-brand-ink">🖼️ Estados Vazios</h1>
        <p className="text-sm text-brand-muted">Demonstração de componentes</p>
      </div>

      <div className="p-4 max-w-[390px] mx-auto space-y-6">
        {/* State Selector */}
        <div className="grid grid-cols-3 gap-2">
          {states.slice(0, 6).map(state => (
            <button
              key={state.key}
              onClick={() => setActiveState(state.key)}
              className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                activeState === state.key
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-ink'
              }`}
            >
              {state.name}
            </button>
          ))}
        </div>

        {/* State Preview */}
        <Card padding="none">
          {activeState ? (
            states.find(s => s.key === activeState)?.component
          ) : (
            <div className="p-8 text-center text-brand-muted">
              Selecione um estado acima para visualizar
            </div>
          )}
        </Card>

        {/* All States Grid */}
        <div>
          <h3 className="font-bold text-brand-ink mb-3">Todos os estados</h3>
          <div className="grid grid-cols-3 gap-2">
            {states.map(state => (
              <button
                key={state.key}
                onClick={() => setActiveState(state.key)}
                className="p-3 bg-brand-soft rounded-xl text-xs font-medium text-brand-ink hover:bg-brand-line"
              >
                {state.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}