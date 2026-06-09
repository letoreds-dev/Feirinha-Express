import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../lib/prisma'

export default async function analyticsRoutes(fastify: FastifyInstance) {
  // Visão geral para admin
  fastify.get('/overview', async (request: FastifyRequest, reply: FastifyReply) => {
    const [
      totalOrders,
      totalProducts,
      totalMerchants,
      totalUsers,
      totalRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.merchant.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ])

    // Pedidos hoje
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const ordersToday = await prisma.order.count({
      where: { createdAt: { gte: today } },
    })

    // Pedidos últimos7 dias
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const ordersThisWeek = await prisma.order.findMany({
      where: { createdAt: { gte: weekAgo } },
      select: { total: true, createdAt: true },
    })

    const revenueThisWeek = ordersThisWeek.reduce((sum, o) => sum + o.total, 0)

    return {
      overview: {
        totalOrders,
        totalProducts,
        totalMerchants,
        totalUsers,
        totalRevenue: totalRevenue._sum.total || 0,
        ordersToday,
        revenueThisWeek,
      },
    }
  })

  // Analytics do lojista
  fastify.get<{ Params: { merchantId: string }; Querystring: { period?: string } }>('/merchant/:merchantId', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { merchantId } = request.params
    const { period = '30' } = request.query

    const days = parseInt(period || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const orders = await prisma.order.findMany({
      where: {
        merchantId,
        createdAt: { gte: startDate },
      },
      include: { items: true },
    })

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const totalOrders = orders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Pedidos por status
    const ordersByStatus = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top produtos
    const productSales: Record<string, { id: string; title: string; thumb: string; quantity: number; revenue: number }> = {}
    for (const order of orders) {
      for (const item of order.items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            title: '',
            thumb: '',
            quantity: 0,
            revenue: 0,
          }
        }
        productSales[item.productId].quantity += item.quantity
        productSales[item.productId].revenue += item.priceAtMoment * item.quantity
      }
    }

    const topProducts = await Promise.all(
      Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10)
        .map(async (data) => {
          const product = await prisma.product.findUnique({
            where: { id: data.id },
            select: { id: true, title: true, thumb: true },
          })
          return { ...product, ...data }
        })
    )

    // Evolução diária
    const dailyEvolution = orders.reduce((acc, o) => {
      const day = o.createdAt.toISOString().split('T')[0]
      if (!acc[day]) acc[day] = { orders: 0, revenue: 0 }
      acc[day].orders++
      acc[day].revenue += o.total
      return acc
    }, {} as Record<string, { orders: number; revenue: number }>)

    return {
      period,
      totalRevenue,
      totalOrders,
      avgOrderValue,
      ordersByStatus,
      topProducts,
      dailyEvolution,
    }
  })

  // Analytics do entregador
  fastify.get<{ Params: { driverId: string } }>('/driver/:driverId', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { driverId } = request.params

    const orders = await prisma.order.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const totalDeliveries = orders.length
    const totalEarnings = totalDeliveries * 5 // R$5 por entrega

    return {
      totalDeliveries,
      totalEarnings,
      recentOrders: orders.slice(0, 10),
    }
  })

  // Produtos mais vendidos globalmente
  fastify.get<{ Querystring: { limit?: number } }>('/top-products', async (request, reply) => {
    const { limit = 20 } = request.query || {}

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit || 20,
    })

    const products = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            merchant: { select: { storeName: true } },
          },
        })
        return {
          ...product,
          soldCount: item._sum.quantity || 0,
        }
      })
    )

    return { products }
  })

  // Lojas mais bem avaliadas
  fastify.get<{ Querystring: { limit?: number } }>('/top-stores', async (request, reply) => {
    const { limit = 10 } = request.query || {}

    const stores = await prisma.merchant.findMany({
      where: { status: 'active' },
      orderBy: { rating: 'desc' },
      take: limit || 10,
      select: {
        id: true,
        storeName: true,
        storeType: true,
        logo: true,
        rating: true,
        totalRatings: true,
        deliveryTime: true,
        deliveryFee: true,
      },
    })

    return { stores }
  })
}
