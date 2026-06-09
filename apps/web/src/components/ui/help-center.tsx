/**
 * Feirinha Express - Help Center & FAQ
 * Complete help system with categories and search
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

// ==================== TYPES ====================

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

interface HelpCategory {
  id: string
  name: string
  icon: string
  description: string
  articleCount: number
}

// ==================== HELP CATEGORIES ====================

const helpCategories: HelpCategory[] = [
  {
    id: 'account',
    name: 'Conta',
    icon: '👤',
    description: 'Login, cadastro e configurações',
    articleCount: 8,
  },
  {
    id: 'orders',
    name: 'Pedidos',
    icon: '📦',
    description: 'Como fazer e acompanhar pedidos',
    articleCount: 12,
  },
  {
    id: 'payment',
    name: 'Pagamentos',
    icon: '💳',
    description: 'Cartões, PIX e cupons',
    articleCount: 6,
  },
  {
    id: 'delivery',
    name: 'Entregas',
    icon: '🚚',
    description: 'Tempo, rastreamento e problemas',
    articleCount: 10,
  },
  {
    id: 'stores',
    name: 'Lojas',
    icon: '🏪',
    description: 'Avaliar e seguir lojas',
    articleCount: 5,
  },
  {
    id: 'technical',
    name: 'Técnico',
    icon: '🔧',
    description: 'Problemas técnicos e app',
    articleCount: 7,
  },
]

// ==================== FAQ ITEMS ====================

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Como faço meu primeiro pedido?',
    answer: 'Para fazer seu primeiro pedido:\n\n1. Abra o app e escolha uma loja\n2. Navegue pelo cardápio e adicione itens ao carrinho\n3. Revise seu pedido e clique em "Finalizar pedido"\n4. Escolha o endereço de entrega\n5. Selecione a forma de pagamento\n6. Confirme o pedido!\n\nSeu pedido será preparado e entregue no endereço indicado.',
    category: 'orders',
    helpful: 245,
  },
  {
    id: '2',
    question: 'Quanto tempo demora para chegar meu pedido?',
    answer: 'O tempo de entrega varia de acordo com:\n\n• Distância da loja até você\n• Horário (horário de pico pode ser mais demorado)\n• Volume de pedidos\n\nEm média, os pedidos chegam em 25-45 minutos. Você pode acompanhar o status em tempo real na tela de rastreamento.',
    category: 'delivery',
    helpful: 189,
  },
  {
    id: '3',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos as seguintes formas de pagamento:\n\n• Cartão de crédito (Visa, Mastercard, Amex, Elo)\n• Cartão de débito\n• PIX\n• Vale-refeição (Alelo, Sodexo, Ticket)\n• Dinheiro na entrega\n\nO PIX é a forma mais rápida - confirmação instantânea!',
    category: 'payment',
    helpful: 167,
  },
  {
    id: '4',
    question: 'Como funciona o rastreamento do pedido?',
    answer: 'Após confirmar o pedido, você verá uma tela de rastreamento com:\n\n• Status em tempo real (confirmado, preparando, saiu para entrega)\n• Nome e foto do entregador\n• Tempo estimado de chegada\n• Mapa com localização do pedido\n\nVocê também recebe notificações a cada mudança de status.',
    category: 'delivery',
    helpful: 234,
  },
  {
    id: '5',
    question: 'Esqueci minha senha. Como recuperá-la?',
    answer: 'Para recuperar sua senha:\n\n1. Na tela de login, toque em "Esqueci minha senha"\n2. Digite seu e-mail ou telefone cadastrado\n3. Você receberá um link para criar uma nova senha\n4. Clique no link e defina sua nova senha\n\nA recuperação é feita por e-mail ou SMS, dependendo do seu cadastro.',
    category: 'account',
    helpful: 156,
  },
  {
    id: '6',
    question: 'Como usar um cupom de desconto?',
    answer: 'Para usar um cupom:\n\n1. Adicione os itens ao carrinho\n2. Na tela do carrinho, toque em "Adicionar cupom"\n3. Digite o código do cupom\n4. O desconto será aplicado automaticamente\n\nVocê encontra cupons em promoções, e-mails e no seu perfil.',
    category: 'payment',
    helpful: 198,
  },
  {
    id: '7',
    question: 'O entregador não entrou em contato. E agora?',
    answer: 'Se o entregador não entrar em contato:\n\n1. Verifique se o número está correto no seu cadastro\n2. Acesse o rastreamento para ver a localização\n3. Tente ligar para o entregador pelo chat\n4. Se o problema persistir, entre em contato com o suporte\n\nHorário de espera: até 10 minutos além do tempo estimado.',
    category: 'delivery',
    helpful: 145,
  },
  {
    id: '8',
    question: 'Como avalio um pedido?',
    answer: 'Para avaliar um pedido:\n\n1. Após a entrega, você receberá uma notificação\n2. Toque em "Avaliar pedido"\n3. Dê estrelas (1-5) para:\n   • Qualidade do produto\n   • Entrega\n   • Experiência geral\n4. Adicione um comentário (opcional)\n5. Toque em "Enviar"\n\nSua avaliação ajuda outros usuários e lojas!',
    category: 'stores',
    helpful: 178,
  },
  {
    id: '9',
    question: 'Posso cancelar um pedido?',
    answer: 'Sim, você pode cancelar seu pedido:\n\n• Antes de ser confirmado pela loja: cancelamento gratuito\n• Após confirmação: sujeito a taxa de cancelamento\n• Após saída para entrega: não é possível cancelar\n\nPara cancelar, vá em "Meus Pedidos" e toque em "Cancelar".',
    category: 'orders',
    helpful: 167,
  },
  {
    id: '10',
    question: 'O app não está funcionando. O que fazer?',
    answer: 'Se o app não estiver funcionando:\n\n1. Verifique sua conexão com a internet\n2. Force o fechamento e abra novamente\n3. Limpe o cache do app (Configurações > Apps)\n4. Verifique se há atualização disponível na loja\n5. Tente reiniciar seu celular\n\nSe o problema persistir, entre em contato com o suporte.',
    category: 'technical',
    helpful: 234,
  },
]

// ==================== FAQ ACCORDION ====================

interface FAQAccordionProps {
  item: FAQItem
}

function FAQAccordion({ item }: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [helpful, setHelpful] = useState(item.helpful)

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <span className={`text-xl transition-transform ${isOpen ? 'rotate-90' : ''}`}>
          ▶
        </span>
        <span className="flex-1 font-medium text-brand-ink">{item.question}</span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pl-10">
          <p className="text-brand-muted whitespace-pre-line">{item.answer}</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-brand-line">
            <span className="text-sm text-brand-muted">Isso foi útil?</span>
            <button
              onClick={() => setHelpful(prev => prev + 1)}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
            >
              👍 Sim ({helpful})
            </button>
            <button className="text-sm text-red-500 hover:text-red-600">
              Não
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

// ==================== HELP CENTER PAGE ====================

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null)

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === null || faq.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const handleContactSupport = () => {
    // Open chat or contact form
    alert('Abrindo chat com suporte...')
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar dúvida..."
          className="w-full pl-12 pr-4 py-4 bg-brand-soft rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red"
        />
      </div>

      {/* Categories */}
      {searchQuery === '' && (
        <div>
          <h3 className="font-bold text-brand-ink mb-3">Categorias</h3>
          <div className="grid grid-cols-2 gap-3">
            {helpCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`p-4 rounded-2xl text-left transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brand-red text-white'
                    : 'bg-white'
                }`}
              >
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <p className={`font-medium ${activeCategory === cat.id ? 'text-white' : 'text-brand-ink'}`}>
                  {cat.name}
                </p>
                <p className={`text-xs ${activeCategory === cat.id ? 'text-white text-opacity-80' : 'text-brand-muted'}`}>
                  {cat.articleCount} artigos
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-brand-ink">
            {activeCategory
              ? helpCategories.find(c => c.id === activeCategory)?.name
              : 'Perguntas Frequentes'}
          </h3>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm text-brand-red"
            >
              Ver todas
            </button>
          )}
        </div>

        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-brand-muted">Nenhum resultado encontrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFAQs.map(faq => (
              <FAQAccordion key={faq.id} item={faq} />
            ))}
          </div>
        )}
      </div>

      {/* Contact Support */}
      <Card padding="md" className="bg-gradient-to-br from-brand-soft to-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center text-2xl">
            💬
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-brand-ink">Precisa de mais ajuda?</h3>
            <p className="text-sm text-brand-muted mt-1">
              Nossa equipe está pronta para ajudar você!
            </p>
            <Button variant="primary" className="mt-3" onClick={handleContactSupport}>
              Falar com suporte
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Links Rápidos</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
            <span className="text-xl">📱</span>
            <span className="text-brand-ink">Baixar app</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
            <span className="text-xl">📧</span>
            <span className="text-brand-ink">Enviar e-mail</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
            <span className="text-xl">📜</span>
            <span className="text-brand-ink">Termos de uso</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
            <span className="text-xl">🔒</span>
            <span className="text-brand-ink">Política de privacidade</span>
          </button>
        </div>
      </Card>
    </div>
  )
}

// ==================== CONTACT FORM ====================

export function ContactForm() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [orderId, setOrderId] = useState('')

  const subjects = [
    'Problema com pedido',
    'Dúvida sobre pagamento',
    'Problema técnico',
    'Sugestão',
    'Reclamação',
    'Outro',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Mensagem enviada! Entraremos em contato em breve.')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-brand-ink">Fale conosco</h3>

      <div>
        <label className="block text-sm font-medium text-brand-ink mb-2">Assunto</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 bg-brand-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red"
        >
          <option value="">Selecione um assunto</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-ink mb-2">Número do pedido (opcional)</label>
        <Input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Ex: PED-2024-001234"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-ink mb-2">Mensagem</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Descreva seu problema ou dúvida..."
          className="w-full px-4 py-3 bg-brand-soft rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-red"
          rows={5}
          required
        />
      </div>

      <Button variant="primary" type="submit" className="w-full">
        Enviar mensagem
      </Button>
    </form>
  )
}

// ==================== ALIAS ====================

// Alias for compatibility
export const HelpCenter = HelpCenterPage