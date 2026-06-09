import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { asyncHandler, ApiError } from '../lib/errors'
import { getCache, setCache, invalidateCache } from '../lib/cache'
import { CreateStoreBody } from '../types'

export default async function storeRoutes(fastify: FastifyInstance) {
  // Listar todas as lojas (com cache)
  fastify.get('/', asyncHandler(async (request, reply) => {
    const cacheKey = 'stores:list'

    // Verifica cache primeiro
    const cached = await getCache(fastify, cacheKey)
    if (cached) {
      return reply.header('X-Cache', 'HIT').send({ stores: cached, fromCache: true })
    }

    // Busca do banco
    const stores = await prisma.merchant.findMany({
      where: { status: 'active' },
      include: {
        user: {
          select: { name: true },
        },
        products: {
          where: { active: true },
        },
      },
    })

    // Salva no cache por 5 minutos
    await setCache(fastify, cacheKey, stores, { ttl: 300 })

    return reply.header('X-Cache', 'MISS').send({ stores, fromCache: false })
  }))

  // Buscar loja por ID (com cache)
  fastify.get('/:id', asyncHandler(async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const cacheKey = `store:${id}`

    // Verifica cache primeiro
    const cached = await getCache(fastify, cacheKey)
    if (cached) {
      return reply.header('X-Cache', 'HIT').send({ store: cached, fromCache: true })
    }

    // Busca do banco
    const store = await prisma.merchant.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        products: { where: { active: true } },
      },
    })

    if (!store) {
      throw new ApiError(404, 'Loja não encontrada', 'STORE_NOT_FOUND')
    }

    // Salva no cache por 5 minutos
    await setCache(fastify, cacheKey, store, { ttl: 300 })

    return reply.header('X-Cache', 'MISS').send({ store, fromCache: false })
  }))

  // Criar loja (apenas admins ou merchants)
  fastify.post<{ Body: CreateStoreBody }>('/', {
    preHandler: [fastify.authenticate],
  }, asyncHandler(async (request: FastifyRequest<{ Body: CreateStoreBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { storeName, storeType, storeDescription, logo } = request.body

    const merchant = await prisma.merchant.create({
      data: {
        userId,
        storeName,
        storeType,
        storeDescription,
        logo,
        status: 'pending',
      },
    })

    // Invalida cache de lojas
    await invalidateCache(fastify, 'stores:*')

    return reply.status(201).send({ merchant })
  }))
}
