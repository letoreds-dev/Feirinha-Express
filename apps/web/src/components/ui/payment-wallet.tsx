/**
 * Feirinha Express - Payment Methods Management
 * Complete wallet and payment methods system
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

// ==================== TYPES ====================

interface PaymentMethod {
  id: string
  type: 'credit' | 'debit' | 'pix' | 'ticket'
  name: string
  lastDigits?: string
  brand?: string
  brandIcon?: string
  isDefault: boolean
  expiresAt?: Date
}

interface WalletBalance {
  available: number
  pending: number
  total: number
  cashback: number
}

interface Transaction {
  id: string
  type: 'credit' | 'debit' | 'cashback' | 'refund'
  description: string
  amount: number
  date: Date
  status: 'completed' | 'pending' | 'cancelled'
  icon: string
}

// ==================== WALLET BALANCE ====================

export function WalletBalanceCard() {
  const [balance] = useState<WalletBalance>({
    available: 127.50,
    pending: 23.40,
    total: 150.90,
    cashback: 45.80,
  })

  return (
    <Card padding="md" className="bg-gradient-to-br from-brand-red to-red-700 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm opacity-80">Saldo disponível</p>
          <p className="text-4xl font-extrabold">R$ {balance.available.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl">
          💰
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white border-opacity-20">
        <div className="text-center">
          <p className="text-xl font-bold">{balance.pending.toFixed(2).replace('.', ',')}</p>
          <p className="text-xs opacity-80">Pendente</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{balance.total.toFixed(2).replace('.', ',')}</p>
          <p className="text-xs opacity-80">Total</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-yellow-300">{balance.cashback.toFixed(2).replace('.', ',')}</p>
          <p className="text-xs opacity-80">Cashback</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="secondary" className="flex-1 bg-white text-brand-red border-0">
          💳 Adicionar
        </Button>
        <Button variant="secondary" className="flex-1 bg-white text-brand-red border-0">
          📤 Sacar
        </Button>
      </div>
    </Card>
  )
}

// ==================== PAYMENT METHODS ====================

interface PaymentMethodsListProps {
  onAddCard?: () => void
}

export function PaymentMethodsList({ onAddCard }: PaymentMethodsListProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('paymentMethods')
    if (saved) {
      try {
        setMethods(JSON.parse(saved))
      } catch {}
    } else {
      setMethods([
        {
          id: '1',
          type: 'credit',
          name: 'Cartão de Crédito',
          lastDigits: '4589',
          brand: 'Visa',
          brandIcon: '💳',
          isDefault: true,
          expiresAt: new Date('2026-12-31'),
        },
        {
          id: '2',
          type: 'pix',
          name: 'PIX',
          isDefault: false,
        },
      ])
    }
  }, [])

  useEffect(() => {
    if (methods.length > 0) {
      localStorage.setItem('paymentMethods', JSON.stringify(methods))
    }
  }, [methods])

  const setDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({
      ...m,
      isDefault: m.id === id,
    })))
  }

  const removeMethod = (id: string) => {
    setMethods(prev => prev.filter(m => m.id !== id))
  }

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'credit': return '💳'
      case 'debit': return '💳'
      case 'pix': return '📱'
      case 'ticket': return '🎫'
    }
  }

  const getMethodLabel = (method: PaymentMethod) => {
    if (method.type === 'pix') return 'Chave PIX'
    if (method.brand && method.lastDigits) {
      return `${method.brand} •••• ${method.lastDigits}`
    }
    return method.name
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">💳 Formas de Pagamento</h3>
        <Button variant="ghost" size="sm" onClick={onAddCard}>
          + Adicionar
        </Button>
      </div>

      {methods.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-4xl mb-3">💳</p>
          <p className="text-brand-muted">Nenhum método cadastrado</p>
          <Button variant="primary" className="mt-4" onClick={onAddCard}>
            Adicionar cartão
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {methods.map(method => (
            <Card key={method.id} padding="sm" className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                method.isDefault ? 'bg-brand-red text-white' : 'bg-brand-soft'
              }`}>
                {getMethodIcon(method.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-brand-ink">{getMethodLabel(method)}</p>
                  {method.isDefault && <Badge variant="success" className="text-xs">Padrão</Badge>}
                </div>
                {method.expiresAt && (
                  <p className="text-xs text-brand-muted">
                    Expira: {new Date(method.expiresAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
                {method.type === 'pix' && (
                  <p className="text-xs text-brand-muted">
                    Cadastrado em 15/03/2024
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {!method.isDefault && (
                  <button
                    onClick={() => setDefault(method.id)}
                    className="text-xs text-brand-red"
                  >
                    Tornar padrão
                  </button>
                )}
                <button
                  onClick={() => removeMethod(method.id)}
                  className="text-brand-muted hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== ADD CARD FORM ====================

interface AddCardFormProps {
  onSave: (card: PaymentMethod) => void
  onCancel: () => void
}

export function AddCardForm({ onSave, onCancel }: AddCardFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cpf, setCpf] = useState('')
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit')

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const detectBrand = (number: string) => {
    const clean = number.replace(/\s/g, '')
    if (/^4/.test(clean)) return { brand: 'Visa', icon: '💳' }
    if (/^5[1-5]/.test(clean)) return { brand: 'Mastercard', icon: '💳' }
    if (/^3[47]/.test(clean)) return { brand: 'Amex', icon: '💳' }
    if (/^6/.test(clean)) return { brand: 'Elo', icon: '💳' }
    return { brand: 'Cartão', icon: '💳' }
  }

  const brand = detectBrand(cardNumber)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: cardType,
      name: cardType === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito',
      lastDigits: cardNumber.replace(/\s/g, '').slice(-4),
      brand: brand.brand,
      brandIcon: brand.icon,
      isDefault: false,
      expiresAt: new Date(`20${expiry.split('/')[1]}-${expiry.split('/')[0]}-01`),
    }
    onSave(newCard)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-brand-ink">💳 Adicionar Cartão</h3>

      {/* Card Type */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setCardType('credit')}
          className={`py-3 rounded-xl font-medium text-sm ${
            cardType === 'credit'
              ? 'bg-brand-red text-white'
              : 'bg-brand-soft text-brand-ink'
          }`}
        >
          💳 Crédito
        </button>
        <button
          type="button"
          onClick={() => setCardType('debit')}
          className={`py-3 rounded-xl font-medium text-sm ${
            cardType === 'debit'
              ? 'bg-brand-red text-white'
              : 'bg-brand-soft text-brand-ink'
          }`}
        >
          💳 Débito
        </button>
      </div>

      {/* Card Number */}
      <Input
        label="Número do cartão"
        value={cardNumber}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        placeholder="0000 0000 0000 0000"
        maxLength={19}
      />

      {/* Card Name */}
      <Input
        label="Nome no cartão"
        value={cardName}
        onChange={(e) => setCardName(e.target.value.toUpperCase())}
        placeholder="SEU NOME"
      />

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Validade (MM/AA)"
          value={expiry}
          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
          placeholder="12/26"
          maxLength={5}
        />
        <Input
          label="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="123"
          type="password"
          maxLength={4}
        />
      </div>

      {/* CPF */}
      <Input
        label="CPF do titular"
        value={cpf}
        onChange={(e) => {
          let v = e.target.value.replace(/\D/g, '')
          if (v.length > 11) v = v.slice(0, 11)
          if (v.length > 9) v = v.slice(0, 9) + '-' + v.slice(9)
          if (v.length > 6) v = v.slice(0, 6) + '.' + v.slice(6)
          if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3)
          setCpf(v)
        }}
        placeholder="000.000.000-00"
        maxLength={14}
      />

      {/* Brand Preview */}
      {cardNumber.length > 0 && (
        <Card padding="sm" className="bg-gradient-to-r from-brand-soft to-brand-line">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{brand.icon}</span>
            <div className="text-right">
              <p className="font-medium">{brand.brand}</p>
              <p className="text-sm text-brand-muted">{cardNumber}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Salvar Cartão
        </Button>
      </div>
    </form>
  )
}

// ==================== TRANSACTION HISTORY ====================

interface TransactionHistoryProps {
  maxItems?: number
}

export function TransactionHistory({ maxItems }: TransactionHistoryProps) {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'credit',
      description: 'Pedido #1234 - Burguer House',
      amount: -45.90,
      date: new Date(),
      status: 'completed',
      icon: '🍔',
    },
    {
      id: '2',
      type: 'cashback',
      description: 'Cashback Pedido #1234',
      amount: 4.59,
      date: new Date(),
      status: 'completed',
      icon: '💰',
    },
    {
      id: '3',
      type: 'debit',
      description: 'Recarga Feirinha Pay',
      amount: -50.00,
      date: new Date(Date.now() - 86400000),
      status: 'completed',
      icon: '💳',
    },
    {
      id: '4',
      type: 'refund',
      description: 'Estorno Pedido #1230',
      amount: 32.50,
      date: new Date(Date.now() - 172800000),
      status: 'completed',
      icon: '↩️',
    },
    {
      id: '5',
      type: 'credit',
      description: 'Pedido #1233 - Pizza Express',
      amount: -89.90,
      date: new Date(Date.now() - 259200000),
      status: 'pending',
      icon: '🍕',
    },
  ])

  const displayTransactions = maxItems ? transactions.slice(0, maxItems) : transactions

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Agora'
    if (hours < 24) return `${hours}h atrás`
    if (days === 1) return 'Ontem'
    if (days < 7) return `${days} dias`
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">📜 Histórico</h3>
        {maxItems && transactions.length > maxItems && (
          <Button variant="ghost" size="sm">Ver todos</Button>
        )}
      </div>

      <div className="space-y-2">
        {displayTransactions.map(transaction => (
          <div key={transaction.id} className="flex items-center gap-3 py-3 border-b border-brand-line last:border-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
              transaction.type === 'debit' || transaction.type === 'credit'
                ? 'bg-brand-soft'
                : transaction.type === 'cashback'
                ? 'bg-emerald-100'
                : 'bg-blue-100'
            }`}>
              {transaction.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-ink text-sm">{transaction.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-muted">{formatDate(new Date(transaction.date))}</span>
                {transaction.status === 'pending' && (
                  <Badge variant="warning" className="text-xs">Pendente</Badge>
                )}
              </div>
            </div>
            <span className={`font-bold ${
              transaction.amount > 0 ? 'text-emerald-600' : 'text-brand-ink'
            }`}>
              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== PIX KEY MANAGEMENT ====================

export function PixKeyManager() {
  const [pixKeys, setPixKeys] = useState([
    { id: '1', type: 'cpf', value: '123.456.789-00', isDefault: true },
  ])

  const addKey = (type: string) => {
    const newKey = {
      id: Date.now().toString(),
      type,
      value: type === 'email' ? 'seu@email.com' : type === 'phone' ? '(11) 99999-9999' : '123.456.789-00',
      isDefault: false,
    }
    setPixKeys(prev => [...prev, newKey])
  }

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">📱 Chaves PIX</h3>

      <div className="space-y-2">
        {pixKeys.map(key => (
          <div key={key.id} className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl">
              {key.type === 'cpf' ? '👤' : key.type === 'email' ? '📧' : '📱'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-brand-ink text-sm">{key.value}</p>
              <p className="text-xs text-brand-muted capitalize">{key.type}</p>
            </div>
            {key.isDefault && <Badge variant="success" className="text-xs">Principal</Badge>}
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4">
        + Adicionar chave PIX
      </Button>
    </Card>
  )
}

// ==================== FULL WALLET PAGE ====================

export function WalletPage() {
  const [showAddCard, setShowAddCard] = useState(false)
  const [methods, setMethods] = useState<PaymentMethod[]>([])

  const handleSaveCard = (card: PaymentMethod) => {
    setMethods(prev => [...prev, card])
    setShowAddCard(false)
    localStorage.setItem('paymentMethods', JSON.stringify([...methods, card]))
  }

  return (
    <div className="space-y-6">
      <WalletBalanceCard />

      {showAddCard ? (
        <AddCardForm
          onSave={handleSaveCard}
          onCancel={() => setShowAddCard(false)}
        />
      ) : (
        <PaymentMethodsList onAddCard={() => setShowAddCard(true)} />
      )}

      <TransactionHistory maxItems={5} />
      <PixKeyManager />
    </div>
  )
}