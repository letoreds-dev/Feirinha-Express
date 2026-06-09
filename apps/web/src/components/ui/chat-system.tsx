/**
 * Feirinha Express - Real-Time Chat System
 * Chat between customer, delivery person, and support
 */

'use client'

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'

// ==================== TYPES ====================

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'system'
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

interface ChatConversation {
  id: string
  type: 'order' | 'support' | 'store'
  title: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  online: boolean
  participants: { id: string; name: string; avatar: string; role: 'customer' | 'driver' | 'store' | 'support' }[]
}

interface ChatState {
  conversations: ChatConversation[]
  activeConversationId: string | null
  messages: Record<string, Message[]>
}

interface ChatContextType {
  state: ChatState
  setActiveConversation: (id: string | null) => void
  sendMessage: (conversationId: string, content: string) => void
  markAsRead: (conversationId: string) => void
}

// ==================== CHAT CONTEXT ====================

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    activeConversationId: null,
    messages: {},
  })

  const setActiveConversation = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeConversationId: id }))
  }, [])

  const sendMessage = useCallback((conversationId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'Você',
      senderAvatar: '😎',
      content,
      timestamp: new Date(),
      type: 'text',
      status: 'sending',
    }

    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: [...(prev.messages[conversationId] || []), newMessage],
      },
    }))

    // Simulate sending
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: prev.messages[conversationId].map(m =>
            m.id === newMessage.id ? { ...m, status: 'sent' } : m
          ),
        },
      }))
    }, 500)

    // Simulate auto-reply
    setTimeout(() => {
      const replies = [
        'Olá! Como posso ajudar? 😊',
        'Recebi seu pedido e já estou verificando!',
        'O pedido está sendo preparado!',
        'Saiu para entrega! 🛵',
        'Chegou! Bom apetite! 🍽️',
      ]
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        senderName: 'Atendente',
        senderAvatar: '👨‍💼',
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date(),
        type: 'text',
        status: 'delivered',
      }
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: [...prev.messages[conversationId], reply],
        },
      }))
    }, 2000)
  }, [])

  const markAsRead = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }))
  }, [])

  return (
    <ChatContext.Provider value={{ state, setActiveConversation, sendMessage, markAsRead }}>
      {children}
    </ChatContext.Provider>
  )
}

// ==================== HOOK ====================

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}

// ==================== CHAT LIST ====================

interface ChatListProps {
  onSelect: (id: string) => void
}

export function ChatList({ onSelect }: ChatListProps) {
  const { state, markAsRead } = useChat()
  const { conversations } = state

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Agora'
    if (hours < 24) return `${hours}h`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-3">💬</p>
        <p className="text-brand-muted">Nenhuma conversa</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-brand-line">
      {conversations.map(conversation => (
        <button
          key={conversation.id}
          onClick={() => {
            markAsRead(conversation.id)
            onSelect(conversation.id)
          }}
          className="w-full p-4 flex items-center gap-3 hover:bg-brand-soft transition-colors"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl">
              {conversation.avatar}
            </div>
            {conversation.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-brand-ink truncate">{conversation.title}</p>
              <span className="text-xs text-brand-muted">{formatTime(conversation.lastMessageTime)}</span>
            </div>
            <p className="text-sm text-brand-muted truncate">{conversation.lastMessage}</p>
          </div>

          {conversation.unreadCount > 0 && (
            <div className="w-5 h-5 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
              {conversation.unreadCount}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

// ==================== CHAT WINDOW ====================

interface ChatWindowProps {
  conversationId: string
  onBack: () => void
}

export function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const { state, sendMessage, markAsRead } = useChat()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = state.conversations.find(c => c.id === conversationId)
  const messages = state.messages[conversationId] || []

  useEffect(() => {
    markAsRead(conversationId)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, conversationId, markAsRead])

  const handleSend = () => {
    if (!inputValue.trim()) return
    sendMessage(conversationId, inputValue)
    setInputValue('')
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  if (!conversation) return null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-brand-line flex items-center gap-3">
        <button onClick={onBack} className="text-brand-muted hover:text-brand-ink">
          ←
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl">
            {conversation.avatar}
          </div>
          {conversation.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-bold text-brand-ink">{conversation.title}</p>
          <p className="text-xs text-emerald-600">
            {conversation.online ? 'Online agora' : 'Offline'}
          </p>
        </div>
        <button className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl hover:bg-brand-line">
          📞
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwn = message.senderId === 'user'
          const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!isOwn && showAvatar && (
                <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-lg mr-2">
                  {message.senderAvatar}
                </div>
              )}
              {!isOwn && !showAvatar && <div className="w-8 mr-2" />}

              <div className={`max-w-[75%] ${isOwn ? 'order-1' : ''}`}>
                {showAvatar && (
                  <p className="text-xs text-brand-muted mb-1 ml-1">
                    {message.senderName}
                  </p>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isOwn
                      ? 'bg-brand-red text-white rounded-br-sm'
                      : 'bg-brand-soft text-brand-ink rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-brand-muted">
                    {formatMessageTime(message.timestamp)}
                  </span>
                  {isOwn && (
                    <span className="text-xs">
                      {message.status === 'sending' ? '○' :
                       message.status === 'sent' ? '✓' :
                       message.status === 'delivered' ? '✓✓' : '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-brand-line">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl hover:bg-brand-line">
            📎
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite uma mensagem..."
            className="flex-1 px-4 py-3 bg-brand-soft rounded-full focus:outline-none focus:ring-2 focus:ring-brand-red"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== SUPPORT CHAT PAGE ====================

export function SupportChatPage() {
  const [showChat, setShowChat] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  // Demo conversations
  const [conversations] = useState<ChatConversation[]>([
    {
      id: '1',
      type: 'order',
      title: 'Pedido #1234',
      avatar: '🛵',
      lastMessage: 'Seu pedido está a caminho!',
      lastMessageTime: new Date(),
      unreadCount: 1,
      online: true,
      participants: [],
    },
    {
      id: '2',
      type: 'support',
      title: 'Suporte Feirinha',
      avatar: '💬',
      lastMessage: 'Como podemos ajudar?',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      online: true,
      participants: [],
    },
  ])

  // Demo messages
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        senderId: 'other',
        senderName: 'Entregador',
        senderAvatar: '🧑‍🚀',
        content: 'Olá! Estou a caminho do seu endereço.',
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        status: 'delivered',
      },
      {
        id: '2',
        senderId: 'user',
        senderName: 'Você',
        senderAvatar: '😎',
        content: 'Ótimo! Obrigado!',
        timestamp: new Date(Date.now() - 240000),
        type: 'text',
        status: 'delivered',
      },
    ],
    '2': [
      {
        id: '3',
        senderId: 'other',
        senderName: 'Suporte',
        senderAvatar: '👨‍💼',
        content: 'Olá! Como posso ajudar?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        status: 'delivered',
      },
    ],
  })

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeConversationId])

  const handleSend = () => {
    if (!inputValue.trim() || !activeConversationId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'Você',
      senderAvatar: '😎',
      content: inputValue,
      timestamp: new Date(),
      type: 'text',
      status: 'sending',
    }

    setMessages(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
    }))
    setInputValue('')

    // Auto-reply simulation
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeConversationId]: prev[activeConversationId].map(m =>
          m.id === newMessage.id ? { ...m, status: 'sent' } : m
        ),
      }))
    }, 500)

    setTimeout(() => {
      const replies = [
        'Entendi! Vou verificar isso para você.',
        'Obrigado pelo contato!',
        'Certo! Em breve retornamos.',
      ]
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        senderName: 'Atendente',
        senderAvatar: '👨‍💼',
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date(),
        type: 'text',
        status: 'delivered',
      }
      setMessages(prev => ({
        ...prev,
        [activeConversationId]: [...prev[activeConversationId], reply],
      }))
    }, 1500)
  }

  if (showChat && activeConversationId) {
    const conversation = conversations.find(c => c.id === activeConversationId)
    const chatMessages = messages[activeConversationId] || []

    return (
      <div className="min-h-screen bg-brand-paper flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b border-brand-line flex items-center gap-3">
          <button onClick={() => setShowChat(false)} className="text-brand-muted">
            ←
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl">
              {conversation?.avatar}
            </div>
            {conversation?.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold text-brand-ink">{conversation?.title}</p>
            <p className="text-xs text-emerald-600">
              {conversation?.online ? 'Online agora' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map(message => {
            const isOwn = message.senderId === 'user'
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  isOwn
                    ? 'bg-brand-red text-white rounded-br-sm'
                    : 'bg-white text-brand-ink rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white text-opacity-70' : 'text-brand-muted'}`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-brand-line">
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl">
              📎
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite uma mensagem..."
              className="flex-1 px-4 py-3 bg-brand-soft rounded-full"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="p-4 bg-white border-b border-brand-line">
        <h1 className="text-lg font-extrabold text-brand-ink">💬 Mensagens</h1>
      </div>

      <ChatList onSelect={(id) => {
        setActiveConversationId(id)
        setShowChat(true)
      }} />

      {/* Quick Actions */}
      <div className="p-4 bg-white border-t border-brand-line mt-4">
        <p className="text-sm text-brand-muted mb-3">Ações rápidas</p>
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 bg-brand-soft rounded-xl">
            <span className="text-2xl">❓</span>
            <span className="text-xs font-medium">FAQ</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-brand-soft rounded-xl">
            <span className="text-2xl">📞</span>
            <span className="text-xs font-medium">Ligar</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-brand-soft rounded-xl">
            <span className="text-2xl">📧</span>
            <span className="text-xs font-medium">E-mail</span>
          </button>
        </div>
      </div>
    </div>
  )
}