# Phase 5: Backend & Realtime Integration (Supabase)

## Environment Setup
- [ ] Initialize Supabase project (local or cloud instructions)
- [ ] Install `@supabase/supabase-js` and auth helpers across `apps/tv-dashboard`, `apps/frontoffice`, and `apps/management`
- [ ] Configure environment variables for Supabase URL and Anon Key in all 3 apps

## Database Schema Design (SQL)
- [x] Create `schema.sql` defining Tables (Hotels, Rooms, RoomTypes, Users, GuestSessions, Messages, Alarms, Notifications, Deals)
- [x] Define Row Level Security (RLS) policies for each table
- [x] Write seed SQL script to insert Phase 1-4 mock data into Supabase

## Frontend Data Fetching (TanStack Query)
- [ ] Create Supabase client utility (`utils/supabase.ts`) in shared `packages/` or directly in apps
- [ ] Migrate `apps/management` (Hotel, Room, Staff data) from `mock-data.ts` to TanStack queries fetching from Supabase
- [ ] Migrate `apps/frontoffice` (Dashboard Grid, Check-in, Rooms) to fetch from Supabase
- [ ] Migrate `apps/tv-dashboard` constraints to dynamic Supabase fetching via Session Token

## Realtime Integration (Zustand + WebSockets)
- [ ] Implement Supabase Realtime subscriptions for Chat Messages (TV & Front Office)
- [ ] Implement Supabase Realtime subscriptions for Alarms (Front Office queue updates)
- [ ] Implement Supabase Realtime subscriptions for Notifications (TV overlay alerts)
- [ ] Implement Supabase Realtime for Room Status changes (Staff Dashboard grid)

## Verification
- [ ] Test full check-in flow mapping to database
- [ ] Test real-time chat between specific TV session and Staff
- [ ] Test real-time alarm trigger sequence
