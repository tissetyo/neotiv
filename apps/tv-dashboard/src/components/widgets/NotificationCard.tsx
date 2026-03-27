'use client'

import { Bell, Check } from 'lucide-react'
import type { Notification } from '@neotiv/types'
import { formatDistanceToNow } from 'date-fns'

type NotificationCardProps = {
  notifications: Notification[]
}

export default function NotificationCard({ notifications }: NotificationCardProps): React.ReactElement {
  const unreadCount = notifications.filter((n) => !n.readAt).length
  const latestNotifs = notifications.slice(0, 3)

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="widget-title mb-0">Notifications</span>
        {unreadCount > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-notification-red text-white text-[10px] font-bold px-1.5">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {latestNotifs.map((notif) => (
          <div
            key={notif.id}
            className={`p-2.5 rounded-xl transition-colors ${
              notif.readAt
                ? 'bg-white/5'
                : 'bg-primary/10 border border-primary/20'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 p-1 rounded-full ${notif.readAt ? 'bg-white/10' : 'bg-primary/30'}`}>
                {notif.readAt ? (
                  <Check className="w-3 h-3 text-white/40" />
                ) : (
                  <Bell className="w-3 h-3 text-primary-light" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{notif.title}</h4>
                <p className="text-xs text-white/50 line-clamp-2 mt-0.5">{notif.body}</p>
                <span className="text-[10px] text-white/30 mt-1 block">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-4 text-white/30">
            <Bell className="w-6 h-6 mb-2" />
            <span className="text-xs">No notifications</span>
          </div>
        )}
      </div>
    </div>
  )
}
