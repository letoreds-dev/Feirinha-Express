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

const faqs = [
  { q: 'Como fazer um pedido?', a: 'Busque produtos, adicione ao carrinho e finalize a compra.' },
  { q: 'Quanto tempo demora a entrega?', a: 'O tempo varia de 15 a 45 minutos dependendo da loja.' },
  { q: 'Como usar cupom de desconto?', a: 'Aplique o código na tela de checkout.' },
  { q: 'Como acompanhar meu pedido?', a: 'Acesse a aba Pedidos para rastrear.' },
]

export default function HelpPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Ajuda</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <Card padding="md">
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '48px' }}>❓</span>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: '12px 0 0' }}>Fale conosco</h2>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '8px 0 0' }}>Estamos aqui para ajudar</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button style={{ flex: 1, padding: '12px', backgroundColor: colors.background, border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>💬 Chat</button>
            <button style={{ flex: 1, padding: '12px', backgroundColor: colors.background, border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>📞 Ligar</button>
          </div>
        </Card>

        <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: '20px 0 12px' }}>Perguntas frequentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, i) => (
            <Card key={i} padding="md">
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: 0 }}>{faq.q}</h3>
              <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '8px 0 0' }}>{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
