'use client'

import { Button, Card, SectionTitle } from '@/components/ui'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-6 max-w-[390px] mx-auto bg-brand-paper">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white font-extrabold text-sm">
            FX
          </div>
          <span className="font-extrabold text-brand-ink">Feirinha Express</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white border border-brand-line text-brand-muted">
            Demo
          </span>
        </div>
      </div>

      {/* Intro */}
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-brand-ink leading-tight mb-3">
          Delivery de tudo do centro comercial.
        </h1>
        <p className="text-brand-muted text-base leading-relaxed">
          Compre de várias lojas em um pedido ou veja como o lojista vende online sem cuidar da entrega.
        </p>
      </div>

      {/* Proof Grid */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <Card padding="sm" className="text-center">
          <strong className="text-xl font-extrabold">5</strong>
          <span className="block text-xs text-brand-muted mt-1">lojas demo</span>
        </Card>
        <Card padding="sm" className="text-center">
          <strong className="text-xl font-extrabold">20+</strong>
          <span className="block text-xs text-brand-muted mt-1">produtos</span>
        </Card>
        <Card padding="sm" className="text-center">
          <strong className="text-xl font-extrabold">✨</strong>
          <span className="block text-xs text-brand-muted mt-1">dark mode</span>
        </Card>
      </div>

      {/* Choice Cards */}
      <div className="space-y-3">
        <Link href="/user" className="block">
          <Card padding="md" className="hover:border-brand-red transition-colors">
            <span className="text-xs font-extrabold uppercase text-brand-red">Sou usuário</span>
            <strong className="block text-2xl font-extrabold text-brand-ink mt-2">
              Quero comprar agora
            </strong>
            <p className="text-sm text-brand-muted mt-2 leading-relaxed">
              Catálogos, serviços, carrinho, Pix, rastreio e suporte em uma experiência mobile completa.
            </p>
          </Card>
        </Link>

        <Link href="/merchant" className="block">
          <Card padding="md" className="bg-[#191514] border-0 text-white hover:bg-[#2a2520] transition-colors">
            <span className="text-xs font-extrabold uppercase text-brand-red">Sou lojista</span>
            <strong className="block text-2xl font-extrabold mt-2">
              Quero vender no app
            </strong>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Cadastro, checklist de ativação, pedidos para separar, catálogo e painel operacional.
            </p>
          </Card>
        </Link>
      </div>

      {/* Trust Band */}
      <div className="mt-8 space-y-2">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-line">
          <span className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand-red font-extrabold text-sm">
            1
          </span>
          <div>
            <strong className="text-sm">Pedido registrado</strong>
            <p className="text-xs text-brand-muted">Você acompanha tudo por status.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-line">
          <span className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand-red font-extrabold text-sm">
            2
          </span>
          <div>
            <strong className="text-sm">Pix conferido</strong>
            <p className="text-xs text-brand-muted">A loja só separa depois da confirmação.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-line">
          <span className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand-red font-extrabold text-sm">
            3
          </span>
          <div>
            <strong className="text-sm">Entrega agrupada</strong>
            <p className="text-xs text-brand-muted">Produtos de várias lojas em um fluxo único.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Já tem conta? Entrar
          </Button>
        </Link>
      </div>
    </main>
  )
}