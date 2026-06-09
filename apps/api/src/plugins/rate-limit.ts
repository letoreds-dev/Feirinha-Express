import { FastifyInstance } from 'fastify'
import fastifyRateLimit from '@fastify/rate-limit'

/**
 * Configurações de rate limit por rota
 */
export const rateLimitConfig = {
  // Limite padrão para todas as rotas
  default: {
    max: 100,
    timeWindow: '1 minute',
  },
  // Rotas de autenticação - mais restritivas para prevenir brute force
  auth: {
    login: {
      max: 5,
      timeWindow: '1 minute',
    },
    register: {
      max: 10,
      timeWindow: '1 minute',
    },
  },
  // Rotas de pedidos - moderadamente restritivas
  orders: {
    create: {
      max: 10,
      timeWindow: '1 minute',
    },
    list: {
      max: 30,
      timeWindow: '1 minute',
    },
  },
  // Rotas de busca - menos restritivas
  search: {
    max: 30,
    timeWindow: '1 minute',
  },
} as const

export default async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyRateLimit, {
    max: rateLimitConfig.default.max,
    timeWindow: rateLimitConfig.default.timeWindow,
    errorResponseBuilder: (request, context) => ({
      success: false,
      error: {
        message: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        details: {
          limit: context.max,
          remaining: 0,
          reset: new Date(context.ttl + Date.now()).toISOString(),
        },
      },
      statusCode: 429,
    }),
    // Adicionar headers de rate limit na resposta
    addHeadersOnExceeding: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
    // Habilitar key gen para rate limit por IP + user agent
    keyGenerator: (request) => {
      const forwarded = request.headers['x-forwarded-for']
      const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : request.ip
      return `${ip}-${request.headers['user-agent'] || 'unknown'}`
    },
  })

  // Decorator para aplicar rate limit customizado em rotas
  fastify.decorate('customRateLimit', (config: { max: number; timeWindow: string }) => {
    return {
      config: {
        rateLimit: config,
      },
    }
  })
}

// Extend FastifyInstance
declare module 'fastify' {
  interface FastifyInstance {
    customRateLimit: (config: { max: number; timeWindow: string }) => { config: { rateLimit: { max: number; timeWindow: string } } }
  }
}