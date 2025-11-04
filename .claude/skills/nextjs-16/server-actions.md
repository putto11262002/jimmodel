# Server Actions Reference

## Overview

Server actions are the primary mechanism for implementing business logic and data access in this Next.js 16 application. They wrap ORM operations (Drizzle) with type-safe validation, structured error handling, and consistent return types.

**Purpose:**
- Implement business logic (mutations and queries)
- Wrap database/ORM access with validation
- Provide type-safe client-server communication
- Ensure consistent error handling across the application

**Key Features:**
- Automatic input validation via Zod schemas
- Type inference from schema to handler
- Discriminated union return types (`ActionState<T>`)
- Centralized error handling
- Support for authenticated actions

## Core Types

### ActionState<T>

All server actions return `ActionState<T>` - a discriminated union representing success or failure:

```typescript
type ActionState<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };
```

This forces exhaustive handling of both success and error cases on the client side.

**Example:**
```typescript
const result = await createUser({ email: 'test@example.com', name: 'John' });

if (result.success) {
  console.log(result.data); // Typed as your return type
} else {
  console.log(result.error.message); // Typed as ActionError
}
```

### ActionError

Structured error type with machine-readable codes:

```typescript
type ActionError = {
  message: string;                      // Human-readable error message
  code: ActionErrorCode;                // For programmatic handling
  fieldErrors?: Record<string, string[]>; // Field-specific validation errors
};
```

### ActionErrorCode

Standard error codes for categorizing failures:

```typescript
enum ActionErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',  // Input validation failed
  UNAUTHORIZED = 'UNAUTHORIZED',          // Not authenticated
  FORBIDDEN = 'FORBIDDEN',                // Lacks permission
  NOT_FOUND = 'NOT_FOUND',                // Resource doesn't exist
  DATABASE_ERROR = 'DATABASE_ERROR',      // Database operation failed
  INTERNAL_ERROR = 'INTERNAL_ERROR',      // Generic server error
  CONFLICT = 'CONFLICT',                  // Constraint violated (e.g., unique key)
}
```

**Location:** `lib/actions/types.ts:51`

## File Organization

### Directory Structure

```
lib/
├── actions/
│   ├── README.md           # Documentation (usage patterns)
│   ├── types.ts            # Core types (ActionState, ActionError, etc.)
│   ├── create-action.ts    # Action creator utilities
│   ├── index.ts            # Re-exports all utilities
│   ├── users.ts            # All user-related actions
│   ├── posts.ts            # All post-related actions
│   ├── comments.ts         # All comment-related actions
│   └── auth.ts             # All authentication actions
└── validators/
    ├── user.ts             # User-related Zod schemas
    ├── post.ts             # Post-related Zod schemas
    └── common.ts           # Shared/reusable schemas
```

**Convention:** Group all actions for a feature domain in a single file (e.g., `lib/actions/users.ts` contains all user CRUD operations).

**Benefits:**
- Fewer files to navigate
- Related functionality stays together
- Easier discovery of available actions
- Less import boilerplate

## Creating Actions

### 1. Standard Action (createAction)

For actions with input validation but no authentication requirement.

**Function signature:** `lib/actions/create-action.ts:115`

```typescript
function createAction<TInput extends z.ZodTypeAny, TOutput>(config: {
  schema: TInput;
  handler: ActionHandler<z.infer<TInput>, TOutput>;
}): (rawInput: unknown) => Promise<ActionState<TOutput>>
```

**How it works:**
1. Validates input with Zod schema
2. Executes handler with validated, typed input
3. Returns success with data or error with structured error info
4. Automatically catches and formats all errors

**Example:**
```typescript
// lib/actions/users.ts
'use server';

import { createAction } from '@/lib/actions';
import { createUserSchema } from '@/lib/validators/user';
import { db } from '@/db';
import { users } from '@/db/schema';

export const createUser = createAction({
  schema: createUserSchema,
  handler: async (input) => {
    // input is automatically typed from schema
    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        name: input.name,
        age: input.age,
      })
      .returning();

    // Return only what client needs (no sensitive data)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
});
```

### 2. Authenticated Action (createAuthenticatedAction)

For actions requiring a logged-in user. Automatically checks authentication and injects `userId` into handler.

**Function signature:** `lib/actions/create-action.ts:175`

```typescript
function createAuthenticatedAction<TInput extends z.ZodTypeAny, TOutput>(config: {
  schema: TInput;
  handler: ActionHandler<z.infer<TInput> & { userId: string }, TOutput>;
}): (rawInput: unknown) => Promise<ActionState<TOutput>>
```

**Example:**
```typescript
export const updateProfile = createAuthenticatedAction({
  schema: z.object({
    name: z.string().min(2),
    bio: z.string().max(500),
  }),
  handler: async ({ name, bio, userId }) => {
    // userId is automatically injected!
    await db
      .update(users)
      .set({ name, bio })
      .where(eq(users.id, userId));

    return { success: true };
  },
});
```

**Implementation Note:** Currently uses mock authentication (`lib/actions/create-action.ts:192`). Replace with actual auth logic (e.g., next-auth, clerk).

```typescript
// TODO: Replace with your authentication
const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
}
const userId = session.user.id;
```

### 3. Unsafe Action (createUnsafeAction)

For actions with no input validation. Use sparingly, only when:
- Action takes no input
- Validation handled elsewhere
- Maximum flexibility required

**Function signature:** `lib/actions/create-action.ts:226`

```typescript
function createUnsafeAction<TOutput>(
  handler: ActionHandler<void, TOutput>
): () => Promise<ActionState<TOutput>>
```

**Example:**
```typescript
export const getCurrentUser = createUnsafeAction(async () => {
  const session = await getServerSession();
  return session?.user ?? null;
});
```

## Validators (Zod Schemas)

### Location

All Zod schemas live in `lib/validators/`, organized by domain:

```
lib/validators/
├── user.ts       # User schemas (create, update, delete)
├── post.ts       # Post schemas
├── comment.ts    # Comment schemas
└── common.ts     # Shared schemas (pagination, search, ID formats)
```

### Conventions

**1. Naming:** Descriptive names ending with `Schema`

```typescript
createUserSchema, updateUserSchema, deleteUserSchema
```

**2. Export inferred types:** Always export TypeScript types for reuse

```typescript
// lib/validators/user.ts
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Must be 18 or older').optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

**3. User-friendly error messages:** Provide clear validation feedback

```typescript
email: z.string().email('Please enter a valid email address'),
name: z.string().min(2, 'Name must be at least 2 characters'),
age: z.number().min(18, 'You must be 18 or older'),
```

**4. Reuse common schemas:** Extract shared patterns to `common.ts`

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

**Location:** `lib/validators/common.ts:1`

### Complex Validation Examples

**Custom refinement:**
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

**Date range validation:**
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

**Location:** `lib/validators/common.ts:65`

**Schema composition:**
```typescript
// Compose multiple schemas
export const paginatedQuerySchema = paginationSchema
  .merge(sortingSchema)
  .merge(searchSchema);

// Extend existing schema
export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid(),
});
```

## Error Handling

### Automatic Error Handling

All errors thrown in action handlers are automatically caught and converted to structured `ActionState` errors.

**Implementation:** `lib/actions/create-action.ts:38`

```typescript
export function handleActionError(err: unknown): ActionState<never> {
  console.error("Action error:", err);

  if (err instanceof Error) {
    // Database unique constraint violations
    if (
      err.message.includes("unique constraint") ||
      err.message.includes("duplicate key")
    ) {
      return error(
        "A record with this information already exists",
        ActionErrorCode.CONFLICT,
      );
    }

    // Database foreign key violations
    if (err.message.includes("foreign key")) {
      return error(
        "Referenced record does not exist",
        ActionErrorCode.NOT_FOUND,
      );
    }

    return error(err.message, ActionErrorCode.INTERNAL_ERROR);
  }

  return error(
    "An unexpected error occurred",
    ActionErrorCode.INTERNAL_ERROR,
  );
}
```

### Custom Error Handling

**In handlers:**
```typescript
export const deleteUser = createAction({
  schema: z.object({ id: z.string() }),
  handler: async ({ id }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      // Will be caught and converted to ActionState error
      throw new Error('User not found');
    }

    await db.delete(users).where(eq(users.id, id));
    return { success: true };
  },
});
```

**Manual error handling (advanced):**
```typescript
import { handleActionError } from '@/lib/actions/create-action';

export async function myComplexAction(input: unknown) {
  try {
    // Your custom logic
    const result = await someOperation();
    return success(result);
  } catch (err) {
    // Reuse standardized error handling
    return handleActionError(err);
  }
}
```

### Client-Side Error Handling

**Basic:**
```typescript
const result = await createUser({ email, name });

if (!result.success) {
  setError(result.error.message);
  return;
}

// Success path
console.log(result.data);
```

**With error codes:**
```typescript
if (!result.success) {
  switch (result.error.code) {
    case 'VALIDATION_ERROR':
      setFieldErrors(result.error.fieldErrors);
      break;
    case 'UNAUTHORIZED':
      router.push('/login');
      break;
    case 'NOT_FOUND':
      toast.error('User not found');
      break;
    case 'CONFLICT':
      toast.error('Email already exists');
      break;
    default:
      toast.error(result.error.message);
  }
  return;
}
```

**With field-level errors:**
```typescript
const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();

const result = await createUser({ email, name });

if (!result.success) {
  if (result.error.code === 'VALIDATION_ERROR' && result.error.fieldErrors) {
    setFieldErrors(result.error.fieldErrors);
  } else {
    setError(result.error.message);
  }
  return;
}

// In JSX
{fieldErrors?.email && (
  <p className="text-red-500">{fieldErrors.email[0]}</p>
)}
```

## Action Implementation Patterns

### CRUD Operations

Group all CRUD operations for a domain in a single file:

```typescript
// lib/actions/users.ts
'use server';

import { createAction } from '@/lib/actions';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema
} from '@/lib/validators/user';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Create a new user
 */
export const createUser = createAction({
  schema: createUserSchema,
  handler: async (input) => {
    const [user] = await db.insert(users).values(input).returning();
    return { id: user.id, email: user.email, name: user.name };
  },
});

/**
 * Update an existing user
 */
export const updateUser = createAction({
  schema: updateUserSchema,
  handler: async (input) => {
    const [user] = await db
      .update(users)
      .set(input)
      .where(eq(users.id, input.id))
      .returning();

    if (!user) throw new Error('User not found');
    return { id: user.id, email: user.email, name: user.name };
  },
});

/**
 * Get a single user
 */
export const getUser = createAction({
  schema: getUserSchema,
  handler: async (input) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, input.id),
    });

    if (!user) throw new Error('User not found');
    return { id: user.id, email: user.email, name: user.name };
  },
});

/**
 * Delete a user
 */
export const deleteUser = createAction({
  schema: deleteUserSchema,
  handler: async (input) => {
    await db.delete(users).where(eq(users.id, input.id));
    return { success: true };
  },
});
```

### Pagination & Filtering

Use shared schemas for consistent pagination/filtering patterns:

```typescript
// lib/validators/common.ts
export const paginatedQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

// lib/actions/posts.ts
export const listPosts = createAction({
  schema: paginatedQuerySchema,
  handler: async ({ page, limit, sortBy, sortOrder, search }) => {
    const offset = (page - 1) * limit;

    const posts = await db.query.posts.findMany({
      limit,
      offset,
      orderBy: [posts[sortBy][sortOrder]],
      where: search ? like(posts.title, `%${search}%`) : undefined,
    });

    return { posts, page, limit };
  },
});
```

**Location:** `lib/validators/common.ts:41`

### Database Constraint Handling

Provide user-friendly messages for database constraints:

```typescript
export const createUser = createAction({
  schema: createUserSchema,
  handler: async (input) => {
    try {
      const [user] = await db.insert(users).values(input).returning();
      return { id: user.id, email: user.email };
    } catch (err) {
      // handleActionError automatically maps constraint violations
      // But you can add custom handling if needed
      if (err.message.includes('email_unique')) {
        throw new Error('This email is already registered');
      }
      throw err; // Re-throw for automatic handling
    }
  },
});
```

The `handleActionError` function automatically detects:
- Unique constraint violations → `CONFLICT` error code
- Foreign key violations → `NOT_FOUND` error code

**Implementation:** `lib/actions/create-action.ts:44`

### Complex Business Logic

For multi-step operations, wrap everything in the handler:

```typescript
export const publishPost = createAuthenticatedAction({
  schema: z.object({ postId: z.string().uuid() }),
  handler: async ({ postId, userId }) => {
    // 1. Verify ownership
    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.authorId, userId)),
    });

    if (!post) {
      throw new Error('Post not found or you do not have permission');
    }

    // 2. Check if already published
    if (post.published) {
      throw new Error('Post is already published');
    }

    // 3. Validate post content
    if (!post.content || post.content.length < 100) {
      throw new Error('Post content must be at least 100 characters');
    }

    // 4. Publish
    const [updatedPost] = await db
      .update(posts)
      .set({
        published: true,
        publishedAt: new Date(),
      })
      .where(eq(posts.id, postId))
      .returning();

    // 5. Trigger notifications (example)
    await notifySubscribers(updatedPost);

    return {
      id: updatedPost.id,
      publishedAt: updatedPost.publishedAt,
    };
  },
});
```

## Best Practices

### 1. Group by Feature

Keep all related actions in a single file for maintainability:

```
lib/actions/
├── users.ts      # createUser, updateUser, deleteUser, listUsers
├── posts.ts      # createPost, updatePost, deletePost, listPosts, publishPost
└── comments.ts   # createComment, updateComment, deleteComment
```

### 2. Use JSDoc Comments

Document each action's purpose and requirements:

```typescript
/**
 * Create a new user with email verification
 *
 * Sends a verification email after account creation.
 */
export const createUser = createAction({ ... });

/**
 * Update user profile (requires authentication)
 *
 * Only allows updating name and bio. Email changes require
 * separate verification flow.
 */
export const updateUserProfile = createAuthenticatedAction({ ... });
```

### 3. Return Only Necessary Data

Never expose sensitive fields or internal implementation details:

```typescript
// ❌ Bad - returns entire user object with password hash
return user;

// ✅ Good - returns only public fields
return {
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
};
```

### 4. Use Descriptive Names

Action names should clearly describe what they do:

```typescript
// ✅ Good
createUser, updateUserProfile, deleteUserAccount, publishBlogPost

// ❌ Bad
doUserThing, handleUser, userAction, process
```

### 5. Always Validate Input

Never trust client input - always use Zod schemas:

```typescript
// ❌ Bad - no validation, security risk
export async function updateUser(data: any) {
  await db.update(users).set(data).where(...);
}

// ✅ Good - validated with schema
export const updateUser = createAction({
  schema: updateUserSchema,
  handler: async (data) => {
    await db.update(users).set(data).where(...);
  },
});
```

### 6. Handle Database Errors Gracefully

Provide meaningful messages instead of exposing raw database errors:

```typescript
try {
  await db.insert(users).values(input);
} catch (err) {
  if (err.message.includes('unique constraint')) {
    throw new Error('Email already exists');
  }
  if (err.message.includes('foreign key')) {
    throw new Error('Referenced user does not exist');
  }
  throw err; // Let handleActionError handle unknown errors
}
```

### 7. Use Type Inference

Let TypeScript infer types from schemas instead of duplicating type definitions:

```typescript
// Define schema
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

// Export inferred type (for client-side usage)
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Handler automatically gets typed input
export const createUser = createAction({
  schema: createUserSchema,
  handler: async (input) => {
    // input is typed as { email: string; name: string }
    // No manual type annotations needed!
  },
});
```

## Advanced Patterns

### Optimistic Updates with Revalidation

Combine server actions with Next.js cache revalidation:

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';

export const createPost = createAuthenticatedAction({
  schema: createPostSchema,
  handler: async ({ title, content, userId }) => {
    const [post] = await db
      .insert(posts)
      .values({ title, content, authorId: userId })
      .returning();

    // Revalidate cached pages
    revalidatePath('/posts');
    revalidateTag('posts-list');

    return { id: post.id, title: post.title };
  },
});
```

### Transactions

Wrap multiple operations in a transaction:

```typescript
export const transferOwnership = createAuthenticatedAction({
  schema: z.object({
    postId: z.string().uuid(),
    newOwnerId: z.string().uuid(),
  }),
  handler: async ({ postId, newOwnerId, userId }) => {
    return await db.transaction(async (tx) => {
      // 1. Verify current ownership
      const post = await tx.query.posts.findFirst({
        where: and(eq(posts.id, postId), eq(posts.authorId, userId)),
      });

      if (!post) {
        throw new Error('Post not found or unauthorized');
      }

      // 2. Verify new owner exists
      const newOwner = await tx.query.users.findFirst({
        where: eq(users.id, newOwnerId),
      });

      if (!newOwner) {
        throw new Error('New owner does not exist');
      }

      // 3. Transfer ownership
      const [updatedPost] = await tx
        .update(posts)
        .set({ authorId: newOwnerId })
        .where(eq(posts.id, postId))
        .returning();

      // 4. Create audit log
      await tx.insert(auditLogs).values({
        action: 'transfer_ownership',
        postId,
        oldOwnerId: userId,
        newOwnerId,
      });

      return {
        id: updatedPost.id,
        newOwner: newOwnerId,
      };
    });
  },
});
```

### Partial Updates

Use Zod's `.partial()` for update schemas:

```typescript
// Create schema (all fields required)
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  age: z.number().min(18),
});

// Update schema (all fields optional, plus ID required)
const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid(),
});

export const updateUser = createAction({
  schema: updateUserSchema,
  handler: async ({ id, ...updates }) => {
    // Only provided fields are updated
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();

    return { id: user.id, ...updates };
  },
});
```

### Conditional Validation

Use Zod discriminated unions for different validation paths:

```typescript
const actionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('create'),
    email: z.string().email(),
    name: z.string(),
  }),
  z.object({
    type: z.literal('update'),
    id: z.string().uuid(),
    name: z.string().optional(),
  }),
  z.object({
    type: z.literal('delete'),
    id: z.string().uuid(),
  }),
]);

export const userAction = createAction({
  schema: actionSchema,
  handler: async (input) => {
    switch (input.type) {
      case 'create':
        return await db.insert(users).values(input).returning();
      case 'update':
        return await db.update(users).set(input).where(eq(users.id, input.id)).returning();
      case 'delete':
        return await db.delete(users).where(eq(users.id, input.id)).returning();
    }
  },
});
```

## Helper Functions

### Success Helper

Create successful `ActionState` responses:

```typescript
import { success } from '@/lib/actions';

export const getUser = createAction({
  schema: getUserSchema,
  handler: async (input) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, input.id),
    });

    // Explicitly return success (though createAction does this automatically)
    return success({ id: user.id, name: user.name });
  },
});
```

**Location:** `lib/actions/types.ts:86`

### Error Helper

Create error `ActionState` responses:

```typescript
import { error, ActionErrorCode } from '@/lib/actions';

export async function myComplexAction(input: unknown) {
  const user = await db.query.users.findFirst({ where: eq(users.id, input.id) });

  if (!user) {
    return error('User not found', ActionErrorCode.NOT_FOUND);
  }

  // Continue with logic...
}
```

**Location:** `lib/actions/types.ts:104`

## Testing Actions

### Unit Testing

Test actions by calling them with mock input:

```typescript
import { describe, it, expect } from 'vitest';
import { createUser } from '@/lib/actions/users';

describe('createUser', () => {
  it('should create user with valid input', async () => {
    const result = await createUser({
      email: 'test@example.com',
      name: 'Test User',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });

  it('should fail with invalid email', async () => {
    const result = await createUser({
      email: 'invalid-email',
      name: 'Test User',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.fieldErrors?.email).toBeDefined();
    }
  });

  it('should handle duplicate email', async () => {
    // Create user first time
    await createUser({ email: 'test@example.com', name: 'User 1' });

    // Try to create again
    const result = await createUser({
      email: 'test@example.com',
      name: 'User 2',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('CONFLICT');
    }
  });
});
```

### Integration Testing

Test actions with real database operations using test database:

```typescript
import { beforeEach, afterEach } from 'vitest';
import { db } from '@/db';

beforeEach(async () => {
  // Clean database before each test
  await db.delete(users);
});

afterEach(async () => {
  // Clean up after test
  await db.delete(users);
});
```

## Migration Guide

### From Direct API Routes

**Before (API route):**
```typescript
// app/api/users/route.ts
export async function POST(request: Request) {
  const body = await request.json();

  // Manual validation
  if (!body.email || !body.name) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const user = await db.insert(users).values(body);
    return Response.json(user);
  } catch (err) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}
```

**After (Server action):**
```typescript
// lib/actions/users.ts
'use server';

export const createUser = createAction({
  schema: z.object({
    email: z.string().email(),
    name: z.string().min(2),
  }),
  handler: async (input) => {
    const [user] = await db.insert(users).values(input).returning();
    return { id: user.id, email: user.email };
  },
});
```

**Benefits:**
- Automatic validation with Zod
- Type safety end-to-end
- Consistent error handling
- Less boilerplate
- Easier to test

## Quick Reference

### Action Creators

| Function | Use Case | Auth Required | Validation |
|----------|----------|---------------|------------|
| `createAction` | Standard mutations/queries | No | Yes (Zod) |
| `createAuthenticatedAction` | Requires logged-in user | Yes | Yes (Zod) |
| `createUnsafeAction` | No input validation needed | No | No |

**Location:** `lib/actions/create-action.ts`

### Helper Functions

| Function | Purpose | Location |
|----------|---------|----------|
| `success(data)` | Create success response | `lib/actions/types.ts:86` |
| `error(msg, code, fieldErrors?)` | Create error response | `lib/actions/types.ts:104` |
| `handleActionError(err)` | Centralized error handling | `lib/actions/create-action.ts:38` |

### Error Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| `VALIDATION_ERROR` | Input validation failed | Zod schema validation errors |
| `UNAUTHORIZED` | Not authenticated | User not logged in |
| `FORBIDDEN` | Lacks permission | User lacks required role/permission |
| `NOT_FOUND` | Resource doesn't exist | Database record not found |
| `DATABASE_ERROR` | Database operation failed | Generic DB errors |
| `INTERNAL_ERROR` | Server error | Catch-all for unexpected errors |
| `CONFLICT` | Constraint violated | Unique key, duplicate entry |

**Location:** `lib/actions/types.ts:51`

## Common Validators

Located in `lib/validators/common.ts`:

```typescript
// IDs
uuidSchema          // UUID format validation
idSchema            // Non-empty string ID

// Common fields
emailSchema         // Email validation
urlSchema           // URL validation
phoneSchema         // Phone number validation

// Pagination
paginationSchema    // page, limit
sortingSchema       // sortBy, sortOrder
searchSchema        // search term
paginatedQuerySchema // All of above combined

// Date ranges
dateRangeSchema     // startDate, endDate with validation
```

**Location:** `lib/validators/common.ts:1`

## Related Documentation

- `lib/actions/README.md` - Usage patterns and client integration
- Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Drizzle ORM: https://orm.drizzle.team/docs/overview
- Zod validation: https://zod.dev/
