'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

export function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0)

  const images = [
    { id: '1', type: 'image', content: '🍔', label: 'Visão frontal' },
    { id: '2', type: 'image', content: '🥬', label: 'Ingredientes' },
    { id: '3', type: 'image', content: '🍟', label: 'Combocom' },
    { id: '4', type: 'video', content: '▶️', label: 'Vídeo' },
  ]

  const relatedProducts = [
    { id: '1', name: 'Batata Frita', price: 15.90, thumb: '🍟' },
    { id: '2', name: 'Refrigerante', price: 6.90, thumb: '🥤' },
    { id: '3', name: 'Sobremesa', price: 12.90, thumb: '🍰' },
  ]

  return (
    <div className="space-y-6">
      {/* Main image */}
      <div className="relative">
        <div className="aspect-square bg-brand-soft rounded-2xl flex items-center justify-center">
          <span className="text-[200px]">{images[activeIndex].content}</span>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="warning" className="text-xs">🔥 Popular</Badge>
        </div>

        {/* Navigation arrows */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          ←
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          →
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(idx)}
            className={`flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center text-3xl transition-all ${
              idx === activeIndex
                ? 'border-2 border-brand-red bg-white shadow-md'
                : 'bg-brand-soft hover:bg-brand-line'
            }`}
          >
            {img.content}
          </button>
        ))}
      </div>

      {/* Info */}
      <div>
        <h2 className="text-2xl font-extrabold text-brand-ink">Hambúrguer Artesanal</h2>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="font-bold">4.8</span>
            <span className="text-brand-muted">(324 avaliações)</span>
          </div>
          <span className="text-brand-muted">•</span>
          <span className="text-brand-muted">500+ pedidos</span>
        </div>
      </div>

      {/* Price and order */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-3xl font-extrabold text-brand-red">R$ 32,90</span>
          <span className="text-sm text-brand-muted ml-2">serve 1 pessoa</span>
        </div>
        <Button size="lg" className="px-8">
          🛒 Adicionar
        </Button>
      </div>

      {/* Description */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Descrição</h3>
        <p className="text-brand-muted">
          Pão brioche tostado, hambúrguer artesanal de 180g, queijo cheddar derretido,
          bacon crocante, alface americana, tomate e molho especial da casa.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {['Artesanal', 'Sem conservantes', 'Fresco'].map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Nutritional info */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Informações nutricionais</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { label: 'Calorias', value: '650', unit: 'kcal' },
            { label: 'Proteínas', value: '35', unit: 'g' },
            { label: 'Carbs', value: '45', unit: 'g' },
            { label: 'Gordura', value: '28', unit: 'g' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-lg font-extrabold text-brand-ink">{item.value}</p>
              <p className="text-xs text-brand-muted">{item.unit}</p>
              <p className="text-xs text-brand-muted mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Allergens */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">⚠️ Alérgenos</h3>
        <div className="flex flex-wrap gap-2">
          {['Glúten', 'Laticínios', 'Ovos'].map(item => (
            <Badge key={item} variant="warning" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Related products */}
      <div>
        <h3 className="font-bold text-brand-ink mb-3">Combinar com</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {relatedProducts.map(product => (
            <Link key={product.id} href={`/user/product/${product.id}`} className="flex-shrink-0 w-32">
              <Card padding="sm" className="hover-lift">
                <div className="w-full h-24 rounded-xl bg-brand-soft flex items-center justify-center text-4xl mb-2">
                  {product.thumb}
                </div>
                <p className="text-sm font-bold text-brand-ink truncate">{product.name}</p>
                <p className="text-sm font-extrabold text-brand-red">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Store info */}
      <Card padding="md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-red flex items-center justify-center text-2xl text-white font-extrabold">
            BH
          </div>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">Burguer House</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">⭐ 4.8</span>
              <span className="text-brand-muted">•</span>
              <span className="text-xs text-brand-muted">25-35 min</span>
            </div>
          </div>
          <Link href="/user/merchant/1">
            <Button variant="outline" size="sm">Ver loja</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}