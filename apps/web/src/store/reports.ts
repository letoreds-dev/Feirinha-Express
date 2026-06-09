// Store para relatórios de melhoria dos agentes

import { create } from 'zustand'

type AgentType = 'order' | 'delivery' | 'support' | 'payment' | 'inventory' | 'marketing' | 'loyalty' | 'review' | 'recommendation' | 'fraud' | 'analytics' | 'notification' | 'chatbot' | 'scheduler' | 'refund' | 'ceo' | 'tech' | 'customer-rel' | 'merchant-rel'

interface AgentDecision {
  id: string
  agentId: string
  type: string
  data: any
  timestamp: Date
}

export interface CodeImprovement {
  id: string
  agentId: AgentType
  category: 'performance' | 'ux' | 'security' | 'code' | 'feature'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  effort: 'low' | 'medium' | 'high'
  file?: string
  line?: number
  suggestedCode?: string
  reasoning: string
  createdAt: Date
  implemented: boolean
}

export interface AgentReport {
  id: string
  agentId: AgentType
  agentName: string
  agentRole: string
  timestamp: Date
  summary: string
  improvements: CodeImprovement[]
  decisions: string[]
  nextSteps: string[]
}

interface ReportsState {
  reports: AgentReport[]
  currentHour: number
  improvements: CodeImprovement[]
  isGenerating: boolean
  lastGeneratedAt: Date | null
}

interface ReportsActions {
  generateReports: () => AgentReport[]
  markAsImplemented: (improvementId: string) => void
  clearReports: () => void
  setCurrentHour: (hour: number) => void
}

type ReportsStore = ReportsState & ReportsActions

export const useReportsStore = create<ReportsStore>((set, get) => ({
  reports: [],
  currentHour: new Date().getHours(),
  improvements: [],
  isGenerating: false,
  lastGeneratedAt: null,

  generateReports: () => {
    set({ isGenerating: true })

    const reports: AgentReport[] = [
      generateTechReport(),
      generateMarketingReport(),
      generateCustomerRelReport(),
      generateMerchantRelReport(),
      generateCEOReport()
    ]

    // Coletar todas as melhorias
    const allImprovements = reports.flatMap(r => r.improvements)
    const newImprovements = allImprovements.filter(
      imp => !get().improvements.some(existing => existing.id === imp.id)
    )

    set((state) => ({
      reports: [reports[0], ...state.reports].slice(0, 24), // Keep last 24 hours
      improvements: [...state.improvements, ...newImprovements].slice(0, 100),
      isGenerating: false,
      lastGeneratedAt: new Date(),
      currentHour: new Date().getHours()
    }))

    return reports
  },

  markAsImplemented: (improvementId) =>
    set((state) => ({
      improvements: state.improvements.map((imp) =>
        imp.id === improvementId ? { ...imp, implemented: true } : imp
      )
    })),

  clearReports: () => set({ reports: [], improvements: [] }),

  setCurrentHour: (hour) => set({ currentHour: hour })
}))

// Gerador de relatório do CTO/Tech
function generateTechReport(): AgentReport {
  const improvements: CodeImprovement[] = [
    {
      id: `tech-${Date.now()}-1`,
      agentId: 'tech',
      category: 'performance',
      title: 'Adicionar memoização nos componentes de lista',
      description: 'ProductCard e StoreCard são renderizados muitas vezes desnecessariamente. Usar React.memo pode reduzir re-renderizações.',
      priority: 'medium',
      effort: 'low',
      file: 'apps/web/src/components/ui/product-card.tsx',
      reasoning: 'Benchmark mostra 40% menos renderizações em testes locais.',
      createdAt: new Date(),
      implemented: false
    },
    {
      id: `tech-${Date.now()}-2`,
      agentId: 'tech',
      category: 'security',
      title: 'Validar inputs de formulário no frontend',
      description: 'Os formulários de login e registro não têm validação client-side robusta. Adicionar Zod schemas.',
      priority: 'high',
      effort: 'medium',
      file: 'apps/web/src/app/login/page.tsx',
      reasoning: '用户提供恶意输入的风险。Melhor UX e segurança.',
      createdAt: new Date(),
      implemented: false
    },
    {
      id: `tech-${Date.now()}-3`,
      agentId: 'tech',
      category: 'performance',
      title: 'Lazy loading para imagens de produtos',
      description: 'Usar next/image com priority=false para imagens abaixo do fold.',
      priority: 'low',
      effort: 'low',
      file: 'apps/web/src/components/ui/product-card.tsx',
      reasoning: 'Reduz Initial Load Time em ~200ms em conexões lentas.',
      createdAt: new Date(),
      implemented: false
    }
  ]

  return {
    id: `report-tech-${Date.now()}`,
    agentId: 'tech',
    agentName: 'Marina',
    agentRole: 'Diretora Técnica',
    timestamp: new Date(),
    summary: 'Análise de performance e segurança do codebase. Identificados 3 pontos de melhoria.',
    improvements,
    decisions: [
      'Adotar React Query para cache de API',
      'Implementar error boundaries globais',
      'Setup de CI/CD para testes automatizados'
    ],
    nextSteps: [
      'Revisar PR #12 sobre memoização',
      'Criar ticket para validação Zod',
      'Benchmark de carregamento de imagens'
    ]
  }
}

// Gerador de relatório de Marketing
function generateMarketingReport(): AgentReport {
  const improvements: CodeImprovement[] = [
    {
      id: `mkt-${Date.now()}-1`,
      agentId: 'marketing',
      category: 'ux',
      title: 'Adicionar onboarding para novos lojistas',
      description: 'O fluxo de cadastro de lojista não tem hints ou instruções. Adicionar tooltip tour.',
      priority: 'medium',
      effort: 'high',
      file: 'apps/web/src/app/merchant/page.tsx',
      reasoning: 'Taxa de abandono de 35% no checkout de onboarding.',
      createdAt: new Date(),
      implemented: false
    },
    {
      id: `mkt-${Date.now()}-2`,
      agentId: 'marketing',
      category: 'feature',
      title: 'Adicionar página de promoções',
      description: 'Criar /promocoes com produtos em destaque para campanhas.',
      priority: 'high',
      effort: 'medium',
      file: 'apps/web/src/app/promocoes/page.tsx',
      reasoning: 'Concorrentes têm páginas similares. Aumenta conversão.',
      createdAt: new Date(),
      implemented: false
    }
  ]

  return {
    id: `report-mkt-${Date.now()}`,
    agentId: 'marketing',
    agentName: 'Lucas',
    agentRole: 'Diretor de Marketing',
    timestamp: new Date(),
    summary: 'Review de UX e features para conversão. 2 oportunidades identificadas.',
    improvements,
    decisions: [
      'Lançar promoções de verão na próxima semana',
      'A/B test no CTA de "Quero vender"',
      'Criar landing page para lojistas'
    ],
    nextSteps: [
      'Briefing para time de design',
      'Definir métricas de sucesso',
      'Agendar call com lojistas beta'
    ]
  }
}

// Gerador de relatório de CX
function generateCustomerRelReport(): AgentReport {
  const improvements: CodeImprovement[] = [
    {
      id: `cx-${Date.now()}-1`,
      agentId: 'customer-rel',
      category: 'ux',
      title: 'Adicionar chat de suporte inline',
      description: 'Usuários não encontram onde pedir ajuda. Chat flutuante no footer.',
      priority: 'high',
      effort: 'medium',
      file: 'apps/web/src/components/ui/navbar.tsx',
      reasoning: 'Tickets de suporte caíram 60% em apps com chat.',
      createdAt: new Date(),
      implemented: false
    },
    {
      id: `cx-${Date.now()}-2`,
      agentId: 'customer-rel',
      category: 'ux',
      title: 'Melhorar feedback de carrinho vazio',
      description: 'Carrinho vazio não sugere ações. Adicionar CTA para ver produtos.',
      priority: 'low',
      effort: 'low',
      file: 'apps/web/src/store/cart.ts',
      reasoning: '5% dos usuários abandonam sem ver sugeridos.',
      createdAt: new Date(),
      implemented: false
    }
  ]

  return {
    id: `report-cx-${Date.now()}`,
    agentId: 'customer-rel',
    agentName: 'Carla',
    agentRole: 'Diretora de CX',
    timestamp: new Date(),
    summary: 'Análise de pontos de atrito no funil de compra.',
    improvements,
    decisions: [
      'Adicionar FAQ no footer',
      'Criar Central de Ajuda',
      'Simplificar checkout para guest checkout'
    ],
    nextSteps: [
      'Entrevistar 10 usuários',
      'Mapear jornadas de uso',
      'Implementar NPS survey'
    ]
  }
}

// Gerador de relatório de Lojistas
function generateMerchantRelReport(): AgentReport {
  const improvements: CodeImprovement[] = [
    {
      id: `merch-${Date.now()}-1`,
      agentId: 'merchant-rel',
      category: 'feature',
      title: 'Dashboard de métricas para lojistas',
      description: 'Lojistas precisam ver vendas, ticket médio, conversão. Criar /merchant/dashboard.',
      priority: 'critical',
      effort: 'high',
      file: 'apps/api/src/routes/orders.ts',
      reasoning: 'Feedback direto de 8 lojistas beta.',
      createdAt: new Date(),
      implemented: false
    },
    {
      id: `merch-${Date.now()}-2`,
      agentId: 'merchant-rel',
      category: 'ux',
      title: 'Notificações Push para novos pedidos',
      description: 'Lojista só sabe de pedido via dashboard. Push aumenta tempo de resposta.',
      priority: 'high',
      effort: 'high',
      reasoning: 'Lojistas pediram formalmente na reunião de ontem.',
      createdAt: new Date(),
      implemented: false
    }
  ]

  return {
    id: `report-merch-${Date.now()}`,
    agentId: 'merchant-rel',
    agentName: 'Rafael',
    agentRole: 'Diretor de Lojistas',
    timestamp: new Date(),
    summary: 'Prioridades do time de lojistas. 2 features críticas identificadas.',
    improvements,
    decisions: [
      'Lançar dashboard na sprint 3',
      'Integrar Firebase para push notifications',
      'Criar template de email para novos pedidos'
    ],
    nextSteps: [
      'Wireframes do dashboard',
      'Alinhar com time de backend',
      'Beta test com 3 lojistas'
    ]
  }
}

// Gerador de relatório do CEO
function generateCEOReport(): AgentReport {
  const improvements: CodeImprovement[] = [
    {
      id: `ceo-${Date.now()}-1`,
      agentId: 'ceo',
      category: 'feature',
      title: 'MVP para lançamento em 2 semanas',
      description: 'Focar no核心功能: login, catálogo, carrinho, checkout PIX. Cortar extras.',
      priority: 'critical',
      effort: 'medium',
      reasoning: ' runway financeiro exige lançamento rápido.',
      createdAt: new Date(),
      implemented: false
    },
    {
      id: `ceo-${Date.now()}-2`,
      agentId: 'ceo',
      category: 'code',
      title: 'Adotar Conventional Commits',
      description: 'Padrão de commits facilita changelog automático e code review.',
      priority: 'low',
      effort: 'low',
      file: '.github/workflows/ci.yml',
      reasoning: 'Boas práticas de engineering para scale.',
      createdAt: new Date(),
      implemented: false
    }
  ]

  return {
    id: `report-ceo-${Date.now()}`,
    agentId: 'ceo',
    agentName: 'Aurora',
    agentRole: 'CEO',
    timestamp: new Date(),
    summary: 'Visão estratégica: focar no MVP para lançamento rápido.',
    improvements,
    decisions: [
      'Corte de features non-essential para v1',
      'Priorizar onboarding de lojistas',
      'Focar em 3 lojistas beta para feedback early'
    ],
    nextSteps: [
      'Sync com todos os leads sobre scope',
      'Definir criteria de lançamento',
      'Review de segurança antes de go-live'
    ]
  }
}