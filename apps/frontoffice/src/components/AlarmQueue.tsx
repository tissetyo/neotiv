'use client'

import { useState } from 'react'
import { Alarm } from '@neotiv/types'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { format, isPast } from 'date-fns'

interface AlarmQueueProps {
  alarms: Alarm[]
}

export function AlarmQueue({ alarms: initialAlarms }: AlarmQueueProps) {
  const [alarms, setAlarms] = useState(initialAlarms)

  const handleAcknowledge = (id: string) => {
    setAlarms(current => 
      current.map(a => a.id === id ? { ...a, acknowledged: true } : a)
    )
  }

  if (alarms.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl mx-auto flex items-center justify-center mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <p className="font-medium text-text-primary">No active alarms</p>
        <p className="text-sm text-text-secondary">The guest hasn't requested any wake-up calls.</p>
      </div>
    )
  }

  // Sort: Unacknowledged first, then by time
  const sortedAlarms = [...alarms].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) {
      return a.acknowledged ? 1 : -1
    }
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  })

  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-border-light bg-bg-body flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Alarm Requests</h3>
        <span className="badge-available">
          {alarms.filter(a => !a.acknowledged).length} Pending
        </span>
      </div>
      
      <div className="divide-y divide-border-light">
        {sortedAlarms.map((alarm) => {
          const time = new Date(alarm.scheduledAt)
          const isTriggered = isPast(time) && !alarm.acknowledged

          return (
            <div 
              key={alarm.id} 
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                alarm.acknowledged ? 'bg-gray-50/50 opacity-60 grayscale' : 
                isTriggered ? 'bg-red-50/30' : ''
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  alarm.acknowledged ? 'bg-gray-200 text-gray-500' :
                  isTriggered ? 'bg-notification-red text-white shadow-lg shadow-red-500/20 animate-pulse' :
                  'bg-primary-50 text-primary'
                }`}>
                  {alarm.acknowledged ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xl font-bold ${isTriggered ? 'text-notification-red' : 'text-text-primary'}`}>
                      {format(time, 'HH:mm')}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {format(time, 'MMM d')}
                    </span>
                  </div>
                  
                  {alarm.note && (
                    <p className="text-sm text-text-secondary">
                      &quot;{alarm.note}&quot;
                    </p>
                  )}

                  {isTriggered && (
                    <div className="flex items-center gap-1.5 text-xs text-notification-red font-medium mt-2">
                       <AlertCircle className="w-3.5 h-3.5" />
                       Alarm is ringing right now
                    </div>
                  )}
                </div>
              </div>

              {!alarm.acknowledged && (
                <button 
                  onClick={() => handleAcknowledge(alarm.id)}
                  className={`btn-primary px-3 py-1.5 text-xs h-auto min-h-0 ${isTriggered ? 'bg-notification-red hover:bg-red-600' : ''}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Acknowledge
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
