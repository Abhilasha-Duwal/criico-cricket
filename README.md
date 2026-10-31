# Criico Cricket

## Project overview

Criico Cricket is a cricket team management application built with Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma 6, and PostgreSQL.

The application provides complete cookie-based JWT authentication, team and player management, transactional match recording, and a player Impact Score leaderboard. It uses the Next.js App Router, verified route-protection middleware, player CRUD APIs, Server Actions, an idempotent match API that updates aggregate player statistics, a shared Impact Score utility with Vitest coverage, a Prisma schema with a committed initial migration, and a reusable Prisma client.

This README also documents production deployment to Vercel and safe Prisma migration handling for the existing Neon PostgreSQL database.

## Technology stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15.5 (App Router) |
| UI | React 19, React DOM 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| ORM | Prisma 6.19 |
| Database | PostgreSQL (Neon-compatible) |
| Authentication | bcryptjs, jose, Zod |
| Notifications | Sonner 2 |
| Testing | Vitest 5 |
| Linting | ESLint 9 with `eslint-config-next` |

## Prerequisites

- Node.js 18.18 or newer (tested on Node 22)
- npm
- A PostgreSQL database, either local or hosted (the current setup uses Neon)

## Local setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/Abhilasha-Duwal/criico-cricket.git
   cd criico-cricket
   npm install
   ```

   `npm install` runs `postinstall` (`prisma generate`) automatically.

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill in `.env` with your own database connection details and a JWT secret. Never commit `.env` or real credentials.

4. Generate the Prisma client explicitly if needed:

   ```bash
   npm run prisma:generate
   ```

5. Apply the committed migrations:

   ```bash
   npm run prisma:deploy
   ```

   For local development where you want to create new migrations:

   ```bash
   npm run prisma:migrate
   ```

   Do not use `prisma migrate dev`, `prisma migrate reset`, or `prisma db push` against the production database.

6. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

7. Run the verification suite before shipping changes:

   ```bash
   npm test -- --run
   npm run typecheck
   npm run lint
   npm run build
   ```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Pooled PostgreSQL connection used by Prisma Client at runtime |
| `DIRECT_URL` | Yes | Direct, non-pooled connection used by Prisma Migrate |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT session tokens. Must be at least 32 characters |
| `NODE_ENV` | No | Local logging only. Vercel sets this to `production` automatically; do not override it there |

For Neon, `DATABASE_URL` uses the `-pooler` host and `DIRECT_URL` uses the direct host. For a local PostgreSQL instance, both values can be identical. See `.env.example` for the placeholder format.

Generate a strong JWT secret with:

```bash
openssl rand -hex 32
```

Never commit the real value, paste it into source files, or expose it to client components. Do not prefix any secret with `NEXT_PUBLIC_`; that would make it readable in the browser. The repository `.gitignore` excludes `.env` and all `.env.*` files except `.env.example`.

## Available scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `next dev` | Start the development server |
| `npm run build` | `next build` | Create a production build |
| `npm run start` | `next start` | Run the production build |
| `npm run postinstall` | `prisma generate` | Runs automatically after `npm install`; generates Prisma Client |
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
│   │   │   ├── auth.test.ts
│   │   │   ├── auth.ts
│   │   │   ├── match.test.ts
│   │   │   ├── match.ts
│   │   │   ├── player.test.ts
│   │   │   ├── player.ts
│   │   │   ├── shared.ts
│   │   │   └── team.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── format.ts
│   │   ├── form-state.ts
│   │   ├── impact-score.test.ts
│   │   ├── impact-score.ts
│   │   ├── jwt.test.ts
│   │   ├── jwt.ts
│   │   ├── leaderboard-data.ts
│   │   ├── leaderboard.test.ts
│   │   ├── leaderboard.ts
│   │   ├── match-idempotency.test.ts
│   │   ├── match-idempotency.ts
│   │   ├── matches.ts
│   │   ├── player-constants.ts
│   │   ├── player-form-validation.test.ts
│   │   ├── player-form-validation.ts
│   │   ├── players.ts
│   │   ├── prisma.ts
│   │   ├── redirect.test.ts
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

## Routes and pages

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

## API documentation

All API responses are JSON. Except for the authentication endpoints, every API route requires the HTTP-only `session` cookie. A missing, invalid, or expired session returns `401`. Validation failures return `400` with a `fieldErrors` object.

```json
{
  "error": "Please fix the highlighted fields.",
  "fieldErrors": {
    "email": ["Enter a valid email address."]
  }
}
```

### Authentication

| Endpoint | Request body | Success | Common errors |
| --- | --- | --- | --- |
| `POST /api/auth/register` | `{ "name", "email", "password" }` | `201` with the user and session cookie | `400` validation, `409` duplicate email, `500` server/database failure |
| `POST /api/auth/login` | `{ "email", "password" }` | `200` with the user and session cookie | `400` validation, `401` invalid credentials, `500` server/database failure |
| `POST /api/auth/logout` | none | `200` and an expired session cookie | none |

Passwords must be 8–72 characters. Emails are trimmed and normalized to lowercase. Password hashes are never returned.

### Players

| Endpoint | Description |
| --- | --- |
| `GET /api/players?teamId=<id>&role=<role>` | Returns `{ "players": [...] }`. Both filters are optional. Invalid filters return `400`. |
| `POST /api/players` | Creates a player. Returns `201` with `{ "player": ... }`. |
| `GET /api/players/<id>` | Returns `{ "player": ... }` or `404`. |
| `PUT /api/players/<id>` | Replaces the player fields. Returns `200` with `{ "player": ... }`, `404` if missing, or `400` for invalid input/team. |

Player request body:

```json
{
  "name": "Player Name",
  "role": "BATTER",
  "basePrice": 100.0,
  "matchesPlayed": 10,
  "totalRuns": 250,
  "totalWickets": 3,
  "teamId": "team_id"
}
```

`role` must be one of `BATTER`, `BOWLER`, `ALL_ROUNDER`, or `WICKET_KEEPER`. `basePrice`, `matchesPlayed`, `totalRuns`, and `totalWickets` must be non-negative; integer fields must be whole numbers. Negative `totalRuns` returns the message `Total runs cannot be negative.`

### Teams

| Endpoint | Description |
| --- | --- |
| `GET /api/teams` | Returns `{ "teams": [...] }` with player counts. |
| `POST /api/teams` | Creates a team from `{ "name": "Team Name" }`. Duplicate names return `409`. |
| `DELETE /api/teams/<id>` | Deletes an empty team. Returns `404` if missing, or `409` if players or matches reference it. |

### Matches

| Endpoint | Description |
| --- | --- |
| `GET /api/matches` | Returns up to 100 recent matches with teams, winner, and player performances. |
| `POST /api/matches` | Records a match and its performances in one transaction. Returns `201` for a new match and `200` with `"replayed": true` for an identical retry. |

A `409` means the request ID was reused with different match data or a referenced team/player changed during the write. See the match example below.

### Leaderboard

`GET /api/leaderboard` returns:

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "impactScore": 196,
      "player": {
        "id": "player_id",
        "name": "Player Name",
        "team": { "id": "team_id", "name": "Team Name" },
        "role": "BATTER",
        "matchesPlayed": 10,
        "totalRuns": 100,
        "totalWickets": 2
      }
    }
  ]
}
```

The leaderboard is ranked by Impact Score descending, then player name. It returns `200` with an empty array when no players exist, `401` when unauthenticated, and `500` on database failure.

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
- Both player forms run the same Zod schema on the client before submission and again on the server. Negative `totalRuns` shows the toast `Total runs cannot be negative.`, prevents submission, and displays the same message beside the Total runs input. Negative `matchesPlayed`, `totalWickets`, and `basePrice` receive field-level errors.
- Sonner provides success and error toasts. Successful create/edit operations show a success toast; server validation, authorization, and network failures show an error toast.
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

## Database setup

Criico Cricket uses PostgreSQL and Prisma Migrate. The production database is Neon.

### Neon configuration

1. Create or select a Neon project and database.
2. Copy the **pooled** connection string into `DATABASE_URL`. This is used by Prisma Client at runtime.
3. Copy the **direct** (non-pooled) connection string into `DIRECT_URL`. This is used only by Prisma Migrate.
4. Add both values to your local `.env` and to Vercel environment variables. Never commit them.
5. Apply the committed migrations with `npm run prisma:deploy`.
6. Verify the database state with `npx prisma migrate status`.

The committed migration is `prisma/migrations/20261031000000_init/migration.sql`. Do not delete migration files or edit an already-applied migration.

### Migration workflow

- **Development:** create a migration with `npx prisma migrate dev --name <name>`, review the generated SQL, and commit the new migration directory.
- **Production:** apply only committed migrations with `npx prisma migrate deploy`. Never run `prisma migrate dev`, `prisma migrate reset`, or `prisma db push` against production.
- **Before deploying:** take a Neon branch or snapshot, confirm `npx prisma migrate status` against production, then apply migrations from a trusted machine or CI job. Do not run migrations from the Vercel build step.
- **After deploying:** run `npx prisma migrate status` again and smoke-test the application.

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

## Testing

Run the full local verification suite before deploying:

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
npx prisma validate
```

The Vitest suite covers authentication validation, JWT session tokens, safe redirects, Impact Score, leaderboard ranking/serialization, player form and server validation, match validation, and match idempotency.

### Dependency audit

`npm audit` currently reports high-severity issues in Prisma 6's CLI dependency chain (`deepmerge-ts` through `@prisma/config`). Those packages are used by Prisma CLI generation/migration commands, not by the Next.js request path. The available automated fix requires a breaking Prisma major upgrade, so it is not applied automatically. The Next.js bundled PostCSS advisory is mitigated by the `postcss` override in `package.json`; rerun `npm audit` and re-evaluate dependency upgrades before each major release.

## Deployment to Vercel

### 1. Push the repository

Commit the deployment changes and push to `https://github.com/Abhilasha-Duwal/criico-cricket` **only after you approve the push**. Vercel deploys from the GitHub repository.

### 2. Import the project into Vercel

1. Open the Vercel dashboard and choose **Add New → Project**.
2. Import the `Abhilasha-Duwal/criico-cricket` repository.
3. Keep the framework preset as **Next.js**.
4. Use the repository root as the root directory.
5. Keep the install command as `npm install`.
6. Keep the build command as `npm run build`.
7. Deploy only after the environment variables and database migrations are ready.

`postinstall` runs `prisma generate` automatically, so the Prisma Client is generated during the Vercel install step.

### 3. Configure Vercel environment variables

In Vercel, open **Project → Settings → Environment Variables** and add:

| Variable | Environment | Value source |
| --- | --- | --- |
| `DATABASE_URL` | Production | Neon **pooled** connection string used by Prisma Client |
| `DIRECT_URL` | Production | Neon **direct** connection string used by Prisma Migrate |
| `JWT_SECRET` | Production | A random secret of at least 32 characters |

Add the same variables to **Preview** only if you intend preview deployments to use a database. Prefer a separate Neon branch/database for previews so preview traffic cannot modify production data.

Do not set `NODE_ENV` in Vercel; Vercel sets it to `production`. Never create `NEXT_PUBLIC_DATABASE_URL`, `NEXT_PUBLIC_DIRECT_URL`, or `NEXT_PUBLIC_JWT_SECRET` — those values would be exposed to the browser.

You can also add variables with the Vercel CLI. The CLI prompts for the value; do not paste secrets into committed files or shell history:

```bash
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add JWT_SECRET production
```

After adding or changing environment variables, redeploy the project so the new values are used.

### 4. Apply database migrations safely

Run migrations from a trusted machine or a dedicated CI job, not from the Vercel build step. Vercel builds can run more than once and preview deployments must not apply production migrations.

1. Confirm the committed migration files are present and match the schema.
2. Take a Neon branch or snapshot/backup before changing production.
3. Set `DATABASE_URL` and `DIRECT_URL` for the production Neon database in the current shell or CI secret store. Do not write them into the repository.
4. Check the current state:
   ```bash
   npx prisma migrate status
   ```
5. Apply only committed migrations:
   ```bash
   npx prisma migrate deploy
   ```
6. Verify again:
   ```bash
   npx prisma migrate status
   ```
7. Deploy the application and run the smoke tests below.

`prisma migrate deploy` is the safe production command. Never run `prisma migrate reset`, `prisma migrate dev`, or `prisma db push` against production. If a migration fails, stop, inspect the error, and restore from the Neon backup/branch if necessary; do not reset the database.

### 5. Deploy and verify

Deploy from the Vercel dashboard or with:

```bash
vercel --prod
```

A deployment is successful only when Vercel reports **Ready** and the smoke tests pass. Do not describe the application as deployed before that point.

Smoke tests:

- Register a new account and confirm the session cookie is set over HTTPS.
- Sign out and sign back in.
- Create a team and a player; confirm validation errors behave correctly.
- Record a match and verify player aggregates and the leaderboard update.
- Call a protected API without a session and confirm it returns `401`.
- Confirm Vercel function logs show no database connection or JWT errors.

### 6. Rollback

Use Vercel's deployment rollback to return to a previous application build. Database migrations require a forward fix or a restore from the Neon backup; do not reset production to roll back.

## Production deployment checklist

- [ ] Working tree is clean and the deployment commit is approved.
- [ ] `npm ci` succeeds.
- [ ] `npm run prisma:generate` succeeds.
- [ ] `npx prisma validate` succeeds.
- [ ] `npm test -- --run` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` succeeds.
- [ ] `prisma/migrations/20261031000000_init/migration.sql` is committed.
- [ ] `npx prisma migrate status` reports the production schema is up to date after migration.
- [ ] `DATABASE_URL` is the Neon pooled URL in Vercel Production.
- [ ] `DIRECT_URL` is the Neon direct URL for migrations.
- [ ] `JWT_SECRET` is present, at least 32 characters, and not exposed with a `NEXT_PUBLIC_` prefix.
- [ ] `.env` is ignored and not tracked by Git.
- [ ] No real database URL, JWT secret, or password appears in tracked files or commit history.
- [ ] `NODE_ENV` is not manually overridden in Vercel.
- [ ] Neon backup/branch exists before applying migrations.
- [ ] Production migrations were applied with `prisma migrate deploy`, not `migrate dev` or `reset`.
- [ ] Vercel deployment status is **Ready**.
- [ ] HTTPS session cookie works in production.
- [ ] Authentication, team/player management, match recording, and leaderboard smoke tests pass.
- [ ] The application is only announced as deployed after the checks above pass.

## Features

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
- Vitest unit tests for authentication validation, JWT session tokens, safe redirects, Impact Score, leaderboard ranking/serialization, player form/server validation, match validation, and idempotency
- Client and server validation for negative player statistics, with Sonner toasts and inline field errors
- Responsive dashboard with loading, empty, and error states
- Zod validation and field-level error responses
- Prisma schema, committed initial migration, and reusable client
- Vercel-compatible build with automatic Prisma Client generation via `postinstall`
- Documented production environment-variable, migration, and deployment workflow

Not yet implemented:

- Editing or deleting recorded matches
- Playing XI and lineup management
- Role-based authorization and per-user data ownership
- Rate limiting and brute-force protection
- Expanded integration test suite and seed data
