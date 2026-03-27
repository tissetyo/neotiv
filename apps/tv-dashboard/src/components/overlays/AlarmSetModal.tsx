'use client'

import { useState } from 'react'
import { X, AlarmClock, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type AlarmSetModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave?: (time: string, note: string) => void
}

export default function AlarmSetModal({ isOpen, onClose, onSave }: AlarmSetModalProps): React.ReactElement {
  const [hours, setHours] = useState('06')
  const [minutes, setMinutes] = useState('30')
  const [note, setNote] = useState('')

  const handleSave = (): void => {
    onSave?.(`${hours}:${minutes}`, note)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <AlarmClock className="w-5 h-5 text-primary-light" />
                </div>
                <h2 className="text-xl font-bold text-white">Set Wake-Up Call</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Time Picker */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setHours(String((parseInt(hours) + 1) % 24).padStart(2, '0'))}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  ▲
                </button>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 2)
                    if (parseInt(v) < 24 || v === '') setHours(v)
                  }}
                  className="w-20 text-center text-5xl font-bold font-mono text-white bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => setHours(String((parseInt(hours) - 1 + 24) % 24).padStart(2, '0'))}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  ▼
                </button>
              </div>

              <span className="text-4xl font-bold text-primary-light">:</span>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => setMinutes(String((parseInt(minutes) + 5) % 60).padStart(2, '0'))}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  ▲
                </button>
                <input
                  type="text"
                  value={minutes}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 2)
                    if (parseInt(v) < 60 || v === '') setMinutes(v)
                  }}
                  className="w-20 text-center text-5xl font-bold font-mono text-white bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => setMinutes(String((parseInt(minutes) - 5 + 60) % 60).padStart(2, '0'))}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  ▼
                </button>
              </div>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className="text-xs text-white/50 mb-2 block">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Airport transfer at 7:00 AM"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 rounded-xl bg-primary hover:bg-primary-light transition-colors text-white text-sm font-semibold"
              >
                Set Alarm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
