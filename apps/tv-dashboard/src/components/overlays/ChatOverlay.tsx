'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatMessage } from '@neotiv/types'
import { format } from 'date-fns'

type ChatOverlayProps = {
  isOpen: boolean
  onClose: () => void
  messages: ChatMessage[]
  guestName: string
}

export default function ChatOverlay({ isOpen, onClose, messages, guestName }: ChatOverlayProps): React.ReactElement {
  const [input, setInput] = useState('')
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages])

  const handleSend = (): void => {
    if (!input.trim()) return
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sessionId: 'session-001',
      senderRole: 'guest',
      content: input.trim(),
      readAt: null,
      createdAt: new Date().toISOString(),
    }
    setLocalMessages((prev) => [...prev, newMsg])
    setInput('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-[400px] z-50 flex flex-col"
          style={{ background: 'rgba(10, 15, 20, 0.95)', backdropFilter: 'blur(20px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <MessageCircle className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Front Office</h2>
                <span className="text-xs text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" /> Online
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {localMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderRole === 'guest' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.senderRole === 'guest'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white/10 text-white rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] text-white/40 mt-1 block text-right">
                    {format(new Date(msg.createdAt), 'HH:mm')}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 rounded-xl bg-primary hover:bg-primary-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-light"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
