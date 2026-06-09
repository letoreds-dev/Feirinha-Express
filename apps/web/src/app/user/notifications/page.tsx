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

const notifications = [
  { id: 1, icon: '📦', title: 'Pedido entregue!', msg: 'Seu pedido da Fanaticos FC chegou', time: 'Agora' },
  { id: 2, icon: '🎫', title: 'Cupom novo', msg: 'Você ganhou R$10 de desconto!', time: '1h' },
  { id: 3, icon: '⭐', title: 'Avalie seu pedido', msg: 'Como foi sua experiência?', time: '2h' },
  { id: 4, icon: '🎉', title: 'Boas-vindas!', msg: 'Bem-vindo ao Feirinha Express', time: '1d' },
]

export default function NotificationsPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Notificações</h1>
      </NavBar>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map((notif) => (
          <Card key={notif.id} padding="md">
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{notif.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: 0 }}>{notif.title}</h3>
                  <span style={{ fontSize: '12px', color: colors.textSecondary }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>{notif.msg}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}