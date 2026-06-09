// Analytics para Next.js
'use client'

// Variáveis globais do GA4
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// ID do GA4 (configurado em .env.local)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

/**
 * Rastreia visualização de página
 */
export function pageview(url: string) {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_location: window.location.href,
    })
  }
}

/**
 * Rastreia evento genérico
 */
export function event(action: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params)
  }
}

/**
 * Rastreia início de sessão
 */
export function identify(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('set', { user_id: userId })
    if (traits) {
      window.gtag('set', { user_properties: traits })
    }
  }
}

/**
 * Rastreia logout
 */
export function logout() {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('set', { user_id: undefined })
  }
}

// Eventos customizados para e-commerce
export const events = {
  /**
   * Visualização de produto
   */
  viewItem: (product: { id: string; name: string; price: number; category?: string }) => {
    event('view_item', {
      currency: 'BRL',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category || 'Sem categoria',
      }]
    })
  },

  /**
   * Visualização de lista de produtos
   */
  viewItemList: (listName: string, items: Array<{ id: string; name: string; price: number }>) => {
    event('view_item_list', {
      item_list_name: listName,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
      }))
    })
  },

  /**
   * Seleção de item em lista
   */
  selectItem: (item: { id: string; name: string; price: number }, listName: string) => {
    event('select_item', {
      item_list_name: listName,
      items: [{
        item_id: item.id,
        item_name: item.name,
        price: item.price,
      }]
    })
  },

  /**
   * Adicionar ao carrinho
   */
  addToCart: (product: { id: string; name: string; price: number; quantity?: number }) => {
    event('add_to_cart', {
      currency: 'BRL',
      value: product.price * (product.quantity || 1),
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
      }]
    })
  },

  /**
   * Remover do carrinho
   */
  removeFromCart: (product: { id: string; name: string; price: number }) => {
    event('remove_from_cart', {
      currency: 'BRL',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      }]
    })
  },

  /**
   * Iniciar checkout
   */
  beginCheckout: (cartValue: number, items: number) => {
    event('begin_checkout', {
      currency: 'BRL',
      value: cartValue,
      items_count: items,
    })
  },

  /**
   * Adicionar informações de pagamento
   */
  addPaymentInfo: (paymentMethod: string, cartValue: number) => {
    event('add_payment_info', {
      currency: 'BRL',
      value: cartValue,
      payment_type: paymentMethod,
    })
  },

  /**
   * Adicionar informações de envio
   */
  addShippingInfo: (shippingMethod: string, cartValue: number) => {
    event('add_shipping_info', {
      currency: 'BRL',
      value: cartValue,
      shipping_tier: shippingMethod,
    })
  },

  /**
   * Finalizar compra (purchase)
   */
  purchase: (order: {
    id: string
    total: number
    tax?: number
    shipping?: number
    items: Array<{ id: string; name: string; price: number; quantity: number }>
  }) => {
    event('purchase', {
      transaction_id: order.id,
      currency: 'BRL',
      value: order.total,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
    })
  },

  /**
   * Busca realizada
   */
  search: (query: string, results: number) => {
    event('search', {
      search_term: query,
      results_count: results,
    })
  },

  /**
   * Compartilhamento
   */
  share: (contentType: string, itemId: string, method: string) => {
    event('share', {
      content_type: contentType,
      item_id: itemId,
      method: method,
    })
  },

  /**
   * Cadastro
   */
  signUp: (method: 'email' | 'phone' | 'google' | 'apple') => {
    event('sign_up', {
      method: method,
    })
  },

  /**
   * Login
   */
  login: (method: 'email' | 'phone' | 'google' | 'apple') => {
    event('login', {
      method: method,
    })
  },
}

// Exportar tipos para uso em outros arquivos
export type Product = { id: string; name: string; price: number; category?: string }
export type CartItem = { id: string; name: string; price: number; quantity: number }
export type Order = {
  id: string
  total: number
  tax?: number
  shipping?: number
  items: CartItem[]
}