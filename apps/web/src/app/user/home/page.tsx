'use client'

import { useState } from 'react'
import Link from 'next/link'

// Cores Feirinha Express
const colors = {
  primary: '#FF3B30',
  primaryDark: '#D62F27',
  background: '#FAFAFA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  border: '#E5E5E5',
  accent: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
}

// Lojas reais do Feirinha Express
const stores = [
  {
    id: 1,
    name: 'Fanaticos FC',
    slug: 'fanaticos-fc',
    logo: '⚽',
    type: 'Artigos de time',
    rating: 4.8,
    reviews: 234,
    time: '15-25 min',
    fee: 'R$4,90',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
    products: [
      { id: 1, name: 'Camisa Brasil retrô', price: 129.90, emoji: '👕' },
      { id: 2, name: 'Boné Corinthians', price: 59.90, emoji: '🧢' },
      { id: 3, name: 'Bandeira Palmeiras', price: 44.90, emoji: '🏴' },
    ],
  },
  {
    id: 2,
    name: 'Mobile Prime',
    slug: 'mobile-prime',
    logo: '📱',
    type: 'Acessórios celular',
    rating: 4.6,
    reviews: 189,
    time: '20-30 min',
    fee: 'R$3,90',
    image: 'https://images.unsplash.com/photo-1588497850510-8951e018c8eb?w=400&h=300&fit=crop',
    products: [
      { id: 4, name: 'Capinha iPhone', price: 49.90, emoji: '📱' },
      { id: 5, name: 'Carregador Turbo', price: 69.90, emoji: '🔌' },
      { id: 6, name: 'Fone Bluetooth', price: 89.90, emoji: '🎧' },
    ],
  },
  {
    id: 3,
    name: 'Tech Box',
    slug: 'tech-box',
    logo: '🎮',
    type: 'Eletrônicos',
    rating: 4.9,
    reviews: 312,
    time: '25-35 min',
    fee: 'R$5,90',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=300&fit=crop',
    products: [
      { id: 7, name: 'Mouse sem fio', price: 54.90, emoji: '🖱️' },
      { id: 8, name: 'Teclado RGB', price: 129.90, emoji: '⌨️' },
      { id: 9, name: 'Webcam HD', price: 99.90, emoji: '📷' },
    ],
  },
  {
    id: 4,
    name: 'Game Point',
    slug: 'game-point',
    logo: '🕹️',
    type: 'Videogames',
    rating: 4.7,
    reviews: 156,
    time: '30-40 min',
    fee: 'R$6,90',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
    products: [
      { id: 10, name: 'Jogo FC 25', price: 249.90, emoji: '🎮' },
      { id: 11, name: 'Controle PS5', price: 299.90, emoji: '🎯' },
      { id: 12, name: 'Headset Gamer', price: 179.90, emoji: '🎧' },
    ],
  },
]

// Categorias Feirinha
const categories = [
  { id: 1, name: 'Times', emoji: '⚽', color: '#FF3B30', slug: 'times' },
  { id: 2, name: 'Celular', emoji: '📱', color: '#007AFF', slug: 'celular' },
  { id: 3, name: 'Gamer', emoji: '🎮', color: '#5856D6', slug: 'gamer' },
  { id: 4, name: 'Eletrônicos', emoji: '🔌', color: '#FF9500', slug: 'eletronicos' },
  { id: 5, name: 'Papelaria', emoji: '✏️', color: '#34C759', slug: 'papelaria' },
  { id: 6, name: 'Bijuterias', emoji: '💍', color: '#FF2D55', slug: 'bijuterias' },
  { id: 7, name: 'Cosméticos', emoji: '💄', color: '#AF52DE', slug: 'cosmeticos' },
  { id: 8, name: 'Alimentos', emoji: '🍪', color: '#FF6B00', slug: 'alimentos' },
]

// Produtos em destaque
const featuredProducts = [
  { id: 1, name: 'Camisa Brasil 2024', price: 159.90, store: 'Fanaticos FC', storeSlug: 'fanaticos-fc', emoji: '👕', tag: 'Novo' },
  { id: 2, name: 'Capinha MagSafe', price: 79.90, store: 'Mobile Prime', storeSlug: 'mobile-prime', emoji: '📱', tag: 'Promo' },
  { id: 3, name: 'Controle Xbox', price: 349.90, store: 'Game Point', storeSlug: 'game-point', emoji: '🎮', tag: null },
  { id: 4, name: 'Fone AirPods', price: 199.90, store: 'Tech Box', storeSlug: 'tech-box', emoji: '🎧', tag: 'Trending' },
  { id: 5, name: 'Boné Nike', price: 89.90, store: 'Fanaticos FC', storeSlug: 'fanaticos-fc', emoji: '🧢', tag: null },
  { id: 6, name: 'Carregador 65W', price: 99.90, store: 'Tech Box', storeSlug: 'tech-box', emoji: '🔌', tag: 'Promo' },
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', paddingBottom: '80px' }}>
      {/* HEADER */}
      <header style={{
        backgroundColor: colors.card,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo Feirinha */}
            <Link href="/user/home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255,59,48,0.3)',
              }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '18px' }}>FE</span>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>Entregar em</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Centro Comercial
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </p>
              </div>
            </Link>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/user/search-page" style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: colors.background,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link href="/user/notifications" style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: colors.background,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary,
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>2</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <div style={{ backgroundColor: colors.card, padding: '0 16px 16px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <Link href="/user/search-page" style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: '14px',
            padding: '0 16px',
            height: '50px',
            border: `1px solid ${colors.border}`,
            textDecoration: 'none',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span style={{
              flex: 1,
              marginLeft: '12px',
              fontSize: '15px',
              color: '#8E8E93',
            }}>
              Buscar produtos, lojas...
            </span>
          </Link>
        </div>
      </div>

      {/* BANNER PROMO */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <Link href="/user/promotions" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: `linear-gradient(135deg, ${colors.primary} 0%, #FF6B5B 100%)`,
            borderRadius: '16px',
            padding: '20px',
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: '48px' }}>🎉</span>
            <div>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '18px', margin: 0 }}>Feirinha no ar!</p>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', margin: '4px 0 0' }}>Entrega rápida em todo o centro comercial</p>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', margin: '2px 0 0' }}>Compre de várias lojas em um só pedido</p>
            </div>
          </Link>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>Categorias</h2>
            <Link href="/user/categories" style={{ fontSize: '13px', color: colors.primary, fontWeight: 600, textDecoration: 'none' }}>
              Ver todas →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/user/categories/${cat.slug}`}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 8px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: selectedCategory === cat.id ? `${cat.color}15` : colors.card,
                  boxShadow: selectedCategory === cat.id ? `0 4px 12px ${cat.color}30` : '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: `${cat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {cat.emoji}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: selectedCategory === cat.id ? cat.color : colors.text,
                }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>🔥 Produtos em destaque</h2>
            <Link href="/user/products" style={{ fontSize: '13px', color: colors.primary, fontWeight: 600, textDecoration: 'none' }}>
              Ver mais →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/user/product/${product.id}`}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                <div style={{
                  height: '120px',
                  backgroundColor: '#F5F5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  position: 'relative',
                }}>
                  {product.emoji}
                  {product.tag && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: product.tag === 'Promo' ? colors.warning : product.tag === 'Novo' ? colors.accent : colors.success,
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}>
                      {product.tag}
                    </div>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: 0 }}>{product.name}</h3>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0' }}>{product.store}</p>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: colors.primary, margin: '8px 0 0' }}>
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* STORES */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: colors.text, margin: 0 }}>🏪 Lojas do centro</h2>
            <Link href="/user/stores" style={{ fontSize: '13px', color: colors.primary, fontWeight: 600, textDecoration: 'none' }}>
              Ver todas →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stores.map((store) => (
              <Link
                key={store.id}
                href={`/user/store/${store.slug}`}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                {/* Store Header */}
                <div style={{ position: 'relative', height: '100px' }}>
                  <img
                    src={store.image}
                    alt={store.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '-24px',
                    left: '16px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: colors.card,
                    border: `3px solid ${colors.card}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    {store.logo}
                  </div>
                </div>

                {/* Store Info */}
                <div style={{ padding: '16px', paddingTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: colors.text, margin: 0 }}>{store.name}</h3>
                      <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0' }}>{store.type}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '14px' }}>⭐</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>{store.rating}</span>
                      <span style={{ fontSize: '12px', color: colors.textSecondary }}>({store.reviews})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '13px', color: colors.textSecondary }}>
                    <span>🕐 {store.time}</span>
                    <span>•</span>
                    <span>🚚 {store.fee}</span>
                  </div>

                  {/* Mini Products */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    {store.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/user/product/${p.id}`}
                        style={{
                          flex: 1,
                          backgroundColor: colors.background,
                          borderRadius: '10px',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{p.emoji}</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: colors.text, textAlign: 'center' }}>{p.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: colors.primary }}>R$ {p.price.toFixed(2).replace('.', ',')}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.card,
        borderTop: `1px solid ${colors.border}`,
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
        paddingTop: '8px',
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
          {[
            { icon: '🏠', label: 'Início', href: '/user/home', active: true },
            { icon: '📋', label: 'Pedidos', href: '/user/orders', active: false },
            { icon: '🔍', label: 'Buscar', href: '/user/search-page', active: false },
            { icon: '👤', label: 'Perfil', href: '/user/profile', active: false },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: item.active ? colors.primary : '#8E8E93',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
