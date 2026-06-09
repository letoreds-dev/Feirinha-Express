'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface LoyaltyUser {
  name: string
  totalPoints: number
  lifetimePoints: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  nextTier: {
    name: string
    pointsNeeded: number
    progress: number
  }
}

interface Reward {
  id: string
  title: string
  description: string
  pointsCost: number
  type: 'discount' | 'freight' | 'product' | 'cashback'
  value: string
  expiresIn?: string
  available: boolean
}

interface Transaction {
  id: string
  type: 'earned' | 'redeemed' | 'expired'
  points: number
  description: string
  date: string
  orderId?: string
}

export function LoyaltyPointsTracker() {
  const [user] = useState<LoyaltyUser>({
    name: 'Carlos Silva',
    totalPoints: 1250,
    lifetimePoints: 3500,
    tier: 'silver',
    nextTier: {
      name: 'Gold',
      pointsNeeded: 2500,
      progress: 70,
    },
  })

  const [rewards] = useState<Reward[]>([
    { id: '1', title: 'R$ 5 de desconto', description: 'Em qualquer pedido', pointsCost: 500, type: 'discount', value: 'R$ 5', available: true, expiresIn: '30 dias' },
    { id: '2', title: 'Frete grátis', description: 'Em qualquer pedido', pointsCost: 750, type: 'freight', value: 'Frete', available: true, expiresIn: '15 dias' },
    { id: '3', title: 'R$ 10 de desconto', description: 'Em qualquer pedido', pointsCost: 1000, type: 'discount', value: 'R$ 10', available: true },
    { id: '4', title: 'Hambúrguer grátis', description: 'Na Burguer House', pointsCost: 2000, type: 'product', value: '1x', available: false, expiresIn: '7 dias' },
    { id: '5', title: 'R$ 20 de cashback', description: 'Crédito para próximos pedidos', pointsCost: 3000, type: 'cashback', value: 'R$ 20', available: true },
  ])

  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'earned', points: 150, description: 'Pedido #FE-1234', date: '15/01', orderId: 'FE-1234' },
    { id: '2', type: 'redeemed', points: -500, description: 'Resgatou R$ 5 de desconto', date: '14/01' },
    { id: '3', type: 'earned', points: 80, description: 'Pedido #FE-1233', date: '12/01', orderId: 'FE-1233' },
    { id: '4', type: 'earned', points: 200, description: 'Pedido #FE-1232', date: '10/01', orderId: 'FE-1232' },
    { id: '5', type: 'expired', points: -100, description: 'Pontos expirados', date: '05/01' },
  ])

  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards')

  const tierConfig = {
    bronze: { color: 'bg-amber-700', label: 'Bronze', icon: '🥉', benefits: ['1 ponto por R$ 1 gasto'] },
    silver: { color: 'bg-gray-400', label: 'Prata', icon: '🥈', benefits: ['1.5 pontos por R$ 1 gasto', '5% de bônus em cumpleaños'] },
    gold: { color: 'bg-yellow-500', label: 'Ouro', icon: '🥇', benefits: ['2 pontos por R$ 1 gasto', 'Frete grátis mensal'] },
    platinum: { color: 'bg-indigo-500', label: 'Platinum', icon: '💎', benefits: ['3 pontos por R$ 1 gasto', 'Frete grátis ilimitado', 'Atendimento prioritário'] },
  }

  const currentTier = tierConfig[user.tier]
  const nextTierConfig = user.nextTier.name.toLowerCase() as keyof typeof tierConfig
  const nextTierInfo = tierConfig[nextTierConfig]

  const redeemReward = (reward: Reward) => {
    if (user.totalPoints < reward.pointsCost) {
      toast.error('Pontos insuficientes')
      return
    }
    toast.success(`Resgatado: ${reward.title}!`)
  }

  return (
    <div className="space-y-6">
      {/* Points card */}
      <Card padding="lg" className="bg-gradient-to-r from-brand-red to-red-600 text-white">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">{currentTier.icon}</span>
            <Badge className={`${currentTier.color} text-white`}>
              {currentTier.label}
            </Badge>
          </div>
          <p className="text-white text-opacity-80 text-sm">Seus pontos</p>
          <p className="text-5xl font-extrabold my-2">{user.totalPoints.toLocaleString()}</p>
          <p className="text-white text-opacity-80 text-xs">
            {user.lifetimePoints.toLocaleString()} pontos acumulados na vida
          </p>
        </div>

        {/* Next tier progress */}
        <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">
              {nextTierInfo.icon} {user.nextTier.name}
            </span>
            <span className="text-xs">
              {user.nextTier.pointsNeeded.toLocaleString()} pts necessários
            </span>
          </div>
          <div className="h-3 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${user.nextTier.progress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* How to earn */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">📊 Como ganhar pontos</h3>
        <div className="space-y-3">
          {currentTier.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-emerald-500">✓</span>
              <p className="text-sm text-brand-ink">{benefit}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-brand-soft rounded-xl">
          <p className="text-sm text-brand-muted">
            💡 Cada R$ 1 gasto = {user.tier === 'bronze' ? 1 : user.tier === 'silver' ? 1.5 : user.tier === 'gold' ? 2 : 3} ponto(s)
          </p>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
            activeTab === 'rewards' ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
          }`}
        >
          🎁 Recompensas
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
            activeTab === 'history' ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
          }`}
        >
          📜 Histórico
        </button>
      </div>

      {/* Rewards */}
      {activeTab === 'rewards' && (
        <div className="space-y-3">
          {rewards.map(reward => (
            <Card key={reward.id} padding="md">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                  reward.available ? 'bg-brand-soft' : 'bg-gray-100'
                }`}>
                  {reward.type === 'discount' && '💰'}
                  {reward.type === 'freight' && '🚚'}
                  {reward.type === 'product' && '🎁'}
                  {reward.type === 'cashback' && '💵'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-brand-ink">{reward.title}</p>
                      <p className="text-sm text-brand-muted">{reward.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-brand-red">
                        {reward.pointsCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-brand-muted">pontos</p>
                    </div>
                  </div>
                  {reward.expiresIn && (
                    <p className="text-xs text-orange-500 mt-1">
                      ⏰ Expira em {reward.expiresIn}
                    </p>
                  )}
                  <Button
                    onClick={() => redeemReward(reward)}
                    disabled={!reward.available || user.totalPoints < reward.pointsCost}
                    variant={reward.available && user.totalPoints >= reward.pointsCost ? 'primary' : 'outline'}
                    size="sm"
                    className="mt-3 w-full"
                  >
                    {user.totalPoints >= reward.pointsCost ? 'Resgatar' : 'Pontos insuficientes'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {transactions.map(transaction => (
            <Card key={transaction.id} padding="md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'earned' ? 'bg-emerald-100' :
                    transaction.type === 'redeemed' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'earned' && '➕'}
                    {transaction.type === 'redeemed' && '🎁'}
                    {transaction.type === 'expired' && '⏰'}
                  </div>
                  <div>
                    <p className="font-medium text-brand-ink">{transaction.description}</p>
                    <p className="text-xs text-brand-muted">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-extrabold ${
                  transaction.type === 'earned' ? 'text-emerald-600' :
                  transaction.type === 'redeemed' ? 'text-blue-600' : 'text-red-500'
                }`}>
                  {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                </p>
              </div>
              {transaction.orderId && (
                <Link
                  href={`/user/orders/${transaction.orderId}`}
                  className="block mt-2 text-xs text-brand-red hover:underline"
                >
                  Ver pedido →
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <Card padding="md" className="bg-gray-50">
        <h4 className="font-bold text-brand-ink mb-2">📋 Regras</h4>
        <ul className="text-sm text-brand-muted space-y-1">
          <li>• Pontos expiram após 12 meses da data de ganho</li>
          <li>• Cada 100 pontos = R$ 1 de desconto</li>
          <li>• Resgates não são reembolsáveis</li>
          <li>• O programa pode ser alterado a qualquer momento</li>
        </ul>
      </Card>
    </div>
  )
}

// ==================== POINTS ANIMATION ====================

export function PointsAnimation({ points, onComplete }: { points: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let current = 0
    const increment = points / 30
    const timer = setInterval(() => {
      current += increment
      if (current >= points) {
        setDisplayed(points)
        clearInterval(timer)
        setTimeout(() => onComplete?.(), 1000)
      } else {
        setDisplayed(Math.floor(current))
      }
    }, 30)

    return () => clearInterval(timer)
  }, [points, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 text-center animate-bounce-in">
        <p className="text-6xl mb-4">🎉</p>
        <p className="text-lg font-bold text-brand-ink mb-2">Você ganhou!</p>
        <p className="text-5xl font-extrabold text-brand-red">
          +{displayed.toLocaleString()}
        </p>
        <p className="text-2xl mt-2">pontos</p>
      </div>
    </div>
  )
}