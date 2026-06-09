import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Limpar dados existentes
  console.log('🧹 Cleaning existing data...')
  await prisma.searchHistory.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.chatConversation.deleteMany()
  await prisma.deviceToken.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.loyaltyTransaction.deleteMany()
  await prisma.loyaltyAccount.deleteMany()
  await prisma.loyaltyReward.deleteMany()
  await prisma.walletTransaction.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.referral.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.couponUser.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.merchant.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Data cleaned')

  // ==================== CATEGORIAS ====================
  console.log('📂 Creating categories...')

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Lanches', slug: 'lanches', icon: '🍔', color: '#FF6B35', sortOrder: 1 }
    }),
    prisma.category.create({
      data: { name: 'Pizza', slug: 'pizza', icon: '🍕', color: '#E63946', sortOrder: 2 }
    }),
    prisma.category.create({
      data: { name: 'Japonesa', slug: 'japonesa', icon: '🍣', color: '#1D3557', sortOrder: 3 }
    }),
    prisma.category.create({
      data: { name: 'Brasileira', slug: 'brasileira', icon: '🍖', color: '#2A9D8F', sortOrder: 4 }
    }),
    prisma.category.create({
      data: { name: 'Saudável', slug: 'saudavel', icon: '🥗', color: '#52B788', sortOrder: 5 }
    }),
    prisma.category.create({
      data: { name: 'Doces', slug: 'doces', icon: '🍰', color: '#F72585', sortOrder: 6 }
    }),
    prisma.category.create({
      data: { name: 'Bebidas', slug: 'bebidas', icon: '🥤', color: '#4361EE', sortOrder: 7 }
    }),
    prisma.category.create({
      data: { name: 'Farmácia', slug: 'farmacia', icon: '💊', color: '#7209B7', sortOrder: 8 }
    }),
  ])

  console.log(`✅ ${categories.length} categories created`)

  // ==================== USUÁRIOS ====================
  console.log('👥 Creating users...')

  const hashedPassword = await hash('demo123', 10)

  // Cliente demo
  const clienteUser = await prisma.user.create({
    data: {
      email: 'cliente@demo.com',
      password: hashedPassword,
      name: 'João Silva',
      phone: '(11) 99999-0001',
      type: 'customer',
    }
  })

  // Lojistas
  const lanchesUser = await prisma.user.create({
    data: {
      email: 'burger@demo.com',
      password: hashedPassword,
      name: 'Carlos Santos',
      phone: '(11) 99999-0011',
      type: 'merchant',
    }
  })

  const pizzaUser = await prisma.user.create({
    data: {
      email: 'pizza@demo.com',
      password: hashedPassword,
      name: 'Maria Oliveira',
      phone: '(11) 99999-0022',
      type: 'merchant',
    }
  })

  const sushiUser = await prisma.user.create({
    data: {
      email: 'sushi@demo.com',
      password: hashedPassword,
      name: 'Takashi Yamamoto',
      phone: '(11) 99999-0033',
      type: 'merchant',
    }
  })

  const acaiUser = await prisma.user.create({
    data: {
      email: 'acai@demo.com',
      password: hashedPassword,
      name: 'Ana Paula',
      phone: '(11) 99999-0044',
      type: 'merchant',
    }
  })

  // Entregadores
  const entregador1 = await prisma.user.create({
    data: {
      email: 'entregador1@demo.com',
      password: hashedPassword,
      name: 'Pedro Costa',
      phone: '(11) 99999-0055',
      type: 'driver',
    }
  })

  const entregador2 = await prisma.user.create({
    data: {
      email: 'entregador2@demo.com',
      password: hashedPassword,
      name: 'Lucas Ferreira',
      phone: '(11) 99999-0066',
      type: 'driver',
    }
  })

  console.log('✅ Users created')

  // ==================== ENDEREÇOS ====================
  console.log('🏠 Creating addresses...')

  await prisma.address.create({
    data: {
      userId: clienteUser.id,
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      lat: -23.5505,
      lng: -46.6333,
      isDefault: true,
    }
  })

  console.log('✅ Addresses created')

  // ==================== LOJISTAS ====================
  console.log('🏪 Creating merchants...')

  const burgerKing = await prisma.merchant.create({
    data: {
      userId: lanchesUser.id,
      storeName: 'Burger King da Esquina',
      storeType: 'Lanches',
      storeDescription: 'Os melhores burgers artesanais da região!',
      logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
      banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
      rating: 4.8,
      totalRatings: 234,
      deliveryTime: '30-40 min',
      deliveryFee: 4.90,
      minOrderValue: 25,
      status: 'active',
    }
  })

  const pizzaMia = await prisma.merchant.create({
    data: {
      userId: pizzaUser.id,
      storeName: 'Pizza Mia',
      storeType: 'Pizza',
      storeDescription: 'Pizza italiana artesanal com massa fermentada por 48h',
      logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200',
      banner: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      rating: 4.9,
      totalRatings: 456,
      deliveryTime: '40-50 min',
      deliveryFee: 5.90,
      minOrderValue: 40,
      status: 'active',
    }
  })

  const sushiKen = await prisma.merchant.create({
    data: {
      userId: sushiUser.id,
      storeName: 'Sushi Ken',
      storeType: 'Japonesa',
      storeDescription: 'Sushi fresco preparado na hora',
      logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200',
      banner: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
      rating: 4.7,
      totalRatings: 189,
      deliveryTime: '35-45 min',
      deliveryFee: 6.90,
      minOrderValue: 50,
      status: 'active',
    }
  })

  const acaiPower = await prisma.merchant.create({
    data: {
      userId: acaiUser.id,
      storeName: 'Açaí Power',
      storeType: 'Saudável',
      storeDescription: 'Açaí natural 100% orgânico',
      logo: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200',
      banner: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
      rating: 4.6,
      totalRatings: 98,
      deliveryTime: '20-30 min',
      deliveryFee: 3.90,
      minOrderValue: 20,
      status: 'active',
    }
  })

  console.log('✅ Merchants created')

  // ==================== ENTREGADORES ====================
  console.log('🚴 Creating drivers...')

  await prisma.driver.create({
    data: {
      userId: entregador1.id,
      status: 'available',
      currentLat: -23.5505,
      currentLng: -46.6333,
    }
  })

  await prisma.driver.create({
    data: {
      userId: entregador2.id,
      status: 'available',
      currentLat: -23.5510,
      currentLng: -46.6340,
    }
  })

  console.log('✅ Drivers created')

  // ==================== PRODUTOS ====================
  console.log('🍔 Creating products...')

  // Burger King
  const burgerProducts = await Promise.all([
    prisma.product.create({
      data: {
        merchantId: burgerKing.id,
        title: 'Classic Burger',
        description: 'Hambúrguer artesanal 180g, queijo cheddar, alface, tomate e molho especial',
        price: 28.90,
        originalPrice: 32.90,
        thumb: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Lanches',
        tags: 'hamburguer, artesanal, lanche',
        active: true,
        inStock: true,
        stockQty: 50,
        preparationTime: 20,
        calories: 650,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: burgerKing.id,
        title: 'Double Cheese Burger',
        description: 'Dois hambúrgueres 180g, queijo cheddar, bacon crocante',
        price: 38.90,
        thumb: 'https://images.unsplash.com/photo-1553979459-d9f459e0e31b?w=400',
        category: 'Lanches',
        tags: 'hamburguer, cheddar, bacon',
        active: true,
        inStock: true,
        stockQty: 30,
        preparationTime: 25,
        calories: 950,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: burgerKing.id,
        title: 'Batata Frita M',
        description: 'Batata frita crocante 200g',
        price: 14.90,
        thumb: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400',
        category: 'Lanches',
        tags: 'batata, frita, sides',
        active: true,
        inStock: true,
        stockQty: 100,
        preparationTime: 10,
        calories: 380,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: burgerKing.id,
        title: 'Refrigerante Lata',
        description: 'Coca-Cola, Guaraná ou Sprite 350ml',
        price: 6.90,
        thumb: 'https://images.unsplash.com/photo-1629203772207-c5c1c71a732e?w=400',
        category: 'Bebidas',
        tags: 'refrigerante, coca, guaraná',
        active: true,
        inStock: true,
        stockQty: 200,
        preparationTime: 2,
        calories: 140,
      }
    }),
  ])

  // Pizza Mia
  const pizzaProducts = await Promise.all([
    prisma.product.create({
      data: {
        merchantId: pizzaMia.id,
        title: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão fresco',
        price: 45.90,
        originalPrice: 55.90,
        thumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        category: 'Pizza',
        tags: 'pizza, margherita, italiana',
        active: true,
        inStock: true,
        stockQty: 40,
        preparationTime: 25,
        calories: 850,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: pizzaMia.id,
        title: 'Pizza Calabresa',
        description: 'Molho de tomate, mussarela, calabresa, cebola',
        price: 42.90,
        thumb: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizza',
        tags: 'pizza, calabresa',
        active: true,
        inStock: true,
        stockQty: 40,
        preparationTime: 25,
        calories: 820,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: pizzaMia.id,
        title: 'Pizza Quatro Queijos',
        description: 'Mussarela, gorgonzola, provolone e parmesão',
        price: 52.90,
        thumb: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        category: 'Pizza',
        tags: 'pizza, queijos',
        active: true,
        inStock: true,
        stockQty: 30,
        preparationTime: 28,
        calories: 920,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: pizzaMia.id,
        title: 'Pizza Pepperoni',
        description: 'Molho de tomate, mussarela, pepperoni artesanal',
        price: 48.90,
        thumb: 'https://images.unsplash.com/photo-1628840042765-47811e6b9937?w=400',
        category: 'Pizza',
        tags: 'pizza, pepperoni',
        active: true,
        inStock: true,
        stockQty: 35,
        preparationTime: 25,
        calories: 880,
      }
    }),
  ])

  // Sushi Ken
  const sushiProducts = await Promise.all([
    prisma.product.create({
      data: {
        merchantId: sushiKen.id,
        title: 'Combo Tokio',
        description: '8 sashimi salmão, 6 hot roll, 4 uramaki',
        price: 65.90,
        originalPrice: 78.90,
        thumb: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
        category: 'Japonesa',
        tags: 'sushi, sashimi, combo',
        active: true,
        inStock: true,
        stockQty: 25,
        preparationTime: 20,
        calories: 420,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: sushiKen.id,
        title: 'Temaki Salmão',
        description: 'Temaki artesanal com salmão fresco 200g',
        price: 32.90,
        thumb: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
        category: 'Japonesa',
        tags: 'temaki, salmon',
        active: true,
        inStock: true,
        stockQty: 40,
        preparationTime: 15,
        calories: 280,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: sushiKen.id,
        title: 'Hot Roll 12 unid',
        description: '12 hot rolls com cobertura especial',
        price: 42.90,
        thumb: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1ad56?w=400',
        category: 'Japonesa',
        tags: 'hot roll, sushi',
        active: true,
        inStock: true,
        stockQty: 30,
        preparationTime: 15,
        calories: 350,
      }
    }),
  ])

  // Açaí Power
  const acaiProducts = await Promise.all([
    prisma.product.create({
      data: {
        merchantId: acaiPower.id,
        title: 'Açaí 300ml',
        description: 'Açaí natural cremoso 300ml',
        price: 22.90,
        originalPrice: 27.90,
        thumb: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
        category: 'Saudável',
        tags: 'acai, natural, saudavel',
        active: true,
        inStock: true,
        stockQty: 60,
        preparationTime: 5,
        calories: 180,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: acaiPower.id,
        title: 'Açaí 500ml + Granola',
        description: 'Açaí 500ml com granola e mel',
        price: 32.90,
        thumb: 'https://images.unsplash.com/photo-1587049352846-4a222e783d4d?w=400',
        category: 'Saudável',
        tags: 'acai, granola, mel',
        active: true,
        inStock: true,
        stockQty: 45,
        preparationTime: 8,
        calories: 280,
      }
    }),
    prisma.product.create({
      data: {
        merchantId: acaiPower.id,
        title: 'Açaí 700ml +3 complementos',
        description: 'Açaí grande com banana, morango e granola',
        price: 42.90,
        thumb: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
        category: 'Saudável',
        tags: 'acai, banana, morango',
        active: true,
        inStock: true,
        stockQty: 35,
        preparationTime: 10,
        calories: 380,
      }
    }),
  ])

  console.log(`✅ ${burgerProducts.length + pizzaProducts.length + sushiProducts.length + acaiProducts.length} products created`)

  // ==================== CUPONS ====================
  console.log('🎟️ Creating coupons...')

  await prisma.coupon.create({
    data: {
      code: 'BEMVINDO',
      title: '10% off na primeira compra',
      description: 'Desconto de 10% no seu primeiro pedido',
      type: 'percentage',
      value: 10,
      minOrderValue: 30,
      maxDiscount: 15,
      isGlobal: true,
      maxPerUser: 1,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    }
  })

  await prisma.coupon.create({
    data: {
      code: 'FRETE5',
      title: 'Frete grátis',
      description: 'Frete grátis em qualquer pedido',
      type: 'free_delivery',
      value: 5.90,
      minOrderValue: 40,
      isGlobal: true,
      maxPerUser: 3,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    }
  })

  await prisma.coupon.create({
    data: {
      code: 'PIZZA20',
      title: '20% off Pizza',
      description: 'Desconto de 20% em pizzas',
      type: 'percentage',
      value: 20,
      minOrderValue: 50,
      maxDiscount: 20,
      merchantId: pizzaMia.id,
      isGlobal: false,
      maxPerUser: 2,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    }
  })

  await prisma.coupon.create({
    data: {
      code: 'ACAI15',
      title: 'R$15 off Açaí',
      description: 'R$15 de desconto em açaí',
      type: 'fixed',
      value: 15,
      minOrderValue: 40,
      merchantId: acaiPower.id,
      isGlobal: false,
      maxPerUser: 1,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      isActive: true,
    }
  })

  console.log('✅ Coupons created')

  // ==================== RECOMPENSAS FIDELIDADE ====================
  console.log('🏆 Creating loyalty rewards...')

  await prisma.loyaltyReward.createMany({
    data: [
      { name: 'R$5 de desconto', type: 'discount', value: 5, pointsCost: 100, isActive: true },
      { name: 'R$10 de desconto', type: 'discount', value: 10, pointsCost: 200, isActive: true },
      { name: 'Frete grátis', type: 'discount', value: 5.90, pointsCost: 150, isActive: true },
      { name: 'Açaí Grátis', type: 'free_product', value: 22.90, pointsCost: 500, isActive: true },
      { name: 'Pizza Média Grátis', type: 'free_product', value: 45.90, pointsCost: 800, isActive: true },
    ]
  })

  console.log('✅ Loyalty rewards created')

  // ==================== CONTA FIDELIDADE CLIENTE ====================
  console.log('⭐ Creating loyalty account...')

  await prisma.loyaltyAccount.create({
    data: {
      userId: clienteUser.id,
      points: 150,
      lifetimePoints: 150,
      tier: 'bronze',
    }
  })

  console.log('✅ Loyalty account created')

  // ==================== CARTEIRA CLIENTE ====================
  console.log('💰 Creating wallet...')

  await prisma.wallet.create({
    data: {
      userId: clienteUser.id,
      balance: 50,
      cashbackBalance: 10,
    }
  })

  console.log('✅ Wallet created')

  // ==================== PEDIDO DE EXEMPLO ====================
  console.log('📦 Creating sample order...')

  const address = await prisma.address.findFirst({
    where: { userId: clienteUser.id }
  })

  const sampleOrder = await prisma.order.create({
    data: {
      customerId: clienteUser.id,
      merchantId: burgerKing.id,
      addressId: address?.id,
      status: 'delivered',
      subtotal: 43.80,
      deliveryFee: 4.90,
      discount: 0,
      total: 48.70,
      paymentMethod: 'pix',
      paymentStatus: 'paid',
      notes: 'Sem cebola, por favor',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }
  })

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: sampleOrder.id,
        productId: burgerProducts[0].id,
        merchantId: burgerKing.id,
        quantity: 1,
        priceAtMoment: 28.90,
      },
      {
        orderId: sampleOrder.id,
        productId: burgerProducts[2].id,
        merchantId: burgerKing.id,
        quantity: 1,
        priceAtMoment: 14.90,
      },
    ]
  })

  console.log('✅ Sample order created')

  // ==================== REVIEW ====================
  console.log('⭐ Creating review...')

  await prisma.review.create({
    data: {
      userId: clienteUser.id,
      merchantId: burgerKing.id,
      orderId: sampleOrder.id,
      rating: 5,
      comment: 'Hambúrguer incrível! A carne estava muito saborosa e o atendimento foi excelente.',
      foodRating: 5,
      deliveryRating: 5,
    }
  })

  console.log('✅ Review created')

  // ==================== RESUMO ====================
  console.log('\n📊 Seed Summary:')
  console.log(`   - ${categories.length} categorias`)
  console.log(`   - 7 usuários`)
  console.log(`   - 4 lojistas`)
  console.log(`   - 2 entregadores`)
  console.log(`   - ${burgerProducts.length + pizzaProducts.length + sushiProducts.length + acaiProducts.length} produtos`)
  console.log(`   - 4 cupons`)
  console.log(`   - 5 recompensas de fidelidade`)
  console.log(`   - 1 pedido de exemplo`)
  console.log(`   - 1 avaliação`)

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📧 Demo accounts:')
  console.log('   Cliente: cliente@demo.com / demo123')
  console.log('   Lojista: burger@demo.com / demo123')
  console.log('   Lojista: pizza@demo.com / demo123')
  console.log('   Lojista: sushi@demo.com / demo123')
  console.log('   Lojista: acai@demo.com / demo123')
  console.log('   Entregador: entregador1@demo.com / demo123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
