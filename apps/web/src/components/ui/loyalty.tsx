'use client'

import { Card } from './card'

// ==================== LOYALTY PROGRESS ====================

interface LoyaltyAccount {
  points: number
  lifetimePoints: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  tierProgress: number
}

interface LoyaltyProgressProps {
  account: LoyaltyAccount
  nextTier?: {
    name: string
    pointsNeeded: number
    rewardPercent: number
  }
}

export function LoyaltyProgress({ account, nextTier }: LoyaltyProgressProps) {
  const tierColors = {
    bronze: { bg: 'bg-amber-700', text: 'text-amber-700', border: 'border-amber-700' },
    silver: { bg: 'bg-gray-400', text: 'text-gray-400', border: 'border-gray-400' },
    gold: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' },
    platinum: { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-purple-500', border: 'border-purple-500' },
  }

  const tierIcons = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
  }

  const colors = tierColors[account.tier]

  return (
    <Card padding="lg" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center text-2xl`}>
            {tierIcons[account.tier]}
          </div>
          <div>
            <p className={`text-lg font-extrabold capitalize ${colors.text}`}>
              {account.tier}
</p>
            <p className="text-sm text-brand-muted">
              {account.lifetimePoints.toLocaleString('pt-BR')} pontos vitalícios
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-brand-ink">
            {account.points.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-brand-muted">pontos disponíveis</p>
        </div>
      </div>

      {/* Progress to next tier */}
      {nextTier && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Próximo: {nextTier.name}</span>
            <span className="text-brand-ink font-medium">
              {nextTier.pointsNeeded.toLocaleString('pt-BR')} pontos
            </span>
          </div>
          <div className="h-3 bg-brand-soft rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bg} transition-all duration-500`}
              style={{ width: `${Math.min(account.tierProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Tier benefits */}
      <div className="flex gap-2 pt-2 border-t border-brand-line">
        <div className="flex-1 text-center p-2 bg-brand-soft rounded-lg">
          <p className="text-lg font-bold text-brand-ink">
            {account.tier === 'bronze' ? '5' : account.tier === 'silver' ? '10' : account.tier === 'gold' ? '15' : '20'}%
          </p>
          <p className="text-xs text-brand-muted">cashback</p>
        </div>
        <div className="flex-1 text-center p-2 bg-brand-soft rounded-lg">
          <p className="text-lg font-bold text-brand-ink">
            {account.tier === 'bronze' ? '2' : account.tier === 'silver' ? '5' : account.tier === 'gold' ? '10' : '20'}
          </p>
          <p className="text-xs text-brand-muted">pontos/pedido</p>
        </div>
        <div className="flex-1 text-center p-2 bg-brand-soft rounded-lg">
          <p className="text-lg font-bold text-brand-ink">
            {account.tier === 'platinum' ? '24h' : account.tier === 'gold' ? '48h' : '72h'}
          </p>
          <p className="text-xs text-brand-muted">suporte</p>
        </div>
      </div>
    </Card>
  )
}

// ==================== LOYALTY REWARD CARD ====================

interface LoyaltyReward {
  id: string
  name: string
  description?: string
  pointsCost: number
  type: string
  value: number
  minOrderValue: number
}

interface LoyaltyRewardCardProps {
  reward: LoyaltyReward
  userPoints: number
  onRedeem: (reward: LoyaltyReward) => void
}

export function LoyaltyRewardCard({ reward, userPoints, onRedeem }: LoyaltyRewardCardProps) {
  const canRedeem = userPoints >= reward.pointsCost

  const getIcon = () => {
    switch (reward.type) {
      case 'discount': return '💰'
      case 'free_product': return '🎁'
      case 'free_delivery': return '🚚'
      case 'cashback': return '💵'
      default: return '⭐'
    }
  }

  return (
    <Card padding="md" className={`${!canRedeem ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="font-bold text-brand-ink">{reward.name}</p>
          {reward.description && (
            <p className="text-sm text-brand-muted">{reward.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-brand-red">
              {reward.pointsCost.toLocaleString('pt-BR')} pts
            </span>
            {reward.minOrderValue > 0 && (
              <span className="text-xs text-brand-muted">
                (mín. R$ {reward.minOrderValue.toFixed(2)})
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => canRedeem && onRedeem(reward)}
          disabled={!canRedeem}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            canRedeem
              ? 'bg-brand-red text-white hover:bg-brand-red-dark'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          Resgatar
        </button>
      </div>
    </Card>
  )
}

// ==================== LOYALTY TRANSACTION ====================

interface LoyaltyTransaction {
  id: string
  type: 'earn' | 'redeem' | 'expire' | 'bonus'
  points: number
  description: string
  createdAt: string
}

interface LoyaltyTransactionItemProps {
  transaction: LoyaltyTransaction
}

export function LoyaltyTransactionItem({ transaction }: LoyaltyTransactionItemProps) {
  const isPositive = transaction.points > 0

  const getIcon = () => {
    switch (transaction.type) {
      case 'earn': return '➕'
      case 'redeem': return '🎁'
      case 'expire': return '⏰'
      case 'bonus': return '🎉'
      default: return '💰'
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-line">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
        isPositive ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-brand-ink">{transaction.description}</p>
        <p className="text-xs text-brand-muted">
          {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{transaction.points}
      </span>
    </div>
  )
}
