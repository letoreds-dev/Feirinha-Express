import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 space-y-3">
      <div className="flex gap-3">
        <Skeleton className="w-20 h-20 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton className="h-28 w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-1/2 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function StoreCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton className="h-24 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-brand-paper flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-brand-muted">Carregando...</p>
      </div>
    </div>
  )
}

export function PageError({ message = 'Algo deu errado', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="min-h-screen bg-brand-paper flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-brand-ink mb-2">Ops!</h2>
        <p className="text-brand-muted mb-4">{message}</p>
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-brand-red-dark transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}

export function EmptyState({
  icon = '📦',
  title = 'Nada aqui',
  message = 'Adicione itens para continuar',
  action,
}: {
  icon?: string
  title?: string
  message?: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-brand-ink mb-2">{title}</h3>
      <p className="text-brand-muted mb-6">{message}</p>
      {action}
    </div>
  )
}

export function LoadingOverlay({ show }: { show?: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )
}