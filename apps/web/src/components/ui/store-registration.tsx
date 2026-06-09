'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

export function StoreRegistration() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
    cnpj: '',
    phone: '',
    email: '',
    address: '',
    neighborhood: '',
    city: '',
    cep: '',
    deliveryRadius: 5,
    minOrder: 20,
    deliveryFee: 5,
    estimatedTime: 30,
    categories: [] as string[],
    hasOwnDelivery: false,
    operatingHours: {
      monFri: { open: '08:00', close: '22:00' },
      saturday: { open: '09:00', close: '23:00' },
      sunday: { open: '10:00', close: '21:00' },
    },
  })

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const storeTypes = [
    { id: 'restaurant', label: 'Restaurante', icon: '🍽️' },
    { id: 'fast_food', label: 'Fast Food', icon: '🍔' },
    { id: 'bakery', label: 'Padaria', icon: '🥐' },
    { id: 'grocery', label: 'Mercado', icon: '🛒' },
    { id: 'pharmacy', label: 'Farmácia', icon: '💊' },
    { id: 'other', label: 'Outro', icon: '📦' },
  ]

  const categories = [
    'Lanches', 'Pizza', 'Açaí', 'Japonês', 'Mexicano', 'Doces',
    'Café', 'Saudável', 'Massas', 'Bebidas', 'Sorvetes', 'Padaria',
  ]

  const handleSubmit = () => {
    if (!form.name || !form.cnpj || !form.phone) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    toast.success('Cadastro enviado! Analisaremos em até 24h.')
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        {['Dados', 'Endereço', 'Entrega', 'Horário'].map((label, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              idx + 1 <= step ? 'bg-brand-red text-white' : 'bg-brand-soft text-brand-muted'
            }`}>
              {idx + 1}
            </div>
            <span className="text-xs text-brand-muted mt-1 hidden sm:block">{label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">🏪 Dados da loja</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">
                Nome da loja *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ex: Burguer House"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Tipo de loja</label>
              <div className="grid grid-cols-3 gap-2">
                {storeTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateField('type', type.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      form.type === type.id
                        ? 'border-brand-red bg-red-50'
                        : 'border-brand-line hover:border-brand-red'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <p className="text-xs mt-1 font-medium">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">CNPJ *</label>
              <input
                type="text"
                value={form.cnpj}
                onChange={(e) => updateField('cnpj', e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Telefone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contato@loja.com"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Descreva sua loja..."
                rows={3}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red resize-none"
              />
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">📍 Endereço</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Endereço completo</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Rua, número, complemento"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Bairro</label>
                <input
                  type="text"
                  value={form.neighborhood}
                  onChange={(e) => updateField('neighborhood', e.target.value)}
                  placeholder="Bairro"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">CEP</label>
                <input
                  type="text"
                  value={form.cep}
                  onChange={(e) => updateField('cep', e.target.value)}
                  placeholder="00000-000"
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Cidade</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="Cidade - UF"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">🚚 Entrega</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">
                Raio de entrega (km)
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={form.deliveryRadius}
                onChange={(e) => updateField('deliveryRadius', parseInt(e.target.value))}
                className="w-full accent-brand-red"
              />
              <div className="flex justify-between text-sm text-brand-muted">
                <span>1 km</span>
                <span className="font-bold text-brand-red">{form.deliveryRadius} km</span>
                <span>20 km</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Pedido mínimo (R$)</label>
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => updateField('minOrder', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Taxa de entrega (R$)</label>
                <input
                  type="number"
                  value={form.deliveryFee}
                  onChange={(e) => updateField('deliveryFee', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">
                Tempo estimado (minutos)
              </label>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={form.estimatedTime}
                onChange={(e) => updateField('estimatedTime', parseInt(e.target.value))}
                className="w-full accent-brand-red"
              />
              <div className="flex justify-between text-sm text-brand-muted">
                <span>15 min</span>
                <span className="font-bold text-brand-red">{form.estimatedTime} min</span>
                <span>90 min</span>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-brand-soft rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasOwnDelivery}
                onChange={(e) => updateField('hasOwnDelivery', e.target.checked)}
                className="w-5 h-5 accent-brand-red"
              />
              <div>
                <p className="font-medium text-brand-ink">Entrega própria</p>
                <p className="text-xs text-brand-muted">Minha loja tem entregadores próprios</p>
              </div>
            </label>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">⏰ Horário de funcionamento</h3>
          <div className="space-y-4">
            {[
              { key: 'monFri', label: 'Segunda a Sexta' },
              { key: 'saturday', label: 'Sábado' },
              { key: 'sunday', label: 'Domingo' },
            ].map(day => (
              <div key={day.key} className="flex items-center gap-4">
                <span className="w-28 text-sm font-medium text-brand-ink">{day.label}</span>
                <input
                  type="time"
                  value={form.operatingHours[day.key as keyof typeof form.operatingHours].open}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    operatingHours: {
                      ...prev.operatingHours,
                      [day.key]: { ...prev.operatingHours[day.key as keyof typeof prev.operatingHours], open: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 border border-brand-line rounded-lg"
                />
                <span className="text-brand-muted">até</span>
                <input
                  type="time"
                  value={form.operatingHours[day.key as keyof typeof form.operatingHours].close}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    operatingHours: {
                      ...prev.operatingHours,
                      [day.key]: { ...prev.operatingHours[day.key as keyof typeof prev.operatingHours], close: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 border border-brand-line rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-brand-soft rounded-xl">
            <p className="font-bold text-brand-ink mb-2">Resumo do cadastro</p>
            <div className="text-sm text-brand-muted space-y-1">
              <p>🏪 {form.name || 'Nome da loja'}</p>
              <p>📍 {form.address || 'Endereço não informado'}</p>
              <p>🚚 {form.deliveryRadius}km • R$ {form.deliveryFee} frete</p>
              <p>⏰ {form.estimatedTime}min estimado</p>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
            ← Voltar
          </Button>
        )}
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} className="flex-1">
            Próximo →
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex-1">
            ✅ Enviar cadastro
          </Button>
        )}
      </div>
    </div>
  )
}