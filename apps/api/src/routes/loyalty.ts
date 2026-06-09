import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { RedeemRewardBody, AddLoyaltyPointsBody } from '../types'

export default async function loyaltyRoutes(fastify: FastifyInstance) {
  // Obter conta de fidelidade
  fastify.get('/account', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    let account = await prisma.loyaltyAccount.findUnique({
      where: { userId },
      include: { transactions: { take: 10, orderBy: { createdAt: 'desc' } } },
    })

    if (!account) {
      account = await prisma.loyaltyAccount.create({
        data: { userId },
        include: { transactions: { take: 10 } },
      })
    }

    // Calcular próximo tier
    const tiers = [
      { name: 'bronze', minPoints: 0, rewards: 5 },
      { name: 'silver', minPoints: 500, rewards: 10 },
      { name: 'gold', minPoints: 1500, rewards: 15 },
      { name: 'platinum', minPoints: 5000, rewards: 20 },
    ]

    const currentTierIndex = tiers.findIndex(t => t.name === account!.tier)
    const nextTier = tiers[currentTierIndex + 1]

    return {
      account,
      nextTier: nextTier ? {
        name: nextTier.name,
        pointsNeeded: nextTier.minPoints - account!.lifetimePoints,
        rewardPercent: nextTier.rewards,
      } : null,
    }
  })

  // Resgatar recompensa
  fastify.post<{ Body: RedeemRewardBody }>('/redeem', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: RedeemRewardBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { rewardId } = request.body

    const reward = await prisma.loyaltyReward.findUnique({
      where: { id: rewardId },
    })

    if (!reward) {
      return reply.status(404).send({ error: 'Recompensa não encontrada' })
    }

    const account = await prisma.loyaltyAccount.findUnique({
      where: { userId },
    })

    if (!account || account.points < reward.pointsCost) {
      return reply.status(400).send({ error: 'Pontos insuficientes' })
    }

    // Debitar pontos
    await prisma.loyaltyAccount.update({
      where: { userId },
      data: {
        points: { decrement: reward.pointsCost },
        redeemedRewards: { increment: 1 },
      },
    })

    await prisma.loyaltyTransaction.create({
      data: {
        accountId: account.id,
        type: 'redeem',
        points: -reward.pointsCost,
        description: `Resgatado: ${reward.name}`,
      },
    })

    return {
      success: true,
      reward: reward.name,
      type: reward.type,
      value: reward.value,
    }
  })

  // Listar recompensas disponíveis
  fastify.get('/rewards', async (request: FastifyRequest, reply: FastifyReply) => {
    const rewards = await prisma.loyaltyReward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: 'asc' },
    })
    return { rewards }
  })

  // Adicionar pontos (após pedido)
  fastify.post<{ Body: AddLoyaltyPointsBody }>('/earn', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: AddLoyaltyPointsBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { orderId, points } = request.body

    let account = await prisma.loyaltyAccount.findUnique({
      where: { userId },
    })

    if (!account) {
      account = await prisma.loyaltyAccount.create({
        data: { userId },
      })
    }

    await prisma.loyaltyTransaction.create({
      data: {
        accountId: account.id,
        type: 'earn',
        points,
        description: 'Pontos do pedido',
        orderId,
      },
    })

    const newPoints = account.points + points
    const newLifetime = account.lifetimePoints + points

    // Verificar upgrade de tier
    let newTier = account.tier
    if (newLifetime >= 5000) newTier = 'platinum'
    else if (newLifetime >= 1500) newTier = 'gold'
    else if (newLifetime >= 500) newTier = 'silver'

    await prisma.loyaltyAccount.update({
      where: { userId },
      data: {
        points: newPoints,
        lifetimePoints: newLifetime,
        tier: newTier,
      },
    })

    return {
      pointsEarned: points,
      totalPoints: newPoints,
      tier: newTier,
      tierUpgraded: newTier !== account.tier,
    }
  })

  // Histórico de transações
  fastify.get('/transactions', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    const account = await prisma.loyaltyAccount.findUnique({
      where: { userId },
    })

    if (!account) {
      return { transactions: [] }
    }

    const transactions = await prisma.loyaltyTransaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return { transactions }
  })
}
