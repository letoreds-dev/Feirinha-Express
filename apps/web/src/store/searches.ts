'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchStore {
  recentSearches: string[]
  addSearch: (query: string) => void
  removeSearch: (query: string) => void
  clearSearches: () => void
}

export const useSearchStore = create<SearchStore>()(
 persist(
    (set, get) => ({
      recentSearches: [],

      addSearch: (query) => {
        const trimmed = query.trim()
        if (!trimmed) return

        set((state) => ({
          recentSearches: [
            trimmed,
            ...state.recentSearches.filter((s) => s !== trimmed),
          ].slice(0, 10), // Keep last 10
        }))
      },

      removeSearch: (query) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        }))
      },

      clearSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'feirinha-searches' }
  )
)

// Alias para compatibilidade
export const useRecentSearches = useSearchStore