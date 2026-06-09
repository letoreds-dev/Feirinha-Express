import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { SearchQuery, CreateSearchHistoryBody } from '../types'

export default async function searchRoutes(fastify: FastifyInstance) {
  // Busca geral
  fastify.get<{ Querystring: SearchQuery }>('/', async (request: FastifyRequest<{ Querystring: SearchQuery }>, reply: FastifyReply) => {
    const { q, category, storeId, minPrice, maxPrice, sort = 'relevance' } = request.query

    if (!q || q.length < 2) {
      return reply.status(400).send({ error: 'Busca deve ter pelo menos 2 caracteres' })
    }

    const where: {
      active: boolean
      OR: Array<{ title?: { contains: string }; description?: { contains: string }; tags?: { contains: string } }>
      category?: string
      merchantId?: string
      price?: { gte?: number; lte?: number }
    } = {
      active: true,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
      ],
    }

    if (category) {
      where.category = category
    }

    if (storeId) {
      where.merchantId = storeId
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = minPrice
      if (maxPrice) where.price.lte = maxPrice
    }

    const orderBy: { price?: 'asc' | 'desc'; createdAt?: 'desc'; merchant?: { rating: 'desc' } } =
      sort === 'price_asc'
        ? { price: 'asc' }
        : sort === 'price_desc'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { merchant: { rating: 'desc' } }
        : { createdAt: 'desc' }

    const products = await prisma.product.findMany({
      where,
      include: {
        merchant: {
          select: {
            id: true,
            storeName: true,
            logo: true,
            rating: true,
            deliveryTime: true,
            deliveryFee: true,
          },
        },
      },
      orderBy,
      take: 30,
    })

    // Buscar lojas também
    const stores = await prisma.merchant.findMany({
      where: {
        status: 'active',
        OR: [
          { storeName: { contains: q } },
          { storeType: { contains: q } },
        ],
      },
      take: 10,
    })

    return { products, stores, query: q }
  })

  // Sugestões de busca
  fastify.get<{ Querystring: { q?: string } }>('/suggestions', async (request: FastifyRequest<{ Querystring: { q?: string } }>, reply: FastifyReply) => {
    const { q } = request.query

    // Sugestões populares fixas
    const trending = [
      'Hambúrguer artesanal',
      'Pizza meio a meio',
      'Açaí 700ml',
      'Sushi combo',
      'Café especial',
      'Poke bowl',
      'Esfiha assada',
      'Tapioca recheada',
    ]

    if (!q) {
      return { suggestions: trending }
    }

    const filtered = trending.filter(s =>
      s.toLowerCase().includes(q.toLowerCase())
    )

    return { suggestions: filtered.length > 0 ? filtered : trending }
  })

  // Histórico de busca do usuário
  fastify.get('/history', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    const history = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return { history }
  })

  // Salvar busca no histórico
  fastify.post<{ Body: CreateSearchHistoryBody }>('/history', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateSearchHistoryBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { query, resultsCount } = request.body

    await prisma.searchHistory.create({
      data: {
        userId,
        query,
        resultsCount,
      },
    })

    return { success: true }
  })

  // Limpar histórico
  fastify.delete('/history', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    await prisma.searchHistory.deleteMany({
      where: { userId },
    })

    return { success: true }
  })
}
