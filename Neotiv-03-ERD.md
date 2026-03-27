# NEOTIV — Entity Relationship Diagram
> Database Schema & Entity Relationships | v1.0 | March 2026

---

## 1. ERD Overview

The Neotiv database is organized around three main domains:

- **Hotel Management** — hotels, rooms, staff
- **Guest Experience** — sessions, alarms, notifications
- **Content** — deals, services, media

All entities use UUID primary keys and include standard audit timestamps (`createdAt`, `updatedAt`).

---

## 2. Entity Definitions

### 2.1 Organizations & Hotels

```
organizations
  id            UUID PK
  name          VARCHAR(255) NOT NULL
  slug          VARCHAR(100) UNIQUE
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
```

```
hotels
  id              UUID PK
  organizationId  UUID FK -> organizations.id
  name            VARCHAR(255) NOT NULL
  address         TEXT
  timezone        VARCHAR(50)   -- e.g. Asia/Makassar
  logoUrl         TEXT          -- Cloudflare R2 URL
  deletedAt       TIMESTAMP nullable  -- soft delete
  createdAt       TIMESTAMP
  updatedAt       TIMESTAMP
```

### 2.2 Room Types & Rooms

```
room_types
  id            UUID PK
  hotelId       UUID FK -> hotels.id
  name          VARCHAR(100)   -- e.g. Deluxe, Suite
  description   TEXT nullable
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
```

```
rooms
  id            UUID PK
  hotelId       UUID FK -> hotels.id
  roomTypeId    UUID FK -> room_types.id
  number        VARCHAR(20)    -- e.g. 417
  floor         INTEGER
  status        ENUM(available, occupied, maintenance)
  deletedAt     TIMESTAMP nullable
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
```

### 2.3 Users & Roles

```
users
  id            UUID PK
  email         VARCHAR(255) UNIQUE NOT NULL
  passwordHash  TEXT   -- bcrypt
  role          ENUM(super_admin, hotel_manager, front_office)
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
```

```
user_hotels   -- join table (N:N)
  userId      UUID FK -> users.id     PK composite
  hotelId     UUID FK -> hotels.id    PK composite
```

### 2.4 Guest Sessions

```
guest_sessions
  id                UUID PK
  roomId            UUID FK -> rooms.id
  guestName         VARCHAR(255)
  guestPhotoUrl     TEXT nullable
  backgroundUrl     TEXT nullable    -- room-specific override
  defaultBackground TEXT nullable    -- hotel-wide default
  checkIn           TIMESTAMP NOT NULL
  checkOut          TIMESTAMP nullable
  sessionToken      TEXT UNIQUE      -- used for TV auth
  isActive          BOOLEAN DEFAULT true
  createdAt         TIMESTAMP
  updatedAt         TIMESTAMP
```

### 2.5 Chat & Notifications

```
chat_messages
  id          UUID PK
  sessionId   UUID FK -> guest_sessions.id
  senderRole  ENUM(guest, front_office)
  content     TEXT NOT NULL
  readAt      TIMESTAMP nullable
  createdAt   TIMESTAMP
```

```
notifications
  id          UUID PK
  sessionId   UUID FK -> guest_sessions.id
  title       VARCHAR(255)
  body        TEXT
  readAt      TIMESTAMP nullable
  createdAt   TIMESTAMP
```

### 2.6 Alarms

```
alarms
  id            UUID PK
  sessionId     UUID FK -> guest_sessions.id
  scheduledAt   TIMESTAMP NOT NULL
  note          TEXT nullable
  acknowledged  BOOLEAN DEFAULT false
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
```

### 2.7 Deals & Services

```
deals
  id            UUID PK
  hotelId       UUID FK -> hotels.id
  title         VARCHAR(255)
  description   TEXT
  posterUrl     TEXT   -- Cloudflare R2 URL
  validUntil    DATE nullable
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
```

```
hotel_services
  id            UUID PK
  hotelId       UUID FK -> hotels.id
  category      ENUM(food, transport, spa, laundry, other)
  name          VARCHAR(255)
  description   TEXT nullable
  iconUrl       TEXT nullable
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
```

---

## 3. Relationship Summary

| From | Relation | To |
|------|----------|-----|
| organizations | 1 : N | hotels |
| hotels | 1 : N | room_types |
| hotels | 1 : N | rooms |
| room_types | 1 : N | rooms |
| rooms | 1 : N | guest_sessions |
| guest_sessions | 1 : N | chat_messages |
| guest_sessions | 1 : N | notifications |
| guest_sessions | 1 : N | alarms |
| hotels | 1 : N | deals |
| hotels | 1 : N | hotel_services |
| users | N : N via user_hotels | hotels |

---

## 4. Prisma Schema Snippet

```prisma
model Hotel {
  id             String        @id @default(uuid())
  organizationId String
  name           String
  address        String?
  timezone       String
  logoUrl        String?
  deletedAt      DateTime?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  organization   Organization  @relation(fields: [organizationId], references: [id])
  rooms          Room[]
  deals          Deal[]
  services       HotelService[]
  staff          UserHotel[]
}

model Room {
  id          String        @id @default(uuid())
  hotelId     String
  roomTypeId  String
  number      String
  floor       Int
  status      RoomStatus    @default(available)
  deletedAt   DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  hotel       Hotel         @relation(fields: [hotelId], references: [id])
  roomType    RoomType      @relation(fields: [roomTypeId], references: [id])
  sessions    GuestSession[]
}

enum RoomStatus {
  available
  occupied
  maintenance
}
```
