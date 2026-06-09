'use client'

import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'

export default function OfflineDemoPage() {
  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">📡 Sistema Offline</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <h2 className="text-xl font-bold text-brand-ink mb-4">Demonstração Offline</h2>
        <p className="text-brand-muted">O sistema offline está funcionando corretamente.</p>
      </div>
    </main>
  )
}
