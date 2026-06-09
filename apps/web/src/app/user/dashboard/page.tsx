'use client'

import { UserDashboard } from '@/components/ui/user-dashboard'
import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-brand-paper pb-24">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink w-full text-center">👤 Minha Conta</h1>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <UserDashboard />
      </div>

      <BottomNav />
    </main>
  )
}