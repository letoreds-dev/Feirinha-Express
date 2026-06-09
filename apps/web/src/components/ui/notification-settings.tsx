'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface NotificationPreferences {
  orderUpdates: boolean
  promotions: boolean
  recommendations: boolean
  stockAlerts: boolean
  news: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotions: true,
    recommendations: false,
    stockAlerts: true,
    news: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  })
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default')

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermissionStatus(Notification.permission)
    }
  }, [])

  const requestPushPermission = async () => {
    if (typeof Notification === 'undefined') return

    try {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)
      if (permission === 'granted') {
        toast.success('Notificações ativadas!', 'Você receberá atualizações sobre seus pedidos')
      } else {
        toast.error('Permissão negada', 'Ative nas configurações do navegador')
      }
    } catch (error) {
      toast.error('Erro ao solicitar permissão')
    }
  }

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Preferência atualizada')
  }

  const notificationGroups = [
    {
      title: '📱 Notificações push',
      items: [
        {
          key: 'pushNotifications' as const,
          label: 'Notificações no navegador',
          description: 'Receba alertas mesmo quando o app está fechado',
          icon: '🔔',
        },
        {
          key: 'smsNotifications' as const,
          label: 'SMS',
          description: 'Receba lembretes por mensagem de texto',
          icon: '📲',
          requiresPermission: true,
        },
      ],
    },
    {
      title: '📧 E-mail',
      items: [
        {
          key: 'emailNotifications' as const,
          label: 'E-mails',
          description: 'Resumo diário e novidades',
          icon: '✉️',
        },
      ],
    },
    {
      title: '📢 Tipos de notificação',
      items: [
        {
          key: 'orderUpdates' as const,
          label: 'Atualizações de pedido',
          description: 'Status, rastreamento, entrega',
          icon: '📦',
        },
        {
          key: 'promotions' as const,
          label: 'Promoções e ofertas',
          description: 'Descontos exclusivos e cupons',
          icon: '🏷️',
        },
        {
          key: 'recommendations' as const,
          label: 'Recomendações',
          description: 'Produtos baseado no seu perfil',
          icon: '✨',
        },
        {
          key: 'stockAlerts' as const,
          label: 'Aviso de estoque',
          description: 'Produtos favoritos de volta',
          icon: '📭',
        },
        {
          key: 'news' as const,
          label: 'Novidades',
          description: 'Novas funcionalidades e atualizações',
          icon: '🆕',
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Push permission banner */}
      {permissionStatus === 'default' && (
        <Card padding="md" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🔔</span>
            <div className="flex-1">
              <h3 className="font-bold text-brand-ink">Ative as notificações</h3>
              <p className="text-sm text-brand-muted mt-1">
                Receba alertas em tempo real sobre seus pedidos e promoções exclusivas
              </p>
              <Button onClick={requestPushPermission} className="mt-3">
                Ativar notificações
              </Button>
            </div>
          </div>
        </Card>
      )}

      {permissionStatus === 'denied' && (
        <Card padding="md" className="bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-bold text-amber-800">Notificações bloqueadas</h3>
              <p className="text-sm text-amber-600 mt-1">
                Para reativar, vá até as configurações do seu navegador e permita notificações para este site.
              </p>
              <button
                onClick={() => window.open('chrome://settings/content/notifications', '_blank')}
                className="mt-2 text-sm text-amber-700 underline"
              >
                Abrir configurações
              </button>
            </div>
          </div>
        </Card>
      )}

      {permissionStatus === 'granted' && (
        <Card padding="md" className="bg-emerald-50 border-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-bold text-emerald-800">Notificações ativas</span>
          </div>
        </Card>
      )}

      {/* Notification groups */}
      {notificationGroups.map((group, idx) => (
        <Card key={idx} padding="md">
          <h3 className="font-bold text-brand-ink mb-4">{group.title}</h3>
          <div className="space-y-4">
            {group.items.map(item => (
              <div key={item.key} className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-brand-ink">{item.label}</p>
                    <p className="text-xs text-brand-muted">{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    onChange={() => togglePreference(item.key)}
                    className="sr-only peer"
                    disabled={'requiresPermission' in item && item.requiresPermission && permissionStatus !== 'granted'}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red after:transition-all disabled:opacity-50"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Test notification */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Testar notificações</h3>
        <p className="text-sm text-brand-muted mb-4">
          Receba uma notificação de teste para verificar se está tudo funcionando
        </p>
        <Button
          variant="outline"
          onClick={() => {
            toast.info('Testando...', 'Você receberá uma notificação em breve')
            setTimeout(() => {
              if (Notification.permission === 'granted') {
                new Notification('Feirinha Express', {
                  body: 'Notificações funcionando! 🎉',
                  icon: '🍎',
                })
              }
            }, 2000)
          }}
          className="w-full"
        >
          📤 Enviar notificação de teste
        </Button>
      </Card>

      {/* Notification history */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Histórico recente</h3>
        <div className="space-y-3">
          {[
            { icon: '📦', title: 'Pedido confirmado', time: 'há 2 min', read: false },
            { icon: '🎁', title: 'Novo cupom disponível', time: 'há 1 hora', read: false },
            { icon: '⭐', title: 'Seu pedido foi entregue', time: 'há 3 horas', read: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl ${item.read ? 'bg-brand-soft' : 'bg-blue-50 border border-blue-100'}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm ${item.read ? 'text-brand-muted' : 'text-brand-ink font-medium'}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-brand-muted">{item.time}</p>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 bg-brand-red rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}