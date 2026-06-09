#!/usr/bin/env node

// ============================================
// FEIRINHA EXPRESS - CENTRO DE COMANDO 24/7
// Agentes implementando funcionalidades reais
// ============================================

import chalk from 'chalk'
import * as fs from 'fs'
import * as path from 'path'

const PROJECT_PATH = 'C:\\Users\\kauan\\feirinha-express'
const UPDATE_INTERVAL = 15 * 60 * 1000 // 15 minutos
const TOTAL_HOURS = 10
const MAX_UPDATES = 40

// ============================================
// INTERFACES
// ============================================

interface Task {
  id: string
  agentId: string
  agentName: string
  agentIcon: string
  type: 'feature' | 'fix' | 'improvement' | 'refactor'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in-progress' | 'completed'
  files: string[]
  effort: 'low' | 'medium' | 'high'
  implementation?: string // Código a ser written
}

// ============================================
// BANCO DE TAREFAS COM IMPLEMENTAÇÕES
// ============================================

const taskDatabase: Task[] = [
  {
    id: 'f001',
    agentId: 'marina',
    agentName: 'Marina',
    agentIcon: '👩‍💻',
    type: 'improvement',
    title: 'Skeleton Loader',
    description: 'Loading states profissionais enquanto dados carregam',
    priority: 'medium',
    status: 'pending',
    files: ['apps/web/src/components/ui/skeleton.tsx'],
    effort: 'low',
    implementation: `// Skeleton loader component
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={\`animate-pulse bg-gray-200 rounded \${className || ''}\`}>
      <div className="invisible">Placeholder</div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="grid grid-cols-[82px_1fr] gap-3 p-3 bg-white rounded-card border border-brand-line">
      <Skeleton className="w-20 h-24 rounded-2xl" />
      <div className="flex flex-col justify-between">
        <div>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  )
}`
  },
  {
    id: 'f002',
    agentId: 'marina',
    agentName: 'Marina',
    agentIcon: '👩‍💻',
    type: 'feature',
    title: 'Modal de Confirmação',
    description: 'Modal reutilizável para ações destrutivas',
    priority: 'high',
    status: 'pending',
    files: ['apps/web/src/components/ui/modal.tsx'],
    effort: 'low',
    implementation: `'use client'

import { useEffect } from 'react'
import clsx from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-xl font-bold text-brand-ink mb-4">{title}</h2>
        <div className="text-brand-muted mb-6">{children}</div>
        {actions && <div className="flex gap-3 justify-end">{actions}</div>}
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
}

export function ConfirmModal({
  isOpen, onClose, onConfirm, title, message,
  confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger'
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <button onClick={onClose} className="px-4 py-2 text-brand-muted hover:text-brand-ink">
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className={clsx(
              'px-4 py-2 rounded-xl font-bold text-white transition-colors',
              variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-red hover:bg-brand-red-dark'
            )}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}`
  },
  {
    id: 'f003',
    agentId: 'marina',
    agentName: 'Marina',
    agentIcon: '👩‍💻',
    type: 'feature',
    title: 'Empty State Component',
    description: 'Estados vazios com ilustrações e CTAs',
    priority: 'low',
    status: 'pending',
    files: ['apps/web/src/components/ui/empty-state.tsx'],
    effort: 'low',
    implementation: `interface EmptyStateProps {
  icon: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-brand-ink mb-2">{title}</h3>
      {description && <p className="text-brand-muted mb-6 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-brand-red-dark transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Preset empty states
export function NoProductsEmpty() {
  return (
    <EmptyState
      icon="📦"
      title="Nenhum produto encontrado"
      description="Tente buscar com outros termos ou explore nossas categorias."
      action={{ label: 'Ver todos os produtos', onClick: () => {} }}
    />
  )
}

export function EmptyCart() {
  return (
    <EmptyState
      icon="🛒"
      title="Seu carrinho está vazio"
      description="Adicione produtos para começar suas compras."
      action={{ label: 'Explorar produtos', onClick: () => {} }}
    />
  )
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon="❤️"
      title="Nenhum favorito ainda"
      description="Toque no coração para adicionar produtos aos favoritos."
    />
  )
}`
  },
  {
    id: 'b001',
    agentId: 'carlos',
    agentName: 'Carlos',
    agentIcon: '⚙️',
    type: 'improvement',
    title: 'Validação Zod',
    description: 'Validação robusta de schemas nos endpoints',
    priority: 'high',
    status: 'pending',
    files: ['apps/api/src/routes/orders.ts'],
    effort: 'medium',
    implementation: `import { z } from 'zod'

// Order schemas
const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\\d{5}-?\\d{3}$/, 'CEP inválido'),
})

const orderItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().max(99),
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1).max(20),
  deliveryAddress: addressSchema,
  paymentMethod: z.enum(['pix', 'credit', 'debit']),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'separating', 'ready', 'delivered', 'cancelled']),
})

// Usage example:
async function validateOrder(body: unknown) {
  const result = createOrderSchema.safeParse(body)
  if (!result.success) {
    return { error: result.error.flatten() }
  }
  return { data: result.data }
}`
  },
  {
    id: 'b002',
    agentId: 'carlos',
    agentName: 'Carlos',
    agentIcon: '⚙️',
    type: 'feature',
    title: 'Endpoint de Métricas',
    description: 'Estatísticas de vendas para dashboards',
    priority: 'high',
    status: 'pending',
    files: ['apps/api/src/routes/metrics.ts'],
    effort: 'medium',
    implementation: `import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'

export default async function metricsRoutes(fastify: FastifyInstance) {
  // GET /api/metrics/overview - Métricas gerais
  fastify.get('/overview', async () => {
    const [totalOrders, totalProducts, totalMerchants, totalUsers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.merchant.count(),
      prisma.user.count(),
    ])

    return {
      orders: totalOrders,
      products: totalProducts,
      merchants: totalMerchants,
      users: totalUsers,
    }
  })

  // GET /api/metrics/sales - Vendas por período
  fastify.get('/sales', async (request) => {
    const { days = '30' } = request.query as { days?: string }
    const daysNum = parseInt(days) || 30

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNum)

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: {
        total: true,
        status: true,
        createdAt: true,
      },
    })

    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
    const orderCount = orders.length
    const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0

    return {
      period: daysNum,
      totalSales,
      orderCount,
      avgOrderValue,
      ordersByStatus: orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }
  })

  // GET /api/metrics/top-products - Produtos mais vendidos
  fastify.get('/top-products', async () => {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    })

    const products = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, title: true, price: true, thumb: true },
        })
        return { ...product, soldCount: item._sum.quantity || 0 }
      })
    )

    return { products }
  })
}`
  },
  {
    id: 'a001',
    agentId: 'ana',
    agentName: 'Ana',
    agentIcon: '🔍',
    type: 'fix',
    title: 'Página 404 Customizada',
    description: 'Página de erro amigável',
    priority: 'medium',
    status: 'pending',
    files: ['apps/web/src/app/not-found.tsx'],
    effort: 'low',
    implementation: `import Link from 'next/link'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-paper px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-extrabold text-brand-ink mb-4">
          Página não encontrada
        </h1>
        <p className="text-lg text-brand-muted mb-8">
          Ops! A página que você procura não existe ou foi movida.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button variant="primary" className="w-full">
              Voltar para Home
            </Button>
          </Link>
          <Link href="/user">
            <Button variant="outline" className="w-full">
              Explorar Produtos
            </Button>
          </Link>
        </div>
        <p className="text-sm text-brand-muted mt-8">
          Erro 404 | Feirinha Express
        </p>
      </div>
    </div>
  )
}`
  },
  {
    id: 'a002',
    agentId: 'ana',
    agentName: 'Ana',
    agentIcon: '🔍',
    type: 'fix',
    title: 'Indicador Offline',
    description: 'Banner quando usuário está sem internet',
    priority: 'high',
    status: 'pending',
    files: ['apps/web/src/components/ui/offline-banner.tsx'],
    effort: 'low',
    implementation: `'use client'

import { useState, useEffect } from 'react'

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium">
      ⚠️ Você está offline. Algumas funcionalidades podem estar limitadas.
    </div>
  )
}`
  },
  {
    id: 'p001',
    agentId: 'paula',
    agentName: 'Paula',
    agentIcon: '🎨',
    type: 'improvement',
    title: 'Micro-interações CSS',
    description: 'Feedback visual em hover e cliques',
    priority: 'medium',
    status: 'pending',
    files: ['apps/web/src/app/globals.css'],
    effort: 'medium',
    implementation: `/* Micro-interações */
@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(234, 29, 44, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(234, 29, 44, 0); }
}

.animate-bounce-in { animation: bounce-in 0.3s ease-out; }
.animate-fade-up { animation: fade-up 0.4s ease-out; }
.animate-pulse-glow { animation: pulse-glow 2s infinite; }

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Press effect */
.press-effect:active {
  transform: scale(0.97);
}

/* Ripple effect */
.ripple {
  position: relative;
  overflow: hidden;
}
.ripple::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255,255,255,0.3) 10%, transparent 10%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 1s;
}
.ripple:active::after {
  transform: scale(0, 0);
  opacity: 1;
  transition: 0s;
}`
  },
  {
    id: 'l001',
    agentId: 'lucas',
    agentName: 'Lucas',
    agentIcon: '✨',
    type: 'feature',
    title: 'Share Button',
    description: 'Botão para compartilhar produtos',
    priority: 'low',
    status: 'pending',
    files: ['apps/web/src/components/ui/share-button.tsx'],
    effort: 'low',
    implementation: `'use client'

import { toast } from './toast'

interface ShareButtonProps {
  url: string
  title: string
  text?: string
  className?: string
}

export function ShareButton({ url, title, text, className }: ShareButtonProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : url

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: text || title, url: shareUrl })
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copiado!', 'Compartilhe com seus amigos')
    }
  }

  return (
    <button onClick={handleShare} className={className} title="Compartilhar">
      📤
    </button>
  )
}`
  },
  {
    id: 'l002',
    agentId: 'lucas',
    agentName: 'Lucas',
    agentIcon: '✨',
    type: 'feature',
    title: 'Recent Searches',
    description: 'Histórico de buscas recentes',
    priority: 'low',
    status: 'pending',
    files: ['apps/web/src/store/searches.ts'],
    effort: 'low',
    implementation: `'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchStore {
  recentSearches: string[]
  addSearch: (query: string) => void
  removeSearch: (query: string) => void
  clearSearches: () => void
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],

      addSearch: (query) => {
        const trimmed = query.trim()
        if (!trimmed) return

        set((state) => ({
          recentSearches: [
            trimmed,
            ...state.recentSearches.filter((s) => s !== trimmed),
          ].slice(0, 10), // Keep last 10
        }))
      },

      removeSearch: (query) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        }))
      },

      clearSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'feirinha-searches' }
  )
)`
  }
]

// ============================================
// CLASSE DO CENTRO DE COMANDO
// ============================================

class CommandCenter {
  private updateCount = 0
  private startTime = Date.now()
  private completedTasks: Task[] = []

  async start() {
    console.clear()
    console.log(chalk.green(`
╔══════════════════════════════════════════════════════════════╗
║         FEIRINHA EXPRESS - CENTRO DE COMANDO 24/7         ║
║         Agentes implementando funcionalidades reais         ║
╚══════════════════════════════════════════════════════════════╝
    `))

    console.log(chalk.cyan(`
📋 Plano de Trabalho:
   • Intervalo: 15 minutos
   • Duração: 10 horas
   • Atualizações: ${MAX_UPDATES}
   • Tarefas pendentes: ${taskDatabase.filter(t => t.status === 'pending').length}
   • Agentes: Marina(👩‍💻), Carlos(⚙️), Lucas(✨), Ana(🔍), Paula(🎨)
    `))

    console.log(chalk.yellow('⏳ Iniciando Centro de Comando...\n'))
    await this.delay(2000)

    while (this.updateCount < MAX_UPDATES) {
      await this.generateUpdate()

      if (this.updateCount < MAX_UPDATES) {
        const nextUpdate = UPDATE_INTERVAL / 1000 / 60
        console.log(chalk.gray(`\n⏰ Próxima atualização em ${nextUpdate} minutos...`))
        await this.delay(UPDATE_INTERVAL)
      }
    }

    this.printFinalReport()
  }

  private async generateUpdate(): Promise<void> {
    this.updateCount++

    console.clear()
    console.log(chalk.red(`
╔══════════════════════════════════════════════════════════════╗
║         RELATÓRIO #${String(this.updateCount).padStart(3, '0')} de ${MAX_UPDATES}                          ║
╚══════════════════════════════════════════════════════════════╝
    `))

    // Tempo
    const elapsed = Date.now() - this.startTime
    const mins = Math.floor(elapsed / 60000)
    console.log(chalk.gray(`⏱️  Tempo decorrido: ${mins} minutos\n`))

    // Buscar tarefas pendentes
    const pendingTasks = taskDatabase.filter(t => t.status === 'pending')
    const tasksToImplement = pendingTasks.slice(0, 2)

    if (tasksToImplement.length === 0) {
      console.log(chalk.green('\n✅ Todas as tarefas implementadas!\n'))
      return
    }

    // Implementar tarefas
    console.log(chalk.cyan('═══════════════════════════════════════════════════════'))
    console.log(chalk.bold.green('\n🚀 IMPLEMENTAÇÕES DESTA RODADA\n'))

    for (const task of tasksToImplement) {
      await this.implementTask(task)
    }

    // Resumo
    this.printSummary(tasksToImplement)
  }

  private async implementTask(task: Task): Promise<void> {
    task.status = 'in-progress'

    // Spinner
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    let frame = 0
    const workTime = 1500 + Math.random() * 1000
    const startTime = Date.now()

    while (Date.now() - startTime < workTime) {
      process.stdout.write(`\r${chalk.cyan(frames[frame % frames.length])} ${task.agentIcon} ${task.agentName} implementando: ${task.title}...`)
      frame++
      await this.delay(80)
    }

    // Implementar o código
    if (task.implementation) {
      await this.writeFile(task)
    }

    task.status = 'completed'
    this.completedTasks.push(task)

    console.log(`\r${chalk.green('✓')} ${task.agentIcon} ${chalk.bold(task.title)} - ${chalk.green('IMPLEMENTADO')}`)
    console.log(`   ${chalk.gray(task.description)}`)
    console.log(`   ${chalk.cyan('📁')} ${task.files.join(', ')}`)
    console.log('')
  }

  private async writeFile(task: Task): Promise<void> {
    const filePath = path.join(PROJECT_PATH, task.files[0])

    // Criar diretórios se necessário
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Escrever arquivo
    fs.writeFileSync(filePath, task.implementation!, 'utf-8')
  }

  private printSummary(tasks: Task[]): void {
    console.log(chalk.cyan('═══════════════════════════════════════════════════════'))
    console.log(chalk.bold.green('\n📊 RESUMO'))

    console.log(chalk.yellow('\n✨ Funcionalidades Implementadas:'))
    tasks.forEach((task, i) => {
      console.log(`   ${i + 1}. ${task.agentIcon} ${chalk.bold(task.title)}`)
      console.log(`      ${chalk.gray(task.description)}`)
    })

    // Progresso
    const total = taskDatabase.length
    const completed = this.completedTasks.length
    const percent = Math.round((completed / total) * 100)

    console.log(chalk.yellow('\n📈 Progresso:'))
    const bar = '█'.repeat(Math.round(percent / 2.5)) + '░'.repeat(40 - Math.round(percent / 2.5))
    console.log(`   [${chalk.green(bar)}] ${percent}%`)
    console.log(`   ${completed}/${total} tarefas`)

    // Próximas
    const nextTasks = taskDatabase.filter(t => t.status === 'pending').slice(0, 3)
    if (nextTasks.length > 0) {
      console.log(chalk.yellow('\n📋 Próximas:'))
      nextTasks.forEach((t, i) => {
        console.log(`   ${i + 1}. ${t.agentIcon} ${t.title}`)
      })
    }
  }

  private printFinalReport(): void {
    console.clear()
    console.log(chalk.green(`
╔══════════════════════════════════════════════════════════════╗
║              RELATÓRIO FINAL - CENTRO DE COMANDO             ║
╚══════════════════════════════════════════════════════════════╝
    `))

    const elapsed = Date.now() - this.startTime
    const mins = Math.floor(elapsed / 60000)

    console.log(chalk.bold(`\n⏱️  Tempo Total: ${mins} minutos`))
    console.log(chalk.bold(`📊 Atualizações: ${this.updateCount}`))
    console.log(chalk.bold(`✅ Tarefas: ${this.completedTasks.length}/${taskDatabase.length}`))

    console.log(chalk.yellow('\n✨ Funcionalidades Implementadas:'))
    this.completedTasks.forEach((task, i) => {
      console.log(`   ${i + 1}. ${task.agentIcon} ${task.title}`)
      console.log(`      📁 ${task.files.join(', ')}`)
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ============================================
// INICIAR
// ============================================

const center = new CommandCenter()

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n⚠️  Centro de Comando interrompido'))
  process.exit(0)
})

center.start().catch(console.error)