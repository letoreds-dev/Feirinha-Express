// Diretor Técnico
// Decisões de architecture, code review, performance

import type { AgentConfig, AgentActivity, AgentCallbacks } from '../types.js'

export const techConfig: AgentConfig = {
  id: 'tech',
  type: 'tech',
  name: 'Marina',
  title: 'Diretora Técnica',
  color: '#06B6D4', // Ciano
  avatar: '👩‍💻',
  position: { x: 4, y: 0, z: 2 },
  workstation: 'dev-station'
}

// Tarefas técnicas
const techTasks = [
  'Revisar PR de autenticação JWT',
  'Otimizar queries do dashboard',
  'Implementar cache Redis',
  'Refatorar componentes UI',
  'Adicionar testes E2E',
  'Melhorar performance do checkout',
  'Implementar rate limiting',
  'Revisar segurança da API',
  'Configurar CI/CD',
  'Documentar endpoints da API',
  'Migrar para Next.js 15',
  'Implementar service worker'
]

// Melhorias de código
const codeReviews = [
  'Sugestão: usar useMemo para evitar re-renders',
  'Props drilling detectado, considerar Context API',
  'Componente muito grande, dividir em menores',
  'Falta tratamento de erros async',
  'Adicionar loading states nos componentes',
  'Query custom hook pode simplificar lógica',
  'CSS-in-JS está causando FOUC, revisar',
  'TypeScript strict mode recomendado'
]

function generateTechActivity(): Partial<AgentActivity> {
  return {
    agentId: 'tech',
    type: Math.random() > 0.6 ? 'coding' : 'reviewing',
    title: techTasks[Math.floor(Math.random() * techTasks.length)],
    description: 'Marina está trabalhando em melhorias técnicas',
    priority: Math.random() > 0.8 ? 'critical' : Math.random() > 0.5 ? 'high' : 'medium',
    status: 'in-progress'
  }
}

// Faz code review
export function techReview(): string {
  const review = codeReviews[Math.floor(Math.random() * codeReviews.length)]
  return review
}

// Sugere arquitetura
export function techArchitect(): { component: string; suggestion: string } {
  const suggestions = [
    { component: 'Carrinho', suggestion: 'Mover estado para Zustand + persistência localStorage' },
    { component: 'API', suggestion: 'Implementar GraphQL para减少 over-fetching' },
    { component: 'Auth', suggestion: 'Adicionar refresh token com rotação' },
    { component: 'Images', suggestion: 'Implementar lazy loading com blur placeholder' },
    { component: 'Forms', suggestion: 'Criar hook useForm com Zod validation' },
    { component: 'Payments', suggestion: 'Isolar lógica PIX em service separado' }
  ]
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

// Refatora código
export function techRefactor(): string {
  const refactors = [
    'Extraiu lógica de formatação para utilitário',
    'Abstraiu API client em classe reutilizável',
    'Criou custom hooks para lógica repetitiva',
    'Simplificou ternários com optional chaining',
    'Consolidou tipos em arquivo único',
    'Adicionou early returns para reduzir nesting'
  ]
  return refactors[Math.floor(Math.random() * refactors.length)]
}

export function techTick(callbacks?: AgentCallbacks): void {
  // Code review
  if (Math.random() > 0.5) {
    callbacks?.onLog?.({
      agentId: 'tech',
      level: 'info',
      message: `🔍 Code review: "${techReview()}"`
    })
  }

  // Sugestão de arquitetura
  if (Math.random() > 0.75) {
    const arch = techArchitect()
    callbacks?.onLog?.({
      agentId: 'tech',
      level: 'warning',
      message: `🏗️ Arquitetura: [${arch.component}] ${arch.suggestion}`
    })
  }

  // Refatoração
  if (Math.random() > 0.7) {
    callbacks?.onLog?.({
      agentId: 'tech',
      level: 'success',
      message: `♻️ Refatorou: ${techRefactor()}`
    })
  }

  // Nova atividade técnica
  if (Math.random() > 0.4) {
    const activity = generateTechActivity()
    const fullActivity: AgentActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity as Omit<AgentActivity, 'id'>,
      startedAt: new Date()
    } as AgentActivity
    callbacks?.onActivityStart?.(fullActivity)
    callbacks?.onLog?.({
      agentId: 'tech',
      level: 'info',
      message: `⚙️ Tech task: ${fullActivity.title}`
    })
  }
}

export const tech = {
  config: techConfig,
  tick: techTick,
  review: techReview,
  architect: techArchitect,
  refactor: techRefactor
}