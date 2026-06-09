import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { ToastContainer } from '@/components/ui/toast'
import { OfflineBanner } from '@/components/ui/offline-banner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Feirinha Express',
  description: 'Delivery de tudo do centro comercial. Compre de várias lojas em um pedido.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <OfflineBanner />
        <ToastContainer />
      </body>
    </html>
  )
}