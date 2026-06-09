import { Card } from '@/components/ui'
import { ShareButton } from '@/components/ui/share-button'
import { Star } from './star-rating'

interface ProductDetailsProps {
  product: {
    id: string
    title: string
    description: string
    price: number
    thumb?: string
    merchant?: { storeName: string; logo?: string }
  }
  onAddToCart?: () => void
}

export function ProductDetails({ product, onAddToCart }: ProductDetailsProps) {
  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 animate-fade-up">
      {/* Imagem grande */}
      <Card padding="md">
        <div className="w-full aspect-square rounded-2xl bg-brand-soft flex items-center justify-center text-6xl font-extrabold text-brand-red">
          {product.thumb || '📦'}
        </div>

        {/* Ações rápidas */}
        <div className="flex items-center gap-2 mt-4">
          <ShareButton
            data={{ url: `/user/product/${product.id}`, title: product.title, text: `Olha esse produto: ${product.title}` }}
            variant="primary"
          />
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-line text-brand-ink rounded-xl font-medium text-sm hover:bg-brand-soft transition-colors"
            aria-label="Favoritar"
          >
            <span>🤍</span>
            <span>Favoritar</span>
          </button>
        </div>
      </Card>

      {/* Info principal */}
      <Card padding="md">
        {product.merchant && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-sm font-extrabold text-brand-red">
              {product.merchant.logo || product.merchant.storeName.charAt(0)}
            </div>
            <span className="text-sm text-brand-muted">{product.merchant.storeName}</span>
          </div>
        )}

        <h1 className="text-2xl font-extrabold text-brand-ink mb-2">
          {product.title}
        </h1>

        <p className="text-brand-muted text-sm leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mb-4">
          <Star rating={4.5} totalReviews={127} />
        </div>

        {/* Preço */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-3xl font-extrabold text-brand-red">
            {formattedPrice}
          </span>
          <span className="text-sm text-brand-muted line-through">
            {formattedPrice.replace(/\d/g, (d, i) => i < 2 ? '' : '0').replace(/^0+/, '')}
          </span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            -15% OFF
          </span>
        </div>

        {/* CTA principal */}
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className="w-full py-4 bg-brand-red text-white rounded-2xl font-extrabold text-base hover:bg-brand-red-dark transition-colors press-effect animate-pulse-glow"
          >
            🛒 Adicionar ao Carrinho
          </button>
        )}
      </Card>
    </div>
  )
}