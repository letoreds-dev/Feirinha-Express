'use client'

import { useAgentsStore, selectRecentLogs, selectActiveActivities } from '@/store/agents'
import clsx from 'clsx'

// Tipos locais
interface AgentLog {
  id: string
  agentId: string
  level: 'info' | 'warning' | 'error'
  message: string
  timestamp: Date
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

// Ícones para cada agente
const agentIcons: Record<string, string> = {
  ceo: '👩‍💼',
  marketing: '👨‍💻',
  tech: '👩‍🔧',
  'customer-rel': '👩‍💬',
  'merchant-rel': '👨‍🏪'
}

// Cores dos agentes
const agentColors: Record<string, string> = {
  ceo: 'border-l-purple-500',
  marketing: 'border-l-orange-500',
  tech: 'border-l-cyan-500',
  'customer-rel': 'border-l-pink-500',
  'merchant-rel': 'border-l-emerald-500'
}

// Nomes dos agentes
const agentNames: Record<string, string> = {
  ceo: 'Aurora (CEO)',
  marketing: 'Lucas (Marketing)',
  tech: 'Marina (Tech)',
  'customer-rel': 'Carla (CX)',
  'merchant-rel': 'Rafael (Lojistas)'
}

// Componente de log individual
function LogItem({ log }: { log: AgentLog }) {
  const levelColors = {
    info: 'text-brand-ink',
    warning: 'text-amber-600',
    error: 'text-red-600',
    success: 'text-emerald-600'
  }

  return (
    <div className={clsx('flex gap-3 py-2 px-3 border-l-2 bg-white/50', agentColors[log.agentId])}>
      <span className="text-lg flex-shrink-0">{agentIcons[log.agentId]}</span>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm', levelColors[log.level])}>{log.message}</p>
        <p className="text-xs text-brand-muted mt-1">
          {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
        </p>
      </div>
    </div>
  )
}

// Componente de atividade
function ActivityItem({ activity }: { activity: AgentActivity }) {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    critical: 'bg-red-100 text-red-600'
  }

  const statusIcons = {
    pending: '⏳',
    'in-progress': '🔄',
    completed: '✅',
    failed: '❌'
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg border border-brand-line">
      <span className="text-lg flex-shrink-0">{agentIcons[activity.agentId]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-ink truncate">{activity.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={clsx('text-xs px-2 py-0.5 rounded-full', priorityColors[activity.priority])}>
            {activity.priority}
          </span>
          <span className="text-xs text-brand-muted">{statusIcons[activity.status]}</span>
        </div>
      </div>
    </div>
  )
}

// Painel lateral de logs
export function ActivityPanel() {
  const logs = useAgentsStore(selectRecentLogs(30))
  const activities = useAgentsStore(selectActiveActivities())
  const selectedAgent = useAgentsStore((s) => s.selectedAgent)

  const filteredLogs = selectedAgent
    ? logs.filter((l) => l.agentId === selectedAgent)
    : logs

  return (
    <div className="flex flex-col h-full bg-brand-paper/95 backdrop-blur-sm border-l border-brand-line">
      {/* Header */}
      <div className="p-4 border-b border-brand-line bg-white">
        <h2 className="font-bold text-brand-ink flex items-center gap-2">
          <span className="text-xl">📊</span>
          Atividades em Tempo Real
        </h2>
        <p className="text-xs text-brand-muted mt-1">
          {activities.length} tarefas ativas • {logs.length} eventos
        </p>
      </div>

      {/* Status dos Agentes */}
      <div className="p-3 border-b border-brand-line">
        <h3 className="text-xs font-bold text-brand-muted uppercase mb-2">Equipe</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(agentNames).map(([id, name]) => (
            <span
              key={id}
              className={clsx(
                'text-xs px-2 py-1 rounded-full',
                selectedAgent === id
                  ? 'bg-brand-red text-white'
                  : 'bg-white border border-brand-line text-brand-ink'
              )}
            >
              {agentIcons[id]} {name.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Tarefas Ativas */}
      {activities.length > 0 && (
        <div className="p-3 border-b border-brand-line">
          <h3 className="text-xs font-bold text-brand-muted uppercase mb-2">
            Tarefas em Andamento
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {activities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-xs font-bold text-brand-muted uppercase mb-2 sticky top-0 bg-brand-paper py-1">
          {selectedAgent ? `Logs de ${agentNames[selectedAgent]}` : 'Todos os Logs'}
        </h3>
        <div className="space-y-1">
          {filteredLogs.map((log) => (
            <LogItem key={`${log.id}-${log.timestamp}`} log={log} />
          ))}
        </div>
      </div>

      {/* Footer com controls */}
      <div className="p-3 border-t border-brand-line bg-white">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <span>🔴 Ao vivo</span>
          <span>{filteredLogs.length} eventos</span>
        </div>
      </div>
    </div>
  )
}

// Card do agente para seleção
export function AgentCard({
  agentId,
  name,
  title,
  icon,
  color,
  isSelected,
  onClick
}: {
  agentId: string
  name: string
  title: string
  icon: string
  color: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full p-3 rounded-xl border-2 transition-all text-left',
        isSelected
          ? 'border-brand-red bg-brand-soft'
          : 'border-brand-line bg-white hover:border-brand-red/50'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
        >
          {icon}
        </div>
        <div>
          <p className="font-bold text-brand-ink">{name}</p>
          <p className="text-xs text-brand-muted">{title}</p>
        </div>
      </div>
    </button>
  )
}