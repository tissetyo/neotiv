'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@neotiv/types'
import { Send, User, Building2 } from 'lucide-react'
import { format } from 'date-fns'
import { mockStaff } from '@/data/mock-data'

interface ChatPanelProps {
  messages: ChatMessage[]
  guestName: string
}

export function ChatPanel({ messages: initialMessages, guestName }: ChatPanelProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId: 'current-session',
      senderRole: 'front_office',
      content: input.trim(),
      readAt: null,
      createdAt: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
    setInput('')
  }

  return (
    <div className="card h-[600px] flex flex-col p-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-light bg-bg-body flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text-primary">Live Chat</h3>
          <p className="text-xs text-text-secondary">Connected with Room TV</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 bg-emerald-50 text-success rounded-full">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Online
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="empty-state h-full">
            <div className="empty-state-icon">
              <Send className="w-8 h-8" />
            </div>
            <p className="font-medium text-text-primary">No messages yet</p>
            <p className="text-sm text-text-secondary mt-1">Start chatting with the guest</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isStaff = msg.senderRole === 'front_office'
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isStaff ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isStaff ? 'bg-primary text-white' : 'bg-primary-50 text-primary'
                }`}>
                  {isStaff ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                
                <div className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-text-primary">
                      {isStaff ? mockStaff.email.split('@')[0] : guestName}
                    </span>
                    <span className="text-[10px] text-text-secondary">
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </span>
                  </div>
                  
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isStaff 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-border-light text-text-primary rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {isStaff && msg.readAt && (
                    <span className="text-[10px] text-text-secondary mt-1">Read</span>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-border-light">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-border-light rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-2 bottom-2 w-8 flex items-center justify-center text-primary hover:bg-primary-50 rounded-lg disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
