# Drizzle ORM Skill

Expert guidance for working with Drizzle ORM in this Next.js project.

## Purpose

This skill helps developers work with Drizzle ORM for database operations, including:
- Defining and modifying database schemas
- Writing type-safe database queries
- Understanding migrations and database workflow
- Following project conventions for database code

## When to Use This Skill

Use this skill when you need to:
- Create or modify database schemas (tables, columns, relations)
- Write database queries (SELECT, INSERT, UPDATE, DELETE)
- Understand the project's database structure
- Get help with Drizzle ORM syntax and best practices
- Debug database-related issues

## Important Files & Locations

### Core Database Files
- **`db/index.ts`** - Drizzle database client (singleton instance for Neon connection)
- **`db/schema/index.ts`** - ALL database schemas are defined here

### Configuration Files
- **`drizzle.config.ts`** - Drizzle Kit configuration (schema path, migrations directory, database connection)
- **`.env.local`** - Contains `DATABASE_URL` connection string (gitignored, never commit)
- **`.env.example`** - Example environment variables (committed for reference)

### Migration Files
- **`drizzle/`** - Auto-generated SQL migration files (committed to git for audit trail)

### Documentation
- **`docs/components/database-orm.md`** - Comprehensive setup and usage documentation

## Database Commands (Reference Only)

**IMPORTANT: NEVER run these commands yourself. The user will run them manually.**

The following commands are available in `package.json` for reference:

- `pnpm db:generate` - Generate migrations based on schema changes
- `pnpm db:push` - Push schema changes directly to database (development only)
- `pnpm db:migrate` - Run pending migrations
- `pnpm db:studio` - Open Drizzle Studio (visual database browser)

When you suggest schema changes, ALWAYS remind the user to run the appropriate command (e.g., "After making these changes, run `pnpm db:generate` to create a migration").

## Technology Stack

- **Drizzle ORM** v0.44.7 - Type-safe ORM with zero runtime overhead
- **Drizzle Kit** v0.31.6 - CLI tool for migrations and schema management
- **Neon Serverless PostgreSQL** (@neondatabase/serverless v1.0.2) - Serverless PostgreSQL with HTTP connections
- **PostgreSQL** - Database dialect

## Getting Documentation

When you need detailed information about Drizzle ORM syntax, features, or best practices:

1. Use the context7 MCP tool to fetch up-to-date documentation
2. The library ID is: `/drizzle-team/drizzle-orm`
3. Specify relevant topics when fetching docs (e.g., "schema definition", "queries", "relations", "migrations")

Example:
```
Use mcp__context7__get-library-docs with:
- context7CompatibleLibraryID: "/drizzle-team/drizzle-orm"
- topic: "pgTable schema definition" (or other relevant topic)
```

## Database Workflow

```
1. Define/modify schema in db/schema/index.ts (TypeScript)
2. User runs: pnpm db:generate (creates migration)
3. User runs: pnpm db:push or pnpm db:migrate (applies to database)
4. Application uses db client for queries
```

## Reference Documentation

This skill includes detailed reference documentation for implementation:

- **`refs/schema-definition.md`** - Complete guide for defining schemas, tables, columns, relations, constraints, and all schema-related conventions
- **`refs/data-access.md`** - Complete guide for writing queries (SELECT, INSERT, UPDATE, DELETE, joins, filters) and all query patterns

**Always consult these reference docs for detailed syntax, patterns, and conventions.**

## Key Principles

1. **Type Safety First** - Drizzle provides full TypeScript inference; leverage it
2. **Single Schema File** - All schemas go in `db/schema/index.ts` (project convention)
3. **Never Run Commands** - Always instruct the user to run migration commands
4. **Fetch Latest Docs** - Use context7 to get current Drizzle documentation when needed
5. **Server-Side Only** - Database operations must be in Server Components or API routes
6. **Migration Audit Trail** - All migrations are committed to git in `drizzle/`

## Security Notes

- `DATABASE_URL` contains credentials - never log or expose it
- Always validate user input before database queries
- Use parameterized queries (Drizzle handles this automatically)
- Be cautious with `db:push` in production - prefer migrations

## Helpful Links

- Drizzle ORM Docs: https://orm.drizzle.team/
- Drizzle Kit Docs: https://orm.drizzle.team/kit-docs/overview
- Neon Documentation: https://neon.tech/docs/
- PostgreSQL Data Types: https://www.postgresql.org/docs/current/datatype.html

---

**Remember:** Always fetch the latest documentation using context7 when you need specific syntax or feature details. The library ID is `/drizzle-team/drizzle-orm`. Refer to the `refs/` documentation for detailed implementation guidance.
