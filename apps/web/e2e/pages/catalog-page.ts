import { Page, Locator, expect } from '@playwright/test'

export interface ProdutoInfo {
  nome: string
  preco: string
  descricao?: string
}

export class CatalogPage {
  readonly page: Page
  readonly titulo: Locator
  readonly campoBusca: Locator
  readonly botaoBusca: Locator
  readonly filtros: Locator
  readonly listaProdutos: Locator
  readonly botaoCarrinho: Locator
  readonly contadorCarrinho: Locator

  constructor(page: Page) {
    this.page = page
    this.titulo = page.locator('h1:has-text("Catálogo"), h1:has-text("Produtos")]')
    this.campoBusca = page.locator('[data-testid="search-input"], [name="search"], input[placeholder*="Busca"]]')
    this.botaoBusca = page.locator('[data-testid="search-button"], button:has-text("Buscar")]')
    this.filtros = page.locator('[data-testid="filters"], .filters, aside')
    this.listaProdutos = page.locator('[data-testid="product-list"], .products, .product-grid, [class*="product"]')
    this.botaoCarrinho = page.locator('[data-testid="cart-button"], [data-testid="cart-icon"], a[href*="cart"]]')
    this.contadorCarrinho = page.locator('[data-testid="cart-count"], .cart-count, span:has-text("0"):right-of([data-testid="cart-button"])]')
  }

  async goto() {
    await this.page.goto('/user/catalog')
  }

  async buscarProduto(termo: string) {
    await this.campoBusca.fill(termo)
    await this.botaoBusca.click()
    await this.page.waitForResponse(response => response.url().includes('/api/products') || response.status() === 200)
  }

  async adicionarPrimeiroProdutoAoCarrinho() {
    const botaoAdd = this.page.locator('[data-testid="add-to-cart"], button:has-text("Adicionar"):first-of-type').first()
    await botaoAdd.click()
  }

  async adicionarProdutoAoCarrinho(produtoId: string) {
    const botaoAdd = this.page.locator(`[data-testid="add-to-cart-${produtoId}"], button[data-product-id="${produtoId}"]`)
    await botaoAdd.click()
  }

  async obterProdutos(): Promise<ProdutoInfo[]> {
    const produtos: ProdutoInfo[] = []
    const cards = this.page.locator('[data-testid="product-card"], .product-card, [class*="product"]')

    const count = await cards.count()
    for (let i = 0; i < Math.min(count, 10); i++) {
      const card = cards.nth(i)
      const nome = await card.locator('[data-testid="product-name"], .product-name, h3').textContent()
      const preco = await card.locator('[data-testid="product-price"], .product-price').textContent()

      produtos.push({
        nome: nome?.trim() || '',
        preco: preco?.trim() || '',
      })
    }

    return produtos
  }

  async obterContadorCarrinho(): Promise<number> {
    const contador = this.contadorCarrinho
    if (await contador.isVisible()) {
      const texto = await contador.textContent()
      return parseInt(texto?.trim() || '0', 10)
    }
    return 0
  }

  async irParaCarrinho() {
    await this.botaoCarrinho.click()
    await expect(this.page).toHaveURL(/\/cart/)
  }

  async aplicarFiltro(categoria: string) {
    const filtro = this.page.locator(`[data-testid="filter-${categoria}"], button:has-text("${categoria}")`)
    await filtro.click()
  }

  async ordenarPor(preco: 'menor' | 'maior') {
    const selectOrdenar = this.page.locator('[data-testid="sort-select"], select')
    await selectOrdenar.selectOption(preco === 'menor' ? 'price_asc' : 'price_desc')
  }
}