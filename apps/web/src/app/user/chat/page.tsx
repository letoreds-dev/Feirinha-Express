'use client'

import { NavBar } from '@/components/ui/navbar'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

const colors = {
  primary: '#FF3B30',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  background: '#FAFAFA',
}

const messages = [
  { id: 1, from: 'support', text: 'Olá! Como posso ajudar?', time: '14:30' },
  { id: 2, from: 'user', text: 'Quero saber sobre o status do meu pedido', time: '14:31' },
  { id: 3, from: 'support', text: 'Seu pedido #1234 está a caminho! Previsão: 15min', time: '14:32' },
]

export default function ChatPage() {
  const [input, setInput] = useState('')

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Suporte</h1>
      </NavBar>

      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '75%', padding: '12px 16px', borderRadius: '16px',
                backgroundColor: msg.from === 'user' ? colors.primary : 'white',
                color: msg.from === 'user' ? 'white' : colors.text,
                borderBottomRightRadius: msg.from === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.from === 'user' ? '16px' : '4px',
              }}>
                <p style={{ fontSize: '14px', margin: 0 }}>{msg.text}</p>
                <p style={{ fontSize: '10px', opacity: 0.7, margin: '4px 0 0', textAlign: 'right' }}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: 'white', borderTop: '1px solid #E5E5E5' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '24px',
              border: '1px solid #E5E5E5', fontSize: '14px', outline: 'none',
            }}
          />
          <button style={{
            width: '48px', height: '48px', borderRadius: '50%',
            backgroundColor: colors.primary, border: 'none', cursor: 'pointer',
          }}>
            <span style={{ color: 'white', fontSize: '20px' }}>➤</span>
          </button>
        </div>
      </div>
    </div>
  )
}
