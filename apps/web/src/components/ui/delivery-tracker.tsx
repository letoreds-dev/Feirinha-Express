'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface DeliveryPerson {
  id: string
  name: string
  photo?: string
  rating: number
  deliveries: number
  vehicle: 'bike' | 'moto' | 'car'
  phone: string
}

interface Location {
  lat: number
  lng: number
  address: string
}

export function DeliveryTracker() {
  const [isLive, setIsLive] = useState(true)
  const [progress, setProgress] = useState(65)
  const [estimatedTime, setEstimatedTime] = useState(12)

  const deliveryPerson: DeliveryPerson = {
    id: '1',
    name: 'Carlos Silva',
    rating: 4.9,
    deliveries: 1250,
    vehicle: 'moto',
    phone: '(11) 98765-4321',
  }

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsLive(false)
          return 100
        }
        return prev + 1
      })
      setEstimatedTime(prev => Math.max(0, prev - 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive])

  const callDeliveryPerson = () => {
    window.location.href = `tel:${deliveryPerson.phone}`
  }

  const messageDeliveryPerson = () => {
    toast.info('Abrindo WhatsApp...')
  }

  return (
    <div className="space-y-4">
      {/* Map placeholder */}
      <Card padding="md" className="bg-gradient-to-br from-brand-soft to-blue-50">
        <div className="relative h-48 rounded-xl bg-white border-2 border-dashed border-brand-line overflow-hidden">
          {/* Simulated map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🗺️</div>
              <p className="text-sm text-brand-muted">Mapa em tempo real</p>
            </div>
          </div>

          {/* Animated delivery marker */}
          <div
            className="absolute transition-all duration-1000"
            style={{ left: `${progress}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center text-2xl animate-bounce">
                🛵
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-red rounded-full" />
            </div>
          </div>

          {/* Destination marker */}
          <div className="absolute bottom-4 right-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-xl text-white">
              📍
            </div>
          </div>
        </div>

        {/* ETA */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-sm text-brand-muted">Tempo estimado</p>
            <p className="text-2xl font-extrabold text-brand-ink">
              {estimatedTime} <span className="text-sm font-normal">minutos</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-brand-muted">Progresso</p>
            <p className="text-lg font-bold text-brand-red">{progress}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-red to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* Delivery person card */}
      <Card padding="md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center text-3xl">
            👨‍🚀
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-brand-ink">{deliveryPerson.name}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-brand-muted">
              <span>⭐ {deliveryPerson.rating}</span>
              <span>•</span>
              <span>{deliveryPerson.deliveries} entregas</span>
              <span>•</span>
              <span>🛵</span>
            </div>
          </div>
          {isLive && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-600 font-medium">Ao vivo</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button onClick={callDeliveryPerson} className="flex-1">
            📞 Ligar
          </Button>
          <Button variant="outline" onClick={messageDeliveryPerson} className="flex-1">
            💬 Mensagem
          </Button>
        </div>
      </Card>

      {/* Delivery steps */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Status da entrega</h3>
        <div className="space-y-4">
          {[
            { step: 'Pedido confirmado', time: '14:30', done: true, icon: '✅' },
            { step: 'Saindo para entrega', time: '14:45', done: true, icon: '🛵' },
            { step: 'A caminho', time: '14:52', done: true, icon: '📍', active: true },
            { step: 'Entregue', time: '15:05', done: false, icon: '🎉' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.active
                  ? 'bg-brand-red text-white animate-pulse'
                  : item.done
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${item.done || item.active ? 'text-brand-ink' : 'text-brand-muted'}`}>
                  {item.step}
                </p>
                <p className="text-xs text-brand-muted">{item.time}</p>
              </div>
              {item.done && !item.active && (
                <span className="text-emerald-500">✓</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Order details */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Resumo</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-muted">Pedido</span>
            <span className="font-medium text-brand-ink">#FE-2024-1234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Loja</span>
            <span className="font-medium text-brand-ink">Burguer House</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Endereço</span>
            <span className="font-medium text-brand-ink">Rua das Flores, 123</span>
          </div>
        </div>
      </Card>

      {/* Help */}
      <Button variant="ghost" className="w-full">
        ❓ Precisa de ajuda com a entrega?
      </Button>
    </div>
  )
}