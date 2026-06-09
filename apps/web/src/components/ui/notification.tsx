'use client'

import { Card } from './card'
import { Button } from './button'

// ==================== NOTIFICATION ITEM ====================

interface Notification {
  id: string
  type: 'order' | 'promo' | 'loyalty' | 'system' | 'chat'
  title: string
  body: string
  data?: string
  isRead: boolean
  createdAt: string
}

interface NotificationItemProps {
  notification: Notification
  onPress?: () => void
  onDismiss?: () => void
}

export function NotificationItem({ notification, onPress, onDismiss }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'order': return '📦'
      case 'promo': return '🎉'
      case 'loyalty': return '⭐'
      case 'chat': return '💬'
      case 'system': return 'ℹ️'
      default: return '🔔'
    }
  }

  const getIconBg = () => {
    switch (notification.type) {
      case 'order': return 'bg-blue-100'
      case 'promo': return 'bg-purple-100'
      case 'loyalty': return 'bg-yellow-100'
      case 'chat': return 'bg-green-100'
      default: return 'bg-brand-soft'
    }
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div
      onClick={onPress}
      className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-brand-soft transition-colors ${
        !notification.isRead ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-full ${getIconBg()} flex items-center justify-center text-lg flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${!notification.isRead ? 'font-bold' : 'font-medium'} text-brand-ink`}>
            {notification.title}
          </p>
          <span className="text-xs text-brand-muted whitespace-nowrap">{formatTime(notification.createdAt)}</span>
        </div>
        <p className="text-sm text-brand-muted mt-0.5 line-clamp-2">{notification.body}</p>
      </div>
      {!notification.isRead && (
        <div className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0 mt-2" />
      )}
      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="text-brand-muted hover:text-brand-ink p-1"
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ==================== NOTIFICATION LIST ====================

interface NotificationListProps {
  notifications: Notification[]
  onPress?: (notification: Notification) => void
  onDismiss?: (id: string) => void
  onMarkAllRead?: () => void
}

export function NotificationList({ notifications, onPress, onDismiss, onMarkAllRead }: NotificationListProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-1">
      {unreadCount > 0 && onMarkAllRead && (
        <div className="flex justify-end p-2">
          <button onClick={onMarkAllRead} className="text-sm text-brand-red hover:underline">
            Marcar todas como lidas
          </button>
        </div>
      )}
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onPress={() => onPress?.(notification)}
          onDismiss={onDismiss ? () => onDismiss(notification.id) : undefined}
        />
      ))}
      {notifications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-5xl mb-3">🔔</p>
          <p className="text-brand-muted">Nenhuma notificação</p>
        </div>
      )}
    </div>
  )
}

// ==================== NOTIFICATION TOAST ====================

interface NotificationToastProps {
  notification: Notification
  onClose: () => void
  onPress?: () => void
}

export function NotificationToast({ notification, onClose, onPress }: NotificationToastProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'order': return '📦'
      case 'promo': return '🎉'
      case 'loyalty': return '⭐'
      case 'chat': return '💬'
      default: return '🔔'
    }
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
      <Card
        padding="md"
        className="bg-white shadow-lg border-l-4 border-brand-red cursor-pointer hover:shadow-xl transition-shadow"
        onClick={onPress}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getIcon()}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-brand-ink truncate">{notification.title}</p>
            <p className="text-sm text-brand-muted truncate">{notification.body}</p>
          </div>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-ink">
            ✕
          </button>
        </div>
      </Card>
    </div>
  )
}

// ==================== PUSH NOTIFICATION PROMPT ====================

interface PushNotificationPromptProps {
  onAccept: () => void
  onDismiss: () => void
}

export function PushNotificationPrompt({ onAccept, onDismiss }: PushNotificationPromptProps) {
  return (
    <Card padding="lg" className="bg-gradient-to-br from-brand-red to-brand-red-dark text-white">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
          🔔
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="font-bold text-lg">Ative as notificações</h3>
          <p className="text-sm opacity-90">
            Receba atualizações em tempo real sobre seus pedidos, promoções exclusivas e muito mais!
          </p>
          <div className="flex gap-2">
            <Button onClick={onAccept} className="flex-1 bg-white text-brand-red">
              Ativar
            </Button>
            <Button onClick={onDismiss} variant="ghost" className="text-white">
              Agora não
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
