# Codex Business Dashboard

Mobile-first starter app for managing a small business, built around:

- Dashboard overview
- Customer management
- Order management with status filters
- Private internal notes
- Product catalog
- Inventory with low-stock alerts
- Admin-controlled user approval flow

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Run locally

```bash
npm install
npm run prisma:generate
npm run dev
```

## Database setup

1. Copy `.env.example` to `.env` and point `DATABASE_URL` at your PostgreSQL database.
2. Generate the client:

```bash
npm run prisma:generate
```

3. Create your schema in the database:

```bash
npm run prisma:migrate -- --name init
```

## Current state

The dashboard now supports API-backed CRUD for customers, jobs, and notes through Next route handlers plus Prisma. If the database is not available yet, the app falls back to mock mode so the UI still works while setup continues.
