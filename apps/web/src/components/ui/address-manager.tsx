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
  zipCode: string
  isDefault: boolean
  instructions?: string
}

const mockAddresses: Address[] = [
  {
    id: '1',
    label: 'Casa',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Jardim Primavera',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    isDefault: true,
    instructions: 'Portão branco, campainha ao lado'
  },
  {
    id: '2',
    label: 'Trabalho',
    street: 'Av. Paulista',
    number: '1000',
    complement: 'Andar 15',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    isDefault: false,
    instructions: 'Recepção, informar nome da empresa'
  },
]

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const setAsDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })))
    toast.success('Endereço principal atualizado')
  }

  const deleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      toast.error('Não é possível remover', 'Você precisa ter pelo menos um endereço')
      return
    }
    setAddresses(addresses.filter(a => a.id !== id))
    toast.info('Endereço removido')
  }

  const formatAddress = (addr: Address) => {
    return `${addr.street}, ${addr.number}${addr.complement ? `, ${addr.complement}` : ''} - ${addr.neighborhood}, ${addr.city}/${addr.state}`
  }

  return (
    <div className="space-y-4">
      {/* Address list */}
      <div className="space-y-3">
        {addresses.map(addr => (
          <Card key={addr.id} padding="md" className={addr.isDefault ? 'border-2 border-brand-red' : ''}>
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                addr.isDefault ? 'bg-red-100' : 'bg-brand-soft'
              }`}>
                {addr.label === 'Casa' ? '🏠' : addr.label === 'Trabalho' ? '💼' : '📍'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-brand-ink">{addr.label}</p>
                  {addr.isDefault && <Badge variant="danger" className="text-xs">Principal</Badge>}
                </div>
                <p className="text-sm text-brand-muted">{formatAddress(addr)}</p>
                <p className="text-sm text-brand-muted">{addr.zipCode}</p>
                {addr.instructions && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    📝 {addr.instructions}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-brand-line">
              <button
                onClick={() => setEditingId(addr.id)}
                className="flex-1 py-2 text-sm text-brand-red border border-brand-red rounded-lg hover:bg-red-50 transition-colors"
              >
                ✏️ Editar
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => setAsDefault(addr.id)}
                  className="flex-1 py-2 text-sm text-brand-ink border border-brand-line rounded-lg hover:bg-brand-soft transition-colors"
                >
                  ⭐ Definir como principal
                </button>
              )}
              {!addr.isDefault && addresses.length > 1 && (
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="py-2 px-3 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  🗑️
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add new address */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full py-4 border-2 border-dashed border-brand-line rounded-xl text-brand-muted hover:border-brand-red hover:text-brand-red transition-colors"
      >
        ➕ Adicionar novo endereço
      </button>

      {/* Add/Edit form */}
      {showAddForm && (
        <Card padding="md" className="animate-fade-up">
          <h3 className="font-bold text-brand-ink mb-4">Novo endereço</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Label</label>
              <div className="flex gap-2">
                {['Casa', 'Trabalho', 'Outro'].map(label => (
                  <button
                    key={label}
                    className="px-4 py-2 border border-brand-line rounded-lg text-sm hover:border-brand-red transition-colors"
                  >
                    {label === 'Casa' ? '🏠' : label === 'Trabalho' ? '💼' : '📍'} {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-brand-ink mb-1">Rua</label>
                <input
                  type="text"
                  placeholder="Nome da rua"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">Número</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Complemento (opcional)</label>
              <input
                type="text"
                placeholder="Apto, bloco, referência..."
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">Bairro</label>
                <input
                  type="text"
                  placeholder="Bairro"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">CEP</label>
                <input
                  type="text"
                  placeholder="00000-000"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">Cidade</label>
                <input
                  type="text"
                  placeholder="São Paulo"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">Estado</label>
                <select className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red">
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Instruções de entrega (opcional)</label>
              <textarea
                placeholder="Ex: Portão branco, campainha ao lado..."
                rows={2}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="set-as-default" className="w-4 h-4 accent-brand-red" />
              <label htmlFor="set-as-default" className="text-sm text-brand-ink">
                Definir como endereço principal
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 text-sm text-brand-muted border border-brand-line rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  toast.success('Endereço salvo')
                  setShowAddForm(false)
                }}
                className="flex-1 py-3 text-sm text-white bg-brand-red rounded-xl font-bold hover:bg-brand-red-dark transition-colors"
              >
                Salvar endereço
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}