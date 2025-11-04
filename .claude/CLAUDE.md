# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 project bootstrapped with `create-next-app`. It uses the App Router (React Server Components) with TypeScript, Tailwind CSS for styling, and ESLint for code quality.

## Operation Workflow

**IMPORTANT:** Before implementing any new feature or making changes:

1. **Investigate First** - Always explore the existing codebase to understand current patterns and implementations
2. **Use Appropriate Skills** - Leverage the Explore agent or component-context-builder skill to gather context
3. **Understand Conventions** - Review similar existing code to match naming conventions, architecture patterns, and code style
4. **Align with Existing Patterns** - Ensure new implementations follow established patterns in the codebase

This approach prevents inconsistencies and ensures new code integrates seamlessly with the existing architecture.

## Development Environment

**Package Manager:** pnpm (as indicated by `pnpm-lock.yaml`)

**Key Dependencies:**
- Next.js 16.0.1
- React 19.2.0
- Tailwind CSS 4 (with `@tailwindcss/postcss`)
- TypeScript 5

## Common Development Commands

```bash
# Start development server (with hot reload)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Run ESLint with fix
pnpm lint -- --fix

# Database Commands (Drizzle ORM)
pnpm db:generate  # Generate migrations based on schema changes
pnpm db:push      # Push schema changes directly to database
pnpm db:migrate   # Run pending migrations
pnpm db:studio    # Open Drizzle Studio (visual database browser)
```

## Project Structure

```
jimmodel/
├── app/              # Next.js App Router (React Server Components)
│   ├── layout.tsx    # Root layout component (metadata, fonts, styling)
│   └── page.tsx      # Home page (App Router default: app/page.tsx → /)
├── lib/              # Shared utilities and helpers
│   ├── actions/      # Server actions (utilities + feature files like users.ts, posts.ts)
│   └── validators/   # Zod schemas for input validation
├── db/               # Database layer
│   ├── index.ts      # Drizzle database client (Neon connection)
│   └── schema/       # Database schema definitions
│       └── index.ts  # Export all schemas
├── drizzle/          # Auto-generated migrations (commit to git)
├── public/           # Static assets (images, fonts, etc.)
├── .env.local        # Environment variables (gitignored, contains DATABASE_URL)
├── .env.example      # Example env vars (committed, for reference)
├── drizzle.config.ts # Drizzle Kit configuration
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── next.config.ts    # Next.js configuration
├── eslint.config.mjs # ESLint configuration
└── postcss.config.mjs # PostCSS configuration (Tailwind CSS)
```

## Architecture Notes

**App Router & React Server Components:**
- This project uses Next.js App Router (the modern approach), not the legacy Pages Router
- All files in `app/` are React Server Components by default
- Use `"use client"` directive at the top of a file to make it a Client Component if needed (e.g., for interactivity, hooks)

**Styling:**
- Styling uses **Tailwind CSS v4** with `@tailwindcss/postcss` plugin
- Fonts are optimized using `next/font/google` (currently loads Geist font families)
- The root layout (`app/layout.tsx`) applies global styles and font variables
- CSS modules or styled components are not currently used

**TypeScript Path Alias:**
- `@/*` is configured to resolve to the project root, enabling imports like `@/app/components`

**Database (Drizzle ORM + Neon):**
- Uses Drizzle ORM with Neon serverless PostgreSQL (`@neondatabase/serverless`)
- Database client initialized in `db/index.ts`, exported as `db` singleton
- Define schemas in `db/schema/` (one file per domain recommended)
- Migrations auto-generated in `drizzle/` by Drizzle Kit
- Connection string stored in `.env.local` as `DATABASE_URL`

**Server Actions:**
- Type-safe server actions with automatic validation using Zod schemas
- All actions return `ActionState<T>` (discriminated union: success or error)
- Group related actions by feature in single files (e.g., `lib/actions/users.ts`)
- Validators defined in `lib/validators/` using Zod schemas
- Action utilities in `lib/actions/` (createAction, handleActionError, types, etc.)
- See `lib/actions/README.md` for complete documentation and patterns

**ESLint Configuration:**
- Extends `eslint-config-next/core-web-vitals` for Core Web Vitals best practices
- Extends `eslint-config-next/typescript` for TypeScript support
- Ignores generated files in `.next/`, `out/`, `build/`, and `next-env.d.ts`

## TypeScript Configuration

- Target: ES2017
- Strict mode: enabled
- Module: esnext with bundler resolution
- DOM and ESNext APIs available

## Important Files

- **`app/layout.tsx`** (line 1): Root layout - manages metadata, fonts, and global styling
- **`app/page.tsx`** (line 1): Home page component
- **`db/index.ts`** (line 1): Drizzle database client for Neon connection
- **`db/schema/index.ts`** (line 1): Schema exports (add your schemas here)
- **`drizzle.config.ts`** (line 1): Drizzle Kit configuration (schema path, migrations, database)
- **`.env.local`**: Contains `DATABASE_URL` - **do not commit**
- **`tsconfig.json`** (line 21-23): Path alias configuration for `@/*`
- **`eslint.config.mjs`** (line 1): ESLint flat config format

## Tips for Development

- When adding new pages, create them as route files in the `app/` directory (e.g., `app/about/page.tsx` for `/about`)
- Use the `"use client"` directive for interactive components
- For API routes, create files at `app/api/route-name/route.ts`
- Tailwind CSS classes can be used directly in JSX; no need for external CSS files for most styling
- TypeScript strict mode is enabled, so maintain type safety

## Documentation

### `docs/components/`

This directory contains implementation catalogs for major features and components of the project. Each file documents a specific aspect/feature (e.g., database schema, authentication, API routes) with context about implementation details, file locations, libraries used, and relevant documentation links.

**Purpose:** Help current and future developers understand what was built, where the code lives, and how it works.

**See the documentation skill for detailed conventions and templates.**

