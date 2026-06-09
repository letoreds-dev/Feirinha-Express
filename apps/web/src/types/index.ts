export interface Store {
  id: string
  storeName: string
  storeType: string
  storeDescription: string | null
  logo: string | null
  status: string
  avgSeparationTime: number | null
  products?: Product[]
}

export interface Product {
  id: string
  merchantId: string
  title: string
  description: string | null
  price: number
  thumb: string | null
  active: boolean
  merchant?: Store
}

export interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'separating' | 'ready' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'confirmed' | 'failed' | 'refunded'
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: 'pix' | 'credit' | 'debit'
  deliveryAddress: string
  createdAt: string
  items: OrderItem[]
  customer?: { name: string; email: string }
  merchant?: { storeName: string }
}

export interface OrderItem {
  id: string
  productId: string
  merchantId: string
  quantity: number
  priceAtMoment: number
  product?: Product
}