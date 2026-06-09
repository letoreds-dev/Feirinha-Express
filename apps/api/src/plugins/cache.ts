import fp from 'fastify-plugin'
import Redis from 'ioredis'
import { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    cache: Redis
  }
}

async function cachePlugin(fastify: FastifyInstance) {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  })

  try {
    await redis.connect()
    fastify.log.info('Redis connected successfully')
  } catch (err) {
    fastify.log.error({ err }, 'Failed to connect to Redis')
    throw err
  }

  fastify.decorate('cache', redis)

  fastify.addHook('onClose', async () => {
    await redis.quit()
    fastify.log.info('Redis connection closed')
  })
}

export default fp(cachePlugin, {
  name: 'cache',
})
