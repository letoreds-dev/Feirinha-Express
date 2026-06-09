import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { CreateChatMessageBody, CreateChatConversationBody } from '../types'

export default async function chatRoutes(fastify: FastifyInstance) {
  // Listar conversas
  fastify.get('/conversations', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id
    const userType = request.user.type

    const where: { customerId?: string; merchantId?: string; driverId?: string } = {}

    if (userType === 'customer') {
      where.customerId = userId
    } else if (userType === 'merchant') {
      where.merchantId = userId
    } else if (userType === 'driver') {
      where.driverId = userId
    }

    const conversations = await prisma.chatConversation.findMany({
      where,
      orderBy: { lastMessageAt: 'desc' },
    })

    return { conversations }
  })

  // Obter conversa por ID
  fastify.get<{ Params: { id: string } }>('/conversations/:id', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    const conversation = await prisma.chatConversation.findUnique({
      where: { id: request.params.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
        },
      },
    })

    if (!conversation) {
      return reply.status(404).send({ error: 'Conversa não encontrada' })
    }

    return { conversation }
  })

  // Criar conversa
  fastify.post<{ Body: CreateChatConversationBody }>('/conversations', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateChatConversationBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { type, orderId, merchantId, driverId } = request.body

    const conversation = await prisma.chatConversation.create({
      data: {
        type: type || 'support',
        customerId: userId,
        orderId,
        merchantId,
        driverId,
      },
    })

    return reply.status(201).send({ conversation })
  })

  // Enviar mensagem
  fastify.post<{ Params: { id: string }; Body: CreateChatMessageBody }>('/conversations/:id/messages', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string }; Body: CreateChatMessageBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const { content, type, locationLat, locationLng } = request.body

    const conversation = await prisma.chatConversation.findUnique({
      where: { id: request.params.id },
    })

    if (!conversation) {
      return reply.status(404).send({ error: 'Conversa não encontrada' })
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId: request.params.id,
        senderId: userId,
        senderType: request.user.type,
        type: type || 'text',
        content,
        locationLat,
        locationLng,
      },
      include: { sender: { select: { name: true, avatar: true } } },
    })

    // Atualizar última mensagem da conversa
    await prisma.chatConversation.update({
      where: { id: request.params.id },
      data: { lastMessage: content, lastMessageAt: new Date() },
    })

    // Notificar o outro participante
    const recipientId = conversation.customerId === userId
      ? (conversation.merchantId || conversation.driverId)
      : conversation.customerId

    if (recipientId) {
      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'chat',
          title: 'Nova mensagem',
          body: content.substring(0, 100),
          data: JSON.stringify({ conversationId: request.params.id }),
        },
      })
    }

    return reply.status(201).send({ message })
  })

  // Marcar mensagens como lidas
  fastify.post<{ Params: { id: string } }>('/conversations/:id/read', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.user.id
    const userType = request.user.type

    await prisma.chatMessage.updateMany({
      where: {
        conversationId: request.params.id,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    })

    // Atualizar contador de não lidos
    const updateData: { customerUnread?: number; merchantUnread?: number; driverUnread?: number } = {}
    if (userType === 'customer') updateData.customerUnread = 0
    else if (userType === 'merchant') updateData.merchantUnread = 0
    else if (userType === 'driver') updateData.driverUnread = 0

    await prisma.chatConversation.update({
      where: { id: request.params.id },
      data: updateData,
    })

    return { success: true }
  })

  // Obter mensagens de um pedido
  fastify.get<{ Params: { orderId: string } }>('/order/:orderId', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    const conversation = await prisma.chatConversation.findFirst({
      where: { orderId: request.params.orderId, customerId: userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (!conversation) {
      return { messages: [] }
    }

    return { messages: conversation.messages }
  })
}
