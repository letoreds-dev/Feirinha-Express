'use client'

import { ProductCatalog } from '@/components/ui/product-catalog'
import { MerchantProfile } from '@/components/ui/merchant-profile'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'
import { useState } from 'react'

export default function MerchantCatalogPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'about'>('catalog')

  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user/stores" className="text-brand-muted hover:text-brand-ink text-xl">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">🍔 Burguer House</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        {/* Tab switch */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              activeTab === 'catalog'
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            📋 Cardápio
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              activeTab === 'about'
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            ℹ️ Sobre
          </button>
        </div>

        {activeTab === 'catalog' ? (
          <ProductCatalog merchantId={params.id} />
        ) : (
          <MerchantProfile merchantId={params.id} />
        )}
      </div>
    </main>
  )
}