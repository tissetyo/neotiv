# Phase 3: Front Office Panel — Walkthrough

## What Was Built

A comprehensive **Next.js 14 Dashboard Application** (`apps/frontoffice`) tailored for hotel staff to manage guest experiences and interact with the connected TV system.

### Key Highlights & Features

1.  **Dashboard Architecture & Layout**
    *   **Light-Themed Design System**: Switched from the TV's ambient dark aesthetic to a clean, professional "Staff Dashboard" style with a bright sidebar, slate backgrounds, and crisp text using Inter.
    *   **Sidebar Navigation**: Fixed left-side navigation featuring the brand logo, intuitive Lucide icons, and the current user's profile context (`frontdesk@grandsapphire.com`).
    *   **Mock State Sandbox**: Created a robust set of mock data generating 12 rooms across 3 floors, 4 active guest sessions, and varying interaction states (Alarms, Chats, Notifications).

2.  **Room Grid Overview (`/dashboard`)**
    *   Displays 4 summary stat blocks (Total, Available, Occupied, Maintenance).
    *   A responsive grid of `RoomCard` components.
    *   Color-coded pill badges for instant visual status recognition.
    *   Displays current guest name dynamically when occupied.

3.  **Room Detail View (`/dashboard/rooms/[id]`)**
    *   **Guest Profile Card**: Prominent display of check-in dates and session tokens.
    *   **Alarm Queue Component**: Sorts unacknowledged guest wake-up calls to the top. Rings dynamically if past due, and includes a one-click acknowledgment feature.
    *   **Real-time Chat Panel**: Fully functional local-state React chat interface. Sends messages as the staff user (displays on right) simulating interaction with the guest (displays on left).
    *   **Notification History**: Quick-view of broadcast or direct messages sent to that specific room's TV.

4.  **Check-In Flow (`/check-in/new`)**
    *   Split-card form design.
    *   **TV Personalization Tab**: Allows staff to select one of 4 premium Unsplash backgrounds (Ocean, City, Pool, Sand) to push dynamically to the guest's in-room TV shell.

5.  **Deals & Notification Management**
    *   **Deals Manager (`/deals`)**: Grid of promotional cards with dynamic valid/expired badges based on date-fns computation.
    *   **Notification Sender (`/notifications`)**: A split-screen composer to# Walkthrough: Neotiv Multi-Tenant Platform Migration (Phase 5)

We have successfully migrated the Neotiv hospitality platform to a live, multi-tenant architecture using Supabase. The platform now features secure authentication, real-time data synchronization, and property-level management.

## 1. Platform Infrastructure
- **Supabase SSR**: Implemented secure, cookie-based session management across all three applications using `@supabase/ssr`.
- **Database Schema**: Established a robust relational schema with Row Level Security (RLS) to ensure data isolation between hotels and management groups.
- **Dynamic Routing**: The TV Dashboard now utilizes dynamic `/[hotelId]/[roomNumber]` routing to fetch device-specific guest sessions.

## 2. Multi-Tenant Authentication
- **Front Office & Management Login**: Developed production-ready login systems that authenticate staff and administrators against live Supabase Auth records.
- **Role-Based Access**: User profiles are automatically fetched and applied to the dashboard layouts, ensuring staff only see data for their assigned property.

## 3. Real-Time Guest Experience (TV Dashboard)
- **Live Notifications**: Integrated Supabase Channels to deliver emergency alerts and personalized messages to guest TVs instantly.
- **Guest Chat**: Enabled real-time bidirectional communication between the Front Office and the guest room.
- **Alarm Sync**: Synchronized wake-up calls and alarms between the guest's device and the property's management system.

## 4. Hotel Services Management
- **Availability Toggle**: Built a functional service management interface in the Front Office dashboard, allowing staff to hide or show hotel services (e.g., Spa, Pool) in real-time on guest TVs.
- **Management Oversight**: Admins can now manage property-level staff rosters and service configurations from a central dashboard.

## Verification Checklist for User
1.  **Database**: Run `database/schema.sql` and `database/seed.sql` on your Supabase Project.
2.  **Environment Variables**: Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel for all 3 apps.
3.  **Realtime**: Ensure Realtime is enabled in Supabase Replication settings for `chat_messages`, `alarms`, and `notifications`.
 capture the seamless visual interaction and rendering of these features.

### Navigation: Login → Room Grid
*Visualizes entering the app and exploring the status-coded room overviews.*

![Login and Dashboard Grid](/Users/mac/.gemini/antigravity/brain/254c0c85-fcdf-40cb-825e-d57e6e242177/fo_login_grid_1774607399188.webp)

### Deep Dive: Room Detail & Component Interaction
*Visualizes selecting an occupied room, verifying Alarm states, and sending a live chat message from the Staff panel.*

![Room Detail and Chat Interactions](/Users/mac/.gemini/antigravity/brain/254c0c85-fcdf-40cb-825e-d57e6e242177/fo_details_checkin_1774607586179.webp)

### The Check-In Interface
*Visualizes the custom Guest Name, Assign Room select, Date pickers, and the TV Background Image selector.*

![Check-in Flow Preview](/Users/mac/.gemini/antigravity/brain/254c0c85-fcdf-40cb-825e-d57e6e242177/fo_checkin_verify_1774607813334.webp)

---

## Technical Health Check

| Test | Status | Note |
| :--- | :--- | :--- |
| **Monorepo Integration** | ✅ Pass | Shared types (`@neotiv/types`) and TS/Tailwind configs applied flawlessly. |
| **`use client` boundaries** | ✅ Fixed | Interactivity bugs in `AlarmQueue` and `ChatPanel` resolved. |
| **Next.js Dev Server** | ✅ Pass | Runs simultaneously alongside TV app without port conflicts (`:3001` vs `:3000`). |

All Phase 3 Scaffolding milestones are fully met. The UI foundation is now ready to receive real backend WebSocket events and TanStack Query fetching in upcoming phases.

---

# Phase 4: Management Panel — Walkthrough

## What Was Built

A comprehensive **Next.js 14 Management Application** (`apps/management`) tailored for organization super-admins and hotel managers to oversee multiple properties, room inventories, and staff accounts.

### Key Highlights & Features

1.  **Top Navigation Layout**
    *   Transitioned from the Front Office sidebar to a horizontal top navbar, maximizing screen real estate for wide data tables.
    *   Includes organization context ("Neotiv Management Group") and current user profile details.

2.  **Property Management (`/hotels`)**
    *   **Hotel List Dashboard**: Displays a grid of `HotelCard` components showing total rooms, active staff, and status (Active vs Setup Pending) for all properties in the organization.
    *   **Creation Wizard (`/hotels/new`)**: A clean form to input a new property's name, address, timezone, and branding logo.

3.  **Property Detail Dashboard (`/hotels/[id]`)**
    *   **Overview Header**: Large visual banner of the hotel logo with quick-status badges.
    *   **Navigation Tabs**: Secondary tabular navigation to switch context between Overview, Rooms & Types, and Staff Access.
    *   **Quick Actions**: Shortcuts to jump into specific management workflows.

4.  **Deep-Dive Management Views**
    *   **Rooms & Types (`/hotels/[id]/rooms`)**: Data tables outlining room categories (Base Price, Capacity) and physical room inventory mapped to those categories.
    *   **Staff Access (`/hotels/[id]/staff`)**: Roster displaying the Front Office and Hotel Manager accounts permitted to access the property, with inherited access rules for super-admins.

## Verifications & Screen Captures

The following webp recording captures the seamless visual interaction and rendering of these features.

### Full Management Flow
*Visualizes entering the app through Login, exploring the Property Grid, creating a new Hotel, and navigating down into the Rooms and Staff tables for a specific property.*

![Management App Walkthrough](/Users/mac/.gemini/antigravity/brain/254c0c85-fcdf-40cb-825e-d57e6e242177/mg_verification_flow_1774609116659.webp)

## Technical Health Check

| Test | Status | Note |
| :--- | :--- | :--- |
| **Monorepo Integration** | ✅ Pass | Utilizes `@neotiv/types` naturally alongside the rest of the workspace. |
| **Routing** | ✅ Pass | Next.js 14 App Router handles dynamic `[hotelId]` nested routes perfectly. |
| **Next.js Dev Server** | ✅ Pass | Runs simultaneously alongside Front Office and TV apps without port conflicts (`:3002`). |

---

# TV Dashboard UI Fixes — Walkthrough

## Issues Fixed

1. **Overlapping UI**: The Services tile (Food, Spa, Transport, Laundry) was being visually overlapped by the Hotel Info card. Fixed by making Services a standalone tile in the bottom row instead of sharing a column.

2. **D-pad Remote Navigation**: Implemented `setFocus('DASHBOARD_MAIN')` on mount so the Flight Schedule widget is auto-focused when the dashboard loads. Arrow keys (Up/Down/Left/Right) move between all widgets via `@noriginmedia/norigin-spatial-navigation`.

3. **Day/Night Mode**: Background overlay dynamically switches based on local time — dark overlay (`bg-black/70`) after 6 PM and before 6 AM, light overlay (`bg-black/20`) during daytime. Checks every 60 seconds.

## Verification

![TV Dashboard D-pad Test](/Users/mac/.gemini/antigravity/brain/254c0c85-fcdf-40cb-825e-d57e6e242177/tv_dashboard_dpad_test_1774611249736.webp)

| Test | Status | Note |
| :--- | :--- | :--- |
| **Auto-focus** | ✅ Pass | Flight Schedule gets white focus ring on load |
| **Arrow key navigation** | ✅ Pass | Focus moves between all tiles via D-pad |
| **Services visible** | ✅ Pass | Food, Spa, Transport, Laundry icons fully visible |
| **Night mode** | ✅ Pass | Dark overlay active after 6 PM |

---

# Deployment Guide (Vercel)

Since this is a **pnpm + Turborepo** monorepo, you should deploy each of the three applications as a **separate project** on Vercel using the following settings:

### 1. General Settings
- **Framework Preset**: `Next.js`
- **Build Step**: Vercel will automatically detect `pnpm` and `turbo`.

### 2. Project Specifics

| Application | Root Directory | Build Command (Override) |
| :--- | :--- | :--- |
| **TV Dashboard** | `apps/tv-dashboard` | `cd ../.. && npx turbo build --filter=@neotiv/tv-dashboard` |
| **Front Office** | `apps/frontoffice` | `cd ../.. && npx turbo build --filter=@neotiv/frontoffice` |
| **Management** | `apps/management` | `cd ../.. && npx turbo build --filter=@neotiv/management` |

### 3. Environment Variables
For all three projects, ensure you add the following in **Settings > Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`: [Your Supabase URL]
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: [Your Supabase Anon Key]

> [!TIP]
> Each application can be assigned its own domain (e.g., `tv.neotiv.com`, `staff.neotiv.com`, `admin.neotiv.com`) while sharing the same underlying Supabase backend.

