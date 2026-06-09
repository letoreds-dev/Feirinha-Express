'use client'

import { NavBar } from '@/components/ui/navbar'
import { Card } from '@/components/ui/card'

const colors = {
  primary: '#FF3B30',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  background: '#FAFAFA',
}

export default function ProfileEditPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Editar Perfil</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: colors.primary, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', color: 'white', fontWeight: 700,
          }}>
            K
          </div>
          <button style={{ marginTop: '8px', color: colors.primary, background: 'none', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Alterar foto
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Nome', value: 'Kauan' },
            { label: 'Email', value: 'kauan@email.com' },
            { label: 'Telefone', value: '(11) 99999-9999' },
          ].map((field, i) => (
            <Card key={i} padding="md">
              <label style={{ fontSize: '12px', color: colors.textSecondary }}>{field.label}</label>
              <input
                type="text"
                defaultValue={field.value}
                style={{
                  width: '100%', border: 'none', background: 'transparent',
                  fontSize: '16px', color: colors.text, marginTop: '4px', outline: 'none',
                }}
              />
            </Card>
          ))}
        </div>

        <button style={{
          marginTop: '20px', width: '100%', padding: '14px',
          backgroundColor: colors.primary, color: 'white',
          border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
        }}>
          Salvar alterações
        </button>
      </div>
    </div>
  )
}
