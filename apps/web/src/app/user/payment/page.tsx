'use client'

import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { Card } from '@/components/ui/card'

const colors = {
  primary: '#FF3B30',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  background: '#FAFAFA',
}

const payments = [
  { id: 1, type: 'credit', label: 'Cartão de Crédito', number: '•••• 4242', brand: 'Visa', default: true },
  { id: 2, type: 'debit', label: 'Cartão de Débito', number: '•••• 8888', brand: 'Mastercard', default: false },
]

export default function PaymentPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Pagamentos</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payments.map((pay) => (
            <Card key={pay.id} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>💳</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: 0 }}>{pay.label}</h3>
                    {pay.default && (
                      <span style={{
                        backgroundColor: colors.primary, color: 'white',
                        padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                      }}>
                        Padrão
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>{pay.brand} {pay.number}</p>
                </div>
                <button style={{ color: colors.primary, background: 'none', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Editar</button>
              </div>
            </Card>
          ))}
        </div>
        <button style={{
          marginTop: '16px', width: '100%', padding: '14px',
          backgroundColor: 'white', color: colors.primary, textAlign: 'center',
          border: `2px dashed ${colors.primary}`, borderRadius: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        }}>
          + Adicionar novo cartão
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
