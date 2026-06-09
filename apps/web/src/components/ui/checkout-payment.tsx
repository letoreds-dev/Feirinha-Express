'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface CreditCard {
  id: string
  last4: string
  brand: string
  expMonth: number
  expYear: number
  isDefault: boolean
  icon: string
}

const cards: CreditCard[] = [
  { id: '1', last4: '4532', brand: 'Visa', expMonth: 12, expYear: 2025, isDefault: true, icon: '💳' },
  { id: '2', last4: '5555', brand: 'Mastercard', expMonth: 8, expYear: 2026, isDefault: false, icon: '💳' },
]

export function CheckoutPayment() {
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'card' | 'ticket' | 'money'>('pix')
  const [cardsList, setCardsList] = useState<CreditCard[]>(cards)
  const [selectedCard, setSelectedCard] = useState<string>(cards[0].id)
  const [showNewCard, setShowNewCard] = useState(false)

  const methods = [
    { id: 'pix', label: 'PIX', icon: '📱', desc: 'Aprovação instantânea', discount: '5% OFF' },
    { id: 'card', label: 'Cartão', icon: '💳', desc: 'Crédito ou débito', discount: null },
    { id: 'ticket', label: 'Vale', icon: '🎫', desc: 'Alelo, Sodexo, Ticket', discount: null },
    { id: 'money', label: 'Dinheiro', icon: '💵', desc: 'Na entrega', discount: null },
  ]

  const setDefaultCard = (id: string) => {
    setCardsList(cardsList.map(card => ({
      ...card,
      isDefault: card.id === id
    })))
    setSelectedCard(id)
    toast.success('Cartão definido como padrão')
  }

  return (
    <div className="space-y-4">
      {/* Payment methods */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">💳 Forma de pagamento</h3>
        <div className="space-y-3">
          {methods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id as any)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedMethod === method.id
                  ? 'border-brand-red bg-red-50'
                  : 'border-brand-line hover:border-brand-red'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{method.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-ink">{method.label}</p>
                      {method.discount && (
                        <Badge variant="success" className="text-xs">{method.discount}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-brand-muted">{method.desc}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? 'border-brand-red bg-brand-red'
                    : 'border-gray-300'
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
            <div className="w-48 h-48 bg-white rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-brand-line mb-4">
              <div className="text-center">
                <p className="text-5xl mb-2">📱</p>
                <p className="text-xs text-brand-muted">QR Code PIX</p>
              </div>
            </div>
            <p className="text-sm text-brand-muted mb-2">Escaneie o QR Code ou copie o código PIX</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm">
                📋 Copiar código
              </Button>
              <Button variant="outline" size="sm">
                🔄 Atualizar
              </Button>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
              <p className="text-sm text-emerald-700">
                ✨ Pagamento via PIX: <strong>5% de desconto</strong>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Card details */}
      {selectedMethod === 'card' && (
        <Card padding="md" className="animate-fade-up">
          <h3 className="font-bold text-brand-ink mb-4">Selecione o cartão</h3>

          {/* Saved cards */}
          <div className="space-y-3 mb-4">
            {cardsList.map(card => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedCard === card.id
                    ? 'border-brand-red bg-red-50'
                    : 'border-brand-line'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{card.icon}</span>
                    <div>
                      <p className="font-bold text-brand-ink">{card.brand} •••• {card.last4}</p>
                      <p className="text-xs text-brand-muted">Expira {card.expMonth.toString().padStart(2, '0')}/{card.expYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.isDefault && (
                      <Badge variant="success" className="text-xs">Padrão</Badge>
                    )}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedCard === card.id
                        ? 'border-brand-red bg-brand-red'
                        : 'border-gray-300'
                    }`}>
                      {selectedCard === card.id && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Add new card */}
          {showNewCard ? (
            <div className="p-4 bg-brand-soft rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-brand-ink">Novo cartão</h4>
                <button onClick={() => setShowNewCard(false)} className="text-brand-muted">
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Número do cartão"
                className="w-full px-4 py-3 border border-brand-line rounded-xl"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Validade (MM/AA)"
                  className="px-4 py-3 border border-brand-line rounded-xl"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="px-4 py-3 border border-brand-line rounded-xl"
                />
              </div>
              <input
                type="text"
                placeholder="Nome no cartão"
                className="w-full px-4 py-3 border border-brand-line rounded-xl"
              />
              <Button className="w-full">Salvar cartão</Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowNewCard(true)}
              className="w-full"
            >
              ➕ Adicionar novo cartão
            </Button>
          )}
        </Card>
      )}

      {/* Ticket details */}
      {selectedMethod === 'ticket' && (
        <Card padding="md" className="animate-fade-up">
          <h3 className="font-bold text-brand-ink mb-4">Selecione o vale</h3>
          <div className="space-y-3">
            {['Alelo', 'Sodexo', 'Ticket', 'VR'].map(ticket => (
              <button
                key={ticket}
                className="w-full p-4 rounded-xl border-2 border-brand-line text-left hover:border-brand-red transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎫</span>
                  <p className="font-bold text-brand-ink">Vale {ticket}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Money change */}
      {selectedMethod === 'money' && (
        <Card padding="md" className="animate-fade-up">
          <h3 className="font-bold text-brand-ink mb-4">Troco para</h3>
          <div className="space-y-3">
            {[50, 100, 200].map(amount => (
              <button
                key={amount}
                className="w-full p-4 rounded-xl border-2 border-brand-line text-left hover:border-brand-red transition-colors"
              >
                <p className="font-bold text-brand-ink">R$ {amount}</p>
              </button>
            ))}
            <input
              type="number"
              placeholder="Outro valor"
              className="w-full px-4 py-3 border border-brand-line rounded-xl"
            />
          </div>
        </Card>
      )}

      {/* Security note */}
      <Card padding="sm" className="bg-gray-50">
        <div className="flex items-center gap-3 text-center">
          <span className="text-2xl">🔒</span>
          <div className="text-left">
            <p className="text-sm font-medium text-brand-ink">Pagamento seguro</p>
            <p className="text-xs text-brand-muted">Seus dados estão protegidos</p>
          </div>
        </div>
      </Card>
    </div>
  )
}