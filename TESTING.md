# Testes do sistema

## Fluxo 1: Usuário compra produto

```
1. Usuário abre app → Home page carrega ✅
2. Clica em "Quero comprar agora" → Redireciona para /user ✅
3. Navega pelos catálogos → Lista de produtos aparece ✅
4. Adiciona produto ao carrinho → Sacola atualiza com item ✅
5. Abre sacola → Visualiza itens, subtotal e total ✅
6. Clica em "Simular Pix" → Redireciona para tracking ✅
7. Acompanha status do pedido → Steps visualizados ✅
```

## Fluxo 2: Lojista gerencia loja

```
1. Lojista abre app → Home page carrega ✅
2. Clica em "Quero vender no app" → Redireciona para /merchant ✅
3. Visualiza métricas do painel → Cards com dados ✅
4. Preenche cadastro → Form valida campos ✅
5. Visualiza checklist → Status de ativação ✅
6. Vê pedidos recebidos → Lista de pedidos ✅
7. Gerencia catálogo → Lista de produtos ✅
```

## Fluxo 3: Autenticação

```
1. Usuário clica em "Entrar" → Página de login ✅
2. Insere credenciais válidas → Redireciona para /user ✅
3. Insere credenciais inválidas → Mensagem de erro ✅
4. Token armazenado → LocalStorage atualizado ✅
5. Logout → Token removido, redireciona para home ✅
```

## Checklist de verificação

- [x] Estrutura do projeto (monorepo)
- [x] Configuração TypeScript
- [x] Componentes UI (Button, Card, Input, etc.)
- [x] Store de carrinho (Zustand)
- [x] Store de autenticação (Zustand)
- [x] Páginas: Home, User, Merchant, Login
- [x] API Backend (Fastify + Prisma)
- [x] Modelos de banco (User, Merchant, Product, Order)
- [x] Rotas de autenticação (register, login, me)
- [x] Rotas de stores, products, orders
- [x] Docker e docker-compose
- [x] Seed com dados demo

## Para testar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Subir banco de dados
npm run docker:up

# 3. Rodar migrations
npm run db:migrate --workspace=apps/api

# 4. Popular dados
npm run db:seed --workspace=apps/api

# 5. Start do projeto
npm run dev
```

## URLs de teste

- Home: http://localhost:3000
- Usuário: http://localhost:3000/user
- Lojista: http://localhost:3000/merchant
- Login: http://localhost:3000/login
- API: http://localhost:3001
- Health: http://localhost:3001/health