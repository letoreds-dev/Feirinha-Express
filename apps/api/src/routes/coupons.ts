import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { z } from 'zod'
import { CreateCouponBody } from '../types'

const validateCouponSchema = z.object({
  code: z.string().min(3).max(20),
  orderValue: z.number().positive(),
  merchantId: z.string().optional(),
})

export default async function couponRoutes(fastify: FastifyInstance) {
  // Validar cupom
  fastify.post<{ Body: { code: string; orderValue: number; merchantId?: string } }>('/validate', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: { code: string; orderValue: number; merchantId?: string } }>, reply: FastifyReply) => {
    try {
      const { code, orderValue, merchantId } = validateCouponSchema.parse(request.body)
      const userId = request.user.id

      const coupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() },
      })

      if (!coupon) {
        return reply.status(404).send({ error: 'Cupom não encontrado' })
      }

      if (!coupon.isActive) {
        return reply.status(400).send({ error: 'Cupom inativo' })
      }

      const now = new Date()
      if (now < coupon.startsAt || now > coupon.expiresAt) {
        return reply.status(400).send({ error: 'Cupom expirado' })
      }

      if (coupon.merchantId && coupon.merchantId !== merchantId) {
        return reply.status(400).send({ error: 'Cupom não válido para esta loja' })
      }

      if (orderValue < coupon.minOrderValue) {
        return reply.status(400).send({
          error: `Pedido mínimo de R$ ${coupon.minOrderValue.toFixed(2)}`,
        })
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return reply.status(400).send({ error: 'Cupom esgotado' })
      }

      // Verificar uso por usuário
      const userUsage = await prisma.couponUser.count({
        where: { userId, couponId: coupon.id },
      })
      if (userUsage >= coupon.maxPerUser) {
        return reply.status(400).send({ error: 'Você já usou este cupom' })
      }

      // Calcular desconto
      let discount = 0
      if (coupon.type === 'percentage') {
        discount = (orderValue * coupon.value) / 100
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount)
        }
      } else if (coupon.type === 'fixed') {
        discount = coupon.value
      } else if (coupon.type === 'free_delivery') {
        discount = 5.90 // Taxa de entrega padrão
      }

      return {
        valid: true,
        coupon: {
          code: coupon.code,
          title: coupon.title,
          type: coupon.type,
          value: coupon.value,
          discount: Math.min(discount, orderValue),
        },
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos' })
      }
      throw error
    }
  })

  // Listar cupons do usuário
  fastify.get('/my-coupons', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    const coupons = await prisma.couponUser.findMany({
      where: { userId, usedAt: null },
      include: { coupon: true },
    })

    const activeCoupons = coupons.filter(c => {
      const now = new Date()
      return c.coupon.isActive && now <= c.coupon.expiresAt
    })

    return { coupons: activeCoupons }
  })

  // Criar cupom (admin)
  fastify.post<{ Body: CreateCouponBody }>('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateCouponBody }>, reply: FastifyReply) => {
    const body = request.body

    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        title: body.title,
        description: body.description,
        type: body.type,
        value: body.value,
        minOrderValue: body.minOrderValue || 0,
        maxDiscount: body.maxDiscount,
        merchantId: body.merchantId,
        isGlobal: true,
        maxUses: body.maxUses,
        maxPerUser: body.maxPerUser || 1,
        expiresAt: new Date(body.expiresAt),
      },
    })

    return reply.status(201).send({ coupon })
  })

  // Listar cupons disponíveis para o usuário
  fastify.get('/available', async (request: FastifyRequest, reply: FastifyReply) => {
    const now = new Date()

    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        expiresAt: { gte: now },
        OR: [
          { isGlobal: true },
          { merchantId: null },
        ],
      },
      orderBy: { value: 'desc' },
    })

    return { coupons }
  })
}
