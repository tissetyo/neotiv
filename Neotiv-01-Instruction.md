# NEOTIV — Developer Instruction
> Project Setup, Onboarding & Development Guide | v1.0 | March 2026

---

## 1. Overview

Neotiv is a hospitality platform that delivers a custom TV dashboard experience for hotel rooms. The system supports hotel management, multi-property operations, and real-time guest communication. This document guides developers through the full setup and development process.

---

## 2. Prerequisites

### 2.1 Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 18.x LTS | Backend runtime & package management |
| pnpm | >= 8.x | Fast, disk-efficient package manager |
| Docker & Docker Compose | >= 24.x | Containerized services (DB, Redis, etc.) |
| Git | >= 2.40 | Version control |
| VS Code | Latest | Recommended IDE |
| Postman / Insomnia | Latest | API testing & exploration |

### 2.2 Recommended VS Code Extensions

- **ESLint** — real-time linting
- **Prettier** — code formatting
- **Prisma** — ORM schema support
- **Thunder Client** — lightweight API testing
- **GitLens** — enhanced git history
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes

---

## 3. Repository Structure

```
neotiv/
  apps/
    tv-dashboard/       # Guest TV dashboard (Next.js PWA)
    frontoffice/        # Hotel staff panel (Next.js)
    management/         # Multi-hotel admin panel (Next.js)
  packages/
    ui/                 # Shared component library
    types/              # Shared TypeScript types
    config/             # Shared ESLint, TS, Tailwind configs
  backend/
    src/                # NestJS API source
    prisma/             # Schema & migrations
  docker/               # Docker Compose files
  docs/                 # Project documentation
```

---

## 4. Environment Setup

### 4.1 Clone & Install

```bash
git clone https://github.com/your-org/neotiv.git
cd neotiv
pnpm install
```

### 4.2 Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `NEXT_PUBLIC_API_URL` | Backend API base URL for frontend apps |
| `OPENWEATHER_API_KEY` | Weather widget API (free tier) |

### 4.3 Start Services with Docker

```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

This starts PostgreSQL and Redis locally at default ports.

### 4.4 Database Migration

```bash
cd backend
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

### 4.5 Run Development Servers

```bash
pnpm dev    # Runs all apps concurrently via Turborepo
```

---

## 5. Development Workflow

### 5.1 Branching Strategy

- `main` — production-ready code, protected branch
- `develop` — active integration branch
- `feature/[ticket-id]-[short-desc]` — individual features
- `fix/[ticket-id]-[short-desc]` — bug fixes
- `hotfix/[short-desc]` — urgent production fixes

### 5.2 Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat(tv-dashboard): add alarm widget
fix(frontoffice): correct room status toggle
docs: update ERD diagram
```

### 5.3 Pull Request Checklist

1. Branch created from `develop`
2. No TypeScript errors (`pnpm typecheck`)
3. All tests pass (`pnpm test`)
4. Lint passes (`pnpm lint`)
5. PR description explains the change
6. Relevant docs updated if needed

---

## 6. Testing

### 6.1 Unit Tests

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
```

### 6.2 E2E Tests

```bash
pnpm test:e2e       # Playwright E2E tests
```

### 6.3 API Testing

Import the Postman collection from `docs/neotiv-api.postman_collection.json` to test all endpoints. A Swagger UI is also available at `http://localhost:3001/api` when running locally.

---

## 7. Deployment (Zero Cost)

| Service | Tier | Usage |
|---------|------|-------|
| Vercel | Free | Host Next.js apps (TV, FO, Management) |
| Railway | Free $5 credit/mo | NestJS backend + PostgreSQL |
| Supabase | Free tier | PostgreSQL (alternative to Railway DB) |
| Upstash | Free tier | Redis (serverless, per-request pricing) |
| Cloudflare R2 | Free 10GB/mo | File storage (guest photos, promo posters) |

### 7.1 CI/CD

GitHub Actions pipelines are configured in `.github/workflows/`. On push to `develop`, lint and tests run automatically. On merge to `main`, deployment to Vercel and Railway is triggered.
