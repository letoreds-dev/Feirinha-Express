import { cn } from '@/lib/utils'

interface StoreCardProps {
  name: string
  type: string
  eta: string
  logo: string
  description: string
  tags: string[]
  onClick?: () => void
}

export function StoreCard({ name, type, eta, logo, description, tags, onClick }: StoreCardProps) {
  return (
    <div
      className={cn(
        'p-4 bg-white rounded-card border border-brand-line shadow-card',
        'grid grid-cols-[58px_1fr] gap-3',
        onClick && 'cursor-pointer hover:scale-[1.01] transition-transform'
      )}
      onClick={onClick}
    >
      {/* Logo */}
      <div
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-orange-400 flex items-center justify-center text-white font-extrabold text-xl"
      >
        {logo}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-bold text-brand-ink">{name}</h3>
        <p className="text-sm text-brand-muted">
          {type} · {eta}
        </p>
        <p className="text-sm text-brand-muted mt-1">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-stone-100 text-brand-muted rounded-full text-xs font-extrabold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}