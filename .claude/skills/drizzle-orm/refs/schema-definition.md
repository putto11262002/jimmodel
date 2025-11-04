# Schema Definition Reference

Project conventions and common patterns for defining database schemas with Drizzle ORM.

## File Location Convention

**ALL database schemas MUST be defined in `db/schema/index.ts`** - single file convention, no separate schema files.

## Type Export Convention

**Always export TypeScript types** for every table using `$inferSelect` and `$inferInsert`:

```typescript
// Define the table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Export types (REQUIRED)
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

**Type Naming Convention:**
- Select type: Singular PascalCase (e.g., `User`, `Post`, `Comment`)
- Insert type: `New` + Singular PascalCase (e.g., `NewUser`, `NewPost`, `NewComment`)

## Standard Field Patterns

### Primary Key Pattern

Use `serial` for auto-incrementing integer primary keys:

```typescript
id: serial('id').primaryKey()
```

### Timestamps Pattern

**Convention:** Every table should have `createdAt` and `updatedAt` fields.

```typescript
import { sql } from 'drizzle-orm'

// Created timestamp - set once on creation
createdAt: timestamp('created_at').defaultNow().notNull(),

// Updated timestamp - set on creation AND update
updatedAt: timestamp('updated_at')
  .defaultNow()
  .notNull()
  .$onUpdate(() => sql`now()`),
```

### Soft Delete Pattern

For tables that need soft deletes:

```typescript
deletedAt: timestamp('deleted_at'),
```

### Email Field Pattern

```typescript
email: varchar('email', { length: 255 }).unique().notNull(),
```

### Boolean Field Pattern

Always provide a default for booleans:

```typescript
verified: boolean('verified').default(false).notNull(),
isActive: boolean('is_active').default(true).notNull(),
```

### Text Content Pattern

Use `text` for unlimited content, `varchar` with length for constrained fields:

```typescript
// Unlimited text content
content: text('content'),
bio: text('bio'),

// Constrained text
title: varchar('title', { length: 255 }).notNull(),
slug: varchar('slug', { length: 255 }).unique().notNull(),
```

### JSON Field Pattern

Use `jsonb` with typed `$type<>()`:

```typescript
// Array types
tags: jsonb('tags').$type<string[]>(),

// Object types
metadata: jsonb('metadata').$type<{ preferences: Record<string, unknown> }>(),
settings: jsonb('settings').$type<{ theme: string; notifications: boolean }>(),
```

### Foreign Key Pattern

```typescript
// Reference with cascade delete
authorId: integer('author_id')
  .references(() => users.id, { onDelete: 'cascade' })
  .notNull(),

// Reference without cascade (restrict by default)
categoryId: integer('category_id')
  .references(() => categories.id)
  .notNull(),

// Optional reference
parentId: integer('parent_id').references(() => comments.id),
```

## Enum Pattern

Define enums outside table definitions, at the top of the file:

```typescript
import { pgEnum } from 'drizzle-orm/pg-core'

// Define enum
export const roleEnum = pgEnum('role', ['admin', 'user', 'guest'])

// Use in table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  role: roleEnum('role').default('user').notNull(),
})

// Export type
export type Role = typeof users.role.enumValues[number] // 'admin' | 'user' | 'guest'
```

## Index Pattern

Add indexes for frequently queried columns:

```typescript
import { index, uniqueIndex } from 'drizzle-orm/pg-core'

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    authorId: integer('author_id').references(() => users.id).notNull(),
    published: boolean('published').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    // Index on foreign keys
    authorIdx: index('posts_author_idx').on(table.authorId),

    // Index on frequently filtered columns
    publishedIdx: index('posts_published_idx').on(table.published),

    // Composite index
    authorPublishedIdx: index('posts_author_published_idx').on(
      table.authorId,
      table.published
    ),
  })
)
```

## Naming Conventions

- **Tables**: `snake_case`, plural (e.g., `users`, `blog_posts`, `user_profiles`)
- **Columns**: `snake_case` (e.g., `created_at`, `author_id`, `is_active`)
- **TypeScript exports**: `camelCase` for table names (e.g., `users`, `blogPosts`)
- **Types**: `PascalCase` (e.g., `User`, `NewUser`, `BlogPost`, `NewBlogPost`)
- **Enums**: `camelCase` with `Enum` suffix (e.g., `roleEnum`, `statusEnum`)
- **Indexes**: `{table}_{column(s)}_{idx|unique_idx}` (e.g., `posts_author_idx`)

## Complete Table Template

Use this as a starting point for new tables:

```typescript
import { pgTable, serial, text, varchar, boolean, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const tableName = pgTable(
  'table_name',
  {
    // Primary key
    id: serial('id').primaryKey(),

    // Required fields
    name: varchar('name', { length: 255 }).notNull(),

    // Optional fields
    description: text('description'),

    // Boolean with default
    isActive: boolean('is_active').default(true).notNull(),

    // JSON field with type
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),

    // Foreign key
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    // Standard timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    // Add indexes for foreign keys and frequently queried columns
    userIdx: index('table_name_user_idx').on(table.userId),
  })
)

// Export types
export type TableName = typeof tableName.$inferSelect
export type NewTableName = typeof tableName.$inferInsert
```

## Checklists

### Creating a New Table

- [ ] Table name is `snake_case` and plural
- [ ] Has `id: serial('id').primaryKey()`
- [ ] Has `createdAt: timestamp('created_at').defaultNow().notNull()`
- [ ] Has `updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => sql\`now()\`)`
- [ ] All required fields have `.notNull()`
- [ ] All boolean fields have `.default()`
- [ ] Email fields use `varchar('email', { length: 255 }).unique().notNull()`
- [ ] All foreign keys have appropriate `onDelete` behavior
- [ ] Indexes added for all foreign keys
- [ ] Indexes added for frequently queried columns
- [ ] JSONB fields use `.$type<YourType>()`
- [ ] Exported type using `typeof tableName.$inferSelect`
- [ ] Exported insert type using `typeof tableName.$inferInsert`
- [ ] Types named correctly: `TypeName` and `NewTypeName`

### Modifying Existing Table

- [ ] Read the current table definition in `db/schema/index.ts`
- [ ] Understand existing column types and constraints
- [ ] New columns follow naming conventions (`snake_case`)
- [ ] New required fields have `.notNull()` or provide defaults
- [ ] New foreign keys include appropriate indexes
- [ ] Updated the exported types if needed
- [ ] Reminded user to run `pnpm db:generate`
- [ ] Reminded user to run `pnpm db:push` or `pnpm db:migrate`

### Adding Foreign Key Relationship

- [ ] Referenced table exists
- [ ] Column type matches referenced column type (usually `integer` for `serial` IDs)
- [ ] Used `.references(() => tableName.id)`
- [ ] Specified `onDelete` behavior (`'cascade'`, `'set null'`, `'restrict'`, etc.)
- [ ] Added `.notNull()` if required
- [ ] Added index on the foreign key column
- [ ] Named index following convention: `{table}_{column}_idx`

### Before Finalizing Schema Changes

- [ ] All tables have timestamps (`createdAt` and `updatedAt`)
- [ ] All types are exported
- [ ] All naming follows conventions
- [ ] All foreign keys have indexes
- [ ] No sensitive data without proper constraints
- [ ] Boolean fields have sensible defaults
- [ ] Schema is in `db/schema/index.ts` (not separate files)
- [ ] Reviewed for potential N+1 query issues (added necessary indexes)
- [ ] User reminded to run migration commands (NOT run by you)

### Common Mistakes to Avoid

- [ ] ❌ Don't forget to export types
- [ ] ❌ Don't forget `.notNull()` on required fields
- [ ] ❌ Don't forget `.$onUpdate(() => sql\`now()\`)` on `updatedAt`
- [ ] ❌ Don't use `text` for constrained strings (use `varchar` with length)
- [ ] ❌ Don't forget to add indexes on foreign keys
- [ ] ❌ Don't forget default values for boolean fields
- [ ] ❌ Don't create separate schema files (use `db/schema/index.ts`)
- [ ] ❌ Don't run migration commands yourself (user must run them)
- [ ] ❌ Don't forget `onDelete` behavior for foreign keys
- [ ] ❌ Don't use plain `jsonb()` without `.$type<>()`

## Common Column Types Quick Reference

```typescript
// Text
text('column_name')                           // Unlimited text
varchar('column_name', { length: 255 })       // Limited text

// Numbers
serial('id')                                  // Auto-increment integer
integer('count')                              // Integer
numeric('price', { precision: 10, scale: 2 }) // Decimal (for money)

// Boolean
boolean('is_active')                          // Boolean

// Date/Time
timestamp('created_at')                       // Timestamp
date('birth_date')                            // Date only

// JSON
jsonb('data').$type<YourType>()               // JSON with type

// Arrays
text('tags').array()                          // Text array
integer('scores').array()                     // Integer array

// UUID
uuid('id').defaultRandom()                    // UUID with random default
```

## Relations Example

```typescript
// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

// Posts table with foreign key to users
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content'),
    published: boolean('published').default(false).notNull(),

    // Foreign key reference with cascade delete
    authorId: integer('author_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    authorIdx: index('posts_author_idx').on(table.authorId),
    publishedIdx: index('posts_published_idx').on(table.published),
  })
)

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
```

## After Schema Changes

After modifying schemas in `db/schema/index.ts`, the user must run:

1. `pnpm db:generate` - Create migration files
2. `pnpm db:push` (dev) or `pnpm db:migrate` (production) - Apply changes

**Never run these commands yourself - always instruct the user.**

## Key Conventions Summary

1. ✅ All schemas in `db/schema/index.ts`
2. ✅ Always export types with `$inferSelect` and `$inferInsert`
3. ✅ Use `createdAt` with `.defaultNow()`
4. ✅ Use `updatedAt` with `.defaultNow().$onUpdate(() => sql\`now()\`)`
5. ✅ Add indexes on foreign keys and frequently queried columns
6. ✅ Use `jsonb` with `$type<>()` for typed JSON
7. ✅ Boolean fields always have `.default()` and `.notNull()`
8. ✅ Foreign keys use `onDelete: 'cascade'` when appropriate
9. ✅ Email fields: `varchar('email', { length: 255 }).unique().notNull()`
10. ✅ Primary keys: `serial('id').primaryKey()`
