interface EmptyStateProps {
  icon: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-brand-ink mb-2">{title}</h3>
      {description && <p className="text-brand-muted mb-6 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-brand-red-dark transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Preset empty states
export function NoProductsEmpty() {
  return (
    <EmptyState
      icon="📦"
      title="Nenhum produto encontrado"
      description="Tente buscar com outros termos ou explore nossas categorias."
      action={{ label: 'Ver todos os produtos', onClick: () => {} }}
    />
  )
}

export function EmptyCart() {
  return (
    <EmptyState
      icon="🛒"
      title="Seu carrinho está vazio"
      description="Adicione produtos para começar suas compras."
      action={{ label: 'Explorar produtos', onClick: () => {} }}
    />
  )
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon="❤️"
      title="Nenhum favorito ainda"
      description="Toque no coração para adicionar produtos aos favoritos."
    />
  )
}