import api from './client'

export interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export interface OrderItem {
  productId: string
  productTitle: string
  quantity: number
  priceAtMoment: number
  options?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  paymentMethod: 'pix' | 'credit' | 'debit'
  paymentStatus: 'pending' | 'confirmed' | 'failed' | 'refunded'
  address: Address
  storeName: string
  estimatedTime?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderPayload {
  items: {
    productId: string
    quantity: number
    options?: string
    notes?: string
  }[]
  addressId: string
  paymentMethod: 'pix' | 'credit' | 'debit'
  couponCode?: string
  notes?: string
  scheduledAt?: string
}

export interface PixPayment {
  code: string
  qrCode: string
  expiration: string
}

// Orders
export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get('/api/orders')
  return data
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await api.get(`/api/orders/${id}`)
  return data
}

export async function createOrder(payload: CreateOrderPayload): Promise<{ order: Order; pix?: PixPayment }> {
  const { data } = await api.post('/api/orders', payload)
  return data
}

export async function cancelOrder(id: string): Promise<Order> {
  const { data } = await api.patch(`/api/orders/${id}/cancel`)
  return data
}

// Addresses
export async function getAddresses(): Promise<Address[]> {
  const { data } = await api.get('/api/addresses')
  return data
}

export async function getDefaultAddress(): Promise<Address | null> {
  const addresses = await getAddresses()
  return addresses.find(a => a.isDefault) || addresses[0] || null
}

export async function createAddress(address: Omit<Address, 'id'>): Promise<Address> {
  const { data } = await api.post('/api/addresses', address)
  return data
}

export async function updateAddress(id: string, address: Partial<Address>): Promise<Address> {
  const { data } = await api.patch(`/api/addresses/${id}`, address)
  return data
}

export async function deleteAddress(id: string): Promise<void> {
  await api.delete(`/api/addresses/${id}`)
}

// Order Status Labels
export const ORDER_STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivering: 'Em entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

export const ORDER_STATUS_ICONS: Record<Order['status'], string> = {
  pending: '⏳',
  confirmed: '✅',
  preparing: '👨‍🍳',
  ready: '📦',
  delivering: '🛵',
  delivered: '🎉',
  cancelled: '❌',
}