'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image?: string
  emoji: string
  category: string
  store: string
  rating: number
  reviews: number
  soldCount: number
  inStock: boolean
  isFeatured: boolean
  tags: string[]
}

export function ProductCatalogView() {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Hambúrguer Artesanal', description: 'Pão brioche, 180g de blend, queijo cheddar', price: 32.90, originalPrice: 39.90, emoji: '🍔', category: 'Lanches', store: 'Burguer House', rating: 4.8, reviews: 234, soldCount: 1500, inStock: true, isFeatured: true, tags: ['Mais vendido', 'Picante'] },
    { id: '2', name: 'X-Bacon', description: 'Pão tradicional, bacon crocante, queijo prato', price: 28.90, emoji: '🍔', category: 'Lanches', store: 'Burguer House', rating: 4.5, reviews: 189, soldCount: 980, inStock: true, isFeatured: false, tags: [] },
    { id: '3', name: 'Pizza Margherita', description: 'Molho de tomate, mussarela, manjericão fresco', price: 45.90, emoji: '🍕', category: 'Pizza', store: 'Pizza Express', rating: 4.7, reviews: 312, soldCount: 2100, inStock: true, isFeatured: true, tags: ['Vegetariano'] },
    { id: '4', name: 'Açaí 500ml', description: 'Açaí tradicional com granola e banana', price: 22.90, emoji: '🍨', category: 'Açaí', store: 'Açaí House', rating: 4.9, reviews: 567, soldCount: 3200, inStock: true, isFeatured: true, tags: ['Premium'] },
    { id: '5', name: 'Sushi Combo', description: '12 peças variadas, 4 uramaki, 4 hossomaki', price: 38.90, emoji: '🍣', category: 'Japonês', store: 'Sushi Express', rating: 4.6, reviews: 156, soldCount: 890, inStock: false, isFeatured: false, tags: [] },
    { id: '6', name: 'Café Latte', description: 'Café espresso com leite vaporizado', price: 12.90, emoji: '☕', category: 'Bebidas', store: 'Café do Centro', rating: 4.3, reviews: 78, soldCount: 450, inStock: true, isFeatured: false, tags: [] },
  ])

  const [filter, setFilter] = useState<'all' | 'featured' | 'available' | 'discount'>('all')
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular')

  const filteredProducts = products.filter(p => {
    if (filter === 'featured' && !p.isFeatured) return false
    if (filter === 'available' && !p.inStock) return false
    if (filter === 'discount' && !p.originalPrice) return false
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return b.soldCount - a.soldCount
    }
  })

  const categories = ['Todos', 'Lanches', 'Pizza', 'Açaí', 'Japonês', 'Bebidas']
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-brand-ink">📖 Cardápio</h2>
        <p className="text-sm text-brand-muted">Escolha seus itens favoritos</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'featured', label: '⭐ Destaque' },
            { key: 'available', label: '✅ Disponível' },
            { key: 'discount', label: '🏷️ Oferta' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filter === f.key
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1 bg-brand-soft rounded-full text-xs"
        >
          <option value="popular">Mais populares</option>
          <option value="price-low">Menor preço</option>
          <option value="price-high">Maior preço</option>
          <option value="rating">Melhor avaliação</option>
        </select>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map(product => (
          <Card key={product.id} padding="md" className={`relative ${!product.inStock ? 'opacity-60' : ''}`}>
            {/* Image placeholder */}
            <div className={`w-full h-24 rounded-xl flex items-center justify-center text-5xl mb-3 ${
              product.isFeatured
                ? 'bg-gradient-to-br from-brand-red to-red-600 text-white'
                : 'bg-brand-soft'
            }`}>
              {product.emoji}
            </div>

            {/* Discount badge */}
            {product.originalPrice && (
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </div>
            )}

            {/* Out of stock */}
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-xl">
                <Badge variant="error">Esgotado</Badge>
              </div>
            )}

            {/* Info */}
            <p className="font-bold text-brand-ink text-sm truncate">{product.name}</p>
            <p className="text-xs text-brand-muted truncate">{product.store}</p>

            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs">⭐ {product.rating}</span>
              <span className="text-xs text-brand-muted">({product.reviews})</span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="font-extrabold text-brand-red">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-brand-muted line-through ml-1">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {product.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-brand-soft rounded text-xs text-brand-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {product.inStock && (
              <Button size="sm" className="w-full mt-3">
                🛒 Adicionar
              </Button>
            )}
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-brand-muted">Nenhum produto encontrado</p>
        </Card>
      )}
    </div>
  )
}

// ==================== PRODUCT QUICK VIEW ====================

interface ProductQuickViewProps {
  product: Product
  onClose: () => void
  onAddToCart: () => void
}

export function ProductQuickView({ product, onClose, onAddToCart }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [observations, setObservations] = useState('')
  const [extras, setExtras] = useState<string[]>([])

  const availableExtras = [
    { id: 'bacon', name: 'Bacon Extra', price: 5.90 },
    { id: 'cheddar', name: 'Cheddar Extra', price: 3.90 },
    { id: 'ovo', name: 'Ovo', price: 2.90 },
    { id: 'molho', name: 'Molho Especial', price: 1.90 },
  ]

  const toggleExtra = (id: string) => {
    setExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const totalPrice = product.price * quantity +
    extras.reduce((acc, id) => {
      const extra = availableExtras.find(e => e.id === id)
      return acc + (extra?.price || 0) * quantity
    }, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 flex items-center justify-between border-b border-brand-line">
          <h3 className="font-bold text-brand-ink">Detalhes do produto</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Image */}
          <div className={`w-full h-48 rounded-2xl flex items-center justify-center text-8xl ${
            product.isFeatured
              ? 'bg-gradient-to-br from-brand-red to-red-600 text-white'
              : 'bg-brand-soft'
          }`}>
            {product.emoji}
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-extrabold text-brand-ink">{product.name}</h2>
            <p className="text-brand-muted">{product.store}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">⭐ {product.rating} ({product.reviews} avaliações)</span>
              <span className="text-sm text-brand-muted">• {product.soldCount} vendidos</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-brand-ink mb-2">Descrição</h4>
            <p className="text-sm text-brand-muted">{product.description}</p>
          </div>

          {/* Extras */}
          <div>
            <h4 className="font-bold text-brand-ink mb-2">Adicionais</h4>
            <div className="space-y-2">
              {availableExtras.map(extra => (
                <label
                  key={extra.id}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    extras.includes(extra.id)
                      ? 'bg-red-50 border border-brand-red'
                      : 'bg-brand-soft'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="w-5 h-5 rounded border-brand-line text-brand-red focus:ring-brand-red"
                    />
                    <span className="font-medium text-brand-ink">{extra.name}</span>
                  </div>
                  <span className="text-brand-red font-bold">+ R$ {extra.price.toFixed(2).replace('.', ',')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div>
            <h4 className="font-bold text-brand-ink mb-2">Observações</h4>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Sem cebola, ponto da carne bem passado..."
              rows={2}
              className="w-full px-4 py-3 border border-brand-line rounded-xl resize-none focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-brand-ink">Quantidade</h4>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl font-bold hover:bg-brand-line"
              >
                -
              </button>
              <span className="text-xl font-extrabold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center text-xl font-bold hover:bg-red-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-brand-line">
          <Button onClick={onAddToCart} className="w-full py-4 text-lg">
            🛒 Adicionar ao carrinho - R$ {totalPrice.toFixed(2).replace('.', ',')}
          </Button>
        </div>
      </div>
    </div>
  )
}
