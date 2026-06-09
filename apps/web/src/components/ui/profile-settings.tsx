/**
 * Feirinha Express - Complete Profile Management
 * User profile, settings and account management
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { AnimatedToggle } from '@/components/ui/micro-interactions'

// ==================== TYPES ====================

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  memberSince: Date
  totalOrders: number
  totalSpent: number
  level: number
  points: number
}

interface AppSettings {
  notifications: {
    orders: boolean
    promotions: boolean
    recommendations: boolean
    chat: boolean
  }
  appearance: {
    darkMode: boolean
    largeText: boolean
  }
  privacy: {
    showProfile: boolean
    shareLocation: boolean
  }
}

// ==================== PROFILE HEADER ====================

interface ProfileHeaderProps {
  profile: UserProfile
  onEdit: () => void
}

export function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <Card padding="md" className="bg-gradient-to-br from-brand-red to-red-700 text-white">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-4xl">
          {profile.avatar}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold">{profile.name}</h2>
          <p className="text-white text-opacity-80 text-sm">{profile.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="warning" className="bg-yellow-400 text-yellow-900">
              ⭐ Nível {profile.level}
            </Badge>
            <span className="text-sm text-white text-opacity-80">
              Membro desde {formatDate(profile.memberSince)}
            </span>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30"
        >
          ✏️
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white border-opacity-20">
        <div className="text-center">
          <p className="text-2xl font-extrabold">{profile.totalOrders}</p>
          <p className="text-xs text-white text-opacity-80">Pedidos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-extrabold">R$ {profile.totalSpent.toFixed(0)}</p>
          <p className="text-xs text-white text-opacity-80">Gasto total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-extrabold">{profile.points.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-white text-opacity-80">Pontos</p>
        </div>
      </div>
    </Card>
  )
}

// ==================== PROFILE EDIT FORM ====================

interface ProfileEditFormProps {
  profile: UserProfile
  onSave: (data: Partial<UserProfile>) => void
  onCancel: () => void
}

export function ProfileEditForm({ profile, onSave, onCancel }: ProfileEditFormProps) {
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)
  const [avatar, setAvatar] = useState(profile.avatar)

  const avatars = ['😀', '😎', '🤓', '🥳', '🤩', '😇', '🙂', '😋', '🍔', '🍕']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, email, phone, avatar })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar selector */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-brand-soft flex items-center justify-center text-5xl mb-3">
          {avatar}
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {avatars.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`w-10 h-10 rounded-full text-xl ${
                avatar === a ? 'bg-brand-red text-white' : 'bg-brand-soft'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Telefone"
        value={phone}
        onChange={(e) => {
          let v = e.target.value.replace(/\D/g, '')
          if (v.length > 11) v = v.slice(0, 11)
          if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
          else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`
          setPhone(v)
        }}
        placeholder="(00) 00000-0000"
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Salvar
        </Button>
      </div>
    </form>
  )
}

// ==================== SETTINGS SECTIONS ====================

interface SettingsSectionProps {
  title: string
  icon: string
  children: React.ReactNode
}

export function SettingsSection({ title, icon, children }: SettingsSectionProps) {
  return (
    <Card padding="md">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-bold text-brand-ink">{title}</h3>
      </div>
      {children}
    </Card>
  )
}

// ==================== SETTINGS PAGE ====================

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: {
      orders: true,
      promotions: true,
      recommendations: false,
      chat: true,
    },
    appearance: {
      darkMode: false,
      largeText: false,
    },
    privacy: {
      showProfile: true,
      shareLocation: true,
    },
  })

  const updateSetting = (path: string, value: boolean) => {
    setSettings(prev => {
      const keys = path.split('.')
      const newSettings = { ...prev }
      let obj: Record<string, unknown> = newSettings
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>
      }
      obj[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  return (
    <div className="space-y-4">
      {/* Notifications */}
      <SettingsSection title="Notificações" icon="🔔">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-ink">Status dos pedidos</p>
              <p className="text-sm text-brand-muted">Confirmação, preparação, entrega</p>
            </div>
            <AnimatedToggle
              checked={settings.notifications.orders}
              onChange={(v) => updateSetting('notifications.orders', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-ink">Promoções</p>
              <p className="text-sm text-brand-muted">Ofertas e cupons exclusivos</p>
            </div>
            <AnimatedToggle
              checked={settings.notifications.promotions}
              onChange={(v) => updateSetting('notifications.promotions', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-ink">Recomendações</p>
              <p className="text-sm text-brand-muted">Produtos personalizados</p>
            </div>
            <AnimatedToggle
              checked={settings.notifications.recommendations}
              onChange={(v) => updateSetting('notifications.recommendations', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-ink">Mensagens</p>
              <p className="text-sm text-brand-muted">Chat com entregador e suporte</p>
            </div>
            <AnimatedToggle
              checked={settings.notifications.chat}
              onChange={(v) => updateSetting('notifications.chat', v)}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Aparência" icon="🎨">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-ink">Modo escuro</p>
              <p className="text-sm text-brand-muted">Tema escuro para noite</p>
            </div>
            <AnimatedToggle
              checked={settings.appearance.darkMode}
              onChange={(v) => updateSetting('appearance.darkMode', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-ink">Texto grande</p>
              <p className="text-sm text-brand-muted">Aumenta o tamanho das fontes</p>
            </div>
            <AnimatedToggle
              checked={settings.appearance.largeText}
              onChange={(v) => updateSetting('appearance.largeText', v)}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection title="Privacidade" icon="🔒">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-ink">Perfil público</p>
              <p className="text-sm text-brand-muted">Outros usuários podem ver seu perfil</p>
            </div>
            <AnimatedToggle
              checked={settings.privacy.showProfile}
              onChange={(v) => updateSetting('privacy.showProfile', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-ink">Compartilhar localização</p>
              <p className="text-sm text-brand-muted">Para encontrar lojas próximas</p>
            </div>
            <AnimatedToggle
              checked={settings.privacy.shareLocation}
              onChange={(v) => updateSetting('privacy.shareLocation', v)}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Account */}
      <SettingsSection title="Conta" icon="👤">
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
            <span className="text-brand-ink">Alterar senha</span>
            <span className="text-brand-muted">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
            <span className="text-brand-ink">Endereços</span>
            <span className="text-brand-muted">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
            <span className="text-brand-ink">Formas de pagamento</span>
            <span className="text-brand-muted">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-brand-soft rounded-xl hover:bg-brand-line text-red-500">
            <span>Sair da conta</span>
            <span>→</span>
          </button>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <Card padding="md" className="border border-red-200 bg-red-50">
        <h3 className="font-bold text-red-600 mb-3">⚠️ Zona de Perigo</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full text-red-500 border-red-200">
            Desativar conta temporariamente
          </Button>
          <Button variant="ghost" className="w-full text-red-500 hover:bg-red-100">
            Excluir conta permanentemente
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ==================== PROFILE PAGE COMPONENT ====================

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    avatar: '😀',
    memberSince: new Date('2024-01-15'),
    totalOrders: 23,
    totalSpent: 1547.80,
    level: 5,
    points: 12450,
  })

  const [showEditForm, setShowEditForm] = useState(false)

  const handleSaveProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }))
    setShowEditForm(false)
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        onEdit={() => setShowEditForm(true)}
      />

      {showEditForm ? (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">✏️ Editar Perfil</h3>
          <ProfileEditForm
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={() => setShowEditForm(false)}
          />
        </Card>
      ) : (
        <>
          {/* Quick Actions */}
          <Card padding="md">
            <h3 className="font-bold text-brand-ink mb-3">⚡ Ações Rápidas</h3>
            <div className="grid grid-cols-4 gap-3">
              <button className="flex flex-col items-center gap-1 p-3 bg-brand-soft rounded-xl">
                <span className="text-2xl">📦</span>
                <span className="text-xs text-brand-ink">Pedidos</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-brand-soft rounded-xl">
                <span className="text-2xl">❤️</span>
                <span className="text-xs text-brand-ink">Favoritos</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-brand-soft rounded-xl">
                <span className="text-2xl">🎁</span>
                <span className="text-xs text-brand-ink">Cupons</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-brand-soft rounded-xl">
                <span className="text-2xl">⭐</span>
                <span className="text-xs text-brand-ink">Avaliações</span>
              </button>
            </div>
          </Card>

          {/* Menu Items */}
          <Card padding="md">
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
                <span className="text-xl">👤</span>
                <span className="flex-1 text-left text-brand-ink">Editar perfil</span>
                <span className="text-brand-muted">→</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
                <span className="text-xl">🔔</span>
                <span className="flex-1 text-left text-brand-ink">Notificações</span>
                <span className="text-brand-muted">→</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
                <span className="text-xl">🔒</span>
                <span className="flex-1 text-left text-brand-ink">Privacidade</span>
                <span className="text-brand-muted">→</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
                <span className="text-xl">❓</span>
                <span className="flex-1 text-left text-brand-ink">Ajuda</span>
                <span className="text-brand-muted">→</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-brand-soft rounded-xl hover:bg-brand-line">
                <span className="text-xl">📜</span>
                <span className="flex-1 text-left text-brand-ink">Termos de uso</span>
                <span className="text-brand-muted">→</span>
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

// ==================== PROFILE SETTINGS COMPONENT ====================

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <ProfilePage />
    </div>
  )
}

// ==================== VERIFICATION BADGES COMPONENT ====================

export function VerificationBadges() {
  const badges = [
    { id: 'email', icon: '📧', label: 'Email verificado', verified: true },
    { id: 'phone', icon: '📱', label: 'Telefone verificado', verified: true },
    { id: 'document', icon: '🪪', label: 'Documento', verified: false },
    { id: 'address', icon: '📍', label: 'Endereço', verified: true },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(badge => (
        <div
          key={badge.id}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
            ${badge.verified
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-brand-soft text-brand-muted'
            }
          `}
        >
          <span>{badge.verified ? '✓' : badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  )
}