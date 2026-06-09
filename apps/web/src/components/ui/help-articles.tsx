'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface HelpArticle {
  id: string
  title: string
  category: string
  icon: string
  content: string
  helpful: number
  relatedArticles?: string[]
}

const articles: HelpArticle[] = [
  {
    id: '1',
    title: 'Como fazer um pedido?',
    category: 'Pedidos',
    icon: '🛒',
    content: `
Para fazer um pedido na Feirinha Express:

1. **Escolha a loja**: Navegue pelas categorias ou use a busca
2. **Selecione os produtos**: Toque nos itens que deseja
3. **Revise o carrinho**: Verifique quantidade e valores
4. **Escolha o endereço**: Selecione ou cadastre um novo
5. **Selecione o pagamento**: PIX, cartão ou vale-refeição
6. **Confirme o pedido**: Aguarde a confirmação e acompanhe

Seu pedido será preparado e entregue no prazo estimado!
    `,
    helpful: 245,
    relatedArticles: ['2', '4'],
  },
  {
    id: '2',
    title: 'Como rastrear meu pedido?',
    category: 'Pedidos',
    icon: '📦',
    content: `
Você pode rastrear seu pedido de duas formas:

**Pelo app:**
1. Acesse "Meus Pedidos"
2. Toque no pedido que deseja rastrear
3. Veja o status em tempo real

**Pelo link:**
Você receberá um link de rastreamento por notification push e e-mail.

**Status do pedido:**
- 🟡 Aguardando: Pedido recebido pela loja
- 🔵 Confirmado: Loja aceitou o pedido
- 🟠 Preparando: Seu pedido está sendo preparado
- 🟢 Pronto: Pedido pronto para entrega
- 🛵 Saiu: Entregador a caminho
- ✅ Entregue: Pedido entregue!
    `,
    helpful: 189,
    relatedArticles: ['1', '5'],
  },
  {
    id: '3',
    title: 'Quais formas de pagamento são aceitas?',
    category: 'Pagamento',
    icon: '💳',
    content: `
A Feirinha Express aceita diversas formas de pagamento:

**Online:**
- **PIX**: Desconto de 5%! Aprovação instantânea
- **Cartão de crédito**: Visa, Mastercard, Elo, American Express
- **Cartão de débito**: Bandeiras acima
- **Vale-refeição**: Alelo, Sodexo, Ticket

**Na entrega:**
- Dinheiro (com troco)
- Cartão (mesmas bandeiras)

**Cupons:**
- Insira o código na etapa de pagamento
- Descontos automáticos aplicados
    `,
    helpful: 156,
    relatedArticles: ['6'],
  },
  {
    id: '4',
    title: 'Como funciona o cancelamento?',
    category: 'Pedidos',
    icon: '❌',
    content: `
Você pode cancelar seu pedido nas seguintes situações:

**Antes da preparação:**
1. Acesse "Meus Pedidos"
2. Toque no pedido
3. Clique em "Cancelar pedido"

**Após preparação:**
Infelizmente não é possível cancelar, mas você pode:
- Recusar na entrega (reembolso integral)
- Solicitar cancelamento via chat (caso especial)

**Reembolso:**
- PIX: até 24h
- Cartão: na próxima fatura
- Dinheiro: via transferência
    `,
    helpful: 98,
    relatedArticles: ['1', '7'],
  },
  {
    id: '5',
    title: 'O entregador não chegou, o que fazer?',
    category: 'Entrega',
    icon: '🚚',
    content: `
Se seu pedido está atrasado:

1. **Verifique o rastreamento**: Toque no pedido para ver o status

2. **Espere um pouco**: Pode haver trânsito ou dificuldade

3. **Contate o entregador**:
   - Toque em "Falar com entregador"
   - Ligue diretamente

4. **Precisa de ajuda?**:
   - Chat de suporte no app
   - WhatsApp: (11) 99999-9999

**Em caso de extravio:**
Solicite reembolso total via chat - liberamos em até 24h.
    `,
    helpful: 134,
    relatedArticles: ['2', '7'],
  },
]

export function HelpArticles() {
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set())

  const toggleArticle = (id: string) => {
    setExpandedArticles(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const markHelpful = (article: HelpArticle) => {
    toast.success('Obrigado pelo feedback!')
  }

  const categories = [...new Set(articles.map(a => a.category))]

  if (selectedArticle) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-brand-red hover:underline"
        >
          ← Voltar aos artigos
        </button>

        <Card padding="md">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedArticle.icon}</span>
            <div>
              <Badge variant="outline" className="text-xs mb-1">{selectedArticle.category}</Badge>
              <h2 className="text-lg font-extrabold text-brand-ink">{selectedArticle.title}</h2>
            </div>
          </div>

          <div className="prose prose-sm text-brand-muted whitespace-pre-line">
            {selectedArticle.content}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-line">
            <p className="text-sm text-brand-muted">
              👍 {selectedArticle.helpful} pessoas acharam útil
            </p>
            <button
              onClick={() => markHelpful(selectedArticle)}
              className="px-4 py-2 text-sm text-brand-red border border-brand-red rounded-lg hover:bg-red-50"
            >
              Foi útil
            </button>
          </div>
        </Card>

        {selectedArticle.relatedArticles && (
          <div>
            <h3 className="font-bold text-brand-ink mb-3">Artigos relacionados</h3>
            <div className="space-y-2">
              {selectedArticle.relatedArticles.map(id => {
                const related = articles.find(a => a.id === id)
                if (!related) return null
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedArticle(related)}
                    className="w-full p-3 bg-white border border-brand-line rounded-xl text-left hover:bg-brand-soft transition-colors"
                  >
                    <p className="font-medium text-brand-ink">{related.icon} {related.title}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-brand-ink">📚 Artigos de ajuda</h3>

      {categories.map(category => (
        <div key={category}>
          <p className="text-xs text-brand-muted uppercase mb-2">{category}</p>
          <div className="space-y-2">
            {articles
              .filter(a => a.category === category)
              .map(article => (
                <Card key={article.id} padding="sm" className="cursor-pointer">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{article.icon}</span>
                      <span className="font-medium text-brand-ink">{article.title}</span>
                    </div>
                    <span className="text-brand-muted">→</span>
                  </button>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {/* Contact */}
      <Card padding="md" className="bg-blue-50 border-blue-200">
        <div className="text-center">
          <p className="text-2xl mb-2">💬</p>
          <p className="font-bold text-brand-ink">Não encontrou o que procurava?</p>
          <p className="text-sm text-brand-muted mb-4">
            Nossa equipe está pronta para ajudar
          </p>
          <div className="flex gap-2">
            <Link href="/user/help" className="flex-1">
              <button className="w-full py-2 bg-brand-red text-white rounded-lg font-medium">
                Chat de suporte
              </button>
            </Link>
            <a href="tel:+5511999999999" className="flex-1">
              <button className="w-full py-2 bg-white border border-brand-line text-brand-ink rounded-lg font-medium">
                Ligar
              </button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}