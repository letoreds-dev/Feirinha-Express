import { test, expect } from '@playwright/test'
import { CatalogPage } from '../pages/catalog-page'
import { CheckoutPage } from '../pages/checkout-page'
import { TEST_USERS } from '../fixtures/auth'

test.describe('Checkout e Finalização de Pedido', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', TEST_USERS.cliente.email)
    await page.fill('[name="password"]', TEST_USERS.cliente.password)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/user\/home/)

    // Adicionar produto ao carrinho
    await page.goto('/user/catalog')
    const botaoAdd = page.locator('[data-testid="add-to-cart"], button:has-text("Adicionar")').first()
    if (await botaoAdd.isVisible()) {
      await botaoAdd.click()
      await page.waitForTimeout(500)
    }

    // Ir para carrinho
    await page.goto('/user/cart')
  })

  test('deve exibir pagina de checkout com itens', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    // Verificar elementos principais
    await expect(checkoutPage.listaItens.first()).toBeVisible()
    await expect(checkoutPage.total).toBeVisible()
  })

  test('deve exibir resumo do pedido', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    // Verificar que há um resumo com total
    await expect(checkoutPage.resumoPedido).toBeVisible()
    await expect(checkoutPage.total).toBeVisible()

    const textoTotal = await checkoutPage.obterTotal()
    expect(textoTotal).toMatch(/[\d,]+\.?\d*/)
  })

  test('deve ter campo para endereço de entrega', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    // Verificar campos de endereço
    await expect(checkoutPage.campoCEP).toBeVisible()
    await expect(checkoutPage.campoEndereco).toBeVisible()
  })

  test('deve selecionar método de pagamento', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    // Verificar seletor de pagamento
    await expect(checkoutPage.metodoPagamento).toBeVisible()

    // Selecionar PIX
    await checkoutPage.selecionarMetodoPagamento('pix')
    await expect(checkoutPage.metodoPagamento).toHaveValue('pix')
  })

  test('deve preencher dados de entrega', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    await checkoutPage.preencherEndereco('01310900', 'Av. Paulista, 1000 - São Paulo, SP')
  })

  test('deve finalizar pedido com sucesso', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    // Preencher dados necessários
    await checkoutPage.preencherEndereco('01310900', 'Av. Paulista, 1000 - São Paulo, SP')
    await checkoutPage.selecionarMetodoPagamento('pix')

    // Finalizar pedido
    await checkoutPage.finalizarPedido()

    // Verificar mensagem de sucesso
    await checkoutPage.verificarPedidoSucesso()
  })

  test('deve finalizar pedido com cartão de crédito', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    await checkoutPage.preencherEndereco('01310900', 'Av. Paulista, 1000 - São Paulo, SP')
    await checkoutPage.selecionarMetodoPagamento('cartao')
    await checkoutPage.finalizarPedido()

    await checkoutPage.verificarPedidoSucesso()
  })

  test('deve mostrar erro se tentar finalizar sem endereço', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    // Não preencher endereço
    await checkoutPage.finalizarPedido()

    // Deve mostrar erro ou não permitir finalização
    const temErro = await page.locator('[data-testid="error-message"], .error, [role="alert"]').isVisible()
    const aindaNaPagina = page.url().includes('/cart')

    expect(temErro || aindaNaPagina).toBeTruthy()
  })

  test('deve redirecionar para página de confirmação após pedido', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    await checkoutPage.preencherEndereco('01310900', 'Av. Paulista, 1000 - São Paulo, SP')
    await checkoutPage.selecionarMetodoPagamento('pix')
    await checkoutPage.finalizarPedido()

    // Verificar redirecionamento para página de confirmação
    await expect(page).toHaveURL(/\/confirmacao|confirmation|success|pedido/, { timeout: 10000 })
  })

  test('deve limpar carrinho após finalizar pedido', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page)

    await checkoutPage.goto()

    await checkoutPage.preencherEndereco('01310900', 'Av. Paulista, 1000 - São Paulo, SP')
    await checkoutPage.selecionarMetodoPagamento('pix')
    await checkoutPage.finalizarPedido()

    // Aguardar redirecionamento
    await page.waitForURL(/\/confirmacao|confirmation|success|pedido/, { timeout: 10000 })

    // Voltar para carrinho
    await page.goto('/user/cart')

    // Verificar que carrinho está vazio
    await expect(checkoutPage.page.locator('[data-testid="empty-cart"], .empty-cart')).toBeVisible()
  })
})

test.describe('Validação de Checkout', () => {
  test('deve validar formato de CEP', async ({ page }) => {
    // Login e ir para checkout
    await page.goto('/login')
    await page.fill('[name="email"]', TEST_USERS.cliente.email)
    await page.fill('[name="password"]', TEST_USERS.cliente.password)
    await page.click('button[type="submit"]')

    // Ir para carrinho com item
    await page.goto('/user/catalog')
    const botaoAdd = page.locator('[data-testid="add-to-cart"], button:has-text("Adicionar")').first()
    await botaoAdd.click()
    await page.waitForTimeout(300)

    await page.goto('/user/cart')

    const checkoutPage = new CheckoutPage(page)
    await checkoutPage.goto()

    // Tentar CEP inválido
    await checkoutPage.campoCEP.fill('00000')
    await checkoutPage.finalizarPedido()

    // Deve mostrar erro de validação
    const temErro = await page.locator('text=/CEP.*invalido|invalido.*CEP|formato.*incorreto/i').count() > 0
    expect(temErro || page.url().includes('/cart')).toBeTruthy()
  })

  test('deve impedir checkout com carrinho vazio', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', TEST_USERS.cliente.email)
    await page.fill('[name="password"]', TEST_USERS.cliente.password)
    await page.click('button[type="submit"]')

    // Ir para carrinho vazio
    await page.goto('/user/cart')

    // Verificar que não há botão de finalizar ou está desabilitado
    const checkoutPage = new CheckoutPage(page)
    const botaoFinalizar = checkoutPage.botaoFinalizar

    if (await botaoFinalizar.isVisible()) {
      await expect(botaoFinalizar).toBeDisabled()
    }
  })
})

test.describe('Pagamento', () => {
  test('deve processar pagamento via PIX', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', TEST_USERS.cliente.email)
    await page.fill('[name="password"]', TEST_USERS.cliente.password)
    await page.click('button[type="submit"]')

    // Adicionar item e ir para checkout
    await page.goto('/user/catalog')
    const botaoAdd = page.locator('[data-testid="add-to-cart"], button:has-text("Adicionar")').first()
    await botaoAdd.click()
    await page.waitForTimeout(300)

    await page.goto('/user/cart')

    const checkoutPage = new CheckoutPage(page)
    await checkoutPage.goto()

    // Selecionar PIX e finalizar
    await checkoutPage.preencherEndereco('01310900', 'Av. Paulista, 1000 - São Paulo, SP')
    await checkoutPage.selecionarMetodoPagamento('pix')
    await checkoutPage.finalizarPedido()

    // Verificar que foi para página de confirmação PIX
    await expect(page).toHaveURL(/\/confirmacao|confirmation|pix/, { timeout: 10000 })
  })

  test('deve processar pagamento via boleto', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', TEST_USERS.cliente.email)
    await page.fill('[name="password"]', TEST_USERS.cliente.password)
    await page.click('button[type="submit"]')

    // Adicionar item
    await page.goto('/user/catalog')
    const botaoAdd = page.locator('[data-testid="add-to-cart"], button:has-text("Adicionar")').first()
    await botaoAdd.click()
    await page.waitForTimeout(300)

    await page.goto('/user/cart')

    const checkoutPage = new CheckoutPage(page)
    await checkoutPage.goto()

    // Selecionar boleto
    await checkoutPage.preencherEndereco('01310900', 'Av. Paulista, 1000 - São Paulo, SP')
    await checkoutPage.selecionarMetodoPagamento('boleto')
    await checkoutPage.finalizarPedido()

    await expect(page).toHaveURL(/\/confirmacao|confirmation|boleto/, { timeout: 10000 })
  })
})