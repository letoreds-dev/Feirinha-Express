import { z } from 'zod'

/**
 * Schemas Zod para validação robusta de dados
 * Usados em formulários e validação de entrada na API
 */

// Auth
export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido')

export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve ter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve ter pelo menos um número')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória')
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  type: z.enum(['customer', 'merchant'])
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

export const registerMerchantSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  type: z.enum(['customer', 'merchant']),
  storeName: z.string().min(2, 'Nome da loja é obrigatório'),
  storeType: z.string().min(1, 'Tipo da loja é obrigatório'),
  storeDescription: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

// Product
export const productSchema = z.object({
  title: z.string().min(2, 'Título é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  thumb: z.string().optional(),
  storeId: z.string()
})

// Order
export const addressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
})

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  quantity: z.number().int().positive().max(99, 'Máximo 99 unidades')
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Adicione pelo menos um item').max(20, 'Máximo 20 itens'),
  deliveryAddress: addressSchema,
  paymentMethod: z.enum(['pix', 'credit', 'debit'])
})

// Store
export const createStoreSchema = z.object({
  storeName: z.string().min(2, 'Nome da loja é obrigatório'),
  storeType: z.string().min(1, 'Tipo é obrigatório'),
  storeDescription: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  logo: z.string().optional()
})

// Profile
export const updateProfileSchema = z.object({
  name: z.string().min(2),
  email: emailSchema
})

// Review
export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500, 'Comentário muito longo').optional()
})

// Search
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  storeId: z.string().optional()
})

// Helper para formatar erros do Zod
export function formatZodError(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    if (!errors[path]) {
      errors[path] = err.message
    }
  })
  return errors
}

// Helper para validar dados
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

// Máscaras
export const masks = {
  cpf: (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1'),

  phone: (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2'),

  zipCode: (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
}