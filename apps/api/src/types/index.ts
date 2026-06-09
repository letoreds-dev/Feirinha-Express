// Arquivo de declaração de tipos para o Fastify
// Este arquivo deve ser importado antes de qualquer uso do Fastify

import 'fastify'

// Usuário autenticado (do JWT)
export interface AuthUser {
  id: string
  email: string
  type: 'customer' | 'merchant' | 'driver' | 'admin'
}

// Payload do JWT
export interface JwtPayload {
  id: string
  email: string
  type: 'customer' | 'merchant' | 'driver' | 'admin'
}

// Extensão do FastifyRequest para incluir usuário autenticado
declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser
  }

  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}

// Extensão do JWT para tipar o payload
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload
    user: AuthUser
  }
}

// Tipos body para cada rota
export interface CreateWalletBody {
  amount: number
  pixKey?: string
  pixBank?: string
}

export interface UpdateLocationBody {
  lat: number
  lng: number
}

export interface UpdateDriverStatusBody {
  status: 'available' | 'busy' | 'offline'
  lat?: number
  lng?: number
}

export interface CreateCouponBody {
  code: string
  title: string
  description?: string
  type: 'percentage' | 'fixed' | 'free_delivery' | 'first_order'
  value: number
  minOrderValue?: number
  maxDiscount?: number
  merchantId?: string
  maxUses?: number
  maxPerUser?: number
  expiresAt: string
}

export interface CreateReviewBody {
  rating: number
  comment?: string
  productId?: string
  orderId: string
  foodRating?: number
  deliveryRating?: number
  isAnonymous?: boolean
}

export interface CreateAddressBody {
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state?: string
  zipCode: string
  lat?: number
  lng?: number
  isDefault?: boolean
  instructions?: string
}

export interface UpdateAddressBody extends Partial<CreateAddressBody> {}

export interface CreateDeviceTokenBody {
  token: string
  platform: 'android' | 'ios' | 'web'
}

export interface CreateNotificationBody {
  userId: string
  type: 'order' | 'promo' | 'loyalty' | 'system' | 'chat'
  title: string
  body: string
  data?: Record<string, unknown>
}

export interface CreateProductBody {
  title: string
  description?: string
  price: number
  originalPrice?: number
  thumb?: string
  images?: string[]
  category: string
  tags?: string[]
  options?: string
  active?: boolean
  inStock?: boolean
  stockQty?: number
  preparationTime?: number
  calories?: number
}

export interface UpdateProductBody extends Partial<CreateProductBody> {}

export interface CreateOrderBody {
  merchantId: string
  addressId: string
  items: Array<{
    productId: string
    quantity: number
    options?: string
  }>
  paymentMethod: 'pix' | 'credit' | 'debit' | 'money'
  couponId?: string
  notes?: string
  scheduledAt?: string
}

export interface CreateReferralBody {
  code: string
}

export interface RedeemRewardBody {
  rewardId: string
}

export interface AddLoyaltyPointsBody {
  orderId: string
  points: number
}

export interface ToggleFavoriteBody {
  productId: string
}

export interface CreateStoreBody {
  storeName: string
  storeType: string
  storeDescription?: string
  logo?: string
}

export interface CreateCategoryBody {
  name: string
  slug: string
  icon: string
  image?: string
  color?: string
  sortOrder?: number
}

export interface UpdateCategoryBody extends Partial<CreateCategoryBody> {
  isActive?: boolean
}

export interface CreateChatMessageBody {
  type?: 'text' | 'image' | 'location' | 'system'
  content: string
  locationLat?: number
  locationLng?: number
}

export interface CreateChatConversationBody {
  type?: 'support' | 'order' | 'driver'
  orderId?: string
  merchantId?: string
  driverId?: string
}

export interface SearchQuery {
  q?: string
  category?: string
  storeId?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating'
}

export interface CreateSearchHistoryBody {
  query: string
  resultsCount?: number
}
