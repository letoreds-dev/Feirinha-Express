'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'

// Also create a custom error page for client errors
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-brand-paper flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-brand-line px-4 py-4">
        <div className="max-w-[390px] mx-auto flex items-center justify-between">
          <span className="text-2xl">🍎</span>
          <span className="font-extrabold text-brand-ink">Feirinha Express</span>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-[390px]">
          {/* Error illustration */}
          <div className="relative mb-8">
            <div className="text-[120px] leading-none">😕</div>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-2xl">
              ❌
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-brand-ink mb-4">
            Ops! Algo deu errado
          </h1>

          {/* Description */}
          <p className="text-brand-muted mb-6">
            Desculpe, mas algo inesperado aconteceu. Tente novamente ou volte para a página inicial.
          </p>

          {/* Error code (if available) */}
          {error.digest && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-red-600 font-mono">
                Erro: {error.digest}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={reset} className="w-full py-4 text-lg">
              🔄 Tentar novamente
            </Button>

            <Link href="/user" className="block">
              <Button variant="outline" className="w-full">
                🏠 Voltar para home
              </Button>
            </Link>
          </div>

          {/* Help */}
          <div className="mt-8 pt-8 border-t border-brand-line">
            <p className="text-sm text-brand-muted mb-3">
              Precisa de ajuda?
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/user/help"
                className="flex items-center gap-2 text-brand-red hover:underline"
              >
                ❓ Central de ajuda
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
