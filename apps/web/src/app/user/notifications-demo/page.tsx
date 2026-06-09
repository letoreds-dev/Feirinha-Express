'use client'

import { NotificationProvider, NotificationDemo } from '@/components/ui/notifications-push'
import { FloatingOrderWidget, OrderTimelineCompact, DeliveryEstimateCalculator, OrderStatusSelector } from '@/components/ui/floating-order-widget'
import { Card } from '@/components/ui'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'
import { useState } from 'react'

function FloatingWidgetDemo() {
  const [orderStatus, setOrderStatus] = useState<'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered'>('delivering')

  return (
    <>
      <FloatingOrderWidget
        order={{
          id: 'PED-2024-001234',
          storeName: 'Burguer House',
          storeEmoji: '🍔',
          status: orderStatus,
          estimatedMinutes: 12,
          itemsCount: 3,
          total: 89.70,
        }}
      />

      <div className="space-y-4 mt-4">
        <OrderTimelineCompact status={orderStatus} />

        <DeliveryEstimateCalculator distance={2.5} timeOfDay="lunch" />

        <OrderStatusSelector onSelect={setOrderStatus} />
      </div>
    </>
  )
}

export default function NotificationsDemoPage() {
  return (
    <main className="min-h-screen bg-brand-paper pb-24">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">🔔 Sistema de Notificações</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto space-y-6">
        <NotificationProvider>
          <NotificationDemo />
        </NotificationProvider>

        <Card padding="md">
          <h3 className="font-bold text-brand-ink mb-4">🛵 Widget Flutuante de Pedido</h3>
          <p className="text-sm text-brand-muted mb-4">
            Este widget mostra o status do pedido ativo. Role para baixo para vê-lo.
          </p>
        </Card>

        <FloatingWidgetDemo />
      </div>
    </main>
  )
}