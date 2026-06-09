'use client'

import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { Card } from '@/components/ui/card'
import { ProductCard } from '@/components/ui/product-card'

const favorites = [
  { id: '1', title: 'Whopper', description: 'Pão, carne 180g, queijo...', price: 32.90, store: 'Burger King', image: '🍔' },
  { id: '2', title: 'Pizza Margherita', description: 'Molho, mussarela, manjericão', price: 49.90, store: 'Pizza Hut', image: '🍕' },
  { id: '3', title: 'Açaí 500ml', description: 'Açaí puro com granola', price: 24.90, store: 'Açaí Perfect', image: '🍨' },
]

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink">❤️ Favoritos</h1>
      </NavBar>

      <div className="px-4 py-4 max-w-[390px] mx-auto">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {favorites.map(product => (
              <ProductCard
                key={product.id}
                productId={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                thumb={product.image}
                onAdd={() => alert('Adicionado!')}
                onClick={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">❤️</p>
            <h3 className="text-lg font-bold text-brand-ink mb-2">Nenhum favorito</h3>
            <p className="text-brand-muted mb-4">Salve seus produtos favoritos para encontrar rápido</p>
            <button className="px-6 py-3 bg-brand-red text-white rounded-xl font-medium">
              Explorar produtos
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
