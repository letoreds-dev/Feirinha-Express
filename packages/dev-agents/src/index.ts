// ============================================
// FEIRINHA EXPRESS - INDEX DE AGENTES AUTÔNOMOS
// Exportação de todos os módulos
// ============================================

// Database de agentes
export * from './database.js'

// Motor autônomo
export { autonomousEngine, startAutonomousEngine, stopAutonomousEngine } from './engine-autonomous.js'

// Dashboard
export { AgentDashboard, commands } from './dashboard.js'

// Centro de comando legado (compatibilidade)
export * from './center.js'

// ============================================
// INFO GERAL
// ============================================

export const SYSTEM_INFO = {
  name: 'Feirinha Express - Autonomous Agent System',
  version: '1.0.0',
  totalAgents: 58,
  autonomous: true,
  features: [
    '58 agentes especializados',
    'Execução autônoma sem intervenção',
    'Priorização inteligente de tarefas',
    'Relatórios automáticos',
    'Monitoramento em tempo real',
    'Comunicação entre agentes',
    'Performance tracking',
    'Security scanning automático',
    'Code review automático',
    'Deploy automation'
  ],
  agentCategories: {
    frontend: { count: 10, icon: '👩‍💻' },
    backend: { count: 10, icon: '⚙️' },
    devops: { count: 8, icon: '☁️' },
    product: { count: 6, icon: '📋' },
    qa: { count: 6, icon: '🧪' },
    data: { count: 4, icon: '📊' },
    ai: { count: 4, icon: '🤖' },
    security: { count: 4, icon: '🔐' },
    infrastructure: { count: 6, icon: '🌐' },
    mobile: { count: 4, icon: '📱' }
  }
}

// ============================================
// QUICK START
// ============================================

/**
 * Para iniciar o sistema autônomo:
 *
 * import { startAutonomousEngine } from './packages/dev-agents/src/index.ts'
 *
 * startAutonomousEngine()
 *
 * O motor começará automaticamente a trabalhar em todas as tarefas
 * pendentes, coordenando os 58 agentes de forma autônoma.
 */

// Lista de tarefas prioritárias que os agentes trabalharão
export const PRIORITY_TASKS = [
  {
    id: 'critical-1',
    title: 'Configurar Neon Database',
    priority: 'critical',
    description: 'Migrar banco de dados para Neon serverless Postgres'
  },
  {
    id: 'critical-2',
    title: 'Implementar autenticação JWT',
    priority: 'critical',
    description: 'Sistema de autenticação seguro com JWT e refresh tokens'
  },
  {
    id: 'critical-3',
    title: 'Scanner OWASP',
    priority: 'critical',
    description: 'Auditar código para vulnerabilidades do top 10 OWASP'
  },
  {
    id: 'high-1',
    title: 'Deploy Vercel',
    priority: 'high',
    description: 'Configurar deploy automático no Vercel'
  },
  {
    id: 'high-2',
    title: 'PWA offline support',
    priority: 'high',
    description: 'Implementar service workers para funcionar offline'
  },
  {
    id: 'high-3',
    title: 'Testes E2E',
    priority: 'high',
    description: 'Criar suite de testes end-to-end com Cypress'
  },
  {
    id: 'medium-1',
    title: 'Design system',
    priority: 'medium',
    description: 'Criar biblioteca de componentes reutilizáveis'
  },
  {
    id: 'medium-2',
    title: 'Analytics dashboard',
    priority: 'medium',
    description: 'Dashboard de métricas e analytics'
  },
  {
    id: 'low-1',
    title: 'SEO optimization',
    priority: 'low',
    description: 'Otimizar meta tags e SEO on-page'
  }
]

console.log(`
╔══════════════════════════════════════════════════════════╗
║  🤖 FEIRINHA EXPRESS - SISTEMA DE AGENTES AUTÔNOMOS     ║
║                                                          ║
║  58 agentes prontos para trabalhar no seu projeto!       ║
║                                                          ║
║  Para iniciar:                                           ║
║  > import { startAutonomousEngine } from './index.ts'    ║
║  > startAutonomousEngine()                                ║
║                                                          ║
║  Autonomia: TOTAL - Sem necessidade de intervenção      ║
╚══════════════════════════════════════════════════════════╝
`)