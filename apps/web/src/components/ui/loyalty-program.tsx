'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface LoyaltyReward {
  id: string
  title: string
  description: string
  pointsCost: number
  type: 'discount' | 'frete' | 'product' | 'cashback'
  icon: string
  expiresAt?: string
  isRedeemed?: boolean
}

interface UserPoints {
  total: number
  lifetime: number
  nextReward: number
  level: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante'
}

const mockRewards: LoyaltyReward[] = [
  { id: '1', title: 'R$ 5 de desconto', description: 'Cupom de R$5 para sua próxima compra', pointsCost: 100, type: 'discount', icon: '🎫' },
  { id: '2', title: 'Frete grátis', description: 'Frete grátis em qualquer pedido', pointsCost: 150, type: 'frete', icon: '🚚' },
  { id: '3', title: 'R$ 15 de desconto', description: 'Cupom de R$15 para compras acima de R$80', pointsCost: 300, type: 'discount', icon: '🎁', expiresAt: new Date(Date.now() + 7 * 86400000).toISOString() },
  { id: '4', title: 'Cashback 10%', description: 'Ganhe 10% de cashback na próxima compra', pointsCost: 500, type: 'cashback', icon: '💰' },
  { id: '5', title: 'Combo Grátis', description: 'Ganhe batata média com qualquer lanche', pointsCost: 200, type: 'product', icon: '🍟' },
  { id: '6', title: 'R$ 30 de desconto', description: 'Cupom especial Black Friday', pointsCost: 800, type: 'discount', icon: '🔥' },
]

const levelConfig = {
  Bronze: { min: 0, color: 'from-amber-700 to-amber-900', points: 0 },
  Prata: { min: 500, color: 'from-gray-400 to-gray-600', points: 500 },
  Ouro: { min: 2000, color: 'from-yellow-400 to-yellow-600', points: 2000 },
  Diamante: { min: 5000, color: 'from-cyan-400 to-blue-600', points: 5000 },
}

export function LoyaltyProgram() {
  const [rewards, setRewards] = useState<LoyaltyReward[]>(mockRewards)
  const [userPoints, setUserPoints] = useState<UserPoints>({
    total: 450,
    lifetime: 1250,
    nextReward: 100,
    level: 'Prata'
  })
  const [redeemingId, setRedeemingId] = useState<string | null>(null)

  const currentLevelConfig = levelConfig[userPoints.level]
  const nextLevelConfig = Object.entries(levelConfig).find(([_, config]) => config.min > userPoints.lifetime)
  const progressToNext = nextLevelConfig
    ? ((userPoints.lifetime - currentLevelConfig.min) / (nextLevelConfig[1].min - currentLevelConfig.min)) * 100
    : 100

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (userPoints.total < reward.pointsCost) return

    setRedeemingId(reward.id)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setUserPoints(prev => ({
      ...prev,
      total: prev.total - reward.pointsCost
    }))
    setRewards(rewards.map(r =>
      r.id === reward.id ? { ...r, isRedeemed: true } : r
    ))
    setRedeemingId(null)

    alert(`Parabéns! Você resgatou "${reward.title}\"!\nO cupom foi adicionado à sua carteira.`)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  return (
    <div className="space-y-4">
      {/* Points Card */}
      <Card padding="lg" className="bg-gradient-to-br from-brand-red to-brand-red-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⭐</span>
            <span className="text-sm font-medium opacity-90">Seus pontos</span>
          </div>

          <p className="text-5xl font-extrabold mb-1">{userPoints.total}</p>
          <p className="text-sm opacity-80 mb-4">
            Total acumulado: {userPoints.lifetime} pontos
          </p>

          {/* Level */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${currentLevelConfig.color} text-white font-bold text-sm`}>
            <span>{userPoints.level}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 relative z-10">
          <div className="flex justify-between text-xs opacity-80 mb-1">
            <span>{userPoints.level}</span>
            <span>{nextLevelConfig?.[0] || 'Máximo'}</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <p className="text-xs opacity-80 mt-1">
            Faltam {nextLevelConfig?.[1].points ? nextLevelConfig[1].points - userPoints.lifetime : 0} pontos para o próximo nível
          </p>
        </div>
      </Card>

      {/* How to Earn */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Como ganhar pontos</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-brand-muted">Fazer um pedido</span>
            <Badge variant="success">+10 pontos</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-brand-muted">Avaliar produto</span>
            <Badge variant="success">+5 pontos</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-brand-muted">Indicar um amigo</span>
            <Badge variant="success">+50 pontos</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-brand-muted">Completar perfil</span>
            <Badge variant="success">+20 pontos</Badge>
          </div>
        </div>
      </Card>

      {/* Rewards */}
      <div>
        <h3 className="font-bold text-brand-ink mb-3">Recompensas disponíveis</h3>
        <div className="space-y-3">
          {rewards.map(reward => {
            const canRedeem = userPoints.total >= reward.pointsCost && !reward.isRedeemed
            const isRedeeming = redeemingId === reward.id

            return (
              <Card
                key={reward.id}
                padding="md"
                className={`${reward.isRedeemed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-brand-ink">{reward.title}</h4>
                        <p className="text-xs text-brand-muted mt-0.5">{reward.description}</p>
                      </div>
                      {reward.expiresAt && !reward.isRedeemed && (
                        <Badge variant="warning" className="text-xs">
                          Expira {formatDate(reward.expiresAt)}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">⭐</span>
                        <span className="font-bold text-brand-ink">{reward.pointsCost}</span>
                        <span className="text-xs text-brand-muted">pontos</span>
                      </div>

                      {reward.isRedeemed ? (
                        <Badge variant="success">Resgatado ✓</Badge>
                      ) : (
                        <Button
                          size="sm"
                          disabled={!canRedeem || isRedeeming}
                          onClick={() => handleRedeem(reward)}
                        >
                          {isRedeeming ? '⏳' : canRedeem ? 'Resgatar' : 'Pontos insuficientes'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Referral */}
      <Card padding="md" className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-2xl text-white">
            👥
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-brand-ink">Indique amigos e ganhe!</h4>
            <p className="text-xs text-brand-muted mt-1">
              Convide seus amigos para a Feirinha Express. Você ganha 50 pontos e seu amigo ganha 10% de desconto na primeira compra!
            </p>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                defaultValue="feirinha.express/app/convite/CARLOS123"
                className="flex-1 px-3 py-2 border border-purple-200 rounded-lg text-xs bg-white"
                readOnly
              />
              <Button size="sm">Copiar</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}