'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { toast } from './toast'

interface Message {
  id: string
  type: 'user' | 'support' | 'system'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'read'
}

interface ChatConversation {
  id: string
  title: string
  status: 'open' | 'closed'
  lastMessage: string
  unread: number
  updatedAt: Date
}

interface SupportChatProps {
  orderId?: string
  storeId?: string
  initialOpen?: boolean
}

export function SupportChat({ orderId, storeId, initialOpen = false }: SupportChatProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'support',
      content: 'Olá! Como posso ajudar você hoje? 😊',
      timestamp: new Date(),
      status: 'read',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sending',
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate sending
    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.id === userMessage.id ? { ...m, status: 'sent' } : m
      ))
    }, 500)

    // Simulate response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const responses = [
        'Entendi! Vou verificar isso para você.',
        'Obrigado pela mensagem! Um momento...',
        'Perfeito! Já estou verificando.',
        'Claro! Posso ajudar com isso.',
      ]
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'support',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        status: 'read',
      }])
    }, 2000)
  }

  const quickActions = [
    { emoji: '📍', label: 'Acompanhar pedido' },
    { emoji: '❌', label: 'Cancelar pedido' },
    { emoji: '💰', label: 'Problema com pagamento' },
    { emoji: '🍔', label: 'Problema com pedido' },
    { emoji: '⭐', label: 'Avaliar experiência' },
  ]

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all z-40 ${
          isOpen ? 'bg-gray-500 rotate-45' : 'bg-brand-red hover:bg-red-600'
        }`}
      >
        💬
      </button>

      {/* Chat window */}
      {isOpen && (
        <Card
          padding="none"
          className="fixed bottom-32 right-4 w-80 max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-200px)] flex flex-col shadow-2xl z-50"
        >
          {/* Header */}
          <div className="bg-brand-red text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                👨‍💼
              </div>
              <div>
                <p className="font-bold">Suporte Feirinha</p>
                <p className="text-xs text-white text-opacity-80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Online agora
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-opacity-80 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Order context */}
          {orderId && (
            <div className="px-4 py-2 bg-brand-soft text-sm">
              Referência: Pedido #{orderId}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-brand-red text-white rounded-br-sm'
                      : message.type === 'system'
                      ? 'bg-gray-100 text-gray-600 text-center text-sm w-full'
                      : 'bg-brand-soft text-brand-ink rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.type === 'user' && (
                      <span className="text-xs">
                        {message.status === 'sending' && '○'}
                        {message.status === 'sent' && '✓'}
                        {message.status === 'read' && '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-brand-soft p-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="px-4 pb-2 overflow-x-auto">
            <div className="flex gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(action.label)}
                  className="px-3 py-1 bg-brand-soft rounded-full text-xs whitespace-nowrap hover:bg-brand-line"
                >
                  {action.emoji} {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-brand-line">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 bg-brand-soft rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center disabled:opacity-50"
              >
                📤
              </button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}

// ==================== CONVERSATION LIST ====================

export function ConversationList() {
  const [conversations, setConversations] = useState<ChatConversation[]>([
    { id: '1', title: 'Problema com pedido #FE-1234', status: 'open', lastMessage: 'Seu pedido está sendo preparado...', unread: 2, updatedAt: new Date() },
    { id: '2', title: 'Dúvida sobre entrega', status: 'closed', lastMessage: 'Obrigado pela ajuda!', unread: 0, updatedAt: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Cancelamento', status: 'closed', lastMessage: 'Pedido cancelado com sucesso.', unread: 0, updatedAt: new Date(Date.now() - 172800000) },
  ])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = diff / 3600000
    if (hours < 24) return `${Math.floor(hours)}h atrás`
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-3">
      {conversations.map(conv => (
        <Card key={conv.id} padding="md" className="cursor-pointer hover:bg-brand-soft transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white">
              💬
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-bold text-brand-ink truncate">{conv.title}</p>
                <span className="text-xs text-brand-muted">{formatTime(conv.updatedAt)}</span>
              </div>
              <p className="text-sm text-brand-muted truncate mt-1">{conv.lastMessage}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant={conv.status === 'open' ? 'success' : 'outline'} className="text-xs">
                  {conv.status === 'open' ? '🟢 Aberto' : '❌ Encerrado'}
                </Badge>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-brand-red text-white rounded-full text-xs flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ==================== CHAT TYPES ====================

interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
}

interface GroupChatProps {
  participants: ChatUser[]
  orderId?: string
  storeId?: string
}

export function GroupChat({ participants, orderId, storeId }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const currentUser = participants[0]
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Card padding="md">
      {/* Participants */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-brand-line">
        <div className="flex -space-x-2">
          {participants.slice(0, 3).map((p, idx) => (
            <div
              key={p.id}
              className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white text-xs font-bold border-2 border-white"
            >
              {p.avatar || p.name.charAt(0)}
            </div>
          ))}
        </div>
        <span className="text-sm text-brand-muted">
          {participants.length} participantes
        </span>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-brand-muted">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-sm">Inicie uma conversa com a loja</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite..."
          className="flex-1 px-4 py-2 bg-brand-soft rounded-full text-sm"
        />
        <Button size="sm" onClick={() => {
          if (input.trim()) {
            toast.success('Mensagem enviada!')
            setInput('')
          }
        }}>
          Enviar
        </Button>
      </div>
    </Card>
  )
}