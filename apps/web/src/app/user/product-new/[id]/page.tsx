'use client'

import { ProductGallery } from '@/components/ui/product-gallery'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user/merchant/1" className="text-brand-muted hover:text-brand-ink text-xl">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">🍔 Produto</h1>
          <button className="text-2xl">❤️</button>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <ProductGallery />
      </div>
    </main>
  )
}