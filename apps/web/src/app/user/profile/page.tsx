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
  border: '#E5E5E5',
}

const menuItems = [
  { icon: '👤', label: 'Meus dados', href: '/user/profile/edit' },
  { icon: '📍', label: 'Endereços', href: '/user/addresses' },
  { icon: '💳', label: 'Formas de pagamento', href: '/user/payment' },
  { icon: '🎁', label: 'Indicações', href: '/user/referral' },
  { icon: '💎', label: 'Clube Feirinha', href: '/user/loyalty' },
  { icon: '🎫', label: 'Cupons', href: '/user/coupons' },
  { icon: '🔔', label: 'Notificações', href: '/user/notifications' },
  { icon: '❓', label: 'Ajuda', href: '/user/help' },
]

export default function ProfilePage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Meu Perfil</h1>
      </NavBar>

      {/* User Info */}
      <div style={{ padding: '16px', backgroundColor: colors.background }}>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              color: 'white',
              fontWeight: 700,
            }}>
              K
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0 }}>Kauan</h2>
              <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '4px 0 0' }}>kauan@email.com</p>
            </div>
            <button style={{
              padding: '8px 16px',
              backgroundColor: colors.background,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: colors.primary,
              cursor: 'pointer',
            }}>
              Editar
            </button>
          </div>
        </Card>
      </div>

      {/* Menu */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: colors.background,
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: colors.text }}>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}