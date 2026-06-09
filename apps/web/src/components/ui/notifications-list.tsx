'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'

interface Notification {
  id: string
  type: 'order' | 'promo' | 'system' | 'reminder'
  title: string
  message: string
  time: string
  read: boolean
  icon: string
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'order', title: 'Pedido confirmado!', message: 'O Burguer House confirmou seu pedido #FE-1234', time: 'agora', read: false, icon: '📦', actionUrl: '/user/orders/1234' },
  { id: '2', type: 'order', title: 'Saiu para entrega!', message: 'Seu pedido está a caminho. Tempo estimado: 15 min', time: '5 min', read: false, icon: '🛵', actionUrl: '/user/tracking/1234' },
  { id: '3', type: 'promo', title: '🎁 Novo cupom!', message: 'Você ganhou 15% OFF! Use PRIMEIRACOMPRA', time: '1 hora', read: false, icon: '🎟️' },
  { id: '4', type: 'order', title: 'Pedido entregue!', message: 'Aproveite seu hambúrguer! Avalie sua experiência.', time: '2 horas', read: true, icon: '✅', actionUrl: '/user/reviews' },
  { id: '5', type: 'system', title: 'Senha atualizada', message: 'Sua senha foi alterada com sucesso.', time: '1 dia', read: true, icon: '🔐' },
  { id: '6', type: 'promo', title: 'Frete grátis hoje!', message: 'Todas as lojas com entrega gratuita hoje.', time: '3 horas', read: true, icon: '🚚' },
  { id: '7', type: 'reminder', title: '⏰ Não esqueça!', message: 'Seu pedido agendado para amanhã às 12h.', time: '1 dia', read: true, icon: '📅' },
]

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'order' | 'promo'>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const filteredNotifications = notifications.filter(n => {
    if (showUnreadOnly && n.read) return false
    if (filter === 'order' && n.type !== 'order') return false
    if (filter === 'promo' && n.type !== 'promo') return false
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return '📦'
      case 'promo': return '🎁'
      case 'system': return '⚙️'
      case 'reminder': return '⏰'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-brand-ink">Notificações</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-brand-muted">{unreadCount} não lidas</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-brand-red hover:underline"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'order', label: '📦 Pedidos' },
          { key: 'promo', label: '🎁 Promoções' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Unread toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showUnreadOnly}
          onChange={(e) => setShowUnreadOnly(e.target.checked)}
          className="w-4 h-4 accent-brand-red"
        />
        <span className="text-sm text-brand-muted">Mostrar apenas não lidas</span>
      </label>

      {/* Notifications list */}
      {filteredNotifications.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-5xl mb-3">🔔</p>
          <p className="font-bold text-brand-ink">Nenhuma notificação</p>
          <p className="text-sm text-brand-muted">
            {showUnreadOnly ? 'Todas as notificações foram lidas!' : 'Você está em dia!'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              padding="md"
              className={`cursor-pointer transition-all hover:scale-[1.01] ${
                notification.read ? 'opacity-70' : 'bg-red-50 border border-red-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  notification.read ? 'bg-brand-soft' : 'bg-red-100'
                }`}>
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className={`font-bold ${notification.read ? 'text-brand-muted' : 'text-brand-ink'}`}>
                      {notification.title}
                    </p>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <span className="w-2 h-2 bg-brand-red rounded-full" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="text-brand-muted hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-brand-muted mt-1">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-brand-muted">{notification.time}</span>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          className="text-xs text-brand-red hover:underline"
                        >
                          Marcar como lida
                        </button>
                      )}
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          className="text-xs text-brand-red font-medium hover:underline"
                        >
                          Ver →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}