/**
 * Sistema de Tratamento de Erros - Feirinha Express API
 *
 * Fornece classes, funções e utilitários para tratamento padronizado de erros.
 */

import { FastifyRequest, FastifyReply } from 'fastify'
import { ZodError } from 'zod'

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface ErrorResponse {
  success: false
  error: {
    message: string
    code: string
    details?: Record<string, unknown> | unknown[]
  }
  statusCode: number
}

export interface ErrorCode {
  code: string
  message: string
  statusCode: number
}

// ============================================
// CLASSE ApiError
// ============================================

export class ApiError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: Record<string, unknown> | unknown[]

  constructor(
    statusCode: number,
    message: string,
    code: string,
    details?: Record<string, unknown> | unknown[]
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details

    // Mantém o stack trace correto
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON(): ErrorResponse {
    return formatErrorResponse(this.statusCode, this.message, this.code, this.details)
  }
}

// ============================================
// FUNÇÃO formatErrorResponse
// ============================================

export function formatErrorResponse(
  statusCode: number,
  message: string,
  code: string,
  details?: Record<string, unknown> | unknown[]
): ErrorResponse {
  return {
    success: false,
    error: {
      message,
      code,
      ...(details !== undefined && { details }),
    },
    statusCode,
  }
}

// ============================================
// MAPEAMENTO DE ERROS COMUNS
// ============================================

export const ErrorCodes = {
  // 400 - Bad Request
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'Requisição inválida',
    statusCode: 400,
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Dados inválidos',
    statusCode: 400,
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Credenciais inválidas',
    statusCode: 400,
  },

  // 401 - Unauthorized
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Não autenticado',
    statusCode: 401,
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'Token inválido ou expirado',
    statusCode: 401,
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Token expirado',
    statusCode: 401,
  },

  // 403 - Forbidden
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'Acesso negado',
    statusCode: 403,
  },
  INSUFFICIENT_PERMISSIONS: {
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'Permissões insuficientes',
    statusCode: 403,
  },

  // 404 - Not Found
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Recurso não encontrado',
    statusCode: 404,
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'Usuário não encontrado',
    statusCode: 404,
  },
  STORE_NOT_FOUND: {
    code: 'STORE_NOT_FOUND',
    message: 'Loja não encontrada',
    statusCode: 404,
  },
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    message: 'Produto não encontrado',
    statusCode: 404,
  },
  ORDER_NOT_FOUND: {
    code: 'ORDER_NOT_FOUND',
    message: 'Pedido não encontrado',
    statusCode: 404,
  },

  // 409 - Conflict
  CONFLICT: {
    code: 'CONFLICT',
    message: 'Conflito de dados',
    statusCode: 409,
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'Email já cadastrado',
    statusCode: 409,
  },
  DUPLICATE_ENTRY: {
    code: 'DUPLICATE_ENTRY',
    message: 'Entrada duplicada',
    statusCode: 409,
  },

  // 422 - Unprocessable Entity
  UNPROCESSABLE_ENTITY: {
    code: 'UNPROCESSABLE_ENTITY',
    message: 'Entidade não processável',
    statusCode: 422,
  },

  // 429 - Too Many Requests
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Limite de requisições excedido',
    statusCode: 429,
  },

  // 500 - Internal Server Error
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Erro interno do servidor',
    statusCode: 500,
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'Erro no banco de dados',
    statusCode: 500,
  },
} as const

// ============================================
// FUNÇÕES HELPER PARA CRIAÇÃO DE ERROS
// ============================================

export const badRequest = (message?: string, details?: Record<string, unknown> | unknown[]) =>
  new ApiError(400, message || ErrorCodes.BAD_REQUEST.message, 'BAD_REQUEST', details)

export const validationError = (details: Record<string, unknown> | unknown[]) =>
  new ApiError(400, ErrorCodes.VALIDATION_ERROR.message, 'VALIDATION_ERROR', details)

export const unauthorized = (message?: string) =>
  new ApiError(401, message || ErrorCodes.UNAUTHORIZED.message, 'UNAUTHORIZED')

export const invalidToken = () =>
  new ApiError(401, ErrorCodes.INVALID_TOKEN.message, 'INVALID_TOKEN')

export const forbidden = (message?: string) =>
  new ApiError(403, message || ErrorCodes.FORBIDDEN.message, 'FORBIDDEN')

export const notFound = (resource?: string) =>
  new ApiError(404, resource ? `${resource} não encontrado` : ErrorCodes.NOT_FOUND.message, 'NOT_FOUND')

export const conflict = (message?: string) =>
  new ApiError(409, message || ErrorCodes.CONFLICT.message, 'CONFLICT')

export const emailAlreadyExists = () =>
  new ApiError(409, ErrorCodes.EMAIL_ALREADY_EXISTS.message, 'EMAIL_ALREADY_EXISTS')

export const internalError = (message?: string) =>
  new ApiError(500, message || ErrorCodes.INTERNAL_ERROR.message, 'INTERNAL_ERROR')

// ============================================
// ASYNC HANDLER WRAPPER
// ============================================

// Tipo genérico para handlers do Fastify
type RouteHandler = (...args: any[]) => Promise<unknown>

/**
 * Wrapper que captura erros em handlers assíncronos e os passa para o error handler do Fastify.
 * Evita try-catch em cada rota.
 */
export function asyncHandler(fn: RouteHandler): RouteHandler {
  return async (...args: Parameters<RouteHandler>): Promise<ReturnType<RouteHandler>> => {
    try {
      return await fn(...args)
    } catch (error) {
      // Se já é uma ApiError, deixa propagar para o error handler
      if (error instanceof ApiError) {
        throw error
      }

      // Erro do Zod
      if (error instanceof ZodError) {
        throw validationError(error.errors)
      }

      // Erro do Prisma com código único
      if (isPrismaError(error)) {
        if (error.code === 'P2002') {
          throw conflict(ErrorCodes.DUPLICATE_ENTRY.message)
        }
        if (error.code === 'P2025') {
          throw notFound()
        }
        throw internalError(ErrorCodes.DATABASE_ERROR.message)
      }

      // Erros desconhecidos viram 500
      throw internalError()
    }
  }
}

// ============================================
// UTILITÁRIOS
// ============================================

export function isPrismaError(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as Record<string, unknown>).code === 'string'
  )
}

/**
 * Verifica se um erro é um erro de Prisma relacionado a não encontrado
 */
export function isNotFoundError(error: unknown): boolean {
  return isPrismaError(error) && error.code === 'P2025'
}

/**
 * Verifica se um erro é um erro de conflito do Prisma
 */
export function isConflictError(error: unknown): boolean {
  return isPrismaError(error) && error.code === 'P2002'
}
