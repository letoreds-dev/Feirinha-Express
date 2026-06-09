import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'
import { z } from 'zod'
import { CreateAddressBody, UpdateAddressBody } from '../types'

const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  zipCode: z.string().min(8),
  lat: z.number().optional(),
  lng: z.number().optional(),
  instructions: z.string().optional(),
  isDefault: z.boolean().optional(),
})

export default async function addressRoutes(fastify: FastifyInstance) {
  // Listar endereços
  fastify.get('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return { addresses }
  })

  // Criar endereço
  fastify.post<{ Body: CreateAddressBody }>('/', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateAddressBody }>, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const body = addressSchema.parse(request.body)

      // Se for o primeiro ou isDefault, atualizar outros
      if (body.isDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        })
      }

      const address = await prisma.address.create({
        data: {
          userId,
          label: body.label || 'Casa',
          street: body.street,
          number: body.number,
          complement: body.complement,
          neighborhood: body.neighborhood,
          city: body.city,
          state: body.state || 'SP',
          zipCode: body.zipCode,
          lat: body.lat,
          lng: body.lng,
          instructions: body.instructions,
          isDefault: body.isDefault ?? false,
        },
      })

      return reply.status(201).send({ address })
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      throw error
    }
  })

  // Atualizar endereço
  fastify.put<{ Params: { id: string }; Body: UpdateAddressBody }>('/:id', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateAddressBody }>, reply: FastifyReply) => {
    const userId = request.user.id
    const body = addressSchema.partial().parse(request.body)

    const address = await prisma.address.findFirst({
      where: { id: request.params.id, userId },
    })

    if (!address) {
      return reply.status(404).send({ error: 'Endereço não encontrado' })
    }

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.address.update({
      where: { id: request.params.id },
      data: body,
    })

    return { address: updated }
  })

  // Deletar endereço
  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    const address = await prisma.address.findFirst({
      where: { id: request.params.id, userId },
    })

    if (!address) {
      return reply.status(404).send({ error: 'Endereço não encontrado' })
    }

    await prisma.address.delete({
      where: { id: request.params.id },
    })

    return { success: true }
  })

  // Definir como padrão
  fastify.post<{ Params: { id: string } }>('/:id/default', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.user.id

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    })

    const address = await prisma.address.update({
      where: { id: request.params.id },
      data: { isDefault: true },
    })

    return { address }
  })
}
