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

const referrals = [
  { name: 'Amigo 1', status: 'Convidou', date: '01/06' },
  { name: 'Amigo 2', status: 'Comprou', date: '02/06' },
  { name: 'Amigo 3', status: 'Convidou', date: '03/06' },
]

export default function ReferralPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Indicações</h1>
      </NavBar>

      {/* Banner */}
      <div style={{ padding: '16px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #FF6B5B 100%)`,
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '48px' }}>🎁</span>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 800, margin: '12px 0 0' }}>Indique amigos</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: '8px 0 0' }}>
            Você ganha R$10 por cada amigo que compra
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '12px',
          }}>
            <span style={{ color: 'white', fontSize: '14px' }}>Código: </span>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: 800 }}>FEIRINHA10</span>
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{ padding: '0 16px 16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>Seus indicados</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {referrals.map((ref, i) => (
            <Card key={i} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.text, margin: 0 }}>{ref.name}</h3>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '2px 0 0' }}>{ref.date}</p>
                </div>
                <span style={{
                  backgroundColor: ref.status === 'Comprou' ? colors.success : colors.background,
                  color: ref.status === 'Comprou' ? 'white' : colors.textSecondary,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  {ref.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
