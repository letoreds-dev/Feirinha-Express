// Diretor de Marketing
// Foca em growth, campanhas, redes sociais e brand

import type { AgentConfig, AgentActivity, AgentCallbacks } from '../types.js'

export const marketingConfig: AgentConfig = {
  id: 'marketing',
  type: 'marketing',
  name: 'Lucas',
  title: 'Diretor de Marketing',
  color: '#F97316', // Laranja
  avatar: '👨‍💻',
  position: { x: -4, y: 0, z: 2 },
  workstation: 'campaign-wall'
}

// Campanhas de marketing
const marketingCampaigns = [
  'Lançar campanha "Feirinha na Sua Casa"',
  'Otimizar anúncios do Instagram',
  'Criar conteúdo para Stories',
  'Planejar ação de Dia das Mães',
  'Analisar métricas de conversão',
  'Criar influenciador digital',
  'Melhorar copy das landing pages',
  'Testar novos formatos de anúncio',
  'Revisar funil de aquisição',
  'Criar email marketing semanal'
]

// Ideias de conteúdo
const contentIdeas = [
  'Vídeo "Um dia na Feirinha"',
  'Depoimento de lojista TOP',
  'Tutorial de como comprar',
  'Behind the scenes do packing',
  'Comparativo: Feirinha vs Delivery tradicional',
  'Promoção de fim de semana',
  'Sorteio para novos usuários',
  'Série "Conheça seu lojista"'
]

function generateMarketingActivity(): Partial<AgentActivity> {
  const isCampaign = Math.random() > 0.5
  return {
    agentId: 'marketing',
    type: isCampaign ? 'creating' : 'analyzing',
    title: isCampaign
      ? marketingCampaigns[Math.floor(Math.random() * marketingCampaigns.length)]
      : contentIdeas[Math.floor(Math.random() * contentIdeas.length)],
    description: isCampaign
      ? 'Criando e otimizando campanhas de marketing'
      : 'Gerando ideias e conteúdo para redes sociais',
    priority: Math.random() > 0.7 ? 'high' : 'medium',
    status: 'in-progress'
  }
}

// Analisa métricas de marketing
export function marketingAnalyze(): string {
  const analyses = [
    'Taxa de conversão do site está em 3.2%',
    'Melhor horário para posts: 12h e 19h',
    'CPC médio: R$ 0,85',
    'Engajamento no Instagram cresceu 45%',
    'Email marketing tem 23% de open rate',
    'Anúncios do TikTok com ROAS de 4.2x',
    'Retargeting tem CTR de 2.1%',
    'Busca orgânica trouxe 1.2k visitas/semana'
  ]
  return analyses[Math.floor(Math.random() * analyses.length)]
}

// Cria conteúdo
export function marketingCreate(): { type: string; content: string } {
  const content = [
    { type: 'post', content: '🐾 Já conhece a Feirinha Express? Tudo do centro comercial direto na sua casa! #FeirinhaExpress #Delivery' },
    { type: 'story', content: 'Story promotion: 20% OFF primeira compra com código FEIRINHA20' },
    { type: 'reel', content: 'Reel mostrando o processo de separação do pedido' },
    { type: 'email', content: 'Newsletter semanal: Novidades e ofertas exclusivas' }
  ]
  return content[Math.floor(Math.random() * content.length)]
}

export function marketingTick(callbacks?: AgentCallbacks): void {
  // Análise de métricas
  if (Math.random() > 0.6) {
    callbacks?.onLog?.({
      agentId: 'marketing',
      level: 'info',
      message: `📊 Lucas analisou: "${marketingAnalyze()}"`
    })
  }

  // Criar conteúdo
  if (Math.random() > 0.7) {
    const created = marketingCreate()
    callbacks?.onLog?.({
      agentId: 'marketing',
      level: 'success',
      message: `✍️ Conteúdo criado (${created.type}): "${created.content.substring(0, 50)}..."`
    })
  }

  // Nova atividade de campanha
  if (Math.random() > 0.5) {
    const activity = generateMarketingActivity()
    const fullActivity: AgentActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity as Omit<AgentActivity, 'id'>,
      startedAt: new Date()
    } as AgentActivity
    callbacks?.onActivityStart?.(fullActivity)
    callbacks?.onLog?.({
      agentId: 'marketing',
      level: 'info',
      message: `🎯 Campanha: ${fullActivity.title}`
    })
  }
}

export const marketing = {
  config: marketingConfig,
  tick: marketingTick,
  analyze: marketingAnalyze,
  create: marketingCreate
}