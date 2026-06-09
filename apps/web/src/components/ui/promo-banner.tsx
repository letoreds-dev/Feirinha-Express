'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'

interface PromoBanner {
  id: string
  type: 'promo' | 'flash' | 'new' | 'seasonal'
  title: string
  subtitle: string
  cta: string
  link: string
  bgColor: string
  textColor: string
  icon: string
  expiresAt?: string
}

const promoBanners: PromoBanner[] = [
  {
    id: '1',
    type: 'flash',
    title: '⚡ Oferta Flash',
    subtitle: 'Frete grátis em pedidos acima de R$40!',
    cta: 'Aproveitar',
    link: '/user/stores',
    bgColor: 'from-orange-500 to-red-500',
    textColor: 'text-white',
    icon: '🚚',
    expiresAt: new Date(Date.now() + 3 * 3600000).toISOString(),
  },
  {
    id: '2',
    type: 'promo',
    title: '🎉 Sexta-feira de deals!',
    subtitle: 'Até 30% off em lanches',
    cta: 'Ver ofertas',
    link: '/user/stores',
    bgColor: 'from-purple-500 to-pink-500',
    textColor: 'text-white',
    icon: '🏷️',
  },
  {
    id: '3',
    type: 'new',
    title: '🆕 Novas lojas',
    subtitle: 'Confira as novidades da semana',
    cta: 'Explorar',
    link: '/user/stores',
    bgColor: 'from-emerald-500 to-teal-500',
    textColor: 'text-white',
    icon: '✨',
  },
]

export function PromoBannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % promoBanners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const banner = promoBanners[currentBanner]

  return (
    <div className="space-y-2">
      <Link href={banner.link}>
        <div
          className={`bg-gradient-to-r ${banner.bgColor} ${banner.textColor} rounded-2xl p-4 transition-all duration-500`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{banner.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  {banner.type === 'flash' && '⏱️ Flash'}
                  {banner.type === 'promo' && '🔥 Promo'}
                  {banner.type === 'new' && '🆕 Novo'}
                  {banner.type === 'seasonal' && '🌟 Sazonal'}
                </span>
              </div>
              <h3 className="text-lg font-extrabold">{banner.title}</h3>
              <p className="text-sm opacity-90">{banner.subtitle}</p>
              {banner.expiresAt && (
                <p className="text-xs opacity-70 mt-1">
                  ⏰ Expira em {formatTimeRemaining(banner.expiresAt)}
                </p>
              )}
            </div>
            <div className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-bold hover:bg-opacity-30 transition-colors">
              {banner.cta} →
            </div>
          </div>
        </div>
      </Link>

      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {promoBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentBanner(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentBanner
                ? 'w-6 bg-brand-red'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function formatTimeRemaining(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} min`
}

// Static banner version
export function PromoBanner({ banner }: { banner: PromoBanner }) {
  return (
    <Link href={banner.link}>
      <div className={`bg-gradient-to-r ${banner.bgColor} ${banner.textColor} rounded-2xl p-4 hover:scale-[1.02] transition-transform`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{banner.icon}</span>
            <div>
              <h3 className="font-extrabold">{banner.title}</h3>
              <p className="text-sm opacity-90">{banner.subtitle}</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-white bg-opacity-20 rounded-full text-sm font-bold">
            {banner.cta} →
          </span>
        </div>
      </div>
    </Link>
  )
}