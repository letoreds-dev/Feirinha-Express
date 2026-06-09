'use client'

import { ProductCatalogView } from '@/components/ui/product-catalog-view'
import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import Link from 'next/link'

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-brand-paper pb-24">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user/stores/1" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">📖 Cardápio</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <ProductCatalogView />
      </div>

      <BottomNav />
    </main>
  )
}