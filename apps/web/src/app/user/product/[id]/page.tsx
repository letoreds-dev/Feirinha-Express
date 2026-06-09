'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, Button, Badge, NavBar, BottomNav } from '@/components/ui'
import { useCartStore } from '@/store/cart'
import { toast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'

function ProductDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id') || '1'
  const cart = useCartStore()

  const product = {
    id: productId,
    name: 'Camisa Brasil retrô 2024',
    store: 'Fanaticos FC',
    storeSlug: 'fanaticos-fc',
    description: 'Camisa oficial da seleção brasileira, modelo retrô inspirado nos anos 90. Tecido leve e respirável, perfeito para torcer pelo Brasil!',
    price: 129.90,
    originalPrice: 159.90,
    emoji: '👕',
    rating: 4.8,
    reviews: 234,
    soldCount: 1500,
    inStock: true,
    stockQty: 25,
    sizes: ['P', 'M', 'G', 'GG'],
    tags: ['Novo', 'Frete grátis'],
  }

  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [observations, setObservations] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const extras = [
    { id: 'sigilo', name: 'Embalagem sigilo', price: 5.90 },
    { id: 'nota', name: 'Nota fiscal separada', price: 0 },
    { id: 'presente', name: 'Embalagem presente', price: 8.90 },
  ]

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const extra = extras.find(e => e.id === id)
    return sum + (extra?.price || 0)
  }, 0)

  const totalPrice = product.price * quantity + extrasTotal

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning('Selecione um tamanho')
      return
    }

    setIsAdding(true)
    setTimeout(() => {
      cart.addItem({
        productId: product.id,
        title: `${product.name} (${selectedSize})`,
        price: product.price,
        emoji: product.emoji,
        storeId: '1',
        storeName: product.store,
      }, quantity)

      toast.success('Adicionado ao carrinho!', product.name)
      setIsAdding(false)
      router.push('/user/cart')
    }, 500)
  }

  const relatedProducts = [
    { id: '2', name: 'Boné Corinthians', price: 59.90, emoji: '🧢' },
    { id: '3', name: 'Bandeira Palmeiras', price: 44.90, emoji: '🏴' },
    { id: '4', name: 'Chaveiro São Paulo', price: 19.90, emoji: '🔑' },
  ]

  return (
    <div className="min-h-screen bg-brand-paper pb-32">
      <NavBar>
        <div className="flex items-center justify-between w-full">
          <button onClick={() => router.back()} className="text-brand-muted hover:text-brand-ink text-xl">
            ←
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white border border-brand-line flex items-center justify-center text-lg hover:bg-brand-soft transition-colors">
              📤
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-brand-line flex items-center justify-center text-lg hover:bg-brand-soft transition-colors">
              ❤️
            </button>
          </div>
        </div>
      </NavBar>

      <div className="px-4 py-4 max-w-[390px] mx-auto space-y-4">
        <div className="relative">
          <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-brand-red to-red-600 flex items-center justify-center">
            <span className="text-8xl text-white">{product.emoji}</span>
          </div>
          {product.originalPrice && (
            <Badge variant="danger" className="absolute top-3 right-3 text-sm px-3 py-1">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        <div>
          <p className="text-sm text-brand-muted mb-1">{product.store}</p>
          <h1 className="text-2xl font-extrabold text-brand-ink">{product.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <span className="text-lg">⭐</span>
              <span className="font-bold text-brand-ink">{product.rating}</span>
              <span className="text-brand-muted">({product.reviews})</span>
            </div>
            <span className="text-brand-muted">•</span>
            <span className="text-brand-muted">{product.soldCount} vendidos</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-brand-red">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-brand-muted line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-bold text-brand-ink mb-3">Tamanho</h3>
          <div className="flex gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-14 h-14 rounded-xl border-2 font-bold transition-colors ${
                  selectedSize === size
                    ? 'border-brand-red bg-brand-soft text-brand-red'
                    : 'border-brand-line text-brand-ink hover:border-brand-muted'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-brand-ink mb-3">Extras</h3>
          <div className="space-y-2">
            {extras.map(extra => (
              <button
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                  selectedExtras.includes(extra.id)
                    ? 'border-brand-red bg-brand-soft'
                    : 'border-brand-line'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedExtras.includes(extra.id)
                      ? 'border-brand-red bg-brand-red'
                      : 'border-brand-line'
                  }`}>
                    {selectedExtras.includes(extra.id) && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <span className="font-medium text-brand-ink">{extra.name}</span>
                </div>
                <span className="text-brand-red font-bold">
                  {extra.price > 0 ? `+ ${formatCurrency(extra.price)}` : 'Grátis'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-brand-ink mb-3">Observações</h3>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ex: Prefiro tamanho G, embrulhar para presente..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-brand-line bg-white resize-none focus:border-brand-red focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="font-bold text-brand-ink">Quantidade</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl font-bold hover:bg-brand-line transition-colors"
            >
              -
            </button>
            <span className="text-xl font-extrabold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
              className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center text-xl font-bold hover:bg-brand-red-dark transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {product.stockQty <= 10 && (
          <Card padding="sm" className="bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-700">
              ⚠️ Apenas {product.stockQty} unidades disponíveis
            </p>
          </Card>
        )}

        <div>
          <h3 className="font-bold text-brand-ink mb-3">Descrição</h3>
          <p className="text-brand-muted leading-relaxed">{product.description}</p>
        </div>

        <div>
          <h3 className="font-bold text-brand-ink mb-3">Produtos relacionados</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {relatedProducts.map(p => (
              <Link
                key={p.id}
                href={`/user/product/${p.id}`}
                className="flex-shrink-0 w-32"
              >
                <Card padding="sm">
                  <div className="w-full h-20 rounded-xl bg-brand-soft flex items-center justify-center text-3xl mb-2">
                    {p.emoji}
                  </div>
                  <p className="font-medium text-brand-ink text-sm truncate">{p.name}</p>
                  <p className="font-bold text-brand-red">{formatCurrency(p.price)}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-brand-line p-4 shadow-lg">
        <div className="max-w-[390px] mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-brand-muted">Total</p>
            <p className="text-2xl font-extrabold text-brand-red">{formatCurrency(totalPrice)}</p>
          </div>
          <Button
            className="flex-1 py-4 text-lg"
            onClick={handleAddToCart}
            loading={isAdding}
          >
            🛒 Adicionar
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-paper flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Carregando...</p>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  )
}