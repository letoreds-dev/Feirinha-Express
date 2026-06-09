'use client'

import { ProductFilters, FilterChips } from '@/components/ui/product-filters'
import { Modal } from '@/components/ui/modal'
import { useState } from 'react'

export default function FiltersPage() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="p-4">
      <h2 className="text-lg font-extrabold text-brand-ink mb-4">Filtros</h2>

      {/* Filter chips preview */}
      <div className="mb-4">
        <FilterChips onFilterClick={() => setShowFilters(true)} />
      </div>

      {/* Full filters modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
      >
        <ProductFilters />
      </Modal>

      <p className="text-sm text-brand-muted">
        Toque em "Mais filtros" para ver todas as opções de filtragem.
      </p>
    </div>
  )
}