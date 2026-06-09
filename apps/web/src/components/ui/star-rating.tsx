'use client'

import { useState } from 'react'

interface StarRatingProps {
  rating: number
  totalReviews?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function Star({
  rating,
  totalReviews,
  size = 'md',
  interactive = false,
  onChange
}: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(rating)

  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  const stars = Array.from({ length: 5 }, (_, i) => {
    const position = i + 1
    const isActive = (hover || selected) >= position
    const isHalf = !isActive && (hover || selected) >= position - 0.5

    return (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => {
          if (interactive && onChange) {
            setSelected(position)
            onChange(position)
          }
        }}
        onMouseEnter={() => interactive && setHover(position)}
        onMouseLeave={() => interactive && setHover(0)}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform ${sizes[size]}`}
        aria-label={`${position} estrelas`}
      >
        {isActive ? '⭐' : isHalf ? '✨' : '☆'}
      </button>
    )
  })

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {rating > 0 && (
        <span className="text-xs text-brand-muted ml-1">
          {rating.toFixed(1)}
          {totalReviews !== undefined && ` (${totalReviews})`}
        </span>
      )}
    </div>
  )
}