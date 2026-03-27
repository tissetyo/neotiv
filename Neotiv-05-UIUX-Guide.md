# NEOTIV — UI/UX Guide & Wireframes
> Design System, User Flows & Screen Specifications | v1.0 | March 2026

---

## 1. Design Principles

| Principle | Description |
|-----------|-------------|
| **TV-First** | All TV dashboard elements legible from 3 meters. Min font 18px, preferred 24px+ |
| **Ambient** | UI feels like part of the room. Full-bleed backgrounds, glass-morphism cards |
| **Instant** | Every interaction feels immediate. Skeleton loaders, no blank states |
| **Accessible** | High contrast text (min WCAG AA). Light text on dark/photo backgrounds |
| **Offline-ready** | Core dashboard widgets render from cache if network drops |

---

## 2. Design System

### 2.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#0D7377` | Teal — brand, CTAs, highlights |
| `--primary-light` | `#14BDAC` | Hover states, secondary actions |
| `--surface-dark` | `rgba(0,0,0,0.45)` | Glass card backgrounds |
| `--surface-border` | `rgba(255,255,255,0.15)` | Glass card borders |
| `--text-primary` | `#FFFFFF` | Primary text on dark/photo backgrounds |
| `--text-muted` | `rgba(255,255,255,0.65)` | Secondary text, captions |
| `--notification-red` | `#FF4757` | Alerts, unread badges |
| `--success` | `#2ED573` | Online status, confirmed states |

### 2.2 Typography

| Element | Size / Weight | Font |
|---------|--------------|------|
| Digital Clock | 96px / Bold | Inter or Roboto Mono |
| Date Display | 24px / Medium | Inter |
| Guest Name | 32px / Bold | Inter |
| Widget Title | 14px / SemiBold Uppercase | Inter |
| Widget Body | 18px / Regular | Inter |
| Notification Title | 20px / SemiBold | Inter |
| Ticker Text | 16px / Regular | Inter |
| UI Labels (FO/Admin) | 14px / Regular | Inter |

### 2.3 Component Patterns

**Glass Card**
```css
.glass-card {
  backdrop-filter: blur(12px);
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 16px;
}
```

**Icon Tile** — 80×80px rounded square, icon centered, label below. Used for app shortcuts (YouTube, Netflix, etc.)

**Widget Header** — 12px uppercase semibold label with subtle left border in `--primary` color

**Avatar** — Circular photo, 64px on dashboard, 48px in header, ring in `--primary` color

**Status Badge** — Pill shape, color-coded:
- 🟢 Green = on time / available
- 🔴 Red = closed / occupied
- 🟠 Orange = delay / maintenance

---

## 3. Screen Inventory

### TV Dashboard App

| ID | Screen | Description |
|----|--------|-------------|
| TV-01 | Welcome / Splash | Full-bleed background, guest name, hotel name, room number |
| TV-02 | Main Dashboard | All widgets in single-screen grid layout |
| TV-03 | Chat Overlay | Full-screen chat panel slides in from right |
| TV-04 | Hotel Services Modal | Grid of service categories, expandable |
| TV-05 | Deals Carousel | Full-screen poster viewer with description |
| TV-06 | Alarm Set Screen | Time picker + note input |
| TV-07 | Map Viewer | Embedded Google Maps iframe, location preview |

### Front Office App

| ID | Screen | Description |
|----|--------|-------------|
| FO-01 | Login | Simple email/password form |
| FO-02 | Room Grid | All rooms overview with status color coding |
| FO-03 | Room Detail | Guest info, chat, notifications, alarm list |
| FO-04 | Check-In Form | Guest name, photo upload, background selection |
| FO-05 | Deals Manager | CRUD for promo posters |

### Management App

| ID | Screen | Description |
|----|--------|-------------|
| MG-01 | Hotel List | All hotels, status, quick actions |
| MG-02 | Hotel Setup | Create/edit hotel, add staff, manage rooms |

---

## 4. UX Flows

### 4.1 Guest Check-In Flow (Front Office)

```
1. FO opens Room Grid (FO-02) → selects available room
2. Opens Check-In Form (FO-04)
3. Fills: guest name, uploads photo, optionally sets background
4. Clicks "Check In" → API creates guest_session + generates sessionToken
5. TV in room detects new session via WebSocket
6. TV transitions from idle → Welcome Screen (TV-01)
7. After 8 seconds → TV transitions to Main Dashboard (TV-02)
```

### 4.2 Guest Sends Chat Message (TV)

```
1. Guest clicks Chat icon on dashboard
2. Chat Overlay (TV-03) slides in from right
3. Guest types message using connected keyboard or remote
4. Message emitted via WebSocket chat:message event
5. Front office (FO-03) receives real-time notification badge
6. FO staff replies → reply appears instantly on TV overlay
```

### 4.3 Alarm Request Flow

```
1. Guest clicks Alarm widget → Alarm Set Screen (TV-06) appears
2. Guest sets time and optional note, confirms
3. API creates alarm record → emits alarm:created WS event to FO
4. Front office sees alarm in their room queue
5. At scheduled time: cron job emits alarm:trigger event to FO
6. Staff calls room or visits physically
7. Staff acknowledges alarm in FO-03 panel
```

### 4.4 Send Notification to Room (FO)

```
1. Staff opens Room Detail (FO-03)
2. Clicks "Add Notification"
3. Fills title and body text
4. Clicks Send → server emits notification:new WS event to TV
5. TV displays notification card with timestamp
```

---

## 5. TV Dashboard Layout Grid (TV-02)

Layout uses a **12-column CSS Grid** at 1920×1080 resolution.

| Zone | Grid Area | Widgets |
|------|-----------|---------|
| Top-Left | col 1–4, row 1–2 | 3 Analog Clocks + Weather + Digital Clock |
| Top-Center | col 5–9, row 1–4 | Background photo focal area |
| Top-Right | col 10–12, row 1–2 | Guest Avatar, Name, Room Number |
| Mid-Right | col 10–12, row 3 | WiFi QR Code card |
| Mid-Right | col 10–12, row 4–5 | Notification card |
| Left | col 1–4, row 3–5 | Flight Schedule / scrollable info table |
| Bottom-Left | col 1–3, row 6–7 | Hotel Deals carousel |
| Bottom-Center-L | col 4–5, row 6–7 | Hotel Services + Hotel Info tiles |
| Bottom-Center | col 6–7, row 6–7 | Map preview |
| Bottom-Right | col 8–12, row 6–7 | App shortcut tiles (YouTube, Netflix, etc.) |
| Bottom Ticker | col 1–12, row 8 | Scrolling marquee with notifications/info |

---

## 6. TV-01 Welcome Screen Spec

```
Background: Full-bleed hotel background image (default or per-room)
Top-right: Room number  (large, white, bold)

Center card (glass-morphism):
  ┌─────────────────────────────────┐
  │  [Guest Avatar - 80px circle]   │
  │                                 │
  │  Welcome in [Hotel Name]!       │
  │  Mr./Ms. [Guest Name]           │
  │  ─────────────────────────────  │
  │  We hope you enjoy your stay.   │
  │  Your comfort is our priority!  │
  └─────────────────────────────────┘

Transition: Fade in over 1s → hold 8s → fade out to TV-02
```
