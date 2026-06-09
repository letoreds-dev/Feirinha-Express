'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
  productName?: string
  photos?: string[]
  storeReply?: string
  helpful: number
}

const reviews: Review[] = [
  {
    id: '1',
    userName: 'Maria S.',
    rating: 5,
    comment: 'Hambúrguer incredible! A carne é超级 suculenta e o pão é bem assado. Recomendo demais! 🍔',
    date: '2 dias',
    productName: 'Hambúrguer Artesanal',
    helpful: 24,
  },
  {
    id: '2',
    userName: 'João O.',
    rating: 4,
    comment: 'Muito bom, chegou rápido e bem embalado. Só achei que poderia ter mais bacon.',
    date: '1 semana',
    helpful: 12,
    storeReply: 'Obrigado pelo feedback! Vamos considerar adicionar mais bacon no próximo update! 😊',
  },
  {
    id: '3',
    userName: 'Ana C.',
    rating: 5,
    comment: 'Melhor hambúrguer da região! Vou pedir toda semana.',
    date: '2 semanas',
    photos: ['🍔', '🍟', '🥤'],
    helpful: 45,
  },
]

export function ReviewSection({ productId }: { productId?: string }) {
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showAddReview, setShowAddReview] = useState(false)

  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)

  const markHelpful = (reviewId: string) => {
    toast.success('Obrigado pelo feedback!')
  }

  return (
    <div className="space-y-4">
      {/* Rating summary */}
      <Card padding="md">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-brand-ink">{averageRating}</p>
            <div className="flex gap-0.5 justify-center mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={star <= Math.round(parseFloat(averageRating)) ? 'text-yellow-400' : 'text-gray-300'}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-xs text-brand-muted mt-1">{reviews.length} avaliações</p>
          </div>

          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.rating === rating).length
              const percentage = (count / reviews.length) * 100
              return (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`flex items-center gap-2 w-full text-sm ${filterRating === rating ? 'text-brand-red' : 'text-brand-ink'}`}
                >
                  <span className="w-4">{rating}</span>
                  <span className="text-yellow-400">⭐</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs text-brand-muted w-6">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterRating(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filterRating === null ? 'bg-brand-red text-white' : 'bg-white border border-brand-line text-brand-ink'
          }`}
        >
          Todos
        </button>
        {[5, 4, 3, 2, 1].map(rating => (
          <button
            key={rating}
            onClick={() => setFilterRating(filterRating === rating ? null : rating)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterRating === rating ? 'bg-brand-red text-white' : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            {rating} ⭐
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <Card key={review.id} padding="md">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-lg font-extrabold text-brand-ink">
                {review.userName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-brand-ink">{review.userName}</p>
                  <span className="text-xs text-brand-muted">{review.date}</span>
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ⭐
                    </span>
                  ))}
                </div>
                {review.productName && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {review.productName}
                  </Badge>
                )}
              </div>
            </div>

            {/* Photos */}
            {review.photos && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {review.photos.map((photo, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-xl bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
                    {photo}
                  </div>
                ))}
              </div>
            )}

            {/* Comment */}
            <p className="mt-3 text-brand-ink">{review.comment}</p>

            {/* Store reply */}
            {review.storeReply && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">🏪</span>
                  <span className="text-sm font-bold text-blue-700">Resposta da loja</span>
                </div>
                <p className="text-sm text-blue-800">{review.storeReply}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-line">
              <button
                onClick={() => markHelpful(review.id)}
                className="flex items-center gap-1 text-sm text-brand-muted hover:text-brand-red transition-colors"
              >
                👍 Achei útil ({review.helpful})
              </button>
              <button className="text-sm text-brand-muted hover:text-brand-red">
                🚩 Denunciar
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add review button */}
      <Button variant="outline" onClick={() => setShowAddReview(true)} className="w-full">
        ✍️ Escrever avaliação
      </Button>

      {/* Add review form (simplified) */}
      {showAddReview && (
        <Card padding="md" className="animate-fade-up">
          <h3 className="font-bold text-brand-ink mb-4">Sua avaliação</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Sua nota</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} className="text-3xl text-gray-300 hover:text-yellow-400 transition-colors">
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Seu comentário</label>
              <textarea
                placeholder="Conte sua experiência..."
                rows={4}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddReview(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={() => {
                toast.success('Avaliação enviada!')
                setShowAddReview(false)
              }} className="flex-1">
                Enviar
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}