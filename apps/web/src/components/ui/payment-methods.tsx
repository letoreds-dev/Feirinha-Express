'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface PaymentMethod {
  id: string
  type: 'pix' | 'credit' | 'debit' | 'voucher'
  name: string
  icon: string
  description: string
  discount?: number
  lastDigits?: string
  isDefault: boolean
  isExpired?: boolean
  expiryDate?: string
}

const paymentMethods: PaymentMethod[] = [
  { id: '1', type: 'pix', name: 'PIX', icon: '💠', description: 'Pagamento instantâneo com 5% de desconto', discount: 5, isDefault: false },
  { id: '2', type: 'credit', name: 'Cartão de Crédito', icon: '💳', description: 'Visa terminando em 4242', lastDigits: '4242', isDefault: true },
  { id: '3', type: 'debit', name: 'Cartão de Débito', icon: '💳', description: 'Mastercard terminando em 8888', lastDigits: '8888', isDefault: false },
  { id: '4', type: 'voucher', name: 'Vale-refeição', icon: '🎫', description: 'Ticket Restaurant', expiryDate: '12/2025', isDefault: false },
]

export function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>(paymentMethods)
  const [showAddForm, setShowAddForm] = useState(false)

  const setAsDefault = (id: string) => {
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })))
    toast.success('Método principal atualizado')
  }

  const removeMethod = (id: string) => {
    setMethods(methods.filter(m => m.id !== id))
    toast.info('Método removido')
  }

  const handleAddCard = () => {
    toast.success('Cartão adicionado', 'Seu novo cartão foi salvo com sucesso')
    setShowAddForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Payment methods list */}
      <div className="space-y-3">
        {methods.map(method => (
          <Card key={method.id} padding="md" className={method.isDefault ? 'border-2 border-brand-red' : ''}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
                {method.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-brand-ink">{method.name}</p>
                  {method.isDefault && <Badge variant="danger" className="text-xs">Principal</Badge>}
                  {method.discount && <Badge variant="success" className="text-xs">{method.discount}% OFF</Badge>}
                </div>
                <p className="text-sm text-brand-muted mt-0.5">{method.description}</p>
                {method.expiryDate && (
                  <p className="text-xs text-amber-600 mt-1">
                    Expira: {method.expiryDate}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-brand-line">
              {!method.isDefault && (
                <button
                  onClick={() => setAsDefault(method.id)}
                  className="flex-1 py-2 text-sm text-brand-red border border-brand-red rounded-lg hover:bg-red-50 transition-colors"
                >
                  Definir como principal
                </button>
              )}
              <button
                onClick={() => removeMethod(method.id)}
                className="py-2 px-4 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                🗑️
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add new payment method */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full py-4 border-2 border-dashed border-brand-line rounded-xl text-brand-muted hover:border-brand-red hover:text-brand-red transition-colors"
      >
        ➕ Adicionar método de pagamento
      </button>

      {/* Add card form */}
      {showAddForm && (
        <Card padding="md" className="animate-fade-up">
          <h3 className="font-bold text-brand-ink mb-4">Adicionar novo cartão</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Número do cartão</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">Validade</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Nome no cartão</label>
              <input
                type="text"
                placeholder="Como aparece no cartão"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="default-card" className="w-4 h-4 accent-brand-red" />
              <label htmlFor="default-card" className="text-sm text-brand-ink">
                Definir como cartão principal
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 text-sm text-brand-muted border border-brand-line rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCard}
                className="flex-1 py-3 text-sm text-white bg-brand-red rounded-xl font-bold hover:bg-brand-red-dark transition-colors"
              >
                Salvar cartão
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Security info */}
      <Card padding="md" className="bg-emerald-50 border-emerald-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-bold text-emerald-800">Seus dados estão seguros</p>
            <p className="text-xs text-emerald-600 mt-1">
              Utilizamos criptografia de ponta para proteger suas informações de pagamento.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}