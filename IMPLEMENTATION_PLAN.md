# Phase 5: Backend & Realtime Integration

Migrate the NeoTiv hospitality platform from static `mock-data.ts` files to a robust, real-time backend. Per your request, we will **NOT** use Prisma. Instead, we will leverage **Supabase** directly for PostgreSQL, Row Level Security (RLS), and real-time WebSockets.

## User Review Required

> [!IMPORTANT]
> **Database Host**: Since we are bypassing a separate Node.js/NestJS backend and Prisma, the Next.js apps will communicate directly with Supabase via client-side and server-side fetching. I will generate the `schema.sql` footprint for you to run in your Supabase SQL Editor. Please confirm if this approach is correct.

> [!WARNING]
> **Authentication**: This phase will structure the database schema and data fetching. We can integrate Supabase Auth, but to preserve the current seamless UI flow, I recommend initially focusing on data fetching and real-time channels using mocked user IDs or anonymous access, before strictly enforcing RLS UI boundaries. Let me know your preference.

---

## Proposed Changes

### 1. Supabase Initialization & Core Utils

#### [NEW] [packages/supabase-config](file:///Users/mac/Documents/Antigravity/neotiv/packages/supabase-config)
- Create a shared internal package for Supabase utilities.
- Export `createClient()` singleton instances for both browser and server capabilities.
- Add `@supabase/supabase-js` dependencies to the workspace.

#### [NEW] [database/schema.sql](file:///Users/mac/Documents/Antigravity/neotiv/database/schema.sql)
- Raw PostgreSQL definitions representing our ERD:
  - `organizations`
  - `hotels`
  - `users` (joined with auth.users)
  - `room_types`
  - `rooms`
  - `guest_sessions`
  - `chat_messages`
  - `alarms`
  - `notifications`
  - `deals`
- Includes foreign keys, realtime publication triggers, and RLS defaults.

#### [NEW] [database/seed.sql](file:///Users/mac/Documents/Antigravity/neotiv/database/seed.sql)
- Insert the static arrays currently living in `mock-data.ts` directly into the database to bootstrap interactions.

---

### 2. Client Integrations (React Query + Supabase)

#### [MODIFY] Management Panel (`apps/management/`)
- Remove `mock-data.ts`.
- Wrap the app in a `QueryClientProvider` (TanStack Query).
- Refactor `app/hotels/page.tsx` to query `supabase.from('hotels').select('*')`.
- Refactor `app/hotels/[hotelId]/rooms/page.tsx` to fetch `rooms` and `room_types` with foreign key relations.

#### [MODIFY] Front Office Panel (`apps/frontoffice/`)
- Remove `mock-data.ts`.
- Refactor the Room Grid (`app/dashboard/page.tsx`) to query live tracking of room statuses and active guest sessions.
- Replace the Check-In form state creation with an `INSERT` statement to the `guest_sessions` table.

#### [MODIFY] TV Dashboard (`apps/tv-dashboard/`)
- Remove `mock-data.ts`.
- Fetch personalized settings (guest name, background, deals) based on local active session URL params or local storage tokens.

---

### 3. Realtime Interactions (WebSockets)

#### [MODIFY] Chat Panel (`components/ChatPanel.tsx`)
- Implement `supabase.channel('room-chat')` to subscribe to new `INSERT`s on `chat_messages` where `session_id == currentSession`.
- Make it works bidirectionally between TV and Front Office.

#### [MODIFY] Alarm / Notification Sync
- The TV app listens for new `notifications` rows to trigger the notification toast overlay.
- The Front Office app listens to changes in `alarms` (creation or cancellation from TV) to update the Staff Queue.

---

## Verification Plan

### Database Health
1. You will execute `schema.sql` and `seed.sql` in to your Supabase instance.
2. Provide `.env.local` to the apps with the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Integration Checks
- Verify that checking in a user in the Front Office app instantly reflects in the Management panel without a refresh (via React Query invalidation).
- Open TV Dashboard (`:3000`) and Front Office (`:3001`) side-by-side. 
- Send a chat message from FO to TV and verify sub-second delivery via Supabase Realtime channels.
