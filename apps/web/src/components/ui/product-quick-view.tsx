/**
 * Feirinha Express - Product Quick View & Modals
 * Quick view, image gallery, and product details
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

// ==================== TYPES ====================

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  emoji: string
  images: string[]
  store: {
    id: string
    name: string
    emoji: string
    rating: number
    deliveryTime: string
  }
  category: string
  tags: string[]
  variants?: { name: string; options: { name: string; price: number }[] }[]
  extras?: { id: string; name: string; price: number }[]
  rating: number
  reviews: number
  soldCount: number
}

// ==================== IMAGE GALLERY ====================

interface ImageGalleryProps {
  images: string[]
  emoji: string
  productName: string
}

export function ImageGallery({ images, emoji, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // If no real images, use emoji as placeholder
  const displayImages = images.length > 0 ? images : [emoji]

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-soft">
        <div className="absolute inset-0 flex items-center justify-center text-9xl">
          {displayImages[activeIndex]}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4">
          <Badge variant="error" className="bg-brand-red text-white">
            -25%
          </Badge>
        </div>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(prev => prev > 0 ? prev - 1 : displayImages.length - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-lg"
            >
              ←
            </button>
            <button
              onClick={() => setActiveIndex(prev => prev < displayImages.length - 1 ? prev + 1 : 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-lg"
            >
              →
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl transition-all ${
                index === activeIndex
                  ? 'ring-2 ring-brand-red ring-offset-2'
                  : 'bg-brand-soft'
              }`}
            >
              {img}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== PRODUCT VARIANTS ====================

interface ProductVariantsProps {
  variants: Product['variants']
  onSelect: (variantId: string, optionId: string) => void
  selected: Record<string, string>
}

export function ProductVariants({ variants, onSelect, selected }: ProductVariantsProps) {
  if (!variants || variants.length === 0) return null

  return (
    <div className="space-y-4">
      {variants.map(variant => (
        <div key={variant.name}>
          <h4 className="font-medium text-brand-ink mb-2">{variant.name}</h4>
          <div className="flex flex-wrap gap-2">
            {variant.options.map(option => (
              <button
                key={option.name}
                onClick={() => onSelect(variant.name, option.name)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${selected[variant.name] === option.name
                    ? 'bg-brand-red text-white'
                    : 'bg-brand-soft text-brand-ink hover:bg-brand-line'
                  }
                `}
              >
                {option.name}
                {option.price > 0 && (
                  <span className="ml-1 text-xs opacity-80">
                    +R$ {option.price.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ==================== PRODUCT EXTRAS ====================

interface ProductExtrasProps {
  extras: Product['extras']
  selected: string[]
  onToggle: (extraId: string) => void
}

export function ProductExtras({ extras, selected, onToggle }: ProductExtrasProps) {
  if (!extras || extras.length === 0) return null

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-brand-ink">Adicionais</h4>
      {extras.map(extra => {
        const isSelected = selected.includes(extra.id)
        return (
          <label
            key={extra.id}
            className={`
              flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
              ${isSelected
                ? 'bg-brand-red bg-opacity-10 border border-brand-red'
                : 'bg-brand-soft hover:bg-brand-line'
              }
            `}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(extra.id)}
              className="w-5 h-5 rounded accent-brand-red"
            />
            <span className="flex-1 text-brand-ink">{extra.name}</span>
            <span className="font-medium text-brand-red">
              +R$ {extra.price.toFixed(2).replace('.', ',')}
            </span>
          </label>
        )
      })}
    </div>
  )
}

// ==================== PRODUCT QUANTITY ====================

interface ProductQuantityProps {
  quantity: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
}

export function ProductQuantity({ quantity, onChange, min = 1, max = 99 }: ProductQuantityProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-medium text-brand-ink">Quantidade</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, quantity - 1))}
          disabled={quantity <= min}
          className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-xl font-bold text-brand-ink disabled:opacity-50"
        >
          −
        </button>
        <span className="w-8 text-center font-bold text-xl">{quantity}</span>
        <button
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-xl font-bold text-brand-ink disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  )
}

// ==================== QUICK VIEW MODAL ====================

interface QuickViewModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onAddToCart: (quantity: number, variants: Record<string, string>, extras: string[]) => void
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1)
    setSelectedVariants({})
    setSelectedExtras([])
  }, [product.id])

  if (!isOpen) return null

  const handleVariantSelect = (variantName: string, optionName: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: optionName }))
  }

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    )
  }

  const calculateTotal = () => {
    let total = product.price

    // Add variant prices
    if (product.variants) {
      product.variants.forEach(variant => {
        const selectedOption = variant.options.find(o => o.name === selectedVariants[variant.name])
        if (selectedOption) {
          total += selectedOption.price
        }
      })
    }

    // Add extra prices
    if (product.extras) {
      product.extras.forEach(extra => {
        if (selectedExtras.includes(extra.id)) {
          total += extra.price
        }
      })
    }

    return total * quantity
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    await new Promise(r => setTimeout(r, 500))
    onAddToCart(quantity, selectedVariants, selectedExtras)
    setIsAdding(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[390px] bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-brand-line">
          <h2 className="font-extrabold text-brand-ink">Detalhes do produto</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Gallery */}
          <ImageGallery
            images={product.images}
            emoji={product.emoji}
            productName={product.name}
          />

          {/* Product Info */}
          <div>
            <h3 className="text-xl font-extrabold text-brand-ink">{product.name}</h3>
            <p className="text-sm text-brand-muted mt-1">{product.description}</p>

            {/* Store */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xl">{product.store.emoji}</span>
              <span className="font-medium text-brand-ink">{product.store.name}</span>
              <span className="text-sm text-brand-muted">•</span>
              <span className="text-sm text-brand-muted">⭐ {product.store.rating}</span>
              <span className="text-sm text-brand-muted">•</span>
              <span className="text-sm text-brand-muted">{product.store.deliveryTime}</span>
            </div>

            {/* Rating & Sold */}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-brand-muted">
                ⭐ {product.rating.toFixed(1)} ({product.reviews} avaliações)
              </span>
              <span className="text-brand-muted">
                {product.soldCount} vendidos
              </span>
            </div>
          </div>

          {/* Variants */}
          <ProductVariants
            variants={product.variants}
            selected={selectedVariants}
            onSelect={handleVariantSelect}
          />

          {/* Extras */}
          <ProductExtras
            extras={product.extras}
            selected={selectedExtras}
            onToggle={handleExtraToggle}
          />

          {/* Quantity */}
          <ProductQuantity quantity={quantity} onChange={setQuantity} />

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="default" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-brand-line">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-brand-muted">Total</p>
              <p className="text-2xl font-extrabold text-brand-red">
                R$ {calculateTotal().toFixed(2).replace('.', ',')}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleAddToCart}
              loading={isAdding}
              className="flex-1"
            >
              🛒 Adicionar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== PRODUCT CARD WITH QUICK VIEW ====================

interface ProductCardQuickViewProps {
  product: Product
  onQuickView: () => void
}

export function ProductCardQuickView({ product, onQuickView }: ProductCardQuickViewProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0

  return (
    <Card padding="sm" className="cursor-pointer" onClick={onQuickView}>
      <div className="relative">
        <div className="aspect-square rounded-xl bg-brand-soft flex items-center justify-center text-5xl mb-3">
          {product.emoji}
        </div>
        {hasDiscount && (
          <Badge variant="error" className="absolute top-2 left-2 bg-brand-red text-white">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      <div>
        <p className="font-bold text-brand-ink truncate">{product.name}</p>
        <p className="text-sm text-brand-muted truncate">{product.store.emoji} {product.store.name}</p>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-extrabold text-brand-red">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {hasDiscount && (
            <span className="text-sm text-brand-muted line-through">
              R$ {product.originalPrice!.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-brand-muted">
          <span>⭐ {product.rating}</span>
          <span>•</span>
          <span>{product.store.deliveryTime}</span>
        </div>
      </div>
    </Card>
  )
}

// ==================== PRODUCT GRID WITH QUICK VIEW ====================

interface ProductGridQuickViewProps {
  products: Product[]
}

export function ProductGridQuickView({ products }: ProductGridQuickViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleAddToCart = (quantity: number, variants: Record<string, string>, extras: string[]) => {
    console.log('Added to cart:', { product: selectedProduct?.name, quantity, variants, extras })
    // In real app: add to cart context
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {products.map(product => (
          <ProductCardQuickView
            key={product.id}
            product={product}
            onQuickView={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  )
}

// ==================== DEMO PAGE ====================

export default function QuickViewDemoPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const demoProduct: Product = {
    id: '1',
    name: 'X-Burger Especial',
    description: 'Hambúrguer artesanal com carne 180g, queijo cheddar, bacon crocante, alface, tomate e nosso molho especial da casa.',
    price: 29.90,
    originalPrice: 39.90,
    emoji: '🍔',
    images: [],
    store: {
      id: '1',
      name: 'Burguer House',
      emoji: '🍔',
      rating: 4.8,
      deliveryTime: '25-35 min',
    },
    category: 'Lanches',
    tags: ['Mais pedido', 'Artesanal'],
    variants: [
      {
        name: 'Tamanho',
        options: [
          { name: 'Pequeno', price: 0 },
          { name: 'Médio', price: 5 },
          { name: 'Grande', price: 10 },
        ],
      },
      {
        name: 'Pão',
        options: [
          { name: 'Tradicional', price: 0 },
          { name: 'Brioche', price: 2 },
          { name: 'Integral', price: 1 },
        ],
      },
    ],
    extras: [
      { id: 'bacon', name: 'Bacon extra', price: 5 },
      { id: 'cheese', name: 'Queijo extra', price: 3 },
      { id: 'egg', name: 'Ovo', price: 4 },
      { id: 'jalapeno', name: 'Jalapeño', price: 2 },
    ],
    rating: 4.8,
    reviews: 234,
    soldCount: 1543,
  }

  const handleAddToCart = (quantity: number, variants: Record<string, string>, extras: string[]) => {
    alert(`Adicionado: ${quantity}x X-Burger\nVariantes: ${JSON.stringify(variants)}\nAdicionais: ${extras.join(', ')}`)
  }

  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      <div className="p-4 bg-white border-b border-brand-line">
        <h1 className="text-lg font-extrabold text-brand-ink">👀 Quick View Demo</h1>
        <p className="text-sm text-brand-muted">Toque no produto para ver detalhes</p>
      </div>

      <div className="p-4 max-w-[390px] mx-auto space-y-6">
        {/* Product Card */}
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">Exemplo de Card</h3>
          <ProductCardQuickView
            product={demoProduct}
            onQuickView={() => {
              setSelectedProduct(demoProduct)
              setShowModal(true)
            }}
          />
        </Card>

        {/* Open Modal Button */}
        <Button
          variant="primary"
          className="w-full"
          onClick={() => {
            setSelectedProduct(demoProduct)
            setShowModal(true)
          }}
        >
          Abrir Quick View
        </Button>

        {/* Product Info */}
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">Componentes</h3>
          <div className="space-y-3">
            <div className="p-3 bg-brand-soft rounded-xl">
              <p className="font-medium text-brand-ink">ImageGallery</p>
              <p className="text-sm text-brand-muted">Galeria com thumbnails</p>
            </div>
            <div className="p-3 bg-brand-soft rounded-xl">
              <p className="font-medium text-brand-ink">ProductVariants</p>
              <p className="text-sm text-brand-muted">Seleção de tamanho, pão, etc</p>
            </div>
            <div className="p-3 bg-brand-soft rounded-xl">
              <p className="font-medium text-brand-ink">ProductExtras</p>
              <p className="text-sm text-brand-muted">Adicionais com checkbox</p>
            </div>
            <div className="p-3 bg-brand-soft rounded-xl">
              <p className="font-medium text-brand-ink">ProductQuantity</p>
              <p className="text-sm text-brand-muted">Contador +/-</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </main>
  )
}