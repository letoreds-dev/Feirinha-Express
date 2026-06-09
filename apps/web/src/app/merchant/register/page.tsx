'use client'

import { StoreRegistration } from '@/components/ui/store-registration'

export default function RegisterStorePage() {
  return (
    <main className="min-h-screen bg-brand-paper">
      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-brand-red flex items-center justify-center text-4xl mx-auto mb-4">
            🍎
          </div>
          <h1 className="text-2xl font-extrabold text-brand-ink">Cadastre sua loja</h1>
          <p className="text-brand-muted mt-2">Junte-se à maior plataforma de delivery da região</p>
        </div>
        <StoreRegistration />
      </div>
    </main>
  )
}