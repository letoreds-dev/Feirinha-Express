#!/usr/bin/env node

// ============================================
// FEIRINHA EXPRESS - DASHBOARD DE AGENTES
// Visual em tempo real
// ============================================

import chalk from 'chalk'
import { agentsDatabase, getAgent, type Agent, type Task } from './database.js'
import { autonomousEngine, startAutonomousEngine } from './engine-autonomous.js'

// ============================================
// DASHBOARD TERMINAL
// ============================================

class AgentDashboard {
  private running: boolean = false
  private stats = {
    totalAgents: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalChanges: 0,
    uptime: 0
  }

  // Iniciar dashboard
  start() {
    this.running = true
    this.printHeader()
    this.printTeam()
    this.startMonitoring()
  }

  // Parar dashboard
  stop() {
    this.running = false
    console.log(chalk.yellow('\n[!] Dashboard encerrado.'))
  }

  // Imprimir header
  private printHeader() {
    console.clear()
    console.log('\n' + chalk.red('=').repeat(80))
    console.log(chalk.red('||') + '  ' + chalk.white.bgRed.bold('  FEIRINHA EXPRESS - SISTEMA DE AGENTES AUTONOMOS  ') + ' '.repeat(20) + chalk.red('||'))
    console.log(chalk.red('||') + '  58 agentes trabalhando para melhorar seu projeto 24/7' + ' '.repeat(21) + chalk.red('||'))
    console.log(chalk.red('=').repeat(80))
  }

  // Imprimir equipe
  private printTeam() {
    const groups = [
      { name: 'FRONTEND', icon: 'FE', agents: agentsDatabase.filter(a => a.role === 'frontend') },
      { name: 'BACKEND', icon: 'BE', agents: agentsDatabase.filter(a => a.role === 'backend' || a.role === 'database') },
      { name: 'DEVOPS', icon: 'DV', agents: agentsDatabase.filter(a => a.role === 'devops') },
      { name: 'PRODUCT', icon: 'PR', agents: agentsDatabase.filter(a => a.role === 'product') },
      { name: 'QA', icon: 'QA', agents: agentsDatabase.filter(a => a.role === 'qa') },
      { name: 'SECURITY', icon: 'SC', agents: agentsDatabase.filter(a => a.role === 'security') },
      { name: 'AI/ML', icon: 'AI', agents: agentsDatabase.filter(a => a.role === 'ai') },
      { name: 'DATA', icon: 'DT', agents: agentsDatabase.filter(a => a.role === 'data') },
      { name: 'INFRA', icon: 'IN', agents: agentsDatabase.filter(a => a.role === 'infrastructure') },
      { name: 'MOBILE', icon: 'MB', agents: agentsDatabase.filter(a => a.role === 'mobile') },
    ]

    console.log(chalk.cyan('\n  [EQUIPE DE AGENTES]'))
    console.log(chalk.gray('  ' + '-'.repeat(76)) + '\n')

    groups.forEach(group => {
      const agentsList = group.agents.slice(0, 5).map(a =>
        a.name + (a.completedTasks > 0 ? ' (' + a.completedTasks + ')' : '')
      ).join(', ')

      console.log('  [' + group.icon + '] ' + chalk.blue(group.name) + ' - ' + chalk.gray(agentsList) + (group.agents.length > 5 ? ' +' + (group.agents.length - 5) : ''))
    })
  }

  // Atualizar stats
  updateStats(stats: typeof this.stats) {
    this.stats = stats
    this.printStats()
  }

  // Imprimir stats
  private printStats() {
    const status = autonomousEngine.getStatus()

    console.log(chalk.cyan('\n  [STATUS DO SISTEMA]'))
    console.log(chalk.gray('  ' + '-'.repeat(76)) + '\n')
    console.log('  [*] Agentes online: ' + chalk.green(status.agentsActive))
    console.log('  [*] Tarefas pendentes: ' + chalk.yellow(status.tasksPending))
    console.log('  [*] Tarefas concluidas: ' + chalk.green(status.tasksCompleted))
    console.log('  [*] Mudancas feitas: ' + chalk.green(status.totalChanges))
    console.log('  [*] Ticks executados: ' + status.tick)
  }

  // Monitorar agentes
  private startMonitoring() {
    setInterval(() => {
      if (!this.running) return

      const status = autonomousEngine.getStatus()

      // Atualizar stats dos agentes
      const workingAgents = agentsDatabase.filter(a =>
        a.lastAction && (Date.now() - a.lastAction.getTime()) < 30000
      )

      console.log('\n  ' + chalk.gray('-'.repeat(76)))
      console.log('  ' + chalk.cyan('[Atividade recente:]'))

      workingAgents.slice(0, 5).forEach(agent => {
        console.log('  [' + agent.icon + '] ' + chalk.bold(agent.name) + ' esta trabalhando... (' + agent.completedTasks + ' tarefas)')
      })

      if (workingAgents.length === 0) {
        console.log('  ' + chalk.gray('Aguardando tarefas...'))
      }

    }, 10000)
  }
}

// ============================================
// COMANDOS DE VOZ
// ============================================

const commands = '\n' + chalk.cyan('='.repeat(70)) + '\n' +
chalk.bold('  COMANDOS DO MOTOR AUTONOMO\n') +
chalk.cyan('='.repeat(70)) + '\n\n' +
'  ' + chalk.green('start') + '   - Iniciar o motor autonomo\n' +
'  ' + chalk.green('stop') + '    - Parar o motor autonomo\n' +
'  ' + chalk.green('status') + '  - Ver status atual\n' +
'  ' + chalk.green('agents') + '  - Listar todos os agentes\n' +
'  ' + chalk.green('tasks') + '   - Ver tarefas pendentes\n' +
'  ' + chalk.green('team') + '    - Ver equipe completa\n' +
'  ' + chalk.green('help') + '    - Mostrar esta ajuda\n' +
'  ' + chalk.green('exit') + '    - Sair do programa\n\n' +
chalk.cyan('='.repeat(70)) + '\n'

// ============================================
// MAIN
// ============================================

async function main() {
  const dashboard = new AgentDashboard()
  dashboard.start()

  console.log(chalk.yellow('\n  [!] Digite "start" para iniciar o motor autonomo'))
  console.log(chalk.gray('  Ou Ctrl+C para sair\n'))

  // Simular start automatico apos 3 segundos
  setTimeout(() => {
    console.log(chalk.green('\n  [>] Iniciando motor autonomo...\n'))
    startAutonomousEngine()
  }, 3000)
}

main().catch(console.error)

// Exportar para uso no CLI
export { AgentDashboard, commands }