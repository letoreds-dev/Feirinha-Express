import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/api/stores'

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  thumb?: string
  emoji?: string
  storeId: string
  storeName: string
  options?: CartItemOption[]
  notes?: string
}

export interface CartItemOption {
  id: string
  name: string
  price: number
}

interface CartStore {
  items: CartItem[]
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void
  addItemWithOptions: (item: Omit<CartItem, 'id'>, options: CartItemOption[], quantity: number, notes?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void

  // Getters
  getSubtotal: () => number
  getDeliveryFee: () => number
  getDiscount: () => number
  getTotal: () => number
  getCount: () => number
  getItemsByStore: () => Map<string, CartItem[]>
  hasItems: () => boolean

  // Checkout
  getCheckoutItems: () => { productId: string; quantity: number; options?: string; notes?: string }[]
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId)

        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          }))
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                ...item,
                id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                quantity,
              },
            ],
          }))
        }
      },

      addItemWithOptions: (item, options, quantity, notes) => {
        const existing = get().items.find((i) => i.productId === item.productId)

        if (existing && JSON.stringify(existing.options) === JSON.stringify(options)) {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          }))
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                ...item,
                id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                quantity,
                options,
                notes,
              },
            ],
          }))
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          }))
        }
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        const items = get().items
        return items.reduce((sum, item) => {
          const optionsTotal = item.options?.reduce((optSum, opt) => optSum + opt.price, 0) || 0
          return sum + (item.price + optionsTotal) * item.quantity
        }, 0)
      },

      getDeliveryFee: () => {
        const items = get().items
        if (items.length === 0) return 0
        // Taxa base + adicional por loja extra
        const uniqueStores = new Set(items.map(i => i.storeId))
        const baseFee = 4.90
        const extraFee = (uniqueStores.size - 1) * 2.90
        return baseFee + extraFee
      },

      getDiscount: () => {
        // Desconto PIX (5%)
        return get().getSubtotal() * 0.05
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee() - get().getDiscount()
      },

      getCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getItemsByStore: () => {
        const items = get().items
        const storeMap = new Map<string, CartItem[]>()

        items.forEach((item) => {
          const storeItems = storeMap.get(item.storeId) || []
          storeItems.push(item)
          storeMap.set(item.storeId, storeItems)
        })

        return storeMap
      },

      hasItems: () => get().items.length > 0,

      getCheckoutItems: () => {
        return get().items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          options: item.options ? JSON.stringify(item.options) : undefined,
          notes: item.notes,
        }))
      },
    }),
    {
      name: 'feirinha-cart',
    }
  )
)

// Helper para adicionar produto ao carrinho
export function addToCart(product: Product, storeName: string, storeId: string, quantity = 1) {
  const store = useCartStore.getState()

  store.addItem({
    productId: product.id,
    title: product.title,
    price: product.price,
    thumb: product.thumb,
    emoji: product.emoji,
    storeId,
    storeName,
  }, quantity)
}