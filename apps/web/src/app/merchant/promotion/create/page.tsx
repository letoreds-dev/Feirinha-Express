'use client'

import { CreatePromotion } from '@/components/ui/create-promotion'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'

export default function CreatePromoPage() {
  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/merchant" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">🎁 Criar Promoção</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <CreatePromotion />
      </div>
    </main>
  )
}