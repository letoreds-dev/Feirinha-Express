'use client'

import { HelpArticles } from '@/components/ui/help-articles'
import { HelpCenter } from '@/components/ui/help-center'
import { NavBar } from '@/components/ui/navbar'
import Link from 'next/link'
import { useState } from 'react'

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'chat'>('articles')

  return (
    <main className="min-h-screen bg-brand-paper">
      <NavBar>
        <div className="flex items-center gap-3 w-full">
          <Link href="/user" className="text-brand-muted hover:text-brand-ink">
            ←
          </Link>
          <h1 className="text-lg font-extrabold text-brand-ink flex-1">❓ Ajuda</h1>
        </div>
      </NavBar>

      <div className="px-4 py-6 max-w-[390px] mx-auto">
        {/* Tab switch */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              activeTab === 'articles'
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            📚 Artigos
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              activeTab === 'chat'
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            💬 Chat
          </button>
        </div>

        {activeTab === 'articles' ? <HelpArticles /> : <HelpCenter />}
      </div>
    </main>
  )
}