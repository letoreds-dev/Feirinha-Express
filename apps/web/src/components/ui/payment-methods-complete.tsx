'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface PaymentMethod {
  id: string
  type: 'pix' | 'credit' | 'debit' | 'ticket' | 'money'
  name: string
  icon: string
  lastDigits?: string
  expiresAt?: string
  isDefault: boolean
  discount?: number
}

interface SavedCard {
  id: string
  brand: string
  lastDigits: string
  holderName: string
  expiresAt: string
  isDefault: boolean
}

export function PaymentMethodsComplete() {
  const [methods] = useState<PaymentMethod[]>([
    { id: 'pix', type: 'pix', name: 'PIX', icon: '📱', discount: 5, isDefault: true },
    { id: 'credit', type: 'credit', name: 'Cartão de Crédito', icon: '💳', isDefault: false },
    { id: 'debit', type: 'debit', name: 'Cartão de Débito', icon: '💳', isDefault: false },
    { id: 'ticket', type: 'ticket', name: 'Vale Refeição', icon: '🎫', isDefault: false },
    { id: 'money', type: 'money', name: 'Dinheiro', icon: '💵', isDefault: false },
  ])

  const [savedCards] = useState<SavedCard[]>([
    { id: '1', brand: 'Visa', lastDigits: '4532', holderName: 'Carlos Silva', expiresAt: '12/26', isDefault: true },
    { id: '2', brand: 'Mastercard', lastDigits: '5412', holderName: 'Carlos Silva', expiresAt: '08/27', isDefault: false },
  ])

  const [selectedMethod, setSelectedMethod] = useState<string>('pix')
  const [selectedCard, setSelectedCard] = useState<string>('1')

  const getMethodDiscount = (method: PaymentMethod) => {
    if (method.discount) {
      return (
        <Badge variant="success" className="text-xs">
          {method.discount}% OFF
        </Badge>
      )
    }
    return null
  }

  const brandLogos: Record<string, string> = {
    Visa: '💳',
    Mastercard: '💳',
    Amex: '💳',
    Elo: '💳',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-bold text-brand-ink mb-4">💳 Forma de Pagamento</h3>
        <p className="text-sm text-brand-muted mb-4">
          Escolha como deseja pagar seu pedido
        </p>
      </div>

      {/* Payment methods */}
      <Card padding="none">
        <div className="divide-y divide-brand-line">
          {methods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-4 flex items-center gap-4 text-left transition-colors ${
                selectedMethod === method.id ? 'bg-red-50' : 'hover:bg-brand-soft'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                selectedMethod === method.id ? 'bg-brand-red text-white' : 'bg-brand-soft'
              }`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-brand-ink">{method.name}</p>
                {method.discount && (
                  <p className="text-sm text-emerald-600">
                    {method.discount}% de desconto no PIX
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getMethodDiscount(method)}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? 'border-brand-red bg-brand-red'
                    : 'border-brand-line'
                }`}>
                  {selectedMethod === method.id && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* PIX details */}
      {selectedMethod === 'pix' && (
        <Card padding="md" className="animate-fade-up">
          <div className="text-center">
            <div className="w-32 h-32 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-brand-line">
              <span className="text-5xl">📱</span>
            </div>
            <p className="text-sm text-brand-muted mb-2">
              Escaneie o QR Code com seu app do banco
            </p>
            <p className="text-lg font-bold text-brand-ink">
              Chave PIX: (11) 99999-8888
            </p>
            <p className="text-sm text-emerald-600 font-medium mt-2">
              🎉 economy 5% ao pagar com PIX!
            </p>
          </div>
        </Card>
      )}

      {/* Credit card details */}
      {(selectedMethod === 'credit' || selectedMethod === 'debit') && (
        <div className="space-y-4 animate-fade-up">
          {/* Saved cards */}
          {savedCards.length > 0 && (
            <Card padding="none">
              <div className="p-4 border-b border-brand-line">
                <h4 className="font-bold text-brand-ink">Cartões Salvos</h4>
              </div>
              <div className="divide-y divide-brand-line">
                {savedCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card.id)}
                    className={`w-full p-4 flex items-center gap-4 text-left transition-colors ${
                      selectedCard === card.id ? 'bg-red-50' : 'hover:bg-brand-soft'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      selectedCard === card.id ? 'bg-brand-red text-white' : 'bg-brand-soft'
                    }`}>
                      {brandLogos[card.brand] || '💳'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-brand-ink">
                          {card.brand} •••• {card.lastDigits}
                        </p>
                        {card.isDefault && (
                          <Badge variant="success" className="text-xs">Padrão</Badge>
                        )}
                      </div>
                      <p className="text-sm text-brand-muted">
                        {card.holderName} • Expira {card.expiresAt}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedCard === card.id
                        ? 'border-brand-red bg-brand-red'
                        : 'border-brand-line'
                    }`}>
                      {selectedCard === card.id && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Add new card */}
          <Card padding="md" className="border-2 border-dashed border-brand-line hover:border-brand-red transition-colors cursor-pointer">
            <div className="flex items-center justify-center gap-2 text-brand-muted">
              <span className="text-xl">➕</span>
              <span className="font-medium">Adicionar novo cartão</span>
            </div>
          </Card>

          {/* Installments */}
          <Card padding="md">
            <h4 className="font-bold text-brand-ink mb-3">Parcelamento</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['1x sem juros', '2x sem juros', '3x sem juros'].map((option, idx) => (
                <button
                  key={option}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    idx === 0
                      ? 'bg-brand-red text-white'
                      : 'bg-brand-soft text-brand-ink'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Ticket */}
      {selectedMethod === 'ticket' && (
        <Card padding="md" className="animate-fade-up">
          <h4 className="font-bold text-brand-ink mb-3">Vale Refeição</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-brand-soft rounded-xl">
              <span className="text-2xl">🎫</span>
              <div className="flex-1">
                <p className="font-bold text-brand-ink">Sodexo</p>
                <p className="text-sm text-brand-muted">Saldo disponível: R$ 150,00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-brand-soft rounded-xl">
              <span className="text-2xl">🎫</span>
              <div className="flex-1">
                <p className="font-bold text-brand-ink">Ticket Restaurante</p>
                <p className="text-sm text-brand-muted">Saldo disponível: R$ 89,50</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Money change */}
      {selectedMethod === 'money' && (
        <Card padding="md" className="animate-fade-up">
          <h4 className="font-bold text-brand-ink mb-3">Troco</h4>
          <p className="text-sm text-brand-muted mb-4">
            O entregador aceita apenas dinheiro
          </p>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-ink">Precisa de troco?</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Valor total"
                className="flex-1 px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {['R$ 50', 'R$ 100', 'R$ 200'].map(value => (
                <button
                  key={value}
                  className="px-4 py-2 bg-brand-soft rounded-full text-sm font-medium"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Security info */}
      <div className="text-center text-xs text-brand-muted">
        <p>🔒 Pagamentos seguros e protegidos</p>
        <p className="mt-1">Seus dados financeiros nunca são armazenados</p>
      </div>
    </div>
  )
}

// ==================== CARD INPUT FORM ====================

interface CardFormData {
  number: string
  holderName: string
  expiry: string
  cvv: string
}

export function CardInputForm({ onSave }: { onSave?: (data: CardFormData) => void }) {
  const [form, setForm] = useState<CardFormData>({
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
  })

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19)
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4)
    }
    return digits
  }

  const handleSubmit = () => {
    if (form.number.length < 19 || !form.holderName || form.expiry.length < 5 || form.cvv.length < 3) {
      return
    }
    onSave?.(form)
  }

  return (
    <Card padding="md">
      <h4 className="font-bold text-brand-ink mb-4">💳 Dados do Cartão</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Número do cartão</label>
          <input
            type="text"
            value={form.number}
            onChange={(e) => setForm(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Nome no cartão</label>
          <input
            type="text"
            value={form.holderName}
            onChange={(e) => setForm(prev => ({ ...prev, holderName: e.target.value.toUpperCase() }))}
            placeholder="COMO ESTÁ NO CARTÃO"
            className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-ink mb-1">Validade</label>
            <input
              type="text"
              value={form.expiry}
              onChange={(e) => setForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
              placeholder="MM/AA"
              maxLength={5}
              className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-ink mb-1">CVV</label>
            <input
              type="text"
              value={form.cvv}
              onChange={(e) => setForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Salvar Cartão
        </Button>
      </div>
    </Card>
  )
}
