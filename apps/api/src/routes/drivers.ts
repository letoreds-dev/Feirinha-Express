import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { UpdateLocationBody, UpdateDriverStatusBody } from '../types'

export default async function driverRoutes(fastify: FastifyInstance) {
  // Listar entregadores disponíveis
  fastify.get('/available', async (request: FastifyRequest, reply: FastifyReply) => {
    const drivers = await prisma.driver.findMany({
      where: { status: 'available' },
      include: { user: { select: { name: true, avatar: true } } },
    })

    return { drivers }
  })

  // Atualizar localização do entregador
  fastify.post<{ Body: UpdateLocationBody }>('/location', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: UpdateLocationBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { lat, lng } = request.body

    const driver = await prisma.driver.findUnique({
      where: { userId },
    })

    if (!driver) {
      return reply.status(404).send({ error: 'Entregador não encontrado' })
    }

    await prisma.driver.update({
      where: { userId },
      data: { currentLat: lat, currentLng: lng },
    })

    return { success: true }
  })

  // Atualizar status do entregador
  fastify.post<{ Body: UpdateDriverStatusBody }>('/status', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: UpdateDriverStatusBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { status } = request.body

    const driver = await prisma.driver.update({
      where: { userId },
      data: { status },
    })

    return { driver }
  })

  // Aceitar corrida
  fastify.post<{ Params: { orderId: string } }>('/accept/:orderId', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    const driver = await prisma.driver.findUnique({
      where: { userId },
    })

    if (!driver) {
      return reply.status(404).send({ error: 'Entregador não encontrado' })
    }

    if (driver.status !== 'available') {
      return reply.status(400).send({ error: 'Você já está em uma corrida' })
    }

    const order = await prisma.order.update({
      where: { id: request.params.orderId },
      data: {
        driverId: driver.id,
        status: 'on_the_way',
      },
    })

    await prisma.driver.update({
      where: { id: driver.id },
      data: { status: 'busy' },
    })

    // Notificar cliente
    await prisma.notification.create({
      data: {
        userId: order.customerId,
        type: 'order',
        title: 'Entregador a caminho! 🚀',
        body: 'Seu pedido foi aceito e está a caminho',
        data: JSON.stringify({ orderId: order.id }),
      },
    })

    return { order }
  })

  // Atualizar status do pedido (entregador)
  fastify.post<{ Params: { orderId: string }; Body: { status: string; lat?: number; lng?: number } }>('/order/:orderId/status', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { orderId: string }; Body: { status: string; lat?: number; lng?: number } }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { status, lat, lng } = request.body

    const driver = await prisma.driver.findUnique({
      where: { userId },
    })

    if (!driver) {
      return reply.status(404).send({ error: 'Entregador não encontrado' })
    }

    const order = await prisma.order.update({
      where: { id: request.params.orderId, driverId: driver.id },
      data: {
        status,
        currentLat: lat,
        currentLng: lng,
      },
    })

    // Notificar cliente sobre atualização
    const statusMessages: Record<string, string> = {
      separating: 'Seu pedido está sendo separado',
      ready: 'Seu pedido está pronto para retirada',
      on_the_way: 'Seu pedido saiu para entrega',
      delivered: 'Seu pedido foi entregue! 🎉',
    }

    if (statusMessages[status]) {
      await prisma.notification.create({
        data: {
          userId: order.customerId,
          type: 'order',
          title: status === 'delivered' ? 'Pedido Entregue!' : 'Atualização do pedido',
          body: statusMessages[status],
          data: JSON.stringify({ orderId: order.id }),
        },
      })
    }

    return { order }
  })

  // Obter entregador do pedido
  fastify.get<{ Params: { orderId: string } }>('/order/:orderId', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply) => {
    const order = await prisma.order.findUnique({
      where: { id: request.params.orderId },
      include: {
        driver: {
          include: { user: { select: { name: true, phone: true, avatar: true } } },
        },
      },
    })

    if (!order?.driver) {
      return reply.status(404).send({ error: 'Entregador não encontrado' })
    }

    return { driver: order.driver }
  })
}
