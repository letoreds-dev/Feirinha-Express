'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  cep: string
  isDefault: boolean
  instructions?: string
}

export function DeliveryAddress() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      cep: '01234-567',
      isDefault: true,
      instructions: 'Portão verde, tocar campainha 2x',
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
      cep: '01310-100',
      isDefault: false,
    },
  ])
  const [selectedAddress, setSelectedAddress] = useState<string>('1')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState<Partial<Address>>({
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    instructions: '',
  })

  const setDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
    toast.success('Endereço padrão atualizado')
  }

  const saveAddress = () => {
    if (!form.street || !form.number || !form.neighborhood || !form.city) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    if (editingId) {
      setAddresses(addresses.map(addr =>
        addr.id === editingId ? { ...addr, ...form } as Address : addr
      ))
      toast.success('Endereço atualizado!')
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...form,
        isDefault: addresses.length === 0,
      } as Address
      setAddresses([...addresses, newAddress])
      toast.success('Endereço adicionado!')
    }
    setShowForm(false)
    setEditingId(null)
    setForm({
      label: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      cep: '',
      instructions: '',
    })
  }

  const deleteAddress = (id: string) => {
    if (confirm('Deseja excluir este endereço?')) {
      setAddresses(addresses.filter(addr => addr.id !== id))
      toast.success('Endereço removido')
    }
  }

  const editAddress = (address: Address) => {
    setForm(address)
    setEditingId(address.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      {/* Address list */}
      {addresses.map(address => (
        <Card key={address.id} padding="md">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {address.label === 'Casa' ? '🏠' : address.label === 'Trabalho' ? '🏢' : '📍'}
              </span>
              <div>
                <p className="font-bold text-brand-ink">{address.label}</p>
                {address.isDefault && (
                  <Badge variant="success" className="text-xs mt-1">Padrão</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editAddress(address)}
                className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-sm hover:bg-brand-line"
              >
                ✏️
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => deleteAddress(address.id)}
                  className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-sm hover:bg-red-100"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>

          <div className="text-sm text-brand-muted">
            <p>{address.street}, {address.number}{address.complement && ` - ${address.complement}`}</p>
            <p>{address.neighborhood}</p>
            <p>{address.city} - {address.state}</p>
            <p>CEP: {address.cep}</p>
            {address.instructions && (
              <p className="mt-2 p-2 bg-brand-soft rounded-lg">
                📝 {address.instructions}
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant={selectedAddress === address.id ? 'primary' : 'outline'}
              onClick={() => setSelectedAddress(address.id)}
              className="flex-1"
            >
              {selectedAddress === address.id ? '✓ Selecionado' : 'Selecionar'}
            </Button>
            {!address.isDefault && (
              <Button variant="ghost" onClick={() => setDefault(address.id)}>
                Definir como padrão
              </Button>
            )}
          </div>
        </Card>
      ))}

      {/* Add/Edit form */}
      {showForm ? (
        <Card padding="md" className="animate-fade-up">
          <h3 className="font-bold text-brand-ink mb-4">
            {editingId ? '✏️ Editar endereço' : '➕ Novo endereço'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Nome/Apelido</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Ex: Casa, Trabalho"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-brand-ink mb-2">Rua *</label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => setForm(prev => ({ ...prev, street: e.target.value }))}
                  placeholder="Rua, Avenida..."
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Número *</label>
                <input
                  type="text"
                  value={form.number}
                  onChange={(e) => setForm(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Complemento</label>
              <input
                type="text"
                value={form.complement}
                onChange={(e) => setForm(prev => ({ ...prev, complement: e.target.value }))}
                placeholder="Apto, Bloco, Sala..."
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Bairro *</label>
              <input
                type="text"
                value={form.neighborhood}
                onChange={(e) => setForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                placeholder="Bairro"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Cidade *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Cidade"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">UF</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="SP"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">CEP</label>
              <input
                type="text"
                value={form.cep}
                onChange={(e) => setForm(prev => ({ ...prev, cep: e.target.value }))}
                placeholder="00000-000"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Instruções de entrega</label>
              <textarea
                value={form.instructions}
                onChange={(e) => setForm(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Ex: Portão verde, tocar campainha 2x..."
                rows={2}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={saveAddress} className="flex-1">
                Salvar
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)} className="w-full">
          ➕ Adicionar novo endereço
        </Button>
      )}

      {/* Map placeholder */}
      <Card padding="md" className="bg-brand-soft">
        <div className="h-40 rounded-xl bg-white border-2 border-dashed border-brand-line flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl">🗺️</span>
            <p className="text-sm text-brand-muted mt-2">Mapa de entrega</p>
          </div>
        </div>
      </Card>
    </div>
  )
}