# NEOTIV — Backend Architecture
> API Design, Tech Stack, Infrastructure & Flows | v1.0 | March 2026

---

## 1. Technology Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Runtime | Node.js 18 LTS | Stable, long-term support |
| Framework | NestJS 10 | Modular, decorator-based, built-in DI |
| Language | TypeScript 5 | Type safety across full stack |
| Database | PostgreSQL 16 | Relational, JSON support, free hosting options |
| ORM | Prisma 5 | Type-safe DB client, auto migrations |
| Cache / Pub-Sub | Redis (Upstash) | WebSocket pub/sub, session cache |
| Realtime | Socket.IO over WebSocket | Chat, notifications, live updates |
| Auth | JWT + Passport.js | Stateless auth, role-based guards |
| File Storage | Cloudflare R2 | Free 10GB/mo, S3-compatible API |
| Validation | Zod + class-validator | Schema validation at API layer |
| Email (optional) | Resend (free tier) | Transactional emails, 3000/mo free |
| Hosting | Railway (free $5 credit) | Containers, auto-deploy from Git |

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
Client Apps (TV Dashboard, Front Office, Management)
        |               |               |
        v               v               v
   [REST API]    [WebSocket]    [REST API]
        \               |               /
         \              v              /
          ------[NestJS API]----------
                  |       |
            [PostgreSQL] [Redis]
                  |
          [Cloudflare R2 Storage]
```

### 2.2 NestJS Module Structure

| Module | Responsibility |
|--------|---------------|
| `AuthModule` | JWT strategy, login, token refresh, role guards |
| `HotelsModule` | CRUD for hotels and organizations |
| `RoomsModule` | CRUD for rooms and room types |
| `GuestSessionsModule` | Check-in/out, session personalization |
| `ChatModule` | WebSocket gateway for real-time messaging |
| `NotificationsModule` | Push to room, broadcast hotel-wide |
| `AlarmsModule` | Create/acknowledge alarms, schedule jobs |
| `DealsModule` | Promo management, image upload |
| `ServicesModule` | Hotel service categories and items |
| `UploadModule` | Cloudflare R2 presigned URL generation |
| `SchedulerModule` | Cron jobs for alarm notifications |

---

## 3. API Endpoints

### 3.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Staff login (email + password) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/tv-login` | TV session auth via room token |
| POST | `/api/auth/logout` | Invalidate session |

### 3.2 Hotels & Rooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | List hotels for current user |
| POST | `/api/hotels` | Create hotel (management role) |
| PATCH | `/api/hotels/:id` | Update hotel details |
| GET | `/api/hotels/:id/rooms` | List rooms with status |
| POST | `/api/rooms` | Create room |
| PATCH | `/api/rooms/:id` | Update room details |

### 3.3 Guest Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rooms/:id/checkin` | Check in guest to room |
| POST | `/api/rooms/:id/checkout` | Check out guest |
| PATCH | `/api/sessions/:id/personalize` | Update name, photo, background |
| GET | `/api/sessions/:id/dashboard` | Full dashboard state for TV |

### 3.4 Communication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications` | Send notification to room(s) |
| GET | `/api/sessions/:id/notifications` | List notifications for session |
| GET | `/api/sessions/:id/chat` | Chat history |
| POST | `/api/alarms` | Guest creates alarm request |
| PATCH | `/api/alarms/:id/ack` | Front office acknowledges alarm |

### 3.5 Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/deals?hotelId=X` | List active deals |
| POST | `/api/deals` | Create deal (FO / Management) |
| GET | `/api/services?hotelId=X` | List hotel services |
| POST | `/api/upload/presign` | Get presigned URL for file upload |

---

## 4. WebSocket Events

| Event Name | Direction | Payload |
|-----------|-----------|---------|
| `chat:message` | FO ↔ TV | `{ sessionId, content, senderRole, timestamp }` |
| `notification:new` | Server → TV | `{ title, body, timestamp }` |
| `alarm:created` | TV → FO | `{ sessionId, scheduledAt, note }` |
| `alarm:acknowledged` | FO → TV | `{ alarmId, acknowledgedBy }` |
| `alarm:trigger` | Server → FO | `{ alarmId, sessionId, roomNumber }` |
| `room:status` | Server → FO | `{ roomId, status }` |
| `session:personalize` | FO → TV | `{ guestName, photoUrl, backgroundUrl }` |

---

## 5. Authentication Flows

### 5.1 Staff Login Flow

```
1. POST /api/auth/login  { email, password }
2. Server validates credentials, checks user role
3. Returns accessToken (24h) + refreshToken (7d) as httpOnly cookies
4. Subsequent requests include cookie automatically
5. On 401 → client calls /api/auth/refresh to get new accessToken
```

### 5.2 TV Dashboard Auth Flow

```
1. Front office checks in guest → system generates sessionToken (UUID)
2. sessionToken encoded as QR code on TV setup screen
3. TV app calls POST /api/auth/tv-login { sessionToken }
4. Server returns room-scoped JWT (valid while session is active)
5. TV subscribes to WebSocket channel using this token
```

---

## 6. Scheduled Jobs

### 6.1 Alarm Scheduler

A NestJS `@Cron` job runs **every minute**. It queries alarms where:
- `scheduledAt` is within the next 2 minutes
- `acknowledged = false`

For each match, it emits a `alarm:trigger` WebSocket event to the relevant front office, prompting staff to call the guest's room.

### 6.2 Session Cleanup

A daily cron at **03:00 AM** hotel local time marks stale sessions (checkout date passed + `isActive = true`) as inactive.

---

## 7. Standard Error Response

All API errors follow this structure:

```json
{
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "Room 417 does not exist",
    "statusCode": 404
  }
}
```

Stack traces are **never** exposed to clients in production. Global NestJS exception filters handle all unhandled errors.

---

## 8. Response Format

All successful responses follow:

```json
{
  "data": { },
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```
