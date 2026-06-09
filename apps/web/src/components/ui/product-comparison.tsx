'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface Product {
  id: string
  title: string
  price: number
  thumb?: string
  rating: number
  store: string
  stock: number
}

interface ComparisonState {
  products: Product[]
  maxProducts: number
}

export function ProductComparison() {
  const [state, setState] = useState<ComparisonState>({
    products: [],
    maxProducts: 3,
  })

  // Mock products for demo
  const availableProducts: Product[] = [
    { id: '1', title: 'Hambúrguer Especial', price: 29.90, thumb: '🍔', rating: 4.5, store: 'Burguer House', stock: 50 },
    { id: '2', title: 'Hambúrguer Clássico', price: 24.90, thumb: '🍔', rating: 4.2, store: 'Lanches São Paulo', stock: 30 },
    { id: '3', title: 'Hambúrguer Premium', price: 34.90, thumb: '🍔', rating: 4.8, store: 'Gourmet Plus', stock: 20 },
    { id: '4', title: 'X-Burguer', price: 19.90, thumb: '🍔', rating: 4.0, store: 'Lanches Brasil', stock: 45 },
    { id: '5', title: 'Mega Burguer', price: 39.90, thumb: '🍔', rating: 4.6, store: 'Big Food', stock: 15 },
  ]

  const addProduct = (product: Product) => {
    if (state.products.length >= state.maxProducts) {
      toast.error('Limite atingido', `Máximo de ${state.maxProducts} produtos`)
      return
    }
    if (state.products.some(p => p.id === product.id)) {
      toast.warning('Produto já adicionado')
      return
    }
    setState(s => ({ ...s, products: [...s.products, product] }))
    toast.success('Produto adicionado', product.title)
  }

  const removeProduct = (id: string) => {
    setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ))
  }

  return (
    <div className="space-y-4">
      {/* Add products */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Adicionar à comparação ({state.products.length}/{state.maxProducts})</h3>
        <div className="flex flex-wrap gap-2">
          {availableProducts
            .filter(p => !state.products.some(sp => sp.id === p.id))
            .map(product => (
              <button
                key={product.id}
                onClick={() => addProduct(product)}
                disabled={state.products.length >= state.maxProducts}
                className="flex items-center gap-2 px-3 py-2 bg-brand-soft rounded-xl text-sm hover:bg-brand-line transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{product.thumb}</span>
                <span className="text-brand-ink">{product.title}</span>
                <span className="text-brand-red font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</span>
              </button>
            ))}
        </div>
      </Card>

      {/* Comparison table */}
      {state.products.length > 0 ? (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">Comparando {state.products.length} produto(s)</h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-left p-3 text-sm font-bold text-brand-muted w-32">Critério</th>
                  {state.products.map(product => (
                    <th key={product.id} className="p-3 text-center">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="text-red-500 text-xs hover:underline mb-2"
                      >
                        ✕ Remover
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Product image */}
                <tr className="border-t border-brand-line">
                  <td className="p-3 text-sm font-bold text-brand-muted">Produto</td>
                  {state.products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <div className="w-20 h-20 bg-brand-soft rounded-xl flex items-center justify-center text-4xl mx-auto">
                        {product.thumb}
                      </div>
                      <p className="font-bold text-brand-ink mt-2 text-sm">{product.title}</p>
                    </td>
                  ))}
                </tr>

                {/* Price */}
                <tr className="border-t border-brand-line">
                  <td className="p-3 text-sm font-bold text-brand-muted">Preço</td>
                  {state.products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <span className="text-xl font-extrabold text-brand-red">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-t border-brand-line">
                  <td className="p-3 text-sm font-bold text-brand-muted">Avaliação</td>
                  {state.products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        {renderStars(product.rating)}
                      </div>
                      <p className="text-xs text-brand-muted mt-1">{product.rating}/5</p>
                    </td>
                  ))}
                </tr>

                {/* Store */}
                <tr className="border-t border-brand-line">
                  <td className="p-3 text-sm font-bold text-brand-muted">Loja</td>
                  {state.products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <Badge variant="outline" className="text-xs">{product.store}</Badge>
                    </td>
                  ))}
                </tr>

                {/* Stock */}
                <tr className="border-t border-brand-line">
                  <td className="p-3 text-sm font-bold text-brand-muted">Estoque</td>
                  {state.products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <span className={product.stock > 20 ? 'text-emerald-600' : product.stock > 10 ? 'text-amber-600' : 'text-red-600'}>
                        {product.stock} unidades
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Best value highlight */}
                <tr className="border-t border-brand-line bg-emerald-50">
                  <td className="p-3 text-sm font-bold text-emerald-700">🏆 Melhor custo-benefício</td>
                  {state.products.map((product, idx) => {
                    const bestIdx = state.products.reduce((best, p, i, arr) =>
                      (p.price / p.rating) < (arr[best].price / arr[best].rating) ? i : best
                    , 0)
                    return (
                      <td key={product.id} className="p-3 text-center">
                        {idx === bestIdx && <Badge variant="success">✅ Melhor</Badge>}
                      </td>
                    )
                  })}
                </tr>

                {/* Action */}
                <tr className="border-t border-brand-line">
                  <td className="p-3"></td>
                  {state.products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <Button size="sm" className="w-full">
                        🛒 Adicionar
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-2">⚖️</p>
          <p className="font-bold text-brand-ink">Compare produtos</p>
          <p className="text-sm text-brand-muted mt-1">
            Adicione até 3 produtos para comparar
          </p>
        </Card>
      )}
    </div>
  )
}