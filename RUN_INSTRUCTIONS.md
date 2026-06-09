# Feirinha Express - Como Executar

## 1. Iniciar o Servidor

Abra um terminal na pasta do projeto e execute:

```bash
cd C:\Users\kauan\feirinha-express
npm run dev
```

O servidor will start em: **http://localhost:3000**

## 2. Páginas Disponíveis

### 🏠 Página Principal
- http://localhost:3000/user

### 📊 Dashboards
- http://localhost:3000/user/dashboard - Dashboard do usuário
- http://localhost:3000/merchant/dashboard - Painel do lojista
- http://localhost:3000/merchant/analytics-page - Analytics

### 🔍 Busca e Catálogo
- http://localhost:3000/user/search-page - Busca avançada
- http://localhost:3000/user/catalog - Cardápio
- http://localhost:3000/user/stores-explore - Explorar lojas

### 🛒 Pedidos e Carrinho
- http://localhost:3000/user/cart - Carrinho
- http://localhost:3000/user/checkout - Checkout
- http://localhost:3000/user/orders - Pedidos
- http://localhost:3000/user/order-confirmed - Pedido confirmado

### 👤 Usuário
- http://localhost:3000/user/profile - Perfil
- http://localhost:3000/user/payments - Pagamentos
- http://localhost:3000/user/addresses - Endereços
- http://localhost:3000/user/notifications - Notificações
- http://localhost:3000/user/favorites - Favoritos
- http://localhost:3000/user/wallet - Carteira

### 🎁 Promoções
- http://localhost:3000/user/promotions - Promoções e jogos
- http://localhost:3000/user/loyalty - Programa de fidelidade

### ❓ Ajuda
- http://localhost:3000/user/help - Central de ajuda
- http://localhost:3000/user/reviews-write - Escrever avaliação

### 🏪 Lojista
- http://localhost:3000/merchant - Painel principal
- http://localhost:3000/merchant/products - Gerenciar produtos
- http://localhost:3000/merchant/register - Cadastrar loja

### 🎨 Demo
- http://localhost:3000/demo - Demo de validação e animações

### ⚠️ Páginas de Erro
- http://localhost:3000/not-found - Página 404

## 3. Credenciais Demo

- **Lojista**: lojista@demo.com / demo123
- **Cliente**: cliente@demo.com / demo123

## 4. Extensões VS Code Recomendadas

- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- TypeScript Vue Volar

## 5. Se der erro de compilação

```bash
# Limpar cache
npm run clean

# Reinstalar dependências
rm -rf node_modules
npm install

# Verificar TypeScript
npx tsc --noEmit
```