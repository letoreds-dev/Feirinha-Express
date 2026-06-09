'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface DeliverySchedule {
  date: string
  timeSlot: string
  isAvailable: boolean
}

interface Tip {
  id: string
  amount: number
  label: string
  isSelected: boolean
  isCustom?: boolean
}

export function DeliveryScheduler() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [tip, setTip] = useState<Tip>({
    id: '1',
    amount: 5,
    label: 'R$ 5,00',
    isSelected: true,
    isCustom: false
  })
  const [showTipCustom, setShowTipCustom] = useState(false)
  const [customTip, setCustomTip] = useState('')

  // Generate next 7 days
  const availableDates: DeliverySchedule[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      date: date.toISOString().split('T')[0],
      timeSlot: '09:00 - 22:00',
      isAvailable: i < 5 // Some days unavailable for demo
    }
  })

  const timeSlots = [
    { id: '1', time: '09:00 - 11:00', available: true },
    { id: '2', time: '11:00 - 13:00', available: true },
    { id: '3', time: '13:00 - 15:00', available: true },
    { id: '4', time: '15:00 - 17:00', available: false },
    { id: '5', time: '17:00 - 19:00', available: true },
    { id: '6', time: '19:00 - 21:00', available: true },
    { id: '7', time: '21:00 - 22:00', available: true },
  ]

  const tipOptions: Tip[] = [
    { id: '1', amount: 5, label: 'R$ 5,00', isSelected: tip.id === '1', isCustom: false },
    { id: '2', amount: 10, label: 'R$ 10,00', isSelected: tip.id === '2', isCustom: false },
    { id: '3', amount: 15, label: 'R$ 15,00', isSelected: tip.id === '3', isCustom: false },
    { id: '4', amount: 0, label: 'Não dar gorjeta', isSelected: tip.id === '4', isCustom: false },
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return 'Hoje'
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã'

    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const handleTipSelect = (t: Tip) => {
    if (t.id === '4') {
      // No tip
      setTip({ ...t, isSelected: true })
      setShowTipCustom(false)
    } else {
      setTip({ ...t, isSelected: true })
      setShowTipCustom(false)
    }
  }

  const handleCustomTip = () => {
    const amount = parseFloat(customTip.replace(',', '.'))
    if (isNaN(amount) || amount < 0) {
      toast.error('Valor inválido')
      return
    }
    setTip({
      id: 'custom',
      amount,
      label: `R$ ${amount.toFixed(2).replace('.', ',')}`,
      isSelected: true,
      isCustom: true
    })
    setShowTipCustom(false)
  }

  const handleSchedule = () => {
    if (!selectedDate) {
      toast.error('Selecione uma data')
      return
    }
    if (!selectedTime) {
      toast.error('Selecione um horário')
      return
    }
    toast.success('Entrega agendada!', `${formatDate(selectedDate)} às ${selectedTime}`)
  }

  return (
    <div className="space-y-6">
      {/* Delivery type */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Tipo de entrega</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 border-2 border-brand-red bg-red-50 rounded-xl text-center">
            <span className="text-2xl block mb-1">🛵</span>
            <p className="font-bold text-brand-ink text-sm">Entrega</p>
            <p className="text-xs text-brand-muted">25-35 min</p>
          </button>
          <button className="p-4 border border-brand-line rounded-xl text-center hover:border-brand-red transition-colors">
            <span className="text-2xl block mb-1">🏪</span>
            <p className="font-bold text-brand-ink text-sm">Retirada</p>
            <p className="text-xs text-brand-muted">15-20 min</p>
          </button>
        </div>
      </Card>

      {/* Schedule date */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">📅 Agendar entrega</h3>
        <p className="text-xs text-brand-muted mb-3">Escolha uma data para receber seu pedido</p>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableDates.map(date => (
            <button
              key={date.date}
              onClick={() => date.isAvailable && setSelectedDate(date.date)}
              disabled={!date.isAvailable}
              className={`flex-shrink-0 p-3 rounded-xl text-center min-w-[70px] transition-colors ${
                selectedDate === date.date
                  ? 'bg-brand-red text-white'
                  : date.isAvailable
                    ? 'bg-brand-soft text-brand-ink hover:bg-brand-line'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <p className="text-xs font-bold">{formatDate(date.date)}</p>
              <p className="text-lg font-extrabold">{new Date(date.date).getDate()}</p>
              {!date.isAvailable && <p className="text-xs">Esgotado</p>}
            </button>
          ))}
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div className="mt-4 animate-fade-up">
            <p className="text-xs text-brand-muted mb-2">Horários disponíveis</p>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedTime === slot.time
                      ? 'bg-brand-red text-white'
                      : slot.available
                        ? 'bg-brand-soft text-brand-ink hover:bg-brand-line'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Delivery tip */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-brand-ink">💰 Gorjeta para entregador</h3>
          <Badge variant="success" className="text-xs">Opcional</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {tipOptions.map(t => (
            <button
              key={t.id}
              onClick={() => handleTipSelect(t)}
              className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                t.isSelected
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-ink hover:bg-brand-line'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Custom tip */}
        {showTipCustom ? (
          <div className="flex gap-2 animate-fade-up">
            <input
              type="text"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder="Digite o valor"
              className="flex-1 px-4 py-2 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
            />
            <Button onClick={handleCustomTip}>OK</Button>
          </div>
        ) : (
          <button
            onClick={() => setShowTipCustom(true)}
            className="w-full py-2 text-sm text-brand-red hover:underline"
          >
            Outro valor...
          </button>
        )}

        {tip.isCustom && (
          <p className="text-center text-sm text-brand-muted mt-2">
            Gorjeta atual: <span className="font-bold text-brand-ink">{tip.label}</span>
          </p>
        )}
      </Card>

      {/* Summary */}
      {selectedDate && selectedTime && (
        <Card padding="md" className="bg-brand-soft">
          <h3 className="font-bold text-brand-ink mb-3">Resumo do agendamento</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">Data</span>
              <span className="font-medium text-brand-ink">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Horário</span>
              <span className="font-medium text-brand-ink">{selectedTime}</span>
            </div>
            {tip.amount > 0 && (
              <div className="flex justify-between">
                <span className="text-brand-muted">Gorjeta</span>
                <span className="font-medium text-brand-ink">{tip.label}</span>
              </div>
            )}
          </div>
          <Button onClick={handleSchedule} className="w-full mt-4">
            Confirmar agendamento
          </Button>
        </Card>
      )}
    </div>
  )
}