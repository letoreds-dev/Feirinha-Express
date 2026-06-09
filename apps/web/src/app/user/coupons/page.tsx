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
}

const coupons = [
  { code: 'FRETE10', desc: 'Frete grátis em qualquer pedido', value: 'Grátis', expires: '15/06' },
  { code: 'PRIMEIRACOMPRA', desc: '10% OFF na primeira compra', value: '10%', expires: '30/06' },
  { code: 'COMBO20', desc: '20% OFF em combos', value: '20%', expires: '20/06' },
  { code: 'CASHBACK15', desc: '15% de cashback', value: '15%', expires: '25/06' },
]

export default function CouponsPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Cupons</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {coupons.map((coupon) => (
            <Card key={coupon.code} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  backgroundColor: `${colors.primary}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}>
                  🎫
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: 0 }}>{coupon.code}</h3>
                    <span style={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}>
                      {coupon.value}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>{coupon.desc}</p>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0' }}>Expira: {coupon.expires}</p>
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
