# Criico Cricket

A cricket team management application built with Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma 6, and PostgreSQL.

The project currently provides the full application foundation: Next.js App Router, Tailwind styling, route protection middleware, a Prisma schema with an applied initial migration, and a reusable Prisma client. Authentication and cricket management features are not implemented yet.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15.5 (App Router) |
| UI | React 19, React DOM 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| ORM | Prisma 6.19 |
| Database | PostgreSQL (Neon-compatible) |
| Linting | ESLint 9 with `eslint-config-next` |

## Prerequisites

- Node.js 18.18 or newer (tested on Node 22)
- npm
- A PostgreSQL database, either local or hosted (the current setup uses Neon)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill in `.env` with your own database connection details. Never commit `.env` or real credentials.

4. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Apply the existing migration:

   ```bash
   npm run prisma:deploy
   ```

   For local development where you want to create new migrations:

   ```bash
   npm run prisma:migrate
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Pooled PostgreSQL connection used by Prisma Client at runtime |
| `DIRECT_URL` | Yes | Direct, non-pooled connection used by Prisma Migrate |
| `NODE_ENV` | No | Controls Prisma client logging (`development` enables query logs) |

For Neon, `DATABASE_URL` uses the `-pooler` host and `DIRECT_URL` uses the direct host. For a local PostgreSQL instance, both values can be identical. See `.env.example` for the placeholder format.

## Available scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `next dev` | Start the development server |
| `npm run build` | `next build` | Create a production build |
| `npm run start` | `next start` | Run the production build |
| `npm run lint` | `eslint .` | Lint the project |
| `npm run typecheck` | `tsc --noEmit` | Type-check without emitting files |
| `npm run prisma:generate` | `prisma generate` | Generate the Prisma client |
| `npm run prisma:migrate` | `prisma migrate dev` | Create/apply migrations in development |
| `npm run prisma:deploy` | `prisma migrate deploy` | Apply existing migrations |
| `npm run prisma:studio` | `prisma studio` | Open Prisma Studio |

## Project structure

```text
.
├── prisma/
│   ├── migrations/
│   │   ├── 20261031000000_init/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── prisma.ts
│   └── middleware.ts
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

`middleware.ts` lives in `src/` because Next.js ignores a root-level middleware when the `src/` directory is used.

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home page |
| `/login` | Public | Login UI placeholder |
| `/dashboard` | Protected | Placeholder page behind middleware |

The middleware protects `/dashboard/:path*`. If the `session` cookie is missing, the request is redirected to `/login?next=<original-path>`. This is a placeholder gate only; no authentication is implemented yet.

## Database schema

The Prisma schema is defined in `prisma/schema.prisma`.

- `User` stores authentication identity: unique email, password hash, timestamps.
- `Team` has a unique name and owns players and matches.
- `Player` belongs to exactly one `Team` through `teamId`. Deleting a team with players is restricted.
- `Match` references two participating teams (`teamAId`, `teamBId`) and an optional winner. A team with match history cannot be deleted, and deleting a winning team sets `winnerId` to `NULL`.
- `PlayerPerformance` links a `Player` to a `Match` with runs and wickets. Performances cascade-delete with their match, but player deletion is restricted to preserve history.
- A unique constraint on `(matchId, playerId)` prevents duplicate performances for the same player in the same match.
- `PlayerRole` is an enum: `BATTER`, `BOWLER`, `ALL_ROUNDER`, `WICKET_KEEPER`.
- Indexes cover player team/role lookups, match participants, winners, match dates, and player performance history.
- SQL CHECK constraints enforce non-negative prices and statistics, distinct match teams, and that the winner is one of the two participants.

## Current scope

Implemented:

- Next.js App Router with TypeScript and Tailwind CSS
- Basic home, login, and protected dashboard pages
- Route protection middleware
- Prisma schema, initial migration, and reusable client

Not yet implemented:

- Authentication and session management
- Team, player, match, and performance CRUD features
- API routes or server actions for cricket data
