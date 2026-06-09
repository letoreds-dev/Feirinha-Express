import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { ToggleFavoriteBody } from '../types'

export default async function favoriteRoutes(fastify: FastifyInstance) {
  // Listar favoritos
  fastify.get('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: { merchant: { select: { storeName: true, logo: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { favorites }
  })

  // Adicionar aos favoritos
  fastify.post<{ Body: ToggleFavoriteBody }>('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: ToggleFavoriteBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { productId } = request.body

    // Verificar se já existe
    const existing = await prisma.favorite.findFirst({
      where: { userId, productId },
    })

    if (existing) {
      return reply.status(400).send({ error: 'Produto já está nos favoritos' })
    }

    const favorite = await prisma.favorite.create({
      data: { userId, productId },
      include: { product: true },
    })

    return reply.status(201).send({ favorite })
  })

  // Remover dos favoritos
  fastify.delete<{ Params: { productId: string } }>('/:productId', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { productId: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    await prisma.favorite.deleteMany({
      where: { userId, productId: request.params.productId },
    })

    return { success: true }
  })

  // Verificar se é favorito
  fastify.get<{ Params: { productId: string } }>('/check/:productId', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { productId: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    const favorite = await prisma.favorite.findFirst({
      where: { userId, productId: request.params.productId },
    })

    return { isFavorite: !!favorite }
  })
}
