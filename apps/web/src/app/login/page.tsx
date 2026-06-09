'use client'

import { Card } from '@/components/ui/card'
import { useState } from 'react'
import Link from 'next/link'

const colors = {
  primary: '#FF3B30',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  background: '#FAFAFA',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `linear-gradient(135deg, ${colors.primary} 0%, #CC0000 100%)`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: '24px' }}>FE</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: colors.text, margin: '16px 0 0' }}>Entrar</h1>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '8px 0 0' }}>Bem-vindo de volta!</p>
        </div>

        <Card padding="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: colors.textSecondary }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" style={{ width: '100%', padding: '12px 16px', marginTop: '4px', borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '14px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: colors.textSecondary }}>Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', marginTop: '4px', borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '14px', outline: 'none' }} />
            </div>
            <button style={{ width: '100%', padding: '14px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>Entrar</button>
          </div>
        </Card>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: colors.textSecondary }}>
          Não tem conta? <Link href="/register" style={{ color: colors.primary, fontWeight: 600 }}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
