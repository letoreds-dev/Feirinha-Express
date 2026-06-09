import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { CreateCategoryBody, UpdateCategoryBody } from '../types'

export default async function categoryRoutes(fastify: FastifyInstance) {
  // Listar categorias
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })

    return { categories }
  })

  // Criar categoria (admin)
  fastify.post<{ Body: CreateCategoryBody }>('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateCategoryBody }>, reply: FastifyReply) => {
    const { name, slug, icon, image, color, sortOrder } = request.body

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        icon,
        image,
        color,
        sortOrder: sortOrder || 0,
      },
    })

    return reply.status(201).send({ category })
  })

  // Atualizar categoria
  fastify.put<{ Params: { id: string }; Body: UpdateCategoryBody }>('/:id', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateCategoryBody }>, reply: FastifyReply) => {
    const body = request.body

    const category = await prisma.category.update({
      where: { id: request.params.id },
      data: {
        name: body.name,
        slug: body.slug,
        icon: body.icon,
        image: body.image,
        color: body.color,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    })

    return { category }
  })

  // Listar produtos por categoria
  fastify.get<{ Params: { slug: string }; Querystring: { limit?: number; offset?: number } }>('/:slug/products', async (request: FastifyRequest<{ Params: { slug: string }; Querystring: { limit?: number; offset?: number } }>, reply: FastifyReply) => {
    const { slug } = request.params
    const { limit = 20, offset = 0 } = request.query

    const category = await prisma.category.findUnique({
      where: { slug },
    })

    if (!category) {
      return reply.status(404).send({ error: 'Categoria não encontrada' })
    }

    const products = await prisma.product.findMany({
      where: {
        active: true,
        category: category.name,
      },
      include: {
        merchant: { select: { storeName: true, logo: true, rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return { products, category }
  })
}
