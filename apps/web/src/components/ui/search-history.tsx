/**
 * Feirinha Express - Search History & Suggestions
 * Complete search system with recent searches and suggestions
 */

'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== TYPES ====================

interface SearchHistoryItem {
  id: string
  query: string
  timestamp: Date
  resultsCount?: number
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'trending' | 'recent' | 'category' | 'popular'
  icon?: string
  url?: string
}

interface SearchContextType {
  history: SearchHistoryItem[]
  suggestions: SearchSuggestion[]
  addToHistory: (query: string, resultsCount?: number) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
  trendingSearches: SearchSuggestion[]
}

// ==================== CONTEXT ====================

const SearchContext = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [suggestions] = useState<SearchSuggestion[]>([
    { id: '1', text: 'Hambúrguer', type: 'trending', icon: '🍔' },
    { id: '2', text: 'Pizza', type: 'trending', icon: '🍕' },
    { id: '3', text: 'Açaí', type: 'trending', icon: '🧊' },
    { id: '4', text: 'Sushi', type: 'trending', icon: '🍣' },
    { id: '5', text: 'Lanches', type: 'category', icon: '🍔' },
    { id: '6', text: 'Bebidas', type: 'category', icon: '🥤' },
    { id: '7', text: 'Sobremesas', type: 'category', icon: '🍰' },
    { id: '8', text: 'Massas', type: 'category', icon: '🍝' },
  ])

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHistory(parsed.map((item: SearchHistoryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(history))
  }, [history])

  const addToHistory = useCallback((query: string, resultsCount?: number) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date(),
      resultsCount,
    }

    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase())
      // Add to beginning, limit to 20
      return [newItem, ...filtered].slice(0, 20)
    })
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const trendingSearches = suggestions.filter(s => s.type === 'trending')

  return (
    <SearchContext.Provider value={{
      history,
      suggestions,
      addToHistory,
      removeFromHistory,
      clearHistory,
      trendingSearches,
    }}>
      {children}
    </SearchContext.Provider>
  )
}

// ==================== HOOK ====================

export function useSearchHistory() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearchHistory must be used within SearchProvider')
  }
  return context
}

// ==================== SEARCH BAR ====================

interface SearchBarWithHistoryProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBarWithHistory({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar produtos, lojas...',
}: SearchBarWithHistoryProps) {
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      addToHistory(value)
      onSearch(value)
      setShowHistory(false)
    }
  }

  const handleHistoryClick = (query: string) => {
    onChange(query)
    addToHistory(query)
    onSearch(query)
    setShowHistory(false)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)

    if (hours < 1) return 'Agora'
    if (hours < 24) return `${hours}h`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
            🔍
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 bg-brand-soft rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red text-brand-ink"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-brand-line z-50 max-h-96 overflow-y-auto">
          {history.length > 0 ? (
            <>
              <div className="p-3 border-b border-brand-line flex items-center justify-between">
                <span className="text-sm font-medium text-brand-ink">🔍 Buscas recentes</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-brand-red"
                >
                  Limpar tudo
                </button>
              </div>
              <div className="divide-y divide-brand-line">
                {history.slice(0, 10).map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-brand-soft cursor-pointer"
                    onClick={() => handleHistoryClick(item.query)}
                  >
                    <span className="text-brand-muted">🕐</span>
                    <span className="flex-1 text-brand-ink">{item.query}</span>
                    <span className="text-xs text-brand-muted">
                      {formatTime(new Date(item.timestamp))}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFromHistory(item.id)
                      }}
                      className="text-brand-muted hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-brand-muted">Nenhuma busca recente</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ==================== SEARCH SUGGESTIONS ====================

interface SearchSuggestionsListProps {
  onSelect: (text: string) => void
  showTrending?: boolean
  showCategories?: boolean
}

export function SearchSuggestionsList({
  onSelect,
  showTrending = true,
  showCategories = true,
}: SearchSuggestionsListProps) {
  const { suggestions } = useSearchHistory()

  const trending = suggestions.filter(s => s.type === 'trending')
  const categories = suggestions.filter(s => s.type === 'category')

  return (
    <div className="space-y-4">
      {showTrending && trending.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-brand-muted mb-2">🔥 Em alta</h4>
          <div className="flex flex-wrap gap-2">
            {trending.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item.text)}
                className="px-4 py-2 bg-brand-soft rounded-full text-sm text-brand-ink hover:bg-brand-line flex items-center gap-2"
              >
                <span>{item.icon}</span>
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {showCategories && categories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-brand-muted mb-2">📂 Categorias</h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item.text)}
                className="p-3 bg-brand-soft rounded-xl text-left flex items-center gap-2 hover:bg-brand-line"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-brand-ink">{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== SEARCH RESULTS EMPTY ====================

interface SearchEmptyStateProps {
  query: string
  onClear: () => void
}

export function SearchEmptyState({ query, onClear }: SearchEmptyStateProps) {
  const suggestions = ['Pizza', 'Hambúrguer', 'Açaí', 'Sushi', 'Lanches']

  return (
    <div className="text-center py-8">
      <p className="text-5xl mb-4">🔍</p>
      <p className="text-lg font-medium text-brand-ink">
        Nenhum resultado para "{query}"
      </p>
      <p className="text-brand-muted mt-2">
        Tente buscar por outro termo
      </p>

      <div className="mt-6">
        <p className="text-sm text-brand-muted mb-3">Sugestões:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => onClear()}
              className="px-4 py-2 bg-brand-soft rounded-full text-sm text-brand-ink hover:bg-brand-line"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ==================== TYPEWRITER SUGGESTION ====================

interface TypewriterSuggestionProps {
  suggestions: string[]
  speed?: number
  onSelect: (text: string) => void
}

export function TypewriterSuggestion({ suggestions, speed = 100, onSelect }: TypewriterSuggestionProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (suggestions.length === 0) return

    const current = suggestions[currentIndex]

    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex + 1))
        setCharIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        // Move to next suggestion after pause
        setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % suggestions.length)
          setCharIndex(0)
          setDisplayText('')
        }, 2000)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [suggestions, currentIndex, charIndex, speed])

  if (suggestions.length === 0) return null

  return (
    <button
      onClick={() => onSelect(suggestions[currentIndex])}
      className="text-brand-muted hover:text-brand-red transition-colors text-left"
    >
      <span className="opacity-50">Buscar: </span>
      <span className="text-brand-ink">{displayText}</span>
      <span className="animate-pulse">|</span>
    </button>
  )
}

// ==================== RECENT SEARCHES WIDGET ====================

export function RecentSearchesWidget() {
  const { history, removeFromHistory, clearHistory } = useSearchHistory()
  const recent = history.slice(0, 5)

  if (recent.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-brand-muted">🔍 Recentes</h4>
        <button onClick={clearHistory} className="text-xs text-brand-red">
          Limpar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recent.map(item => (
          <button
            key={item.id}
            onClick={() => removeFromHistory(item.id)}
            className="px-3 py-1.5 bg-brand-soft rounded-full text-sm text-brand-ink flex items-center gap-2 hover:bg-brand-line"
          >
            <span>{item.query}</span>
            <span className="text-brand-muted">✕</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ==================== FULL SEARCH PAGE COMPONENT ====================

interface AdvancedSearchProps {
  onSearch: (query: string) => void
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const { history, addToHistory, clearHistory, trendingSearches } = useSearchHistory()

  const filters = [
    { id: 'rating', label: '⭐ Avaliação', icon: '⭐' },
    { id: 'price', label: '💰 Preço', icon: '💰' },
    { id: 'delivery', label: '🚚 Entrega', icon: '🚚' },
    { id: 'promo', label: '🎉 Promoção', icon: '🎉' },
  ]

  const handleSearch = () => {
    if (query.trim()) {
      addToHistory(query)
      onSearch(query)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search input */}
      <SearchBarWithHistory
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
      />

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? 'bg-brand-red text-white'
                : 'bg-brand-soft text-brand-ink'
            }`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* Recent searches */}
      {history.length > 0 && (
        <RecentSearchesWidget />
      )}

      {/* Trending */}
      {query.length === 0 && (
        <SearchSuggestionsList showCategories={false} onSelect={() => {}} />
      )}

      {/* Results count */}
      {query.length > 0 && (
        <div className="text-sm text-brand-muted">
          <p>Buscando por "{query}"...</p>
        </div>
      )}
    </div>
  )
}

// ==================== DEMO COMPONENT ====================

export function SearchHistoryDemo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const { history, clearHistory, addToHistory } = useSearchHistory()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setHasSearched(true)
  }

  const handleClear = () => {
    setSearchQuery('')
    setHasSearched(false)
  }

  return (
    <div className="space-y-4">
      <SearchProvider>
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">🔍 Busca com Histórico</h3>
          <SearchBarWithHistory
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </Card>

        {!hasSearched && (
          <Card padding="md">
            <h4 className="font-medium text-brand-ink mb-3">🔥 Tendências</h4>
            <SearchSuggestionsList
              onSelect={(text) => {
                setSearchQuery(text)
                handleSearch(text)
              }}
            />
          </Card>
        )}

        {hasSearched && searchQuery && (
          <SearchEmptyState query={searchQuery} onClear={handleClear} />
        )}

        {history.length > 0 && (
          <Card padding="md">
            <RecentSearchesWidget />
          </Card>
        )}
      </SearchProvider>
    </div>
  )
}