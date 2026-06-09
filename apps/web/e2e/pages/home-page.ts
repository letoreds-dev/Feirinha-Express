import { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly logo: Locator
  readonly header: Locator
  readonly botaoLogin: Locator
  readonly botaoCadastro: Locator
  readonly banner: Locator

  constructor(page: Page) {
    this.page = page
    this.logo = page.locator('[data-testid="logo"], header img, header a:has-text("Feirinha")]')
    this.header = page.locator('header')
    this.botaoLogin = page.locator('a:has-text("Entrar"), a:has-text("Login"), button:has-text("Entrar")]')
    this.botaoCadastro = page.locator('a:has-text("Cadastrar"), a:has-text("Registrar")]')
    this.banner = page.locator('[data-testid="banner"], .banner, section:first-of-type')
  }

  async goto() {
    await this.page.goto('/')
  }

  async clickLogin() {
    await this.botaoLogin.click()
    await this.page.waitForURL('/login')
  }

  async clickCadastro() {
    await this.botaoCadastro.click()
    await this.page.waitForURL('/cadastro')
  }

  async estaLogado(): Promise<boolean> {
    return await this.page.locator('[data-testid="user-menu"], [data-testid="user-name"]').isVisible()
  }

  async obterNomeUsuario(): Promise<string | null> {
    const userName = this.page.locator('[data-testid="user-name"], header span:has-text("Olá")]')
    if (await userName.isVisible()) {
      return await userName.textContent()
    }
    return null
  }
}