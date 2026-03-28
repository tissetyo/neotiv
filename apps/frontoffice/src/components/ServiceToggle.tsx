'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface ServiceToggleProps {
  id: string
  initialAvailable: boolean
}

export default function ServiceToggle({ id, initialAvailable }: ServiceToggleProps) {
  const [available, setAvailable] = useState(initialAvailable)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleToggle = async () => {
    setLoading(true)
    const nextValue = !available
    
    try {
      const { error } = await supabase
        .from('hotel_services')
        .update({ is_available: nextValue })
        .eq('id', id)

      if (error) throw error
      setAvailable(nextValue)
    } catch (err) {
      console.error('Failed to toggle service:', err)
      // Revert state on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
        available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {available ? 'Available' : 'Hidden'}
      </span>
      <button 
        onClick={handleToggle}
        disabled={loading}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 outline-none focus:ring-2 focus:ring-primary/20 ${
          available ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
          available ? 'left-6' : 'left-1'
        } flex items-center justify-center`}>
          {loading && <Loader2 className="w-2.5 h-2.5 animate-spin text-primary" />}
        </div>
      </button>
    </div>
  )
}
