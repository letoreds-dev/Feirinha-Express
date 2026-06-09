/**
 * Feirinha Express - Search System
 * Advanced search with filters, suggestions, and recent searches
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

// ==================== SEARCH TYPES ====================

interface SearchResult {
  id: string
  type: 'product' | 'store' | 'category'
  name: string
  description?: string
  image?: string
  emoji?: string
  rating?: number
  distance?: string
  price?: number
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'popular' | 'recent' | 'trending'
  icon?: string
}

interface SearchFilters {
  category: string[]
  priceRange: [number, number]
  rating: number
  deliveryFee: 'any' | 'free' | 'under5' | 'under10'
  sortBy: 'relevance' | 'rating' | 'distance' | 'price'
}

const defaultFilters: SearchFilters = {
  category: [],
  priceRange: [0, 100],
  rating: 0,
  deliveryFee: 'any',
  sortBy: 'relevance',
}

// ==================== RECENT SEARCHES HOOK ====================

export function useRecentSearches(maxItems: number = 10) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const addSearch = useCallback((query: string) => {
    if (!query.trim()) return

    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase())
      const updated = [query, ...filtered].slice(0, maxItems)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      return updated
    })
  }, [maxItems])

  const removeSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== query)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }, [])

  return { recentSearches, addSearch, removeSearch, clearAll }
}

// ==================== SEARCH SUGGESTIONS HOOK ====================

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const popularSearches: SearchSuggestion[] = [
    { id: '1', text: 'Hambúrguer artesanal', type: 'popular', icon: '🍔' },
    { id: '2', text: 'Pizza grande', type: 'popular', icon: '🍕' },
    { id: '3', text: 'Açaí 500ml', type: 'popular', icon: '🍨' },
    { id: '4', text: 'Sushi combo', type: 'popular', icon: '🍣' },
  ]

  const trendingSearches: SearchSuggestion[] = [
    { id: '5', text: 'Comida fitness', type: 'trending', icon: '🥗' },
    { id: '6', text: 'Esfiha', type: 'trending', icon: '🥙' },
    { id: '7', text: 'Pastel', type: 'trending', icon: '🥟' },
    { id: '8', text: 'Tapioca', type: 'trending', icon: '🫓' },
  ]

  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([...popularSearches, ...trendingSearches])
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))

    const lowerQuery = query.toLowerCase()
    const filtered = [
      ...popularSearches.filter(s => s.text.toLowerCase().includes(lowerQuery)),
      ...trendingSearches.filter(s => s.text.toLowerCase().includes(lowerQuery)),
    ]

    setSuggestions(filtered.length > 0 ? filtered : [...popularSearches, ...trendingSearches])
    setIsLoading(false)
  }, [])

  return { suggestions, getSuggestions, isLoading, popularSearches, trendingSearches }
}

// ==================== SEARCH CONTEXT ====================

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  isSearching: boolean
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  search: () => void
  clearSearch: () => void
}

const SearchContext = React.createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)

  const search = useCallback(async () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockResults: SearchResult[] = [
      { id: '1', type: 'product' as const, name: 'Hambúrguer Artesanal', emoji: '🍔', price: 32.90, rating: 4.8 },
      { id: '2', type: 'product' as const, name: 'X-Bacon', emoji: '🍔', price: 28.90, rating: 4.5 },
      { id: '3', type: 'product' as const, name: 'Pizza Margherita', emoji: '🍕', price: 45.90, rating: 4.7 },
      { id: '4', type: 'product' as const, name: 'Açaí 500ml', emoji: '🍨', price: 22.90, rating: 4.9 },
      { id: '5', type: 'store' as const, name: 'Burguer House', emoji: '🍔', rating: 4.8, distance: '1.2km' },
      { id: '6', type: 'store' as const, name: 'Pizza Express', emoji: '🍕', rating: 4.7, distance: '0.8km' },
    ].filter(r => r.name.toLowerCase().includes(query.toLowerCase()))

    setResults(mockResults)
    setIsSearching(false)
  }, [query])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setFilters(defaultFilters)
  }, [])

  return (
    <SearchContext.Provider value={{ query, setQuery, results, isSearching, filters, setFilters, search, clearSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

// ==================== SEARCH BAR COMPONENT ====================

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  onClear: () => void
  placeholder?: string
  autoFocus?: boolean
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Buscar...',
  autoFocus = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
    if (e.key === 'Escape') {
      onClear()
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-12 py-4 bg-white border border-brand-line rounded-2xl focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-200 transition-all"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center text-brand-muted hover:bg-brand-line"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

// ==================== SEARCH SUGGESTIONS ====================

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[]
  isLoading: boolean
  onSelect: (suggestion: string) => void
  onRemove: (suggestion: string) => void
}

export function SearchSuggestions({ suggestions, isLoading, onSelect, onRemove }: SearchSuggestionsProps) {
  const popular = suggestions.filter(s => s.type === 'popular')
  const trending = suggestions.filter(s => s.type === 'trending')
  const recent = suggestions.filter(s => s.type === 'recent')

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <span className="animate-pulse text-brand-muted">Buscando sugestões...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recent.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-brand-muted uppercase mb-2">Recentes</h4>
          <div className="space-y-1">
            {recent.map(s => (
              <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-soft">
                <span className="text-brand-muted">🕐</span>
                <button
                  onClick={() => onSelect(s.text)}
                  className="flex-1 text-left text-brand-ink"
                >
                  {s.text}
                </button>
                <button
                  onClick={() => onRemove(s.text)}
                  className="text-brand-muted hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {popular.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-brand-muted uppercase mb-2">Populares</h4>
          <div className="space-y-1">
            {popular.map(s => (
              <button
                key={s.id}
                onClick={() => onSelect(s.text)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-brand-soft text-left"
              >
                <span className="text-lg">{s.icon}</span>
                <span className="text-brand-ink">{s.text}</span>
                <span className="ml-auto text-xs text-brand-muted">🔥</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {trending.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-brand-muted uppercase mb-2">Em Alta</h4>
          <div className="space-y-1">
            {trending.map(s => (
              <button
                key={s.id}
                onClick={() => onSelect(s.text)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-brand-soft text-left"
              >
                <span className="text-lg">{s.icon}</span>
                <span className="text-brand-ink">{s.text}</span>
                <span className="ml-auto text-xs text-yellow-500">⭐</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== SEARCH RESULTS ====================

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-brand-muted">Buscando...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-brand-muted">Nenhum resultado encontrado</p>
      </div>
    )
  }

  const products = results.filter(r => r.type === 'product')
  const stores = results.filter(r => r.type === 'store')

  return (
    <div className="space-y-6">
      {products.length > 0 && (
        <div>
          <h3 className="font-bold text-brand-ink mb-3">🍽️ Produtos</h3>
          <div className="space-y-2">
            {products.map(p => (
              <Card key={p.id} padding="md" className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
                  {p.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-brand-ink">{p.name}</p>
                  {p.rating && (
                    <p className="text-sm text-brand-muted">⭐ {p.rating}</p>
                  )}
                </div>
                {p.price && (
                  <span className="font-bold text-brand-red">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {stores.length > 0 && (
        <div>
          <h3 className="font-bold text-brand-ink mb-3">🏪 Lojas</h3>
          <div className="space-y-2">
            {stores.map(s => (
              <Card key={s.id} padding="md" className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center text-2xl">
                  {s.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-brand-ink">{s.name}</p>
                  <div className="flex items-center gap-2 text-sm text-brand-muted">
                    {s.rating && <span>⭐ {s.rating}</span>}
                    {s.distance && <span>📍 {s.distance}</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== ADVANCED SEARCH PAGE ====================

export function AdvancedSearchPage() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)

  const { suggestions, getSuggestions, isLoading: isLoadingSuggestions } = useSearchSuggestions()
  const { recentSearches, addSearch, removeSearch, clearAll } = useRecentSearches()

  useEffect(() => {
    getSuggestions(query)
  }, [query, getSuggestions])

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setShowSuggestions(false)
    addSearch(query)

    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockResults: SearchResult[] = [
      { id: '1', type: 'product', name: `${query} Especial`, emoji: '🍽️', price: 35.90, rating: 4.6 },
      { id: '2', type: 'product', name: `${query} Tradicional`, emoji: '🍽️', price: 28.90, rating: 4.4 },
      { id: '3', type: 'store', name: `${query} Store`, emoji: '🏪', rating: 4.5, distance: '1.5km' },
    ]

    setResults(mockResults)
    setIsSearching(false)
  }, [query, addSearch])

  const handleSelectSuggestion = (text: string) => {
    setQuery(text)
    setShowSuggestions(false)
    addSearch(text)
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-20">
      <div className="sticky top-0 bg-white border-b border-brand-line p-4 z-10">
        <div className="max-w-[390px] mx-auto">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            onClear={() => {
              setQuery('')
              setShowSuggestions(true)
              setResults([])
            }}
            placeholder="Buscar produtos, lojas..."
            autoFocus
          />
        </div>
      </div>

      <div className="max-w-[390px] mx-auto px-4 py-6">
        {showSuggestions && !results.length && (
          <>
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-brand-ink">🕐 Buscas Recentes</h3>
                  <button onClick={clearAll} className="text-sm text-brand-red">
                    Limpar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSuggestion(s)}
                      className="px-3 py-2 bg-brand-soft rounded-full text-sm text-brand-ink flex items-center gap-2 hover:bg-brand-line"
                    >
                      {s}
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSearch(s)
                        }}
                        className="text-brand-muted hover:text-red-500"
                      >
                        ✕
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <SearchSuggestions
              suggestions={suggestions}
              isLoading={isLoadingSuggestions}
              onSelect={handleSelectSuggestion}
              onRemove={removeSearch}
            />
          </>
        )}

        {results.length > 0 && (
          <SearchResults results={results} isLoading={isSearching} />
        )}
      </div>
    </div>
  )
}

// Need to import React
import React from 'react'