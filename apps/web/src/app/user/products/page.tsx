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

const allProducts = [
  { id: 1, name: 'Camisa Brasil', price: 159.90, emoji: '👕', store: 'Fanaticos FC', storeSlug: 'fanaticos-fc' },
  { id: 2, name: 'Boné Corinthians', price: 59.90, emoji: '🧢', store: 'Fanaticos FC', storeSlug: 'fanaticos-fc' },
  { id: 3, name: 'Bandeira Palmeiras', price: 44.90, emoji: '🏴', store: 'Fanaticos FC', storeSlug: 'fanaticos-fc' },
  { id: 4, name: 'Capinha iPhone', price: 49.90, emoji: '📱', store: 'Mobile Prime', storeSlug: 'mobile-prime' },
  { id: 5, name: 'Carregador Turbo', price: 69.90, emoji: '🔌', store: 'Mobile Prime', storeSlug: 'mobile-prime' },
  { id: 6, name: 'Fone Bluetooth', price: 89.90, emoji: '🎧', store: 'Mobile Prime', storeSlug: 'mobile-prime' },
  { id: 7, name: 'Mouse sem fio', price: 54.90, emoji: '🖱️', store: 'Tech Box', storeSlug: 'tech-box' },
  { id: 8, name: 'Teclado RGB', price: 129.90, emoji: '⌨️', store: 'Tech Box', storeSlug: 'tech-box' },
  { id: 9, name: 'Webcam HD', price: 99.90, emoji: '📷', store: 'Tech Box', storeSlug: 'tech-box' },
  { id: 10, name: 'Jogo FC 25', price: 249.90, emoji: '🎮', store: 'Game Point', storeSlug: 'game-point' },
  { id: 11, name: 'Controle PS5', price: 299.90, emoji: '🎯', store: 'Game Point', storeSlug: 'game-point' },
  { id: 12, name: 'Headset Gamer', price: 179.90, emoji: '🎧', store: 'Game Point', storeSlug: 'game-point' },
]

export default function ProductsPage() {
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Todos os Produtos</h1>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {allProducts.map((product) => (
            <Link
              key={product.id}
              href={`/user/product/${product.id}`}
              style={{
                backgroundColor: colors.background,
                borderRadius: '16px',
                overflow: 'hidden',
                textDecoration: 'none',
              }}
            >
              <div style={{
                height: '100px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
              }}>
                {product.emoji}
              </div>
              <div style={{ padding: '10px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: 0 }}>{product.name}</h3>
                <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '2px 0 0' }}>{product.store}</p>
                <p style={{ fontSize: '15px', fontWeight: 800, color: colors.primary, margin: '4px 0 0' }}>
                  R$ {product.price.toFixed(2).replace('.', ',')}
</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
