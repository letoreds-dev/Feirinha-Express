'use client'

import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const colors = {
  primary: '#FF3B30',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  background: '#FAFAFA',
  success: '#34C759',
}

export default function LoyaltyPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Clube Feirinha</h1>
      </NavBar>

      {/* Status Card */}
      <div style={{ padding: '16px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #FF6B5B 100%)`,
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '40px' }}>💎</span>
            <div>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Plano</p>
              <p style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Gold</p>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Pontos</p>
              <p style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>2.450</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Cashback</p>
              <p style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>10%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ padding: '0 16px 16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>Seus benefícios</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { icon: '🎁', title: 'Cashback 10%', desc: 'Em todas as compras' },
            { icon: '🚚', title: 'Frete grátis', desc: 'Em pedidos acima de R$50' },
            { icon: '🎂', title: 'Desconto aniversário', desc: '15% OFF no seu dia' },
            { icon: '⏰', title: 'Entrega prioritária', desc: 'Chega primeiro' },
          ].map((benefit, i) => (
            <Card key={i} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{benefit.icon}</span>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: 0 }}>{benefit.title}</h3>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '2px 0 0' }}>{benefit.desc}</p>
                </div>
                <span style={{ marginLeft: 'auto', color: colors.success }}>✓</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 16px 16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>Próximo nível</h2>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>👑</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Platinum</span>
                <span style={{ fontSize: '12px', color: colors.textSecondary }}>2.450 / 5.000 pts</span>
              </div>
              <div style={{ marginTop: '8px', height: '8px', backgroundColor: colors.background, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '49%', height: '100%', backgroundColor: colors.primary, borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
