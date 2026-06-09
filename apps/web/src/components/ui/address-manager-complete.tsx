'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
  isDefault: boolean
  instructions?: string
}

interface AddressManagerProps {
  onSelect?: (address: Address) => void
  selectable?: boolean
}

export function AddressManager({ onSelect, selectable = false }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01234-567',
      isDefault: true,
      instructions: 'Interfone B, combinar entrega',
    },
    {
      id: '2',
      label: 'Trabalho',
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 501',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01310-100',
      isDefault: false,
    },
    {
      id: '3',
      label: 'Casa dos Pais',
      street: 'Rua Augusta',
      number: '500',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01304-001',
      isDefault: false,
    },
  ])

  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState<Partial<Address>>({
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '',
    instructions: '',
    isDefault: false,
  })

  const setAsDefault = (id: string) => {
    setAddresses(prev =>
      prev.map(a => ({ ...a, isDefault: a.id === id }))
    )
  }

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const saveAddress = () => {
    if (!formData.label || !formData.street || !formData.number || !formData.neighborhood || !formData.postalCode) {
      return
    }

    if (editingAddress) {
      setAddresses(prev =>
        prev.map(a => a.id === editingAddress.id ? { ...a, ...formData } as Address : a)
      )
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        label: formData.label || '',
        street: formData.street || '',
        number: formData.number || '',
        complement: formData.complement,
        neighborhood: formData.neighborhood || '',
        city: formData.city || 'São Paulo',
        state: formData.state || 'SP',
        postalCode: formData.postalCode || '',
        isDefault: formData.isDefault || false,
        instructions: formData.instructions,
      }
      setAddresses(prev => [...prev, newAddress])
    }

    setShowForm(false)
    setEditingAddress(null)
    setFormData({
      label: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '',
      instructions: '',
      isDefault: false,
    })
  }

  const editAddress = (address: Address) => {
    setEditingAddress(address)
    setFormData(address)
    setShowForm(true)
  }

  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''} - ${address.neighborhood}`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">📍 Meus Endereços</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          + Novo
        </Button>
      </div>

      {/* Address list */}
      {addresses.map(address => (
        <Card
          key={address.id}
          padding="md"
          className={`cursor-pointer transition-all ${selectable ? 'hover:border-brand-red' : ''}`}
          onClick={() => selectable && onSelect?.(address)}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-xl">
              {address.label === 'Casa' ? '🏠' : address.label === 'Trabalho' ? '🏢' : '📍'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-brand-ink">{address.label}</p>
                {address.isDefault && (
                  <Badge variant="success" className="text-xs">Padrão</Badge>
                )}
              </div>
              <p className="text-sm text-brand-muted mt-1">{formatAddress(address)}</p>
              <p className="text-sm text-brand-muted">{address.city} - {address.state}</p>
              <p className="text-sm text-brand-muted">CEP: {address.postalCode}</p>
              {address.instructions && (
                <p className="text-xs text-brand-muted mt-2 p-2 bg-brand-soft rounded-lg">
                  💬 {address.instructions}
                </p>
              )}
            </div>
            {!selectable && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => editAddress(address)}
                  className="text-brand-muted hover:text-brand-red"
                >
                  ✏️
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => setAsDefault(address.id)}
                    className="text-brand-muted hover:text-brand-red text-xs"
                  >
                    Definir padrão
                  </button>
                )}
                <button
                  onClick={() => deleteAddress(address.id)}
                  className="text-brand-muted hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Add/Edit form */}
      {showForm && (
        <Card padding="md" className="animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-ink">
              {editingAddress ? '✏️ Editar Endereço' : '➕ Novo Endereço'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingAddress(null)
              }}
              className="text-brand-muted hover:text-brand-ink"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Nome</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Ex: Casa, Trabalho"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-brand-ink mb-1">Rua/Avenida</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">Número</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">Complemento</label>
                <input
                  type="text"
                  value={formData.complement}
                  onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
                  placeholder="Apto, Bloco..."
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">Bairro</label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-brand-ink mb-1">Cidade</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">UF</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value.slice(0, 2) }))}
                  maxLength={2}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">CEP</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="00000-000"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Instruções (opcional)</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Ex: Próximo ao mercado,interfone..."
                rows={2}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red resize-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="w-5 h-5 rounded border-brand-line text-brand-red focus:ring-brand-red"
              />
              <span className="text-sm text-brand-ink">Definir como endereço padrão</span>
            </label>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingAddress(null)
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={saveAddress} className="flex-1">
              Salvar
            </Button>
          </div>
        </Card>
      )}

      {addresses.length === 0 && !showForm && (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-3">📍</p>
          <p className="text-brand-muted">Nenhum endereço cadastrado</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            + Adicionar endereço
          </Button>
        </Card>
      )}
    </div>
  )
}
