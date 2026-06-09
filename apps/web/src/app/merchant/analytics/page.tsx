'use client'

import { MerchantAnalytics } from '@/components/ui/merchant-analytics'
import { NavBar } from '@/components/ui/navbar'

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink w-full text-center">📊 Analytics</h1>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <MerchantAnalytics />
      </div>
    </main>
  )
}