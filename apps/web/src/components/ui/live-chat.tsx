'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  quickReplies?: string[]
}

const botResponses: Record<string, string[]> = {
  'pedido': [
    'Para rastrear seu pedido, acesse "Meus Pedidos" e toque no pedido que deseja acompanhar.',
    'Você receberá notificações push com o status do seu pedido em tempo real!',
  ],
  'cancelar': [
    'Para cancelar um pedido, acesse "Meus Pedidos" e toque em "Cancelar" antes do preparo iniciar.',
    'Após o preparo, não é possível cancelar, mas você pode recusar na entrega para receber reembolso.',
  ],
  'entrega': [
    'O tempo de entrega varia de 25 a 45 minutos dependendo da loja e região.',
    'Você pode agendar a entrega para um horário específico na página de checkout.',
  ],
  'pagamento': [
    'Aceitamos PIX, cartão de crédito/débito e vale-refeição.',
    'Pagamentos via PIX têm 5% de desconto!',
    'O pagamento é processado de forma segura.',
  ],
  'cupom': [
    'Você pode usar cupons na página de checkout.',
    'Temos cupons de desconto, frete grátis e muito mais! Fique atento às promoções.',
  ],
  'default': [
    'Entendi! Posso ajudar com informações sobre pedidos, pagamentos, entregas e muito mais.',
    'Posso ajudar com algo mais? 😊',
    'Se precisar de ajuda urgente, ligue para (11) 99999-9999.',
  ],
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Sou a assistente virtual da Feirinha Express. Como posso ajudar?',
      isBot: true,
      timestamp: new Date(),
      quickReplies: ['📦 Rastrear pedido', '💳 Pagamento', '🚚 Entrega', '🎫 Cupons'],
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getBotResponse = (userMessage: string): string[] => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('pedido') || lowerMessage.includes('rastrear')) {
      return botResponses['pedido']
    }
    if (lowerMessage.includes('cancelar')) {
      return botResponses['cancelar']
    }
    if (lowerMessage.includes('entrega') || lowerMessage.includes('tempo')) {
      return botResponses['entrega']
    }
    if (lowerMessage.includes('pagamento') || lowerMessage.includes('pagar')) {
      return botResponses['pagamento']
    }
    if (lowerMessage.includes('cupom') || lowerMessage.includes('desconto')) {
      return botResponses['cupom']
    }
    return botResponses['default']
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')

    // Bot typing indicator
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const responses = getBotResponse(text)
      responses.forEach((response, idx) => {
        setTimeout(() => {
          const botMsg: Message = {
            id: (Date.now() + idx).toString(),
            text: response,
            isBot: true,
            timestamp: new Date(),
            quickReplies: idx === responses.length - 1
              ? ['📦 Pedidos', '💬 Falar atendente', '❓ FAQ']
              : undefined,
          }
          setMessages(prev => [...prev, botMsg])
        }, idx * 500)
      })
    }, 1000)
  }

  const handleQuickReply = (reply: string) => {
    sendMessage(reply)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-brand-red text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform z-40"
      >
        💬
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-fade-up">
      {/* Header */}
      <div className="bg-brand-red text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            🤖
          </div>
          <div>
            <p className="font-bold">Feirinha Bot</p>
            <p className="text-xs text-white text-opacity-80">Sempre online</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] ${msg.isBot ? '' : 'order-2'}`}>
              {msg.isBot && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-brand-red bg-opacity-10 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <span className="text-xs text-brand-muted">Feirinha Bot</span>
                </div>
              )}
              <div
                className={`p-3 rounded-2xl ${
                  msg.isBot
                    ? 'bg-brand-soft text-brand-ink rounded-tl-none'
                    : 'bg-brand-red text-white rounded-tr-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>

              {/* Quick replies */}
              {msg.quickReplies && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 bg-white border border-brand-line rounded-full text-xs font-medium hover:border-brand-red hover:text-brand-red transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-red bg-opacity-10 flex items-center justify-center text-sm">
                🤖
              </div>
              <div className="bg-brand-soft p-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-brand-line">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 bg-brand-soft rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
          />
          <button
            onClick={() => sendMessage(inputValue)}
            className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red-dark transition-colors"
          >
            ➤
          </button>
        </div>
        <p className="text-xs text-center text-brand-muted mt-2">
          Atendimento automático 24h |{' '}
          <Link href="/user/help" className="text-brand-red hover:underline">
            Falar com atendente
          </Link>
        </p>
      </div>
    </div>
  )
}