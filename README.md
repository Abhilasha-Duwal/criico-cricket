# Criico Cricket

A cricket team management application built with Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma 6, and PostgreSQL.

The project currently provides the application foundation, complete cookie-based JWT authentication, team/player management, transactional match recording, and a player Impact Score leaderboard: Next.js App Router, Tailwind styling, verified route protection middleware, registration and login flows, player CRUD APIs, a Server Action for creating players, an idempotent match API that updates aggregate player statistics, a shared Impact Score utility with Vitest coverage, a Prisma schema with an applied initial migration, and a reusable Prisma client.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15.5 (App Router) |
| UI | React 19, React DOM 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| ORM | Prisma 6.19 |
| Database | PostgreSQL (Neon-compatible) |
| Authentication | bcryptjs, jose, Zod |
| Testing | Vitest 5 |
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
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT session tokens. Must be at least 32 characters |
| `NODE_ENV` | No | Controls Prisma client logging (`development` enables query logs) |

For Neon, `DATABASE_URL` uses the `-pooler` host and `DIRECT_URL` uses the direct host. For a local PostgreSQL instance, both values can be identical. See `.env.example` for the placeholder format.

Generate a strong local JWT secret with:

```bash
openssl rand -hex 32
```

Never commit the real value or expose it to client components.

## Available scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `next dev` | Start the development server |
| `npm run build` | `next build` | Create a production build |
| `npm run start` | `next start` | Run the production build |
| `npm run lint` | `eslint .` | Lint the project |
| `npm run typecheck` | `tsc --noEmit` | Type-check without emitting files |
| `npm test` | `vitest run` | Run the unit tests once |
| `npm run test:watch` | `vitest` | Run tests in watch mode |
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
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── leaderboard/route.ts
│   │   │   ├── matches/route.ts
│   │   │   ├── players/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   └── teams/
│   │   │       ├── [id]/route.ts
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   ├── _actions/
│   │   │   │   ├── players.ts
│   │   │   │   └── teams.ts
│   │   │   ├── leaderboard/
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── matches/page.tsx
│   │   │   ├── players/[id]/
│   │   │   │   ├── edit/page.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   ├── LoginForm.tsx
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   ├── RegisterForm.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── icon.svg
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AddPlayerForm.tsx
│   │   ├── AddTeamForm.tsx
│   │   ├── DeleteTeamButton.tsx
│   │   ├── EditPlayerForm.tsx
│   │   ├── FieldError.tsx
│   │   ├── LeaderboardTable.tsx
│   │   ├── MatchHistory.tsx
│   │   ├── MatchRecorder.tsx
│   │   ├── PlayerFilters.tsx
│   │   ├── PlayerFormFields.tsx
│   │   ├── PlayerTable.tsx
│   │   └── TeamManager.tsx
│   ├── lib/
│   │   ├── validations/
│   │   │   ├── auth.ts
│   │   │   ├── match.test.ts
│   │   │   ├── match.ts
│   │   │   ├── player.ts
│   │   │   ├── shared.ts
│   │   │   └── team.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── format.ts
│   │   ├── form-state.ts
│   │   ├── impact-score.test.ts
│   │   ├── impact-score.ts
│   │   ├── jwt.ts
│   │   ├── leaderboard-data.ts
│   │   ├── leaderboard.test.ts
│   │   ├── leaderboard.ts
│   │   ├── match-idempotency.test.ts
│   │   ├── match-idempotency.ts
│   │   ├── matches.ts
│   │   ├── player-constants.ts
│   │   ├── players.ts
│   │   ├── prisma.ts
│   │   ├── redirect.ts
│   │   └── teams.ts
│   ├── types/css.d.ts
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
| `/login` | Public | Login form; authenticated users are redirected to the dashboard |
| `/register` | Public | Registration form; authenticated users are redirected to the dashboard |
| `/dashboard` | Protected | Player listing, filters, add-player form, and team manager |
| `/dashboard/leaderboard` | Protected | Player Impact Score rankings |
| `/dashboard/matches` | Protected | Match recording form and recorded match history |
| `/dashboard/players/[id]` | Protected | Player details, including Impact Score |
| `/dashboard/players/[id]/edit` | Protected | Edit player form |

| API route | Description |
| --- | --- |
| `POST /api/auth/register` | Validates input, checks duplicate email, hashes the password, creates the user, and sets a session cookie |
| `POST /api/auth/login` | Validates credentials, compares the bcrypt hash, and sets a session cookie |
| `POST /api/auth/logout` | Clears the session cookie |
| `GET /api/leaderboard` | Returns ranked players with team, role, matches, runs, wickets, and Impact Score; `401` when unauthenticated, `500` on database failure |
| `GET /api/matches` | Lists recorded matches with teams, winner, and player performances |
| `POST /api/matches` | Records a match and its player performances in one transaction; supports idempotent retries |
| `GET /api/players` | Lists players; supports optional `teamId` and `role` query filters |
| `POST /api/players` | Creates a player after Zod validation and team-reference validation |
| `GET /api/players/[id]` | Returns one player |
| `PUT /api/players/[id]` | Updates one player |
| `GET /api/teams` | Lists teams with player counts |
| `POST /api/teams` | Creates a team; duplicate names are rejected case-insensitively |
| `DELETE /api/teams/[id]` | Deletes an empty team; returns `409` when players or matches reference it |

The middleware protects `/dashboard/:path*`, verifies the JWT signature and expiration with `jose`, redirects unauthenticated users to `/login?next=<original-path>`, and redirects authenticated users away from `/login` and `/register`. The `next` destination is validated to prevent open redirects.

## Authentication flow

1. **Registration** — Zod validates name, email, and password. The email is normalized to lowercase, checked for duplicates, and the password is hashed with bcrypt (cost 12) before the user is created in Prisma. A signed JWT is then stored in an HTTP-only cookie.
2. **Login** — Zod validates the credentials. The password is compared with `bcrypt.compare`, and a new JWT is issued only on success. Failed logins return a generic error so account existence is not revealed.
3. **Session verification** — The JWT contains the user ID, name, and email, and is signed with `JWT_SECRET` using HS256. Middleware verifies it on every protected request. Server components call `getCurrentUser()` or `requireUser()`, which verify the token again and load the user by the ID inside the token — never by a client-supplied ID.
4. **Logout** — `POST /api/auth/logout` expires the session cookie and the dashboard redirects to `/login`.

The cookie is `httpOnly`, `sameSite=lax`, `secure` in production, and expires after 7 days. Passwords and password hashes are never returned by the API.

## Team and player management

- The dashboard requires a valid session. All player and team APIs also verify the session on the server and return `401` with a structured error when it is missing or invalid.
- The player listing is responsive, with a table on larger screens and cards on mobile. Filters for team and role are applied server-side through the URL query string.
- The **Add player** form is implemented as a Next.js Server Action (`src/app/dashboard/_actions/players.ts`). It validates the submitted `FormData` with Zod, verifies the selected team exists, creates the player with Prisma, and revalidates the dashboard.
- The **Edit player** form uses `PUT /api/players/[id]`. It shows field-level validation errors, a loading state, and redirects back to the player details page on success.
- Team creation uses a Server Action. Team deletion uses `DELETE /api/teams/[id]` and refuses to delete a team with existing players or match history.
- Zod validates all player fields. `basePrice`, `matchesPlayed`, `totalRuns`, and `totalWickets` must be non-negative; integer fields must be whole numbers. The existing database CHECK constraints provide a second layer of protection.
- IDs submitted by the client are never trusted for authorization. The session identifies the user, player IDs are checked against the database, and team IDs are validated before create or update.

## Impact Score

Impact Score is calculated by the shared `calculateImpactScore()` function in `src/lib/impact-score.ts`. The leaderboard page, `GET /api/leaderboard`, player API responses, and player details all use this same function.

The leaderboard page is an async React Server Component. It calls `getLeaderboard()` in `src/lib/leaderboard-data.ts`, which performs one Prisma query through `listPlayers()` and then calls the shared `buildLeaderboard()` scoring and sorting utility. `GET /api/leaderboard` uses the same `getLeaderboard()` path and then serializes the result with `serializeLeaderboard()`, returning only the required player fields and no sensitive user data. The page is wrapped by route-level `loading.tsx` and `error.tsx` boundaries.

The formula is:

```text
Base score = (runs * 1.2) + (wickets * 20)

Batter:       multiply runs by 1.3 before calculating the run contribution
Bowler:       multiply wickets by 1.5 before calculating the wicket contribution
All-rounder:  use the normal base formula
Wicketkeeper: use the normal base formula, then add a flat 30 points

Matches < 5:  subtract 50
Matches > 20: add 100
Otherwise:    no experience adjustment
```

Role adjustments are applied first, followed by the experience adjustment, then the wicketkeeper bonus. The wicketkeeper bonus never applies the bowler multiplier. Invalid input, including negative values, non-finite numbers, or an unknown role, returns `0`.

Worked example: a batter with 100 runs, 2 wickets, and 10 matches scores `(100 * 1.3 * 1.2) + (2 * 20) = 196`. The same statistics as a bowler score `(100 * 1.2) + (2 * 1.5 * 20) = 180`.

## Match recording and aggregate statistics

- The protected match page is available at `/dashboard/matches`. It loads teams, players, and recent matches on the server; the client form submits to `POST /api/matches`.
- `matchInputSchema` validates two distinct team IDs, an optional winner that must be one of the participants, and a performance array. Runs and wickets must be non-negative integers. Duplicate player IDs are rejected before the database write.
- The server re-validates every referenced team and player inside the transaction. Each performance player must belong to team A or team B.
- `createMatch()` uses one interactive `prisma.$transaction` to create the `Match`, create its `PlayerPerformance` rows, and increment each affected player's `matchesPlayed`, `totalRuns`, and `totalWickets`. If any step fails, the match, performances, and aggregate changes roll back together.
- Aggregate values are never accepted from the client. They are updated with atomic Prisma `increment` operations based only on the recorded performance.
- Idempotency prevents double-counting. The UI sends a UUID `clientRequestId`, which is used as the match ID. Retrying the same request returns the existing match with `replayed: true` and does not increment statistics again. If no request ID is supplied, a deterministic SHA-256 fingerprint of the normalized payload is used as the match ID, so an identical retry is also deduplicated. Reusing a request ID with different match details returns `409`. Clients that need to record an identical rematch should send a new UUID.
- The unique `(matchId, playerId)` constraint and the Zod duplicate check prevent duplicate performances. Database check constraints also reject negative performance statistics.
- The page displays recorded matches with team totals and each player's runs and wickets. `GET /api/matches` returns the same data for API consumers.

Example request:

```json
{
  "clientRequestId": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "teamAId": "team_a_id",
  "teamBId": "team_b_id",
  "winnerId": "team_a_id",
  "performances": [
    { "playerId": "player_1_id", "runs": 42, "wickets": 1 },
    { "playerId": "player_2_id", "runs": 10, "wickets": 3 }
  ]
}
```

Use `"winnerId": null` for no winner. Omit `clientRequestId` only when the deterministic payload fingerprint is sufficient for retry protection.

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
- Registration, login, and logout with bcrypt and JWT
- HTTP-only session cookies with signature and expiration verification
- Protected dashboard and auth-route redirects in middleware
- Server-side session validation with `getCurrentUser()` / `requireUser()`
- Team creation/listing with duplicate-name protection and safe deletion
- Player create, list, detail, edit, team selection, and team/role filters
- Add-player Server Action and authenticated player/team APIs
- Shared Impact Score calculation with role, experience, and wicketkeeper adjustments
- Protected leaderboard page and authenticated leaderboard API
- Match recording with two-team selection, optional winner, and player performances
- Transactional match, performance, and aggregate-stat updates with idempotent retries
- Recorded match history and authenticated matches API
- Vitest unit tests for Impact Score, leaderboard ranking/serialization, match validation, and idempotency
- Responsive dashboard with loading, empty, and error states
- Zod validation and field-level error responses
- Prisma schema, initial migration, and reusable client

Not yet implemented:

- Editing or deleting recorded matches
- Playing XI and lineup management
- Role-based authorization and per-user data ownership
- Rate limiting and brute-force protection
- Expanded integration test suite and seed data
