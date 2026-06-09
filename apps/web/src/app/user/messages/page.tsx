'use client'

import { useState } from 'react'
import { NavBar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { Card } from '@/components/ui/card'

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read'

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  senderType: 'customer' | 'merchant' | 'driver' | 'bot'
  content: string
  type: 'text' | 'image' | 'location' | 'system'
  timestamp: string
  status: MessageStatus
}

const conversations = [
  { id: '1', type: 'order' as const, title: 'Burger King', avatar: '🍔', lastMessage: 'Seu pedido está a caminho!', lastMessageAt: '2026-06-06T14:45:00', unreadCount: 1, online: true },
  { id: '2', type: 'order' as const, title: 'Pizza Hut', avatar: '🍕', lastMessage: 'Pedido confirmado!', lastMessageAt: '2026-06-05T19:00:00', unreadCount: 0, online: true },
  { id: '3', type: 'support' as const, title: 'Suporte Feirinha', avatar: '💬', lastMessage: 'Como podemos ajudar?', lastMessageAt: '2026-06-04T10:00:00', unreadCount: 0, online: true },
]

const initialMessages: ChatMessage[] = [
  { id: '1', senderId: 'merchant', senderName: 'Burger King', senderAvatar: '🍔', senderType: 'merchant', content: 'Olá! Seu pedido está sendo preparado!', type: 'text', timestamp: '2026-06-06T14:30:00', status: 'read' },
  { id: '2', senderId: 'customer', senderName: 'Você', senderAvatar: '😊', senderType: 'customer', content: 'Ótimo, obrigado!', type: 'text', timestamp: '2026-06-06T14:31:00', status: 'read' },
  { id: '3', senderId: 'merchant', senderName: 'Burger King', senderAvatar: '🍔', senderType: 'merchant', content: 'Saiu para entrega! Seu entregador é o João. 🛵', type: 'text', timestamp: '2026-06-06T14:45:00', status: 'read' },
]

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages)

  const selectedConversation = conversations.find(c => c.id === selectedId)

  const handleSend = () => {
    if (!message.trim()) return
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'customer',
      senderName: 'Você',
      senderAvatar: '😊',
      senderType: 'customer',
      content: message,
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sending',
    }
    setChatMessages([...chatMessages, newMessage])
    setMessage('')
  }

  if (selectedId && selectedConversation) {
    return (
      <main className="min-h-screen bg-brand-paper flex flex-col">
        <NavBar>
          <div className="flex items-center gap-3 w-full">
            <button onClick={() => setSelectedId(null)} className="text-brand-muted text-xl">←</button>
            <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl">{selectedConversation.avatar}</div>
            <div className="flex-1">
              <p className="font-bold text-brand-ink">{selectedConversation.title}</p>
              <p className="text-xs text-green-600">{selectedConversation.online ? 'Online agora' : 'Offline'}</p>
            </div>
          </div>
        </NavBar>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                msg.senderType === 'customer'
                  ? 'bg-brand-red text-white rounded-br-sm'
                  : 'bg-white text-brand-ink rounded-bl-sm shadow-sm border border-brand-line'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.senderType === 'customer' ? 'text-white/70' : 'text-brand-muted'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-white border-t border-brand-line flex items-end gap-2">
          <button className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl hover:bg-brand-line">📍</button>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Digite uma mensagem..."
            rows={1}
            className="flex-1 px-4 py-3 bg-brand-soft rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-red"
          />
          <button onClick={handleSend} disabled={!message.trim()} className={`w-10 h-10 rounded-full flex items-center justify-center ${message.trim() ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-400'}`}>
            ➤
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-paper pb-20">
      <NavBar>
        <h1 className="text-lg font-extrabold text-brand-ink">💬 Mensagens</h1>
      </NavBar>

      <div className="max-w-[390px] mx-auto bg-white">
        {conversations.map(conv => (
          <button key={conv.id} onClick={() => setSelectedId(conv.id)} className="w-full p-4 flex items-center gap-3 hover:bg-brand-soft border-b border-brand-line">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl">{conv.avatar}</div>
              {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <p className="font-medium text-brand-ink truncate">{conv.title}</p>
                <span className="text-xs text-brand-muted">{new Date(conv.lastMessageAt!).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm text-brand-muted truncate">{conv.lastMessage}</p>
            </div>
            {conv.unreadCount > 0 && <div className="w-6 h-6 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">{conv.unreadCount}</div>}
          </button>
        ))}
        {conversations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-brand-muted">Nenhuma conversa</p>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
