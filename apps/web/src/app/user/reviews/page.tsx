'use client'

import { ReviewsPage, PendingReviews, WriteReviewForm, StarRatingInput } from '@/components/ui/reviews-system'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'
import { useState } from 'react'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui'

function ReviewsDemo() {
  const [showForm, setShowForm] = useState(false)

  const pendingOrders = [
    {
      orderId: '1235',
      storeName: 'Sushi Express',
      storeEmoji: '🍣',
      products: [
        { id: '1', name: 'Sashimi Combo', emoji: '🍣' },
        { id: '2', name: 'Hot Roll', emoji: '🍙' },
      ],
      date: new Date(),
    },
  ]

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <PendingReviews orders={pendingOrders} onReview={() => setShowForm(true)} />
          <ReviewsPage />
        </>
      ) : (
        <Card padding="md">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setShowForm(false)} className="text-brand-muted">
              ←
            </button>
            <h3 className="font-bold text-brand-ink">⭐ Avaliar Pedido</h3>
          </div>
          <WriteReviewForm
            orderId="1235"
            storeName="Sushi Express"
            storeEmoji="🍣"
            products={pendingOrders[0].products}
            onSubmit={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">✨ Demo: Input de Avaliação</h3>
        <StarRatingInput label="Como você avalia?" value={3} onChange={() => {}} size="lg" />
      </Card>
    </div>
  )
}

export default function Reviews() {
  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">⭐ Avaliações</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <ReviewsDemo />
      </div>
    </main>
  )
}