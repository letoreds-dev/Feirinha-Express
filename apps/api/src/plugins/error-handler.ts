/**
 * Plugin de Tratamento de Erros - Fastify
 *
 * Registra um handler global de erros que padroniza todas as respostas de erro.
 */

import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import {
  ApiError,
  formatErrorResponse,
  isPrismaError,
} from '../lib/errors'

// Interface para erros extendidos do Fastify
interface FastifyErrorExtended extends Error {
  statusCode?: number
  validation?: unknown[]
  code?: string
}

export default async function errorHandlerPlugin(fastify: FastifyInstance) {
  // Handler global de erros
  fastify.setErrorHandler(
    async (
      error: FastifyError | ApiError | Error,
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      // Log do erro para debugging
      console.error('[Error Handler]', error)

      // 1. ApiError - nosso erro customizado
      if (error instanceof ApiError) {
        return reply.status(error.statusCode).send(error.toJSON())
      }

      // Cast para tipo estendido
      const extError = error as FastifyErrorExtended

      // 2. Erros de validação do Fastify (schema validation)
      if (extError.validation) {
        return reply.status(400).send(
          formatErrorResponse(
            400,
            'Dados inválidos',
            'VALIDATION_ERROR',
            extError.validation
          )
        )
      }

      // 3. ZodError - erros de validação Zod
      if (error instanceof ZodError) {
        return reply.status(400).send(
          formatErrorResponse(
            400,
            'Dados inválidos',
            'VALIDATION_ERROR',
            error.errors
          )
        )
      }

      // 4. Erros do Prisma
      if (isPrismaError(error)) {
        switch (error.code) {
          case 'P2002': // Unique constraint
            return reply.status(409).send(
              formatErrorResponse(
                409,
                'Email já cadastrado',
                'EMAIL_ALREADY_EXISTS'
              )
            )
          case 'P2025': // Record not found
            return reply.status(404).send(
              formatErrorResponse(
                404,
                'Registro não encontrado',
                'NOT_FOUND'
              )
            )
          case 'P2003': // Foreign key constraint
            return reply.status(400).send(
              formatErrorResponse(
                400,
                'Referência inválida',
                'BAD_REQUEST'
              )
            )
          default:
            return reply.status(500).send(
              formatErrorResponse(
                500,
                'Erro no banco de dados',
                'DATABASE_ERROR'
              )
            )
        }
      }

      // 5. Erros de autenticação JWT
      if (extError.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' ||
          extError.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID' ||
          extError.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
        return reply.status(401).send(
          formatErrorResponse(
            401,
            'Token inválido ou expirado',
            'INVALID_TOKEN'
          )
        )
      }

      // 6. Erros de rate limit
      if (extError.code === 'FST_RATE_LIMIT_EXCEEDED') {
        return reply.status(429).send(
          formatErrorResponse(
            429,
            'Limite de requisições excedido',
            'RATE_LIMIT_EXCEEDED'
          )
        )
      }

      // 7. FastifyError com statusCode definido
      if (extError.statusCode) {
        const statusCode = extError.statusCode >= 500 ? 500 : extError.statusCode
        return reply.status(statusCode).send(
          formatErrorResponse(
            statusCode,
            statusCode >= 500 ? 'Erro interno do servidor' : extError.message,
            statusCode >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST'
          )
        )
      }

      // 8. Fallback - erro interno genérico
      return reply.status(500).send(
        formatErrorResponse(
          500,
          'Erro interno do servidor',
          'INTERNAL_ERROR'
        )
      )
    }
  )

  // Hook para tratamento de erros não capturados
  fastify.addHook('onError', async (request, reply, error) => {
    // Não faz nada com erros já tratados
    if (reply.sent) return

    // Log adicional para erros não tratados
    console.error('[Unhandled Error]', error)
  })
}

// Helper para uso em rotas
export function sendError(
  reply: FastifyReply,
  statusCode: number,
  message: string,
  code: string,
  details?: Record<string, unknown> | unknown[]
) {
  return reply.status(statusCode).send(
    formatErrorResponse(statusCode, message, code, details)
  )
}
