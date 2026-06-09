'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Button, Badge, NavBar, BottomNav } from '@/components/ui'
import { toast } from '@/components/ui/toast'

// Recent searches
const recentSearches = [
  'Camisa Brasil',
  'Capinha iPhone',
  'Controle PS5',
  'Fone Bluetooth',
]

// Popular searches
const popularSearches = [
  { term: 'Camisa de time', icon: '⚽' },
  { term: 'Capinha celular', icon: '📱' },
  { term: 'Jogos', icon: '🎮' },
  { term: 'Carregador', icon: '🔌' },
  { term: 'Fone', icon: '🎧' },
  { term: 'Mouse', icon: '🖱️' },
]

// Search results
const searchResults = [
  { id: '1', name: 'Camisa Brasil retrô 2024', store: 'Fanaticos FC', price: 129.90, emoji: '👕', tag: 'Novo' },
  { id: '2', name: 'Camisa Palmeiras Home', store: 'Fanaticos FC', price: 149.90, emoji: '👕', tag: null },
  { id: '3', name: 'Camisa Corinthians Away', store: 'Fanaticos FC', price: 139.90, emoji: '👕', tag: 'Promo' },
  { id: '4', name: 'Camisa São Paulo III', store: 'Fanaticos FC', price: 159.90, emoji: '👕', tag: null },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof searchResults>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Simulate search
  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true)
      setShowResults(true)
      const timer = setTimeout(() => {
        setResults(searchResults.filter(r =>
          r.name.toLowerCase().includes(query.toLowerCase())
        ))
        setIsSearching(false)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query])

  const handleSearch = (term: string) => {
    setQuery(term)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-24">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user/home" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos, lojas..."
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-brand-line bg-white focus:border-brand-red focus:outline-none"
              autoFocus
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
              🔍
            </span>
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </NavBar>

      <div className="px-4 py-4 max-w-[390px] mx-auto space-y-4">
        {/* Search Results */}
        {showResults ? (
          <>
            {isSearching ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-brand-muted">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-sm text-brand-muted">{results.length} resultados para "{query}"</p>
                <div className="space-y-3">
                  {results.map(product => (
                    <Link key={product.id} href={`/user/product/${product.id}`}>
                      <Card padding="md" className="hover:bg-brand-soft transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl bg-brand-soft flex items-center justify-center text-3xl">
                            {product.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-brand-ink">{product.name}</p>
                              {product.tag && (
                                <Badge
                                  variant={product.tag === 'Promo' ? 'warning' : 'info'}
                                  className="text-xs"
                                >
                                  {product.tag}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-brand-muted">{product.store}</p>
                            <p className="font-extrabold text-brand-red">
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Card padding="md" className="text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-bold text-brand-ink">Nenhum resultado</p>
                <p className="text-sm text-brand-muted mt-1">
                  Tente buscar por outro termo
                </p>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-brand-ink">🔄 Buscas recentes</h3>
                  <button className="text-xs text-brand-red hover:underline">
                    Limpar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-4 py-2 bg-white border border-brand-line rounded-full text-sm text-brand-ink hover:bg-brand-soft transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h3 className="font-bold text-brand-ink mb-3">🔥 Mais buscados</h3>
              <div className="grid grid-cols-2 gap-2">
                {popularSearches.map(item => (
                  <button
                    key={item.term}
                    onClick={() => handleSearch(item.term)}
                    className="flex items-center gap-3 p-3 bg-white border border-brand-line rounded-xl hover:bg-brand-soft transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium text-brand-ink">{item.term}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-brand-ink mb-3">📂 Categorias</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Times', emoji: '⚽', color: 'bg-red-100' },
                  { name: 'Celular', emoji: '📱', color: 'bg-blue-100' },
                  { name: 'Gamer', emoji: '🎮', color: 'bg-purple-100' },
                  { name: 'Eletrônicos', emoji: '🔌', color: 'bg-orange-100' },
                ].map(cat => (
                  <Link
                    key={cat.name}
                    href={`/user/categories/${cat.name.toLowerCase()}`}
                    className="text-center"
                  >
                    <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-1`}>
                      {cat.emoji}
                    </div>
                    <span className="text-xs font-medium text-brand-ink">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Promotions Banner */}
            <Link href="/user/promotions">
              <Card padding="md" className="bg-gradient-to-r from-brand-red to-red-600 text-white">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🎉</span>
                  <div>
                    <p className="font-bold text-lg">Ofertas do dia</p>
                    <p className="text-sm opacity-80">Até 50% OFF</p>
                  </div>
                  <span className="ml-auto">→</span>
                </div>
              </Card>
            </Link>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}