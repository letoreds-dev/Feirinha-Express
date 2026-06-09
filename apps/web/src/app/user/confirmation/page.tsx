'use client'

import { OrderConfirmation } from '@/components/ui/order-confirmation'

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-brand-paper">
      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <OrderConfirmation />
      </div>
    </main>
  )
}