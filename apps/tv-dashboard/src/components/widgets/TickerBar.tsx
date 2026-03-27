'use client'

import type { Notification } from '@neotiv/types'

type TickerBarProps = {
  notifications: Notification[]
  hotelName: string
}

export default function TickerBar({ notifications, hotelName }: TickerBarProps): React.ReactElement {
  const unread = notifications.filter((n) => !n.readAt)
  const tickerItems = unread.length > 0
    ? unread.map((n) => `📢 ${n.title}: ${n.body}`)
    : [`✨ Welcome to ${hotelName}! We hope you enjoy your stay.`, '🏊 Pool hours: 7:00 AM - 9:00 PM', '🍽️ Restaurant open for breakfast 6:30 AM - 10:30 AM']

  const tickerText = tickerItems.join('    •    ')

  return (
    <div className="w-full overflow-hidden bg-black/60 border-t border-white/5 py-2 px-4">
      <div className="animate-ticker whitespace-nowrap">
        <span className="text-sm text-white/60 inline-block">
          {tickerText}
          <span className="mx-8">•</span>
          {tickerText}
        </span>
      </div>
    </div>
  )
}
