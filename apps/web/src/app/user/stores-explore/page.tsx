'use client'

import { StoreDiscovery, NearbyStoresMap } from '@/components/ui/store-discovery'
import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'

export default function StoresPage() {
  return (
    <main className="min-h-screen bg-brand-paper pb-24">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">🏪 Explorar Lojas</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto space-y-6">
        <StoreDiscovery />
      </div>

      <BottomNav />
    </main>
  )
}