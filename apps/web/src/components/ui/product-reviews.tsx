'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { Star } from '@/components/ui/star-rating'

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: string
  productId: string
  helpful: number
  images?: string[]
}

interface ProductReviewsProps {
  productId: string
  reviews?: Review[]
  averageRating?: number
  totalReviews?: number
}

const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Maria Santos',
    rating: 5,
    comment: 'Produto excelente! Chegou super rápido e exatamente como na foto. Super recomendo!',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    productId: 'p1',
    helpful: 15,
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'João Oliveira',
    rating: 4,
    comment: 'Muito bom, mas achei o tamanho um pouco menor do que esperava. De qualquer forma, recomendo.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    productId: 'p1',
    helpful: 8,
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Ana Costa',
    rating: 5,
    comment: 'Melhor compra que fiz! Qualidade impecável e atendimento nota 10.',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    productId: 'p1',
    helpful: 23,
  },
]

export function ProductReviews({
  productId,
  reviews = mockReviews,
  averageRating = 4.7,
  totalReviews = 127
}: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percent: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 || 0
  }))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedReviews(newExpanded)
  }

  const handleSubmitReview = () => {
    if (selectedRating === 0) {
      alert('Selecione uma avaliação')
      return
    }
    // Submit review logic would go here
    console.log({ rating: selectedRating, comment })
    setShowReviewForm(false)
    setSelectedRating(0)
    setComment('')
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <Card padding="md">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-brand-ink">{averageRating.toFixed(1)}</p>
            <Star rating={averageRating} size="sm" />
            <p className="text-xs text-brand-muted mt-1">{totalReviews} avaliações</p>
          </div>

          <div className="flex-1 space-y-1">
            {ratingDistribution.map(({ rating, count, percent }) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`flex items-center gap-2 w-full text-sm ${filterRating === rating ? 'text-brand-red' : 'text-brand-ink'}`}
              >
                <span className="w-3">{rating}</span>
                <span>⭐</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-red rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-brand-muted w-6 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Write Review Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowReviewForm(!showReviewForm)}
      >
        ✍️ Escrever avaliação
      </Button>

      {/* Review Form */}
      {showReviewForm && (
        <Card padding="md" className="animate-fade-up">
          <h3 className="font-bold text-brand-ink mb-4">Sua avaliação</h3>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setSelectedRating(rating)}
                className="text-4xl transition-transform hover:scale-110"
              >
                {(hoverRating || selectedRating) >= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte o que você achou do produto..."
            className="w-full p-4 border border-brand-line rounded-xl text-sm resize-none focus:outline-none focus:border-brand-red"
            rows={4}
          />

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitReview} className="flex-1">
              Enviar
            </Button>
          </div>
        </Card>
      )}

      {/* Filter indicator */}
      {filterRating && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-brand-muted">Filtrando por:</span>
          <span className="px-2 py-1 bg-brand-soft rounded-full flex items-center gap-1">
            {filterRating}⭐
            <button onClick={() => setFilterRating(null)} className="ml-1">✕</button>
          </span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.map(review => (
          <Card key={review.id} padding="md">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center font-bold text-brand-red">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full rounded-full" />
                    ) : (
                      review.userName.split(' ').map(n => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-brand-ink">{review.userName}</p>
                    <div className="flex items-center gap-2">
                      <Star rating={review.rating} size="sm" />
                      <span className="text-xs text-brand-muted">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className={`text-sm text-brand-ink ${expandedReviews.has(review.id) ? '' : 'line-clamp-2'}`}>
                {review.comment}
              </p>

              {review.comment.length > 150 && (
                <button
                  onClick={() => toggleExpand(review.id)}
                  className="text-sm text-brand-red hover:underline"
                >
                  {expandedReviews.has(review.id) ? 'Mostrar menos' : 'Ler mais'}
                </button>
              )}

              {/* Helpful */}
              <div className="flex items-center gap-4 pt-2 border-t border-brand-line">
                <button className="text-xs text-brand-muted hover:text-brand-ink flex items-center gap-1">
                  👍helpful ({review.helpful})
                </button>
                <button className="text-xs text-brand-muted hover:text-brand-ink">
                  Reportar
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-2">📝</p>
          <p className="font-bold text-brand-ink">Nenhuma avaliação</p>
          <p className="text-sm text-brand-muted mt-1">
            {filterRating
              ? `Não há avaliações com ${filterRating} estrelas`
              : 'Seja o primeiro a avaliar este produto!'
            }
          </p>
        </Card>
      )}
    </div>
  )
}