import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { CreateDeviceTokenBody, CreateNotificationBody } from '../types'

export default async function notificationRoutes(fastify: FastifyInstance) {
  // Listar notificações
  fastify.get<{ Querystring: { unreadOnly?: boolean } }>('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Querystring: { unreadOnly?: boolean } }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { unreadOnly } = request.query

    const where: { userId: string; isRead?: boolean } = { userId }
    if (unreadOnly) {
      where.isRead = false
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    })

    return { notifications, unreadCount }
  })

  // Marcar como lida
  fastify.post<{ Params: { id: string } }>('/:id/read', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    const notification = await prisma.notification.update({
      where: { id: request.params.id, userId },
      data: { isRead: true, readAt: new Date() },
    })

    return { notification }
  })

  // Marcar todas como lidas
  fastify.post('/read-all', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    })

    return { success: true }
  })

  // Deletar notificação
  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    await prisma.notification.delete({
      where: { id: request.params.id, userId },
    })

    return { success: true }
  })

  // Registrar device token para push notifications
  fastify.post<{ Body: CreateDeviceTokenBody }>('/device-token', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateDeviceTokenBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { token, platform } = request.body

    // Remover token antigo se existir
    await prisma.deviceToken.deleteMany({
      where: { token },
    })

    await prisma.deviceToken.create({
      data: { userId, token, platform: platform || 'web' },
    })

    return { success: true }
  })

  // Criar notificação (para uso interno/admin)
  fastify.post<{ Body: CreateNotificationBody }>('/create', async (request: FastifyRequest<{ Body: CreateNotificationBody }>, reply: FastifyReply) => {
    const { userId, type, title, body, data } = request.body

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type || 'system',
        title,
        body,
        data: data ? JSON.stringify(data) : null,
      },
    })

    // Aqui seria o momento de enviar push notification via Firebase/APNS
    // Por enquanto apenas salvamos no banco

    return { notification }
  })
}
