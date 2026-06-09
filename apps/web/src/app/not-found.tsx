import Link from 'next/link'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-paper px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-extrabold text-brand-ink mb-4">
          Página não encontrada
        </h1>
        <p className="text-lg text-brand-muted mb-8">
          Ops! A página que você procura não existe ou foi movida.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button variant="primary" className="w-full">
              Voltar para Home
            </Button>
          </Link>
          <Link href="/user">
            <Button variant="outline" className="w-full">
              Explorar Produtos
            </Button>
          </Link>
        </div>
        <p className="text-sm text-brand-muted mt-8">
          Erro 404 | Feirinha Express
        </p>
      </div>
    </div>
  )
}