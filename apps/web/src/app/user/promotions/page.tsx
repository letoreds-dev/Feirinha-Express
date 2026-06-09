'use client'

import { NavBar } from '@/components/ui/navbar'
import { Card } from '@/components/ui/card'

const colors = {
  primary: '#FF3B30',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  background: '#FAFAFA',
  success: '#34C759',
}

const promos = [
  { id: 1, title: 'Frete Grátis', desc: 'Pedidos acima de R$25', active: true },
  { id: 2, title: 'Combo da Semana', desc: '30% OFF em combos', active: true },
  { id: 3, title: 'Cashback 10%', desc: 'Em toda loja', active: false },
]

export default function PromotionsPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Promoções</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {promos.map((promo) => (
            <Card key={promo.id} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '12px',
                  backgroundColor: promo.active ? `${colors.primary}15` : colors.background,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                }}>
                  🎉
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: 0 }}>{promo.title}</h3>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>{promo.desc}</p>
                </div>
                <div style={{
                  width: '48px', height: '28px', borderRadius: '14px',
                  backgroundColor: promo.active ? colors.success : '#CCC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: 'white', fontSize: '14px' }}>{promo.active ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
