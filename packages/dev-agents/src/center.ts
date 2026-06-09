// ============================================
// FEIRINHA EXPRESS - CENTRO DE COMANDO
// Agentes que trabalham automaticamente
// ============================================

import type { AgentType } from './types'

export interface AgentTask {
  id: string
  agentId: AgentType
  type: 'feature' | 'fix' | 'improvement' | 'refactor'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in-progress' | 'completed'
  filesAffected: string[]
  effort: 'low' | 'medium' | 'high'
  createdAt: Date
  completedAt?: Date
}

export interface AgentUpdate {
  id: string
  timestamp: Date
  agentId: AgentType
  agentName: string
  tasks: AgentTask[]
  changes: ChangeSummary[]
  message: string
}

export interface ChangeSummary {
  type: 'added' | 'modified' | 'fixed' | 'improved'
  file: string
  description: string
  linesAdded?: number
  linesRemoved?: number
}

// ============================================
// AGENTE DE FRONTEND - Marina (Tech)
// ============================================
export const frontendAgent = {
  id: 'frontend' as AgentType,
  name: 'Marina',
  role: 'Frontend Engineer',
  specialty: ['React', 'Next.js', 'TypeScript', 'CSS', 'UX'],

  tasks: [
    {
      type: 'improvement',
      title: 'Adicionar skeletons de loading',
      description: 'Componentes mostram loading state profissional enquanto dados carregam',
      priority: 'medium',
      files: ['product-card.tsx', 'store-card.tsx'],
      effort: 'low'
    },
    {
      type: 'feature',
      title: 'Toast notifications',
      description: 'Sistema de notificações toast para feedback de ações',
      priority: 'high',
      files: ['components/ui/toast.tsx'],
      effort: 'medium'
    },
    {
      type: 'improvement',
      title: 'Animações de transição entre páginas',
      description: 'Transições suaves ao navegar entre rotas',
      priority: 'low',
      files: ['layout.tsx'],
      effort: 'low'
    },
    {
      type: 'fix',
      title: 'Corrigir responsividade do carrinho',
      description: 'Carrinho não adapta bem em telas pequenas',
      priority: 'high',
      files: ['store/cart.ts'],
      effort: 'medium'
    },
    {
      type: 'feature',
      title: 'Tema escuro',
      description: 'Opcional para usuários que preferem modo dark',
      priority: 'medium',
      files: ['store/theme.ts', 'globals.css'],
      effort: 'high'
    },
    {
      type: 'improvement',
      title: 'Debounce em busca de produtos',
      description: 'Evita múltiplas requisições enquanto usuario digita',
      priority: 'medium',
      files: ['components/ui/search-bar.tsx'],
      effort: 'low'
    }
  ]
}

// ============================================
// AGENTE DE BACKEND - Carlos
// ============================================
export const backendAgent = {
  id: 'backend' as AgentType,
  name: 'Carlos',
  role: 'Backend Engineer',
  specialty: ['Node.js', 'Fastify', 'Prisma', 'SQLite', 'API'],

  tasks: [
    {
      type: 'improvement',
      title: 'Adicionar paginação na API',
      description: 'Endpoints de listagem com limite e offset',
      priority: 'high',
      files: ['routes/stores.ts', 'routes/products.ts'],
      effort: 'medium'
    },
    {
      type: 'feature',
      title: 'Endpoint de busca fuzzy',
      description: 'Buscar produtos por similaridade, não só texto exato',
      priority: 'medium',
      files: ['routes/products.ts'],
      effort: 'high'
    },
    {
      type: 'fix',
      title: 'Validar tipos de pagamento',
      description: 'API aceita qualquer método, deveria validar',
      priority: 'high',
      files: ['routes/orders.ts'],
      effort: 'low'
    },
    {
      type: 'improvement',
      title: 'Cache de queries frequentes',
      description: 'Redis cache para stores e produtos mais acessados',
      priority: 'medium',
      files: ['routes/stores.ts'],
      effort: 'high'
    },
    {
      type: 'feature',
      title: 'Webhook para status de pedido',
      description: 'Lojista recebe notificação quando pedido muda status',
      priority: 'high',
      files: ['routes/orders.ts'],
      effort: 'medium'
    }
  ]
}

// ============================================
// AGENTE DE FEATURES - Lucas
// ============================================
export const featuresAgent = {
  id: 'features' as AgentType,
  name: 'Lucas',
  role: 'Product Engineer',
  specialty: ['Features', 'UX', 'Conversion', 'Analytics'],

  tasks: [
    {
      type: 'feature',
      title: 'Lista de favoritos',
      description: 'Usuário pode favoritar produtos para compra posterior',
      priority: 'high',
      files: ['store/favorites.ts', 'components/ui/product-card.tsx'],
      effort: 'medium'
    },
    {
      type: 'feature',
      title: 'Histórico de pedidos',
      description: 'Página com todos os pedidos anteriores do cliente',
      priority: 'high',
      files: ['app/user/orders/page.tsx', 'routes/orders.ts'],
      effort: 'medium'
    },
    {
      type: 'feature',
      title: 'Avaliações de produtos',
      description: 'Clientes podem avaliar e comentar produtos comprados',
      priority: 'medium',
      files: ['prisma/schema.prisma', 'routes/reviews.ts'],
      effort: 'high'
    },
    {
      type: 'feature',
      title: 'Cupons de desconto',
      description: 'Sistema de cupons para promoções',
      priority: 'medium',
      files: ['routes/coupons.ts', 'store/cart.ts'],
      effort: 'high'
    },
    {
      type: 'feature',
      title: 'Rastreio de entrega',
      description: 'Visualizar status da entrega em tempo real',
      priority: 'high',
      files: ['app/user/track/page.tsx'],
      effort: 'medium'
    }
  ]
}

// ============================================
// AGENTE DE QUALIDADE - Ana
// ============================================
export const qualityAgent = {
  id: 'quality' as AgentType,
  name: 'Ana',
  role: 'QA Engineer',
  specialty: ['Testing', 'Bug Finding', 'Performance', 'Security'],

  tasks: [
    {
      type: 'fix',
      title: 'Race condition no carrinho',
      description: 'Adicionar/remover item rápido causa estado inconsistente',
      priority: 'critical',
      files: ['store/cart.ts'],
      effort: 'medium'
    },
    {
      type: 'improvement',
      title: 'Tratamento de erros na API',
      description: 'Erros da API não mostram mensagem amigável',
      priority: 'high',
      files: ['lib/api.ts'],
      effort: 'low'
    },
    {
      type: 'fix',
      title: 'Session expira sem aviso',
      description: 'Usuário perde sessão sem saber o porquê',
      priority: 'high',
      files: ['store/auth.ts'],
      effort: 'low'
    },
    {
      type: 'improvement',
      title: 'Loading states em formulários',
      description: 'Form submit não mostra feedback visual',
      priority: 'medium',
      files: ['app/login/page.tsx'],
      effort: 'low'
    },
    {
      type: 'fix',
      title: 'Validação de email fraca',
      description: 'Aceita emails inválidos no cadastro',
      priority: 'high',
      files: ['routes/auth.ts'],
      effort: 'low'
    }
  ]
}

// ============================================
// CENTRO DE COMANDO
// ============================================
export const agents = [
  { ...frontendAgent, icon: '👩‍💻' },
  { ...backendAgent, icon: '⚙️' },
  { ...featuresAgent, icon: '✨' },
  { ...qualityAgent, icon: '🔍' }
]

// Próximas tarefas a executar
export function getNextTasks(): AgentTask[] {
  const allTasks = [
    ...frontendAgent.tasks,
    ...backendAgent.tasks,
    ...featuresAgent.tasks,
    ...qualityAgent.tasks
  ].filter(t => t.status !== 'completed')

  // Ordenar por prioridade
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  return allTasks
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 4)
}