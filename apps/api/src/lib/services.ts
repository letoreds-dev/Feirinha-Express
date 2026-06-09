import prisma from '../lib/prisma'

// ==================== ORDER SERVICE ====================

export async function createOrder(data: {
  customerId: string
  merchantId: string
  addressId: string
  items: Array<{ productId: string; quantity: number; priceAtMoment: number }>
  paymentMethod: string
  couponCode?: string
  scheduledAt?: Date
  notes?: string
}) {
  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + (item.priceAtMoment * item.quantity), 0)

  // Get delivery fee from merchant
  const merchant = await prisma.merchant.findUnique({ where: { id: data.merchantId } })
  const deliveryFee = merchant?.deliveryFee || 5.90

  // Apply coupon discount if provided
  let discount = 0
  if (data.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode } })
    if (coupon && coupon.isActive) {
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
      } else if (coupon.type === 'fixed') {
        discount = coupon.value
      } else if (coupon.type === 'free_delivery') {
        discount = deliveryFee
      }
    }
  }

  const total = subtotal + deliveryFee - discount

  // Create order
  const order = await prisma.order.create({
    data: {
      customerId: data.customerId,
      merchantId: data.merchantId,
      addressId: data.addressId,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'pending',
      scheduledAt: data.scheduledAt,
      notes: data.notes,
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          merchantId: data.merchantId,
          quantity: item.quantity,
          priceAtMoment: item.priceAtMoment,
        })),
      },
    },
    include: { items: true, address: true },
  })

  // Generate PIX code if payment method is PIX
  if (data.paymentMethod === 'pix') {
    const pixCode = `00020126580014br.gov.bcb.pix0136${Date.now()}5204000053039865802BR5925FEIRINHA6009SAO PAULO62140510${Date.now()}6304`
    await prisma.order.update({
      where: { id: order.id },
      data: {
        pixCode,
        pixExpiration: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
    })
  }

  // Update coupon usage
  if (data.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode } })
    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      })
      await prisma.couponUser.create({
        data: {
          userId: data.customerId,
          couponId: coupon.id,
          orderId: order.id,
          usedAt: new Date(),
        },
      })
    }
  }

  // Add loyalty points
  const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
    where: { userId: data.customerId },
  })
  if (loyaltyAccount) {
    const pointsEarned = Math.floor(subtotal) // 1 point per real spent
    await prisma.loyaltyTransaction.create({
      data: {
        accountId: loyaltyAccount.id,
        type: 'earn',
        points: pointsEarned,
        description: 'Pontos do pedido',
        orderId: order.id,
      },
    })
    await prisma.loyaltyAccount.update({
      where: { userId: data.customerId },
      data: {
        points: { increment: pointsEarned },
        lifetimePoints: { increment: pointsEarned },
      },
    })
  }

  // Create notification
  await prisma.notification.create({
    data: {
      userId: data.customerId,
      type: 'order',
      title: 'Pedido Confirmado! 🎉',
      body: `Seu pedido #${order.id.slice(-4)} foi criado com sucesso`,
      data: JSON.stringify({ orderId: order.id }),
    },
  })

  return order
}

export async function updateOrderStatus(orderId: string, status: string, driverId?: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...(driverId && { driverId }),
    },
    include: { customer: true, merchant: true },
  })

  // Notify customer
  const statusMessages: Record<string, { title: string; body: string }> = {
    confirmed: { title: 'Pedido Confirmado! ✓', body: 'A loja confirmou seu pedido' },
    separating: { title: 'Pedido em separação 📦', body: 'Sua compra está sendo separada' },
    ready: { title: 'Pedido pronto! ✅', body: 'Seu pedido está pronto para retirada' },
    on_the_way: { title: 'Pedido a caminho! 🚀', body: 'Seu pedido saiu para entrega' },
    delivered: { title: 'Pedido Entregue! 🎉', body: 'Aproveite sua refeição!' },
    cancelled: { title: 'Pedido Cancelado', body: 'Seu pedido foi cancelado' },
  }

  if (statusMessages[status]) {
    await prisma.notification.create({
      data: {
        userId: order.customerId,
        type: 'order',
        title: statusMessages[status].title,
        body: statusMessages[status].body,
        data: JSON.stringify({ orderId: order.id }),
      },
    })
  }

  return order
}

export async function confirmPayment(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'confirmed',
      status: 'confirmed',
    },
  })

  // Add cashback to wallet (5% of order total)
  const cashback = order.total * 0.05
  let wallet = await prisma.wallet.findUnique({
    where: { userId: order.customerId },
  })

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId: order.customerId },
    })
  }

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: 'cashback',
      amount: cashback,
      description: `Cashback de ${5}% do pedido`,
      orderId: order.id,
    },
  })

  await prisma.wallet.update({
    where: { userId: order.customerId },
    data: { cashbackBalance: { increment: cashback } },
  })

  return order
}

// ==================== PRODUCT SERVICE ====================

export async function searchProducts(query: string, filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  storeId?: string
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'rating'
}) {
  const where: any = {
    active: true,
    inStock: true,
  }

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
      { tags: { contains: query } },
    ]
  }

  if (filters?.category) {
    where.category = filters.category
  }

  if (filters?.minPrice || filters?.maxPrice) {
    where.price = {}
    if (filters.minPrice) where.price.gte = filters.minPrice
    if (filters.maxPrice) where.price.lte = filters.maxPrice
  }

  if (filters?.storeId) {
    where.merchantId = filters.storeId
  }

  const orderBy: any = {}
  if (filters?.sort === 'price-asc') orderBy.price = 'asc'
  else if (filters?.sort === 'price-desc') orderBy.price = 'desc'
  else if (filters?.sort === 'rating') orderBy.merchant = { rating: 'desc' }
  else orderBy.createdAt = 'desc'

  return prisma.product.findMany({
    where,
    orderBy,
    include: {
      merchant: {
        select: {
          id: true,
          storeName: true,
          logo: true,
          rating: true,
          deliveryTime: true,
          deliveryFee: true,
        },
      },
    },
    take: 30,
  })
}

export async function getProductRecommendations(userId: string, limit = 10) {
  // Get user's favorite categories
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { product: true },
    take: 20,
  })

  const categories = [...new Set(favorites.map(f => f.product.category))]

  if (categories.length === 0) {
    // Return popular products if no favorites
    return prisma.product.findMany({
      where: { active: true, inStock: true },
      include: {
        merchant: { select: { storeName: true, logo: true, rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  return prisma.product.findMany({
    where: {
      active: true,
      inStock: true,
      category: { in: categories },
    },
    include: {
      merchant: { select: { storeName: true, logo: true, rating: true } },
    },
    take: limit,
  })
}

// ==================== LOYALTY SERVICE ====================

export async function checkAndUpgradeTier(userId: string) {
  const account = await prisma.loyaltyAccount.findUnique({
    where: { userId },
  })

  if (!account) return null

  let newTier = account.tier
  const lifetimePoints = account.lifetimePoints

  if (lifetimePoints >= 5000 && account.tier !== 'platinum') {
    newTier = 'platinum'
  } else if (lifetimePoints >= 1500 && ['bronze', 'silver'].includes(account.tier)) {
    newTier = 'gold'
  } else if (lifetimePoints >= 500 && account.tier === 'bronze') {
    newTier = 'silver'
  }

  if (newTier !== account.tier) {
    await prisma.loyaltyAccount.update({
      where: { userId },
      data: { tier: newTier },
    })

    // Notify user
    await prisma.notification.create({
      data: {
        userId,
        type: 'loyalty',
        title: `⭐ Você subiu para ${newTier}!`,
        body: 'Parabéns! Seu novo nível traz mais benefícios',
      },
    })
  }

  return newTier
}

// ==================== FRAUD DETECTION ====================

export async function detectFraud(userId: string, orderData: any): Promise<{ isFraud: boolean; reason?: string }> {
  // Check for suspicious patterns
  const recentOrders = await prisma.order.findMany({
    where: {
      customerId: userId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  })

  // More than 5 orders in 24 hours
  if (recentOrders.length > 5) {
    return { isFraud: true, reason: 'Muitos pedidos em 24 horas' }
  }

  // Order value > R$1000
  if (orderData.total > 1000) {
    return { isFraud: true, reason: 'Valor de pedido elevado' }
  }

  // Check for cancelled/refunded orders
  const cancelledOrders = await prisma.order.count({
    where: {
      customerId: userId,
      status: 'cancelled',
    },
  })

  if (cancelledOrders > 3) {
    return { isFraud: true, reason: 'Histórico de cancelamentos' }
  }

  return { isFraud: false }
}

// ==================== REFERRAL SERVICE ====================

export async function processReferralCompletion(referrerId: string, refereeId: string) {
  const referral = await prisma.referral.findFirst({
    where: { referrerId, refereeId, status: 'pending' },
  })

  if (!referral) return null

  // Update referral status
  await prisma.referral.update({
    where: { id: referral.id },
    data: { status: 'completed', completedAt: new Date(), rewardSent: true },
  })

  // Give cashback to referrer
  let wallet = await prisma.wallet.findUnique({
    where: { userId: referrerId },
  })

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId: referrerId },
    })
  }

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: 'bonus',
      amount: 10,
      description: 'Bônus por indicação concluída',
    },
  })

  await prisma.wallet.update({
    where: { userId: referrerId },
    data: { cashbackBalance: { increment: 10 } },
  })

  // Notify referrer
  await prisma.notification.create({
    data: {
      userId: referrerId,
      type: 'loyalty',
      title: '👥 Indicação confirmada!',
      body: 'Seu amigo fez a primeira compra. Você ganhou R$10 de cashback!',
    },
  })

  return referral
}
