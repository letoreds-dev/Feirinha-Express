import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { z } from 'zod'
import { CreateReviewBody } from '../types'

const reviewSchema = z.object({
  merchantId: z.string(),
  productId: z.string().optional(),
  orderId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  photos: z.array(z.string()).optional(),
  foodRating: z.number().min(1).max(5).optional(),
  deliveryRating: z.number().min(1).max(5).optional(),
  isAnonymous: z.boolean().optional(),
})

export default async function reviewRoutes(fastify: FastifyInstance) {
  // Listar reviews de uma loja
  fastify.get<{ Params: { merchantId: string }; Querystring: { sort?: string; minRating?: string } }>('/merchant/:merchantId', async (request: FastifyRequest<{ Params: { merchantId: string }; Querystring: { sort?: string; minRating?: string } }>, reply: FastifyReply) => {
    const { merchantId } = request.params
    const { sort = 'recent', minRating } = request.query

    const where: { merchantId: string; rating?: { gte: number } } = { merchantId }
    if (minRating) {
      where.rating = { gte: parseInt(minRating) }
    }

    const orderBy: { createdAt?: 'desc'; rating?: 'desc'; helpfulCount?: 'desc' } =
      sort === 'recent'
        ? { createdAt: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { helpfulCount: 'desc' }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true, avatar: true } },
        product: { select: { title: true } },
      },
      orderBy,
      take: 20,
    })

    // Estatísticas
    const stats = await prisma.review.aggregate({
      where: { merchantId },
      _avg: { rating: true, foodRating: true, deliveryRating: true },
      _count: true,
    })

    return { reviews, stats }
  })

  // Listar reviews de um produto
  fastify.get<{ Params: { productId: string } }>('/product/:productId', async (request: FastifyRequest<{ Params: { productId: string } }>, reply: FastifyReply) => {
    const { productId } = request.params

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { reviews }
  })

  // Criar review
  fastify.post<{ Body: CreateReviewBody }>('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateReviewBody }>, reply: FastifyReply) => {
    try {
      const body = reviewSchema.parse(request.body)
      const userId = request.user.id

      // Verificar se já fez review desse pedido
      const existing = await prisma.review.findFirst({
        where: { userId, orderId: body.orderId },
      })

      if (existing) {
        return reply.status(400).send({ error: 'Você já avaliou este pedido' })
      }

      const review = await prisma.review.create({
        data: {
          userId,
          orderId: body.orderId,
          merchantId: body.merchantId,
          productId: body.productId,
          rating: body.rating,
          comment: body.comment,
          photos: body.photos ? JSON.stringify(body.photos) : null,
          foodRating: body.foodRating,
          deliveryRating: body.deliveryRating,
          isAnonymous: body.isAnonymous,
        },
        include: {
          user: { select: { name: true, avatar: true } },
        },
      })

      // Atualizar rating do lojista usando aggregate
      const ratingStats = await prisma.review.aggregate({
        where: { merchantId: body.merchantId },
        _avg: { rating: true },
        _count: true,
      })

      await prisma.merchant.update({
        where: { id: body.merchantId },
        data: {
          rating: ratingStats._avg.rating || 5,
          totalRatings: ratingStats._count
        },
      })

      // Adicionar pontos de fidelidade
      const loyalty = await prisma.loyaltyAccount.findUnique({
        where: { userId },
      })
      if (loyalty) {
        await prisma.loyaltyTransaction.create({
          data: {
            accountId: loyalty.id,
            type: 'earn',
            points: 10,
            description: 'Review realizado',
          },
        })
        await prisma.loyaltyAccount.update({
          where: { userId },
          data: { points: { increment: 10 }, lifetimePoints: { increment: 10 } },
        })
      }

      return reply.status(201).send({ review })
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      throw error
    }
  })

  // Marcar review como útil
  fastify.post<{ Params: { id: string } }>('/:id/helpful', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const review = await prisma.review.update({
      where: { id: request.params.id },
      data: { helpfulCount: { increment: 1 } },
    })
    return { review }
  })
}
