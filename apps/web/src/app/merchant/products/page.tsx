'use client'

import { MerchantProductManager } from '@/components/ui/merchant-products'
import { NavBar } from '@/components/ui/navbar'

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink w-full text-center">📦 Produtos</h1>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <MerchantProductManager />
      </div>
    </main>
  )
}