---
title: "Admin Panel Governance"
description: "Conventions and patterns for the admin panel route group"
---

# Admin Panel Governance

## Overview

The admin panel (`app/(admin)/admin/`) is a client-side application segment that uses React Query for data fetching and mutations, Hono RPC client for API communication, and parallel routes for layout composition. This document establishes admin-specific conventions and references patterns used throughout the admin implementation.

## Core Principles

### 1. Client-Side Data Management

All data operations in the admin panel use React Query with Hono RPC client.

**See:** `context/client-side-queries.md` and `context/client-side-mutations.md` for implementation patterns

### 2. Slot-Based Layout Architecture

Admin panel uses Next.js parallel routes (`@header` and `@content`) for fixed header + scrollable content.

**See:** `context/admin-layout-slots.md` for layout structure and route organization

### 3. Dialog-Based Creation Flows

Entity creation uses context-managed dialogs triggered from header slots.

**See:** `context/dialog-definition-pattern.md` for dialog implementation workflow

### 4. UI Validation at Component Level

Client-side forms use Zod schemas colocated with components in `_validators.ts` files.

**See:** `context/ui-validation-pattern.md` for validation schema organization

## Directory Structure

```
app/(admin)/admin/
├── layout.tsx                    # Slot-based layout with providers
├── _providers.tsx                # QueryClient + dialog providers
├── _components/                  # Admin-wide shared components
├── @header/                      # Parallel route: Fixed header slot
│   ├── default.tsx              # Default header (empty state)
│   ├── page.tsx                 # Root header
│   └── <feature>/
│       ├── page.tsx             # Feature header (actions, breadcrumbs)
│       ├── _validators.ts       # Header-specific validators
│       └── _components/         # Header components (dialogs, actions)
└── @content/                     # Parallel route: Scrollable content
    ├── default.tsx              # Default content (empty state)
    ├── page.tsx                 # Root content
    └── <feature>/
        ├── (index)/             # Route group for list view
        │   ├── page.tsx         # List page
        │   ├── _validators.ts   # List validators (filters, search params)
        │   └── _components/     # List components (table, filters, actions)
        └── [id]/                # Dynamic route for detail view
            ├── page.tsx         # Detail page (redirects to first tab)
            ├── <tab>/
            │   └── page.tsx     # Tab-specific page
            ├── _validators.ts   # Detail validators (forms)
            └── _components/     # Detail components (forms, managers)
```

## Feature Organization

### List Views (Index Routes)

**Location:** `@content/<feature>/(index)/`

**Structure:**
- `page.tsx` - Client Component with search params, filters, pagination
- `_validators.ts` - Search params schema, filter schemas
- `_components/` - Table, filters, bulk actions, skeletons

**Responsibilities:**
- Parse and validate search params with Zod
- Fetch data with React Query hooks
- Render table with selection and pagination
- Handle filter changes via URL params
- Display empty states and skeletons

**See:** `app/(admin)/admin/@content/models/(index)/page.tsx` for reference implementation

### Detail Views (Dynamic Routes)

**Location:** `@content/<feature>/[id]/`

**Structure:**
- `page.tsx` - Redirect to first tab or layout for tabs
- `<tab>/page.tsx` - Tab-specific content
- `_validators.ts` - Form schemas for detail pages
- `_components/` - Forms, managers, sidebars

**Responsibilities:**
- Fetch entity data with detail query hook
- Render forms with react-hook-form + Zod
- Handle mutations with toast feedback
- Navigate between tabs

**See:** `app/(admin)/admin/@content/models/[id]/` for reference implementation

### Header Slots

**Location:** `@header/<feature>/`

**Structure:**
- `page.tsx` - Breadcrumbs, primary actions, filters
- `_validators.ts` - Dialog/action validators
- `_components/` - Dialog components, action buttons

**Responsibilities:**
- Provide context-aware header content
- Render create/action dialogs
- Show breadcrumbs for navigation context

**Pattern:** Dialogs use context providers in `_providers.tsx` for global access

**See:** `app/(admin)/admin/@header/models/` for reference implementation

## Data Fetching Conventions

Admin panel uses React Query hooks with Hono RPC client for all data operations.

**Query hooks location:** `hooks/queries/<feature>/use-<feature>s.ts` (list) or `use-<feature>.ts` (detail)

**Mutation hooks location:** `hooks/queries/<feature>/use-create-<feature>.ts`, `use-update-<feature>.ts`, `use-delete-<feature>.ts`

**See:**
- `context/client-side-queries.md` for query hook patterns
- `context/client-side-mutations.md` for mutation hook patterns

## Validation Conventions

Admin panel validates all inputs with Zod schemas colocated in `_validators.ts` files.

**Search params validation:** `@content/<feature>/(index)/_validators.ts`

**Form validation:** `@content/<feature>/[id]/_validators.ts` or `@header/<feature>/_validators.ts`

**See:** `context/ui-validation-pattern.md` for validation patterns and schema organization

## Component Conventions

### Tables

Admin panel uses `DataTable` component with column definitions in `_components/columns.tsx`.

**Reference:** `app/(admin)/admin/@content/models/(index)/_components/` for implementation example

### Forms

Admin panel uses `react-hook-form` with Zod resolver and shadcn/ui form components.

**See:** `context/ui-component-conventions.md` for form patterns

### Dialogs

**Creation dialogs:** Use context provider pattern in `_providers.tsx` for global access

**Confirmation dialogs:** Use local state with `DeleteConfirmDialog` component

**See:** `context/dialog-definition-pattern.md` for implementation workflow

### Loading and Empty States

**See:**
- `context/loading-states-pattern.md` for skeleton and loader patterns
- `context/empty-state-pattern.md` for no data and no results states

## Providers Setup

**Location:** `app/(admin)/admin/_providers.tsx`

**Required providers:**
1. `QueryClientProvider` - React Query client with configured defaults
2. Dialog context providers - For create/action dialogs accessible from headers

**Reference:** `app/(admin)/admin/_providers.tsx` for current configuration

## Common Workflows

### Workflow 1: Add New Feature to Admin Panel

1. Create parallel route directories: `@header/<feature>/` and `@content/<feature>/`
2. Create list view in `@content/<feature>/(index)/page.tsx`
3. Define search params schema in `@content/<feature>/(index)/_validators.ts`
4. Create query hook in `hooks/queries/<feature>/use-<feature>s.ts`
5. Create table component in `@content/<feature>/(index)/_components/`
6. Create header with actions in `@header/<feature>/page.tsx`
7. Add create dialog in `@header/<feature>/_components/`
8. Add dialog provider to `_providers.tsx`

### Workflow 2: Add Detail View with Tabs

1. Create dynamic route: `@content/<feature>/[id]/`
2. Create tab directories: `@content/<feature>/[id]/<tab>/page.tsx`
3. Define form schemas in `@content/<feature>/[id]/_validators.ts`
4. Create detail query hook in `hooks/queries/<feature>/use-<feature>.ts`
5. Create mutation hooks (update, delete)
6. Create form components in `@content/<feature>/[id]/_components/`
7. Create header for detail view in `@header/<feature>/[id]/page.tsx`

### Workflow 3: Add Bulk Actions to List View

1. Add selection state to list page component
2. Pass `selectedIds` and `onSelectionChange` to table
3. Create bulk actions component in `_components/`
4. Handle bulk mutations with `Promise.allSettled()`
5. Show toast feedback for success/failure counts
6. Clear selection after mutation completes

## Guidelines

### DO

1. **Use client-side queries/mutations** - All data operations via React Query + RPC client
2. **Validate search params** - Parse URL params with Zod schemas
3. **Show loading states** - Skeletons for queries, loaders for mutations
4. **Invalidate queries** - Use `onSuccess` callbacks in mutations
5. **Show toast feedback** - Success/error messages for all mutations
6. **Use parallel routes** - Follow `@header/@content` slot structure
7. **Colocate validators** - Keep Zod schemas in `_validators.ts` near usage
8. **Handle errors gracefully** - Show error states, don't crash

### DON'T

1. **Don't use Server Actions** - Admin panel is client-side only
2. **Don't skip validation** - Always validate search params and form inputs
3. **Don't forget invalidation** - Mutations must invalidate related queries
4. **Don't skip empty states** - Show helpful empty states for no data/no results
5. **Don't skip loading states** - Always show loading feedback during async operations
6. **Don't bypass providers** - Ensure QueryClient wraps all admin routes
7. **Don't forget toast feedback** - Users need confirmation of mutations

## Admin-Specific Patterns

### URL-Based Filtering

List views use URL search params for filters, enabling bookmarkable filtered states and browser navigation.

**Pattern:** Parse search params with Zod → fetch with query hook → update URL on filter changes

**Reference:** `app/(admin)/admin/@content/models/(index)/page.tsx`

### Context-Based Creation Dialogs

Creation dialogs are globally accessible via context providers, allowing header actions to trigger dialogs that affect content slots.

**Reference:** `app/(admin)/admin/@header/models/_components/create-model-dialog.tsx`

### Bulk Operations

List views support row selection for bulk operations using `Promise.allSettled()` pattern.

**Reference:** `app/(admin)/admin/@content/models/(index)/_components/models-table.tsx`

## Benefits

- **Consistent data flow** - All features follow same query/mutation patterns
- **Type safety** - Hono RPC + React Query provide end-to-end types
- **Predictable structure** - Parallel routes create consistent layout composition
- **Colocated validation** - Validators live near components that use them
- **Optimistic updates** - React Query cache enables instant UI feedback
- **Error boundaries** - Consistent error handling across all mutations

## Related Patterns

- **Layout structure**: `context/admin-layout-slots.md` (parallel routes)
- **Data fetching**: `context/client-side-queries.md` (React Query with RPC)
- **Data mutations**: `context/client-side-mutations.md` (create/update/delete)
- **Validation**: `context/ui-validation-pattern.md` (Zod schemas)
- **Dialogs**: `context/dialog-definition-pattern.md` (context-based dialogs)
- **Components**: `context/ui-component-conventions.md` (shadcn/ui usage)
- **Loading states**: `context/loading-states-pattern.md` (skeletons and loaders)
- **Empty states**: `context/empty-state-pattern.md` (no data/no results)
- **API client**: `context/hono-rpc-client-usage.md` (RPC client patterns)
