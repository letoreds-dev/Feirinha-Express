import { test as base, Page } from '@playwright/test'

export interface AuthFixtures {
  loggedInPage: Page
}

const DEMO_USER = {
  email: 'cliente@demo.com',
  password: 'demo123',
}

export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ page }, use) => {
    // Realiza login antes de cada teste que usar esta fixture
    await page.goto('/login')
    await page.fill('[name="email"]', DEMO_USER.email)
    await page.fill('[name="password"]', DEMO_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/user/home')

    // Passa a página logada para o teste
    await use(page)

    // Cleanup: faz logout após o teste
    await page.goto('/user/home')
    const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout"), [data-testid="logout"]')
    if (await logoutButton.isVisible()) {
      await logoutButton.click()
    }
  },
})

export { expect } from '@playwright/test'

// Credenciais de teste reutilizáveis
export const TEST_USERS = {
  cliente: {
    email: 'cliente@demo.com',
    password: 'demo123',
    nome: 'Cliente Demo',
  },
  vendedor: {
    email: 'vendedor@demo.com',
    password: 'demo123',
    nome: 'Vendedor Demo',
  },
  admin: {
    email: 'admin@demo.com',
    password: 'admin123',
    nome: 'Administrador',
  },
}