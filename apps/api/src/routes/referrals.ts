import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { CreateReferralBody } from '../types'

export default async function referralRoutes(fastify: FastifyInstance) {
  // Obter código de indicação do usuário
  fastify.get('/my-code', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    })

    // Gerar código baseado no ID
    const referralCode = Buffer.from(userId).toString('base64').substring(0, 8).toUpperCase()

    return {
      code: referralCode,
      shareUrl: `https://feirinha.app/join/${referralCode}`,
      name: user?.name,
    }
  })

  // Validar código de indicação
  fastify.get<{ Params: { code: string } }>('/validate/:code', async (request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
    const { code } = request.params

    // Decodificar código
    let referrerId: string
    try {
      referrerId = Buffer.from(code, 'base64').toString()
    } catch {
      return reply.status(400).send({ error: 'Código inválido' })
    }

    const referrer = await prisma.user.findUnique({
      where: { id: referrerId },
      select: { id: true, name: true },
    })

    if (!referrer) {
      return reply.status(404).send({ error: 'Código de indicação não encontrado' })
    }

    return {
      valid: true,
      referrerName: referrer.name,
    }
  })

  // Usar código de indicação (ao se cadastrar)
  fastify.post<{ Body: CreateReferralBody }>('/use', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateReferralBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { code } = request.body

    // Decodificar código
    let referrerId: string
    try {
      referrerId = Buffer.from(code, 'base64').toString()
    } catch {
      return reply.status(400).send({ error: 'Código inválido' })
    }

    if (referrerId === userId) {
      return reply.status(400).send({ error: 'Você não pode usar seu próprio código' })
    }

    // Verificar se já foi indicado
    const existing = await prisma.referral.findFirst({
      where: { refereeId: userId },
    })

    if (existing) {
      return reply.status(400).send({ error: 'Você já usou um código de indicação' })
    }

    // Criar indicação
    const referral = await prisma.referral.create({
      data: {
        referrerId,
        refereeId: userId,
        status: 'pending',
      },
    })

    // Dar bônus ao indicador (R$10 de cashback)
    let wallet = await prisma.wallet.findUnique({
      where: { userId: referrerId },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: referrerId },
      })
    }

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'bonus',
        amount: 10,
        description: 'Bônus por indicar amigo',
      },
    })

    await prisma.wallet.update({
      where: { userId: referrerId },
      data: { cashbackBalance: { increment: 10 } },
    })

    // Dar cupom ao indicado (R$15 na primeira compra)
    const coupon = await prisma.coupon.upsert({
      where: { code: `INDICACAO${userId.substring(0, 8)}` },
      create: {
        code: `INDICACAO${userId.substring(0, 8)}`,
        title: 'Bônus de Indicação',
        description: 'R$15 de desconto na primeira compra',
        type: 'fixed',
        value: 15,
        minOrderValue: 50,
        maxPerUser: 1,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      },
      update: {},
    })

    await prisma.couponUser.create({
      data: {
        userId,
        couponId: coupon.id,
      },
    })

    return {
      success: true,
      bonus: 'R$15 de cupom adicionado à sua conta!',
    }
  })

  // Listar indicações do usuário
  fastify.get('/my-referrals', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referee: { select: { name: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const completed = referrals.filter(r => r.status === 'completed')
    const pending = referrals.filter(r => r.status === 'pending')

    return {
      referrals,
      stats: {
        total: referrals.length,
        completed: completed.length,
        pending: pending.length,
        totalEarned: completed.length * 10,
      },
    }
  })
}
