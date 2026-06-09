import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { hash, compare } from 'bcryptjs'
import prisma from '../lib/prisma'
import { z } from 'zod'
import { asyncHandler, ApiError } from '../lib/errors'
import type { AuthUser } from '../types'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  type: z.enum(['customer', 'merchant']),
  // merchant only fields
  storeName: z.string().optional(),
  storeType: z.string().optional(),
  storeDescription: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default async function authRoutes(fastify: FastifyInstance) {
  // Registro - 10 requests por minuto
  fastify.post('/register', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body)
    const hashedPassword = await hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        type: body.type,
        merchant: body.type === 'merchant'
          ? {
              create: {
                storeName: body.storeName || '',
                storeType: body.storeType || '',
                storeDescription: body.storeDescription || '',
                status: 'pending',
              },
            }
          : undefined,
      },
      include: {
        merchant: true,
      },
    })

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      type: user.type as AuthUser['type'],
    })

    return reply.status(201).send({ user, token })
  }))

  // Login - 5 requests por minuto (prevenir brute force)
  fastify.post('/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute',
      },
    },
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = loginSchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: { email },
      include: { merchant: true },
    })

    if (!user) {
      throw new ApiError(401, 'Email ou senha incorretos', 'INVALID_CREDENTIALS')
    }

    const validPassword = await compare(password, user.password)
    if (!validPassword) {
      throw new ApiError(401, 'Email ou senha incorretos', 'INVALID_CREDENTIALS')
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      type: user.type as AuthUser['type'],
    })

    return reply.send({ user, token })
  }))

  // Me (get current user)
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
  }, asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: { merchant: true },
    })

    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado', 'USER_NOT_FOUND')
    }

    return reply.send({ user })
  }))
}
