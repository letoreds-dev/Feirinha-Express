/**
 * Feirinha Express - Price Comparison & Smart Alerts
 * Compare products and set price alerts
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== TYPES ====================

interface ProductComparison {
  id: string
  name: string
  emoji: string
  price: number
  store: string
  rating: number
  reviews: number
  deliveryTime: string
  features: Record<string, boolean | string>
}

interface PriceAlert {
  id: string
  productName: string
  targetPrice: number
  currentPrice: number
  createdAt: Date
  triggered: boolean
}

// ==================== PRODUCT COMPARISON ====================

interface ProductComparisonViewProps {
  products?: ProductComparison[]
}

export function ProductComparisonView({ products }: ProductComparisonViewProps) {
  const defaultProducts: ProductComparison[] = products || [
    {
      id: '1',
      name: 'X-Burger Especial',
      emoji: '🍔',
      price: 28.90,
      store: 'Burguer House',
      rating: 4.8,
      reviews: 234,
      deliveryTime: '25-35 min',
      features: { 'Molho especial': true, 'Bacon': true, 'Queijo cheddar': true, 'Cebola caramelizada': true, 'Egg': true },
    },
    {
      id: '2',
      name: 'X-Burger Especial',
      emoji: '🍔',
      price: 24.90,
      store: 'Mega Lanches',
      rating: 4.5,
      reviews: 156,
      deliveryTime: '30-40 min',
      features: { 'Molho especial': true, 'Bacon': true, 'Queijo cheddar': true, 'Cebola caramelizada': false, 'Egg': false },
    },
    {
      id: '3',
      name: 'X-Burger Especial',
      emoji: '🍔',
      price: 26.50,
      store: 'Lanche Bom',
      rating: 4.6,
      reviews: 89,
      deliveryTime: '20-30 min',
      features: { 'Molho especial': true, 'Bacon': true, 'Queijo cheddar': false, 'Cebola caramelizada': true, 'Egg': true },
    },
  ]

  const [compareProducts, setCompareProducts] = useState(defaultProducts)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const bestPrice = Math.min(...compareProducts.map(p => p.price))
  const bestRating = Math.max(...compareProducts.map(p => p.rating))
  const fastestDelivery = compareProducts.reduce((fastest, p) => {
    const current = parseInt(p.deliveryTime)
    const fastestNum = parseInt(fastest)
    return current < fastestNum ? p.deliveryTime : fastest
  }, '99 min')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">📊 Comparar Preços</h3>
        <Badge variant="info">{compareProducts.length} lojas</Badge>
      </div>

      {/* Best value badges */}
      <div className="flex flex-wrap gap-2">
        {compareProducts.map(p => {
          if (p.price === bestPrice) {
            return <Badge key={p.id} variant="success">💰 Melhor preço</Badge>
          }
          if (p.rating === bestRating) {
            return <Badge key={p.id} variant="info">⭐ Melhor avaliado</Badge>
          }
          if (p.deliveryTime === fastestDelivery) {
            return <Badge key={p.id} variant="warning">🚀 Mais rápido</Badge>
          }
          return null
        })}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 gap-3">
        {compareProducts.map(product => {
          const isBestPrice = product.price === bestPrice
          const isBestRating = product.rating === bestRating

          return (
            <Card
              key={product.id}
              padding="md"
              className={`cursor-pointer transition-all ${
                selectedProduct === product.id ? 'ring-2 ring-brand-red' : ''
              } ${isBestPrice ? 'border-2 border-emerald-500' : ''}`}
              onClick={() => setSelectedProduct(product.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-brand-soft flex items-center justify-center text-4xl">
                  {product.emoji}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-brand-ink">{product.store}</p>
                      <p className="text-sm text-brand-muted">{product.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-brand-red">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-xs text-brand-muted">🕐 {product.deliveryTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm">⭐ {product.rating}</span>
                    <span className="text-sm text-brand-muted">({product.reviews} avaliações)</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(product.features).map(([feature, available]) => (
                      <span
                        key={feature}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {available ? '✓' : '✗'} {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {isBestPrice && (
                <div className="mt-3 pt-3 border-t border-brand-line flex justify-between items-center">
                  <Badge variant="success" className="text-xs">
                    💰 Economia de R$ {(bestPrice - product.price).toFixed(2).replace('.', ',')}
                  </Badge>
                  <Button size="sm" variant="primary">
                    Pedir
                  </Button>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ==================== PRICE ALERTS ====================

interface PriceAlertCardProps {
  alert: PriceAlert
  onDelete: () => void
  onEdit: () => void
}

function PriceAlertCard({ alert, onDelete, onEdit }: PriceAlertCardProps) {
  const priceDiff = alert.targetPrice - alert.currentPrice
  const percentOff = ((alert.currentPrice - alert.targetPrice) / alert.currentPrice) * 100
  const isReached = alert.currentPrice <= alert.targetPrice

  return (
    <Card padding="md" className={isReached ? 'border-2 border-emerald-500' : ''}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
          🔔
        </div>
        <div className="flex-1">
          <p className="font-bold text-brand-ink">{alert.productName}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-brand-muted">
              Meta: <span className="font-medium text-brand-ink">R$ {alert.targetPrice.toFixed(2).replace('.', ',')}</span>
            </span>
            <span className="text-sm text-brand-muted">
              Atual: <span className="font-medium text-brand-ink">R$ {alert.currentPrice.toFixed(2).replace('.', ',')}</span>
            </span>
          </div>

          {!isReached && (
            <div className="mt-2">
              <div className="h-2 bg-brand-soft rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-red rounded-full"
                  style={{ width: `${Math.min(100, percentOff)}%` }}
                />
              </div>
              <p className="text-xs text-brand-muted mt-1">
                Faltam R$ {priceDiff.toFixed(2).replace('.', ',')} para atingir a meta
              </p>
            </div>
          )}

          {isReached && (
            <Badge variant="success" className="mt-2">
              ✓ Meta atingida! Preço caiu!
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-brand-muted hover:text-brand-ink">
            ✏️
          </button>
          <button onClick={onDelete} className="text-brand-muted hover:text-red-500">
            🗑️
          </button>
        </div>
      </div>
    </Card>
  )
}

export function PriceAlertSystem() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      productName: 'Combo X-Burger + Batata',
      targetPrice: 25.00,
      currentPrice: 28.90,
      createdAt: new Date(Date.now() - 604800000),
      triggered: false,
    },
    {
      id: '2',
      productName: 'Pizza Grande Margherita',
      targetPrice: 35.00,
      currentPrice: 42.90,
      createdAt: new Date(Date.now() - 259200000),
      triggered: false,
    },
    {
      id: '3',
      productName: 'Açaí 500ml',
      targetPrice: 18.00,
      currentPrice: 17.50,
      createdAt: new Date(Date.now() - 86400000),
      triggered: true,
    },
  ])

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const reachedCount = alerts.filter(a => a.triggered).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">🔔 Alertas de Preço</h3>
        {reachedCount > 0 && (
          <Badge variant="success">{reachedCount} meta(s) atingida(s)</Badge>
        )}
      </div>

      <Button variant="outline" className="w-full">
        + Criar novo alerta
      </Button>

      {alerts.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-brand-muted">Nenhum alerta criado</p>
          <p className="text-sm text-brand-muted mt-1">
            Crie alertas para ser notificado quando o preço atingir sua meta!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <PriceAlertCard
              key={alert.id}
              alert={alert}
              onDelete={() => deleteAlert(alert.id)}
              onEdit={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== SMART RECOMMENDATIONS ====================

interface SmartRecommendation {
  id: string
  type: 'savings' | 'trending' | 'similar' | 'bundle'
  title: string
  description: string
  icon: string
  savings?: number
  products?: { name: string; price: number; emoji: string }[]
}

export function SmartRecommendations() {
  const [recommendations] = useState<SmartRecommendation[]>([
    {
      id: '1',
      type: 'savings',
      title: 'Economize R$ 8,50',
      description: 'Same produto por preço menor em outra loja',
      icon: '💰',
      savings: 8.50,
    },
    {
      id: '2',
      type: 'trending',
      title: 'Mais vendido da semana',
      description: 'Pizza artesanal está em alta',
      icon: '🔥',
    },
    {
      id: '3',
      type: 'bundle',
      title: 'Combo econômica',
      description: 'Lanche + batata + refri com 15% off',
      icon: '🎁',
      products: [
        { name: 'X-Burger', price: 24.90, emoji: '🍔' },
        { name: 'Batata média', price: 12.90, emoji: '🍟' },
        { name: 'Refrigerante', price: 6.90, emoji: '🥤' },
      ],
    },
  ])

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-brand-ink">✨ Sugestões Inteligentes</h3>

      <div className="space-y-3">
        {recommendations.map(rec => (
          <Card key={rec.id} padding="md" className="cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-brand-ink">{rec.title}</p>
                  <Badge
                    variant={
                      rec.type === 'savings' ? 'success' :
                      rec.type === 'trending' ? 'warning' : 'info'
                    }
                  >
                    {rec.type === 'savings' ? 'Economia' :
                     rec.type === 'trending' ? 'Tendência' : 'Combo'}
                  </Badge>
                </div>
                <p className="text-sm text-brand-muted mt-1">{rec.description}</p>

                {rec.savings && (
                  <p className="text-sm text-emerald-600 font-medium mt-2">
                    💰 Você economizaria R$ {rec.savings.toFixed(2).replace('.', ',')}
                  </p>
                )}

                {rec.products && (
                  <div className="mt-2 flex items-center gap-2">
                    {rec.products.map((p, i) => (
                      <span key={i} className="text-2xl">{p.emoji}</span>
                    ))}
                    <span className="text-sm text-brand-muted">
                      Por apenas R$ 37,85 (15% off)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ==================== COMPARISON PAGE ====================

export default function ComparisonPage() {
  return (
    <div className="space-y-6">
      <ProductComparisonView />
      <PriceAlertSystem />
      <SmartRecommendations />
    </div>
  )
}

// ==================== ALIAS ====================

// Alias for compatibility
export const ProductComparison = ProductComparisonView