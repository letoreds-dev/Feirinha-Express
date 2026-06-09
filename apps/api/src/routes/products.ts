import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { z } from 'zod'
import { asyncHandler, ApiError } from '../lib/errors'
import { getCache, setCache, invalidateCache } from '../lib/cache'

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
  thumb: z.string().optional(),
  storeId: z.string(),
})

export default async function productRoutes(fastify: FastifyInstance) {
  // Listar produtos (com filtros e cache)
  fastify.get('/', asyncHandler(async (request: FastifyRequest<{ Querystring: { storeId?: string; search?: string } }>, reply: FastifyReply) => {
    const { storeId, search } = request.query

    // Cache key baseado nos filtros
    const cacheKey = search
      ? `products:search:${search}`
      : storeId
        ? `products:store:${storeId}`
        : 'products:all'

    // Verifica cache
    const cached = await getCache(fastify, cacheKey)
    if (cached) {
      return reply.header('X-Cache', 'HIT').send({ products: cached, fromCache: true })
    }

    const where: { active: boolean; merchantId?: string; OR?: Array<{ title?: { contains: string }; description?: { contains: string } }> } = { active: true }

    if (storeId) {
      where.merchantId = storeId
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: { merchant: { select: { storeName: true, logo: true } } },
      orderBy: { createdAt: 'desc' },
    })

    // Cache por 2 minutos
    await setCache(fastify, cacheKey, products, { ttl: 120 })

    return reply.header('X-Cache', 'MISS').send({ products, fromCache: false })
  }))

  // Buscar produto por ID (com cache)
  fastify.get('/:id', asyncHandler(async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const cacheKey = `product:${id}`

    // Verifica cache
    const cached = await getCache(fastify, cacheKey)
    if (cached) {
      return reply.header('X-Cache', 'HIT').send({ product: cached, fromCache: true })
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { merchant: true },
    })

    if (!product) {
      throw new ApiError(404, 'Produto não encontrado', 'PRODUCT_NOT_FOUND')
    }

    // Cache por 5 minutos
    await setCache(fastify, cacheKey, product, { ttl: 300 })

    return reply.header('X-Cache', 'MISS').send({ product, fromCache: false })
  }))

  // Criar produto
  fastify.post<{ Body: { title: string; description?: string; price: number; category: string; thumb?: string; storeId: string } }>('/', {
    preHandler: [fastify.authenticate],
  }, asyncHandler(async (request: FastifyRequest<{ Body: { title: string; description?: string; price: number; category: string; thumb?: string; storeId: string } }>, reply: FastifyReply) => {
    const body = productSchema.parse(request.body)

    // Verificar se é merchant dono da loja
    const merchant = await prisma.merchant.findUnique({
      where: { id: body.storeId },
    })

    if (!merchant || merchant.userId !== request.user.id) {
      throw new ApiError(403, 'Não autorizado', 'FORBIDDEN')
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        category: body.category,
        thumb: body.thumb,
        merchantId: body.storeId,
      },
      include: { merchant: true },
    })

    // Invalida cache relacionado
    await invalidateCache(fastify, 'products:*')
    await invalidateCache(fastify, `products:store:${body.storeId}`)
    await invalidateCache(fastify, 'stores:*')
    await invalidateCache(fastify, `store:${body.storeId}`)

    return reply.status(201).send({ product })
  }))

  // Atualizar produto
  fastify.put('/:id', {
    preHandler: [fastify.authenticate],
  }, asyncHandler(async (request: FastifyRequest<{ Params: { id: string }; Body: Record<string, unknown> }>, reply: FastifyReply) => {
    const productId = request.params.id
    const updateData = request.body

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true },
    })

    if (!product) {
      throw new ApiError(404, 'Produto não encontrado', 'PRODUCT_NOT_FOUND')
    }

    if (product.merchant.userId !== request.user.id) {
      throw new ApiError(403, 'Não autorizado', 'FORBIDDEN')
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: updateData as { title?: string; description?: string; price?: number; active?: boolean },
      include: { merchant: true },
    })

    // Invalida cache do produto e da loja
    await invalidateCache(fastify, `product:${productId}`)
    await invalidateCache(fastify, `products:store:${product.merchantId}`)
    await invalidateCache(fastify, `store:${product.merchantId}`)

    return { product: updated }
  }))
}
