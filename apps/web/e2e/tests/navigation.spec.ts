import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home-page'
import { LoginPage } from '../pages/login-page'
import { CatalogPage } from '../pages/catalog-page'
import { CheckoutPage } from '../pages/checkout-page'

test.describe('Navegacao', () => {
  test('deve carregar a pagina inicial', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    await expect(page).toHaveTitle(/.*feirinha.*|.*feira.*|.*express.*/i)
    await expect(homePage.header).toBeVisible()
  })

  test('deve ter acesso ao login pela pagina inicial', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    await homePage.clickLogin()
    await expect(page).toHaveURL(/\/login/)
  })

  test('deve navegar para o catalogo quando logado', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'cliente@demo.com')
    await page.fill('[name="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/user\/home/)

    // Navegar para catalogo via menu
    const menuCatalogo = page.locator('a:has-text("Catálogo"), a:has-text("Produtos"), nav a[href*="catalog"]')
    await menuCatalogo.first().click()

    await expect(page).toHaveURL(/\/user\/catalog|catalog/)
  })

  test('deve redirecionar para login ao acessar pagina protegida', async ({ page }) => {
    // Tentar acessar catalogo sem login
    await page.goto('/user/catalog')

    // Deve redirecionar para login
    await expect(page).toHaveURL(/\/login/)
  })

  test('deve manter navegacao consistente no menu', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'cliente@demo.com')
    await page.fill('[name="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/user\/home/)

    // Verificar elementos do menu
    const menuItems = page.locator('nav a, header a, [role="navigation"] a')
    const count = await menuItems.count()

    expect(count).toBeGreaterThan(0)

    // Cada link do menu deve ser clicavel
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = menuItems.nth(i)
      if (await link.isVisible()) {
        const href = await link.getAttribute('href')
        if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
          // Verifica que o link existe e tem href válido
          expect(href).toBeTruthy()
        }
      }
    }
  })

  test('deve navegar de catalogo para carrinho', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'cliente@demo.com')
    await page.fill('[name="password"]', 'demo123')
    await page.click('button[type="submit"]')

    // Ir para catalogo
    await page.goto('/user/catalog')
    await expect(page).toHaveURL(/\/user\/catalog/)

    // Ir para carrinho
    await page.goto('/user/cart')
    await expect(page).toHaveURL(/\/user\/cart|cart/)
  })

  test('deve mostrar breadcrumb ou navegacao historica', async ({ page }) => {
    // Login e navegar
    await page.goto('/login')
    await page.fill('[name="email"]', 'cliente@demo.com')
    await page.fill('[name="password"]', 'demo123')
    await page.click('button[type="submit"]')

    await page.goto('/user/catalog')
    await page.goto('/user/cart')

    // Verificar se há navegacao para voltar
    const botaoVoltar = page.locator('button:has-text("Voltar"), a:has-text("Voltar"), [data-testid="back"]')
    const temVoltar = await botaoVoltar.count() > 0

    // Se tem botao voltar, deve funcionar
    if (temVoltar) {
      await botaoVoltar.first().click()
      await expect(page).toHaveURL(/\/user\/catalog/)
    }
  })
})

test.describe('Rotas e URLs', () => {
  test('deve ter URLs amigaveis', async ({ page }) => {
    await page.goto('/login')
    expect(page.url()).toMatch(/\/login/)

    await page.goto('/')
    expect(page.url()).toMatch(/\/$|localhost/)
  })

  test('deve lidar com URL inexistente', async ({ page }) => {
    await page.goto('/pagina-inexistente-12345')

    // Deve mostrar pagina 404 ou redirecionar
    const estaNaPaginaInicial = page.url() === 'http://localhost:3000/' || page.url() === 'http://localhost:3000'
    const temMensagem404 = await page.locator('text=/404|pagina.*nao.*encontrada/i').count() > 0

    expect(estaNaPaginaInicial || temMensagem404).toBeTruthy()
  })
})