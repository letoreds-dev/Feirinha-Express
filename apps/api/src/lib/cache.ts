import { FastifyInstance } from 'fastify'

interface CacheOptions {
  ttl?: number // seconds
}

export async function getCache<T>(fastify: FastifyInstance, key: string): Promise<T | null> {
  try {
    const cached = await fastify.cache.get(key)
    if (cached) {
      return JSON.parse(cached) as T
    }
    return null
  } catch (error) {
    fastify.log.error({ error, key }, 'Cache get error')
    return null
  }
}

export async function setCache<T>(
  fastify: FastifyInstance,
  key: string,
  value: T,
  options?: CacheOptions
): Promise<void> {
  try {
    const ttl = options?.ttl ?? 3600 // 1 hour default
    await fastify.cache.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    fastify.log.error({ error, key }, 'Cache set error')
  }
}

export async function invalidateCache(fastify: FastifyInstance, pattern: string): Promise<void> {
  try {
    const keys = await fastify.cache.keys(pattern)
    if (keys.length > 0) {
      await fastify.cache.del(...keys)
    }
  } catch (error) {
    fastify.log.error({ error, pattern }, 'Cache invalidate error')
  }
}

export async function invalidateCachePattern(fastify: FastifyInstance, pattern: string): Promise<void> {
  try {
    const stream = fastify.cache.scanStream({
      match: pattern,
      count: 100,
    })

    const keysToDelete: string[] = []

    for await (const keys of stream) {
      keysToDelete.push(...keys)
    }

    if (keysToDelete.length > 0) {
      // Delete in batches of 100
      const batchSize = 100
      for (let i = 0; i < keysToDelete.length; i += batchSize) {
        const batch = keysToDelete.slice(i, i + batchSize)
        await fastify.cache.del(...batch)
      }
    }
  } catch (error) {
    fastify.log.error({ error, pattern }, 'Cache invalidate pattern error')
  }
}
