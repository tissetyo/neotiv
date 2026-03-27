# NEOTIV — Rules & Conventions
> Coding Standards, Security Rules & Project Governance | v1.0 | March 2026

---

## 1. Code Quality Rules

### 1.1 TypeScript

- Strict mode enabled in all `tsconfig.json` files — no exceptions
- Never use `any` type — use `unknown` and narrow, or define proper interfaces
- All functions must have explicit return type annotations
- Use `zod` for all runtime validation at API boundaries
- Prefer `type` over `interface` unless extension is needed

### 1.2 Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| Files | kebab-case | `room-service.ts` |
| React Components | PascalCase | `AlarmWidget.tsx` |
| Variables/Functions | camelCase | `getRoomById` |
| Constants | UPPER_SNAKE_CASE | `MAX_HOTELS` |
| Database Tables | snake_case | `hotel_rooms` |
| API Routes | kebab-case | `/api/hotel-rooms` |
| Env Variables | UPPER_SNAKE_CASE | `DATABASE_URL` |

### 1.3 File Organization

- One component per file; co-locate tests alongside source files
- Barrel exports (`index.ts`) in each feature folder
- Max **300 lines** per file — split into smaller modules if exceeded
- No circular dependencies between modules

---

## 2. Git Rules

### 2.1 Commit Rules

- All commits must follow Conventional Commits specification
- Never commit directly to `main` or `develop` — always use PRs
- No `.env` files or secrets in commits — use `.gitignore` strictly
- Commit messages in English only
- Each commit should represent one logical change

### 2.2 PR Rules

- Minimum **1 reviewer** approval required before merge
- All CI checks must pass before merging
- PRs must reference a task/ticket ID in description
- PR title must follow Conventional Commits format
- Delete feature branch after merge

---

## 3. API Design Rules

### 3.1 REST Standards

- Use proper HTTP verbs: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove)
- Resource names always plural: `/rooms`, `/hotels`, `/notifications`
- Response format must be consistent JSON: `{ data, meta?, error? }`
- All errors return structured error objects with `code` and `message` fields
- Paginated endpoints use `limit`, `offset`, and `total` in response

### 3.2 Authentication

- All protected routes require `Bearer` JWT token in `Authorization` header
- Tokens expire in **24h** for staff, **7 days** for management-level accounts
- TV dashboard uses a room-scoped session token (no expiry while active)
- Never store JWT in `localStorage` — use `httpOnly` cookies

---

## 4. Security Rules

- Validate and sanitize all user inputs server-side with `zod`
- Parameterized queries only — never raw SQL string concatenation
- Rate limit all public endpoints (100 req/min per IP)
- CORS configured to whitelist only known frontend domains
- Sensitive data (passwords) must be hashed with bcrypt (rounds >= 12)
- File uploads: validate MIME type, max 5MB, store in cloud (not local disk)
- No PII logged in server logs — mask or omit guest names, photo URLs

---

## 5. Database Rules

- All schema changes via Prisma migrations — never manual DB edits in production
- Every table must have `id` (UUID), `createdAt`, and `updatedAt` fields
- Use soft deletes (`deletedAt`) for hotels, rooms, and guest records
- Index foreign keys and frequently queried fields
- No business logic in database triggers — keep it in the application layer

---

## 6. Frontend Rules

### 6.1 Component Rules

- Components must be functional — no class components
- Use React Server Components (RSC) where possible in Next.js
- Client components (`'use client'`) only when interactivity or hooks are needed
- Extract reusable logic into custom hooks (`useXxx` naming)
- No inline styles — use Tailwind utility classes only

### 6.2 State Management Rules

- **Server state**: TanStack Query (React Query) for all API data fetching
- **Local UI state**: `useState` / `useReducer` inside the component
- **Global client state**: Zustand store — keep slices small and focused
- Never mutate state directly — always use setter functions

### 6.3 Performance Rules

- All images must use Next.js `<Image>` with proper `width`/`height` attributes
- Lazy load widgets that are not visible on first paint
- Memoize expensive computations with `useMemo` — but only when profiling shows it's needed
- TV dashboard must load and render in under **3 seconds** on a 10Mbps connection

---

## 7. PWA / Offline Rules

- Service worker must cache static assets and last-known dashboard state
- All UI must degrade gracefully when offline (show cached data, not error screens)
- Offline mutations queue in IndexedDB and sync when connection restores
- Do not cache authentication tokens in service worker
