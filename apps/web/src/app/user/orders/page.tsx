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

const orders = [
  { id: '1', store: 'Fanaticos FC', emoji: '⚽', status: 'Delivered', date: '02/06', total: 189.80 },
  { id: '2', store: 'Mobile Prime', emoji: '📱', status: 'Delivered', date: '01/06', total: 139.80 },
  { id: '3', store: 'Tech Box', emoji: '🎮', status: 'On the way', date: '06/06', total: 254.70 },
]

export default function OrdersPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Meus Pedidos</h1>
      </NavBar>

      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map((order) => (
            <Card key={order.id} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#F5F5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {order.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: 0 }}>{order.store}</h3>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: order.status === 'Delivered' ? '#34C759' : colors.primary,
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>
                    {order.date} • R$ {order.total.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
