/**
 * Feirinha Express - Reviews & Ratings System
 * Complete review flow with photos and responses
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

// ==================== TYPES ====================

interface Review {
  id: string
  orderId: string
  storeId: string
  storeName: string
  storeEmoji: string
  productName: string
  productEmoji: string
  rating: number
  comment: string
  photos: string[]
  date: Date
  helpful: number
  response?: {
    text: string
    date: Date
  }
  orderRating?: number
  deliveryRating?: number
}

interface ReviewStats {
  average: number
  total: number
  distribution: { stars: number; count: number; percentage: number }[]
}

// ==================== STAR RATING INPUT ====================

interface StarRatingInputProps {
  value: number
  onChange: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function StarRatingInput({ value, onChange, size = 'md', label }: StarRatingInputProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-brand-ink">{label}</label>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`${sizes[size]} transition-transform hover:scale-110`}
          >
            {star <= value ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      <p className="text-sm text-brand-muted">
        {value === 5 ? 'Excelente!' :
         value === 4 ? 'Muito bom!' :
         value === 3 ? 'Bom' :
         value === 2 ? 'Regular' :
         value === 1 ? 'Ruim' : 'Toque para avaliar'}
      </p>
    </div>
  )
}

// ==================== STAR RATING DISPLAY ====================

interface StarRatingDisplayProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}

export function StarRatingDisplay({ value, size = 'md', showNumber = true }: StarRatingDisplayProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className={`flex items-center gap-1 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= Math.round(value) ? 'text-yellow-400' : 'text-gray-300'}>
          {star <= Math.round(value) ? '★' : '☆'}
        </span>
      ))}
      {showNumber && (
        <span className="ml-1 font-medium">{value.toFixed(1)}</span>
      )}
    </div>
  )
}

// ==================== REVIEW STATS ====================

interface ReviewStatsCardProps {
  stats: ReviewStats
}

export function ReviewStatsCard({ stats }: ReviewStatsCardProps) {
  return (
    <Card padding="md" className="bg-gradient-to-br from-brand-soft to-white">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-extrabold text-brand-ink">{stats.average.toFixed(1)}</p>
          <StarRatingDisplay value={stats.average} size="lg" showNumber={false} />
          <p className="text-sm text-brand-muted mt-1">{stats.total} avaliações</p>
        </div>

        <div className="flex-1 space-y-1">
          {stats.distribution.map(item => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="text-xs text-brand-muted w-6">{item.stars}★</span>
              <div className="flex-1 h-2 bg-brand-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs text-brand-muted w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ==================== REVIEW CARD ====================

interface ReviewCardProps {
  review: Review
  onHelpful?: () => void
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Card padding="md">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
          {review.productEmoji}
        </div>
        <div className="flex-1">
          <p className="font-bold text-brand-ink">{review.productName}</p>
          <p className="text-sm text-brand-muted">
            {review.storeEmoji} {review.storeName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <StarRatingDisplay value={review.rating} size="sm" />
            <span className="text-xs text-brand-muted">•</span>
            <span className="text-xs text-brand-muted">{formatDate(review.date)}</span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <p className="mt-4 text-sm text-brand-ink">{review.comment}</p>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {review.photos.map((photo, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-lg bg-brand-soft flex-shrink-0 flex items-center justify-center"
            >
              <span className="text-2xl">📷</span>
            </div>
          ))}
        </div>
      )}

      {/* Delivery rating if available */}
      {review.deliveryRating && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-line">
          <span className="text-sm text-brand-muted">🚚 Entrega:</span>
          <StarRatingDisplay value={review.deliveryRating} size="sm" />
        </div>
      )}

      {/* Response */}
      {review.response && (
        <div className="mt-3 p-3 bg-emerald-50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🏪</span>
            <span className="text-sm font-medium text-emerald-800">Resposta da loja</span>
          </div>
          <p className="text-sm text-emerald-700">{review.response.text}</p>
          <p className="text-xs text-emerald-600 mt-1">{formatDate(review.response.date)}</p>
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-line">
        <button
          onClick={onHelpful}
          className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-red"
        >
          👍 Útil ({review.helpful})
        </button>
        <button className="text-sm text-brand-muted hover:text-brand-red">
          ⚠️ Reportar
        </button>
      </div>
    </Card>
  )
}

// ==================== WRITE REVIEW FORM ====================

interface WriteReviewFormProps {
  orderId: string
  storeName: string
  storeEmoji: string
  products: { id: string; name: string; emoji: string }[]
  onSubmit: (review: Omit<Review, 'id' | 'orderId' | 'storeId' | 'storeName' | 'storeEmoji' | 'productName' | 'productEmoji' | 'date' | 'helpful'>) => void
  onCancel: () => void
}

export function WriteReviewForm({ orderId, storeName, storeEmoji, products, onSubmit, onCancel }: WriteReviewFormProps) {
  const [productId, setProductId] = useState(products[0]?.id || '')
  const [overallRating, setOverallRating] = useState(0)
  const [deliveryRating, setDeliveryRating] = useState(0)
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [anonymous, setAnonymous] = useState(false)

  const selectedProduct = products.find(p => p.id === productId)

  const handleSubmit = () => {
    if (overallRating === 0) {
      alert('Por favor, selecione uma nota')
      return
    }

    onSubmit({
      rating: overallRating,
      comment,
      photos,
      orderRating: overallRating,
      deliveryRating: deliveryRating || undefined,
      response: undefined,
    })
  }

  return (
    <div className="space-y-6">
      {/* Product selector */}
      {products.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-2">Avaliar produto</label>
          <div className="grid grid-cols-2 gap-2">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => setProductId(product.id)}
                className={`p-3 rounded-xl text-left ${
                  productId === product.id
                    ? 'bg-brand-red text-white'
                    : 'bg-brand-soft'
                }`}
              >
                <span className="text-xl">{product.emoji}</span>
                <p className="text-xs mt-1 truncate">{product.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overall rating */}
      <StarRatingInput
        label="Sua avaliação"
        value={overallRating}
        onChange={setOverallRating}
        size="lg"
      />

      {/* Delivery rating */}
      <StarRatingInput
        label="Avaliação da entrega (opcional)"
        value={deliveryRating}
        onChange={setDeliveryRating}
        size="md"
      />

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-2">
          O que você achou? (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte sua experiência..."
          className="w-full px-4 py-3 bg-brand-soft rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-red"
          rows={4}
        />
        <p className="text-xs text-brand-muted mt-1 text-right">
          {comment.length}/500 caracteres
        </p>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-2">
          Adicionar fotos (opcional)
        </label>
        <div className="flex gap-2">
          <button className="w-20 h-20 rounded-xl border-2 border-dashed border-brand-line flex items-center justify-center text-brand-muted hover:border-brand-red hover:text-brand-red">
            <span className="text-2xl">📷</span>
          </button>
          {photos.map((_, index) => (
            <div key={index} className="w-20 h-20 rounded-xl bg-brand-soft flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
          ))}
        </div>
      </div>

      {/* Anonymous option */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="w-5 h-5 rounded accent-brand-red"
        />
        <span className="text-sm text-brand-ink">Avaliar como anônimo</span>
      </label>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="flex-1">
          Enviar Avaliação
        </Button>
      </div>
    </div>
  )
}

// ==================== REVIEWS LIST ====================

interface ReviewsListProps {
  reviews: Review[]
  stats: ReviewStats
  onLoadMore?: () => void
  hasMore?: boolean
}

export function ReviewsList({ reviews, stats, onLoadMore, hasMore }: ReviewsListProps) {
  return (
    <div className="space-y-4">
      <ReviewStatsCard stats={stats} />

      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {hasMore && (
        <Button variant="outline" onClick={onLoadMore} className="w-full">
          Carregar mais avaliações
        </Button>
      )}
    </div>
  )
}

// ==================== PENDING REVIEWS ====================

interface PendingReviewsProps {
  orders: {
    orderId: string
    storeName: string
    storeEmoji: string
    products: { id: string; name: string; emoji: string }[]
    date: Date
  }[]
  onReview: (orderId: string) => void
}

export function PendingReviews({ orders, onReview }: PendingReviewsProps) {
  if (orders.length === 0) return null

  return (
    <Card padding="md" className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="font-bold text-brand-ink">Avalie seus pedidos</p>
          <p className="text-sm text-brand-muted">
            Você tem {orders.length} pedido(s) para avaliar
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {orders.map(order => (
          <div key={order.orderId} className="flex items-center justify-between py-2 border-b border-yellow-200 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{order.storeEmoji}</span>
              <div>
                <p className="font-medium text-brand-ink">{order.storeName}</p>
                <p className="text-xs text-brand-muted">
                  {order.products.map(p => p.emoji).join(' ')}
                </p>
              </div>
            </div>
            <Button size="sm" variant="primary" onClick={() => onReview(order.orderId)}>
              Avaliar
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ==================== FULL REVIEWS PAGE ====================

export function ReviewsPage() {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      orderId: '1234',
      storeId: 's1',
      storeName: 'Burguer House',
      storeEmoji: '🍔',
      productName: 'X-Burger Especial',
      productEmoji: '🍔',
      rating: 5,
      comment: 'Melhor burger da região! Carne super suculenta e o molho especial é incrível. Recomendo demais!',
      photos: [],
      date: new Date(),
      helpful: 15,
      response: {
        text: 'Obrigado pela avaliação! Ficamos muito felizes! 🍔',
        date: new Date(),
      },
      deliveryRating: 5,
    },
    {
      id: '2',
      orderId: '1233',
      storeId: 's2',
      storeName: 'Pizza Express',
      storeEmoji: '🍕',
      productName: 'Pizza Margherita',
      productEmoji: '🍕',
      rating: 4,
      comment: 'Pizza boa, mas demorou um pouco mais que o esperado. Sabor excelente!',
      photos: [],
      date: new Date(Date.now() - 86400000),
      helpful: 8,
    },
    {
      id: '3',
      orderId: '1230',
      storeId: 's3',
      storeName: 'Açaí Paradise',
      storeEmoji: '🧊',
      productName: 'Açaí 500ml',
      productEmoji: '🧊',
      rating: 5,
      comment: 'Açaí top demais! cremoso e na medida certa',
      photos: [],
      date: new Date(Date.now() - 172800000),
      helpful: 23,
    },
  ])

  const stats: ReviewStats = {
    average: 4.7,
    total: reviews.length,
    distribution: [
      { stars: 5, count: reviews.filter(r => r.rating === 5).length, percentage: 67 },
      { stars: 4, count: reviews.filter(r => r.rating === 4).length, percentage: 33 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ],
  }

  return (
    <div className="space-y-4">
      <ReviewsList reviews={reviews} stats={stats} />
    </div>
  )
}