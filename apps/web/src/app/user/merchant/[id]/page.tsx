'use client'

import { MerchantProfile } from '@/components/ui/merchant-profile'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'

export default function MerchantPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user/stores" className="text-brand-muted hover:text-brand-ink text-xl">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">🏪 Loja</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <MerchantProfile merchantId={params.id} />
      </div>
    </main>
  )
}