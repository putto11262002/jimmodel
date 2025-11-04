# Data Access Reference

Project conventions and common patterns for querying data with Drizzle ORM.

## Where to Write Queries

**Database operations MUST be server-side only:**
- Server Components (React Server Components in `app/` directory)
- API routes (`app/api/*/route.ts`)
- Server Actions (functions with `'use server'` directive)

**Never query the database in Client Components or browser code.**

## Query Organization Convention

**IMPORTANT: Queries must NEVER be written directly in components. Always wrap queries in functions.**

### ❌ Bad - Query directly in component:

```typescript
export default async function UsersPage() {
  // ❌ DON'T DO THIS - query written directly in component
  const allUsers = await db.select().from(users)

  return <div>{/* render users */}</div>
}
```

### ✅ Good - Query wrapped in function:

```typescript
async function getUsers() {
  return db.select().from(users)
}

export default async function UsersPage() {
  // ✅ CORRECT - using a function
  const allUsers = await getUsers()

  return <div>{/* render users */}</div>
}
```

### Benefits of This Pattern:

1. **Reusability** - Query functions can be reused
2. **Testability** - Functions can be easily unit tested
3. **Maintainability** - Database logic is easier to update
4. **Type Safety** - Function signatures provide clear contracts
5. **Separation of Concerns** - Clear distinction between data access and presentation

## Import Pattern

**Always import the database client and schemas in your query functions:**

```typescript
import { db } from '@/db'
import { users, posts } from '@/db/schema'
import { eq, and, or, desc, asc } from 'drizzle-orm'
```

## Basic SELECT Queries

### Select All Records

```typescript
const allUsers = await db.select().from(users)
```

### Select with WHERE Clause

```typescript
// Single condition
const user = await db.select()
  .from(users)
  .where(eq(users.id, 1))

// Multiple conditions with AND
const activeUsers = await db.select()
  .from(users)
  .where(
    and(
      eq(users.verified, true),
      eq(users.isActive, true)
    )
  )

// Multiple conditions with OR
const matchingUsers = await db.select()
  .from(users)
  .where(
    or(
      eq(users.email, 'user@example.com'),
      eq(users.id, 42)
    )
  )
```

### Select Specific Columns

```typescript
// Select only specific fields
const userNames = await db.select({
  id: users.id,
  name: users.name,
  email: users.email,
})
  .from(users)
```

### Order By and Limit

**Convention:** Always use `orderBy` with `limit` for consistent pagination.

```typescript
import { desc, asc } from 'drizzle-orm'

// Order by single column
const recentPosts = await db.select()
  .from(posts)
  .orderBy(desc(posts.createdAt))
  .limit(10)

// Order by multiple columns
const sortedUsers = await db.select()
  .from(users)
  .orderBy(asc(users.verified), desc(users.createdAt))
  .limit(20)
  .offset(10)
```

## Common Filter Operators

```typescript
import { eq, ne, gt, gte, lt, lte, like, ilike, inArray, isNull, isNotNull, between } from 'drizzle-orm'

// Equality
.where(eq(users.id, 1))
.where(ne(users.status, 'deleted'))

// Comparison
.where(gt(users.age, 18))
.where(gte(users.score, 100))
.where(lt(users.attempts, 3))
.where(lte(users.price, 50))

// String matching
.where(like(users.name, '%John%'))
.where(ilike(users.email, '%@example.com')) // case insensitive

// Array membership
.where(inArray(users.role, ['admin', 'moderator']))

// Null checks
.where(isNull(users.deletedAt))
.where(isNotNull(users.email))

// Range
.where(between(users.age, 18, 65))
```

## INSERT Queries

### Insert Single Record

**Convention:** Always use `returning()` to get the inserted data.

```typescript
const [newUser] = await db.insert(users)
  .values({
    name: 'John Doe',
    email: 'john@example.com',
  })
  .returning()

console.log(newUser) // Full user object with id, timestamps, etc.
```

### Insert Multiple Records (Bulk Insert)

```typescript
const newUsers = await db.insert(users)
  .values([
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' },
  ])
  .returning()
```

### Insert with Conflict Handling (Upsert)

```typescript
// Do nothing on conflict
await db.insert(users)
  .values({
    email: 'john@example.com',
    name: 'John Doe',
  })
  .onConflictDoNothing()

// Update on conflict
await db.insert(users)
  .values({
    email: 'john@example.com',
    name: 'John Updated',
  })
  .onConflictDoUpdate({
    target: users.email,
    set: {
      name: 'John Updated',
      updatedAt: new Date(), // Manual update for updatedAt
    },
  })
  .returning()
```

## UPDATE Queries

**Convention:** Always use `returning()` to get the updated data.

```typescript
const [updatedUser] = await db.update(users)
  .set({
    name: 'John Updated',
    verified: true,
  })
  .where(eq(users.id, 1))
  .returning()
```

**Note:** The `updatedAt` field with `.$onUpdate(() => sql\`now()\`)` will be automatically updated by the database.

### Update Multiple Records

```typescript
const updatedUsers = await db.update(users)
  .set({ verified: true })
  .where(eq(users.isActive, true))
  .returning()
```

## DELETE Queries

**Convention:** Prefer soft deletes when possible. Use `returning()` to get deleted data.

### Hard Delete

```typescript
const [deletedUser] = await db.delete(users)
  .where(eq(users.id, 1))
  .returning()
```

### Soft Delete (Preferred)

```typescript
// Assuming your table has deletedAt field
const [softDeletedUser] = await db.update(users)
  .set({ deletedAt: new Date() })
  .where(eq(users.id, 1))
  .returning()
```

### Query Excluding Soft-Deleted Records

```typescript
// Always filter out soft-deleted records
const activeUsers = await db.select()
  .from(users)
  .where(isNull(users.deletedAt))
```

## JOIN Queries

### LEFT JOIN

**Convention:** Select specific fields from joined tables for clarity.

```typescript
const postsWithAuthors = await db.select({
  postId: posts.id,
  postTitle: posts.title,
  postContent: posts.content,
  authorId: users.id,
  authorName: users.name,
  authorEmail: users.email,
})
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
```

### INNER JOIN

```typescript
const publishedPosts = await db.select({
  postId: posts.id,
  postTitle: posts.title,
  authorName: users.name,
})
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id))
  .where(eq(users.verified, true))
```

### Multiple JOINs

```typescript
const commentsWithDetails = await db.select({
  commentId: comments.id,
  commentContent: comments.content,
  postTitle: posts.title,
  authorName: users.name,
})
  .from(comments)
  .innerJoin(posts, eq(comments.postId, posts.id))
  .innerJoin(users, eq(comments.userId, users.id))
  .orderBy(desc(comments.createdAt))
  .limit(50)
```

## Aggregations

```typescript
import { count, sum, avg, min, max } from 'drizzle-orm'

// Count rows
const userCount = await db.select({
  count: count(),
})
  .from(users)

// GROUP BY with aggregations
const postsByAuthor = await db.select({
  authorId: posts.authorId,
  postCount: count(posts.id),
  authorName: users.name,
})
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .groupBy(posts.authorId, users.name)
```

## Transactions

**Convention:** Use transactions for operations that must succeed or fail together.

```typescript
import { db } from '@/db'

await db.transaction(async (tx) => {
  // All operations use `tx` instead of `db`
  const [newUser] = await tx.insert(users)
    .values({ name: 'John', email: 'john@example.com' })
    .returning()

  await tx.insert(posts)
    .values({
      title: 'First Post',
      content: 'Hello World',
      authorId: newUser.id,
    })

  // If any operation fails, all changes are rolled back
})
```

## Error Handling

**Convention:** Always wrap database operations in try-catch blocks.

```typescript
try {
  const [user] = await db.insert(users)
    .values({ name: 'John', email: 'john@example.com' })
    .returning()

  return user
} catch (error) {
  // Handle database errors (unique constraint violations, etc.)
  console.error('Database error:', error)
  throw new Error('Failed to create user')
}
```

## Type Safety Patterns

### Using Inferred Types

```typescript
import { type User, type NewUser } from '@/db/schema'

// For SELECT results
const user: User = await db.query.users.findFirst({
  where: eq(users.id, 1),
})

// For INSERT values
const newUserData: NewUser = {
  name: 'John Doe',
  email: 'john@example.com',
}

const [createdUser] = await db.insert(users)
  .values(newUserData)
  .returning()
```

## Pagination Pattern

**Standard pagination pattern for lists:**

```typescript
interface PaginationParams {
  page: number // 1-indexed
  pageSize: number
}

async function getPaginatedUsers({ page, pageSize }: PaginationParams) {
  const offset = (page - 1) * pageSize

  const [users, [{ count }]] = await Promise.all([
    db.select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: count() }).from(users),
  ])

  return {
    users,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
    currentPage: page,
  }
}
```

## Checklists

### Writing a SELECT Query

- [ ] Wrap query in a function (NOT written directly in component)
- [ ] Import `db` from `@/db` in query function
- [ ] Import table schemas from `@/db/schema` in query function
- [ ] Import filter operators (`eq`, `and`, `or`, etc.) from `drizzle-orm`
- [ ] Select specific columns rather than all columns when possible
- [ ] Add `where` clause to filter results
- [ ] Add `orderBy` for consistent ordering
- [ ] Add `limit` to prevent unbounded queries
- [ ] Filter out soft-deleted records with `isNull(table.deletedAt)` if applicable
- [ ] Wrap in try-catch block
- [ ] Test query performance with realistic data volume

### Writing an INSERT Query

- [ ] Wrap query in a function (NOT written directly in component)
- [ ] Import `db` from `@/db` and table schema in query function
- [ ] Provide all required fields (those with `.notNull()` and no default)
- [ ] Use `.returning()` to get inserted data
- [ ] Wrap in try-catch to handle constraint violations
- [ ] Consider using `.onConflictDoNothing()` or `.onConflictDoUpdate()` for upserts
- [ ] If inserting related data, consider using a transaction
- [ ] Validate input data before insertion
- [ ] Don't manually set `id`, `createdAt`, or `updatedAt` (handled by database)

### Writing an UPDATE Query

- [ ] Wrap query in a function (NOT written directly in component)
- [ ] Import `db` from `@/db` and table schema in query function
- [ ] Use `.set()` with only fields that should change
- [ ] Include `.where()` clause to target specific records
- [ ] Use `.returning()` to get updated data
- [ ] Wrap in try-catch block
- [ ] Don't manually set `updatedAt` (handled by `.$onUpdate()`)
- [ ] Verify the correct record(s) will be updated
- [ ] Consider soft delete instead of hard delete for user data

### Writing a DELETE Query

- [ ] Wrap query in a function (NOT written directly in component)
- [ ] Import `db` from `@/db` and table schema in query function
- [ ] Consider soft delete instead of hard delete
- [ ] Use `.where()` clause to target specific records
- [ ] Use `.returning()` to get deleted data
- [ ] Wrap in try-catch block
- [ ] Consider foreign key constraints and cascading deletes
- [ ] Check if any related data needs cleanup
- [ ] Verify the correct record(s) will be deleted

### Writing a JOIN Query

- [ ] Wrap query in a function (NOT written directly in component)
- [ ] Import all required table schemas in query function
- [ ] Import `eq` from `drizzle-orm`
- [ ] Select specific fields from each table
- [ ] Use descriptive aliases for selected fields (e.g., `postId`, `authorName`)
- [ ] Choose appropriate join type (`.leftJoin()` vs `.innerJoin()`)
- [ ] Add `.where()` clause if needed
- [ ] Add `.orderBy()` for consistent ordering
- [ ] Add `.limit()` to prevent large result sets
- [ ] Test query performance with realistic data volume
- [ ] Consider if relational query API would be cleaner

### Using Transactions

- [ ] Identified operations that must succeed/fail together
- [ ] Wrapped operations in `db.transaction(async (tx) => { ... })`
- [ ] Used `tx` (transaction client) for all operations inside transaction
- [ ] All operations use `.returning()` to get data for subsequent operations
- [ ] Transaction is as short as possible (no external API calls inside)
- [ ] Error handling is implemented outside transaction block
- [ ] Tested rollback behavior by simulating failures

### Common Mistakes to Avoid

- [ ] ❌ Don't write queries directly in components (always wrap in functions)
- [ ] ❌ Don't query database in Client Components
- [ ] ❌ Don't forget `.returning()` on INSERT/UPDATE/DELETE
- [ ] ❌ Don't forget `.where()` clause on UPDATE/DELETE (will affect all rows!)
- [ ] ❌ Don't manually set `id`, `createdAt`, or `updatedAt`
- [ ] ❌ Don't use `SELECT *` when you only need specific columns
- [ ] ❌ Don't forget `limit` on potentially large result sets
- [ ] ❌ Don't forget to filter out soft-deleted records
- [ ] ❌ Don't forget try-catch for error handling
- [ ] ❌ Don't use raw SQL unless absolutely necessary
- [ ] ❌ Don't mix `db` and `tx` within a transaction
- [ ] ❌ Don't forget to test query performance

## Quick Reference: Common Operations

```typescript
// SELECT
await db.select().from(users).where(eq(users.id, 1))

// INSERT
await db.insert(users).values({ name: 'John', email: 'john@example.com' }).returning()

// UPDATE
await db.update(users).set({ name: 'Jane' }).where(eq(users.id, 1)).returning()

// DELETE
await db.delete(users).where(eq(users.id, 1)).returning()

// SOFT DELETE
await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, 1)).returning()

// LEFT JOIN
await db.select({ /* fields */ }).from(posts).leftJoin(users, eq(posts.authorId, users.id))

// INNER JOIN
await db.select({ /* fields */ }).from(posts).innerJoin(users, eq(posts.authorId, users.id))

// COUNT
await db.select({ count: count() }).from(users)

// TRANSACTION
await db.transaction(async (tx) => { /* operations */ })

// PAGINATION
await db.select().from(users).limit(20).offset(40).orderBy(desc(users.createdAt))
```

## Filter Operators Reference

```typescript
// Comparison
eq(column, value)           // Equal
ne(column, value)           // Not equal
gt(column, value)           // Greater than
gte(column, value)          // Greater than or equal
lt(column, value)           // Less than
lte(column, value)          // Less than or equal

// String
like(column, pattern)       // SQL LIKE (case sensitive)
ilike(column, pattern)      // SQL ILIKE (case insensitive)

// Arrays
inArray(column, values[])   // IN (value1, value2, ...)
notInArray(column, values[]) // NOT IN (value1, value2, ...)

// Null
isNull(column)              // IS NULL
isNotNull(column)           // IS NOT NULL

// Range
between(column, min, max)   // BETWEEN min AND max
notBetween(column, min, max) // NOT BETWEEN min AND max

// Logical
and(...conditions)          // AND
or(...conditions)           // OR
not(condition)              // NOT
```

## Performance Tips

1. **Always use indexes** - Foreign keys and frequently queried columns should have indexes (defined in schema)
2. **Select only needed columns** - Don't use `SELECT *` when you only need specific fields
3. **Use pagination** - Always add `limit` to queries that might return many rows
4. **Avoid N+1 queries** - Use JOINs or batch queries instead of querying in loops
5. **Use transactions wisely** - Keep transactions short and don't include external API calls
6. **Monitor query performance** - Use Drizzle Studio or database logs to identify slow queries

## Security Best Practices

1. **Parameterized queries** - Drizzle handles this automatically, never concatenate user input
2. **Validate input** - Always validate user input before database operations
3. **Use specific WHERE clauses** - Never forget WHERE on UPDATE/DELETE
4. **Soft deletes** - Prefer soft deletes for user data
5. **Server-side only** - Never expose database credentials or operations to the client

## Key Conventions Summary

1. ✅ NEVER write queries directly in components - always wrap in functions
2. ✅ All database operations in Server Components, API routes, or Server Actions only
3. ✅ Always import `db` from `@/db` in query functions
4. ✅ Always use `.returning()` on INSERT/UPDATE/DELETE
5. ✅ Always use `.where()` on UPDATE/DELETE
6. ✅ Always use try-catch for error handling
7. ✅ Always use `limit` on queries that might return many rows
8. ✅ Filter out soft-deleted records with `isNull(table.deletedAt)`
9. ✅ Use transactions for operations that must succeed/fail together
10. ✅ Select specific columns rather than all columns when possible
11. ✅ Use descriptive aliases in JOIN queries
