'use client'

import { useState, useEffect } from 'react'
import { Card } from './card'
import { Button } from './button'

interface Review {
  id: string
  userId: string
  user: { name: string; avatar?: string }
  rating: number
  comment?: string
  photos?: string[]
  foodRating?: number
  deliveryRating?: number
  isAnonymous: boolean
  isVerified: boolean
  helpfulCount: number
  createdAt: string
}

interface ReviewCardProps {
  review: Review
  onHelpful?: (id: string) => void
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = useState(false)

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'text-sm' : 'text-lg'
    return (
      <div className={`flex ${sizeClass}`}>
        {[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <Card padding="md" className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-lg">
            {review.isAnonymous ? '👤' : (review.user.avatar || '😀')}
          </div>
          <div>
            <p className="font-medium text-brand-ink">
              {review.isAnonymous ? 'Anônimo' : review.user.name}
            </p>
            <p className="text-xs text-brand-muted">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        {review.isVerified && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            ✓ Verificado
          </span>
        )}
      </div>

      {/* Ratings */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-muted">Geral:</span>
          {renderStars(review.rating)}
        </div>
        {review.foodRating && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-muted">Comida:</span>
            {renderStars(review.foodRating)}
          </div>
        )}
        {review.deliveryRating && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-muted">Entrega:</span>
            {renderStars(review.deliveryRating)}
          </div>
        )}
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-brand-ink leading-relaxed">{review.comment}</p>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {review.photos.map((photo, idx) => (
            <img
              key={idx}
              src={photo}
              alt={`Foto ${idx + 1}`}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center gap-2 pt-2 border-t border-brand-line">
        <button
          onClick={() => {
            if (!isHelpful) {
              setIsHelpful(true)
              onHelpful?.(review.id)
            }
          }}
          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full transition-colors ${
            isHelpful
              ? 'bg-brand-red text-white'
              : 'bg-brand-soft text-brand-ink hover:bg-brand-line'
          }`}
        >
          <span>👍</span>
          <span>Útil ({review.helpfulCount + (isHelpful ? 1 : 0)})</span>
        </button>
      </div>
    </Card>
  )
}

// ==================== REVIEW FORM ====================

interface ReviewFormProps {
  orderId: string
  merchantId: string
  merchantName: string
  productId?: string
  productName?: string
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export function ReviewForm({
  orderId,
  merchantId,
  merchantName,
  productId,
  productName,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [foodRating, setFoodRating] = useState(0)
  const [deliveryRating, setDeliveryRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setIsSubmitting(true)
    try {
      await onSubmit({
        orderId,
        merchantId,
        productId,
        rating,
        foodRating: foodRating || undefined,
        deliveryRating: deliveryRating || undefined,
        comment,
        isAnonymous,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="space-y-2">
      <p className="text-sm font-medium text-brand-ink">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
<button
            key={star}
            onClick={() => onChange(star)}
            className={`text-3xl transition-transform hover:scale-110 ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <Card padding="lg" className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-brand-ink">Avaliar Pedido</h3>
        <p className="text-sm text-brand-muted">
          {productName ? `Avaliando ${productName}` : `Avaliando ${merchantName}`}
        </p>
      </div>

      <StarRating value={rating} onChange={setRating} label="Sua avaliação geral *" />
      <StarRating value={foodRating} onChange={setFoodRating} label="Qualidade da comida" />
      <StarRating value={deliveryRating} onChange={setDeliveryRating} label="Velocidade da entrega" />

      <div className="space-y-2">
        <label className="text-sm font-medium text-brand-ink">Seu comentário (opcional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="O que você achou do pedido?"
          className="w-full px-4 py-3 bg-brand-soft rounded-xl border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-red resize-none"
          rows={4}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-5 h-5 rounded border-brand-line text-brand-red focus:ring-brand-red"
        />
        <span className="text-sm text-brand-ink">Enviar avaliação como anônimo</span>
      </label>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
        </Button>
      </div>
    </Card>
  )
}

// ==================== REVIEW LIST ====================

interface ReviewListProps {
  reviews: Review[]
  stats?: {
    _avg: { rating: number; foodRating?: number; deliveryRating?: number }
    _count: number
  }
  onHelpful?: (id: string) => void
}

export function ReviewList({ reviews, stats, onHelpful }: ReviewListProps) {
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all')
  const [sort, setSort] = useState<'recent' | 'rating' | 'helpful'>('recent')

  const filteredReviews = reviews
    .filter((r) => {
      if (filter === 'all') return true
      return r.rating === parseInt(filter)
    })
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'helpful') return b.helpfulCount - a.helpfulCount
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      {stats && (
        <Card padding="md" className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-brand-ink">
                {(stats._avg.rating || 0).toFixed(1)}
              </p>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`text-sm ${
                      s <= Math.round(stats._avg.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xs text-brand-muted mt-1">{stats._count} avaliações</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['5', '4', '3', '2', '1'].map((star) => {
              const count = reviews.filter((r) => r.rating === parseInt(star)).length
              const percent = stats._count > 0 ? (count / stats._count) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-1">
                  <span className="text-xs text-brand-muted">{star}★</span>
                  <div className="w-12 h-2 bg-brand-soft rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', '5', '4', '3', '2', '1'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-brand-red text-white'
                : 'bg-brand-soft text-brand-ink hover:bg-brand-line'
            }`}
          >
            {f === 'all' ? 'Todas' : `${f} estrelas`}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2">
        {(['recent', 'rating', 'helpful'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              sort === s
                ? 'bg-brand-red text-white'
                : 'bg-brand-soft text-brand-muted hover:bg-brand-line'
            }`}
          >
            {s === 'recent' ? 'Mais recentes' : s === 'rating' ? 'Melhor avaliadas' : 'Mais úteis'}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} onHelpful={onHelpful} />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-brand-muted">Nenhuma avaliação ainda</p>
        </div>
      )}
    </div>
  )
}
