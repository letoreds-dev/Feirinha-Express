// Diretor de Relacionamento com Lojista
// Foca em onboarding, activation, retention de lojistas

import type { AgentConfig, AgentActivity, AgentCallbacks } from '../types.js'

export const merchantRelConfig: AgentConfig = {
  id: 'merchant-rel',
  type: 'merchant-rel',
  name: 'Rafael',
  title: 'Diretor de Lojistas',
  color: '#10B981', // Verde
  avatar: '👨‍💼',
  position: { x: 4, y: 0, z: -2 },
  workstation: 'merchant-dashboard'
}

// Tarefas de lojista
const merchantTasks = [
  'Acompanhando onboarding de novo lojista',
  'Criando tutorial de cadastro de produtos',
  'Analisando taxa de ativação',
  'Melhorando checklist de ativação',
  'Respondendo dúvidas de lojistas',
  'Revisando métricas de venda',
  'Criando material de treinamento',
  'Otimizando processo de aprovação',
  'Analisando churn de lojistas',
  'Planejando evento para lojistas'
]

// Dicas para lojistas
const merchantTips = [
  'Use fotos de qualidade para seus produtos',
  'Mantenha seu catálogo atualizado',
  'Responda pedidos em até 30 minutos',
  'Ofereça promoções para novos clientes',
  'Complete seu perfil com logo e descrição',
  'Use o painel de métricas diariamente',
  'Adicionevariantes aos produtos',
  'Configure notificações de novos pedidos'
]

// Métricas de lojistas
const merchantMetrics = [
  'Taxa de conversão: 4.2%',
  'Ticket médio: R$ 87,50',
  'Tempo médio de separação: 28min',
  'Avaliação média: 4.6 estrelas',
  'Pedidos este mês: 234',
  'Faturamento estimado: R$ 20.490',
  'Clientes únicos: 156',
  'Taxa de recompra: 35%'
]

function generateMerchantActivity(): Partial<AgentActivity> {
  return {
    agentId: 'merchant-rel',
    type: Math.random() > 0.5 ? 'analyzing' : 'creating',
    title: merchantTasks[Math.floor(Math.random() * merchantTasks.length)],
    description: 'Rafael está cuidando do relacionamento com lojistas',
    priority: Math.random() > 0.7 ? 'high' : 'medium',
    status: 'in-progress'
  }
}

// Analisa métricas
export function merchantAnalyze(): string {
  return merchantMetrics[Math.floor(Math.random() * merchantMetrics.length)]
}

// Gera dica
export function merchantTip(): string {
  return merchantTips[Math.floor(Math.random() * merchantTips.length)]
}

// Segue up com lojista
export function merchantFollowUp(): { lojista: string; action: string } {
  const lojistas = [
    'Box 04 - Essenza Perfumes',
    'Galpão 02 - Casa Forte',
    'Box 12 - Urban Fit',
    'Box 21 - Mobile Prime',
    'Box 08 - Útil & Fácil'
  ]
  const actions = [
    'Enviado email de boas-vindas',
    'Ligação realizada para tirar dúvidas',
    'Convite para webinar de treinamento',
    'Cupom de desconto enviado',
    'Feedback solicitado sobre plataforma',
    'NPS survey enviado'
  ]
  return {
    lojista: lojistas[Math.floor(Math.random() * lojistas.length)],
    action: actions[Math.floor(Math.random() * actions.length)]
  }
}

export function merchantRelTick(callbacks?: AgentCallbacks): void {
  // Métricas
  if (Math.random() > 0.5) {
    callbacks?.onLog?.({
      agentId: 'merchant-rel',
      level: 'info',
      message: `📈 Métrica: ${merchantAnalyze()}`
    })
  }

  // Dica
  if (Math.random() > 0.65) {
    callbacks?.onLog?.({
      agentId: 'merchant-rel',
      level: 'success',
      message: `💡 Dica para lojistas: ${merchantTip()}`
    })
  }

  // Follow-up
  if (Math.random() > 0.7) {
    const followup = merchantFollowUp()
    callbacks?.onLog?.({
      agentId: 'merchant-rel',
      level: 'info',
      message: `📞 Follow-up: [${followup.lojista}] ${followup.action}`
    })
  }

  // Nova atividade
  if (Math.random() > 0.45) {
    const activity = generateMerchantActivity()
    const fullActivity: AgentActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity as Omit<AgentActivity, 'id'>,
      startedAt: new Date()
    } as AgentActivity
    callbacks?.onActivityStart?.(fullActivity)
    callbacks?.onLog?.({
      agentId: 'merchant-rel',
      level: 'info',
      message: `🏪 Lojista: ${fullActivity.title}`
    })
  }
}

export const merchantRel = {
  config: merchantRelConfig,
  tick: merchantRelTick,
  analyze: merchantAnalyze,
  tip: merchantTip,
  followUp: merchantFollowUp
}