import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { HomePage } from '../pages/home-page'
import { TEST_USERS } from '../fixtures/auth'

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('deve exibir formulario de login corretamente', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/login|entrar/i)
    await expect(page.locator('[name="email"]')).toBeVisible()
    await expect(page.locator('[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('deve fazer login com credenciais validas de cliente', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.preencherCredenciais(TEST_USERS.cliente.email, TEST_USERS.cliente.password)
    await loginPage.botaoSubmit.click()

    await expect(page).toHaveURL(/\/user\/home/, { timeout: 10000 })
    await expect(page.locator('body')).toContainText(TEST_USERS.cliente.nome, { ignoreCase: true })
  })

  test('deve fazer login com credenciais validas de vendedor', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.preencherCredenciais(TEST_USERS.vendedor.email, TEST_USERS.vendedor.password)
    await loginPage.botaoSubmit.click()

    await expect(page).toHaveURL(/\/user\/home|dashboard/, { timeout: 10000 })
  })

  test('deve mostrar erro com credenciais invalidas', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.preencherCredenciais('invalid@test.com', 'wrongpassword')
    await loginPage.botaoSubmit.click()

    await expect(page.locator('[data-testid="error-message"], .error, [role="alert"]')).toBeVisible({ timeout: 5000 })
  })

  test('deve mostrar erro com email vazio', async ({ page }) => {
    await page.locator('[name="email"]').fill('')
    await page.locator('[name="password"]').fill('anypassword')
    await page.locator('button[type="submit"]').click()

    await expect(page.locator('[data-testid="error-message"], .error')).toBeVisible()
  })

  test('deve mostrar erro com senha vazia', async ({ page }) => {
    await page.locator('[name="email"]').fill('test@test.com')
    await page.locator('[name="password"]').fill('')
    await page.locator('button[type="submit"]').click()

    await expect(page.locator('[data-testid="error-message"], .error')).toBeVisible()
  })

  test('deve manter usuario logado ao navegar entre paginas', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const homePage = new HomePage(page)

    await loginPage.fazerLoginComoCliente()
    await expect(page).toHaveURL(/\/user\/home/)

    await homePage.goto()
    await expect(page).toHaveURL(/\/user\/home/)
    await expect(homePage.estaLogado()).toBeTruthy()
  })

  test('deve ter link para pagina de cadastro', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const linkCadastro = page.locator('a:has-text("Cadastrar"), a:has-text("Criar conta"), a:has-text("Registrar")')

    await expect(linkCadastro).toBeVisible()
    await linkCadastro.click()
    await expect(page).toHaveURL(/\/cadastro|register/)
  })
})

test.describe('Sessao e Logout', () => {
  test('deve permitir logout corretamente', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', TEST_USERS.cliente.email)
    await page.fill('[name="password"]', TEST_USERS.cliente.password)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/user\/home/)

    // Logout
    const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout"), [data-testid="logout"]')
    await logoutButton.click()

    // Verificar que foi deslogado
    await expect(page).toHaveURL('/')
    await expect(page.locator('a:has-text("Entrar"), a:has-text("Login")')).toBeVisible()
  })
})