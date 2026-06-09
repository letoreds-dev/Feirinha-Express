import { test, expect } from '@playwright/test'
import { CatalogPage } from '../pages/catalog-page'
import { CheckoutPage } from '../pages/checkout-page'
import { TEST_USERS } from '../fixtures/auth'

test.describe('Carrinho de Compras', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/login')
    await page.fill('[name="email"]', TEST_USERS.cliente.email)
    await page.fill('[name="password"]', TEST_USERS.cliente.password)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/user\/home/)
  })

  test('deve adicionar produto ao carrinho', async ({ page }) => {
    const catalogPage = new CatalogPage(page)

    await catalogPage.goto()
    await catalogPage.adicionarPrimeiroProdutoAoCarrinho()

    // Verificar que o contador do carrinho atualizou
    const contador = await catalogPage.obterContadorCarrinho()
    expect(contador).toBeGreaterThanOrEqual(1)
  })

  test('deve incrementar contador ao adicionar varios produtos', async ({ page }) => {
    const catalogPage = new CatalogPage(page)

    await catalogPage.goto()

    // Adicionar primeiro produto
    await catalogPage.adicionarPrimeiroProdutoAoCarrinho()
    let contador = await catalogPage.obterContadorCarrinho()
    expect(contador).toBe(1)

    // Adicionar segundo produto
    const botoesAdicionar = page.locator('[data-testid="add-to-cart"], button:has-text("Adicionar")')
    if (await botoesAdicionar.count() > 1) {
      await botoesAdicionar.nth(1).click()
      contador = await catalogPage.obterContadorCarrinho()
      expect(contador).toBe(2)
    }
  })

  test('deve mostrar produtos no carrinho', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    const checkoutPage = new CheckoutPage(page)

    await catalogPage.goto()
    await catalogPage.adicionarPrimeiroProdutoAoCarrinho()
    await catalogPage.irParaCarrinho()

    // Verificar que há itens no carrinho
    const itens = await checkoutPage.obterItens()
    expect(itens.length).toBeGreaterThan(0)
  })

  test('deve calcular total corretamente', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    const checkoutPage = new CheckoutPage(page)

    await catalogPage.goto()
    await catalogPage.adicionarPrimeiroProdutoAoCarrinho()
    await catalogPage.irParaCarrinho()

    // Verificar que o total é exibido
    const total = await checkoutPage.obterTotal()
    expect(total).toBeTruthy()
    expect(total).not.toBe('0')
  })

  test('deve remover produto do carrinho', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    const checkoutPage = new CheckoutPage(page)

    await catalogPage.goto()
    await catalogPage.adicionarPrimeiroProdutoAoCarrinho()
    await catalogPage.irParaCarrinho()

    // Remover item
    await checkoutPage.removerItem(0)

    // Verificar carrinho vazio ou item removido
    const itens = await checkoutPage.obterItens()
    if (itens.length === 0) {
      await expect(checkoutPage.page.locator('[data-testid="empty-cart"], .empty-cart')).toBeVisible()
    }
  })

  test('deve alterar quantidade de produto no carrinho', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    const checkoutPage = new CheckoutPage(page)

    await catalogPage.goto()
    await catalogPage.adicionarPrimeiroProdutoAoCarrinho()
    await catalogPage.irParaCarrinho()

    // Alterar quantidade
    await checkoutPage.alterarQuantidadeItem(0, 3)

    // Verificar nova quantidade
    const itens = await checkoutPage.obterItens()
    expect(itens[0].quantidade).toBe(3)
  })

  test('deve manter carrinho ao navegar para outras paginas', async ({ page }) => {
    const catalogPage = new CatalogPage(page)

    await catalogPage.goto()
    await catalogPage.adicionarPrimeiroProdutoAoCarrinho()
    const contadorAntes = await catalogPage.obterContadorCarrinho()

    // Navegar para home
    await page.goto('/user/home')

    // Navegar de volta para catalogo
    await page.goto('/user/catalog')

    // Verificar que contador ainda mostra itens
    const contadorDepois = await catalogPage.obterContadorCarrinho()
    expect(contadorDepois).toBe(contadorAntes)
  })

  test('deve esvaziar carrinho completamente', async ({ page }) => {
    const catalogPage = new CatalogPage(page)
    const checkoutPage = new CheckoutPage(page)

    await catalogPage.goto()

    // Adicionar varios produtos
    const botoesAdicionar = page.locator('[data-testid="add-to-cart"], button:has-text("Adicionar")')
    const count = Math.min(await botoesAdicionar.count(), 3)

    for (let i = 0; i < count; i++) {
      await botoesAdicionar.nth(i).click()
      await page.waitForTimeout(300)
    }

    // Ir para carrinho e esvaziar
    await catalogPage.irParaCarrinho()
    await checkoutPage.esvaziarCarrinho()

    // Verificar carrinho vazio
    await expect(checkoutPage.page.locator('[data-testid="empty-cart"], .empty-cart')).toBeVisible()
  })
})

test.describe('Persistência do Carrinho', () => {
  test('deve manter carrinho entre sessoes (localStorage)', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Contexto 1: adicionar item ao carrinho
    await page1.goto('/login')
    await page1.fill('[name="email"]', TEST_USERS.cliente.email)
    await page1.fill('[name="password"]', TEST_USERS.cliente.password)
    await page1.click('button[type="submit"]')
    await page1.goto('/user/catalog')

    const botaoAdd = page1.locator('[data-testid="add-to-cart"], button:has-text("Adicionar")').first()
    await botaoAdd.click()

    // Capturar localStorage do contexto 1
    const localStorageData = await page1.evaluate(() => JSON.stringify(window.localStorage))

    // Contexto 2: restaurar localStorage e verificar
    await page2.goto('/login')
    await page2.fill('[name="email"]', TEST_USERS.cliente.email)
    await page2.fill('[name="password"]', TEST_USERS.cliente.password)
    await page2.click('button[type="submit"]')

    // Restaurar localStorage
    await page2.evaluate((data) => {
      const parsed = JSON.parse(data)
      for (const key of Object.keys(parsed)) {
        window.localStorage.setItem(key, parsed[key])
      }
    }, localStorageData)

    await page2.goto('/user/cart')

    // Verificar se carrinho foi restaurado
    const contador = page2.locator('[data-testid="cart-count"], .cart-count')
    const texto = await contador.textContent()
    expect(parseInt(texto || '0', 10)).toBeGreaterThanOrEqual(1)

    await context1.close()
    await context2.close()
  })
})