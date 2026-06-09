'use client'

import { DeliveryScheduler } from '@/components/ui/delivery-scheduler'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user/checkout" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">📅 Agendar</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <DeliveryScheduler />
      </div>
    </main>
  )
}