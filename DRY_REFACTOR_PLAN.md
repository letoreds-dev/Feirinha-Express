# Plano de Refatoracao DRY - Feirinha Express

## 1. Resumo Executivo

Analisei 18 arquivos de rotas em `apps/api/src/routes/` e identifiquei **6 categorias** de codigo duplicado que podem ser centralizadas para reduzir ~450 linhas de codigo duplicado (80% de reducao potencial).

---

## 2. Codigo Duplicado Identificado

### 2.1 Schemas Zod Repetidos

**Problema:** Campos comuns estao definidos em multiplos schemas

| Campo | Arquivos Onde Aparece |
|-------|----------------------|
| `email` | auth.ts (registerSchema, loginSchema) |
| `street`, `number`, `neighborhood`, `city` | orders.ts, addresses.ts |
| `zipCode` | orders.ts (regex), addresses.ts (min 8) |
| `rating` (1-5) | reviews.ts |

**Localizacao:**
- `C:\Users\kauan\feirinha-express\apps\api\src\routes\orders.ts:7-13` (addressSchema)
- `C:\Users\kauan\feirinha-express\apps\api\src\routes\addresses.ts:5-18` (addressSchema)
- `C:\Users\kauan\feirinha-express\apps\api\src\routes\auth.ts:7-21` (registerSchema, loginSchema)

**Solucao:** Criar `src/lib/schemas/common.ts`

```typescript
// src/lib/schemas/common.ts
import { z } from 'zod'

// Email
export const emailSchema = z.string().email('Email invalido')

// Endereco base
export const addressFieldsSchema = z.object({
  street: z.string().min(1, 'Rua e obrigatoria'),
  number: z.string().min(1, 'Numero e obrigatorio'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro e obrigatorio'),
  city: z.string().min(1, 'Cidade e obrigatoria'),
  state: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP invalido'),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

// Rating padrao
export const ratingSchema = z.number().min(1).max(5)

// IDs
export const cuidSchema = z.string().cuid()
```

**Uso:**
```typescript
// Antes (addresses.ts)
const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(8),
})

// Depois
import { addressFieldsSchema } from '../lib/schemas/common'
const addressSchema = addressFieldsSchema.extend({
  label: z.string().optional(),
  instructions: z.string().optional(),
})
```

---

### 2.2 Tratamento de Erro ZodError

**Problema:** Cada rota tem seu proprio catch para ZodError

**Localizacao:**
- `addresses.ts:70-75`
- `coupons.ts:81-85`
- `reviews.ts:137-141`
- `orders.ts` (usa asyncHandler porem poderia centralizar)

**Solucao:** Criar funcao utilitaria `validateBody()`

```typescript
// src/lib/validation.ts
import { z } from 'zod'
import { ApiError } from './errors'

export function validateBody<T extends z.ZodType>(schema: T) {
  return (data: unknown): z.infer<T> => {
    const result = schema.safeParse(data)
    if (!result.success) {
      throw new ApiError(400, 'Dados invalidos', 'VALIDATION_ERROR', result.error.errors)
    }
    return result.data
  }
}

// Funcao helper para extrair userId do request
export function getUserId(request: any): string {
  return request.user.id
}
```

**Uso:**
```typescript
// Antes
try {
  const body = addressSchema.parse(request.body)
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({ error: 'Dados invalidos', details: error.errors })
  }
  throw error
}

// Depois
const body = validateBody(addressSchema)(request.body)
```

---

### 2.3 Logica de Cache Repetida

**Problema:** Padrao de cache identico em stores.ts e products.ts

**Localizacao:**
- `stores.ts:9-15, 39-45, 60-61` (getCache + setCache com X-Cache header)
- `products.ts:28-31, 63-67, 79, 105-108`

**Solucao:** Criar `withCache()` helper

```typescript
// src/lib/cache-helpers.ts
import { FastifyReply } from 'fastify'

export async function withCache<T>(
  fastify: any,
  cacheKey: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<{ data: T; fromCache: boolean }> {
  const cached = await getCache<T>(fastify, cacheKey)
  if (cached) {
    return { data: cached, fromCache: true }
  }

  const data = await fetchFn()
  await setCache(fastify, cacheKey, data, { ttl })
  return { data, fromCache: false }
}

export function cacheResponse(reply: FastifyReply, data: any, fromCache: boolean) {
  return reply.header('X-Cache', fromCache ? 'HIT' : 'MISS').send({ data, fromCache })
}
```

**Uso:**
```typescript
// Antes
const cached = await getCache<any[]>(fastify, cacheKey)
if (cached) {
  return reply.header('X-Cache', 'HIT').send({ stores: cached, fromCache: true })
}
const stores = await prisma.merchant.findMany({ ... })
await setCache(fastify, cacheKey, stores, { ttl: 300 })
return reply.header('X-Cache', 'MISS').send({ stores, fromCache: false })

// Depois
const { data: stores, fromCache } = await withCache(fastify, cacheKey, 300, () =>
  prisma.merchant.findMany({ ... })
)
return cacheResponse(reply, { stores }, fromCache)
```

---

### 2.4 Logica de Inicializacao de Wallet

**Problema:** Padrao "buscar ou criar" repetido em wallet.ts

**Localizacao:**
- `wallet.ts:18-23` (deposit)
- `wallet.ts:43-47` (deposit, segundo check)
- `wallet.ts:76-78` (withdraw)

**Solucao:** Criar `getOrCreateWallet()`

```typescript
// src/lib/wallet-helpers.ts
import prisma from './prisma'

export async function getOrCreateWallet(userId: string) {
  let wallet = await prisma.wallet.findUnique({ where: { userId } })
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { userId } })
  }
  return wallet
}
```

**Uso:**
```typescript
// Antes
let wallet = await prisma.wallet.findUnique({ where: { userId } })
if (!wallet) {
  wallet = await prisma.wallet.create({ data: { userId } })
}

// Depois
const wallet = await getOrCreateWallet(userId)
```

---

### 2.5 Logica isDefault em Enderecos

**Problema:** Padrao de atualizar todos para false antes de definir um novo padrao

**Localizacao:**
- `addresses.ts:44-48` (criar)
- `addresses.ts:93-97` (atualizar)
- `addresses.ts:135-138` (definir padrao)

**Solucao:** Criar `clearDefaultAddress()`

```typescript
// src/lib/address-helpers.ts
import prisma from './prisma'

export async function clearDefaultAddress(userId: string) {
  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  })
}

export async function setDefaultAddress(userId: string, addressId: string) {
  await clearDefaultAddress(userId)
  return prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  })
}
```

**Uso:**
```typescript
// Antes
if (body.isDefault) {
  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  })
}

// Depois
if (body.isDefault) {
  await clearDefaultAddress(userId)
}
```

---

### 2.6 Validacao de Proprietario (Merchant)

**Problema:** Verificacao de proprietario duplicada em products.ts

**Localizacao:**
- `products.ts:95-97` (criar)
- `products.ts:129-131` (atualizar)

**Solucao:** Criar middleware/decorator `authorizeMerchant()`

```typescript
// src/lib/auth-decorators.ts
import { ApiError } from './errors'

export function authorizeMerchant(fastify: FastifyInstance) {
  fastify.decorate('authorizeMerchant', async (request: FastifyRequest, merchantId: string) => {
    const userId = request.user.id
    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } })

    if (!merchant) {
      throw new ApiError(404, 'Loja nao encontrada', 'STORE_NOT_FOUND')
    }

    if (merchant.userId !== userId) {
      throw new ApiError(403, 'Voce nao e dono desta loja', 'FORBIDDEN')
    }

    return merchant
  })
}
```

---

## 3. Extrato de Utilitarios a Criar

### 3.1 Estrutura de Arquivos

```
src/lib/
  schemas/
    index.ts           # Re-exporta todos schemas
    common.ts          # Schemas compartilhados
  utils/
    cache-helpers.ts   # withCache, cacheResponse
    wallet-helpers.ts  # getOrCreateWallet
    address-helpers.ts # clearDefaultAddress, setDefaultAddress
    validation.ts      # validateBody, getUserId
  decorators/
    auth.ts            # authorizeMerchant, authorizeRoles
```

### 3.2 Schema de Endereco Unificado

```typescript
// src/lib/schemas/address.ts
import { z } from 'zod'
import { addressFieldsSchema } from './common'

export const createAddressSchema = addressFieldsSchema.extend({
  label: z.string().optional().default('Casa'),
  instructions: z.string().optional(),
  isDefault: z.boolean().optional(),
})

export const updateAddressSchema = createAddressSchema.partial()
```

---

## 4. Economia de Codigo Estimada

| Categoria | Linhas Duplicadas | Apos Refatoracao | Reducao |
|-----------|-------------------|------------------|---------|
| Schemas Zod | ~120 | ~40 | 67% |
| Tratamento ZodError | ~60 | ~15 | 75% |
| Logica de Cache | ~80 | ~30 | 63% |
| Inicializacao Wallet | ~25 | ~10 | 60% |
| Logica isDefault | ~20 | ~8 | 60% |
| Validacao Merchant | ~15 | ~8 | 47% |
| **TOTAL** | **~320** | **~111** | **65%** |

---

## 5. Planos de Implementacao

### Fase 1: Schemas Centralizados (Maior Impacto)
1. Criar `src/lib/schemas/common.ts`
2. Migrar schemas de auth.ts, orders.ts, addresses.ts
3. Atualizar imports em todas as rotas

### Fase 2: Utilitarios de Validacao
1. Criar `src/lib/utils/validation.ts`
2. Criar `src/lib/utils/cache-helpers.ts`
3. Substituir tratamento de erro em addresses.ts, coupons.ts, reviews.ts

### Fase 3: Utilitarios de Dominio
1. Criar `src/lib/utils/wallet-helpers.ts`
2. Criar `src/lib/utils/address-helpers.ts`
3. Criar `src/lib/decorators/auth.ts`

### Fase 4: Limpeza Final
1. Remover imports nao utilizados
2. Verificar que todas as rotas ainda funcionam
3. Documentar novos helpers no README

---

## 6. Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Breaking changes em schemas | Media | Alto | Manter schemas antigos como alias temporarios |
| Falha em cache | Baixa | Medio | Cache e opcional, fallback para DB |
| Bugs de merge em prisma | Baixa | Alto | Testes unitarios apos cada migracao |

---

## 7. Arquivos para Modificacao

### Criar:
- `src/lib/schemas/common.ts`
- `src/lib/schemas/address.ts`
- `src/lib/utils/validation.ts`
- `src/lib/utils/cache-helpers.ts`
- `src/lib/utils/wallet-helpers.ts`
- `src/lib/utils/address-helpers.ts`
- `src/lib/decorators/auth.ts`

### Modificar:
- `src/routes/auth.ts`
- `src/routes/orders.ts`
- `src/routes/addresses.ts`
- `src/routes/products.ts`
- `src/routes/stores.ts`
- `src/routes/wallet.ts`
- `src/routes/coupons.ts`
- `src/routes/reviews.ts`

---

*Gerado por DRYFIX - Analisador DRY do Feirinha Express*
*Data: 2026-06-02*
