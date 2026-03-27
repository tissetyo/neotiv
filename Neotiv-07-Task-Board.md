# NEOTIV — Task Board
> Sprint-Ready Development Tasks Breakdown | v1.0 | March 2026

---

## Overview

Tasks are organized into **5 milestones**. Each task is tagged with:
- **Size**: S = 0.5–1 day, M = 1–2 days, L = 3–4 days
- **Priority**: P1 = must ship, P2 = should ship, P3 = nice to have
- **App**: TV, FO (Front Office), MG (Management), BE (Backend), DevOps

> 💡 All tasks achievable by a single developer using free tools only.

---

## Milestone 1 — Project Foundation
> Estimated: **3–4 days**

| ID | Task | Size | Priority | App |
|----|------|------|----------|-----|
| M1-01 | Initialize monorepo with Turborepo + pnpm workspaces | M | P1 | All |
| M1-02 | Setup shared tsconfig, eslint, prettier configs | S | P1 | All |
| M1-03 | Create three Next.js apps (tv, frontoffice, management) | M | P1 | All |
| M1-04 | Initialize NestJS backend with TypeScript | M | P1 | BE |
| M1-05 | Setup Prisma schema with all entities from ERD | L | P1 | BE |
| M1-06 | Docker Compose for local PostgreSQL + Redis | S | P1 | BE |
| M1-07 | Run initial Prisma migration and seed data | S | P1 | BE |
| M1-08 | Setup CI pipeline (GitHub Actions: lint + test) | M | P2 | All |
| M1-09 | Configure Tailwind + global CSS variables in all apps | S | P1 | Frontend |
| M1-10 | Setup shared `packages/ui` with `WidgetCard` base component | S | P1 | Frontend |

---

## Milestone 2 — Authentication & Core API
> Estimated: **4–5 days**

| ID | Task | Size | Priority | App |
|----|------|------|----------|-----|
| M2-01 | Implement JWT auth module (login, refresh, guards) | L | P1 | BE |
| M2-02 | Implement TV room-scoped session token auth | M | P1 | BE |
| M2-03 | Role-based access control (super_admin, hotel_manager, front_office) | M | P1 | BE |
| M2-04 | Build Hotels CRUD API (create, list, update, soft delete) | M | P1 | BE |
| M2-05 | Build Rooms CRUD API + room types | M | P1 | BE |
| M2-06 | Build Guest Sessions API (check-in, check-out, personalize) | L | P1 | BE |
| M2-07 | Build Upload module with Cloudflare R2 presigned URLs | M | P1 | BE |
| M2-08 | Login page — Front Office app | S | P1 | FO |
| M2-09 | Login page — Management app | S | P1 | MG |
| M2-10 | TV Setup / Token Entry screen | S | P1 | TV |
| M2-11 | Setup Swagger/OpenAPI docs for backend | S | P2 | BE |

---

## Milestone 3 — TV Dashboard
> Estimated: **7–8 days**

| ID | Task | Size | Priority | App |
|----|------|------|----------|-----|
| M3-01 | Welcome screen animation (name, photo, hotel name, room #) | M | P1 | TV |
| M3-02 | Dashboard shell with 12-column CSS grid layout | M | P1 | TV |
| M3-03 | Analog clocks widget (3 timezones, SVG-based with rAF) | M | P1 | TV |
| M3-04 | Digital clock widget + live weather via OpenWeather API | M | P1 | TV |
| M3-05 | Guest card widget (avatar, name, room number) | S | P1 | TV |
| M3-06 | WiFi QR code widget (generate QR from SSID/password) | S | P1 | TV |
| M3-07 | Notification card widget (real-time via WebSocket) | M | P1 | TV |
| M3-08 | Chat overlay (full panel, WS-powered, slide-in animation) | L | P1 | TV |
| M3-09 | Alarm set modal with time picker | M | P1 | TV |
| M3-10 | Hotel services modal (categories grid) | M | P1 | TV |
| M3-11 | Deals carousel widget with poster + description | M | P1 | TV |
| M3-12 | Map preview widget (Google Maps embed) | S | P2 | TV |
| M3-13 | App tiles row (YouTube, Netflix, Disney+, Spotify, TikTok, etc.) | M | P2 | TV |
| M3-14 | Scrolling ticker bar at bottom | S | P2 | TV |
| M3-15 | Socket.IO client setup + Zustand dashboard store | M | P1 | TV |
| M3-16 | D-pad / keyboard navigation (`useTVNavigation` hook) | L | P2 | TV |
| M3-17 | PWA setup with next-pwa + offline dashboard cache | M | P1 | TV |
| M3-18 | WebSocket backend: ChatGateway + NotificationGateway | L | P1 | BE |
| M3-19 | Alarm API + NestJS scheduler cron job | M | P1 | BE |

---

## Milestone 4 — Front Office Panel
> Estimated: **5–6 days**

| ID | Task | Size | Priority | App |
|----|------|------|----------|-----|
| M4-01 | Room grid overview page with status color coding | M | P1 | FO |
| M4-02 | Room detail page (guest info, alarms, notifications) | L | P1 | FO |
| M4-03 | Check-in form (guest name, photo upload, background picker) | M | P1 | FO |
| M4-04 | Check-out action with confirmation dialog | S | P1 | FO |
| M4-05 | Real-time chat panel in room detail (WebSocket) | L | P1 | FO |
| M4-06 | Notification compose + send to room or broadcast | M | P1 | FO |
| M4-07 | Alarm queue with acknowledge button | M | P1 | FO |
| M4-08 | Deals manager (create, edit, delete promo posters) | M | P1 | FO |
| M4-09 | Room personalization (override background per room) | S | P2 | FO |
| M4-10 | Global background setting for entire hotel | S | P2 | FO |
| M4-11 | Deals & Services API (CRUD endpoints) | M | P1 | BE |
| M4-12 | Notifications API (targeted + broadcast) | M | P1 | BE |

---

## Milestone 5 — Management Panel & Polish
> Estimated: **4–5 days**

| ID | Task | Size | Priority | App |
|----|------|------|----------|-----|
| M5-01 | Hotel list page with status summary cards | M | P1 | MG |
| M5-02 | Create new hotel form (wizard-style) | M | P1 | MG |
| M5-03 | Hotel detail — manage rooms and room types | L | P1 | MG |
| M5-04 | Staff management (add/remove front office users) | M | P1 | MG |
| M5-05 | Organization-level deals management | M | P2 | MG |
| M5-06 | Deploy backend to Railway (free tier) | S | P1 | DevOps |
| M5-07 | Deploy all 3 Next.js apps to Vercel | S | P1 | DevOps |
| M5-08 | Setup Cloudflare R2 bucket + env variables | S | P1 | DevOps |
| M5-09 | Setup Upstash Redis + connect to backend | S | P1 | DevOps |
| M5-10 | End-to-end testing of full guest journey | M | P1 | QA |
| M5-11 | TV dashboard performance optimization (< 3s TTI) | M | P1 | TV |
| M5-12 | Accessibility audit: contrast, focus rings, keyboard nav | M | P2 | All |
| M5-13 | Write Postman collection for all API endpoints | S | P2 | BE |

---

## Summary

| Milestone | Total Tasks | P1 Tasks | Est. Days | Key Deliverable |
|-----------|------------|----------|-----------|----------------|
| M1: Foundation | 10 | 8 | 3–4 | Monorepo + DB + CI |
| M2: Auth & Core API | 11 | 9 | 4–5 | Working auth, hotels, rooms |
| M3: TV Dashboard | 19 | 15 | 7–8 | Full TV experience live |
| M4: Front Office | 12 | 10 | 5–6 | Staff can manage guests |
| M5: Management + Polish | 13 | 9 | 4–5 | Multi-hotel, deployed |
| **TOTAL** | **65 tasks** | **51 P1** | **23–28 days** | **Full platform live** |

---

## Definition of Done

A task is considered **done** when:

- [ ] Code is merged to `develop` via reviewed PR
- [ ] No TypeScript errors (`pnpm typecheck` passes)
- [ ] Tests written and passing for any business logic
- [ ] Feature works in both online and offline mode (for TV app)
- [ ] UI matches design spec within reasonable tolerance
- [ ] No console errors or warnings in browser
