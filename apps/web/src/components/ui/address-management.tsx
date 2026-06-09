/**
 * Feirinha Express - Address Management System
 * Complete address CRUD with validation
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

// ==================== TYPES ====================

interface Address {
  id: string
  label: 'home' | 'work' | 'other'
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  reference?: string
  isDefault: boolean
  instructions?: string
}

interface AddressFormData {
  label: 'home' | 'work' | 'other'
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  reference: string
  instructions: string
}

// ==================== ADDRESS CARD ====================

interface AddressCardProps {
  address: Address
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const labelIcons = {
    home: '🏠',
    work: '💼',
    other: '📍',
  }

  return (
    <Card padding="md" className={address.isDefault ? 'border-2 border-brand-red' : ''}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          address.isDefault ? 'bg-brand-red text-white' : 'bg-brand-soft'
        }`}>
          {labelIcons[address.label]}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-brand-ink capitalize">
              {address.label === 'other' ? 'Outro' : address.label}
            </p>
            {address.isDefault && <Badge variant="success" className="text-xs">Principal</Badge>}
          </div>

          <p className="text-sm text-brand-ink mt-1">
            {address.street}, {address.number}
            {address.complement && ` - ${address.complement}`}
          </p>
          <p className="text-sm text-brand-muted">
            {address.neighborhood} - {address.city}/{address.state}
          </p>
          <p className="text-sm text-brand-muted">CEP: {address.zipCode}</p>

          {address.reference && (
            <p className="text-sm text-brand-muted mt-1">
              📌 Referência: {address.reference}
            </p>
          )}

          {address.instructions && (
            <p className="text-xs text-brand-muted mt-1 bg-brand-soft px-2 py-1 rounded">
              💬 {address.instructions}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-brand-line">
        {!address.isDefault && (
          <Button variant="ghost" size="sm" onClick={onSetDefault}>
            Definir como principal
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onEdit}>
          ✏️ Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500">
          🗑️ Remover
        </Button>
      </div>
    </Card>
  )
}

// ==================== ADDRESS FORM ====================

interface AddressFormProps {
  address?: Address
  onSave: (data: AddressFormData) => void
  onCancel: () => void
}

export function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    label: address?.label || 'home',
    street: address?.street || '',
    number: address?.number || '',
    complement: address?.complement || '',
    neighborhood: address?.neighborhood || '',
    city: address?.city || 'São Paulo',
    state: address?.state || 'SP',
    zipCode: address?.zipCode || '',
    reference: address?.reference || '',
    instructions: address?.instructions || '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {}

    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória'
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório'
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório'
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório'
    else if (!/^\d{5}-?\d{3}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'CEP inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleChange = (field: keyof AddressFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Label selector */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-2">Tipo de endereço</label>
        <div className="grid grid-cols-3 gap-2">
          {(['home', 'work', 'other'] as const).map(label => (
            <button
              key={label}
              type="button"
              onClick={() => handleChange('label', label)}
              className={`py-3 rounded-xl font-medium text-sm capitalize transition-colors ${
                formData.label === label
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-ink'
              }`}
            >
              {label === 'home' ? '🏠 Casa' : label === 'work' ? '💼 Trabalho' : '📍 Outro'}
            </button>
          ))}
        </div>
      </div>

      {/* Street */}
      <Input
        label="Rua / Avenida"
        value={formData.street}
        onChange={(e) => handleChange('street', e.target.value)}
        placeholder="Ex: Rua das Flores"
        error={errors.street}
      />

      {/* Number and Complement */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Número"
          value={formData.number}
          onChange={(e) => handleChange('number', e.target.value)}
          placeholder="123"
          error={errors.number}
        />
        <Input
          label="Complemento"
          value={formData.complement}
          onChange={(e) => handleChange('complement', e.target.value)}
          placeholder="Apto, bloco..."
        />
      </div>

      {/* Neighborhood */}
      <Input
        label="Bairro"
        value={formData.neighborhood}
        onChange={(e) => handleChange('neighborhood', e.target.value)}
        placeholder="Ex: Centro"
        error={errors.neighborhood}
      />

      {/* City and State */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Input
            label="Cidade"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="São Paulo"
            error={errors.city}
          />
        </div>
        <Input
          label="UF"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
          placeholder="SP"
          maxLength={2}
          error={errors.state}
        />
      </div>

      {/* ZIP Code */}
      <Input
        label="CEP"
        value={formData.zipCode}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, '')
          if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8)
          }
          handleChange('zipCode', value)
        }}
        placeholder="00000-000"
        error={errors.zipCode}
      />

      {/* Reference */}
      <Input
        label="Ponto de referência"
        value={formData.reference}
        onChange={(e) => handleChange('reference', e.target.value)}
        placeholder="Ex: Em frente ao mercado"
      />

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-2">
          Instruções de entrega
        </label>
        <textarea
          value={formData.instructions}
          onChange={(e) => handleChange('instructions', e.target.value)}
          placeholder="Ex: Antena no telhado, portão azul..."
          className="w-full px-4 py-3 bg-brand-soft rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-red"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {address ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  )
}

// ==================== FULL ADDRESS MANAGER ====================

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('addresses')
    if (saved) {
      try {
        setAddresses(JSON.parse(saved))
      } catch {}
    } else {
      // Demo addresses
      setAddresses([
        {
          id: '1',
          label: 'home',
          street: 'Av. Paulista',
          number: '1000',
          complement: 'Apto 501',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          reference: 'Em frente ao Shopping Center 3',
          isDefault: true,
        },
        {
          id: '2',
          label: 'work',
          street: 'Rua Augusta',
          number: '1500',
          neighborhood: 'Consolação',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01304-001',
          isDefault: false,
        },
      ])
    }
  }, [])

  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem('addresses', JSON.stringify(addresses))
    }
  }, [addresses])

  const handleSave = (data: AddressFormData) => {
    if (editingAddress) {
      setAddresses(prev => prev.map(a =>
        a.id === editingAddress.id ? { ...a, ...data } : a
      ))
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...data,
        isDefault: addresses.length === 0,
      }
      setAddresses(prev => [...prev, newAddress])
    }
    setShowForm(false)
    setEditingAddress(null)
  }

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id,
    })))
  }

  if (showForm) {
    return (
      <Card padding="md">
        <h3 className="text-lg font-bold text-brand-ink mb-4">
          {editingAddress ? '✏️ Editar Endereço' : '➕ Novo Endereço'}
        </h3>
        <AddressForm
          address={editingAddress || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingAddress(null)
          }}
        />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-brand-ink">📍 Meus Endereços</h2>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
          + Novo
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-5xl mb-3">📍</p>
          <p className="text-brand-muted">Nenhum endereço cadastrado</p>
          <Button variant="primary" className="mt-4" onClick={() => setShowForm(true)}>
            Adicionar endereço
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => {
                setEditingAddress(address)
                setShowForm(true)
              }}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== MAP PICKER (SIMPLIFIED) ====================

export function AddressMapPicker() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Card padding="md" className="bg-gradient-to-br from-brand-soft to-white">
      <h3 className="font-bold text-brand-ink mb-3">🗺️ Selecionar no Mapa</h3>

      <Input
        placeholder="Buscar endereço..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Map placeholder */}
      <div className="mt-4 h-48 bg-brand-line rounded-xl flex items-center justify-center">
        <div className="text-center text-brand-muted">
          <p className="text-4xl mb-2">🗺️</p>
          <p className="text-sm">Mapa interativo</p>
          <p className="text-xs">Integração com Google Maps</p>
        </div>
      </div>

      <p className="text-xs text-brand-muted mt-3 text-center">
        Toque no mapa ou digite o endereço para selecionar
      </p>
    </Card>
  )
}