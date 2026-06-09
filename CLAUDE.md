# Feirinha Express - Documentação do Projeto

## Visão Geral

**Feirinha Express** é uma plataforma e-commerce de delivery estilo iFood, permitindo compras de múltiplas lojas em um único pedido. O projeto foi desenvolvido com arquitetura moderna monorepo.

## Stack Tecnológica

### Frontend (`apps/web`)
- **Framework**: Next.js 14.1.0 (App Router)
- **Linguagem**: TypeScript 5.4.0
- **Estilização**: Tailwind CSS 3.4.0
- **State Management**: Zustand 4.5.0
- **Data Fetching**: TanStack Query 5.28.0
- **Validação**: Zod 3.22.0
- **HTTP Client**: Axios 1.6.0

### Backend (`apps/api`)
- **Runtime**: Node.js
- **Framework**: Fastify 4.26.0
- **ORM**: Prisma 5.10.0
- **Banco**: SQLite (dev) / PostgreSQL (prod)
- **Cache**: Redis 7 (via Docker)

## Estrutura do Projeto

```
feirinha-express/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/           # Rotas Next.js (App Router)
│   │   │   ├── components/     # Componentes React
│   │   │   │   ├── ui/        # Componentes reutilizáveis
│   │   │   │   └── agents/    # Componentes de agentes
│   │   │   ├── store/         # Stores Zustand
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── lib/           # Utilitários
│   │   │   └── types/         # TypeScript types
│   │   └── package.json
│   └── api/                    # Backend Fastify
│       ├── src/
│       │   ├── routes/        # Rotas da API
│       │   └── lib/           # Prisma client
│       ├── prisma/
│       │   ├── schema.prisma  # Models do banco
│       │   └── seed.ts        # Dados de demo
│       └── package.json
├── packages/                   # Pacotes compartilhados
│   ├── agents/               # Sistema de agentes
│   └── dev-agents/           # Agentes de desenvolvimento
├── docker-compose.yml        # PostgreSQL + Redis
└── package.json             # Workspace root
```

## Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useCart.ts`)
- **Stores**: camelCase (`cartStore.ts`)
- **Utils**: camelCase (`formatCurrency.ts`)
- **Types**: PascalCase (`Product.ts`)

### Estrutura de Componente
```tsx
'use client'

import { Card, Button } from '@/components/ui'

interface Props {
  title: string
}

export function Component({ title }: Props) {
  return (
    <Card padding="md">
      <h2 className="text-lg font-bold">{title}</h2>
      <Button>Action</Button>
    </Card>
  )
}
```

### Estilização
- Usar classes Tailwind SEMPRE (não inline styles)
- Variáveis de tema via `tailwind.config.ts`
- Cores customizadas via `brand-*` prefix

### Paleta de Cores (Tailwind)
```ts
brand: {
  red: '#ea1d2c',        // Primary (call-to-action)
  'red-dark': '#bd1320', // Primary hover
  ink: '#1f1a17',        // Text primary
  muted: '#756f6a',      // Text secondary
  line: '#ece5dc',       // Borders
  paper: '#fffaf4',      // Background
  card: '#ffffff',       // Card background
  soft: '#fff0f2',       // Light backgrounds
  green: '#12805c',      // Success
  blue: '#2356c4',       // Info
  yellow: '#fff5d8',     // Warning
}
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil atual

### Lojas
- `GET /api/stores` - Lista lojas
- `GET /api/stores/:id` - Detalhes loja
- `POST /api/stores` - Criar loja (lojista)

### Produtos
- `GET /api/products` - Lista produtos
- `GET /api/products/:id` - Detalhes produto
- `POST /api/products` - Criar produto (lojista)

### Pedidos
- `GET /api/orders` - Lista pedidos (usuário/lojista)
- `POST /api/orders` - Criar pedido
- `PATCH /api/orders/:id/status` - Atualizar status

### Carrinho (local)
- Persistido via Zustand + localStorage
- Namespace: `feirinha-cart`

## Páginas Principais

### Cliente (`/user`)
| Rota | Descrição |
|------|-----------|
| `/user/home` | Homepage com categorias e lojas |
| `/user/catalog` | Catálogo de produtos |
| `/user/cart` | Carrinho de compras |
| `/user/checkout` | Finalização do pedido |
| `/user/tracking` | Rastreamento |
| `/user/orders` | Histórico de pedidos |
| `/user/profile` | Perfil do usuário |
| `/user/search` | Busca de produtos |

### Lojista (`/merchant`)
| Rota | Descrição |
|------|-----------|
| `/merchant` | Painel principal |
| `/merchant/dashboard` | Dashboard com métricas |
| `/merchant/products` | Gestão de produtos |
| `/merchant/analytics` | Relatórios |
| `/merchant/promotion` | Promoções |

## Variáveis de Ambiente

```env
# API (.env na raiz)
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3001

# Web (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Scripts Disponíveis

```bash
# Instalação
npm install

# Desenvolvimento
npm run dev              # Roda web + api
npm run dev:web         # Apenas web (3000)
npm run dev:api         # Apenas api (3001)

# Banco de dados
npm run docker:up       # Sobe PostgreSQL + Redis
npm run db:migrate       # Executa migrations
npm run db:seed          # Popula dados demo
npm run db:studio        # Prisma Studio

# Build
npm run build           # Build produção
```

## Credenciais Demo

| Tipo | Email | Senha |
|------|-------|-------|
| Lojista | lojista@demo.com | demo123 |
| Cliente | cliente@demo.com | demo123 |

## Estado da Implementação

### ✅ Funcionalidades Concluídas
- [x] Estrutura monorepo
- [x] Schema Prisma (24 models)
- [x] API REST (17 endpoints)
- [x] Autenticação JWT
- [x] UI Components (100+)
- [x] Pages mobile-first
- [x] Dark mode
- [x] Bottom navigation
- [x] Floating cart
- [x] Product quick view
- [x] Order tracking
- [x] Sistema de cupons
- [x] Programa de fidelidade

### 🔄 Em Progresso
- [ ] Integração API → Frontend
- [ ] Checkout completo
- [ ] Feedback visual

### ⏳ Pendente
- [ ] Webhook PIX
- [ ] Notificações push
- [ ] Chat em tempo real
- [ ] Deploy produção

## Decisões Técnicas

1. **SQLite para dev**: Facilita setup local sem necessidade do Docker
2. **Zustand + Persist**: Estado local com persistência em localStorage
3. **Inline styles em algumas páginas**: Legacy, migrar para classes
4. **Mock data**: Dados de exemplo para demo sem API rodando

## Troubleshooting

### API não responde
```bash
# Verificar se porta 3001 está em uso
netstat -ano | findstr :3001

# Reiniciar API
npm run dev:api
```

### Banco não conecta
```bash
# Regenerar Prisma client
npx prisma generate --workspace=apps/api

# Resetar banco
npx prisma db push --force-reset --workspace=apps/api
```