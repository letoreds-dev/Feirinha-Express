'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface SettingsOption {
  id: string
  title: string
  description: string
  icon: string
  type: 'navigation' | 'toggle' | 'action'
  href?: string
  onClick?: () => void
}

const settingsOptions: SettingsOption[] = [
  {
    id: 'profile',
    title: 'Editar perfil',
    description: 'Nome, foto, e-mail',
    icon: '👤',
    type: 'navigation',
    href: '/user/profile',
  },
  {
    id: 'addresses',
    title: 'Endereços',
    description: 'Gerenciar endereços de entrega',
    icon: '🏠',
    type: 'navigation',
    href: '/user/addresses',
  },
  {
    id: 'payments',
    title: 'Pagamentos',
    description: 'Cartões e métodos de pagamento',
    icon: '💳',
    type: 'navigation',
    href: '/user/payments',
  },
  {
    id: 'notifications',
    title: 'Notificações',
    description: 'Configurar alertas e push',
    icon: '🔔',
    type: 'navigation',
    href: '/user/notifications',
  },
  {
    id: 'privacy',
    title: 'Privacidade',
    description: 'Dados e segurança',
    icon: '🔒',
    type: 'navigation',
  },
  {
    id: 'help',
    title: 'Ajuda',
    description: 'FAQ e suporte',
    icon: '❓',
    type: 'navigation',
    href: '/user/help',
  },
]

export function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [biometric, setBiometric] = useState(false)

  return (
    <div className="space-y-6">
      {/* Quick toggles */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Preferências</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌙</span>
              <div>
                <p className="font-medium text-brand-ink">Modo escuro</p>
                <p className="text-xs text-brand-muted">Trocar tema do app</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <p className="font-medium text-brand-ink">Biometria</p>
                <p className="text-xs text-brand-muted">Usar impressão digital</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={biometric}
                onChange={() => setBiometric(!biometric)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Settings list */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Conta</h3>
        <div className="space-y-2">
          {settingsOptions.map(option => (
            <Link
              key={option.id}
              href={option.href || '#'}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-soft transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <p className="font-medium text-brand-ink">{option.title}</p>
                  <p className="text-xs text-brand-muted">{option.description}</p>
                </div>
              </div>
              <span className="text-brand-muted">→</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* App info */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Sobre o app</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">Versão</span>
            <span className="text-sm font-medium text-brand-ink">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">Build</span>
            <span className="text-sm font-medium text-brand-ink">2024.01.15</span>
          </div>
          <Link href="/terms" className="flex items-center justify-between py-2 hover:text-brand-red">
            <span className="text-sm text-brand-muted">Termos de uso</span>
            <span className="text-brand-muted">→</span>
          </Link>
          <Link href="/privacy" className="flex items-center justify-between py-2 hover:text-brand-red">
            <span className="text-sm text-brand-muted">Política de privacidade</span>
            <span className="text-brand-muted">→</span>
          </Link>
        </div>
      </Card>

      {/* Danger zone */}
      <Card padding="md" className="border-red-200 bg-red-50">
        <h3 className="font-bold text-red-700 mb-4">Zona de perigo</h3>
        <div className="space-y-3">
          <button className="w-full p-3 text-left rounded-xl hover:bg-red-100 transition-colors">
            <p className="font-medium text-red-700">Limpar dados de navegação</p>
            <p className="text-xs text-red-500">Remove histórico e cache</p>
          </button>
          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
                toast.error('Conta excluída')
              }
            }}
            className="w-full p-3 text-left rounded-xl hover:bg-red-100 transition-colors"
          >
            <p className="font-medium text-red-700">Excluir conta</p>
            <p className="text-xs text-red-500">Remove todos os seus dados</p>
          </button>
        </div>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full border-red-200 text-red-600 hover:bg-red-50"
      >
        🚪 Sair da conta
      </Button>

      {/* Footer */}
      <p className="text-center text-xs text-brand-muted py-4">
        Feirinha Express © 2024<br />
        Feito com ❤️ no Brasil
      </p>
    </div>
  )
}