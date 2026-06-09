'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Input } from '@/components/ui'

// ============================================
// RECENT SEARCHES
// ============================================
// Histórico de buscas com sugestões
// ============================================

const MAX_RECENT_SEARCHES = 10

export interface RecentSearch {
  id: string
  query: string
  timestamp: number
  resultCount?: number
}

// Storage key
const STORAGE_KEY = 'feirinha_recent_searches'

// Get recent searches from localStorage
export function getRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save recent search
export function saveRecentSearch(query: string, resultCount?: number): void {
  if (typeof window === 'undefined' || !query.trim()) return

  const searches = getRecentSearches()
  const newSearch: RecentSearch = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    query: query.trim(),
    timestamp: Date.now(),
    resultCount,
  }

  // Remove duplicate if exists
  const filtered = searches.filter(s => s.query.toLowerCase() !== query.toLowerCase())

  // Add new search at the beginning
  const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// Clear all recent searches
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

// Delete single search
export function deleteRecentSearch(id: string): void {
  if (typeof window === 'undefined') return
  const searches = getRecentSearches()
  const updated = searches.filter(s => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// ============================================
// TYPEWRITER SUGGESTION
// ============================================

export function TypewriterSuggestion({
  suggestions,
  onSelect,
  activeIndex,
}: {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  activeIndex: number
}) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (suggestions.length === 0) return

    const current = suggestions[currentIndex]

    intervalRef.current = setInterval(() => {
      if (!isDeleting) {
        // Typing
        if (charIndex < current.length) {
          setDisplayText(current.substring(0, charIndex + 1))
          setCharIndex(c => c + 1)
        } else {
          // Pause then start deleting
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setDisplayText(current.substring(0, charIndex - 1))
          setCharIndex(c => c - 1)
        } else {
          // Move to next suggestion
          setIsDeleting(false)
          setCurrentIndex(i => (i + 1) % suggestions.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearInterval(intervalRef.current)
  }, [suggestions, currentIndex, charIndex, isDeleting])

  if (suggestions.length === 0) return null

  return (
    <div className="px-4 py-3 bg-brand-soft rounded-xl">
      <p className="text-xs text-brand-muted mb-1">Sugestões:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all
              ${index === activeIndex || index === currentIndex
                ? 'bg-brand-red text-white'
                : 'bg-white text-brand-ink hover:bg-brand-red/10'
              }
            `}
          >
            {suggestion}
          </button>
        ))}
      </div>
      <p className="text-xs text-brand-muted mt-2">
        💡 <span className="font-mono">{displayText}</span>
      </p>
    </div>
  )
}

// ============================================
// RECENT SEARCHES WIDGET
// ============================================

export function RecentSearches({
  onSearch,
  maxItems = 5,
  showClearAll = true,
}: {
  onSearch: (query: string) => void
  maxItems?: number
  showClearAll?: boolean
}) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  const handleDelete = (id: string) => {
    setDeleting(id)
    setTimeout(() => {
      deleteRecentSearch(id)
      setRecentSearches(getRecentSearches())
      setDeleting(null)
    }, 200)
  }

  const handleClearAll = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'agora'
    if (minutes < 60) return `${minutes}min`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  if (recentSearches.length === 0) {
    return (
      <div className="text-center py-6">
        <span className="text-4xl">🔍</span>
        <p className="text-brand-muted mt-2">Nenhuma busca recente</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-brand-ink">🕐 Buscas recentes</h4>
        {showClearAll && recentSearches.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-brand-muted hover:text-brand-red transition-colors"
          >
            Limpar tudo
          </button>
        )}
      </div>

      <div className="space-y-1">
        {recentSearches.slice(0, maxItems).map(search => (
          <div
            key={search.id}
            className={`
              flex items-center gap-3 p-2 rounded-lg cursor-pointer
              hover:bg-brand-soft transition-all duration-200
              ${deleting === search.id ? 'opacity-0 scale-95' : ''}
            `}
            onClick={() => onSearch(search.query)}
          >
            <span className="text-brand-muted">🔍</span>
            <span className="flex-1 text-sm font-medium text-brand-ink">
              {search.query}
            </span>
            <span className="text-xs text-brand-muted">
              {formatTime(search.timestamp)}
            </span>
            {search.resultCount !== undefined && (
              <span className="text-xs bg-brand-soft px-2 py-0.5 rounded-full text-brand-muted">
                {search.resultCount} resultados
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(search.id)
              }}
              className="text-brand-muted hover:text-brand-red transition-colors p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// SEARCH BAR WITH HISTORY
// ============================================

export function SearchBarWithHistory({
  onSearch,
  placeholder = 'Buscar produtos...',
  autoFocus = false,
}: {
  onSearch: (query: string) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  const [query, setQuery] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [suggestions] = useState([
    'X-Burger', 'Pizza', 'Açaí', 'Sushi', 'Cachorro quente',
    'Pastel', 'Tapioca', 'Café', 'Sorvete', 'Brigadeiro'
  ])
  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [showHistory])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return

    saveRecentSearch(query)
    onSearch(query)
    setShowHistory(false)
    setQuery('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    saveRecentSearch(suggestion)
    onSearch(suggestion)
    setShowHistory(false)
  }

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion(i => Math.min(i + 1, filteredSuggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredSuggestions[activeSuggestion]) {
        handleSuggestionClick(filteredSuggestions[activeSuggestion])
      } else {
        handleSubmit()
      }
    } else if (e.key === 'Escape') {
      setShowHistory(false)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveSuggestion(0)
            }}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-soft text-brand-ink placeholder:text-brand-muted/50 text-base focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-brand-line z-20 overflow-hidden">
          {/* Suggestions */}
          {query && filteredSuggestions.length > 0 && (
            <div className="p-2 border-b border-brand-line">
              <p className="text-xs text-brand-muted px-2 mb-1">Sugestões</p>
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm
                    ${index === activeSuggestion ? 'bg-brand-red text-white' : 'hover:bg-brand-soft'}
                  `}
                >
                  🔍 {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          <div className="p-2">
            <RecentSearches
              onSearch={(q) => {
                setQuery(q)
                handleSuggestionClick(q)
              }}
              maxItems={5}
              showClearAll={true}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// SEARCH SUGGESTIONS COMPONENT
// ============================================

export function SearchSuggestions({
  suggestions,
  onSelect,
}: {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}) {
  if (suggestions.length === 0) return null

  return (
    <div className="p-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-brand-soft flex items-center gap-2"
        >
          <span className="text-brand-muted">🔍</span>
          <span>{suggestion}</span>
        </button>
      ))}
    </div>
  )
}

// ============================================
// DEMO PAGE
// ============================================

export default function RecentSearchesDemo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Simulate search
    const results = [
      `${query} especial`,
      `${query} completo`,
      `Combo ${query}`,
      `${query} artesanal`,
      `${query} caseiro`,
    ]
    setSearchResults(results)
  }

  const trendingSearches = [
    { term: '🍔 Lanches', count: 234 },
    { term: '🍕 Pizza', count: 189 },
    { term: '🍜 Massas', count: 156 },
    { term: '🥤 Bebidas', count: 143 },
    { term: '🍰 Sobremesas', count: 98 },
  ]

  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-line sticky top-0 z-10">
        <div className="max-w-[390px] mx-auto p-4">
          <h1 className="text-lg font-extrabold text-brand-ink">🔍 Recent Searches</h1>
          <p className="text-sm text-brand-muted">Histórico e sugestões</p>
        </div>
      </div>

      <div className="max-w-[390px] mx-auto p-4 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Search Bar com Histórico
          </div>
          <div className="p-4">
            <SearchBarWithHistory
              onSearch={handleSearch}
              placeholder="O que você quer comer?"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
            <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
              Resultados para "{searchQuery}"
            </div>
            <div className="p-4 space-y-2">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 bg-brand-soft rounded-xl flex items-center gap-3"
                >
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <p className="font-bold">{result}</p>
                    <p className="text-sm text-brand-muted">R$ {(Math.random() * 30 + 10).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Typewriter Suggestions */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Typewriter Suggestions
          </div>
          <div className="p-4">
            <TypewriterSuggestion
              suggestions={['X-Burger especial', 'Pizza marguerita', 'Sushi combo', 'Açaí natural']}
              onSelect={handleSearch}
              activeIndex={0}
            />
          </div>
        </div>

        {/* Recent Searches Widget */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            Recent Searches Widget
          </div>
          <div className="p-4">
            <RecentSearches onSearch={handleSearch} maxItems={5} />
          </div>
        </div>

        {/* Trending Searches */}
        <div className="bg-white rounded-2xl border border-brand-line overflow-hidden">
          <div className="px-4 py-2 bg-brand-soft text-xs font-medium text-brand-muted">
            🔥 Trending Searches
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item.term.replace(/^[^\s]+\s/, ''))}
                  className="px-3 py-2 bg-gradient-to-r from-brand-red/10 to-brand-red/5 rounded-full text-sm hover:scale-105 transition-transform"
                >
                  {item.term}
                  <span className="ml-1 text-xs text-brand-muted">({item.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">💡 Como funciona</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Histórico salvo no localStorage</li>
            <li>• Sugestões com autocomplete</li>
            <li>• Navegação por teclado (↑↓ Enter)</li>
            <li>• Efeito typewriter nas sugestões</li>
            <li>• Busca recentes com timestamp</li>
          </ul>
        </div>
      </div>
    </main>
  )
}