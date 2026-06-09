// Engine de Orquestramento dos Agentes
// Gerencia o ciclo de vida e execução dos 5 agentes

import type { AgentCallbacks, EngineConfig, AgentActivity, AgentLog, AgentDecision, AgentType } from './types.js'
import { ceo, ceoConfig } from './agents/ceo.js'
import { marketing, marketingConfig } from './agents/marketing.js'
import { tech, techConfig } from './agents/tech.js'
import { customerRel, customerRelConfig } from './agents/customer-rel.js'
import { merchantRel, merchantRelConfig } from './agents/merchant-rel.js'

// Mapa de todos os agentes
export const allAgents = {
  ceo: { config: ceoConfig, tick: ceo.tick },
  marketing: { config: marketingConfig, tick: marketing.tick },
  tech: { config: techConfig, tick: tech.tick },
  'customer-rel': { config: customerRelConfig, tick: customerRel.tick },
  'merchant-rel': { config: merchantRelConfig, tick: merchantRel.tick }
}

// Agente ativo no momento (representa o que está "trabalhando")
let activeAgent: AgentType | null = null

// Intervalo de tick
let tickInterval: NodeJS.Timeout | null = null

// Callbacks externos
let externalCallbacks: AgentCallbacks | null = null

// Status dos agentes
const agentStatuses: Record<AgentType, 'idle' | 'working' | 'thinking'> = {
  ceo: 'idle',
  marketing: 'idle',
  tech: 'idle',
  'customer-rel': 'idle',
  'merchant-rel': 'idle'
}

// Callbacks internos para tracking
const internalCallbacks: AgentCallbacks = {
  onActivityStart: (activity: AgentActivity) => {
    agentStatuses[activity.agentId as AgentType] = 'working'
    activeAgent = activity.agentId as AgentType
    externalCallbacks?.onActivityStart?.(activity)
  },
  onActivityComplete: (activity: AgentActivity) => {
    agentStatuses[activity.agentId as AgentType] = 'idle'
    if (activeAgent === activity.agentId) activeAgent = null
    externalCallbacks?.onActivityComplete?.(activity)
  },
  onLog: (log: AgentLog) => {
    // Determina status baseado no log
    if (log.message.includes('pensou') || log.message.includes('💭')) {
      agentStatuses[log.agentId as AgentType] = 'thinking'
    } else if (log.message.includes('tarefa') || log.message.includes('🚀')) {
      agentStatuses[log.agentId as AgentType] = 'working'
    }
    externalCallbacks?.onLog?.(log)
  },
  onDecision: (decision: AgentDecision) => {
    externalCallbacks?.onDecision?.(decision)
  }
}

// Executa um tick em todos os agentes
function executeTick(): void {
  // Seleciona um agente aleatório para executar ações principais
  const agentTypes = Object.keys(allAgents) as AgentType[]
  const primaryAgent = agentTypes[Math.floor(Math.random() * agentTypes.length)]

  // Executa tick do agente selecionado
  allAgents[primaryAgent].tick(internalCallbacks)

  // Ocasionalmente executa tick de outros agentes também
  agentTypes.forEach((agentType) => {
    if (agentType !== primaryAgent && Math.random() > 0.7) {
      allAgents[agentType].tick(internalCallbacks)
    }
  })
}

// Inicia o engine
export function startEngine(config: EngineConfig, callbacks?: AgentCallbacks): void {
  externalCallbacks = callbacks || null

  if (config.autoStart) {
    executeTick() // Tick inicial

    tickInterval = setInterval(() => {
      executeTick()
    }, config.tickInterval)
  }
}

// Para o engine
export function stopEngine(): void {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
  activeAgent = null
  Object.keys(agentStatuses).forEach((key) => {
    agentStatuses[key as AgentType] = 'idle'
  })
}

// Pausa/resume
export function pauseEngine(): void {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
}

export function resumeEngine(callbacks?: AgentCallbacks): void {
  externalCallbacks = callbacks || externalCallbacks
  tickInterval = setInterval(executeTick, 1000)
}

// Getters
export function getAgentStatus(agentId: AgentType): typeof agentStatuses[AgentType] {
  return agentStatuses[agentId]
}

export function getActiveAgent(): AgentType | null {
  return activeAgent
}

export function getAllStatuses(): typeof agentStatuses {
  return { ...agentStatuses }
}

export function getAgentConfig(agentId: AgentType) {
  return allAgents[agentId].config
}

// Configuração padrão
export const defaultEngineConfig: EngineConfig = {
  tickInterval: 2000, // 2 segundos
  maxConcurrentActivities: 3,
  autoStart: true
}

export const engine = {
  start: startEngine,
  stop: stopEngine,
  pause: pauseEngine,
  resume: resumeEngine,
  getStatus: getAgentStatus,
  getActive: getActiveAgent,
  getAllStatuses,
  getAgentConfig,
  agents: allAgents,
  defaultConfig: defaultEngineConfig
}