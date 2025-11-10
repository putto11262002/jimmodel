# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 project using App Router (React Server Components), TypeScript, Tailwind CSS 4, and Drizzle ORM with Neon PostgreSQL.

**Stack:** Next.js 16 • React 19 • TypeScript 5 • Tailwind CSS 4 • Drizzle ORM • pnpm

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
- Drizzle ORM with Neon serverless PostgreSQL

## Common Commands

```bash
# Development
pnpm dev          # Start development server (with hot reload)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint -- --fix # Run ESLint with auto-fix

# Database (Drizzle ORM)
pnpm db:generate  # Generate migrations based on schema changes
pnpm db:push      # Push schema changes directly to database
pnpm db:migrate   # Run pending migrations
pnpm db:studio    # Open Drizzle Studio (visual database browser)
```

## Architecture

### Layer Structure

This project follows a clean architecture with three main layers:

- **actions/** - Platform boundary (Next.js Server Actions)
  - Validates input with Zod schemas
  - Returns `ActionState<T>` (discriminated union: success/error)
  - Calls platform-independent core services
  - Structure: `actions/<feature>/validator.ts` + `actions/<feature>/action.ts`

- **lib/core/<domain>/** - Platform-independent business logic
  - Pure TypeScript types (no Zod)
  - Framework-agnostic services
  - Reusable across platforms
  - Structure: `types.ts` + `service.ts` + `utils.ts`

- **db/** - Database layer (Drizzle ORM)
  - Database client initialized in `db/index.ts` (singleton)
  - Schemas defined in `db/schema/` (one file per domain)
  - Migrations auto-generated in `drizzle/`

**Validation Policy:** Only at platform boundaries (actions/, search params)

### Project Structure

```
jimmodel/
├── app/                    # Next.js App Router (React Server Components)
│   ├── (admin)/           # Admin routes (route group)
│   ├── (public)/          # Public routes (route group)
│   ├── layout.tsx         # Root layout (metadata, fonts, global styles)
│   └── globals.css        # Global CSS (Tailwind imports)
├── actions/               # Platform boundary (Zod validation, Server Actions)
│   ├── types.ts           # ActionState, ActionError, ServerAction
│   ├── utils.ts           # success(), error(), handleActionError()
│   ├── common.ts          # Common validators (pagination, uuid)
│   └── <feature>/
│       ├── validator.ts   # Zod schemas, infer types
│       └── action.ts      # Server actions
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                # React hooks
├── lib/
│   ├── core/             # Platform-independent logic
│   │   └── <domain>/
│   │       ├── types.ts   # Service input types (pure TypeScript)
│   │       ├── service.ts # Business logic
│   │       └── utils.ts   # Domain utilities
│   ├── utils/            # Shared utilities
│   └── config/           # Configuration
├── db/                   # Database layer (Drizzle ORM)
│   ├── index.ts          # Database client (Neon connection)
│   └── schema/           # Schema definitions
│       └── index.ts      # Export all schemas
├── drizzle/              # Auto-generated migrations (commit to git)
├── public/               # Static assets (images, fonts, etc.)
├── .env.local            # Environment variables (gitignored, contains DATABASE_URL)
├── .env.example          # Example env vars (committed)
├── drizzle.config.ts     # Drizzle Kit configuration
├── components.json       # shadcn/ui configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript config (path alias: @/*)
├── next.config.ts        # Next.js configuration
├── eslint.config.mjs     # ESLint config (Next.js + TypeScript rules)
└── postcss.config.mjs    # PostCSS config (Tailwind CSS)
```

### Technology Notes

**App Router & React Server Components:**
- All files in `app/` are React Server Components by default
- Use `"use client"` directive for Client Components (interactivity, hooks, browser APIs)
- Route files: `app/<route>/page.tsx` → `/<route>`
- API routes: `app/api/<route>/route.ts`

**Styling:**
- Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- Fonts optimized using `next/font/google` (Geist font families)
- Global styles in `app/globals.css`
- shadcn/ui for UI components

**TypeScript:**
- Strict mode enabled
- Path alias `@/*` resolves to project root
- Target: ES2017, Module: esnext with bundler resolution

**Database:**
- Drizzle ORM with Neon serverless PostgreSQL (`@neondatabase/serverless`)
- Connection string in `.env.local` as `DATABASE_URL`
- Migrations tracked in `drizzle/` (commit to git)

**ESLint:**
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores generated files (`.next/`, `out/`, `build/`)

## Documentation

### Implementation Catalogs

The `docs/components/` directory contains implementation catalogs for major features and components. Each file documents a specific aspect (e.g., database schema, authentication, API routes) with implementation details, file locations, libraries used, and relevant documentation links.

**Purpose:** Help developers understand what was built, where the code lives, and how it works.

**Usage:** Use the component-docs skill or `/document-changes` command for creating and updating catalogs.

### External Documentation

Use `mcp__context7__get-library-docs` to fetch official documentation:

**Library IDs:**
- Next.js: `/vercel/next.js`
- Drizzle ORM: `orm.drizzle.team/docs`

**Strategy:** Start with broad topics (e.g., "routing", "database schema"), then narrow down to specific features. Use 2000 tokens initially, increase if needed.
