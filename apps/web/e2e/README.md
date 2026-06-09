# Testes E2E - Feirinha Express

Testes end-to-end usando Playwright para o aplicativo Feirinha Express.

## Estrutura

```
e2e/
├── fixtures/           # Fixtures do Playwright (autenticação, etc)
│   └── auth.ts
├── pages/              # Page Objects para cada página
│   ├── home-page.ts
│   ├── login-page.ts
│   ├── catalog-page.ts
│   ├── checkout-page.ts
│   └── index.ts
├── tests/              # Arquivos de teste
│   ├── auth.spec.ts
│   ├── navigation.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
└── playwright.config.ts
```

## Scripts Disponíveis

```bash
# Executar todos os testes
npm run test:e2e

# Executar testes com interface visual (UI mode)
npm run test:e2e:ui

# Executar testes com navegador visível (headed)
npm run test:e2e:headed

# Executar com servidor de desenvolvimento específico
npx playwright test --ui

# Executar apenas um arquivo de teste
npx playwright test e2e/tests/auth.spec.ts

# Executar com tags
npx playwright test --grep "@slow"
```

## Credenciais de Teste

```typescript
const TEST_USERS = {
  cliente: { email: 'cliente@demo.com', password: 'demo123' },
  vendedor: { email: 'vendedor@demo.com', password: 'demo123' },
  admin: { email: 'admin@demo.com', password: 'admin123' }
}
```

## Page Objects

### LoginPage
```typescript
const loginPage = new LoginPage(page)
await loginPage.goto()
await loginPage.preencherCredenciais(email, senha)
await loginPage.fazerLoginComoCliente()
```

### CatalogPage
```typescript
const catalogPage = new CatalogPage(page)
await catalogPage.goto()
await catalogPage.adicionarPrimeiroProdutoAoCarrinho()
await catalogPage.irParaCarrinho()
```

### CheckoutPage
```typescript
const checkoutPage = new CheckoutPage(page)
await checkoutPage.goto()
await checkoutPage.preencherEndereco('01310900', 'Av. Paulista')
await checkoutPage.selecionarMetodoPagamento('pix')
await checkoutPage.finalizarPedido()
```

## Configuração

O arquivo `playwright.config.ts` configura:
- Base URL: `http://localhost:3000`
- Browser: Chromium (desktop e mobile)
- Reporter: HTML
- WebServer automático para testes locais

## Dicas

1. **data-testid**: Para seletores mais robustos, adicione `data-testid` nos elementos:
   ```tsx
   <button data-testid="add-to-cart">Adicionar</button>
   ```

2. **Fixtures**: Use a fixture `loggedInPage` para testes que precisam de usuário logado:
   ```typescript
   test('meu teste', async ({ loggedInPage }) => {
     await loggedInPage.goto('/user/catalog')
   })
   ```

3. **Debug**: Use `await page.pause()` para pausar e inspecionar durante um teste.

4. **Screenshots**: Screenshots são salvos automaticamente em falhas.

## Troubleshooting

### "Server is not running"
O servidor de desenvolvimento precisa estar rodando. Execute:
```bash
npm run dev
```

Ou desabilite o webServer no config para CI/CD.

### Timeout em testes
Aumente o timeout no `playwright.config.ts`:
```typescript
timeout: 60000, // 60 segundos
expect: { timeout: 10000 }
```