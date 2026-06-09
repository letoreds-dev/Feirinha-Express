/**
 * Cache Examples for Feirinha Express API
 *
 * Este arquivo demonstra como usar o sistema de cache Redis
 * nas rotas da API.
 */

import { FastifyInstance } from 'fastify'
import { getCache, setCache, invalidateCache } from './cache'

// ============================================
// EXEMPLO 1: Cache simples com TTL
// ============================================
async function exampleSimpleCache(fastify: FastifyInstance) {
  const cacheKey = 'stores:featured'
  const ttl = 300 // 5 minutos

  // Tenta buscar do cache
  const cached = await getCache<any[]>(fastify, cacheKey)
  if (cached) {
    return { data: cached, fromCache: true }
  }

  // Busca do banco de dados
  const data = await fetchFromDatabase()

  // Salva no cache
  await setCache(fastify, cacheKey, data, { ttl })

  return { data, fromCache: false }
}

// ============================================
// EXEMPLO 2: Cache com invalidação por padrão
// ============================================
async function exampleInvalidateByPattern(fastify: FastifyInstance) {
  // Ao criar/atualizar um produto
  const merchantId = 'merchant-123'

  // Invalida múltiplos caches relacionados
  await invalidateCache(fastify, 'stores:*')           // Lista de lojas
  await invalidateCache(fastify, `store:${merchantId}`) // Loja específica
  await invalidateCache(fastify, 'products:*')         // Lista de produtos
  await invalidateCache(fastify, `products:store:${merchantId}`) // Produtos da loja
  await invalidateCache(fastify, `product:*`)          // Detalhes de produtos
}

// ============================================
// EXEMPLO 3: Cache de sessão do usuário
// ============================================
async function exampleUserSessionCache(fastify: FastifyInstance, userId: string) {
  const cacheKey = `session:${userId}`
  const ttl = 1800 // 30 minutos

  const cached = await getCache<any>(fastify, cacheKey)
  if (cached) {
    return cached
  }

  const session = await loadUserSession(userId)
  await setCache(fastify, cacheKey, session, { ttl })

  return session
}

// ============================================
// EXEMPLO 4: Cache de busca com query params
// ============================================
async function exampleSearchCache(fastify: FastifyInstance, query: string, category?: string) {
  // Gera chave única baseada nos parâmetros
  const cacheKey = category
    ? `search:${query}:${category}`
    : `search:${query}:all`

  const cached = await getCache<any[]>(fastify, cacheKey)
  if (cached) {
    return cached
  }

  const results = await performSearch(query, category)
  await setCache(fastify, cacheKey, results, { ttl: 60 }) // 1 minuto para buscas

  return results
}

// ============================================
// EXEMPLO 5: Cache de analytics agregado
// ============================================
async function exampleAnalyticsCache(fastify: FastifyInstance, dateRange: string) {
  const cacheKey = `analytics:${dateRange}`
  const ttl = 3600 // 1 hora para dados agregados

  const cached = await getCache<any>(fastify, cacheKey)
  if (cached) {
    return { ...cached, fromCache: true }
  }

  const analytics = await computeAnalytics(dateRange)
  await setCache(fastify, cacheKey, analytics, { ttl })

  return { ...analytics, fromCache: false }
}

// ============================================
// FUNÇÕES AUXILIARES (mock)
// ============================================
async function fetchFromDatabase() {
  return []
}

async function loadUserSession(userId: string) {
  return { userId }
}

async function performSearch(query: string, category?: string) {
  return []
}

async function computeAnalytics(dateRange: string) {
  return {}
}

export {}
