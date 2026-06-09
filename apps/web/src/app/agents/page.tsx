'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

const agents = [
  { id: 'order', name: 'Agente de Pedidos', icon: '📦', color: 'from-blue-500 to-blue-600', tasks: 12 },
  { id: 'delivery', name: 'Agente de Entregas', icon: '🛵', color: 'from-green-500 to-green-600', tasks: 8 },
  { id: 'support', name: 'Agente de Suporte', icon: '💬', color: 'from-purple-500 to-purple-600', tasks: 5 },
  { id: 'payment', name: 'Agente de Pagamentos', icon: '💳', color: 'from-yellow-500 to-yellow-600', tasks: 3 },
  { id: 'inventory', name: 'Agente de Estoque', icon: '📋', color: 'from-red-500 to-red-600', tasks: 7 },
  { id: 'marketing', name: 'Agente de Marketing', icon: '📢', color: 'from-pink-500 to-pink-600', tasks: 4 },
  { id: 'loyalty', name: 'Agente de Fidelidade', icon: '⭐', color: 'from-amber-500 to-amber-600', tasks: 6 },
  { id: 'review', name: 'Agente de Avaliações', icon: '⭐', color: 'from-orange-500 to-orange-600', tasks: 2 },
  { id: 'recommendation', name: 'Agente de Recomendações', icon: '🤖', color: 'from-cyan-500 to-cyan-600', tasks: 9 },
  { id: 'fraud', name: 'Agente Anti-Fraude', icon: '🛡️', color: 'from-gray-600 to-gray-700', tasks: 1 },
  { id: 'analytics', name: 'Agente de Analytics', icon: '📊', color: 'from-indigo-500 to-indigo-600', tasks: 11 },
  { id: 'notification', name: 'Agente de Notificações', icon: '🔔', color: 'from-teal-500 to-teal-600', tasks: 15 },
  { id: 'chatbot', name: 'Chatbot IA', icon: '🤖', color: 'from-violet-500 to-violet-600', tasks: 20 },
  { id: 'scheduler', name: 'Agente de Agendamentos', icon: '📅', color: 'from-lime-500 to-lime-600', tasks: 4 },
  { id: 'refund', name: 'Agente de Reembolso', icon: '↩️', color: 'from-rose-500 to-rose-600', tasks: 2 },
]

const generateLog = () => {
  const logs = ['processando...', 'notificando...', 'validando...', 'analisando...', 'monitorando...']
  return logs[Math.floor(Math.random() * logs.length)]
}

export default function CommandCenter() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [logs, setLogs] = useState<Record<string, string>>({})
  const [is3D, setIs3D] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
      const randomAgent = agents[Math.floor(Math.random() * agents.length)]
      setLogs(prev => ({ ...prev, [randomAgent.id]: generateLog() }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const totalTasks = agents.reduce((sum, a) => sum + a.tasks, 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-6">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center text-2xl">🎛️</div>
            <div>
              <h1 className="text-xl font-bold">Centro de Comando</h1>
              <p className="text-sm text-white/60">Feirinha Express AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIs3D(!is3D)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${is3D ? 'bg-brand-red text-white' : 'bg-white/10 text-white'}`}>
              {is3D ? '🖥️ 2D' : '🎮 3D'}
            </button>
            <div className="text-right">
              <p className="text-xs text-white/60">Sistema</p>
              <p className="text-sm font-mono">{time.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-green-500/20 rounded-xl p-3 border border-green-500/30">
            <p className="text-2xl font-bold">{agents.length}</p>
            <p className="text-xs text-white/60">Agentes Ativos</p>
          </div>
          <div className="bg-blue-500/20 rounded-xl p-3 border border-blue-500/30">
            <p className="text-2xl font-bold">{totalTasks}</p>
            <p className="text-xs text-white/60">Tarefas</p>
          </div>
          <div className="bg-purple-500/20 rounded-xl p-3 border border-purple-500/30">
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-xs text-white/60">Uptime</p>
          </div>
          <div className="bg-yellow-500/20 rounded-xl p-3 border border-yellow-500/30">
            <p className="text-2xl font-bold">142</p>
            <p className="text-xs text-white/60">Req/min</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Agentes Autônomos em Tempo Real
        </h2>

        <div className={`grid gap-4 ${is3D ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'}`}>
          {agents.map(agent => (
            <div key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={`relative group cursor-pointer transition-all duration-300 ${is3D ? 'transform hover:scale-105' : ''}`}>
              <Card padding="md" className={`bg-gradient-to-br ${agent.color} border-0 h-full ${is3D ? 'shadow-2xl shadow-black/50' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{agent.icon}</span>
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                </div>
                <p className="font-bold text-sm mb-1">{agent.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/80">{agent.tasks} tarefas</span>
                  <span className="text-xs text-white/60">● Ativo</span>
                </div>
                {logs[agent.id] && (
                  <div className="mt-2 p-2 bg-black/20 rounded-lg">
                    <p className="text-xs text-white/80 truncate">{logs[agent.id]}</p>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Atividade em Tempo Real
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[
            { agent: '📦', msg: 'Pedido #1234 processado em 0.3s', time: '2s' },
            { agent: '💳', msg: 'PIX de R$45.90 confirmado', time: '5s' },
            { agent: '🤖', msg: 'Recomendação enviada para Maria S.', time: '8s' },
            { agent: '🛡️', msg: 'Verificação de fraude negativa', time: '12s' },
            { agent: '🔔', msg: 'Notificação push enviada', time: '15s' },
            { agent: '📊', msg: 'Dashboard atualizado', time: '18s' },
            { agent: '💬', msg: 'Chat auto-respondido em 2s', time: '22s' },
            { agent: '📋', msg: 'Estoque: Whopper -5 unidades', time: '25s' },
          ].map((log, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg text-sm">
              <span className="text-lg">{log.agent}</span>
              <span className="flex-1 text-white/80">{log.msg}</span>
              <span className="text-xs text-white/40">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedAgent && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAgent(null)}>
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            {(() => {
              const agent = agents.find(a => a.id === selectedAgent)!
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl`}>{agent.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg">{agent.name}</h3>
                        <p className="text-sm text-green-400">● Operacional</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedAgent(null)} className="text-white/60 hover:text-white text-xl">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-lg p-3"><p className="text-2xl font-bold">{agent.tasks}</p><p className="text-xs text-white/60">Tarefas hoje</p></div>
                    <div className="bg-white/10 rounded-lg p-3"><p className="text-2xl font-bold">0.3s</p><p className="text-xs text-white/60">Tempo médio</p></div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 mt-4">
                    <p className="text-xs text-white/60 mb-2">Última atividade</p>
                    <p className="text-sm">{logs[agent.id] || 'Aguardando...'}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">Pausar</button>
                    <button className="flex-1 py-2 bg-brand-red rounded-lg text-sm hover:bg-brand-red-dark">Ver Logs</button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </main>
  )
}