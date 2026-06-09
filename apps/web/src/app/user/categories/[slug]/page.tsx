'use client'

import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const colors = {
  primary: '#FF3B30',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  background: '#FAFAFA',
}

const categoryProducts: Record<string, { name: string; price: number; emoji: string; store: string }[]> = {
  times: [
    { name: 'Camisa Brasil', price: 159.90, emoji: '👕', store: 'Fanaticos FC' },
    { name: 'Boné Corinthians', price: 59.90, emoji: '🧢', store: 'Fanaticos FC' },
    { name: 'Bandeira Palmeiras', price: 44.90, emoji: '🏴', store: 'Fanaticos FC' },
    { name: 'Camisa Palmeiras', price: 119.90, emoji: '👕', store: 'Fanaticos FC' },
    { name: 'Chuteira Nike', price: 299.90, emoji: '⚽', store: 'Fanaticos FC' },
    { name: 'Luva Goleiro', price: 89.90, emoji: '🧤', store: 'Fanaticos FC' },
  ],
  celular: [
    { name: 'Capinha iPhone', price: 49.90, emoji: '📱', store: 'Mobile Prime' },
    { name: 'Carregador Turbo', price: 69.90, emoji: '🔌', store: 'Mobile Prime' },
    { name: 'Fone Bluetooth', price: 89.90, emoji: '🎧', store: 'Mobile Prime' },
    { name: 'Película Vidro', price: 29.90, emoji: '🔲', store: 'Mobile Prime' },
    { name: 'Cabo USB-C', price: 39.90, emoji: '🔗', store: 'Mobile Prime' },
    { name: 'Suporte Celular', price: 34.90, emoji: '📲', store: 'Mobile Prime' },
  ],
  gamer: [
    { name: 'Jogo FC 25', price: 249.90, emoji: '🎮', store: 'Game Point' },
    { name: 'Controle PS5', price: 299.90, emoji: '🎯', store: 'Game Point' },
    { name: 'Headset Gamer', price: 179.90, emoji: '🎧', store: 'Game Point' },
    { name: 'Mouse Gamer', price: 129.90, emoji: '🖱️', store: 'Tech Box' },
    { name: 'Teclado RGB', price: 199.90, emoji: '⌨️', store: 'Tech Box' },
    { name: 'Webcam Stream', price: 149.90, emoji: '📷', store: 'Tech Box' },
  ],
  eletronicos: [
    { name: 'Mouse sem fio', price: 54.90, emoji: '🖱️', store: 'Tech Box' },
    { name: 'Teclado RGB', price: 129.90, emoji: '⌨️', store: 'Tech Box' },
    { name: 'Webcam HD', price: 99.90, emoji: '📷', store: 'Tech Box' },
    { name: 'Fone USB', price: 79.90, emoji: '🎧', store: 'Tech Box' },
    { name: 'Hub USB', price: 44.90, emoji: '🔌', store: 'Tech Box' },
    { name: 'Carregador 65W', price: 99.90, emoji: '🔋', store: 'Tech Box' },
  ],
  papelaria: [
    { name: 'Caderno Universitário', price: 29.90, emoji: '📓', store: 'Papelaria Central' },
    { name: 'Canetas Coloridas', price: 19.90, emoji: '🖊️', store: 'Papelaria Central' },
    { name: 'Post-it Pack', price: 14.90, emoji: '📝', store: 'Papelaria Central' },
    { name: 'Lápis Kit', price: 24.90, emoji: '✏️', store: 'Papelaria Central' },
    { name: 'Borracha Colorida', price: 9.90, emoji: '🧽', store: 'Papelaria Central' },
    { name: 'Régua 30cm', price: 7.90, emoji: '📏', store: 'Papelaria Central' },
  ],
  bijuterias: [
    { name: 'Pulseira Prata', price: 49.90, emoji: '💍', store: 'Acessórios Luxo' },
    { name: 'Colar Dourado', price: 79.90, emoji: '📿', store: 'Acessórios Luxo' },
    { name: 'Brinco Cristal', price: 39.90, emoji: '💎', store: 'Acessórios Luxo' },
    { name: 'Anel Prata', price: 34.90, emoji: '💍', store: 'Acessórios Luxo' },
    { name: 'Tornozeleira', price: 44.90, emoji: '🦶', store: 'Acessórios Luxo' },
    { name: 'Pingente Coração', price: 29.90, emoji: '❤️', store: 'Acessórios Luxo' },
  ],
  cosmeticos: [
    { name: 'Batom Vermelho', price: 29.90, emoji: '💄', store: 'Bella Store' },
    { name: 'Esmalte Rosa', price: 14.90, emoji: '💅', store: 'Bella Store' },
    { name: 'Perfume Floral', price: 89.90, emoji: '🌸', store: 'Bella Store' },
    { name: 'Creme Hidratante', price: 49.90, emoji: '🧴', store: 'Bella Store' },
    { name: 'Máscara Facial', price: 34.90, emoji: '🧖‍♀️', store: 'Bella Store' },
    { name: 'Sabonete Natural', price: 19.90, emoji: '🧼', store: 'Bella Store' },
  ],
  alimentos: [
    { name: 'Biscoito Recheado', price: 8.90, emoji: '🍪', store: 'Mercadinho' },
    { name: 'Suco Laranja', price: 6.90, emoji: '🧃', store: 'Mercadinho' },
    { name: 'Chocolate Bar', price: 7.90, emoji: '🍫', store: 'Mercadinho' },
    { name: 'Pão de Forma', price: 5.90, emoji: '🍞', store: 'Mercadinho' },
    { name: 'Queijo Fatiado', price: 19.90, emoji: '🧀', store: 'Mercadinho' },
    { name: 'Café 500g', price: 24.90, emoji: '☕', store: 'Mercadinho' },
  ],
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const products = categoryProducts[slug] || categoryProducts.times

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      <NavBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/user/categories" style={{ color: colors.text, textDecoration: 'none', fontSize: '20px' }}>←</Link>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0, textTransform: 'capitalize' }}>
            {slug?.replace('-', ' ')}
          </h1>
        </div>
      </NavBar>

      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '16px' }}>
          {products.length} produtos encontrados
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {products.map((product, i) => (
            <Link
              key={i}
              href={`/user/product/${i + 1}`}
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
