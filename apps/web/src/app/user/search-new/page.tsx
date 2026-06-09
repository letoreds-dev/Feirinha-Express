'use client'

import { useState } from 'react'
import { SearchBarWithHistory } from '@/components/ui/recent-searches'
import { SearchSuggestions, TypewriterSuggestion } from '@/components/ui/recent-searches'
import { ProductCard } from '@/components/ui/product-card'
import { StoreCard } from '@/components/ui/store-card'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'

const popularSearches = ['Hambúrguer', 'Pizza', 'Açaí', 'Sushi', 'Café', 'Sorvete']

const mockResults = {
  products: [
    { id: '1', name: 'Hambúrguer Artesanal', store: 'Burguer House', price: 32.90, rating: 4.8, thumb: '🍔', distance: '1.2km' },
    { id: '2', name: 'X-Bacon', store: 'Burger King', price: 28.90, rating: 4.5, thumb: '🍔', distance: '2.1km' },
    { id: '3', name: 'Pizza Margherita', store: 'Pizza Express', price: 45.90, rating: 4.7, thumb: '🍕', distance: '0.8km' },
    { id: '4', name: 'Açaí 500ml', store: 'Açaí House', price: 22.90, rating: 4.9, thumb: '🍨', distance: '1.5km' },
  ],
  stores: [
    { id: '1', name: 'Burguer House', rating: 4.8, category: 'Hambúrgueres', thumb: '🍔', deliveryTime: '25-35 min', distance: '1.2km' },
    { id: '2', name: 'Pizza Express', rating: 4.7, category: 'Pizza', thumb: '🍕', deliveryTime: '30-40 min', distance: '0.8km' },
    { id: '3', name: 'Açaí House', rating: 4.9, category: 'Açaí', thumb: '🍨', deliveryTime: '20-30 min', distance: '1.5km' },
  ],
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof mockResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'stores'>('all')

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (!searchQuery.trim()) {
      setResults(null)
      return
    }

    setIsSearching(true)
    // Simulate search
    setTimeout(() => {
      setResults(mockResults)
      setIsSearching(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-20">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink w-full text-center">🔍 Buscar</h1>
      </NavBar>

      <div className="px-4 py-4 max-w-[390px] mx-auto">
        {/* Search bar */}
        <SearchBarWithHistory
          onSearch={handleSearch}
          placeholder="Buscar lojas, produtos..."
          autoFocus
        />

        {/* Typewriter suggestions */}
        <div className="mt-4 text-center">
          <p className="text-sm text-brand-muted mb-2">Sugestões do momento:</p>
          <TypewriterSuggestion
            suggestions={popularSearches}
            onSelect={handleSearch}
            activeIndex={-1}
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-4 max-w-[390px] mx-auto">
        {isSearching ? (
          <div className="text-center py-12">
            <div className="text-5xl animate-bounce">🔍</div>
            <p className="text-brand-muted mt-4">Buscando...</p>
          </div>
        ) : results ? (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { key: 'all', label: `Todos (${results.products.length + results.stores.length})` },
                { key: 'products', label: `Produtos (${results.products.length})` },
                { key: 'stores', label: `Lojas (${results.stores.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.key ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-sm text-brand-muted mb-4">
              {results.products.length + results.stores.length} resultados para "{query}"
            </p>

            {/* Products */}
            {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-brand-ink mb-3">🍔 Produtos</h3>
                <div className="space-y-3">
                  {results.products.map(product => (
                    <Card key={product.id} padding="md">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-xl bg-brand-soft flex items-center justify-center text-4xl">
                          {product.thumb}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-brand-ink">{product.name}</p>
                          <p className="text-sm text-brand-muted">{product.store}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-extrabold text-brand-red">
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-brand-muted">⭐ {product.rating}</span>
                              <Badge variant="outline" className="text-xs">{product.distance}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Stores */}
            {(activeTab === 'all' || activeTab === 'stores') && results.stores.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-brand-ink mb-3">🏪 Lojas</h3>
                <div className="space-y-3">
                  {results.stores.map(store => (
                    <Card key={store.id} padding="md">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-brand-red flex items-center justify-center text-3xl text-white font-extrabold">
                          {store.thumb}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-brand-ink">{store.name}</p>
                          <p className="text-sm text-brand-muted">{store.category}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm">⭐ {store.rating}</span>
                            <span className="text-sm text-brand-muted">🛵 {store.deliveryTime}</span>
                            <Badge variant="outline" className="text-xs">{store.distance}</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {results.products.length === 0 && results.stores.length === 0 && (
              <div className="text-center py-12">
                <p className="text-5xl mb-4">😕</p>
                <h3 className="text-lg font-bold text-brand-ink mb-2">Nenhum resultado</h3>
                <p className="text-brand-muted mb-6">
                  Não encontramos resultados para "{query}"
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-brand-muted">Sugestões:</p>
                  <SearchSuggestions suggestions={popularSearches} onSelect={handleSearch} />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Initial state - suggestions */}
            <SearchSuggestions suggestions={popularSearches} onSelect={handleSearch} />

            {/* Popular searches */}
            <div className="mt-6">
              <h3 className="font-bold text-brand-ink mb-3">🔥 Mais buscados</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(search => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="px-4 py-2 bg-brand-soft rounded-full text-sm font-medium text-brand-ink hover:bg-brand-line transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}