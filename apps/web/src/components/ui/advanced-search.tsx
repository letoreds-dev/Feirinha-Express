'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Input } from '@/components/ui'
import { ProductCard } from '@/components/ui/product-card'

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'popular' | 'trending'
  icon?: string
}

interface SearchState {
  query: string
  results: any[]
  suggestions: SearchSuggestion[]
  isLoading: boolean
  filters: {
    category: string | null
    priceRange: [number, number] | null
    rating: number | null
    inStock: boolean
  }
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
}

const popularSearches: SearchSuggestion[] = [
  { id: '1', text: 'Hambúrguer', type: 'popular', icon: '🍔' },
  { id: '2', text: 'Pizza', type: 'popular', icon: '🍕' },
  { id: '3', text: 'Açaí', type: 'popular', icon: '🍨' },
  { id: '4', text: 'Sushi', type: 'popular', icon: '🍣' },
  { id: '5', text: 'Café da manhã', type: 'trending', icon: '🥞' },
]

const trendingProducts = [
  { id: '1', title: 'Combo Família', price: 59.90, store: 'Burguer House', thumb: '🍔' },
  { id: '2', title: 'Pizza Grande', price: 45.90, store: 'Pizzaria Napoli', thumb: '🍕' },
  { id: '3', title: 'Açaí 700ml', price: 32.90, store: 'Açaí Express', thumb: '🍨' },
]

export function AdvancedSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    suggestions: [],
    isLoading: false,
    filters: {
      category: null,
      priceRange: null,
      rating: null,
      inStock: false,
    },
    sortBy: 'relevance',
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('feirinha-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(s => ({ ...s, results: [], suggestions: [] }))
      return
    }

    setState(s => ({ ...s, isLoading: true }))

    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('feirinha-recent-searches', JSON.stringify(updated))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock results
    const mockResults = [
      { id: '1', title: `${query} Especial`, price: 29.90, description: 'Delicioso', store: 'Loja 1' },
      { id: '2', title: `${query} Premium`, price: 39.90, description: 'O melhor', store: 'Loja 2' },
      { id: '3', title: `${query} Kids`, price: 19.90, description: 'Para crianças', store: 'Loja 3' },
    ]

    setState(s => ({
      ...s,
      results: mockResults,
      isLoading: false,
      suggestions: [],
    }))
    setShowSuggestions(false)
  }, [recentSearches])

  const handleInputChange = (value: string) => {
    setState(s => ({ ...s, query: value }))

    if (value.length > 0) {
      // Show filtered suggestions based on input
      const filtered = popularSearches.filter(s =>
        s.text.toLowerCase().includes(value.toLowerCase())
      )
      setState(s => ({ ...s, suggestions: filtered }))
      setShowSuggestions(true)
    } else {
      setState(s => ({ ...s, suggestions: [] }))
      setShowSuggestions(false)
    }
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('feirinha-recent-searches')
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Input
            value={state.query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Buscar produtos, lojas..."
            className="pl-12 pr-4 py-4 text-base"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-xl">
            🔍
          </span>
          {state.query && (
            <button
              onClick={() => {
                setState(s => ({ ...s, query: '', results: [], suggestions: [] }))
                setShowSuggestions(false)
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
            >
              ✕
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && !state.results.length && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-brand-line z-50 overflow-hidden animate-fade-up">
            {/* Recent searches */}
            {recentSearches.length > 0 && !state.query && (
              <div className="p-3 border-b border-brand-line">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-muted uppercase">Buscas recentes</span>
                  <button onClick={handleClearRecent} className="text-xs text-brand-red hover:underline">
                    Limpar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1.5 bg-brand-soft rounded-full text-sm text-brand-ink hover:bg-brand-line transition-colors"
                    >
                      🕐 {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {state.suggestions.length > 0 && (
              <div className="p-3">
                <span className="text-xs font-bold text-brand-muted uppercase mb-2 block">
                  Sugestões
                </span>
                {state.suggestions.map(suggestion => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.text)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-brand-soft rounded-lg transition-colors"
                  >
                    <span className="text-xl">{suggestion.icon}</span>
                    <span className="text-brand-ink">{suggestion.text}</span>
                    {suggestion.type === 'trending' && (
                      <Badge variant="warning" className="text-xs ml-auto">🔥 Trending</Badge>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Popular searches */}
            {!state.query && (
              <div className="p-3">
                <span className="text-xs font-bold text-brand-muted uppercase mb-2 block">
                  Populares
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 4).map(search => (
                    <button
                      key={search.id}
                      onClick={() => handleSearch(search.text)}
                      className="px-3 py-1.5 border border-brand-line rounded-full text-sm text-brand-ink hover:border-brand-red hover:text-brand-red transition-colors"
                    >
                      {search.icon} {search.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <select
          onChange={(e) => setState(s => ({ ...s, filters: { ...s.filters, category: e.target.value || null } }))}
          className="px-3 py-2 bg-white border border-brand-line rounded-full text-sm"
        >
          <option value="">Categoria</option>
          <option value="lanches">Lanches</option>
          <option value="pizza">Pizza</option>
          <option value="acai">Açaí</option>
        </select>
        <select
          onChange={(e) => setState(s => ({ ...s, sortBy: e.target.value as SearchState['sortBy'] }))}
          className="px-3 py-2 bg-white border border-brand-line rounded-full text-sm"
        >
          <option value="relevance">Mais relevantes</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="rating">Melhor avaliados</option>
        </select>
        <button
          onClick={() => setState(s => ({ ...s, filters: { ...s.filters, inStock: !s.filters.inStock } }))}
          className={`px-3 py-2 border rounded-full text-sm transition-colors ${
            state.filters.inStock
              ? 'bg-brand-red text-white border-brand-red'
              : 'bg-white border-brand-line text-brand-ink'
          }`}
        >
          📦 Só em estoque
        </button>
      </div>

      {/* Results */}
      {state.isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white rounded-xl border border-brand-line animate-pulse" />
          ))}
        </div>
      ) : state.results.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-brand-muted">
            {state.results.length} resultado(s) para "{state.query}"
          </p>
          {state.results.map(product => (
            <ProductCard
              key={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
            />
          ))}
        </div>
      ) : state.query ? (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-2">🔍</p>
          <p className="font-bold text-brand-ink">Nenhum resultado</p>
          <p className="text-sm text-brand-muted mt-1">
            Tente buscar com outros termos
          </p>
        </Card>
      ) : (
        <>
          {/* Trending products */}
          <div>
            <h3 className="font-bold text-brand-ink mb-3">🔥 Em alta agora</h3>
            <div className="grid grid-cols-3 gap-2">
              {trendingProducts.map(product => (
                <Card key={product.id} padding="sm" className="text-center hover-lift cursor-pointer">
                  <div className="text-3xl mb-1">{product.thumb}</div>
                  <p className="text-xs font-bold text-brand-ink truncate">{product.title}</p>
                  <p className="text-sm text-brand-red font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}