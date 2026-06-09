'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from './product-card'
import { Chip } from './chip'
import { SearchBar } from './search-system'
import { useSearchStore } from '@/store/searches'
import { ProductCardSkeleton } from './skeleton'
import { NoProductsEmpty } from './empty-state'

interface Product {
  id: string
  title: string
  description: string
  price: number
  thumb?: string
  category?: string
  rating?: number
  inStock?: boolean
  storeId?: string
}

interface AdvancedFiltersProps {
  products: Product[]
  categories?: string[]
  stores?: Array<{ id: string; name: string }>
  onAddToCart?: (productId: string) => void
  onProductClick?: (productId: string) => void
  isLoading?: boolean
}

type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'name'
type PriceRange = 'all' | 'under-50' | '50-100' | '100-200' | 'over-200'

export function AdvancedFilters({
  products,
  categories = [],
  stores = [],
  onAddToCart,
  onProductClick,
  isLoading = false
}: AdvancedFiltersProps) {
  const [search, setSearch] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStore, setSelectedStore] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<PriceRange>('all')
  const [sortBy, setSortBy] = useState<SortBy>('relevance')
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [minRating, setMinRating] = useState(0)

  const { addSearch } = useSearchStore()

  // Filtragem
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Busca por texto
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    // Categoria
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Loja
    if (selectedStore !== 'all') {
      result = result.filter((p) => p.storeId === selectedStore)
    }

    // Faixa de preço
    if (priceRange !== 'all') {
      result = result.filter((p) => {
        if (priceRange === 'under-50') return p.price < 50
        if (priceRange === '50-100') return p.price >= 50 && p.price < 100
        if (priceRange === '100-200') return p.price >= 100 && p.price < 200
        return p.price >= 200
      })
    }

    // Em estoque
    if (onlyInStock) {
      result = result.filter((p) => p.inStock !== false)
    }

    // Rating mínimo
    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= minRating)
    }

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [products, search, selectedCategory, selectedStore, priceRange, sortBy, onlyInStock, minRating])

  const handleSearchSubmit = (query: string) => {
    setSearch(query)
    addSearch(query)
    setShowHistory(false)
  }

  const hasFilters =
    selectedCategory !== 'all' ||
    selectedStore !== 'all' ||
    priceRange !== 'all' ||
    sortBy !== 'relevance' ||
    onlyInStock ||
    minRating > 0

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <SearchBar
        value={search}
        onChange={(v) => {
          setSearch(v)
          setShowHistory(v.length === 0)
        }}
        onSearch={() => handleSearchSubmit(search)}
        onClear={() => setSearch('')}
      />

      {/* Histórico de buscas */}
      {showHistory && !search && (
        <div className="bg-white rounded-xl border border-brand-line p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-brand-ink">🔍 Buscas recentes</span>
            <button
              onClick={() => useSearchStore.getState().clearSearches()}
              className="text-xs text-brand-red hover:underline"
            >
              Limpar tudo
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {useSearchStore.getState().recentSearches.slice(0, 5).map((query, i) => (
              <button
                key={i}
                onClick={() => handleSearchSubmit(query)}
                className="px-3 py-1.5 bg-brand-soft rounded-full text-sm text-brand-ink hover:bg-brand-line"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filtros - sempre visíveis quando há busca */}
      {!showHistory && (
        <>
          {/* Categorias */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Chip
                active={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              >
                Todas
              </Chip>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  active={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Chip>
              ))}
            </div>
          )}

          {/* Filtros avançados */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-white rounded-xl border border-brand-line">
            {/* Faixa de preço */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as PriceRange)}
              className="px-3 py-2 text-sm rounded-lg border border-brand-line bg-white text-brand-ink focus:border-brand-red focus:outline-none"
            >
              <option value="all">Todos os preços</option>
              <option value="under-50">Até R$ 50</option>
              <option value="50-100">R$ 50 - R$ 100</option>
              <option value="100-200">R$ 100 - R$ 200</option>
              <option value="over-200">Acima de R$ 200</option>
            </select>

            {/* Lojas */}
            {stores.length > 0 && (
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-brand-line bg-white text-brand-ink focus:border-brand-red focus:outline-none"
              >
                <option value="all">Todas as lojas</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            )}

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 text-sm rounded-lg border border-brand-line bg-white text-brand-ink focus:border-brand-red focus:outline-none"
            >
              <option value="relevance">Mais relevantes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="rating">Melhor avaliados</option>
              <option value="name">A - Z</option>
            </select>

            {/* Rating mínimo */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-3 py-2 text-sm rounded-lg border border-brand-line bg-white text-brand-ink focus:border-brand-red focus:outline-none"
            >
              <option value="0">Qualquer avaliação</option>
              <option value="3">3+ ⭐</option>
              <option value="4">4+ ⭐</option>
              <option value="5">5 ⭐</option>
            </select>
          </div>

          {/* Toggles extras */}
          <div className="flex items-center gap-2 px-1">
            <label className="flex items-center gap-2 text-sm text-brand-ink cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded accent-brand-red"
              />
              Apenas em estoque
            </label>

            {hasFilters && (
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedStore('all')
                  setPriceRange('all')
                  setSortBy('relevance')
                  setOnlyInStock(false)
                  setMinRating(0)
                }}
                className="ml-auto text-xs text-brand-red hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-brand-muted">
              {isLoading ? (
                <ProductCardSkeleton />
              ) : (
                <>
                  <strong className="text-brand-ink">{filteredProducts.length}</strong>{' '}
                  {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                  {search && ` para "${search}"`}
                </>
              )}
            </p>
          </div>

          {/* Lista de produtos */}
          {isLoading ? (
            <div className="space-y-3 stagger-children">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <NoProductsEmpty />
          ) : (
            <div className="space-y-3 stagger-children">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  thumb={product.thumb}
                  onAdd={() => onAddToCart?.(product.id)}
                  onClick={() => onProductClick?.(product.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}