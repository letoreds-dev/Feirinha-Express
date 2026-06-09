// ============================================
// FEIRINHA EXPRESS - MOTOR AUTÔNOMO
// 58 agentes trabalhando sem interrupção
// ============================================

import chalk from 'chalk'
import { agentsDatabase, getAgent, type Agent, type AgentId, type Task, type AgentRole } from './database.js'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// ============================================
// CONFIGURAÇÃO DO MOTOR
// ============================================

interface EngineConfig {
  tickInterval: number        // Intervalo entre ticks (ms)
  agentsPerTick: number       // Agentes que executam por tick
  maxTasksPerAgent: number    // Máximo de tarefas por agente
  autonomousMode: boolean     // Sem pedir confirmação
  reportInterval: number      // Intervalo de relatórios (ms)
  maxConcurrentTasks: number   // Tarefas simultâneas
}

const config: EngineConfig = {
  tickInterval: 5000,          // 5 segundos
  agentsPerTick: 10,           // 10 agentes por tick
  maxTasksPerAgent: 5,         // 5 tarefas por agente
  autonomousMode: true,        // AUTONOMIA TOTAL
  reportInterval: 60000,       // 1 minuto
  maxConcurrentTasks: 15       // 15 tarefas simultâneas
}

// ============================================
// ESTADO DO MOTOR
// ============================================

interface EngineState {
  running: boolean
  tick: number
  activeTasks: Task[]
  completedTasks: Task[]
  agentsWorking: Map<AgentId, Task>
  lastReport: Date
  totalChanges: number
  startTime: Date
}

const state: EngineState = {
  running: false,
  tick: 0,
  activeTasks: [],
  completedTasks: [],
  agentsWorking: new Map(),
  lastReport: new Date(),
  totalChanges: 0,
  startTime: new Date()
}

// ============================================
// BANCO DE TAREFAS
// ============================================

const taskDatabase: Task[] = [
  // PRIORIDADE CRÍTICA - Segurança
  { id: 't-crit-1', agentId: 'security-1', type: 'security', title: 'Implementar JWT refresh token', description: 'Adicionar refresh token para sessão persistente', files: ['apps/api/src/middleware/auth.ts'], priority: 'critical', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-crit-2', agentId: 'security-2', type: 'security', title: 'Escanear vulnerabilidades OWASP', description: 'Auditar código para top 10 OWASP', files: ['apps/api/src/**', 'apps/web/src/**'], priority: 'critical', status: 'pending', effort: 'lg', createdAt: new Date() },
  { id: 't-crit-3', agentId: 'backend-2', type: 'fix', title: 'Corrigir SQL Injection potential', description: 'Validar inputs para prevenir SQL injection', files: ['apps/api/src/routes/**'], priority: 'critical', status: 'pending', effort: 'sm', createdAt: new Date() },

  // PRIORIDADE ALTA - Performance
  { id: 't-high-1', agentId: 'frontend-4', type: 'optimize', title: 'Otimizar Largest Contentful Paint', description: 'Melhorar LCP para < 2.5s', files: ['apps/web/src/app/**'], priority: 'high', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-high-2', agentId: 'backend-7', type: 'improvement', title: 'Implementar Redis cache', description: 'Cachear queries frequentes no Redis', files: ['apps/api/src/lib/cache.ts'], priority: 'high', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-high-3', agentId: 'qa-5', type: 'feature', title: 'Teste de carga com k6', description: 'Simular 1000 users simultâneos', files: ['tests/load/**'], priority: 'high', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-high-4', agentId: 'frontend-6', type: 'improvement', title: 'PWA offline support', description: 'Funcionar offline com service workers', files: ['apps/web/public/'], priority: 'high', status: 'pending', effort: 'lg', createdAt: new Date() },

  // PRIORIDADE MÉDIA - Features
  { id: 't-med-1', agentId: 'frontend-3', type: 'feature', title: 'Toast notifications', description: 'Sistema de notificações toast', files: ['apps/web/src/components/ui/toast.tsx'], priority: 'medium', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-med-2', agentId: 'backend-4', type: 'feature', title: 'Background job para emails', description: 'Enviar emails de forma assíncrona', files: ['apps/api/src/jobs/email.ts'], priority: 'medium', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-med-3', agentId: 'frontend-2', type: 'improvement', title: 'Design system completo', description: 'Criar biblioteca de componentes', files: ['apps/web/src/components/ui/**'], priority: 'medium', status: 'pending', effort: 'xl', createdAt: new Date() },
  { id: 't-med-4', agentId: 'data-2', type: 'improvement', title: 'Índices no PostgreSQL', description: 'Adicionar índices para queries frequentes', files: ['apps/api/prisma/schema.prisma'], priority: 'medium', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-med-5', agentId: 'ai-1', type: 'feature', title: 'Chatbot de suporte', description: 'Assistente virtual para clientes', files: ['apps/web/src/components/chatbot/**'], priority: 'medium', status: 'pending', effort: 'xl', createdAt: new Date() },

  // PRIORIDADE BAIXA - Melhorias
  { id: 't-low-1', agentId: 'frontend-5', type: 'improvement', title: 'Meta tags SEO', description: 'Otimizar SEO on-page', files: ['apps/web/src/app/**'], priority: 'low', status: 'pending', effort: 'sm', createdAt: new Date() },
  { id: 't-low-2', agentId: 'devops-2', type: 'improvement', title: 'Preview deployments', description: 'Deploy automático para PRs', files: ['.github/workflows/**'], priority: 'low', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-low-3', agentId: 'qa-1', type: 'improvement', title: 'Coverage 90%', description: 'Aumentar cobertura de testes', files: ['**/*.test.ts'], priority: 'low', status: 'pending', effort: 'lg', createdAt: new Date() },

  // DEVOPS
  { id: 't-devops-1', agentId: 'devops-6', type: 'feature', title: 'Configurar Neon Database', description: 'Migrar para Neon serverless Postgres', files: ['apps/api/.env', 'apps/api/prisma/schema.prisma'], priority: 'high', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-devops-2', agentId: 'devops-2', type: 'improvement', title: 'Build optimization', description: 'Reduzir bundle size em 30%', files: ['apps/web/next.config.js'], priority: 'medium', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-devops-3', agentId: 'devops-5', type: 'feature', title: 'Sentry integration', description: 'Monitoramento de erros em produção', files: ['apps/api/src/index.ts', 'apps/web/src/app/**'], priority: 'high', status: 'pending', effort: 'md', createdAt: new Date() },

  // BACKEND
  { id: 't-api-1', agentId: 'backend-1', type: 'feature', title: 'Paginação API', description: 'Endpoints com cursor-based pagination', files: ['apps/api/src/routes/**'], priority: 'high', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-api-2', agentId: 'backend-8', type: 'improvement', title: 'Validação Zod', description: 'Schemas Zod para todas as rotas', files: ['apps/api/src/schemas/**'], priority: 'medium', status: 'pending', effort: 'md', createdAt: new Date() },
  { id: 't-api-3', agentId: 'backend-10', type: 'feature', title: 'WebSocket notifications', description: 'Notificações real-time via WebSocket', files: ['apps/api/src/websocket/**'], priority: 'medium', status: 'pending', effort: 'lg', createdAt: new Date() },

  // FRONTEND
  { id: 't-web-1', agentId: 'frontend-1', type: 'feature', title: 'Skeleton loading', description: 'Estados de loading com skeletons', files: ['apps/web/src/components/**'], priority: 'medium', status: 'pending', effort: 'sm', createdAt: new Date() },
  { id: 't-web-2', agentId: 'frontend-7', type: 'refactor', title: 'Clean architecture', description: 'Refatorar estrutura de componentes', files: ['apps/web/src/**'], priority: 'medium', status: 'pending', effort: 'xl', createdAt: new Date() },
  { id: 't-web-3', agentId: 'frontend-9', type: 'feature', title: 'E2E tests Cypress', description: 'Testes end-to-end críticos', files: ['tests/e2e/**'], priority: 'medium', status: 'pending', effort: 'lg', createdAt: new Date() },

  // PRODUCT
  { id: 't-prod-1', agentId: 'product-1', type: 'feature', title: 'Analytics dashboard', description: 'Dashboard de métricas de uso', files: ['apps/web/src/app/admin/**'], priority: 'medium', status: 'pending', effort: 'lg', createdAt: new Date() },
  { id: 't-prod-2', agentId: 'product-5', type: 'feature', title: 'Funil de conversão', description: 'Trackear etapas do funil', files: ['apps/api/src/analytics/**'], priority: 'medium', status: 'pending', effort: 'md', createdAt: new Date() },

  // MOBILE
  { id: 't-mob-1', agentId: 'mobile-2', type: 'feature', title: 'Install prompt PWA', description: 'Prompt para instalar app', files: ['apps/web/src/components/**'], priority: 'low', status: 'pending', effort: 'sm', createdAt: new Date() },

  // DATA
  { id: 't-data-1', agentId: 'data-3', type: 'feature', title: 'Relatório semanal', description: 'Email com métricas da semana', files: ['apps/api/src/jobs/reports.ts'], priority: 'low', status: 'pending', effort: 'md', createdAt: new Date() },
]

// ============================================
// MOTOR DE EXECUÇÃO AUTÔNOMA
// ============================================

class AutonomousEngine {
  private intervalId: NodeJS.Timeout | null = null
  private reportIntervalId: NodeJS.Timeout | null = null

  // Iniciar motor
  start() {
    if (state.running) return

    state.running = true
    state.startTime = new Date()

    this.printHeader()
    this.printAgentsOnline()

    console.log(chalk.green('\n✓ Motor autônomo iniciado!'))
    console.log(chalk.gray(`  • ${agentsDatabase.length} agentes online`))
    console.log(chalk.gray(`  • ${taskDatabase.length} tarefas pendentes`))
    console.log(chalk.gray(`  • Autonomia: TOTAL`))
    console.log(chalk.gray(`  • Tick: ${config.tickInterval}ms`))
    console.log('')

    // Iniciar loop principal
    this.intervalId = setInterval(() => this.tick(), config.tickInterval)

    // Relatórios automáticos
    this.reportIntervalId = setInterval(() => this.generateReport(), config.reportInterval)

    // Primeiro tick
    this.tick()
  }

  // Parar motor
  stop() {
    state.running = false
    if (this.intervalId) clearInterval(this.intervalId)
    if (this.reportIntervalId) clearInterval(this.reportIntervalId)

    console.log(chalk.yellow('\n⚠ Motor autônomo parado.'))
    this.printFinalStats()
  }

  // Tick principal - cada agente executa tarefas
  private async tick() {
    state.tick++

    // Limpar tarefas completas
    state.activeTasks = state.activeTasks.filter(t => t.status !== 'completed')

    // Selecionar agentes para este tick
    const activeAgents = agentsDatabase.filter(a => a.active)
    const shuffled = activeAgents.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, config.agentsPerTick)

    // Executar tarefas
    for (const agent of selected) {
      if (state.agentsWorking.size >= config.maxConcurrentTasks) break

      const task = this.assignTask(agent)
      if (task) {
        await this.executeTask(agent, task)
      }
    }

    // Log de progresso a cada 10 ticks
    if (state.tick % 10 === 0) {
      this.printProgress()
    }
  }

  // Atribuir tarefa a um agente
  private assignTask(agent: Agent): Task | null {
    // Tarefas pendentes para este agente
    const agentTasks = taskDatabase.filter(t =>
      t.agentId === agent.id &&
      t.status === 'pending' &&
      !state.activeTasks.find(at => at.id === t.id)
    )

    if (agentTasks.length === 0) return null

    // Priorizar por urgência
    const priorityOrder: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3
    }
    agentTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

    return agentTasks[0]
  }

  // Executar tarefa (simulação - na prática faria alterações reais)
  private async executeTask(agent: Agent, task: Task) {
    state.agentsWorking.set(agent.id, task)
    task.status = 'analyzing'

    // Simular análise
    await this.delay(500)
    task.status = 'in-progress'

    // Simular trabalho
    await this.delay(1000 + Math.random() * 1000)

    // Marcar como completo
    task.status = 'completed'
    task.completedAt = new Date()
    task.changes = this.generateChanges(agent, task)

    // Atualizar stats do agente
    agent.completedTasks++
    agent.lastAction = new Date()

    // Mover para completadas
    state.completedTasks.push(task)
    state.activeTasks.push(task)
    state.agentsWorking.delete(agent.id)
    state.totalChanges += task.changes.length
  }

  // Gerar mudanças baseadas na tarefa
  private generateChanges(agent: Agent, task: Task): string[] {
    const changes: string[] = []

    switch (task.type) {
      case 'feature':
        changes.push(`✨ Nova funcionalidade: ${task.title}`)
        break
      case 'fix':
        changes.push(`🐛 Bug corrigido: ${task.title}`)
        break
      case 'improvement':
        changes.push(`⚡ Melhoria: ${task.title}`)
        break
      case 'optimize':
        changes.push(`🚀 Otimização: ${task.title}`)
        break
      case 'security':
        changes.push(`🔒 Segurança: ${task.title}`)
        break
      case 'refactor':
        changes.push(`🔧 Refatoração: ${task.title}`)
        break
    }

    task.files.forEach(file => {
      changes.push(`📁 ${file}`)
    })

    return changes
  }

  // Imprimir header
  private printHeader() {
    console.clear()
    console.log(`
${chalk.red('╔══════════════════════════════════════════════════════════════════════════╗')}
${chalk.red('║')}  ${chalk.white.bgRed.bold('  🚀 FEIRINHA EXPRESS - MOTOR AUTÔNOMO 🚀  ')}                              ${chalk.red('║')}
${chalk.red('║')}  ${chalk.gray('58 agentes trabalhando 24/7 para melhorar seu projeto')}                  ${chalk.red('║')}
${chalk.red('╚══════════════════════════════════════════════════════════════════════════╝')}
`)
  }

  // Imprimir agentes online
  private printAgentsOnline() {
    const roles = [
      { role: 'Frontend', icon: '👩‍💻', count: 10 },
      { role: 'Backend', icon: '⚙️', count: 10 },
      { role: 'DevOps', icon: '☁️', count: 8 },
      { role: 'Product', icon: '📋', count: 6 },
      { role: 'QA', icon: '🧪', count: 6 },
      { role: 'Data', icon: '📊', count: 4 },
      { role: 'AI/ML', icon: '🤖', count: 4 },
      { role: 'Security', icon: '🔐', count: 4 },
      { role: 'Infra', icon: '🌐', count: 6 },
      { role: 'Mobile', icon: '📱', count: 4 },
    ]

    console.log(chalk.cyan('  EQUIPE DE AGENTES:'))
    console.log(chalk.gray('  ─────────────────────────────────────────────────────'))
    roles.forEach(r => {
      const bar = '█'.repeat(Math.min(r.count, 10)) + '░'.repeat(Math.max(0, 10 - r.count))
      console.log(`  ${r.icon} ${r.role.padEnd(10)} ${chalk.green(bar)} ${r.count}`)
    })
    console.log('')
  }

  // Imprimir progresso
  private printProgress() {
    const total = taskDatabase.length
    const completed = state.completedTasks.length
    const progress = Math.round((completed / total) * 100)

    const filled = Math.round(20 * (progress / 100))
    const bar = '█'.repeat(filled) + '░'.repeat(20 - filled)

    process.stdout.write(`\r${chalk.cyan('  ⚡ Tick')} #${state.tick} | ${chalk.green(bar)} ${progress}% | ${completed}/${total} tarefas | ${state.totalChanges} mudanças`)
  }

  // Gerar relatório
  private generateReport() {
    this.saveReport()
    this.printReport()
  }

  // Salvar relatório em arquivo
  private saveReport() {
    const reportsDir = '.claude/agent-reports'
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true })
    }

    const report = {
      timestamp: new Date().toISOString(),
      tick: state.tick,
      stats: {
        totalTasks: taskDatabase.length,
        completed: state.completedTasks.length,
        inProgress: state.activeTasks.filter(t => t.status === 'in-progress').length,
        totalChanges: state.totalChanges
      },
      topAgents: agentsDatabase
        .filter(a => a.completedTasks > 0)
        .sort((a, b) => b.completedTasks - a.completedTasks)
        .slice(0, 5)
        .map(a => ({ name: a.name, icon: a.icon, tasks: a.completedTasks })),
      recentTasks: state.completedTasks.slice(-10).map(t => ({
        title: t.title,
        type: t.type,
        agent: getAgent(t.agentId)?.name,
        icon: getAgent(t.agentId)?.icon
      }))
    }

    const filename = `report-${Date.now()}.json`
    writeFileSync(join(reportsDir, filename), JSON.stringify(report, null, 2))
  }

  // Imprimir relatório
  private printReport() {
    console.log('\n')
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════════'))
    console.log(chalk.bold.cyan('  📊 RELATÓRIO AUTOMÁTICO'))
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════════'))

    const elapsed = Math.round((Date.now() - state.startTime.getTime()) / 1000)
    console.log(`\n  ⏱ Tempo de execução: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`)
    console.log(`  ⚡ Ticks executados: ${state.tick}`)

    // Progress
    const total = taskDatabase.length
    const completed = state.completedTasks.length
    const progress = Math.round((completed / total) * 100)
    const filled = Math.round(30 * (progress / 100))
    const bar = '█'.repeat(filled) + '░'.repeat(30 - filled)
    console.log(`\n  📈 Progresso: ${chalk.green(bar)} ${progress}%`)
    console.log(`     ${completed}/${total} tarefas concluídas`)

    // Top agentes
    const topAgents = agentsDatabase
      .filter(a => a.completedTasks > 0)
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 5)

    if (topAgents.length > 0) {
      console.log(`\n  🏆 Top Agentes:`)
      topAgents.forEach((agent, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  '
        console.log(`  ${medal} ${agent.icon} ${agent.name}: ${agent.completedTasks} tarefas`)
      })
    }

    // Tarefas recentes
    const recent = state.completedTasks.slice(-5)
    if (recent.length > 0) {
      console.log(`\n  ✅ Últimas tarefas:`)
      recent.forEach(task => {
        const agent = getAgent(task.agentId)
        const icon = task.type === 'feature' ? '✨' : task.type === 'fix' ? '🐛' : '⚡'
        console.log(`  ${icon} ${task.title} (${agent?.icon} ${agent?.name})`)
      })
    }

    // Mudanças
    console.log(`\n  📝 Total de mudanças: ${chalk.green(state.totalChanges)}`)
    console.log('')
  }

  // Estatísticas finais
  private printFinalStats() {
    console.log(chalk.cyan('\n═══════════════════════════════════════════════════════════════'))
    console.log(chalk.bold.cyan('  📋 ESTATÍSTICAS FINAIS'))
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════════'))

    const elapsed = Math.round((Date.now() - state.startTime.getTime()) / 1000)
    console.log(`\n  ⏱ Tempo total: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`)
    console.log(`  ⚡ Total de ticks: ${state.tick}`)
    console.log(`  ✅ Tarefas completadas: ${state.completedTasks.length}`)
    console.log(`  📝 Total de mudanças: ${state.totalChanges}`)

    // Ranking de agentes
    console.log(`\n  🏆 Ranking de Agentes:`)
    agentsDatabase
      .filter(a => a.completedTasks > 0)
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .forEach((agent, i) => {
        console.log(`  ${i + 1}. ${agent.icon} ${agent.name} - ${agent.completedTasks} tarefas`)
      })

    console.log('')
  }

  // Delay utilitário
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Status atual
  getStatus() {
    return {
      running: state.running,
      tick: state.tick,
      agentsActive: agentsDatabase.filter(a => a.active).length,
      tasksPending: taskDatabase.filter(t => t.status === 'pending').length,
      tasksCompleted: state.completedTasks.length,
      totalChanges: state.totalChanges
    }
  }
}

// Exportar singleton
export const autonomousEngine = new AutonomousEngine()

// Função de convenience
export function startAutonomousEngine() {
  autonomousEngine.start()
}

export function stopAutonomousEngine() {
  autonomousEngine.stop()
}