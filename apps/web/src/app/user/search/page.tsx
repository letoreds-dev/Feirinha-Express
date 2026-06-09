'use client'

import { AdvancedSearch } from '@/components/ui/advanced-search'
import { NavBar } from '@/components/ui/navbar'

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink w-full text-center">🔍 Buscar</h1>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <AdvancedSearch />
      </div>
    </main>
  )
}