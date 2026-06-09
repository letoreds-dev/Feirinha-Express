// CEO - Chief Executive Officer
// Coordena a estratégia geral e delega tarefas aos outros agentes

import type { AgentConfig, AgentActivity, AgentCallbacks } from '../types.js'

export const ceoConfig: AgentConfig = {
  id: 'ceo',
  type: 'ceo',
  name: 'Aurora',
  title: 'CEO',
  color: '#8B5CF6', // Roxo
  avatar: '👩‍💼',
  position: { x: 0, y: 0, z: 0 }, // Centro do escritório
  workstation: 'executive-desk'
}

// Atividades que o CEO executa
const ceoActivities = [
  'Revisando métricas gerais do Feirinha Express',
  'Analisando performance dos diretores',
  'Delegando tarefas para a equipe',
  'Revisando estratégia de crescimento',
  'Aprovando campanhas de marketing',
  'Avaliando feedbacks dos clientes',
  'Tomando decisões estratégicas',
  'Revisando onboarding de lojistas',
  'Otimizando operações gerais',
  'Planejando próxima sprint'
]

// Gera uma atividade aleatória do CEO
function generateCEOActivity(): Partial<AgentActivity> {
  const activity = ceoActivities[Math.floor(Math.random() * ceoActivities.length)]
  return {
    agentId: 'ceo',
    type: Math.random() > 0.7 ? 'delegating' : Math.random() > 0.5 ? 'reporting' : 'planning',
    title: activity,
    description: `Aurora está ${activity.toLowerCase()}. Verificando dashboards e tomando decisões importantes.`,
    priority: Math.random() > 0.8 ? 'high' : 'medium',
    status: 'in-progress'
  }
}

// Simula o pensamento/decisão do CEO
export function ceoThink(): string {
  const thoughts = [
    'Precisamos melhorar a taxa de conversão no checkout',
    'O NPS dos clientes está crescendo, mas ainda há espaço para melhorar',
    'Os lojistas estão demorando muito no onboarding',
    'A campanha de Instagram está trazendo bons resultados',
    'Devemos focar em retenção este trimestre',
    'O tempo médio de separação está acima do ideal',
    'Nova funcionalidade: rastreio em tempo real',
    'Parceria com apps de entrega pode ser interessante'
  ]
  return thoughts[Math.floor(Math.random() * thoughts.length)]
}

// Decisões que o CEO pode tomar
export function ceoDecide(): { decision: string; rationale: string } {
  const decisions = [
    {
      decision: 'Acelerar lançamento do painel de lojistas',
      rationale: 'Feedback positivo nos testesBeta mostra que é prioridade'
    },
    {
      decision: 'Investir mais em marketing digital',
      rationale: 'CAC está baixo e ROAS está acima de 3x'
    },
    {
      decision: 'Melhorar UX do checkout',
      rationale: 'Abandono no carrinho está em 45%'
    },
    {
      decision: 'Criar programa de indicação para lojistas',
      rationale: 'Aquisição orgânica está estagnada'
    },
    {
      decision: 'Implementar suporte 24h',
      rationale: 'Clientes reclamam de tempo de resposta'
    }
  ]
  return decisions[Math.floor(Math.random() * decisions.length)]
}

// Executa tick do CEO
export function ceoTick(callbacks?: AgentCallbacks): void {
  // Log de pensamento
  if (Math.random() > 0.5) {
    callbacks?.onLog?.({
      agentId: 'ceo',
      level: 'info',
      message: `💭 Aurora pensou: "${ceoThink()}"`
    })
  }

  // Ocasionalmente toma uma decisão
  if (Math.random() > 0.85) {
    const decision = ceoDecide()
    callbacks?.onDecision?.({
      id: `decision-${Date.now()}`,
      agentId: 'ceo',
      decision: decision.decision,
      rationale: decision.rationale,
      timestamp: new Date(),
      approved: true
    })
    callbacks?.onLog?.({
      agentId: 'ceo',
      level: 'success',
      message: `📋 Decisão: ${decision.decision}`
    })
  }

  // Inicia nova atividade
  if (Math.random() > 0.6) {
    const activity = generateCEOActivity()
    const fullActivity: AgentActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity as Omit<AgentActivity, 'id'>,
      startedAt: new Date()
    } as AgentActivity
    callbacks?.onActivityStart?.(fullActivity)
    callbacks?.onLog?.({
      agentId: 'ceo',
      level: 'info',
      message: `🚀 Nova tarefa: ${fullActivity.title}`
    })
  }
}

export const ceo = {
  config: ceoConfig,
  tick: ceoTick,
  think: ceoThink,
  decide: ceoDecide
}