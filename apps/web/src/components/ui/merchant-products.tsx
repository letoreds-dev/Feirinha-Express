'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

export function MerchantProductManager() {
  const [products, setProducts] = useState([
    { id: '1', name: 'Hambúrguer Clássico', price: 25.90, active: true, stock: 100, sold: 234 },
    { id: '2', name: 'Hambúrguer Especial', price: 32.90, active: true, stock: 50, sold: 156 },
    { id: '3', name: 'X-Bacon', price: 28.90, active: true, stock: 75, sold: 98 },
    { id: '4', name: 'Batata Frita M', price: 15.90, active: false, stock: 0, sold: 0 },
  ])

  const toggleActive = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, active: !p.active } : p
    ))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-brand-ink">📦 Meus Produtos</h2>
        <Button size="sm">
          ➕ Novo produto
        </Button>
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {products.map(product => (
          <Card key={product.id} padding="md">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl bg-brand-soft flex items-center justify-center text-3xl flex-shrink-0">
                🍔
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-brand-ink">{product.name}</p>
                    <p className="text-lg font-extrabold text-brand-red">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.active}
                      onChange={() => toggleActive(product.id)}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      product.active ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform ${
                        product.active ? 'translate-x-5' : ''
                      }`} />
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-brand-muted">
                  <span>📦 Estoque: {product.stock}</span>
                  <span>✅ Vendidos: {product.sold}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    ✏️ Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    🗑️
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add product form */}
      <Card padding="md" className="border-dashed border-2 border-brand-line bg-transparent">
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-xl bg-brand-soft flex items-center justify-center text-3xl mx-auto mb-3">
            ➕
          </div>
          <p className="font-bold text-brand-ink">Adicionar novo produto</p>
          <p className="text-sm text-brand-muted mt-1 mb-4">
            Expanda seu catálogo e aumente suas vendas
          </p>
          <Button className="w-full">
            Criar produto
          </Button>
        </div>
      </Card>

      {/* Bulk actions */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">⚡ Ações em massa</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            📦 Repor estoque
          </Button>
          <Button variant="outline" size="sm">
            📊 Ver métricas
          </Button>
          <Button variant="outline" size="sm">
            🏷️ Criar oferta
          </Button>
          <Button variant="outline" size="sm">
            📋 Duplicar
          </Button>
        </div>
      </Card>
    </div>
  )
}