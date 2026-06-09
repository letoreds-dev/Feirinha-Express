/**
 * Feirinha Express - Zod Validation Schemas
 * Centralized validation schemas for forms and API responses
 */

import { z } from 'zod'

// ==================== USER SCHEMAS ====================

export const PhoneSchema = z
  .string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .regex(/^\(?[0-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$/, 'Formato de telefone inválido')

export const CPFSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
  .refine((cpf) => {
    // Basic CPF validation
    const digits = cpf.replace(/\D/g, '')
    if (digits.length !== 11) return false
    if (/^(\d)\1{10}$/.test(digits)) return false
    return true
  }, 'CPF inválido')

export const CEPSchema = z
  .string()
  .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')

export const EmailSchema = z
  .string()
  .email('E-mail inválido')
  .min(5, 'E-mail muito curto')
  .max(100, 'E-mail muito longo')

export const PasswordSchema = z
  .string()
  .min(6, 'Senha deve ter pelo menos 6 caracteres')
  .max(50, 'Senha muito longa')

// ==================== AUTH SCHEMAS ====================

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: EmailSchema,
  phone: PhoneSchema,
  password: PasswordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
})

export const ResetPasswordSchema = z.object({
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

// ==================== ADDRESS SCHEMAS ====================

export const AddressSchema = z.object({
  label: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  street: z.string().min(3, 'Endereço muito curto').max(200, 'Endereço muito longo'),
  number: z.string().min(1, 'Número é obrigatório').max(20, 'Número muito longo'),
  complement: z.string().max(100, 'Complemento muito longo').optional(),
  neighborhood: z.string().min(2, 'Bairro muito curto').max(100, 'Bairro muito longo'),
  city: z.string().min(2, 'Cidade muito curta').max(100, 'Cidade muito longa'),
  state: z.string().length(2, 'UF deve ter 2 caracteres').toUpperCase(),
  postalCode: CEPSchema,
  instructions: z.string().max(500, 'Instruções muito longas').optional(),
  isDefault: z.boolean().default(false),
})

// ==================== PRODUCT SCHEMAS ====================

export const ProductSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  description: z.string().max(1000, 'Descrição muito longa'),
  price: z.number().positive('Preço deve ser positivo').max(99999.99, 'Preço muito alto'),
  originalPrice: z.number().positive().max(99999.99).optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  storeId: z.string().uuid('ID da loja inválido'),
  image: z.string().url('URL de imagem inválida').optional(),
  emoji: z.string().optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  tags: z.array(z.string()).default([]),
})

export const ProductExtrasSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
})

export const CartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1, 'Quantidade mínima é 1').max(99, 'Quantidade máxima é 99'),
  extras: z.array(ProductExtrasSchema).default([]),
  observations: z.string().max(500).optional(),
})

// ==================== ORDER SCHEMAS ====================

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  storeId: z.string().uuid(),
  items: z.array(CartItemSchema).min(1, 'Pedido deve ter pelo menos 1 item'),
  address: AddressSchema,
  subtotal: z.number().positive(),
  deliveryFee: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  paymentMethod: z.enum(['pix', 'credit', 'debit', 'ticket', 'money']),
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled']),
  notes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
  scheduledFor: z.date().optional(),
})

export const OrderStatusUpdateSchema = z.object({
  orderId: z.string().uuid(),
  status: OrderSchema.shape.status,
  timestamp: z.date().default(() => new Date()),
  reason: z.string().max(500).optional(),
})

// ==================== STORE SCHEMAS ====================

export const StoreSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  address: AddressSchema.omit({ label: true, isDefault: true }),
  phone: PhoneSchema,
  email: EmailSchema.optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  deliveryFee: z.number().min(0).default(0),
  minOrder: z.number().min(0).default(0),
  deliveryTime: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  isOpen: z.boolean().default(true),
  openingHours: z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
  }).optional(),
  image: z.string().url().optional(),
  emoji: z.string().optional(),
})

// ==================== REVIEW SCHEMAS ====================

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  storeId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  orderId: z.string().uuid(),
  rating: z.number().int().min(1, 'Avaliação mínima é 1 estrela').max(5, 'Avaliação máxima é 5 estrelas'),
  comment: z.string().min(10, 'Comentário muito curto').max(1000, 'Comentário muito longo'),
  foodRating: z.number().int().min(1).max(5).optional(),
  deliveryRating: z.number().int().min(1).max(5).optional(),
  photos: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  helpful: z.number().int().min(0).default(0),
  createdAt: z.date(),
  storeResponse: z.string().max(500).optional(),
})

export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Mínimo 10 caracteres').max(1000),
  foodRating: z.number().int().min(1).max(5).optional(),
  deliveryRating: z.number().int().min(1).max(5).optional(),
  tags: z.array(z.enum(['rapidez', 'qualidade', 'atendimento', 'embalagem', 'sabor'])).default([]),
})

// ==================== PAYMENT SCHEMAS ====================

export const PaymentMethodSchema = z.object({
  type: z.enum(['pix', 'credit', 'debit', 'ticket', 'money']),
  cardId: z.string().optional(),
})

export const CreditCardSchema = z.object({
  number: z.string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, 'Número de cartão inválido')
    .transform(val => val.replace(/\s/g, '')),
  holderName: z.string().min(2, 'Nome muito curto').toUpperCase(),
  expiry: z.string()
    .regex(/^\d{2}\/\d{2}$/, 'Validade inválida (MM/AA)')
    .refine(val => {
      const [month, year] = val.split('/').map(Number)
      const now = new Date()
      const expDate = new Date(2000 + year, month - 1)
      return expDate > now
    }, 'Cartão expirado'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
})

export const CouponSchema = z.object({
  code: z.string().min(3, 'Código muito curto').max(20, 'Código muito longo'),
})

export const ApplyCouponSchema = z.object({
  code: CouponSchema.shape.code,
  orderTotal: z.number().positive(),
})

// ==================== VALIDATION HELPERS ====================

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    return digits.replace(/^(\d{2})(\d)(\d{4})(\d{0,4})$/, '($1) $2 $3-$4')
  }
  return value
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, '$1.$2.$3-$4')
}

export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits.replace(/^(\d{5})(\d{0,3})$/, '$1-$2')
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 2) {
    return digits.slice(0, 2) + '/' + digits.slice(2, 4)
  }
  return digits
}

// ==================== API RESPONSE TYPES ====================

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
  }).optional(),
  meta: z.object({
    timestamp: z.date(),
    version: z.string().optional(),
  }).optional(),
})

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({
  items: z.array(itemSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().min(0),
})

// ==================== EXPORTS ====================

export const validationSchemas = {
  auth: {
    login: LoginSchema,
    register: RegisterSchema,
    forgotPassword: ForgotPasswordSchema,
    resetPassword: ResetPasswordSchema,
  },
  user: {
    phone: PhoneSchema,
    cpf: CPFSchema,
    email: EmailSchema,
  },
  address: AddressSchema,
  product: ProductSchema,
  cartItem: CartItemSchema,
  order: OrderSchema,
  store: StoreSchema,
  review: ReviewSchema,
  createReview: CreateReviewSchema,
  payment: {
    method: PaymentMethodSchema,
    card: CreditCardSchema,
    coupon: CouponSchema,
    applyCoupon: ApplyCouponSchema,
  },
  api: {
    response: ApiResponseSchema,
    paginated: PaginatedResponseSchema,
  },
}

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type AddressInput = z.infer<typeof AddressSchema>
export type ProductInput = z.infer<typeof ProductSchema>
export type CartItemInput = z.infer<typeof CartItemSchema>
export type OrderInput = z.infer<typeof OrderSchema>
export type StoreInput = z.infer<typeof StoreSchema>
export type ReviewInput = z.infer<typeof ReviewSchema>
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>
export type CreditCardInput = z.infer<typeof CreditCardSchema>
export type ApplyCouponInput = z.infer<typeof ApplyCouponSchema>
