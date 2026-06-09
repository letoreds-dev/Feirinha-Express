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

const addresses = [
  { id: 1, label: 'Casa', address: 'Av. Paulista, 1000 - Bela Vista', default: true },
  { id: 2, label: 'Trabalho', address: 'Rua Augusta, 500 - Consolação', default: false },
]

export default function AddressesPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Endereços</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {addresses.map((addr) => (
            <Card key={addr.id} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{addr.label === 'Casa' ? '🏠' : '🏢'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: 0 }}>{addr.label}</h3>
                    {addr.default && (
                      <span style={{
                        backgroundColor: colors.primary, color: 'white',
                        padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                      }}>
                        Principal
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>{addr.address}</p>
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
          + Adicionar novo endereço
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
