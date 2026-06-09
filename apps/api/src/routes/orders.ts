import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { z } from 'zod'
import { asyncHandler, ApiError } from '../lib/errors'

// Order schemas
const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
})

const orderItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().max(99),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1).max(20),
  deliveryAddress: addressSchema,
  paymentMethod: z.enum(['pix', 'credit', 'debit']),
})

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'separating', 'ready', 'delivered', 'cancelled']),
})

export default async function orderRoutes(fastify: FastifyInstance) {
  // Listar pedidos do usuário - 30 requests por minuto
  fastify.get('/', {
    preHandler: [fastify.authenticate],
    config: {
      rateLimit: {
        max: 30,
        timeWindow: '1 minute',
      },
    },
  }, asyncHandler(async (request: FastifyRequest) => {
    const userId = request.user.id
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: { include: { product: true } },
        merchant: { select: { storeName: true, logo: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return { orders }
  }))

  // Buscar pedido por ID
  fastify.get('/:id', asyncHandler(async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const order = await prisma.order.findUnique({
      where: { id: request.params.id },
      include: {
        items: { include: { product: true } },
        merchant: true,
        customer: { select: { name: true, email: true } },
      },
    })

    if (!order) {
      throw new ApiError(404, 'Pedido não encontrado', 'ORDER_NOT_FOUND')
    }

    return { order }
  }))

  // Criar pedido - 10 requests por minuto (prevenir spam)
  fastify.post('/', {
    preHandler: [fastify.authenticate],
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createOrderSchema.parse(request.body)
    const userId = request.user.id

    // Primeiro, criar ou encontrar endereço
    const address = await prisma.address.create({
      data: {
        userId,
        label: 'Entrega',
        street: body.deliveryAddress.street,
        number: body.deliveryAddress.number,
        neighborhood: body.deliveryAddress.neighborhood,
        city: body.deliveryAddress.city,
        zipCode: body.deliveryAddress.zipCode,
        isDefault: true,
      },
    })

    // Calcular total e buscar primeiro produto
    let total = 0
    let merchantId = 'demo-merchant-id'
    const itemsWithPrices = await Promise.all(
      body.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        })
        if (product) {
          total += product.price * item.quantity
          merchantId = product.merchantId
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          priceAtMoment: product?.price || 0,
          merchantId,
        }
      })
    )

    const order = await prisma.order.create({
      data: {
        customerId: userId,
        merchantId,
        addressId: address.id,
        total,
        status: 'pending',
        paymentMethod: body.paymentMethod,
        subtotal: total,
        deliveryFee: 5.90,
        items: {
          create: itemsWithPrices,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    })

    return reply.status(201).send({ order })
  }))

  // Atualizar status do pedido
  fastify.patch('/:id/status', {
    preHandler: [fastify.authenticate],
  }, asyncHandler(async (request: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) => {
    const { status } = updateOrderStatusSchema.parse(request.body)

    const order = await prisma.order.update({
      where: { id: request.params.id },
      data: { status },
    })

    return { order }
  }))
}
