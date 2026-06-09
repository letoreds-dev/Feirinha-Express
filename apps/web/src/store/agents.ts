// Store Zustand para gerenciar estado dos agentes

import { create } from 'zustand'

// Tipos locais para agentes
type AgentType = 'order' | 'delivery' | 'support' | 'payment' | 'inventory' | 'marketing' | 'loyalty' | 'review' | 'recommendation' | 'fraud' | 'analytics' | 'notification' | 'chatbot' | 'scheduler' | 'refund' | 'ceo' | 'tech' | 'customer-rel' | 'merchant-rel'

type AgentStatus = 'idle' | 'active' | 'paused' | 'error'

interface AgentConfig {
  id: string
  type: AgentType
  name: string
  icon: string
  color: string
  status: AgentStatus
  tasks: number
}

interface AgentActivity {
  id: string
  agentId: string
  type: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  timestamp: Date
}

interface AgentLog {
  id: string
  agentId: string
  level: 'info' | 'warning' | 'error'
  message: string
  timestamp: Date
}

interface AgentDecision {
  id: string
  agentId: string
  type: string
  data: any
  timestamp: Date
}

// Tipos para o store
interface AgentsState {
  agents: Map<AgentType, AgentConfig>
  agentStatuses: Partial<Record<AgentType, AgentStatus>>
  activities: AgentActivity[]
  logs: AgentLog[]
  decisions: AgentDecision[]
  selectedAgent: AgentType | null
  isRunning: boolean
  showActivityPanel: boolean
}

// Ações do store
interface AgentsActions {
  // Setup
  initializeAgents: (agents: AgentConfig[]) => void

  // Engine control
  startEngine: () => void
  stopEngine: () => void

  // Agent actions
  updateAgentStatus: (agentId: AgentType, status: AgentStatus) => void
  selectAgent: (agentId: AgentType | null) => void

  // Activities
  addActivity: (activity: AgentActivity) => void
  completeActivity: (activityId: string) => void
  clearActivities: () => void

  // Logs
  addLog: (log: AgentLog) => void
  clearLogs: () => void

  // Decisions
  addDecision: (decision: AgentDecision) => void

  // UI
  toggleActivityPanel: () => void
}

type AgentsStore = AgentsState & AgentsActions

// Estado inicial
const initialState: AgentsState = {
  agents: new Map(),
  agentStatuses: {
    ceo: 'idle',
    marketing: 'idle',
    tech: 'idle',
    'customer-rel': 'idle',
    'merchant-rel': 'idle'
  },
  activities: [],
  logs: [],
  decisions: [],
  selectedAgent: null,
  isRunning: false,
  showActivityPanel: true
}

// Store
export const useAgentsStore = create<AgentsStore>((set, get) => ({
  ...initialState,

  initializeAgents: (agents) => {
    const agentMap = new Map<AgentType, AgentConfig>()
    agents.forEach((agent) => {
      agentMap.set(agent.type, agent)
    })
    set({ agents: agentMap })
  },

  startEngine: () => set({ isRunning: true }),
  stopEngine: () => set({ isRunning: false }),

  updateAgentStatus: (agentId, status) =>
    set((state) => ({
      agentStatuses: { ...state.agentStatuses, [agentId]: status }
    })),

  selectAgent: (agentId) => set({ selectedAgent: agentId }),

  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 50) // Keep last 50
    })),

  completeActivity: (activityId) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === activityId ? { ...a, status: 'completed' as const, completedAt: new Date() } : a
      )
    })),

  clearActivities: () => set({ activities: [] }),

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs].slice(0, 100) // Keep last 100 logs
    })),

  clearLogs: () => set({ logs: [] }),

  addDecision: (decision) =>
    set((state) => ({
      decisions: [decision, ...state.decisions].slice(0, 20)
    })),

  toggleActivityPanel: () => set((state) => ({ showActivityPanel: !state.showActivityPanel }))
}))

// Selectors helpers
export const selectAgentConfig = (agentId: AgentType) => (state: AgentsStore) =>
  state.agents.get(agentId)

export const selectAgentStatus = (agentId: AgentType) => (state: AgentsStore) =>
  state.agentStatuses[agentId]

export const selectAgentLogs = (agentId: AgentType) => (state: AgentsStore) =>
  state.logs.filter((log) => log.agentId === agentId)

export const selectAgentActivities = (agentId: AgentType) => (state: AgentsStore) =>
  state.activities.filter((activity) => activity.agentId === agentId)

export const selectRecentLogs = (limit: number = 20) => (state: AgentsStore) =>
  state.logs.slice(0, limit)

export const selectActiveActivities = () => (state: AgentsStore) =>
  state.activities.filter((a) => a.status === 'in-progress')