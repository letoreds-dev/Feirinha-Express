# Otimizacao de Queries - Feirinha Express

## 1. Indices Recomendados

```prisma
// Adicionar ao schema.prisma

model Order {
  id              String   @id @default(cuid())
  customerId      String
  merchantId      String
  driverId        String?
  addressId       String
  status          String   @default("pending")
  paymentStatus   String   @default("pending")
  createdAt       DateTime @default(now())

  // Indices para consultas frequentes
  @@index([customerId, createdAt])
  @@index([merchantId, status])
  @@index([merchantId, createdAt])
  @@index([driverId, status])
  @@index([createdAt])
}

model Product {
  id           String   @id @default(cuid())
  merchantId   String
  title        String
  description  String?
  category     String
  price        Float
  active       Boolean  @default(true)
  inStock      Boolean  @default(true)
  createdAt    DateTime @default(now())

  @@index([merchantId, active])
  @@index([category, active])
  @@index([active, createdAt])
  @@index([price])
}

model Review {
  id         String   @id @default(cuid())
  userId     String
  merchantId String
  productId  String?
  orderId    String
  rating     Int
  createdAt  DateTime @default(now())

  @@index([merchantId, createdAt])
  @@index([merchantId, rating])
  @@index([productId])
  @@index([userId, orderId])
}

model Merchant {
  id        String   @id @default(cuid())
  userId    String   @unique
  storeName String
  storeType String
  status    String   @default("pending")
  rating    Float    @default(5.0)
  isOpen    Boolean  @default(true)
  createdAt DateTime @default(now())

  @@index([status, rating])
  @@index([status, isOpen])
  @@index([storeType, status])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  priceAtMoment Float

  @@index([productId])
}
```

## 2. Queries Problematicas Identificadas

### CRITICO - orders.ts:84-91 - N+1 Query ao criar pedido

```typescript
// ANTES - N+1 Query (ATE 20 QUERIES!)
for (const item of body.items) {
  const product = await prisma.product.findUnique({
    where: { id: item.productId },
  })
  if (product) {
    total += product.price * item.quantity
  }
}
```

```typescript
// DEPOIS - 1 query com where IN
const productIds = body.items.map(item => item.productId)
const products = await prisma.product.findMany({
  where: { id: { in: productIds } },
  select: { id: true, price: true },
})
const productMap = new Map(products.map(p => [p.id, p]))

let total = 0
for (const item of body.items) {
  const product = productMap.get(item.productId)
  if (product) {
    total += product.price * item.quantity
  }
}
```

### CRITICO - reviews.ts:105-109 - Agregacao manual

```typescript
// ANTES - Busca TODOS os reviews para calcular media
const allReviews = await prisma.review.findMany({
  where: { merchantId: body.merchantId },
  select: { rating: true },
})
const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
```

```typescript
// DEPOIS - Aggregation no banco
const stats = await prisma.review.aggregate({
  where: { merchantId: body.merchantId },
  _avg: { rating: true },
  _count: true,
})
const avgRating = stats._avg.rating || 0
```

### ALTO - analytics.ts:33-38 - Busca tudo e processa em JS

```typescript
// ANTES - Busca todos os pedidos da semana
const ordersThisWeek = await prisma.order.findMany({
  where: { createdAt: { gte: weekAgo } },
  select: { total: true, createdAt: true },
})
const revenueThisWeek = ordersThisWeek.reduce((sum, o) => sum + o.total, 0)
```

```typescript
// DEPOIS - Aggregation no banco
const revenueThisWeek = await prisma.order.aggregate({
  where: { createdAt: { gte: weekAgo } },
  _sum: { total: true },
  _count: true,
})
```

### ALTO - analytics.ts:64-70 - Sem paginacao

```typescript
// ANTES - Pode retornar milhoes de pedidos
const orders = await prisma.order.findMany({
  where: {
    merchantId,
    createdAt: { gte: startDate },
  },
  include: { items: true },
})
```

```typescript
// DEPOIS - Com paginacao e agregacao
const [orders, stats] = await Promise.all([
  prisma.order.findMany({
    where: { merchantId, createdAt: { gte: startDate } },
    include: { items: true },
    take: 100,
    orderBy: { createdAt: 'desc' },
  }),
  prisma.order.aggregate({
    where: { merchantId, createdAt: { gte: startDate } },
    _sum: { total: true },
    _count: true,
  }),
])
```

### MEDIO - analytics.ts:94-105 - N+1 para top products

```typescript
// ANTES - N+1 Query
const topProducts = await Promise.all(
  Object.entries(productSales)
    .slice(0, 10)
    .map(async ([productId, data]) => {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, title: true, thumb: true },
      })
      return { ...product, ...data }
    })
)
```

```typescript
// DEPOIS - 1 query com include
const topProducts = await prisma.product.findMany({
  where: { id: { in: Object.keys(productSales) } },
  select: { id: true, title: true, thumb: true },
})
const productMap = new Map(topProducts.map(p => [p.id, p]))

return Object.entries(productSales)
  .sort((a, b) => b[1].quantity - a[1].quantity)
  .slice(0, 10)
  .map(([productId, data]) => ({
    ...productMap.get(productId),
    ...data,
  }))
```

## 3. Cache Strategy

### stores.ts - Melhorar cache key

```typescript
// ATUAL - Cache invalido quando qualquer loja muda
const cacheKey = 'stores:list'

// MELHOR - Cache por segmento
const getStoresByType = async (storeType?: string) => {
  const cacheKey = storeType
    ? `stores:type:${storeType}`
    : 'stores:all:active'

  const cached = await getCache(fastify, cacheKey)
  if (cached) return cached

  const stores = await prisma.merchant.findMany({
    where: {
      status: 'active',
      ...(storeType && { storeType }),
    },
    include: {
      user: { select: { name: true } },
      _count: { select: { products: true } }, // Mais eficiente que incluir todos
    },
  })

  await setCache(fastify, cacheKey, stores, { ttl: 300 })
  return stores
}
```

### products.ts - Adicionar paginacao

```typescript
// Adicionar cursor-based pagination
fastify.get('/', asyncHandler(async (request) => {
  const { storeId, search, cursor, limit = 20 } = request.query

  const cacheKey = `products:${storeId || 'all'}:${search || 'no-search'}:${cursor || 'first'}`

  const cached = await getCache(fastify, cacheKey)
  if (cached) return cached

  const products = await prisma.product.findMany({
    where: { active: true, ... },
    take: limit + 1, // +1 para verificar se ha proxima pagina
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: { merchant: { select: { storeName: true, logo: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const hasMore = products.length > limit
  const results = hasMore ? products.slice(0, -1) : products
  const nextCursor = hasMore ? results[results.length - 1].id : null

  await setCache(fastify, cacheKey, results, { ttl: 120 })

  return { products: results, nextCursor }
}))
```

## 4. Select vs Include

```typescript
// Quando nao precisa de relations
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    type: true,
    createdAt: true,
    // Nao busca merchant, driver, orders, etc
  }
})

// Para listas, usar _count ao inves de include
const stores = await prisma.merchant.findMany({
  where: { status: 'active' },
  select: {
    id: true,
    storeName: true,
    rating: true,
    _count: {
      select: {
        products: { where: { active: true } },
        orders: true,
      },
    },
  },
})
// Mais eficiente que include: { products: true }
```

## 5. Consultas Paralelas com Promise.all

```typescript
// ANTES - Sequencial
const stats = await prisma.review.aggregate({ where: { merchantId }, _avg: { rating: true } })
const count = await prisma.review.count({ where: { merchantId } })
const recent = await prisma.review.findMany({ where: { merchantId }, take: 10 })

// DEPOIS - Paralelo
const [stats, count, recent] = await Promise.all([
  prisma.review.aggregate({ where: { merchantId }, _avg: { rating: true } }),
  prisma.review.count({ where: { merchantId } }),
  prisma.review.findMany({ where: { merchantId }, take: 10 }),
])
```

## 6. Plano de Otimizacao

| Arquivo | Problema | Impacto | Prioridade |
|---------|----------|---------|------------|
| orders.ts:84-91 | N+1 ao criar pedido | CRITICO | 🔴 ALTA |
| reviews.ts:105-109 | Agregacao manual | CRITICO | 🔴 ALTA |
| analytics.ts | Sem paginacao | ALTO | 🔴 ALTA |
| analytics.ts:94-105 | N+1 top products | MEDIO | 🟡 MEDIA |
| stores.ts | Include todos produtos | MEDIO | 🟡 MEDIA |
| search.ts | Duas queries separadas | BAIXO | 🟢 BAIXA |

## 7. Query Caching - Invalidade Inteligente

```typescript
// Cache por tags com TTL diferente
const CACHE_TAGS = {
  STORES: 'stores',
  PRODUCTS: 'products',
  REVIEWS: 'reviews',
  ORDERS: 'orders',
}

const CACHE_TTL = {
  [CACHE_TAGS.STORES]: 300,      // 5 min - mudanca rara
  [CACHE_TAGS.PRODUCTS]: 120,    // 2 min - mudanca media
  [CACHE_TAGS.REVIEWS]: 60,      // 1 min - mudanca frequente
  [CACHE_TAGS.ORDERS]: 30,       // 30s - muito dinamico
}

// Invalide apenas o tag relevante
async function onProductUpdate(productId: string, merchantId: string) {
  await invalidateTag(CACHE_TAGS.PRODUCTS)
  await invalidateTag(CACHE_TAGS.STORES, merchantId) // So loja especifica
}
```

## 8. Indices para SQLite

Para o SQLite (provider atual), alguns indices nao funcionam como no PostgreSQL. Recomendacoes:

```prisma
// Para SQLite, apenas indices em campos com alta cardinalidade

model Order {
  @@index([merchantId])  // Alta cardinalidade
  @@index([customerId])  // Alta cardinalidade
  @@index([status])      // Baixa cardinalidade - pode nao ajudar muito
}

model Product {
  @@index([merchantId])  // Essencial para buscas por loja
  @@index([category])    // Media cardinalidade
}
```

## 9. Migracao Sugerida

1. Adicionar indices ao schema.prisma
2. Executar `npx prisma migrate dev`
3. Corrigir N+1 em orders.ts
4. Corrigir agregacao em reviews.ts
5. Adicionar paginacao em analytics.ts
6. Implementar cache inteligente
7. Monitorar com Prisma Studio / logging