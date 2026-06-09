'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface User {
  name: string
  email: string
  phone: string
  avatar?: string
  memberSince: string
  ordersCount: number
  totalSpent: number
  addresses: Address[]
}

interface Address {
  id: string
  label: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

const mockUser: User = {
  name: 'Carlos Silva',
  email: 'carlos@email.com',
  phone: '(11) 98765-4321',
  memberSince: '2024-01-15',
  ordersCount: 12,
  totalSpent: 1847.50,
  addresses: [
    {
      id: '1',
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true
    },
    {
      id: '2',
      label: 'Trabalho',
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false
    }
  ]
}

interface UserProfileProps {
  user?: User
}

export function UserProfile({ user = mockUser }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'settings'>('info')

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card padding="lg" className="text-center">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-brand-red flex items-center justify-center text-white text-3xl font-extrabold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.split(' ').map(n => n[0]).join('').slice(0, 2)
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-brand-red text-brand-red flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
              📷
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-brand-ink">{user.name}</h2>
          <p className="text-sm text-brand-muted">{user.email}</p>
          <p className="text-xs text-brand-muted mt-1">Membro desde {formatDate(user.memberSince)}</p>

          {/* Edit button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4"
          >
            {isEditing ? 'Cancelar' : 'Editar perfil'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-brand-line">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-brand-red">{user.ordersCount}</p>
            <p className="text-xs text-brand-muted">Pedidos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-brand-red">{formatCurrency(user.totalSpent)}</p>
            <p className="text-xs text-brand-muted">Total gasto</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['info', 'addresses', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            {tab === 'info' && '📋 '}
            {tab === 'addresses' && '🏠 '}
            {tab === 'settings' && '⚙️ '}
            {tab === 'info' ? 'Informações' : tab === 'addresses' ? 'Endereços' : 'Configurações'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">Informações pessoais</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-brand-muted mb-1">Nome completo</label>
              <input
                type="text"
                defaultValue={user.name}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-brand-line rounded-xl text-sm disabled:bg-brand-soft disabled:text-brand-muted focus:outline-none focus:border-brand-red"
              />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-1">E-mail</label>
              <input
                type="email"
                defaultValue={user.email}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-brand-line rounded-xl text-sm disabled:bg-brand-soft disabled:text-brand-muted focus:outline-none focus:border-brand-red"
              />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-1">Telefone</label>
              <input
                type="tel"
                defaultValue={user.phone}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-brand-line rounded-xl text-sm disabled:bg-brand-soft disabled:text-brand-muted focus:outline-none focus:border-brand-red"
              />
            </div>
            {isEditing && (
              <Button className="w-full mt-2">
                Salvar alterações
              </Button>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-3">
          {user.addresses.map(address => (
            <Card key={address.id} padding="md" className={address.isDefault ? 'border-2 border-brand-red' : ''}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-lg">
                    {address.label === 'Casa' ? '🏠' : '💼'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-ink">{address.label}</p>
                      {address.isDefault && (
                        <Badge variant="filled" className="text-xs">Principal</Badge>
                      )}
                    </div>
                    <p className="text-sm text-brand-muted mt-1">
                      {address.street}, {address.number} - {address.neighborhood}<br />
                      {address.city} - {address.state}, {address.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-brand-muted hover:text-brand-red">✏️</button>
                  {!address.isDefault && (
                    <button className="text-brand-muted hover:text-red-500">🗑️</button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" className="w-full">
            ➕ Adicionar novo endereço
          </Button>
        </div>
      )}

      {activeTab === 'settings' && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">Configurações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-soft rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="font-medium text-brand-ink">Notificações push</p>
                  <p className="text-xs text-brand-muted">Receba atualizações dos pedidos</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-brand-soft rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="font-medium text-brand-ink">E-mails promocionais</p>
                  <p className="text-xs text-brand-muted">Ofertas e novidades</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-brand-soft rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌙</span>
                <div>
                  <p className="font-medium text-brand-ink">Modo escuro</p>
                  <p className="text-xs text-brand-muted">Tema noturno</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-brand-line space-y-2">
              <button className="w-full p-3 text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                ❌ Sair da conta
              </button>
              <button className="w-full p-3 text-left text-brand-muted hover:bg-brand-soft rounded-xl transition-colors text-sm">
                🗑️ Excluir conta
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}