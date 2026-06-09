'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface FilterOption {
  id: string
  label: string
  icon?: string
}

interface FilterSection {
  id: string
  title: string
  type: 'radio' | 'checkbox' | 'range' | 'toggle'
  options?: FilterOption[]
  min?: number
  max?: number
  unit?: string
}

const filterSections: FilterSection[] = [
  {
    id: 'rating',
    title: 'Avaliação mínima',
    type: 'radio',
    options: [
      { id: 'any', label: 'Qualquer avaliação' },
      { id: '4', label: '⭐⭐⭐⭐ 4.0+' },
      { id: '4.5', label: '⭐⭐⭐⭐⭐ 4.5+' },
      { id: '4.8', label: '⭐⭐⭐⭐⭐ 4.8+' },
    ],
  },
  {
    id: 'delivery',
    title: 'Tempo de entrega',
    type: 'radio',
    options: [
      { id: 'any', label: 'Qualquer' },
      { id: '20', label: 'Até 20 min' },
      { id: '30', label: 'Até 30 min' },
      { id: '45', label: 'Até 45 min' },
    ],
  },
  {
    id: 'deliveryFee',
    title: 'Frete',
    type: 'checkbox',
    options: [
      { id: 'free', label: 'Frete grátis', icon: '🚚' },
      { id: 'under5', label: 'Até R$ 5', icon: '💰' },
    ],
  },
  {
    id: 'features',
    title: 'Recursos',
    type: 'checkbox',
    options: [
      { id: 'open', label: 'Aberto agora', icon: '🟢' },
      { id: 'discount', label: 'Com desconto', icon: '🏷️' },
      { id: 'new', label: 'Novidades', icon: '🆕' },
      { id: 'top', label: 'Mais bem avaliados', icon: '🏆' },
    ],
  },
]

interface ActiveFilters {
  [key: string]: string | string[] | boolean
}

export function ProductFilters() {
  const [filters, setFilters] = useState<ActiveFilters>({})
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])

  const updateFilter = (sectionId: string, value: string | string[], isMulti = false) => {
    setFilters(prev => ({
      ...prev,
      [sectionId]: isMulti ? value : value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setPriceRange([0, 100])
    toast.info('Filtros removidos')
  }

  const applyFilters = () => {
    toast.success('Filtros aplicados!')
    // Apply filters logic
  }

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key] && (Array.isArray(filters[key]) ? (filters[key] as string[]).length > 0 : true)
  ).length + (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Active filters badge */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <Badge variant="filled" className="text-xs">
            {activeFilterCount} filtro(s) ativo(s)
          </Badge>
          <button
            onClick={clearFilters}
            className="text-xs text-brand-red hover:underline"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Price range */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">Faixa de preço</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">R$ {priceRange[0]}</span>
            <span className="text-brand-muted">R$ {priceRange[1]}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-brand-red"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              placeholder="Mín"
              className="flex-1 px-3 py-2 border border-brand-line rounded-lg text-sm"
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
              placeholder="Máx"
              className="flex-1 px-3 py-2 border border-brand-line rounded-lg text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Filter sections */}
      {filterSections.map(section => (
        <Card key={section.id} padding="md">
          <h3 className="font-bold text-brand-ink mb-4">{section.title}</h3>

          {section.type === 'radio' && (
            <div className="space-y-2">
              {section.options?.map(option => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    filters[section.id] === option.id
                      ? 'bg-brand-red bg-opacity-10 border border-brand-red'
                      : 'hover:bg-brand-soft'
                  }`}
                >
                  <input
                    type="radio"
                    name={section.id}
                    value={option.id}
                    checked={filters[section.id] === option.id || (!filters[section.id] && option.id === 'any')}
                    onChange={() => updateFilter(section.id, option.id)}
                    className="sr-only"
                  />
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    filters[section.id] === option.id || (!filters[section.id] && option.id === 'any')
                      ? 'border-brand-red'
                      : 'border-gray-300'
                  }`}>
                    {(filters[section.id] === option.id || (!filters[section.id] && option.id === 'any')) && (
                      <span className="w-3 h-3 rounded-full bg-brand-red" />
                    )}
                  </span>
                  <span className="text-sm text-brand-ink">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {section.type === 'checkbox' && (
            <div className="space-y-2">
              {section.options?.map(option => {
                const selected = (filters[section.id] as string[]) || []
                const isSelected = selected.includes(option.id)
                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-red bg-opacity-10 border border-brand-red'
                        : 'hover:bg-brand-soft'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        const current = (filters[section.id] as string[]) || []
                        if (isSelected) {
                          updateFilter(section.id, current.filter(id => id !== option.id), true)
                        } else {
                          updateFilter(section.id, [...current, option.id], true)
                        }
                      }}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-brand-red border-brand-red' : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </span>
                    {option.icon && <span>{option.icon}</span>}
                    <span className="text-sm text-brand-ink">{option.label}</span>
                  </label>
                )
              })}
            </div>
          )}
        </Card>
      ))}

      {/* Actions */}
      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Aplicar filtros
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Limpar filtros
        </Button>
      </div>
    </div>
  )
}

// Horizontal filter chips
export function FilterChips({ onFilterClick }: { onFilterClick: () => void }) {
  const quickFilters = [
    { label: 'Frete grátis', icon: '🚚' },
    { label: '4+ ⭐', icon: '⭐' },
    { label: 'Entrega rápida', icon: '⚡' },
    { label: 'Desconto', icon: '🏷️' },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      <button
        onClick={onFilterClick}
        className="flex-shrink-0 px-4 py-2 bg-white border border-brand-line rounded-full text-sm font-medium flex items-center gap-2 hover:border-brand-red"
      >
        🔍 Mais filtros
      </button>
      {quickFilters.map((filter, idx) => (
        <button
          key={idx}
          className="flex-shrink-0 px-4 py-2 bg-white border border-brand-line rounded-full text-sm font-medium hover:border-brand-red transition-colors"
        >
          {filter.icon} {filter.label}
        </button>
      ))}
    </div>
  )
}