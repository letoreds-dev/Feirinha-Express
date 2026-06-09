import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import rateLimitPlugin from './plugins/rate-limit'
import cachePlugin from './plugins/cache'
import errorHandlerPlugin from './plugins/error-handler'
import authRoutes from './routes/auth'
import storeRoutes from './routes/stores'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import reviewRoutes from './routes/reviews'
import couponRoutes from './routes/coupons'
import loyaltyRoutes from './routes/loyalty'
import walletRoutes from './routes/wallet'
import addressRoutes from './routes/addresses'
import favoriteRoutes from './routes/favorites'
import notificationRoutes from './routes/notifications'
import chatRoutes from './routes/chat'
import driverRoutes from './routes/drivers'
import referralRoutes from './routes/referrals'
import categoryRoutes from './routes/categories'
import searchRoutes from './routes/search'
import analyticsRoutes from './routes/analytics'
import './types'

async function main() {
  const fastify = Fastify({
    logger: true,
  })

  // Plugins
  await fastify.register(cors, {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'feirinha-express-secret-change-in-production',
  })

  // Rate limiting plugin
  await fastify.register(rateLimitPlugin)

  // Cache plugin (Redis)
  await fastify.register(cachePlugin)

  // Plugin de tratamento de erros (deve ser registrado antes das rotas)
  await fastify.register(errorHandlerPlugin)

  // Auth decorator
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      const decoded = await request.jwtVerify()
      // O user agora está tipado corretamente via FastifyJWT
    } catch (err) {
      reply.code(401).send({ error: 'Não autenticado' })
    }
  })

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date(),
    version: '2.0.0',
    features: [
      'reviews', 'coupons', 'loyalty', 'wallet',
      'addresses', 'favorites', 'notifications', 'chat',
      'drivers', 'referrals', 'categories', 'search', 'analytics',
      'redis-cache'
    ]
  }))

  // Register routes
  await fastify.register(authRoutes, { prefix: '/api/auth' })
  await fastify.register(storeRoutes, { prefix: '/api/stores' })
  await fastify.register(productRoutes, { prefix: '/api/products' })
  await fastify.register(orderRoutes, { prefix: '/api/orders' })
  await fastify.register(reviewRoutes, { prefix: '/api/reviews' })
  await fastify.register(couponRoutes, { prefix: '/api/coupons' })
  await fastify.register(loyaltyRoutes, { prefix: '/api/loyalty' })
  await fastify.register(walletRoutes, { prefix: '/api/wallet' })
  await fastify.register(addressRoutes, { prefix: '/api/addresses' })
  await fastify.register(favoriteRoutes, { prefix: '/api/favorites' })
  await fastify.register(notificationRoutes, { prefix: '/api/notifications' })
  await fastify.register(chatRoutes, { prefix: '/api/chat' })
  await fastify.register(driverRoutes, { prefix: '/api/drivers' })
  await fastify.register(referralRoutes, { prefix: '/api/referrals' })
  await fastify.register(categoryRoutes, { prefix: '/api/categories' })
  await fastify.register(searchRoutes, { prefix: '/api/search' })
  await fastify.register(analyticsRoutes, { prefix: '/api/analytics' })

  // Start server
  try {
    const port = parseInt(process.env.PORT || '3001')
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 Feirinha Express API v2.0 rodando em http://localhost:${port}`)
    console.log(`📋 Rotas disponíveis:`)
    console.log(`   - /api/auth (autenticação)`)
    console.log(`   - /api/stores (lojistas)`)
    console.log(`   - /api/products (produtos)`)
    console.log(`   - /api/orders (pedidos)`)
    console.log(`   - /api/reviews (avaliações)`)
    console.log(`   - /api/coupons (cupons)`)
    console.log(`   - /api/loyalty (fidelidade)`)
    console.log(`   - /api/wallet (carteira)`)
    console.log(`   - /api/addresses (endereços)`)
    console.log(`   - /api/favorites (favoritos)`)
    console.log(`   - /api/notifications (notificações)`)
    console.log(`   - /api/chat (chat)`)
    console.log(`   - /api/drivers (entregadores)`)
    console.log(`   - /api/referrals (indicações)`)
    console.log(`   - /api/categories (categorias)`)
    console.log(`   - /api/search (busca)`)
    console.log(`   - /api/analytics (analytics)`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main()
