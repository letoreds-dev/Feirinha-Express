'use client'

import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'

interface Category {
  id: string
  name: string
  icon: string
  storeCount: number
  color: string
}

const categories: Category[] = [
  { id: '1', name: 'Lanches', icon: '🍔', storeCount: 45, color: 'bg-orange-100' },
  { id: '2', name: 'Pizza', icon: '🍕', storeCount: 32, color: 'bg-red-100' },
  { id: '3', name: 'Açaí', icon: '🍨', storeCount: 28, color: 'bg-purple-100' },
  { id: '4', name: 'Japonês', icon: '🍣', storeCount: 19, color: 'bg-pink-100' },
  { id: '5', name: 'Mexicano', icon: '🌮', storeCount: 15, color: 'bg-yellow-100' },
  { id: '6', name: 'Doces', icon: '🍰', storeCount: 23, color: 'bg-rose-100' },
  { id: '7', name: 'Café', icon: '☕', storeCount: 38, color: 'bg-amber-100' },
  { id: '8', name: 'Saudável', icon: '🥗', storeCount: 21, color: 'bg-green-100' },
  { id: '9', name: 'Massas', icon: '🍝', storeCount: 18, color: 'bg-yellow-50' },
  { id: '10', name: 'Bebidas', icon: '🥤', storeCount: 42, color: 'bg-blue-100' },
  { id: '11', name: 'Sorvetes', icon: '🍦', storeCount: 12, color: 'bg-cyan-100' },
  { id: '12', name: 'Padaria', icon: '🥐', storeCount: 29, color: 'bg-orange-50' },
]

interface CategoryCardProps {
  category: Category
  size?: 'sm' | 'md' | 'lg'
}

export function CategoryCard({ category, size = 'md' }: CategoryCardProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-full aspect-square',
  }

  return (
    <Link href={`/user/category/${category.id}`}>
      <Card padding="sm" className={`${sizeClasses[size]} flex flex-col items-center justify-center hover-lift transition-all`}>
        <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center text-3xl mb-2`}>
          {category.icon}
        </div>
        <p className={`font-bold text-brand-ink ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {category.name}
        </p>
        <p className="text-xs text-brand-muted">{category.storeCount} lojas</p>
      </Card>
    </Link>
  )
}

export function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Featured categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-brand-ink">Populares</h2>
          <Badge variant="filled" className="text-xs">Mais pedidos</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.slice(0, 4).map(cat => (
            <Link key={cat.id} href={`/user/category/${cat.id}`}>
              <Card padding="md" className="hover-lift">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-2xl`}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-bold text-brand-ink">{cat.name}</p>
                    <p className="text-xs text-brand-muted">{cat.storeCount} lojas</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* All categories */}
      <div>
        <h2 className="text-lg font-extrabold text-brand-ink mb-3">Todas as categorias</h2>
        <div className="grid grid-cols-3 gap-3">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} size="sm" />
          ))}
        </div>
      </div>

      {/* Quick filters */}
      <div>
        <h2 className="text-lg font-extrabold text-brand-ink mb-3">Filtros rápidos</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Frete grátis', icon: '🚚', count: 156 },
            { label: 'Entrega rápida', icon: '⚡', count: 89 },
            { label: 'Avaliação 4.5+', icon: '⭐', count: 234 },
            { label: 'Desconto', icon: '🏷️', count: 78 },
            { label: 'Novidades', icon: '🆕', count: 45 },
            { label: 'Pet friendly', icon: '🐾', count: 67 },
          ].map((filter, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-brand-line rounded-full text-sm hover:border-brand-red hover:text-brand-red transition-colors"
            >
              <span>{filter.icon}</span>
              <span className="font-medium">{filter.label}</span>
              <Badge variant="outline" className="text-xs">{filter.count}</Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Horizontal scroll version
export function CategoriesHorizontal() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
      {categories.map(cat => (
        <Link key={cat.id} href={`/user/category/${cat.id}`} className="flex-shrink-0">
          <Card padding="sm" className="w-24 text-center hover-lift">
            <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-2xl mx-auto mb-2`}>
              {cat.icon}
            </div>
            <p className="text-xs font-bold text-brand-ink truncate">{cat.name}</p>
          </Card>
        </Link>
      ))}
    </div>
  )
}