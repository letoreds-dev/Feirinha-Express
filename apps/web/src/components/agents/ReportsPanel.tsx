'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { useReportsStore, type AgentReport, type CodeImprovement } from '@/store/reports'
import { Button } from '@/components/ui'
import clsx from 'clsx'

// Ícones e cores dos agentes
const agentIcons: Record<string, string> = {
  ceo: '👩‍💼',
  tech: '👩‍🔧',
  marketing: '👨‍💻',
  'customer-rel': '👩‍💬',
  'merchant-rel': '👨‍🏪'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600'
}

const categoryIcons = {
  performance: '⚡',
  ux: '🎨',
  security: '🔒',
  code: '💻',
  feature: '✨'
}

// Componente de melhoria individual
function ImprovementItem({ improvement }: { improvement: CodeImprovement }) {
  const { markAsImplemented } = useReportsStore()

  return (
    <div className={clsx(
      'p-3 bg-white rounded-lg border border-brand-line',
      improvement.implemented && 'opacity-60'
    )}>
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{categoryIcons[improvement.category]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-brand-ink text-sm">{improvement.title}</h4>
            <span className={clsx('text-xs px-2 py-0.5 rounded-full', priorityColors[improvement.priority])}>
              {improvement.priority}
            </span>
          </div>
          <p className="text-xs text-brand-muted">{improvement.description}</p>
          {improvement.file && (
            <p className="text-xs text-brand-muted mt-1 font-mono">
              📁 {improvement.file}{improvement.line ? `:${improvement.line}` : ''}
            </p>
          )}
          <p className="text-xs text-brand-muted mt-1 italic">💡 {improvement.reasoning}</p>
        </div>
        {!improvement.implemented && (
          <button
            onClick={() => markAsImplemented(improvement.id)}
            className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors"
          >
            ✓ Implementar
          </button>
        )}
      </div>
    </div>
  )
}

// Componente de relatório de agente
function ReportCard({ report }: { report: AgentReport }) {
  const borderColors: Record<string, string> = {
    ceo: 'border-l-purple-500',
    tech: 'border-l-cyan-500',
    marketing: 'border-l-orange-500',
    'customer-rel': 'border-l-pink-500',
    'merchant-rel': 'border-l-emerald-500'
  }

  return (
    <div className={clsx(
      'bg-white rounded-lg border border-brand-line border-l-4 overflow-hidden',
      borderColors[report.agentId]
    )}>
      {/* Header */}
      <div className="p-3 border-b border-brand-line">
        <div className="flex items-center gap-2">
          <span className="text-xl">{agentIcons[report.agentId]}</span>
          <div>
            <h3 className="font-bold text-brand-ink">{report.agentName}</h3>
            <p className="text-xs text-brand-muted">{report.agentRole}</p>
          </div>
          <span className="ml-auto text-xs text-brand-muted">
            {new Date(report.timestamp).toLocaleTimeString('pt-BR')}
          </span>
        </div>
        <p className="text-sm text-brand-ink mt-2">{report.summary}</p>
      </div>

      {/* Decisões */}
      {report.decisions.length > 0 && (
        <div className="px-3 py-2 border-b border-brand-line bg-gray-50">
          <h4 className="text-xs font-bold text-brand-muted uppercase mb-1">Decisões</h4>
          <ul className="text-sm text-brand-ink space-y-1">
            {report.decisions.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Melhorias */}
      <div className="p-3">
        <h4 className="text-xs font-bold text-brand-muted uppercase mb-2">
          Melhorias Sugeridas ({report.improvements.length})
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {report.improvements.map((imp) => (
            <ImprovementItem key={imp.id} improvement={imp} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Timer para próxima geração
function CountdownTimer() {
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 30))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="font-mono font-bold">
      {seconds}s
    </span>
  )
}

// Painel de Relatórios
export function ReportsPanel() {
  const {
    reports,
    improvements,
    isGenerating,
    lastGeneratedAt,
    generateReports,
    clearReports
  } = useReportsStore()

  const hourRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleGenerate = useCallback(() => {
    generateReports()
  }, [generateReports])

  // Auto-gerar a cada 30 segundos (demo)
  useEffect(() => {
    handleGenerate()

    hourRef.current = setTimeout(function scheduleNext() {
      generateReports()
      hourRef.current = setTimeout(scheduleNext, 30000)
    }, 30000)

    return () => {
      if (hourRef.current) {
        clearTimeout(hourRef.current)
      }
    }
  }, [generateReports])

  const totalImprovements = improvements.length
  const implementedCount = improvements.filter(i => i.implemented).length
  const criticalCount = improvements.filter(i => i.priority === 'critical' && !i.implemented).length

  return (
    <div className="flex flex-col h-full bg-brand-paper">
      {/* Header */}
      <div className="p-4 border-b border-brand-line bg-white">
        <h2 className="font-bold text-brand-ink flex items-center gap-2">
          <span className="text-xl">📋</span>
          Relatórios de Melhoria
        </h2>
        <p className="text-xs text-brand-muted mt-1">
          Agentes analisam o código e sugerem melhorias
        </p>
        {lastGeneratedAt && (
          <p className="text-xs text-brand-muted mt-1">
            Último relatório: {new Date(lastGeneratedAt).toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="p-3 border-b border-brand-line bg-gray-50">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-ink">{totalImprovements}</p>
            <p className="text-xs text-brand-muted">Melhorias</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{implementedCount}</p>
            <p className="text-xs text-brand-muted">Implementadas</p>
          </div>
          <div className="text-center">
            <p className={clsx('text-2xl font-bold', criticalCount > 0 ? 'text-red-600' : 'text-brand-muted')}>
              {criticalCount}
            </p>
            <p className="text-xs text-brand-muted">Críticas</p>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="p-3 border-b border-brand-line flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex-1"
        >
          {isGenerating ? '⏳ Gerando...' : '🔄 Gerar Relatório Agora'}
        </Button>
        <Button variant="ghost" size="sm" onClick={clearReports}>
          🗑️
        </Button>
      </div>

      {/* Próxima geração */}
      <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
        <p className="text-xs text-blue-600 flex items-center gap-2">
          <span>⏰</span>
          Próximo relatório em: <CountdownTimer />
        </p>
      </div>

      {/* Relatórios */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-muted">Nenhum relatório gerado ainda.</p>
            <p className="text-xs text-brand-muted mt-1">Clique em "Gerar Relatório" para começar.</p>
          </div>
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-brand-line bg-white">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <span>📊 {reports.length} relatórios gerados</span>
          <span>{implementedCount}/{totalImprovements} implementadas</span>
        </div>
      </div>
    </div>
  )
}