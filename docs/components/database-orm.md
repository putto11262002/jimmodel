# Database ORM Setup (Drizzle + Neon)

## Overview

This document describes the Drizzle ORM integration with Neon serverless PostgreSQL for the jimmodel project. Drizzle ORM provides a lightweight, type-safe interface for database operations, while Neon handles serverless PostgreSQL hosting. This setup enables developers to define schemas in TypeScript, generate migrations, and interact with the database in a fully typed manner.

## Files & Locations

- **Database client:** `db/index.ts` - Singleton Drizzle client instance
- **Schema definitions:** `db/schema/index.ts` - Central export point for all database schemas
- **Drizzle configuration:** `drizzle.config.ts` - Kit configuration for migrations and schema generation
- **Environment variables:** `.env.local` - Contains `DATABASE_URL` connection string (gitignored)
- **Migrations:** `drizzle/` - Auto-generated migration files (committed to git)
- **Project guidelines:** `.claude/CLAUDE.md` - Includes database setup documentation

## Technologies & Libraries

- **Drizzle ORM:** v0.44.7
  - Documentation: https://orm.drizzle.team/
  - Why: Lightweight, type-safe ORM with excellent TypeScript support and zero runtime overhead

- **Drizzle Kit:** v0.31.6 (dev dependency)
  - Documentation: https://orm.drizzle.team/kit-docs/overview
  - Why: CLI tool for generating migrations and managing database schema

- **Neon Serverless PostgreSQL:** @neondatabase/serverless v1.0.2
  - Documentation: https://neon.tech/docs/serverless/
  - Why: Serverless PostgreSQL with HTTP-based connections, perfect for edge functions and serverless environments

- **dotenv:** v17.2.3 (dev dependency)
  - Why: Loads environment variables from `.env.local` for local development

## Configuration

### Environment Variables

- `DATABASE_URL` - Connection string to Neon PostgreSQL database (format: `postgresql://user:password@host/database`)
  - **Note:** This variable must be set in `.env.local` (gitignored) and not committed
  - Example provided in `.env.example` (without credentials)

### Config Files

- **`drizzle.config.ts`** - Drizzle Kit configuration specifying:
  - `schema`: Path to schema definitions (`./db/schema`)
  - `out`: Output directory for migrations (`./drizzle`)
  - `dialect`: Database type (`postgresql`)
  - `dbCredentials`: Database connection URL from environment

### Setup Steps

1. Create a Neon project at https://console.neon.tech/
2. Copy the connection string (starts with `postgresql://`)
3. Add to `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```
4. Define your first schema in `db/schema/` (e.g., `users.ts`)
5. Generate migration: `pnpm db:generate`
6. Push schema to database: `pnpm db:push` (or run migration with `pnpm db:migrate`)

## How It Works

### Architecture Flow

1. **Schema Definition** - Developers define database schemas in TypeScript files within `db/schema/`
2. **Schema Export** - All schemas are exported from `db/schema/index.ts`
3. **Migration Generation** - `pnpm db:generate` compares the TypeScript schema with the database and creates SQL migrations in `drizzle/`
4. **Database Updates** - Migrations can be applied via:
   - `pnpm db:push` - Direct schema push (good for development)
   - `pnpm db:migrate` - Run pending migrations sequentially
5. **Runtime Access** - Application code imports the `db` client from `db/index.ts` to execute queries

### Key Components

**`db/index.ts` (Database Client):**
- Imports the Neon HTTP client via `@neondatabase/serverless`
- Creates a Drizzle ORM instance configured for HTTP queries
- Exports a singleton `db` instance for use throughout the application
- Connection uses `DATABASE_URL` from environment variables

**`drizzle.config.ts` (Kit Configuration):**
- Specifies the schema location and output directory
- Uses PostgreSQL dialect
- Reads `DATABASE_URL` for connecting to Neon during migrations

**`db/schema/` (Schema Definitions):**
- TypeScript files defining tables, columns, relations, and constraints
- Example structure: `db/schema/users.ts` would define a `users` table
- All schemas exported from `db/schema/index.ts` for central access

### Database Workflow

```
Developer writes schema in TypeScript
         ↓
pnpm db:generate creates SQL migration
         ↓
Migration stored in drizzle/ directory
         ↓
pnpm db:push or pnpm db:migrate applies to Neon
         ↓
Application code uses db client for queries
```

## Database Commands

All database operations are available as npm scripts in `package.json`:

- **`pnpm db:generate`** - Generate migrations based on schema changes
  - Compares your TypeScript schema with the database
  - Creates SQL migration files in `drizzle/` directory
  - Use when you've modified schemas in `db/schema/`

- **`pnpm db:push`** - Push schema changes directly to database
  - Applies schema changes without creating migration files
  - Useful for rapid development iteration
  - Not recommended for production; use migrations instead

- **`pnpm db:migrate`** - Run pending migrations
  - Executes all migration files in `drizzle/` that haven't been applied
  - Safe for production; maintains audit trail of schema changes

- **`pnpm db:studio`** - Open Drizzle Studio
  - Visual database browser and editor
  - Allows viewing tables, running queries, and managing data
  - Requires `DATABASE_URL` to be set

## Usage Examples

### Defining a Schema

Create `db/schema/users.ts`:

```typescript
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

Export from `db/schema/index.ts`:

```typescript
export * from './users'
```

### Querying Data

In a Server Component or API route:

```typescript
import { db } from '@/db'
import { users } from '@/db/schema'

// Query all users
const allUsers = await db.select().from(users)

// Query with filter
const usersByEmail = await db
  .select()
  .from(users)
  .where(eq(users.email, 'user@example.com'))

// Insert
await db.insert(users).values({
  email: 'newuser@example.com',
  name: 'New User',
})
```

## Related Documentation

- **Drizzle ORM Docs:** https://orm.drizzle.team/
- **Drizzle Kit Docs:** https://orm.drizzle.team/kit-docs/overview
- **Neon Documentation:** https://neon.tech/docs/
- **PostgreSQL Types:** https://www.postgresql.org/docs/current/datatype.html
- **Project Guidelines:** `.claude/CLAUDE.md` (see Database section)

## Future Considerations

- [ ] Set up automated backups and disaster recovery procedures for Neon
- [ ] Implement database connection pooling for production (Neon offers connection pooling)
- [ ] Add seed data scripts for development environments
- [ ] Document schema versioning strategy for team collaboration
- [ ] Consider adding database monitoring and performance metrics
- [ ] Implement row-level security (RLS) policies if needed for multi-tenant features
- [ ] Set up replication or read replicas for scaling read-heavy operations
- [ ] Document best practices for pagination and query optimization

## Notes

- Migrations are committed to git in the `drizzle/` directory - this maintains a complete audit trail of schema changes
- The `DATABASE_URL` must include `?sslmode=require` when connecting to Neon over the internet
- In development, `.env.local` is used; for production deployments, set `DATABASE_URL` as an environment variable in your hosting platform
- Drizzle ORM generates zero runtime code - type safety is purely at development time
- HTTP-based connections to Neon are suitable for serverless functions and have minimal connection overhead compared to traditional TCP connections
