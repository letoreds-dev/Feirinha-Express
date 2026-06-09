/**
 * Feirinha Express - Gamification & Rewards System
 * Points, achievements, levels, and rewards
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== TYPES ====================

interface UserProgress {
  level: number
  currentPoints: number
  pointsToNextLevel: number
  totalPointsEarned: number
  streak: number
  badges: Badge[]
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: Date
  progress?: number
  target?: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  progress: number
  target: number
}

interface DailyChallenge {
  id: string
  title: string
  description: string
  icon: string
  points: number
  completed: boolean
  expiresIn: number // hours
}

interface Reward {
  id: string
  name: string
  description: string
  icon: string
  pointsCost: number
  type: 'discount' | 'freeItem' | 'cashback' | 'special'
  available: boolean
}

// ==================== USER PROGRESS ====================

export function UserProgressCard() {
  const [progress] = useState<UserProgress>({
    level: 5,
    currentPoints: 2450,
    pointsToNextLevel: 3000,
    totalPointsEarned: 12450,
    streak: 7,
    badges: [],
  })

  const levelProgress = (progress.currentPoints / progress.pointsToNextLevel) * 100

  return (
    <Card padding="md" className="bg-gradient-to-br from-brand-red to-red-700 text-white">
      {/* Level badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl">
            🏆
          </div>
          <div>
            <p className="text-sm opacity-80">Nível</p>
            <p className="text-3xl font-extrabold">{progress.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-80">🔥 Sequência</p>
          <p className="text-2xl font-extrabold">{progress.streak} dias</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{progress.currentPoints.toLocaleString('pt-BR')} pts</span>
          <span>{progress.pointsToNextLevel.toLocaleString('pt-BR')} pts para nível {progress.level + 1}</span>
        </div>
        <div className="h-3 bg-white bg-opacity-20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white border-opacity-20">
        <div className="text-center">
          <p className="text-2xl font-extrabold">{progress.totalPointsEarned.toLocaleString('pt-BR')}</p>
          <p className="text-xs opacity-80">Total conquistado</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-extrabold">23</p>
          <p className="text-xs opacity-80">Pedidos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-extrabold">8</p>
          <p className="text-xs opacity-80">Conquistas</p>
        </div>
      </div>
    </Card>
  )
}

// ==================== BADGES SECTION ====================

export function BadgesSection() {
  const [badges] = useState<Badge[]>([
    { id: '1', name: 'Primeiro Pedido', description: 'Faça seu primeiro pedido', icon: '🎉', earned: true, earnedDate: new Date('2024-01-15') },
    { id: '2', name: 'Cliente VIP', description: 'Faça 10 pedidos', icon: '👑', earned: true, earnedDate: new Date('2024-03-20') },
    { id: '3', name: 'Crítico', description: 'Avalie 5 pedidos', icon: '⭐', earned: true, earnedDate: new Date('2024-04-10') },
    { id: '4', name: 'Colecionador', description: 'Peça de 5 lojas diferentes', icon: '🏪', earned: false, progress: 3, target: 5 },
    { id: '5', name: 'Noite de Pizza', description: 'Peça pizza 3 vezes', icon: '🍕', earned: false, progress: 2, target: 3 },
    { id: '6', name: 'Fiel', description: 'Use o app por 30 dias', icon: '📅', earned: false, progress: 15, target: 30 },
  ])

  const earnedBadges = badges.filter(b => b.earned)
  const lockedBadges = badges.filter(b => !b.earned)

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-brand-ink flex items-center gap-2">
        🏅 Suas Conquistas
        <Badge variant="success">{earnedBadges.length}/{badges.length}</Badge>
      </h3>

      {/* Earned badges */}
      {earnedBadges.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {earnedBadges.map(badge => (
            <div key={badge.id} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
                {badge.icon}
              </div>
              <p className="text-xs font-medium mt-2">{badge.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Locked badges */}
      <h4 className="font-medium text-brand-muted text-sm mt-4">🔒 Em progresso</h4>
      <div className="space-y-2">
        {lockedBadges.map(badge => (
          <Card key={badge.id} padding="sm" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl opacity-50">
              {badge.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-ink">{badge.name}</p>
              <p className="text-xs text-brand-muted">{badge.description}</p>
              {badge.target && (
                <div className="mt-1">
                  <div className="h-1.5 bg-brand-soft rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-red rounded-full"
                      style={{ width: `${((badge.progress || 0) / badge.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {badge.progress}/{badge.target}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ==================== DAILY CHALLENGES ====================

export function DailyChallenges() {
  const [challenges] = useState<DailyChallenge[]>([
    { id: '1', title: 'Primeiro Pedido', description: 'Faça um pedido hoje', icon: '🛒', points: 50, completed: false, expiresIn: 8 },
    { id: '2', title: 'Explorador', description: 'Visite 3 lojas diferentes', icon: '🔍', points: 30, completed: true, expiresIn: 8 },
    { id: '3', title: 'Avaliador', description: 'Avalie um pedido', icon: '⭐', points: 25, completed: false, expiresIn: 8 },
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">📋 Desafios do Dia</h3>
        <Badge variant="warning">Expira em 8h</Badge>
      </div>

      <div className="space-y-2">
        {challenges.map(challenge => (
          <Card key={challenge.id} padding="sm" className={challenge.completed ? 'opacity-60' : ''}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                challenge.completed ? 'bg-emerald-100' : 'bg-brand-soft'
              }`}>
                {challenge.completed ? '✅' : challenge.icon}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${challenge.completed ? 'line-through text-brand-muted' : 'text-brand-ink'}`}>
                  {challenge.title}
                </p>
                <p className="text-xs text-brand-muted">{challenge.description}</p>
              </div>
              <div className="text-right">
                <Badge variant={challenge.completed ? 'success' : 'filled'}>
                  +{challenge.points}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ==================== REWARDS SHOP ====================

export function RewardsShop() {
  const [rewards] = useState<Reward[]>([
    { id: '1', name: 'R$ 5 off', description: 'Desconto de R$5 no próximo pedido', icon: '🎟️', pointsCost: 500, type: 'discount', available: true },
    { id: '2', name: 'Frete grátis', description: 'Frete grátis em qualquer pedido', icon: '🚚', pointsCost: 300, type: 'freeItem', available: true },
    { id: '3', name: 'Sorvete de brinde', description: 'Ganhe um sorvete na próxima compra', icon: '🍦', pointsCost: 200, type: 'freeItem', available: true },
    { id: '4', name: '3% cashback', description: '3% de cashback por 7 dias', icon: '💰', pointsCost: 1000, type: 'cashback', available: true },
    { id: '5', name: 'Combo especial', description: 'Combo exclusivo por pontos', icon: '🍔', pointsCost: 800, type: 'special', available: false },
  ])

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-brand-ink">🎁 Loja de Recompensas</h3>

      <div className="space-y-2">
        {rewards.map(reward => (
          <Card key={reward.id} padding="sm" className={!reward.available ? 'opacity-50' : ''}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
                {reward.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-brand-ink">{reward.name}</p>
                <p className="text-xs text-brand-muted">{reward.description}</p>
              </div>
              <Button
                size="sm"
                disabled={!reward.available}
                variant={reward.available ? 'primary' : 'ghost'}
              >
                {reward.pointsCost} pts
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ==================== LEADERBOARD ====================

export function Leaderboard() {
  const users = [
    { rank: 1, name: 'Maria S.', points: 15420, avatar: '👩', level: 12 },
    { rank: 2, name: 'João P.', points: 12890, avatar: '👨', level: 10 },
    { rank: 3, name: 'Ana C.', points: 11200, avatar: '👩‍🦰', level: 9 },
    { rank: 4, name: 'Você', points: 12450, avatar: '😎', level: 5, isCurrent: true },
    { rank: 5, name: 'Carlos R.', points: 9800, avatar: '🧔', level: 8 },
  ]

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-brand-ink">🏆 Ranking Semanal</h3>

      {users.map((user, index) => (
        <Card key={index} padding="sm" className={user.isCurrent ? 'bg-brand-soft border-2 border-brand-red' : ''}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              index === 0 ? 'bg-yellow-400 text-yellow-900' :
              index === 1 ? 'bg-gray-300 text-gray-700' :
              index === 2 ? 'bg-amber-600 text-white' :
              'bg-brand-line text-brand-muted'
            }`}>
              {user.rank}
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl">
              {user.avatar}
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-ink">
                {user.name}
                {user.isCurrent && <span className="ml-2 text-xs text-brand-red">(você)</span>}
              </p>
              <p className="text-xs text-brand-muted">Nível {user.level}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-brand-ink">{user.points.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-brand-muted">pontos</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ==================== POINTS HISTORY ====================

export function PointsHistory() {
  const transactions = [
    { id: '1', type: 'earned', description: 'Pedido #1234', points: 45, date: new Date() },
    { id: '2', type: 'earned', description: 'Desafio: Explorador', points: 30, date: new Date(Date.now() - 86400000) },
    { id: '3', type: 'redeemed', description: 'R$ 5 off', points: -500, date: new Date(Date.now() - 172800000) },
    { id: '4', type: 'earned', description: 'Avaliação de pedido', points: 10, date: new Date(Date.now() - 259200000) },
    { id: '5', type: 'earned', description: 'Bônus por sequência', points: 100, date: new Date(Date.now() - 345600000) },
  ]

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-brand-ink">📜 Histórico de Pontos</h3>

      <div className="space-y-2">
        {transactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-brand-line last:border-0">
            <div>
              <p className="font-medium text-brand-ink">{transaction.description}</p>
              <p className="text-xs text-brand-muted">
                {transaction.date.toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span className={`font-bold ${transaction.points > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {transaction.points > 0 ? '+' : ''}{transaction.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== FULL PAGE ====================

export default function GamificationPage() {
  return (
    <div className="space-y-6">
      <UserProgressCard />
      <BadgesSection />
      <DailyChallenges />
      <RewardsShop />
      <Leaderboard />
      <PointsHistory />
    </div>
  )
}