'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface MerchantProfile {
  id: string
  name: string
  logo?: string
  type: string
  description: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  isOpen: boolean
  address: string
  phone: string
  socialMedia?: {
    instagram?: string
    whatsapp?: string
  }
  photos?: string[]
  tags?: string[]
}

export function MerchantProfile({ merchantId }: { merchantId: string }) {
  // Mock data
  const merchant: MerchantProfile = {
    id: merchantId,
    name: 'Burguer House',
    type: 'Lanches',
    description: 'Os melhores hambúrgueres artesanais da região! Preparados com ingredientes frescos e muito carinho.',
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: '25-35 min',
    deliveryFee: 5.90,
    minOrder: 25,
    isOpen: true,
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 98765-4321',
    socialMedia: {
      instagram: '@burguerhouse',
      whatsapp: '+5511987654321',
    },
    tags: ['Hambúrguer', 'Artesanal', 'Fast Food', 'Lanches'],
  }

  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'photos'>('info')

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card padding="md">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-brand-red flex items-center justify-center text-3xl text-white font-extrabold">
            {merchant.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-brand-ink">{merchant.name}</h2>
              {merchant.isOpen ? (
                <Badge variant="success" className="text-xs">🟢 Aberto</Badge>
              ) : (
                <Badge variant="danger" className="text-xs">🔴 Fechado</Badge>
              )}
            </div>
            <p className="text-sm text-brand-muted">{merchant.type}</p>
            <div className="flex items-center gap-3 mt-2 text-sm">
              <span className="flex items-center gap-1">
                ⭐ {merchant.rating} ({merchant.reviewCount})
              </span>
              <span>•</span>
              <span>🚴 {merchant.deliveryTime}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {merchant.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-brand-line">
          <div className="text-center">
            <p className="text-lg font-extrabold text-brand-ink">
              {merchant.deliveryFee === 0 ? 'Grátis' : `R$ ${merchant.deliveryFee.toFixed(2).replace('.', ',')}`}
            </p>
            <p className="text-xs text-brand-muted">Frete</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold text-brand-ink">{merchant.deliveryTime}</p>
            <p className="text-xs text-brand-muted">Entrega</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold text-brand-ink">R$ {merchant.minOrder}</p>
            <p className="text-xs text-brand-muted">Mín. pedido</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { key: 'info', label: 'Informações' },
          { key: 'reviews', label: 'Avaliações' },
          { key: 'photos', label: 'Fotos' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeTab === tab.key
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'info' && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-3">Sobre</h3>
          <p className="text-sm text-brand-muted">{merchant.description}</p>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-sm font-medium text-brand-ink">Endereço</p>
                <p className="text-sm text-brand-muted">{merchant.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">📞</span>
              <div>
                <p className="text-sm font-medium text-brand-ink">Telefone</p>
                <a href={`tel:${merchant.phone}`} className="text-sm text-brand-red hover:underline">
                  {merchant.phone}
                </a>
              </div>
            </div>

            {merchant.socialMedia && (
              <div className="flex gap-2 pt-2">
                {merchant.socialMedia.instagram && (
                  <a
                    href={`https://instagram.com/${merchant.socialMedia.instagram}`}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium"
                    target="_blank"
                  >
                    📸 Instagram
                  </a>
                )}
                {merchant.socialMedia.whatsapp && (
                  <a
                    href={`https://wa.me/${merchant.socialMedia.whatsapp}`}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium"
                    target="_blank"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'reviews' && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-ink">Avaliações</h3>
            <Badge variant="outline" className="text-xs">⭐ {merchant.rating}</Badge>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Maria S.', rating: 5, comment: 'Melhor hambúrguer da região!', date: '2 dias' },
              { name: 'João O.', rating: 4, comment: 'Muito bom, entrega rápida', date: '1 sem' },
              { name: 'Ana C.', rating: 5, comment: 'Recomendo demais!', date: '2 sem' },
            ].map((review, idx) => (
              <div key={idx} className="pb-4 border-b border-brand-line last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-brand-ink">{review.name}</span>
                  <span className="text-xs text-brand-muted">{review.date}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-sm text-brand-muted mt-1">{review.comment}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4">
            Ver todas as avaliações
          </Button>
        </Card>
      )}

      {activeTab === 'photos' && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">Fotos</h3>
          <div className="grid grid-cols-2 gap-2">
            {['🍔', '🍟', '🥤', '🍕'].map((emoji, idx) => (
              <div
                key={idx}
                className="aspect-square bg-brand-soft rounded-xl flex items-center justify-center text-5xl hover:scale-105 transition-transform cursor-pointer"
              >
                {emoji}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline">
          📍 Ver no mapa
        </Button>
        <Button variant="outline">
          ⭐ Avaliar loja
        </Button>
      </div>
    </div>
  )
}