'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from './card'
import { Button } from './button'

// ==================== CHAT MESSAGE ====================

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  senderType: 'customer' | 'merchant' | 'driver' | 'bot'
  content: string
  type: 'text' | 'image' | 'location' | 'system'
  locationLat?: number
  locationLng?: number
  timestamp: string
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

interface ChatBubbleProps {
  message: ChatMessage
  isOwn: boolean
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending': return '○'
      case 'sent': return '✓'
      case 'delivered': return '✓✓'
      case 'read': return '✓✓'
      default: return ''
    }
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-sm mr-2 flex-shrink-0">
          {message.senderAvatar || '👤'}
        </div>
      )}
      <div className={`max-w-[75%] ${isOwn ? 'order-1' : ''}`}>
        {!isOwn && (
          <p className="text-xs text-brand-muted mb-1 ml-1">{message.senderName}</p>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? 'bg-brand-red text-white rounded-br-sm'
              : 'bg-white text-brand-ink rounded-bl-sm shadow-sm border border-brand-line'
          } ${message.type === 'system' ? 'bg-gray-100 text-center text-sm italic' : ''}`}
        >
          {message.type === 'location' ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <span>Compartilhou localização</span>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-brand-muted">{formatTime(message.timestamp)}</span>
          {isOwn && (
            <span className={`text-xs ${message.status === 'read' ? 'text-blue-500' : 'text-brand-muted'}`}>
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== CHAT INPUT ====================

interface ChatInputProps {
  onSend: (content: string, type?: string) => void
  onSendLocation?: () => void
  placeholder?: string
  disabled?: boolean
}

export function ChatInput({ onSend, onSendLocation, placeholder = 'Digite uma mensagem...', disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  return (
    <div className="flex items-end gap-2 p-3 bg-white border-t border-brand-line">
      {onSendLocation && (
        <button
          onClick={onSendLocation}
          className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl hover:bg-brand-line transition-colors flex-shrink-0"
        >
          📍
        </button>
      )}
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="w-full px-4 py-3 bg-brand-soft rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-red text-brand-ink placeholder:text-brand-muted max-h-32"
          disabled={disabled}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          message.trim() && !disabled
            ? 'bg-brand-red text-white'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        ➤
      </button>
    </div>
  )
}

// ==================== CHAT LIST ====================

interface ChatConversation {
  id: string
  type: 'support' | 'order' | 'driver'
  title: string
  avatar: string
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
  online: boolean
}

interface ChatListProps {
  conversations: ChatConversation[]
  onSelect: (id: string) => void
  activeId?: string
}

export function ChatList({ conversations, onSelect, activeId }: ChatListProps) {
  const formatTime = (date?: string) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Agora'
    if (hours < 24) return `${hours}h`
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`w-full p-4 flex items-center gap-3 hover:bg-brand-soft transition-colors ${
            activeId === conv.id ? 'bg-brand-soft' : ''
          }`}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl">
              {conv.avatar}
            </div>
            {conv.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <p className="font-medium text-brand-ink truncate">{conv.title}</p>
              <span className="text-xs text-brand-muted">{formatTime(conv.lastMessageAt)}</span>
            </div>
            <p className="text-sm text-brand-muted truncate">{conv.lastMessage || 'Inicie uma conversa'}</p>
          </div>
          {conv.unreadCount > 0 && (
            <div className="w-6 h-6 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
              {conv.unreadCount}
            </div>
          )}
        </button>
      ))}
      {conversations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-brand-muted">Nenhuma conversa</p>
        </div>
      )}
    </div>
  )
}

// ==================== FULL CHAT ====================

interface FullChatProps {
  messages: ChatMessage[]
  onSend: (content: string, type?: string) => void
  onSendLocation?: () => void
  onBack?: () => void
  title: string
  avatar: string
  online?: boolean
  canSendLocation?: boolean
}

export function FullChat({
  messages,
  onSend,
  onSendLocation,
  onBack,
  title,
  avatar,
  online,
  canSendLocation = true,
}: FullChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-brand-paper">
      {/* Header */}
      <div className="p-4 bg-white border-b border-brand-line flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-brand-muted hover:text-brand-ink text-xl">
            ←
          </button>
        )}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl">
            {avatar}
          </div>
          {online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-bold text-brand-ink">{title}</p>
          <p className="text-xs text-green-600">{online ? 'Online agora' : 'Offline'}</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl hover:bg-brand-line">
          📞
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((msg, idx) => {
          const isOwn = msg.senderType === 'customer'
          const showAvatar = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId
          return (
            <ChatBubble key={msg.id} message={msg} isOwn={isOwn} />
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSend}
        onSendLocation={canSendLocation ? onSendLocation : undefined}
      />
    </div>
  )
}