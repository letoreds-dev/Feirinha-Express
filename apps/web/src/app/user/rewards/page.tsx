'use client'

import GamificationPage from '@/components/ui/gamification'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">🎮 Recompensas e Gamificação</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <GamificationPage />
      </div>
    </main>
  )
}