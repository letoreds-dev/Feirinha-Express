'use client'

import { useState } from 'react'
import { Card } from './card'
import { Button } from './button'

// ==================== WALLET BALANCE ====================

interface Wallet {
  balance: number
  cashbackBalance: number
}

interface WalletBalanceProps {
  wallet: Wallet
  onDeposit: () => void
  onWithdraw: () => void
}

export function WalletBalance({ wallet, onDeposit, onWithdraw }: WalletBalanceProps) {
  return (
    <Card padding="lg" className="bg-gradient-to-br from-brand-red to-brand-red-dark text-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm opacity-80">Saldo disponível</p>
          <button className="text-sm opacity-80 hover:opacity-100">
 ℹ️
          </button>
        </div>
        <p className="text-4xl font-extrabold">
          R$ {wallet.balance.toFixed(2).replace('.', ',')}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={onDeposit}
            className="flex-1 bg-white text-brand-red hover:bg-white/90"
          >
            + Adicionar
          </Button>
          <Button
            onClick={onWithdraw}
            variant="outline"
            className="flex-1 border-white text-white hover:bg-white/10"
          >
            Sacar
          </Button>
        </div>
        {wallet.cashbackBalance > 0 && (
          <div className="flex items-center gap-2 p-3 bg-white/20 rounded-xl">
            <span className="text-lg">💵</span>
            <div>
              <p className="text-sm font-medium">Cashback</p>
              <p className="text-lg font-bold">R$ {wallet.cashbackBalance.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// ==================== WALLET TRANSACTION ====================

interface WalletTransaction {
  id: string
  type: 'deposit' | 'withdraw' | 'cashback' | 'payment' | 'refund' | 'bonus'
  amount: number
  description: string
  pixStatus?: string
  createdAt: string
}

interface WalletTransactionItemProps {
  transaction: WalletTransaction
}

export function WalletTransactionItem({ transaction }: WalletTransactionItemProps) {
  const isPositive = transaction.amount > 0

  const getIcon = () => {
    switch (transaction.type) {
      case 'deposit': return '💵'
      case 'withdraw': return '🏧'
      case 'cashback': return '💵'
      case 'payment': return '🛒'
      case 'refund': return '↩️'
      case 'bonus': return '🎁'
      default: return '💰'
    }
  }

  const getStatusColor = () => {
    if (transaction.pixStatus === 'pending') return 'text-yellow-600'
    if (transaction.pixStatus === 'failed') return 'text-red-600'
    return ''
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-line">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
        isPositive ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-brand-ink">{transaction.description}</p>
        <p className={`text-xs ${getStatusColor()}`}>
          {new Date(transaction.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {transaction.pixStatus && ` • ${transaction.pixStatus}`}
        </p>
      </div>
      <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
      </span>
    </div>
  )
}

// ==================== PIX DEPOSIT MODAL ====================

interface PixDepositModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: number) => Promise<void>
}

export function PixDepositModal({ isOpen, onClose, onConfirm }: PixDepositModalProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pixCode, setPixCode] = useState('')
  const [showQrCode, setShowQrCode] = useState(false)

  const handleGeneratePix = async () => {
    const value = parseFloat(amount.replace(',', '.'))
    if (isNaN(value) || value <= 0) return

    setIsLoading(true)
    try {
      await onConfirm(value)
      setShowQrCode(true)
      setPixCode(`00020126580014br.gov.bcb.pix0136${Date.now()}5204000053039865802BR5925FEIRINHA6009SAO PAULO62140510${Date.now()}6304`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card padding="lg" className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-ink">Adicionar saldo</h3>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-ink">
            ✕
          </button>
        </div>

        {!showQrCode ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-ink">Valor a depositar</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-brand-muted">R$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
                  placeholder="0,00"
                  className="flex-1 text-3xl font-bold text-brand-ink bg-transparent border-b-2 border-brand-line focus:border-brand-red focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-brand-muted">Valores comuns:</p>
              <div className="flex gap-2">
                {[20, 50, 100, 200].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v.toString())}
                    className="flex-1 py-2 bg-brand-soft rounded-lg text-sm font-medium text-brand-ink hover:bg-brand-line"
                  >
                    R$ {v}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGeneratePix}
              disabled={!amount || isLoading}
              className="w-full"
            >
              {isLoading ? 'Gerando...' : 'Gerar PIX'}
            </Button>
          </>
        ) : (
          <>
            <div className="text-center space-y-3">
              <p className="text-sm text-brand-muted">Escaneie o QR Code ou copie o código PIX</p>
              <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center">
                <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-6xl">
                  📱
                </div>
              </div>
              <p className="text-xs text-brand-muted break-all px-4">{pixCode.substring(0, 50)}...</p>
              <Button variant="outline" className="w-full">
                📋 Copiar código PIX
              </Button>
            </div>
            <p className="text-xs text-center text-brand-muted">
              Este código expira em 30 minutos
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
