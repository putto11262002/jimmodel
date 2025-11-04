# Zod Validation Schemas Reference

Input validation is a critical part of server actions. This guide covers creating and managing Zod schemas for type-safe validation throughout your Next.js application.

## Schema-First Validation

**IMPORTANT:** When creating Zod validation schemas, always reference the database schema as your source of truth to ensure consistency between validation and storage layers.

**Best Practice:**
1. Open the database schema file (e.g., `db/schema/index.ts`)
2. Identify the table and column definitions for your domain
3. Create validators that mirror the database constraints
4. Use the same types, lengths, and validation rules as defined in the schema

### Example: Database Schema to Validator

```typescript
// db/schema/index.ts
export const models = pgTable("models", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  nickName: varchar("nick_name", { length: 100 }),
  gender: varchar("gender", { length: 20 }).notNull(),
  dateOfBirth: date("date_of_birth"),
  height: numeric("height", { precision: 5, scale: 2 }), // in cm
  bio: text("bio"),
  published: boolean("published").notNull().default(false),
});

// lib/validators/model.ts - Mirror the schema constraints
export const createModelSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less'),
  nickName: z.string()
    .max(100, 'Nickname must be 100 characters or less')
    .optional(),
  gender: z.string()
    .min(1, 'Gender is required')
    .max(20, 'Gender must be 20 characters or less'),
  dateOfBirth: z.date().optional(),
  height: z.number()
    .positive('Height must be positive')
    .max(999.99, 'Height value too large')
    .optional(),
  bio: z.string().optional(),
  published: z.boolean().default(false),
});
```

**Why this matters:**
- Prevents validation/storage mismatches that cause runtime errors
- Ensures client-side and server-side validation match database constraints
- Makes schema evolution easier (update DB schema → update validators)
- Catches constraint violations early (before database operations)

## File Organization

All Zod schemas live in `lib/validators/`, organized by domain:

```
lib/validators/
├── user.ts       # User schemas (create, update, delete)
├── post.ts       # Post schemas
├── comment.ts    # Comment schemas
├── model.ts      # Model schemas
└── common.ts     # Shared schemas (pagination, search, ID formats)
```

## Naming Conventions

**1. Descriptive names ending with `Schema`**

```typescript
createUserSchema, updateUserSchema, deleteUserSchema, getUserSchema
```

**2. Export inferred types for client-side usage**

```typescript
// lib/validators/user.ts
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Must be 18 or older').optional(),
});

// Always export the inferred type
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

**3. User-friendly error messages**

Provide clear validation feedback to help users fix their input:

```typescript
email: z.string().email('Please enter a valid email address'),
name: z.string().min(2, 'Name must be at least 2 characters'),
age: z.number().min(18, 'You must be 18 or older'),
```

**4. Reuse common schemas**

Extract shared patterns to `common.ts` to avoid duplication:

```typescript
// lib/validators/common.ts
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const emailSchema = z.string().email('Invalid email address');
export const uuidSchema = z.string().uuid('Invalid ID format');
export const idSchema = z.string().min(1, 'ID is required');
```

## Complex Validation Examples

### Custom Refinement

Add custom validation logic beyond basic type checking:

```typescript
export const createPostSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(10000),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
}).refine(
  (data) => {
    // If published, must have publishedAt
    if (data.published && !data.publishedAt) {
      return false;
    }
    return true;
  },
  {
    message: 'Published posts must have a publish date',
    path: ['publishedAt'], // Attach error to specific field
  }
);
```

### Date Range Validation

Validate relationships between multiple date fields:

```typescript
export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  }
);
```

### Schema Composition

Combine and extend schemas to reduce duplication:

```typescript
// Compose multiple schemas
export const paginatedQuerySchema = paginationSchema
  .merge(sortingSchema)
  .merge(searchSchema);

// Extend existing schema for updates
export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid(),
});
```

## Common Validators

Frequently used validators available in `lib/validators/common.ts`:

### IDs
- `uuidSchema` - UUID format validation
- `idSchema` - Non-empty string ID

### Common Fields
- `emailSchema` - Email validation
- `urlSchema` - URL validation
- `phoneSchema` - Phone number validation

### Pagination
- `paginationSchema` - page, limit
- `sortingSchema` - sortBy, sortOrder
- `searchSchema` - search term
- `paginatedQuerySchema` - All of above combined

### Date Ranges
- `dateRangeSchema` - startDate, endDate with validation

## Usage in Server Actions

Server actions automatically use these validators to ensure type safety:

```typescript
// lib/actions/users.ts
'use server';

import { createAction } from '@/lib/actions';
import { createUserSchema } from '@/lib/validators/user';

export const createUser = createAction({
  schema: createUserSchema,  // Zod handles validation
  handler: async (input) => {
    // input is automatically typed from schema
    // All validations have passed at this point
    const [user] = await db.insert(users).values(input).returning();
    return { id: user.id, email: user.email };
  },
});
```

## Validation Error Handling

When validation fails, errors are automatically structured with field-level details:

```typescript
const result = await createUser({
  email: 'invalid-email',
  name: 'John',
});

if (!result.success) {
  console.log(result.error.code); // 'VALIDATION_ERROR'
  console.log(result.error.fieldErrors);
  // { email: ['Invalid email address'] }
}
```

## Best Practices

**1. Keep validators synchronized with database schema**
- Document the source table/columns in schema comments
- Update validators when schema changes
- Use shared patterns from `common.ts`

**2. Provide helpful error messages**
- Use plain language, not technical jargon
- Suggest what's wrong and how to fix it
- Avoid exposing internal implementation details

**3. Validate at the boundary**
- Always validate server action input with schemas
- Don't skip validation for "trusted" sources
- Use the most restrictive validation appropriate for the field

**4. Reuse schemas across actions**
```typescript
// Good - one schema for both create and list queries
const createSchema = z.object({ /* ... */ });
const listSchema = z.object({ /* ... */ });

// Less good - creating new schema in each action
export const action1 = createAction({
  schema: z.object({ /* ... */ }),
});
```

**5. Use type inference to avoid duplication**
```typescript
// Don't do this:
export const createUserSchema = z.object({ email: z.string() });
export type CreateUserInput = { email: string };

// Do this:
export const createUserSchema = z.object({ email: z.string() });
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

## Related Documentation

- [Server Actions Reference](./server-actions.md) - Complete server action patterns and implementation
- [Zod Documentation](https://zod.dev/) - Full Zod API reference
- [Database Schema](../../../db/schema/index.ts) - Your application's database schema
