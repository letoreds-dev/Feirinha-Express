import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { CreateWalletBody } from '../types'

export default async function walletRoutes(fastify: FastifyInstance) {
  // Obter carteira
  fastify.get('/balance', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId },
        include: { transactions: { take: 10 } },
      })
    }

    return { wallet }
  })

  // Adicionar saldo (PIX/depósito)
  fastify.post<{ Body: CreateWalletBody }>('/deposit', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateWalletBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { amount, pixKey, pixBank } = request.body

    if (amount <= 0) {
      return reply.status(400).send({ error: 'Valor inválido' })
    }

    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId },
      })
    }

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'deposit',
        amount,
        description: 'Depósito via PIX',
        pixKey,
        pixBank,
        pixStatus: 'completed',
      },
    })

    const updated = await prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    })

    return { balance: updated.balance }
  })

  // Solicitar saque
  fastify.post<{ Body: CreateWalletBody }>('/withdraw', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateWalletBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { amount, pixKey, pixBank } = request.body

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet || wallet.balance < amount) {
      return reply.status(400).send({ error: 'Saldo insuficiente' })
    }

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'withdraw',
        amount: -amount,
        description: 'Saque solicitado',
        pixKey,
        pixBank,
        pixStatus: 'pending',
      },
    })

    const updated = await prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    })

    return { balance: updated.balance, status: 'pending' }
  })

  // Histórico de transações
  fastify.get('/transactions', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) {
      return { transactions: [] }
    }

    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return { transactions }
  })

  // Usar cashback
  fastify.post<{ Body: { amount: number } }>('/use-cashback', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: { amount: number } }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { amount } = request.body

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet || wallet.cashbackBalance < amount) {
      return reply.status(400).send({ error: 'Cashback insuficiente' })
    }

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'payment',
        amount: -amount,
        description: 'Cashback usado no pedido',
      },
    })

    const updated = await prisma.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: amount },
        cashbackBalance: { decrement: amount },
      },
    })

    return { balance: updated.balance, cashbackBalance: updated.cashbackBalance }
  })

  // Gerar PIX para depósito
  fastify.post<{ Body: { amount: number } }>('/generate-pix', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: { amount: number } }>, reply: FastifyReply) => {
    const { amount } = request.body

    // Simulação de geração PIX - em produção seria integração real
    const pixCode = `00020126580014br.gov.bcb.pix0136${Date.now()}5204000053039865802BR5925FEIRINHA EXPRESS6009SAO PAULO62140510${Date.now()}6304`

    return {
      pixCode,
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
    }
  })
}
