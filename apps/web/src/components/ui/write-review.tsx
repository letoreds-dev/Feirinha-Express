'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface ReviewFormData {
  rating: number
  comment: string
  foodRating: number
  deliveryRating: number
  photos: File[]
}

interface ReviewProps {
  orderId?: string
  storeId?: string
  productId?: string
  onSubmit?: (data: ReviewFormData) => void
  onSkip?: () => void
}

export function WriteReview({
  orderId,
  storeId,
  productId,
  onSubmit,
  onSkip,
}: ReviewProps) {
  const [form, setForm] = useState<ReviewFormData>({
    rating: 0,
    comment: '',
    foodRating: 0,
    deliveryRating: 0,
    photos: [],
  })
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (form.rating === 0) {
      toast.error('Selecione uma nota geral')
      return
    }

    if (form.comment.length < 10) {
      toast.error('Escreva um comentário com pelo menos 10 caracteres')
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success('Avaliação enviada com sucesso!')
      onSubmit?.(form)
    } catch {
      toast.error('Erro ao enviar avaliação')
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({
    value,
    onChange,
    label,
    showHover = true,
  }: {
    value: number
    onChange: (v: number) => void
    label?: string
    showHover?: boolean
  }) => (
    <div>
      {label && <p className="text-sm font-medium text-brand-ink mb-2">{label}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => showHover && setHoveredStar(star)}
            onMouseLeave={() => showHover && setHoveredStar(0)}
            onClick={() => onChange(star)}
            className="text-3xl transition-transform hover:scale-110"
          >
            {(showHover ? hoveredStar : 0) >= star || value >= star ? (
              <span className="text-yellow-400">⭐</span>
            ) : (
              <span className="text-gray-300">☆</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">⭐ Sua avaliação</h3>

      {/* Overall rating */}
      <div className="mb-6">
        <StarRating
          value={form.rating}
          onChange={(v) => setForm(prev => ({ ...prev, rating: v }))}
          label="Nota geral"
        />
        <p className="text-sm text-brand-muted mt-2">
          {form.rating === 0 && 'Toque para avaliar'}
          {form.rating === 1 && 'Muito ruim'}
          {form.rating === 2 && 'Ruim'}
          {form.rating === 3 && 'Regular'}
          {form.rating === 4 && 'Bom'}
          {form.rating === 5 && 'Excelente!'}
        </p>
      </div>

      {/* Food rating (for store reviews) */}
      {storeId && (
        <div className="mb-4">
          <StarRating
            value={form.foodRating}
            onChange={(v) => setForm(prev => ({ ...prev, foodRating: v }))}
            label="Qualidade da comida"
          />
        </div>
      )}

      {/* Delivery rating (for order reviews) */}
      {orderId && (
        <div className="mb-4">
          <StarRating
            value={form.deliveryRating}
            onChange={(v) => setForm(prev => ({ ...prev, deliveryRating: v }))}
            label="Tempo de entrega"
          />
        </div>
      )}

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-brand-ink mb-2">
          Seu comentário
        </label>
        <textarea
          value={form.comment}
          onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Conte sua experiência..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red resize-none"
        />
        <p className="text-xs text-brand-muted text-right mt-1">
          {form.comment.length}/500
        </p>
      </div>

      {/* Quick tags */}
      <div className="mb-4">
        <p className="text-sm font-medium text-brand-ink mb-2">Tags rápidas</p>
        <div className="flex flex-wrap gap-2">
          {[
            { emoji: '👍', label: 'Recomendo' },
            { emoji: '🍔', label: 'Comida boa' },
            { emoji: '⚡', label: 'Entrega rápida' },
            { emoji: '💰', label: 'Bom custo-benefício' },
            { emoji: '👨‍🍳', label: 'Atendimento top' },
            { emoji: '😋', label: 'Vou pedir de novo' },
          ].map(tag => (
            <button
              key={tag.label}
              onClick={() => {
                const currentComment = form.comment
                const newComment = currentComment.includes(tag.emoji)
                  ? currentComment.replace(tag.emoji, '').trim()
                  : `${currentComment} ${tag.emoji}`.trim()
                setForm(prev => ({ ...prev, comment: newComment }))
              }}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                form.comment.includes(tag.emoji)
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-ink hover:bg-brand-line'
              }`}
            >
              {tag.emoji} {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photo upload placeholder */}
      <div className="mb-6">
        <p className="text-sm font-medium text-brand-ink mb-2">Adicionar fotos</p>
        <div className="flex gap-2">
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-brand-line flex items-center justify-center cursor-pointer hover:border-brand-red transition-colors">
            <span className="text-2xl">📷</span>
          </div>
          {form.photos.map((photo, idx) => (
            <div
              key={idx}
              className="w-20 h-20 rounded-xl bg-brand-soft flex items-center justify-center"
            >
              📸
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onSkip && (
          <Button variant="outline" onClick={onSkip} className="flex-1">
            Pular
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
        </Button>
      </div>
    </Card>
  )
}

// ==================== REVIEW LIST ====================

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
  photos?: string[]
  helpful: number
  storeResponse?: string
  orderId?: string
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<'all' | 'photos' | 'positive' | 'negative'>('all')
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  const filteredReviews = reviews.filter(review => {
    if (filter === 'photos') return review.photos && review.photos.length > 0
    if (filter === 'positive') return review.rating >= 4
    if (filter === 'negative') return review.rating <= 2
    return true
  })

  const toggleExpand = (id: string) => {
    setExpandedReviews(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
      : 0,
  }))

  return (
    <div className="space-y-4">
      {/* Rating summary */}
      <Card padding="md">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-brand-ink">{averageRating.toFixed(1)}</p>
            <div className="flex mt-1 justify-center">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className="text-lg">
                  {star <= Math.round(averageRating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="text-sm text-brand-muted mt-1">{reviews.length} avaliações</p>
          </div>

          <div className="flex-1 space-y-1">
            {ratingDistribution.map(dist => (
              <div key={dist.rating} className="flex items-center gap-2">
                <span className="text-xs w-3">{dist.rating}</span>
                <span>⭐</span>
                <div className="flex-1 h-2 bg-brand-soft rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-brand-muted w-8">{dist.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'photos', label: '📷 Com fotos' },
          { key: 'positive', label: '👍 Positivas' },
          { key: 'negative', label: '👎 Negativas' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <Card key={review.id} padding="md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white font-extrabold">
                {review.userName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-ink">{review.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span>{[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}</span>
                      <span className="text-xs text-brand-muted">{review.date}</span>
                    </div>
                  </div>
                  {review.orderId && (
                    <Badge variant="outline" className="text-xs">
                      Pedido #{review.orderId}
                    </Badge>
                  )}
                </div>

                <p className={`mt-3 text-brand-muted ${!expandedReviews.has(review.id) && review.comment.length > 150 ? 'line-clamp-3' : ''}`}>
                  {review.comment}
                </p>

                {review.comment.length > 150 && (
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="text-sm text-brand-red mt-1"
                  >
                    {expandedReviews.has(review.id) ? 'Mostrar menos' : 'Ver mais'}
                  </button>
                )}

                {/* Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.photos.map((photo, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-lg bg-brand-soft">
                        📷
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-brand-line">
                  <button className="text-sm text-brand-muted hover:text-brand-red flex items-center gap-1">
                    👍 Útil ({review.helpful})
                  </button>
                  <button className="text-sm text-brand-muted hover:text-brand-red">
                    🚩 Denunciar
                  </button>
                </div>

                {/* Store response */}
                {review.storeResponse && (
                  <div className="mt-3 p-3 bg-brand-soft rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🏪</span>
                      <span className="text-sm font-bold text-brand-ink">Resposta da loja</span>
                    </div>
                    <p className="text-sm text-brand-muted">{review.storeResponse}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-brand-muted">Nenhuma avaliação encontrada</p>
        </div>
      )}
    </div>
  )
}