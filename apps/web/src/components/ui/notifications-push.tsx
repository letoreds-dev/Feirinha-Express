/**
 * Feirinha Express - Push Notifications System
 * Real-time notifications with permission handling
 */

'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== TYPES ====================

interface Notification {
  id: string
  title: string
  body: string
  icon?: string
  timestamp: Date
  read: boolean
  type: 'order' | 'promo' | 'system' | 'chat'
  data?: Record<string, unknown>
}

interface NotificationPreferences {
  orderUpdates: boolean
  promotions: boolean
  recommendations: boolean
  chat: boolean
  sound: boolean
  vibration: boolean
}

// ==================== CONTEXT ====================

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  hasPermission: boolean
  requestPermission: () => Promise<boolean>
  preferences: NotificationPreferences
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [hasPermission, setHasPermission] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotions: true,
    recommendations: true,
    chat: true,
    sound: true,
    vibration: true,
  })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notifications')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setNotifications(parsed.map((n: Notification) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })))
      } catch {}
    }

    // Check permission
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted')
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 50))

    // Show browser notification if permitted
    if (hasPermission && preferences.sound) {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/icon.png',
      })
    }
  }, [hasPermission, preferences.sound])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false

    const permission = await Notification.requestPermission()
    const granted = permission === 'granted'
    setHasPermission(granted)
    return granted
  }, [])

  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }))
    localStorage.setItem('notificationPreferences', JSON.stringify({ ...preferences, ...prefs }))
  }, [preferences])

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      hasPermission,
      requestPermission,
      preferences,
      updatePreferences,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

// ==================== HOOK ====================

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

// ==================== COMPONENTS ====================

interface NotificationBellProps {
  showBadge?: boolean
  onClick?: () => void
}

export function NotificationBell({ showBadge = true, onClick }: NotificationBellProps) {
  const { unreadCount } = useNotifications()

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-brand-soft transition-colors"
    >
      <span className="text-2xl">🔔</span>
      {showBadge && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
  onDelete?: () => void
}

export function NotificationItem({ notification, onClick, onDelete }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'order': return '📦'
      case 'promo': return '🎁'
      case 'chat': return '💬'
      default: return '🔔'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}min`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-4 hover:bg-brand-soft cursor-pointer transition-colors ${
        !notification.read ? 'bg-brand-soft' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
        !notification.read ? 'bg-brand-red text-white' : 'bg-brand-line'
      }`}>
        {notification.icon || getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <p className={`text-sm ${!notification.read ? 'font-bold' : ''}`}>
            {notification.title}
          </p>
          <span className="text-xs text-brand-muted ml-2">
            {formatTime(notification.timestamp)}
          </span>
        </div>
        <p className="text-sm text-brand-muted line-clamp-2 mt-1">
          {notification.body}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.()
        }}
        className="text-brand-muted hover:text-red-500"
      >
        ✕
      </button>
    </div>
  )
}

interface NotificationListProps {
  maxItems?: number
}

export function NotificationList({ maxItems = 20 }: NotificationListProps) {
  const { notifications, markAsRead, deleteNotification, clearAll, unreadCount, markAllAsRead } = useNotifications()

  const displayNotifications = notifications.slice(0, maxItems)

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-3">🔔</p>
        <p className="text-brand-muted">Nenhuma notificação</p>
      </div>
    )
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div className="p-3 border-b border-brand-line flex items-center justify-between">
          <span className="text-sm text-brand-muted">
            {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
          </span>
          <button
            onClick={markAllAsRead}
            className="text-sm text-brand-red"
          >
            Marcar todas como lida
          </button>
        </div>
      )}

      <div className="divide-y divide-brand-line">
        {displayNotifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={() => markAsRead(notification.id)}
            onDelete={() => deleteNotification(notification.id)}
          />
        ))}
      </div>

      <div className="p-4 border-t border-brand-line">
        <button
          onClick={clearAll}
          className="w-full text-sm text-red-500 hover:bg-red-50 py-2 rounded-lg"
        >
          Limpar todas
        </button>
      </div>
    </div>
  )
}

interface NotificationSettingsProps {
  onBack?: () => void
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const { preferences, updatePreferences, hasPermission, requestPermission } = useNotifications()

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-brand-ink">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-colors ${checked ? 'bg-brand-red' : 'bg-brand-line'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-brand-muted">←</button>
        )}
        <h2 className="text-lg font-bold text-brand-ink">🔔 Notificações</h2>
      </div>

      {!hasPermission && (
        <Card padding="md" className="bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📱</span>
            <div className="flex-1">
              <p className="font-medium text-blue-900">Ativar notificações</p>
              <p className="text-sm text-blue-700 mt-1">
                Receba alertas sobre seus pedidos e promoções
              </p>
              <Button
                onClick={requestPermission}
                variant="primary"
                size="sm"
                className="mt-3"
              >
                Ativar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-2">Tipos de notificação</h3>
        <div className="divide-y divide-brand-line">
          <Toggle
            checked={preferences.orderUpdates}
            onChange={(v) => updatePreferences({ orderUpdates: v })}
            label="Atualizações de pedido"
          />
          <Toggle
            checked={preferences.promotions}
            onChange={(v) => updatePreferences({ promotions: v })}
            label="Promoções e ofertas"
          />
          <Toggle
            checked={preferences.recommendations}
            onChange={(v) => updatePreferences({ recommendations: v })}
            label="Recomendações"
          />
          <Toggle
            checked={preferences.chat}
            onChange={(v) => updatePreferences({ chat: v })}
            label="Mensagens do chat"
          />
        </div>
      </Card>

      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-2">Som e vibração</h3>
        <div className="divide-y divide-brand-line">
          <Toggle
            checked={preferences.sound}
            onChange={(v) => updatePreferences({ sound: v })}
            label="Som de notificação"
          />
          <Toggle
            checked={preferences.vibration}
            onChange={(v) => updatePreferences({ vibration: v })}
            label="Vibração"
          />
        </div>
      </Card>
    </div>
  )
}

// ==================== DEMO COMPONENT ====================

export function NotificationDemo() {
  const { addNotification, notifications } = useNotifications()

  const triggerDemo = () => {
    addNotification({
      title: '🍔 Pedido confirmado!',
      body: 'Seu pedido #1234 foi confirmado e está sendo preparado.',
      type: 'order',
    })
  }

  return (
    <div className="space-y-4">
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">🔔 Demo de Notificações</h3>
        <p className="text-sm text-brand-muted mb-4">
          Clique no botão para adicionar uma notificação de demo.
        </p>
        <Button onClick={triggerDemo} className="w-full">
          Adicionar Notificação Demo
        </Button>
      </Card>

      <Card padding="none">
        <NotificationList maxItems={5} />
      </Card>

      <NotificationSettings />
    </div>
  )
}