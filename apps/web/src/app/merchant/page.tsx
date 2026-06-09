'use client'

import { useState } from 'react'
import { Button, Card, NavBar, SectionTitle, Input, ProductCard, Badge } from '@/components/ui'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import Link from 'next/link'

// Mock data
const mockProducts: Product[] = [
  { id: '1', merchantId: '1', title: 'Camisa Brasil retrô', description: 'Modelo torcedor, tecido leve.', price: 129.9, thumb: 'Camisa', active: true },
  { id: '2', merchantId: '1', title: 'Boné Corinthians preto', description: 'Ajustável, aba curva.', price: 59.9, thumb: 'Boné', active: true },
  { id: '3', merchantId: '1', title: 'Bandeira Palmeiras', description: 'Tamanho médio.', price: 44.9, thumb: 'Bandeira', active: true },
  { id: '4', merchantId: '1', title: 'Chaveiro São Paulo', description: 'Metal emborrachado.', price: 19.9, thumb: 'Chaveiro', active: true },
]

const mockOrders = [
  { id: 'FX-1029', items: 'Capinha + fone Bluetooth', status: 'Novo' },
  { id: 'FX-1030', items: 'Camisa Brasil retrô', status: 'Separando' },
  { id: 'FX-1031', items: 'Blindagem de tela', status: 'Agendado' },
]

export default function MerchantPage() {
  const [storeName, setStoreName] = useState('Fanaticos FC')
  const [storeType, setStoreType] = useState('Artigos de time')
  const [description, setDescription] = useState('Camisas, bonés, controles, carregadores, jogos e serviços de reparo.')
  const [isOpen, setIsOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success('Cadastro enviado!', 'Sua loja está em análise')
      setLoading(false)
    }, 1500)
  }

  const checklist = [
    { label: 'Cadastro validado', done: true },
    { label: '10 produtos no catálogo', done: false },
    { label: 'Tempo de separação informado', done: true },
    { label: 'Responsável e WhatsApp confirmados', done: true },
  ]

  const stats = {
    orders: 18,
    products: '8/10',
    avgTime: '14m',
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-8">
      <NavBar>
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white font-extrabold text-sm">
              FX
            </div>
            <span className="font-extrabold text-sm text-brand-ink">Painel do lojista</span>
          </div>
          <Link href="/user" className="text-sm text-brand-red font-medium hover:underline">
            Cliente
          </Link>
        </div>
      </NavBar>

      <main className="px-4 py-4 max-w-[390px] mx-auto space-y-6">
        {/* Hero */}
        <Card padding="md" className="bg-[#191514] text-white">
          <span className="text-xs font-extrabold uppercase text-brand-red">Demo lojista</span>
          <h1 className="text-3xl font-extrabold mt-2 leading-tight">
            Venda online sem montar entrega própria.
          </h1>
          <p className="text-gray-300 mt-2">
            Cadastre produtos, receba pedidos, separe a sacola e entregue ao hub.
          </p>
        </Card>

        {/* Store Status Toggle */}
        <Card padding="md" className={isOpen ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`font-bold ${isOpen ? 'text-emerald-700' : 'text-red-700'}`}>
                {isOpen ? '🟢 Loja Aberta' : '🔴 Loja Fechada'}
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(!isOpen)
                toast.success(isOpen ? 'Loja fechada' : 'Loja aberta')
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                isOpen
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isOpen ? 'Fechar' : 'Abrir'}
            </button>
          </div>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <Card padding="sm" className="text-center">
            <span className="text-xs text-brand-muted">Pedidos</span>
            <strong className="text-2xl font-extrabold">{stats.orders}</strong>
            <span className="text-xs text-brand-muted">hoje</span>
          </Card>
          <Card padding="sm" className="text-center">
            <span className="text-xs text-brand-muted">Catálogo</span>
            <strong className="text-2xl font-extrabold">{stats.products}</strong>
            <span className="text-xs text-brand-muted">quase ativo</span>
          </Card>
          <Card padding="sm" className="text-center">
            <span className="text-xs text-brand-muted">Separação</span>
            <strong className="text-2xl font-extrabold">{stats.avgTime}</strong>
            <span className="text-xs text-brand-muted">média</span>
          </Card>
        </div>

        {/* Registration Form */}
        <Card padding="md">
          <SectionTitle eyebrow="Cadastro rápido" title="Entrar como lojista" />
          <div className="space-y-3">
            <Input
              label="Nome da loja ou box"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Nome da loja"
            />
            <div>
              <label className="block text-sm font-bold text-brand-ink mb-1">Categoria</label>
              <select
                value={storeType}
                onChange={(e) => setStoreType(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-brand-line bg-white"
              >
                <option>Artigos de time</option>
                <option>Acessórios de celular</option>
                <option>Eletrônicos e periféricos</option>
                <option>Games e videogames</option>
                <option>Assistência técnica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-ink mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-brand-line bg-white resize-none"
                placeholder="Descreva seus produtos e serviços"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSubmit}
              loading={loading}
            >
              Enviar para validação
            </Button>
          </div>
        </Card>

        {/* Checklist */}
        <div>
          <SectionTitle eyebrow="Checklist" title="Pronto para vender?" />
          <div className="space-y-2">
            {checklist.map((check, index) => (
              <Card key={index} padding="sm">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    check.done ? 'bg-emerald-100 text-brand-green' : 'bg-brand-soft text-brand-red'
                  }`}>
                    {check.done ? '✓' : '!'}
                  </span>
                  <span className="text-sm font-bold">{check.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div>
          <SectionTitle eyebrow="Pedidos recebidos" title="Rotina de separação" />
          <div className="space-y-2">
            {mockOrders.map((order) => (
              <Card key={order.id} padding="sm">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="font-extrabold text-brand-ink">{order.id}</strong>
                    <p className="text-xs text-brand-muted">{order.items}</p>
                  </div>
                  <Badge variant={order.status === 'Separando' ? 'info' : 'warning'}>
                    {order.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <SectionTitle eyebrow="Catálogo demo" title="Produtos que o lojista gerencia" />
          <div className="space-y-3">
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                description={product.description || ''}
                price={product.price}
                thumb={product.thumb}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/merchant/dashboard" className="block">
            <Card padding="md" className="text-center hover:bg-brand-soft transition-colors cursor-pointer">
              <span className="text-3xl block mb-2">📊</span>
              <p className="font-bold text-brand-ink">Dashboard</p>
            </Card>
          </Link>
          <Link href="/merchant/products" className="block">
            <Card padding="md" className="text-center hover:bg-brand-soft transition-colors cursor-pointer">
              <span className="text-3xl block mb-2">📦</span>
              <p className="font-bold text-brand-ink">Produtos</p>
            </Card>
          </Link>
          <Link href="/merchant/analytics" className="block">
            <Card padding="md" className="text-center hover:bg-brand-soft transition-colors cursor-pointer">
              <span className="text-3xl block mb-2">📈</span>
              <p className="font-bold text-brand-ink">Analytics</p>
            </Card>
          </Link>
          <Link href="/merchant/promotion" className="block">
            <Card padding="md" className="text-center hover:bg-brand-soft transition-colors cursor-pointer">
              <span className="text-3xl block mb-2">🎁</span>
              <p className="font-bold text-brand-ink">Promoções</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}