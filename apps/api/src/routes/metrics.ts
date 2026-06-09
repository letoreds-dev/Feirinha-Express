import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

export default async function metricsRoutes(fastify: FastifyInstance) {
  // GET /api/metrics/overview - Métricas gerais
  fastify.get('/overview', async () => {
    const [totalOrders, totalProducts, totalMerchants, totalUsers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.merchant.count(),
      prisma.user.count(),
    ])

    return {
      orders: totalOrders,
      products: totalProducts,
      merchants: totalMerchants,
      users: totalUsers,
    }
  })

  // GET /api/metrics/sales - Vendas por período
  fastify.get('/sales', async (request) => {
    const { days = '30' } = request.query as { days?: string }
    const daysNum = parseInt(days) || 30

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNum)

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: {
        total: true,
        status: true,
        createdAt: true,
      },
    })

    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
    const orderCount = orders.length
    const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0

    return {
      period: daysNum,
      totalSales,
      orderCount,
      avgOrderValue,
      ordersByStatus: orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }
  })

  // GET /api/metrics/top-products - Produtos mais vendidos
  fastify.get('/top-products', async () => {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    })

    const products = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, title: true, price: true, thumb: true },
        })
        return { ...product, soldCount: item._sum.quantity || 0 }
      })
    )

    return { products }
  })
}