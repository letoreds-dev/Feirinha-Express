'use client'

import { WriteReview, ReviewList } from '@/components/ui/write-review'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'

const mockReviews = [
  {
    id: '1',
    userName: 'Maria Silva',
    rating: 5,
    comment: 'Incrível! A comida chegou quentinha e o sabor estava perfeito. Já é a terceira vez que peço e sempre supera as expectativas. Recomendo muito!',
    date: '2 dias atrás',
    helpful: 15,
    storeResponse: 'Obrigado, Maria! Ficamos muito felizes com sua avaliação! 🎉',
    orderId: 'FE-1234',
  },
  {
    id: '2',
    userName: 'João Santos',
    rating: 4,
    comment: 'Muito bom, mas demorou um pouco mais que o esperado.',
    date: '1 semana atrás',
    helpful: 8,
  },
  {
    id: '3',
    userName: 'Ana Costa',
    rating: 5,
    comment: 'Melhor hambúrguer da região!',
    date: '2 semanas atrás',
    helpful: 23,
    photos: ['photo1', 'photo2'],
  },
  {
    id: '4',
    userName: 'Pedro Oliveira',
    rating: 3,
    comment: 'Regular. Esperava mais pelo preço.',
    date: '3 semanas atrás',
    helpful: 5,
  },
]

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user/orders" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">⭐ Avaliações</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto space-y-6">
        <WriteReview
          storeId="1"
          orderId="FE-1234"
          onSubmit={(data) => console.log('Review submitted:', data)}
          onSkip={() => console.log('Skipped')}
        />

        <ReviewList reviews={mockReviews} />
      </div>
    </main>
  )
}