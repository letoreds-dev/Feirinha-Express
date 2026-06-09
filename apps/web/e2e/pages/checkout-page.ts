import { Page, Locator, expect } from '@playwright/test'

export interface ItemCarrinho {
  nome: string
  quantidade: number
  preco: string
}

export class CheckoutPage {
  readonly page: Page
  readonly listaItens: Locator
  readonly resumoPedido: Locator
  readonly total: Locator
  readonly botaoFinalizar: Locator
  readonly campoCEP: Locator
  readonly campoEndereco: Locator
  readonly metodoPagamento: Locator
  readonly mensagemSucesso: Locator

  constructor(page: Page) {
    this.page = page
    this.listaItens = page.locator('[data-testid="cart-items"], .cart-items, [class*="cart-item"]')
    this.resumoPedido = page.locator('[data-testid="order-summary"], .summary, .order-summary')
    this.total = page.locator('[data-testid="cart-total"], .total, .cart-total')
    this.botaoFinalizar = page.locator('[data-testid="checkout-button"], button:has-text("Finalizar"), button:has-text("Comprar")]')
    this.campoCEP = page.locator('[name="cep"], [id*="cep"], input[placeholder*="CEP"]]')
    this.campoEndereco = page.locator('[name="address"], [id*="address"], input[placeholder*="endereço"]]')
    this.metodoPagamento = page.locator('[data-testid="payment-method"], .payment-method, select[name*="payment"]]')
    this.mensagemSucesso = page.locator('[data-testid="success-message"], .success:has-text("sucesso"), [role="status"]:has-text("sucesso")]')
  }

  async goto() {
    await this.page.goto('/user/cart')
  }

  async obterItens(): Promise<ItemCarrinho[]> {
    const itens: ItemCarrinho[] = []
    const cards = this.listaItens

    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const nome = await card.locator('[data-testid="item-name"], .item-name, h4').textContent()
      const quantidade = await card.locator('[data-testid="item-quantity"], .quantity').textContent()
      const preco = await card.locator('[data-testid="item-price"], .item-price').textContent()

      itens.push({
        nome: nome?.trim() || '',
        quantidade: parseInt(quantidade?.trim() || '1', 10),
        preco: preco?.trim() || '',
      })
    }

    return itens
  }

  async obterTotal(): Promise<string> {
    const textoTotal = await this.total.textContent()
    return textoTotal?.trim() || '0'
  }

  async alterarQuantidadeItem(itemIndex: number, novaQuantidade: number) {
    const botaoMenos = this.listaItens.nth(itemIndex).locator('button:has-text("-"), button[data-action="decrease"]')
    const botaoMais = this.listaItens.nth(itemIndex).locator('button:has-text("+"), button[data-action="increase"]')

    const quantidadeAtual = parseInt(await this.listaItens.nth(itemIndex).locator('[data-testid="item-quantity"]').textContent() || '1', 10)
    const diferenca = novaQuantidade - quantidadeAtual

    if (diferenca > 0) {
      for (let i = 0; i < diferenca; i++) {
        await botaoMais.click()
      }
    } else if (diferenca < 0) {
      for (let i = 0; i < Math.abs(diferenca); i++) {
        await botaoMenos.click()
      }
    }
  }

  async removerItem(itemIndex: number) {
    const botaoRemover = this.listaItens.nth(itemIndex).locator('[data-testid="remove-item"], button:has-text("Remover")]')
    await botaoRemover.click()
  }

  async preencherEndereco(cep: string, endereco: string) {
    await this.campoCEP.fill(cep)
    await this.campoEndereco.fill(endereco)
  }

  async selecionarMetodoPagamento(metodo: 'pix' | 'cartao' | 'boleto') {
    const select = this.metodoPagamento
    await select.selectOption(metodo)
  }

  async finalizarPedido() {
    await this.botaoFinalizar.click()
  }

  async verificarPedidoSucesso() {
    await expect(this.mensagemSucesso).toBeVisible({ timeout: 10000 })
  }

  async estaVazio(): Promise<boolean> {
    const mensagemVazio = this.page.locator('[data-testid="empty-cart"], .empty-cart:has-text("vazio")]')
    return await mensagemVazio.isVisible()
  }

  async esvaziarCarrinho() {
    const count = await this.listaItens.count()
    for (let i = count - 1; i >= 0; i--) {
      await this.removerItem(0)
    }
  }
}