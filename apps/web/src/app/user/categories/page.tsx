'use client'

import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'

const colors = {
  primary: '#FF3B30',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  background: '#FAFAFA',
  border: '#E5E5E5',
}

const categories = [
  { name: 'Times', emoji: '⚽', count: 24, slug: 'times' },
  { name: 'Celular', emoji: '📱', count: 56, slug: 'celular' },
  { name: 'Gamer', emoji: '🎮', count: 32, slug: 'gamer' },
  { name: 'Eletrônicos', emoji: '🔌', count: 45, slug: 'eletronicos' },
  { name: 'Papelaria', emoji: '✏️', count: 18, slug: 'papelaria' },
  { name: 'Bijuterias', emoji: '💍', count: 29, slug: 'bijuterias' },
  { name: 'Cosméticos', emoji: '💄', count: 41, slug: 'cosmeticos' },
  { name: 'Alimentos', emoji: '🍪', count: 15, slug: 'alimentos' },
]

export default function CategoriesPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Categorias</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/user/categories/${cat.slug}`}
              onClick={() => setSelected(cat.slug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: selected === cat.slug ? `${colors.primary}15` : colors.background,
                borderRadius: '16px',
                textDecoration: 'none',
                border: `2px solid ${selected === cat.slug ? colors.primary : 'transparent'}`,
              }}
            >
              <span style={{ fontSize: '36px' }}>{cat.emoji}</span>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: 0 }}>{cat.name}</h3>
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0' }}>{cat.count} produtos</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
