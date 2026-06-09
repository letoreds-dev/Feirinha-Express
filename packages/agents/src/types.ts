// Tipos base para o sistema de agentes

export type AgentType = 'ceo' | 'marketing' | 'tech' | 'customer-rel' | 'merchant-rel'

export type AgentStatus = 'idle' | 'working' | 'thinking' | 'meeting' | 'waiting'

export type ActivityPriority = 'low' | 'medium' | 'high' | 'critical'

export interface AgentConfig {
  id: string
  type: AgentType
  name: string
  title: string
  color: string
  avatar: string
  position: { x: number; y: number; z: number }
  workstation: WorkstationType
}

export type WorkstationType =
  | 'executive-desk'
  | 'campaign-wall'
  | 'dev-station'
  | 'support-console'
  | 'merchant-dashboard'

export interface AgentActivity {
  id: string
  agentId: string
  type: ActivityType
  title: string
  description: string
  priority: ActivityPriority
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  metadata?: Record<string, unknown>
}

export type ActivityType =
  | 'coding'
  | 'reviewing'
  | 'planning'
  | 'meeting'
  | 'analyzing'
  | 'creating'
  | 'optimizing'
  | 'supporting'
  | 'delegating'
  | 'reporting'

export interface AgentLog {
  id: string
  agentId: string
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  details?: string
}

export interface AgentDecision {
  id: string
  agentId: string
  decision: string
  rationale: string
  timestamp: Date
  approved: boolean
}

export interface AgentMetrics {
  agentId: string
  tasksCompleted: number
  tasksPending: number
  averageTaskTime: number // em minutos
  lastActivity: Date
  efficiency: number // 0-100
}

// Estado global do store
export interface AgentsState {
  agents: Map<AgentType, AgentConfig>
  activities: AgentActivity[]
  logs: AgentLog[]
  selectedAgent: AgentType | null
  isRunning: boolean

  // Ações
  startAgents: () => void
  stopAgents: () => void
  selectAgent: (agentId: AgentType | null) => void
  addActivity: (activity: Omit<AgentActivity, 'id' | 'startedAt'>) => void
  updateActivity: (id: string, updates: Partial<AgentActivity>) => void
  addLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void
  getAgentActivities: (agentId: string) => AgentActivity[]
  getAgentLogs: (agentId: string, limit?: number) => AgentLog[]
}

// Callbacks para o engine
export interface AgentCallbacks {
  onActivityStart?: (activity: AgentActivity) => void
  onActivityComplete?: (activity: AgentActivity) => void
  onLog?: (log: AgentLog) => void
  onDecision?: (decision: AgentDecision) => void
}

// Configuração do engine
export interface EngineConfig {
  tickInterval: number // ms entre cada tick
  maxConcurrentActivities: number
  autoStart: boolean
}