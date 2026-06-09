'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favoriteIds: string[]
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (productId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(productId)
            ? state.favoriteIds
            : [...state.favoriteIds, productId]
        })),

      removeFavorite: (productId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== productId)
        })),

      toggleFavorite: (productId) => {
        const { favoriteIds } = get()
        if (favoriteIds.includes(productId)) {
          get().removeFavorite(productId)
        } else {
          get().addFavorite(productId)
        }
      },

      isFavorite: (productId) => get().favoriteIds.includes(productId),

      clearFavorites: () => set({ favoriteIds: [] })
    }),
    {
      name: 'feirinha-favorites'
    }
  )
)

// Hook helper para usar no ProductCard
export function useFavorite(productId: string) {
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  return {
    isFavorite: isFavorite(productId),
    toggleFavorite: () => toggleFavorite(productId)
  }
}