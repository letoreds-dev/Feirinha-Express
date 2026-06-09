import { cn } from '@/lib/utils'
import { useFavorite } from '@/store/favorites'
import { ShareButton } from './share-button'
import { toast } from './toast'
import type { ReactNode } from 'react'

interface ProductCardProps {
  title: string
  description: string
  price: number
  thumb?: string | null
  productId?: string
  onAdd?: () => void
  onClick?: () => void
}

export function ProductCard({ title, description, price, thumb, productId, onAdd, onClick }: ProductCardProps) {
  const formattedPrice = price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const { isFavorite, toggleFavorite } = useFavorite(productId || '')

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAdd) {
      onAdd()
      toast.success('Adicionado ao carrinho!', title)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite()
    if (productId) {
      toast.success(
        isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
        title
      )
    }
  }

  return (
    <div
      className={cn(
        'grid grid-cols-[82px_1fr] gap-3 p-3 bg-white rounded-card border border-brand-line shadow-card hover-lift',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="w-20 h-24 rounded-2xl bg-brand-soft flex items-center justify-center text-brand-red font-extrabold text-center p-2 relative">
        {thumb || 'Img'}

        {/* Botão de favorito */}
        {productId && (
          <button
            onClick={handleFavorite}
            className={cn(
              'absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all press-effect',
              isFavorite
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white text-gray-400 border border-gray-200 hover:text-red-500 hover:scale-110'
            )}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-brand-ink">{title}</h3>
          <p className="text-sm text-brand-muted mt-1 line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-extrabold text-brand-ink">{formattedPrice}</span>
          {onAdd && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-brand-red text-white rounded-xl font-extrabold text-sm hover:bg-brand-red-dark transition-colors press-effect"
            >
              Adicionar
            </button>
          )}
        </div>
      </div>

      {/* Share button (visible on hover) */}
      {productId && (
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
          <ShareButton
            data={{ url: `/user/product/${productId}`, title, text: title }}
            variant="ghost"
          />
        </div>
      )}
    </div>
  )
}