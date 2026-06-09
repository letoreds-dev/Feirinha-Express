'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, Button, Badge, NavBar, BottomNav } from '@/components/ui'
import { useCartStore } from '@/store/cart'
import { toast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'

export default function StorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') || 'fanaticos-fc'
  const cart = useCartStore()

  const store = {
    id: '1',
    name: 'Fanaticos FC',
    slug,
    logo: '⚽',
    type: 'Artigos de time',
    rating: 4.8,
    reviews: 234,
    time: '15-25 min',
    fee: 4.90,
    description: 'Sua loja de artigos esportivos favorita! Camisas de time, bonés, bandeiras e muito mais.',
    isOpen: true,
  }

  const products = [
    { id: '1', name: 'Camisa Brasil retrô 2024', price: 129.90, originalPrice: 159.90, emoji: '👕', tag: 'Novo', inStock: true },
    { id: '2', name: 'Camisa Palmeiras Home', price: 149.90, emoji: '👕', tag: null, inStock: true },
    { id: '3', name: 'Camisa Corinthians Away', price: 139.90, emoji: '👕', tag: 'Promo', inStock: true },
    { id: '4', name: 'Camisa São Paulo III', price: 159.90, emoji: '👕', tag: null, inStock: true },
    { id: '5', name: 'Boné Corinthians', price: 59.90, emoji: '🧢', tag: null, inStock: true },
    { id: '6', name: 'Boné Palmeiras', price: 59.90, emoji: '🧢', tag: null, inStock: true },
    { id: '7', name: 'Bandeira Palmeiras', price: 44.90, emoji: '🏴', tag: null, inStock: true },
    { id: '8', name: 'Bandeira Corinthians', price: 44.90, emoji: '🏴', tag: null, inStock: true },
    { id: '9', name: 'Chaveiro São Paulo', price: 19.90, emoji: '🔑', tag: null, inStock: true },
    { id: '10', name: 'Mochila São Paulo', price: 89.90, emoji: '🎒', tag: 'Novo', inStock: false },
  ]

  const categories = ['Todos', 'Camisas', 'Bonés', 'Bandeiras', 'Acessórios']
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'Todos') return true
    if (selectedCategory === 'Camisas' && p.name.toLowerCase().includes('camisa')) return true
    if (selectedCategory === 'Bonés' && p.name.toLowerCase().includes('boné')) return true
    if (selectedCategory === 'Bandeiras' && p.name.toLowerCase().includes('bandeira')) return true
    return true
  })

  const handleAddToCart = (product: typeof products[0]) => {
    if (!product.inStock) {
      toast.error('Produto esgotado')
      return
    }

    cart.addItem({
      productId: product.id,
      title: product.name,
      price: product.price,
      emoji: product.emoji,
      storeId: store.id,
      storeName: store.name,
    })

    toast.success('Adicionado ao carrinho!', product.name)
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-32">
      <NavBar>
        <div className="flex items-center justify-between w-full">
          <button onClick={() => router.back()} className="text-brand-muted hover:text-brand-ink text-xl">
            ←
          </button>
          <Link href="/user/home" className="text-brand-red font-bold text-sm">
            Ver outras lojas
          </Link>
        </div>
      </NavBar>

      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center">
          <span className="text-6xl">{store.logo}</span>
        </div>
        <div className="absolute -bottom-8 left-4">
          <div className="w-20 h-20 rounded-2xl bg-white border-4 border-brand-paper shadow-lg flex items-center justify-center text-4xl">
            {store.logo}
          </div>
        </div>
      </div>

      <div className="px-4 pt-12 pb-4 max-w-[390px] mx-auto space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-ink">{store.name}</h1>
            <p className="text-sm text-brand-muted">{store.type}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">⭐</span>
              <span className="font-bold">{store.rating}</span>
              <span className="text-brand-muted">({store.reviews})</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
              store.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${store.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {store.isOpen ? 'Aberto' : 'Fechado'}
            </div>
            <p className="text-xs text-brand-muted mt-1">🕐 {store.time}</p>
          </div>
        </div>

        <Card padding="sm" className="bg-brand-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-bold text-brand-ink">Taxa de entrega</p>
                <p className="text-sm text-brand-muted">Frete fixo por pedido</p>
              </div>
            </div>
            <span className="font-extrabold text-brand-red">{formatCurrency(store.fee)}</span>
          </div>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-red text-white'
                  : 'bg-white border border-brand-line text-brand-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredProducts.map(product => (
            <Card key={product.id} padding="md" className={!product.inStock ? 'opacity-60' : ''}>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-brand-soft flex items-center justify-center text-3xl relative">
                  {product.emoji}
                  {product.tag && (
                    <Badge
                      variant={product.tag === 'Promo' ? 'warning' : 'info'}
                      className="absolute -top-2 -right-2 text-xs"
                    >
                      {product.tag}
                    </Badge>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-bold text-brand-ink">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-brand-red">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-brand-muted line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {product.inStock ? (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center text-xl font-bold hover:bg-brand-red-dark transition-colors"
                  >
                    +
                  </button>
                ) : (
                  <Badge variant="error" className="text-xs">Esgotado</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {cart.getCount() > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-brand-line p-4 shadow-lg">
          <div className="max-w-[390px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center text-white text-xl font-bold">
                {cart.getCount()}
              </div>
              <div>
                <p className="text-sm text-brand-muted">Seu carrinho</p>
                <p className="font-extrabold text-brand-ink">{formatCurrency(cart.getSubtotal())}</p>
              </div>
            </div>
            <Button onClick={() => router.push('/user/cart')}>
              Ver carrinho →
            </Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}