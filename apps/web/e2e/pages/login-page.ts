import { Page, Locator, expect } from '@playwright/test'
import { TEST_USERS } from '../fixtures/auth'

export class LoginPage {
  readonly page: Page
  readonly titulo: Locator
  readonly campoEmail: Locator
  readonly campoSenha: Locator
  readonly botaoSubmit: Locator
  readonly linkCadastro: Locator
  readonly mensagemErro: Locator
  readonly lembrarMe: Locator

  constructor(page: Page) {
    this.page = page
    this.titulo = page.locator('h1:has-text("Login"), h1:has-text("Entrar")]')
    this.campoEmail = page.locator('[name="email"], [type="email"], input[id*="email"]]')
    this.campoSenha = page.locator('[name="password"], [type="password"], input[id*="password"]]')
    this.botaoSubmit = page.locator('button[type="submit"], button:has-text("Entrar")]')
    this.linkCadastro = page.locator('a:has-text("Cadastrar"), a:has-text("Criar conta")]')
    this.mensagemErro = page.locator('[data-testid="error-message"], .error, [role="alert"]:has-text("incorreto")]')
    this.lembrarMe = page.locator('[name="remember"], [id*="remember"]')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async preencherCredenciais(email: string, senha: string) {
    await this.campoEmail.fill(email)
    await this.campoSenha.fill(senha)
  }

  async fazerLogin(email: string, senha: string) {
    await this.preencherCredenciais(email, senha)
    await this.botaoSubmit.click()
  }

  async fazerLoginComoCliente() {
    await this.fazerLogin(TEST_USERS.cliente.email, TEST_USERS.cliente.password)
  }

  async fazerLoginComoVendedor() {
    await this.fazerLogin(TEST_USERS.vendedor.email, TEST_USERS.vendedor.password)
  }

  async verificarMensagemErro(mensagem: string) {
    await expect(this.mensagemErro).toBeVisible()
    await expect(this.mensagemErro).toContainText(mensagem)
  }

  async verificarRedirecionamentoPara(url: string) {
    await expect(this.page).toHaveURL(new RegExp(url))
  }

  async clicarLinkCadastro() {
    await this.linkCadastro.click()
    await expect(this.page).toHaveURL(/\/cadastro/)
  }
}