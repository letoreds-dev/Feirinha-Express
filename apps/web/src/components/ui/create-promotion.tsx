'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface PromoFormData {
  title: string
  description: string
  type: 'percent' | 'fixed' | 'freight'
  value: number
  minOrder: number
  maxDiscount: number
  startDate: string
  endDate: string
  usageLimit: number
  applicableProducts: string[]
}

export function CreatePromotion() {
  const [form, setForm] = useState<PromoFormData>({
    title: '',
    description: '',
    type: 'percent',
    value: 10,
    minOrder: 50,
    maxDiscount: 20,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    usageLimit: 100,
    applicableProducts: [],
  })
  const [step, setStep] = useState(1)

  const updateField = (field: keyof PromoFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const createPromo = () => {
    if (!form.title) {
      toast.error('Informe o título da promoção')
      return
    }
    toast.success('Promoção criada com sucesso!')
  }

  const promoTypes = [
    { id: 'percent', label: 'Desconto %', icon: '💯', desc: 'Ex: 15% off' },
    { id: 'fixed', label: 'Valor fixo', icon: '💰', desc: 'Ex: R$ 20 off' },
    { id: 'freight', label: 'Frete grátis', icon: '🚚', desc: 'Frete por conta da loja' },
  ]

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              s <= step ? 'bg-brand-red text-white' : 'bg-brand-soft text-brand-muted'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`w-12 h-1 mx-2 ${
              s < step ? 'bg-brand-red' : 'bg-brand-soft'
            }`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">🎯 Tipo de promoção</h3>
          <div className="space-y-3">
            {promoTypes.map(type => (
              <button
                key={type.id}
                onClick={() => updateField('type', type.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  form.type === type.id
                    ? 'border-brand-red bg-red-50'
                    : 'border-brand-line hover:border-brand-red'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{type.icon}</span>
                  <div>
                    <p className="font-bold text-brand-ink">{type.label}</p>
                    <p className="text-sm text-brand-muted">{type.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-brand-ink mb-2">
              Valor do desconto
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.value}
                onChange={(e) => updateField('value', parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
              <span className="text-brand-muted">
                {form.type === 'percent' ? '%' : form.type === 'fixed' ? 'R$' : ''}
              </span>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">📝 Detalhes</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Título</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex: Semana do Hambúrguer"
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Descreva a promoção..."
                rows={3}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">
                Pedido mínimo (R$)
              </label>
              <input
                type="number"
                value={form.minOrder}
                onChange={(e) => updateField('minOrder', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>
            {form.type === 'percent' && (
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">
                  Desconto máximo (R$)
                </label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => updateField('maxDiscount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">📅 Validade e limite</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Início</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Término</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">
                Limite de uso (0 = ilimitado)
              </label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => updateField('usageLimit', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-brand-line rounded-xl focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gradient-to-r from-brand-red to-red-600 rounded-xl text-white">
            <p className="text-xs opacity-80 mb-1">Preview</p>
            <p className="font-extrabold text-lg">
              {form.title || 'Título da promoção'}
            </p>
            <p className="text-sm opacity-90">
              {form.type === 'percent' && `${form.value}% de desconto`}
              {form.type === 'fixed' && `R$ ${form.value} de desconto`}
              {form.type === 'freight' && 'Frete grátis'}
            </p>
            {form.minOrder > 0 && (
              <p className="text-xs opacity-80 mt-2">
                Válido para pedidos acima de R$ {form.minOrder}
              </p>
            )}
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
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} className="flex-1">
            Próximo →
          </Button>
        ) : (
          <Button onClick={createPromo} className="flex-1">
            ✅ Criar promoção
          </Button>
        )}
      </div>
    </div>
  )
}