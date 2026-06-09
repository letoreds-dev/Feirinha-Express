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

export default function WalletPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Carteira</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <Card padding="md">
          <div style={{ textAlign: 'center', padding: '20px', background: `linear-gradient(135deg, ${colors.primary} 0%, #FF6B5B 100%)`, borderRadius: '16px', color: 'white' }}>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Saldo disponível</p>
            <p style={{ fontSize: '36px', fontWeight: 900, margin: '8px 0 0' }}>R$ 127,50</p>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
          {[
            { label: 'Adicionar', icon: '➕', color: colors.success },
            { label: 'Retirar', icon: '💸', color: colors.primary },
          ].map((btn, i) => (
            <button key={i} style={{
              padding: '16px', backgroundColor: 'white', border: 'none', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer',
            }}>
              <span style={{ fontSize: '28px' }}>{btn.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: btn.color }}>{btn.label}</span>
            </button>
          ))}
        </div>

        <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: '20px 0 12px' }}>Histórico</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { desc: 'Cashback pedido #1234', value: '+R$ 18,98', date: '02/06', positive: true },
            { desc: 'Pagamento pedido #1233', value: '-R$ 49,90', date: '01/06', positive: false },
            { desc: 'Cashback pedido #1232', value: '+R$ 18,48', date: '31/05', positive: true },
          ].map((item, i) => (
            <Card key={i} padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: 0 }}>{item.desc}</p>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '2px 0 0' }}>{item.date}</p>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: item.positive ? colors.success : colors.text }}>{item.value}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
