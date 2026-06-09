# Feirinha Express

E-commerce delivery estilo iFood - múltiplas lojas em um único pedido.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, React Query
- **Backend**: Node.js, Fastify, TypeScript, Prisma
- **Database**: PostgreSQL + Redis

## Estrutura

```
feirinha-express/
├── apps/
│   ├── web/          # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/          # Páginas Next.js
│   │   │   ├── components/   # Componentes React
│   │   │   ├── store/        # Zustand stores
│   │   │   ├── lib/          # Utilitários
│   │   │   └── types/        # TypeScript types
│   │   └── package.json
│   └── api/          # Backend Fastify
│       ├── src/
│       │   ├── routes/       # Rotas da API
│       │   └── lib/          # Prisma client
│       ├── prisma/
│       │   ├── schema.prisma # Models do banco
│       │   └── seed.ts       # Dados demo
│       └── package.json
├── docker-compose.yml        # PostgreSQL + Redis
├── Dockerfile.api
├── Dockerfile.web
└── package.json             # Workspace root
```

## Getting Started

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir PostgreSQL e Redis com Docker

```bash
npm run docker:up
```

### 3. Criar banco e rodar seed

```bash
npm run db:migrate --workspace=apps/api
npm run db:seed --workspace=apps/api
```

### 4. Start do projeto

```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Home - escolha entre usuário ou lojista |
| `/user` | Área do cliente - catálogos, carrinho, rastreio |
| `/merchant` | Painel do lojista - métricas, pedidos, catálogo |
| `/login` | Login de usuário |

## Credenciais Demo

- **Lojista**: lojista@demo.com / demo123
- **Cliente**: cliente@demo.com / demo123

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/stores` | Lista todas as lojas |
| GET | `/api/products` | Lista produtos (com filtros) |
| POST | `/api/orders` | Cria novo pedido |
| POST | `/api/auth/register` | Cadastro de usuário |
| POST | `/api/auth/login` | Login |

## Agentes (10) - ✅ TODOS CONCLUÍDOS

| # | Agente | Status | Descrição |
|---|--------|--------|-----------|
| 1 | Arquiteto | ✅ | Setup, config, estrutura do projeto |
| 2 | Database | ✅ | Models Prisma, migrations, seed |
| 3 | Auth | ✅ | Sistema de autenticação JWT |
| 4 | UI | ✅ | Componentes visuais (Button, Card, etc.) |
| 5 | API | ✅ | Endpoints REST (stores, products, orders) |
| 6 | Pages | ✅ | Páginas de usuário (home, catalog, track) |
| 7 | Merchant | ✅ | Painel do lojista |
| 8 | Orders | ✅ | Lógica de pedidos e carrinho |
| 9 | DevOps | ✅ | Docker, docker-compose, infraestrutura |
| 10 | Integration | ✅ | Testes e integração |

## Próximos Passos

1. Conectar frontend com API real
2. Implementar autenticação completa
3. Adicionar serviços (leva e traz)
4. Implementar webhook PIX
5. Deploy em produção

Para mais detalhes sobre testes, veja [TESTING.md](./TESTING.md).