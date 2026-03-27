# NEOTIV — Frontend Architecture
> Tech Stack, App Structure, Component Guide & State Management | v1.0 | March 2026

---

## 1. Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 14 (App Router) | React framework for all 3 apps |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| TanStack Query | v5 | Server state, caching, background sync |
| Zustand | v4 | Lightweight global client state |
| Socket.IO Client | v4 | WebSocket connection to backend |
| React Hook Form | v7 | Forms with zod validation |
| Framer Motion | v11 | Animations (widget transitions, overlays) |
| date-fns | v3 | Date formatting for clocks & dates |
| Lucide React | latest | Icon library |
| next-pwa | latest | PWA / Service Worker for offline support |
| qrcode.react | latest | WiFi QR code generation |

---

## 2. App Structure

### 2.1 TV Dashboard (`apps/tv-dashboard`)

```
app/
  (auth)/
    tv-setup/page.tsx       # QR code / token input screen
  dashboard/
    page.tsx                # Main dashboard shell
    welcome/page.tsx        # Welcome animation screen
  components/
    widgets/
      AnalogClocks.tsx      # 3 timezone analog clocks (SVG)
      DigitalClock.tsx      # Local time + live weather
      GuestCard.tsx         # Avatar, name, room number
      WifiQR.tsx            # QR code card (SSID/password)
      NotificationCard.tsx  # Latest notification display
      AlarmWidget.tsx       # Alarm status + open modal
      MapPreview.tsx        # Google Maps embed
      DealsBanner.tsx       # Auto-scrolling deals carousel
      AppTiles.tsx          # Netflix, YouTube, Spotify etc.
      ServicesTile.tsx      # Hotel services shortcut
      TickerBar.tsx         # Bottom scrolling marquee
    overlays/
      ChatOverlay.tsx       # Full-screen chat slide-in
      ServicesModal.tsx     # Service categories grid
      DealsModal.tsx        # Full-screen deal viewer
      AlarmSetModal.tsx     # Time picker + note
  hooks/
    useSocket.ts            # WS connection + room subscription
    useDashboard.ts         # Full dashboard data query
    useAnalogClock.ts       # rAF-based clock tick
    useTVNavigation.ts      # D-pad / keyboard focus management
  stores/
    dashboardStore.ts       # Zustand store for live data
```

### 2.2 Front Office (`apps/frontoffice`)

```
app/
  login/page.tsx
  dashboard/
    page.tsx                # Room grid overview
    rooms/[roomId]/page.tsx # Room detail (chat, alarms, notifs)
  check-in/[roomId]/page.tsx
  deals/page.tsx            # Manage promotional posters
  notifications/page.tsx    # Bulk notification sender
  components/
    RoomCard.tsx            # Grid tile with status badge
    ChatPanel.tsx           # Real-time messaging panel
    AlarmQueue.tsx          # Pending alarm list
    CheckInForm.tsx         # Guest onboarding form
```

### 2.3 Management (`apps/management`)

```
app/
  hotels/
    page.tsx                # Hotel list with summary cards
    [hotelId]/page.tsx      # Hotel detail & settings
    new/page.tsx            # Create hotel wizard
  staff/page.tsx            # Add/remove staff accounts
  rooms/[hotelId]/page.tsx  # Room & room type management
```

---

## 3. Component Architecture

### 3.1 Widget Pattern (TV Dashboard)

Every TV widget is wrapped in a `WidgetCard` that handles glass styling:

```tsx
// packages/ui/WidgetCard.tsx
interface WidgetCardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function WidgetCard({ title, children, className }: WidgetCardProps) {
  return (
    <div className={cn('glass-card', className)}>
      {title && <span className="widget-title">{title}</span>}
      {children}
    </div>
  )
}
```

Global Tailwind utilities in `globals.css`:

```css
@layer utilities {
  .glass-card {
    @apply backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4;
  }
  .widget-title {
    @apply text-xs font-semibold uppercase tracking-widest text-white/50 mb-2 block;
  }
}
```

### 3.2 Analog Clock Widget

```tsx
// Uses requestAnimationFrame for smooth second hand
export function AnalogClocks() {
  const time = useAnalogClock() // { new_york, france, china } — Date objects

  return (
    <WidgetCard>
      <div className="flex gap-4">
        {TIMEZONES.map(tz => (
          <ClockFace key={tz.label} date={time[tz.key]} label={tz.label} />
        ))}
      </div>
    </WidgetCard>
  )
}
```

### 3.3 Real-time State — Zustand + Socket.IO

```ts
// stores/dashboardStore.ts
interface DashboardState {
  session: GuestSession | null
  notifications: Notification[]
  chatMessages: ChatMessage[]
  alarms: Alarm[]
  // Actions
  addNotification: (n: Notification) => void
  addChatMessage: (m: ChatMessage) => void
  acknowledgeAlarm: (alarmId: string) => void
  setSession: (s: GuestSession) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  session: null,
  notifications: [],
  chatMessages: [],
  alarms: [],
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  addChatMessage: (m) => set((s) => ({ chatMessages: [...s.chatMessages, m] })),
  acknowledgeAlarm: (id) => set((s) => ({
    alarms: s.alarms.map(a => a.id === id ? { ...a, acknowledged: true } : a)
  })),
  setSession: (session) => set({ session }),
}))
```

```ts
// hooks/useSocket.ts
export function useSocket(sessionToken: string) {
  const store = useDashboardStore()

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token: sessionToken }
    })

    socket.on('notification:new', store.addNotification)
    socket.on('chat:message', store.addChatMessage)
    socket.on('alarm:acknowledged', ({ alarmId }) => store.acknowledgeAlarm(alarmId))
    socket.on('session:personalize', store.setSession)

    return () => { socket.disconnect() }
  }, [sessionToken])
}
```

---

## 4. Data Fetching Pattern

All server data uses TanStack Query:

```ts
// hooks/useDashboard.ts
export function useDashboard(sessionId: string) {
  return useQuery({
    queryKey: ['dashboard', sessionId],
    queryFn: () => api.get<DashboardData>(`/sessions/${sessionId}/dashboard`),
    staleTime: 30_000,      // 30 seconds
    gcTime: 5 * 60_000,    // 5 minutes offline cache
    refetchOnWindowFocus: false,
  })
}
```

---

## 5. PWA & Offline Support

### 5.1 Service Worker Strategy

| Asset Type | Strategy | Notes |
|-----------|----------|-------|
| Static assets | CacheFirst | App shell, fonts, icons |
| API GET requests | NetworkFirst (5s timeout) | Falls back to cache |
| Dashboard state | StaleWhileRevalidate | Cached in IndexedDB |
| WebSocket | No caching | Shows "No connection" banner gracefully |

### 5.2 App Manifest

```json
{
  "name": "Neotiv TV",
  "display": "fullscreen",
  "orientation": "landscape",
  "theme_color": "#0D7377",
  "background_color": "#0D7377",
  "start_url": "/dashboard"
}
```

---

## 6. TV Navigation (D-Pad / Remote)

Since the TV runs on a set-top box, all widgets must support D-pad navigation:

```ts
// hooks/useTVNavigation.ts
export function useTVNavigation(gridRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': focusNext(gridRef); break
        case 'ArrowLeft':  focusPrev(gridRef); break
        case 'ArrowDown':  focusDown(gridRef); break
        case 'ArrowUp':    focusUp(gridRef);   break
        case 'Enter':      activateFocused();  break
        case 'Escape':     closeOverlay();     break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
```

**Rules:**
- All clickable widgets: `tabIndex={0}`
- Focus ring: `focus:ring-2 focus:ring-teal-400 focus:outline-none`
- Escape key always closes any open overlay

---

## 7. Performance Targets

| Metric | TV Dashboard | FO / Management |
|--------|-------------|-----------------|
| First Contentful Paint | < 1.5s | < 1.0s |
| Time to Interactive | < 3.0s | < 2.0s |
| Lighthouse Performance | > 80 | > 90 |
| Offline Fallback | Required | Optional |
| First Load JS Bundle | < 250kb gzipped | < 180kb gzipped |

---

## 8. Environment Variables (Frontend)

```env
NEXT_PUBLIC_API_URL=https://api.neotiv.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here
```
