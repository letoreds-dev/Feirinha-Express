'use client'

import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { Card } from '@/components/ui/card'

const menuItems = [
  { icon: '👤', label: 'Meu Perfil', href: '/user/profile' },
  { icon: '📍', label: 'Endereços', href: '/user/addresses' },
  { icon: '💳', label: 'Formas de Pagamento', href: '/user/payments' },
  { icon: '🔔', label: 'Notificações', href: '/user/notifications' },
  { icon: '🌙', label: 'Aparência', href: '/user/settings/appearance' },
  { icon: '🔐', label: 'Privacidade', href: '/user/settings/privacy' },
  { icon: '❓', label: 'Ajuda', href: '/user/help' },
  { icon: '📜', label: 'Termos de Uso', href: '/user/terms' },
]

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink">⚙️ Configurações</h1>
      </NavBar>

      <div className="px-4 py-4 max-w-[390px] mx-auto space-y-4">
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center text-3xl">😊</div>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">Usuário Demo</p>
            <p className="text-sm text-brand-muted">usuario@email.com</p>
          </div>
          <button className="text-brand-red text-sm font-medium">Editar</button>
        </Card>

        <Card padding="none">
          {menuItems.map((item, idx) => (
            <a key={item.label} href={item.href} className={`flex items-center gap-4 p-4 hover:bg-brand-soft transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-brand-line' : ''}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-brand-ink">{item.label}</span>
              <span className="text-brand-muted">→</span>
            </a>
          ))}
        </Card>

        <button className="w-full p-4 bg-red-50 text-red-600 rounded-xl font-medium text-center">
          Sair da conta
        </button>

        <p className="text-center text-xs text-brand-muted">Feirinha Express v2.0.0</p>
      </div>

      <BottomNav />
    </main>
  )
}
