'use client'

import { AlarmClock, Clock } from 'lucide-react'
import type { Alarm } from '@neotiv/types'
import { format } from 'date-fns'

type AlarmWidgetProps = {
  alarms: Alarm[]
  onSetAlarm?: () => void
}

export default function AlarmWidget({ alarms, onSetAlarm }: AlarmWidgetProps): React.ReactElement {
  const activeAlarms = alarms.filter((a) => !a.acknowledged)

  return (
    <div
      className="glass-card-hover"
      tabIndex={0}
      onClick={onSetAlarm}
      onKeyDown={(e) => e.key === 'Enter' && onSetAlarm?.()}
      role="button"
      aria-label="Set alarm"
    >
      <span className="widget-title">Alarm</span>
      {activeAlarms.length > 0 ? (
        <div className="space-y-2">
          {activeAlarms.map((alarm) => (
            <div key={alarm.id} className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <AlarmClock className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <p className="text-lg font-bold font-mono text-white">
                  {format(new Date(alarm.scheduledAt), 'HH:mm')}
                </p>
                {alarm.note && (
                  <p className="text-xs text-white/50">{alarm.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-white/5">
            <Clock className="w-5 h-5 text-white/30" />
          </div>
          <div>
            <p className="text-sm text-white/50">No alarm set</p>
            <p className="text-xs text-white/30">Click to set a wake-up call</p>
          </div>
        </div>
      )}
    </div>
  )
}
