'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface Referral {
  id: string
  name: string
  email: string
  status: 'pending' | 'completed' | 'rewarded'
  reward: number
  date: string
}

const referrals: Referral[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', status: 'rewarded', reward: 10, date: '15/01' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', status: 'completed', reward: 0, date: '18/01' },
  { id: '3', name: 'Ana Costa', email: 'ana@email.com', status: 'pending', reward: 0, date: '20/01' },
]

export function ReferralProgram() {
  const [copied, setCopied] = useState(false)
  const referralCode = 'FEIRINHA2024'

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Código copiado!')
  }

  const shareWhatsApp = () => {
    const message = encodeURIComponent(`🍎 Ei! Use meu código ${referralCode} na Feirinha Express e ganhe R$ 10 de desconto na primeira compra! Baixe em: feirinha.app`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const shareInstagram = () => {
    toast.info('Compartilhe em suas histórias!')
  }

  const completedCount = referrals.filter(r => r.status === 'completed' || r.status === 'rewarded').length
  const totalEarned = referrals.filter(r => r.status === 'rewarded').reduce((acc, r) => acc + r.reward, 0)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card padding="lg" className="bg-gradient-to-r from-brand-red to-red-600 text-white">
        <div className="text-center">
          <div className="text-5xl mb-3">🎁</div>
          <h2 className="text-2xl font-extrabold">Indique e ganhe!</h2>
          <p className="text-white text-opacity-80 mt-2">
            Convide amigos e ganhe R$ 10 para cada compra realizada
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold">{completedCount}</p>
            <p className="text-xs text-white text-opacity-80">Amigos indicados</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold">R$ {totalEarned}</p>
            <p className="text-xs text-white text-opacity-80">Crédito ganho</p>
          </div>
        </div>
      </Card>

      {/* Share section */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">🔗 Seu código de indicação</h3>

        <div className="flex items-center gap-3 mb-4">
          <code className="flex-1 px-4 py-3 bg-brand-soft rounded-xl font-mono font-bold text-brand-ink text-center text-lg">
            {referralCode}
          </code>
          <Button onClick={copyCode} className="px-4">
            {copied ? '✓' : '📋'}
          </Button>
        </div>

        <div className="space-y-3">
          <Button onClick={shareWhatsApp} variant="outline" className="w-full justify-start bg-emerald-50 border-emerald-200 text-emerald-700">
            💬 WhatsApp
          </Button>
          <Button onClick={shareInstagram} variant="outline" className="w-full justify-start bg-pink-50 border-pink-200 text-pink-700">
            📸 Instagram
          </Button>
          <Button variant="outline" className="w-full justify-start">
            ✉️ E-mail
          </Button>
          <Button variant="outline" className="w-full justify-start">
            📱 SMS
          </Button>
        </div>
      </Card>

      {/* How it works */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">📖 Como funciona</h3>
        <div className="space-y-4">
          {[
            { step: '1', icon: '📋', title: 'Compartilhe seu código', desc: 'Envie para seus amigos por WhatsApp, Instagram ou e-mail' },
            { step: '2', icon: '👋', title: 'Amigo se cadastra', desc: 'Ele usa seu código no primeiro pedido' },
            { step: '3', icon: '🎉', title: 'Vocês ganham', desc: 'Você recebe R$ 10 e ele ganha 15% off na primeira compra!' },
          ].map(item => (
            <div key={item.step} className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center text-xl font-extrabold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-bold text-brand-ink">{item.icon} {item.title}</p>
                <p className="text-sm text-brand-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Referrals list */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">👥 Indicações</h3>
        {referrals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-3">🤝</p>
            <p className="font-medium text-brand-ink">Nenhuma indicação ainda</p>
            <p className="text-sm text-brand-muted">Compartilhe seu código para começar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map(ref => (
              <div key={ref.id} className="flex items-center justify-between p-3 bg-brand-soft rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white font-extrabold">
                    {ref.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-brand-ink">{ref.name}</p>
                    <p className="text-xs text-brand-muted">{ref.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      ref.status === 'rewarded' ? 'success' :
                      ref.status === 'completed' ? 'warning' : 'outline'
                    }
                    className="text-xs"
                  >
                    {ref.status === 'rewarded' && `✓ R$ ${ref.reward}`}
                    {ref.status === 'completed' && '⏳ Pendente'}
                    {ref.status === 'pending' && '📧 Convite'}
                  </Badge>
                  <p className="text-xs text-brand-muted mt-1">{ref.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Terms */}
      <Card padding="md" className="bg-gray-50">
        <h3 className="font-bold text-brand-ink mb-2">📋 Regras</h3>
        <ul className="text-sm text-brand-muted space-y-1">
          <li>• Você ganha R$ 10 após o amigo concluir a primeira compra</li>
          <li>• O amigo recebe 15% de desconto na primeira compra</li>
          <li>• Não há limite de indicações</li>
          <li>• O crédito pode ser usado em qualquer pedido</li>
          <li>• O programa pode ser alterado a qualquer momento</li>
        </ul>
      </Card>
    </div>
  )
}