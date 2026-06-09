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

const stores = [
  { name: 'Fanaticos FC', emoji: '⚽', type: 'Artigos de time', rating: 4.8, slug: 'fanaticos-fc' },
  { name: 'Mobile Prime', emoji: '📱', type: 'Acessórios celular', rating: 4.6, slug: 'mobile-prime' },
  { name: 'Tech Box', emoji: '🎮', type: 'Eletrônicos', rating: 4.9, slug: 'tech-box' },
  { name: 'Game Point', emoji: '🕹️', type: 'Videogames', rating: 4.7, slug: 'game-point' },
  { name: 'Papelaria Central', emoji: '✏️', type: 'Papelaria', rating: 4.5, slug: 'papelaria-central' },
  { name: 'Acessórios Luxo', emoji: '💍', type: 'Bijuterias', rating: 4.8, slug: 'acessorios-luxo' },
  { name: 'Bella Store', emoji: '💄', type: 'Cosméticos', rating: 4.6, slug: 'bella-store' },
  { name: 'Mercadinho', emoji: '🍪', type: 'Alimentos', rating: 4.4, slug: 'mercadinho' },
]

export default function StoresPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Lojas do Centro</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stores.map((store) => (
            <Link
              key={store.slug}
              href={`/user/store/${store.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <Card padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: colors.background,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                  }}>
                    {store.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: 0 }}>{store.name}</h3>
                    <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>{store.type}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⭐</span>
                    <span style={{ fontWeight: 700 }}>{store.rating}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
