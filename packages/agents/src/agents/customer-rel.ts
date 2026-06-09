// Diretor de Relacionamento com Cliente
// Foca em CX, suporte, feedback, NPS

import type { AgentConfig, AgentActivity, AgentCallbacks } from '../types.js'

export const customerRelConfig: AgentConfig = {
  id: 'customer-rel',
  type: 'customer-rel',
  name: 'Carla',
  title: 'Diretora de CX',
  color: '#EC4899', // Rosa
  avatar: '👩‍💬',
  position: { x: -4, y: 0, z: -2 },
  workstation: 'support-console'
}

// Tarefas de CX
const cxTasks = [
  'Analisando tickets de suporte',
  'Revisando feedbacks negativos',
  'Melhorando fluxo de reembolso',
  'Criando FAQ para dúvidas frequentes',
  'Treinando equipe de suporte',
  'Monitorando NPS semanal',
  'Respondendo reviews do Google',
  'Analisando motivos de cancelamento',
  'Otimizando chatbot de auto-atendimento',
  'Criando tutorial em vídeo'
]

// Insights de clientes
const customerInsights = [
  'Clientes reclamam de prazo de entrega',
  'Tempo de resposta do chat está bom: 2min',
  'NPS subiu de 45 para 52 esta semana',
  'Dúvida mais frequente: status do pedido',
  'Feedback positivo: simplicidade do checkout',
  'Reclamação recorrente: falta de opção PIX',
  'Clientes adoram notifications de progresso',
  'Sugestão: adicionar favoritos aos produtos'
]

// Respostas de suporte
const supportResponses = [
  'Pedido道歉 pela demora e oferecendo cupom',
  'Encaminhando para setor responsável',
  'Reembolso aprovado e processado',
  'Solicitação de feedback enviada',
  'Cliente之国 atualizado no sistema',
  'Contato telefônico realizado'
]

function generateCXActivity(): Partial<AgentActivity> {
  return {
    agentId: 'customer-rel',
    type: Math.random() > 0.6 ? 'supporting' : 'analyzing',
    title: cxTasks[Math.floor(Math.random() * cxTasks.length)],
    description: 'Carla está cuidando da experiência do cliente',
    priority: Math.random() > 0.7 ? 'high' : 'medium',
    status: 'in-progress'
  }
}

// Analisa sentimento
export function cxAnalyzeSentiment(): { sentiment: string; score: number } {
  const sentiments = [
    { sentiment: 'Positivo', score: 85 },
    { sentiment: 'Neutro', score: 52 },
    { sentiment: 'Negativo', score: 28 },
    { sentiment: 'Muito Positivo', score: 94 },
    { sentiment: 'Frustrado', score: 15 }
  ]
  const result = sentiments[Math.floor(Math.random() * sentiments.length)]
  return result
}

// Gera insight de cliente
export function cxGetInsight(): string {
  return customerInsights[Math.floor(Math.random() * customerInsights.length)]
}

// Automatiza resposta
export function cxAutoRespond(): string {
  return supportResponses[Math.floor(Math.random() * supportResponses.length)]
}

export function customerRelTick(callbacks?: AgentCallbacks): void {
  // Insight de cliente
  if (Math.random() > 0.5) {
    callbacks?.onLog?.({
      agentId: 'customer-rel',
      level: 'info',
      message: `💡 Insight: "${cxGetInsight()}"`
    })
  }

  // Análise de sentimento
  if (Math.random() > 0.7) {
    const sentiment = cxAnalyzeSentiment()
    callbacks?.onLog?.({
      agentId: 'customer-rel',
      level: sentiment.score > 70 ? 'success' : sentiment.score < 40 ? 'warning' : 'info',
      message: `💭 Análise: Sentimento ${sentiment.sentiment} (${sentiment.score}%)`
    })
  }

  // Resposta automatizada
  if (Math.random() > 0.6) {
    callbacks?.onLog?.({
      agentId: 'customer-rel',
      level: 'success',
      message: `💬 Auto-resposta: ${cxAutoRespond()}`
    })
  }

  // Nova atividade de CX
  if (Math.random() > 0.45) {
    const activity = generateCXActivity()
    const fullActivity: AgentActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity as Omit<AgentActivity, 'id'>,
      startedAt: new Date()
    } as AgentActivity
    callbacks?.onActivityStart?.(fullActivity)
    callbacks?.onLog?.({
      agentId: 'customer-rel',
      level: 'info',
      message: `🎧 CX: ${fullActivity.title}`
    })
  }
}

export const customerRel = {
  config: customerRelConfig,
  tick: customerRelTick,
  analyzeSentiment: cxAnalyzeSentiment,
  getInsight: cxGetInsight,
  autoRespond: cxAutoRespond
}