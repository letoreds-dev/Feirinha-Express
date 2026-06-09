/**
 * Feirinha Express - Offline Banner & Connection Status
 * Offline-first support with sync indicators
 */

'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== TYPES ====================

type ConnectionStatus = 'online' | 'offline' | 'slow' | 'reconnecting'

interface OfflineContextType {
  isOnline: boolean
  status: ConnectionStatus
  lastOnline: Date | null
  syncQueue: SyncItem[]
  addToSyncQueue: (item: Omit<SyncItem, 'id' | 'createdAt' | 'attempts'>) => void
  retrySync: () => Promise<void>
  pendingActions: number
}

interface SyncItem {
  id: string
  type: 'order' | 'favorite' | 'review' | 'cart'
  action: 'create' | 'update' | 'delete'
  data: Record<string, unknown>
  createdAt: Date
  attempts: number
}

// ==================== CONTEXT ====================

const OfflineContext = createContext<OfflineContextType | null>(null)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [status, setStatus] = useState<ConnectionStatus>('online')
  const [lastOnline, setLastOnline] = useState<Date | null>(null)
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([])

  useEffect(() => {
    // Load sync queue from localStorage
    const saved = localStorage.getItem('syncQueue')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSyncQueue(parsed.map((item: SyncItem) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        })))
      } catch {}
    }

    // Online/Offline detection
    const handleOnline = () => {
      setIsOnline(true)
      setStatus('online')
    }

    const handleOffline = () => {
      setIsOnline(false)
      setStatus('offline')
      setLastOnline(new Date())
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial state
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Persist sync queue
  useEffect(() => {
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue))
  }, [syncQueue])

  // Auto-sync when back online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      setStatus('reconnecting')
      const timeout = setTimeout(async () => {
        await retrySync()
        setStatus('online')
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isOnline])

  const addToSyncQueue = useCallback((item: Omit<SyncItem, 'id' | 'createdAt' | 'attempts'>) => {
    const newItem: SyncItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      attempts: 0,
    }
    setSyncQueue(prev => [...prev, newItem])
  }, [])

  const retrySync = useCallback(async () => {
    for (const item of syncQueue) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        // Remove from queue on success
        setSyncQueue(prev => prev.filter(i => i.id !== item.id))
      } catch {
        // Increment attempts
        setSyncQueue(prev => prev.map(i =>
          i.id === item.id ? { ...i, attempts: i.attempts + 1 } : i
        ))
      }
    }
  }, [syncQueue])

  return (
    <OfflineContext.Provider value={{
      isOnline,
      status,
      lastOnline,
      syncQueue,
      addToSyncQueue,
      retrySync,
      pendingActions: syncQueue.length,
    }}>
      {children}
    </OfflineContext.Provider>
  )
}

// ==================== HOOK ====================

export function useOfflineStatus() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOfflineStatus must be used within OfflineProvider')
  }
  return context
}

// ==================== OFFLINE BANNER ====================

interface OfflineBannerProps {
  minimal?: boolean
}

export function OfflineBanner({ minimal = false }: OfflineBannerProps) {
  const { isOnline, status, lastOnline, syncQueue } = useOfflineStatus()

  if (isOnline && syncQueue.length === 0) return null

  const formatLastOnline = () => {
    if (!lastOnline) return ''
    const now = new Date()
    const diff = now.getTime() - lastOnline.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'agora'
    if (minutes < 60) return `${minutes}min`
    if (hours < 24) return `${hours}h`
    return 'mais de 1 dia'
  }

  if (!isOnline) {
    return (
      <div className={`${
        minimal ? 'py-2 px-4' : 'p-4'
      } bg-gradient-to-r from-amber-500 to-orange-500 text-white`}>
        <div className="max-w-[390px] mx-auto flex items-center gap-3">
          <span className="text-2xl">📡</span>
          <div className="flex-1">
            <p className="font-bold">Você está offline</p>
            {!minimal && (
              <p className="text-sm opacity-90">
                Algumas funcionalidades podem estar limitadas
              </p>
            )}
          </div>
          {syncQueue.length > 0 && (
            <Badge variant="warning" className="bg-white text-amber-600">
              {syncQueue.length} pendente{syncQueue.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  if (status === 'reconnecting') {
    return (
      <div className={`${
        minimal ? 'py-2 px-4' : 'p-4'
      } bg-gradient-to-r from-blue-500 to-cyan-500 text-white`}>
        <div className="max-w-[390px] mx-auto flex items-center gap-3">
          <span className="text-2xl animate-pulse">🔄</span>
          <div className="flex-1">
            <p className="font-bold">Sincronizando...</p>
            {!minimal && (
              <p className="text-sm opacity-90">
                {syncQueue.length} ação(s) sendo enviada(s)
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (syncQueue.length > 0) {
    return (
      <div className={`${
        minimal ? 'py-2 px-4' : 'p-4'
      } bg-gradient-to-r from-yellow-500 to-amber-500 text-white`}>
        <div className="max-w-[390px] mx-auto flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div className="flex-1">
            <p className="font-bold">{syncQueue.length} ação(ões) pendente(s)</p>
            {!minimal && (
              <p className="text-sm opacity-90">
                Será sincronizada quando a conexão melhorar
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

// ==================== CONNECTION QUALITY INDICATOR ====================

export function ConnectionQualityIndicator() {
  const { isOnline, status } = useOfflineStatus()

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-red-500">●</span>
        <span className="text-xs text-red-500">Offline</span>
      </div>
    )
  }

  if (status === 'reconnecting') {
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-500 animate-pulse">●</span>
        <span className="text-xs text-yellow-500">Sincronizando</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-emerald-500">●</span>
      <span className="text-xs text-emerald-500">Online</span>
    </div>
  )
}

// ==================== SYNC QUEUE MANAGER ====================

export function SyncQueueManager() {
  const { syncQueue, retrySync, pendingActions } = useOfflineStatus()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleRetry = async () => {
    setIsSyncing(true)
    await retrySync()
    setIsSyncing(false)
  }

  const getTypeIcon = (type: SyncItem['type']) => {
    switch (type) {
      case 'order': return '📦'
      case 'favorite': return '❤️'
      case 'review': return '⭐'
      case 'cart': return '🛒'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}min`
    return `${Math.floor(minutes / 60)}h`
  }

  if (syncQueue.length === 0) {
    return (
      <Card padding="md">
        <div className="text-center py-4">
          <p className="text-4xl mb-2">✅</p>
          <p className="font-medium text-brand-ink">Tudo sincronizado!</p>
          <p className="text-sm text-brand-muted">Não há ações pendentes</p>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-ink">🔄 Fila de Sincronização</h3>
        <Badge variant="warning">{pendingActions}</Badge>
      </div>

      <div className="space-y-2">
        {syncQueue.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-brand-soft rounded-xl"
          >
            <span className="text-2xl">{getTypeIcon(item.type)}</span>
            <div className="flex-1">
              <p className="font-medium text-brand-ink capitalize">
                {item.action} {item.type}
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <span>{formatTime(new Date(item.createdAt))}</span>
                {item.attempts > 0 && (
                  <span>• {item.attempts} tentativa(s)</span>
                )}
              </div>
            </div>
            <Badge variant={item.attempts > 2 ? 'error' : 'warning'}>
              {item.attempts > 2 ? 'Falhou' : 'Pendente'}
            </Badge>
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={handleRetry}
        loading={isSyncing}
        className="w-full mt-4"
      >
        {isSyncing ? 'Sincronizando...' : 'Tentar sincronizar agora'}
      </Button>
    </Card>
  )
}

// ==================== OFFLINE DATA INDICATOR ====================

interface OfflineDataInfoProps {
  data: {
    savedProducts: number
    savedStores: number
    cachedPages: number
  }
}

export function OfflineDataInfo({ data }: OfflineDataInfoProps) {
  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-3">📱 Dados Offline</h3>
      <p className="text-sm text-brand-muted mb-4">
        Alguns dados estão salvos para uso offline
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-brand-soft rounded-xl">
          <p className="text-2xl font-bold text-brand-ink">{data.savedProducts}</p>
          <p className="text-xs text-brand-muted">Produtos</p>
        </div>
        <div className="text-center p-3 bg-brand-soft rounded-xl">
          <p className="text-2xl font-bold text-brand-ink">{data.savedStores}</p>
          <p className="text-xs text-brand-muted">Lojas</p>
        </div>
        <div className="text-center p-3 bg-brand-soft rounded-xl">
          <p className="text-2xl font-bold text-brand-ink">{data.cachedPages}</p>
          <p className="text-xs text-brand-muted">Páginas</p>
        </div>
      </div>
    </Card>
  )
}

// ==================== OFFLINE PAGE WRAPPER ====================

interface OfflinePageWrapperProps {
  children: React.ReactNode
}

export function OfflinePageWrapper({ children }: OfflinePageWrapperProps) {
  const { isOnline } = useOfflineStatus()

  return (
    <div className="min-h-screen bg-brand-paper">
      {!isOnline && <OfflineBanner />}
      {children}
    </div>
  )
}

// ==================== DEMO COMPONENT ====================

export function OfflineDemo() {
  const { isOnline, status, addToSyncQueue, syncQueue } = useOfflineStatus()

  const simulateOffline = () => {
    // This is just for demo - in real app, toggle navigator.onLine
    const banner = document.querySelector('[data-offline-banner]')
    if (banner) {
      banner.setAttribute('data-offline', 'true')
    }
  }

  const addDemoItem = () => {
    addToSyncQueue({
      type: 'order',
      action: 'create',
      data: { productId: '123', quantity: 2 },
    })
  }

  return (
    <div className="space-y-4">
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">📡 Status da Conexão</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className={`w-4 h-4 rounded-full ${
            isOnline ? 'bg-emerald-500' : 'bg-red-500'
          }`} />
          <div>
            <p className="font-medium text-brand-ink">
              {isOnline ? 'Online' : 'Offline'}
            </p>
            <p className="text-sm text-brand-muted">
              Status: {status}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={addDemoItem}>
            + Adicionar item à fila (demo)
          </Button>
        </div>
      </Card>

      {syncQueue.length > 0 && (
        <SyncQueueManager />
      )}

      <OfflineDataInfo
        data={{
          savedProducts: 24,
          savedStores: 8,
          cachedPages: 12,
        }}
      />

      <Card padding="md" className="bg-blue-50 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">💡 Dica</h3>
        <p className="text-sm text-blue-800">
          Suas ações são salvas automaticamente e sincronizadas quando a conexão voltar.
          Você pode continuar usando o app mesmo offline!
        </p>
      </Card>
    </div>
  )
}