'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

export function ProductCatalog({ merchantId }: { merchantId?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const categories = [
    { id: 'burgers', name: 'Hambúrgueres', icon: '🍔' },
    { id: 'sides', name: 'Acompanhamentos', icon: '🍟' },
    { id: 'drinks', name: 'Bebidas', icon: '🥤' },
    { id: 'desserts', name: 'Sobremesas', icon: '🍰' },
  ]

  const products = [
    { id: '1', name: 'Hambúrguer Clássico', description: 'Pão, carne 150g, queijo, alface, tomate', price: 25.90, thumb: '🍔', category: 'burgers', popular: true },
    { id: '2', name: 'Hambúrguer Especial', description: 'Pão brioche, carne 200g, bacon, cheddar', price: 32.90, thumb: '🍔', category: 'burgers', popular: true },
    { id: '3', name: 'X-Bacon', description: 'Pão, carne 150g, bacon, queijo', price: 28.90, thumb: '🍔', category: 'burgers' },
    { id: '4', name: 'Hambúrguer Vegano', description: 'Pão integral, hambúrguer de grão-de-bico', price: 29.90, thumb: '🥬', category: 'burgers' },
    { id: '5', name: 'Batata Frita P', description: 'Porção pequena', price: 12.90, thumb: '🍟', category: 'sides' },
    { id: '6', name: 'Batata Frita M', description: 'Porção média', price: 15.90, thumb: '🍟', category: 'sides', popular: true },
    { id: '7', name: 'Onion Rings', description: 'Anéis de cebola empanados', price: 18.90, thumb: '🧅', category: 'sides' },
    { id: '8', name: 'Refrigerante 600ml', description: 'Coca-Cola, Guaraná ou Sprite', price: 6.90, thumb: '🥤', category: 'drinks' },
    { id: '9', name: 'Suco Natural 500ml', description: 'Laranja, limão ou maracujá', price: 9.90, thumb: '🍊', category: 'drinks' },
    { id: '10', name: 'Água 500ml', description: 'Com ou sem gás', price: 4.90, thumb: '💧', category: 'drinks' },
    { id: '11', name: 'Brownie', description: 'Com sorvete de creme', price: 15.90, thumb: '🍫', category: 'desserts', popular: true },
    { id: '12', name: 'Petit Gateau', description: 'Bolinho de chocolate com sorvete', price: 22.90, thumb: '🍰', category: 'desserts' },
  ]

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products

  const getQuantity = (id: string) => quantities[id] || 0

  const setQuantity = (id: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, qty) }))
  }

  const addToCart = (product: typeof products[0]) => {
    const qty = getQuantity(product.id)
    if (qty > 0) {
      toast.success(`${qty}x ${product.name} adicionado(s)`)
      setQuantity(product.id, 0)
    } else {
      setQuantity(product.id, 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null ? 'bg-brand-red text-white' : 'bg-white border border-brand-line text-brand-ink'
          }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedCategory === cat.id ? 'bg-brand-red text-white' : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="space-y-3">
        {filteredProducts.map(product => {
          const qty = getQuantity(product.id)
          return (
            <Card key={product.id} padding="md" className="relative">
              {product.popular && (
                <Badge variant="warning" className="absolute top-2 right-2 text-xs">
                  🔥 Popular
                </Badge>
              )}

              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl bg-brand-soft flex items-center justify-center text-4xl flex-shrink-0">
                  {product.thumb}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-brand-ink">{product.name}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-lg font-extrabold text-brand-red">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {qty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(product.id, qty - 1)}
                          className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center hover:bg-brand-line transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold">{qty}</span>
                        <button
                          onClick={() => setQuantity(product.id, qty + 1)}
                          className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center hover:bg-brand-line transition-colors"
                        >
                          +
                        </button>
                        <Button size="sm" onClick={() => addToCart(product)}>
                          Adicionar
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => addToCart(product)}>
                        🛒 Adicionar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Cart summary */}
      {Object.values(quantities).some(q => q > 0) && (
        <Card padding="md" className="bg-brand-red text-white sticky bottom-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">
                {Object.values(quantities).reduce((a, b) => a + b, 0)} item(s) no carrinho
              </p>
            </div>
            <Button variant="secondary" className="bg-white text-brand-red hover:bg-gray-100">
              Ver carrinho →
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}