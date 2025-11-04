# Server Actions

This directory contains utilities and patterns for creating type-safe Next.js server actions with automatic validation, error handling, and consistent return types.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [File Structure](#file-structure)
- [Creating Server Actions](#creating-server-actions)
- [Validators](#validators)
- [Usage in Client Components](#usage-in-client-components)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

All server actions in this project follow a consistent pattern:

1. **Input validation** via Zod schemas (defined in `lib/validators/`)
2. **Type-safe handlers** with automatic type inference
3. **Structured error handling** with discriminated unions
4. **Consistent return types** (`ActionState<T>`)

This ensures:
- Full type safety from client → validation → server → response
- Predictable error handling across the entire application
- Reduced boilerplate (no repetitive try-catch blocks)
- Better developer experience with TypeScript autocomplete

## Core Concepts

### ActionState<T>

All server actions return an `ActionState<T>` - a discriminated union that represents either success or failure:

```typescript
type ActionState<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };
```

This forces you to handle both cases on the client side, preventing runtime errors.

### ActionError

Structured error type with machine-readable error codes:

```typescript
type ActionError = {
  message: string;              // Human-readable error
  code: ActionErrorCode;        // For programmatic handling
  fieldErrors?: Record<string, string[]>; // Field-specific validation errors
};
```

### ActionErrorCode

Standard error codes for different failure scenarios:

- `VALIDATION_ERROR` - Input validation failed (Zod)
- `UNAUTHORIZED` - User not authenticated
- `FORBIDDEN` - User lacks permission
- `NOT_FOUND` - Resource doesn't exist
- `DATABASE_ERROR` - Database operation failed
- `INTERNAL_ERROR` - Generic server error
- `CONFLICT` - Business logic constraint violated (e.g., duplicate key)

## File Structure

```
lib/
├── actions/
│   ├── README.md           # This file
│   ├── types.ts            # Core types (ActionState, ActionError, etc.)
│   ├── create-action.ts    # Action creator utilities
│   ├── index.ts            # Re-exports all utilities
│   ├── users.ts            # All user-related actions
│   ├── posts.ts            # All post-related actions
│   ├── comments.ts         # All comment-related actions
│   └── auth.ts             # All auth-related actions
├── validators/
│   ├── user.ts             # User-related Zod schemas
│   ├── post.ts             # Post-related Zod schemas
│   └── common.ts           # Shared/reusable schemas
```

**Convention**: Group all actions for a feature in a single file in `lib/actions/` (e.g., `lib/actions/users.ts` contains all user CRUD operations).

## Creating Server Actions

### 1. Define Your Zod Schema

Create validators in `lib/validators/`:

```typescript
// lib/validators/user.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Must be 18 or older').optional(),
});

// Export the inferred type for reuse
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### 2. Create Server Actions

Group all related actions in a single file in `lib/actions/`:

```typescript
// lib/actions/users.ts
'use server';

import { createAction } from '@/lib/actions';
import { createUserSchema, updateUserSchema, deleteUserSchema } from '@/lib/validators/user';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Create a new user
 */
export const createUser = createAction({
  schema: createUserSchema,
  handler: async (input) => {
    // input is automatically typed from the schema!
    // No need for manual validation or type assertions

    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        name: input.name,
        age: input.age,
      })
      .returning();

    // Return only what the client needs
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
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
      .set({
        email: input.email,
        name: input.name,
        age: input.age,
      })
      .where(eq(users.id, input.id))
      .returning();

    if (!user) {
      throw new Error('User not found');
    }

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

## Validators

### Location

All Zod schemas live in `lib/validators/`, organized by domain:

```
lib/validators/
├── user.ts       # User schemas (create, update, delete)
├── post.ts       # Post schemas
├── comment.ts    # Comment schemas
└── common.ts     # Shared schemas (pagination, search, etc.)
```

### Conventions

1. **Naming**: Use descriptive names ending with `Schema`
   ```typescript
   createUserSchema, updateUserSchema, deleteUserSchema
   ```

2. **Export inferred types**: Always export the TypeScript type
   ```typescript
   export type CreateUserInput = z.infer<typeof createUserSchema>;
   ```

3. **Reuse common schemas**: Extract shared patterns to `common.ts`
   ```typescript
   // lib/validators/common.ts
   export const paginationSchema = z.object({
     page: z.number().min(1).default(1),
     limit: z.number().min(1).max(100).default(20),
   });
   ```

4. **Custom error messages**: Provide user-friendly messages
   ```typescript
   email: z.string().email('Please enter a valid email address'),
   ```

## Usage in Client Components

### Basic Usage

```typescript
'use client';

import { createUser } from '@/lib/actions/users';
import { useState } from 'react';

export function CreateUserForm() {
  const [error, setError] = useState<string>();

  async function handleSubmit(formData: FormData) {
    const result = await createUser({
      email: formData.get('email') as string,
      name: formData.get('name') as string,
    });

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    // Success! result.data is fully typed
    console.log('Created user:', result.data.id);
  }

  return (
    <form action={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      {/* form fields */}
    </form>
  );
}
```

### With Field-Level Errors

```typescript
const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();

async function handleSubmit(formData: FormData) {
  const result = await createUser({
    email: formData.get('email') as string,
    name: formData.get('name') as string,
  });

  if (!result.success) {
    // Check for validation errors
    if (result.error.code === 'VALIDATION_ERROR' && result.error.fieldErrors) {
      setFieldErrors(result.error.fieldErrors);
    } else {
      setError(result.error.message);
    }
    return;
  }

  // Success
}

// In JSX:
{fieldErrors?.email && (
  <p className="text-red-500">{fieldErrors.email[0]}</p>
)}
```

### With React Hook Form + Server Actions

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserInput } from '@/lib/validators/user';

export function CreateUserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(data: CreateUserInput) {
    const result = await createUser(data);

    if (!result.success) {
      // Handle server-side errors
      return;
    }

    // Success
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      {/* ... */}
    </form>
  );
}
```

## Error Handling

### Handling Different Error Codes

```typescript
const result = await updateUser({ id: '123', name: 'John' });

if (!result.success) {
  switch (result.error.code) {
    case 'VALIDATION_ERROR':
      // Show field-specific errors
      console.log(result.error.fieldErrors);
      break;

    case 'UNAUTHORIZED':
      // Redirect to login
      router.push('/login');
      break;

    case 'NOT_FOUND':
      // Show 404 message
      toast.error('User not found');
      break;

    case 'CONFLICT':
      // Handle duplicate/conflict
      toast.error('Email already exists');
      break;

    default:
      // Generic error
      toast.error(result.error.message);
  }
  return;
}

// Success path
console.log(result.data);
```

### Custom Error Handling in Actions

You can throw specific errors in your handler and they'll be caught:

```typescript
export const deleteUser = createAction({
  schema: z.object({ id: z.string() }),
  handler: async ({ id }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      // Will be caught and returned as ActionState error
      throw new Error('User not found');
    }

    await db.delete(users).where(eq(users.id, id));
    return { success: true };
  },
});
```

### Manual Error Handling with `handleActionError`

For advanced use cases where you need custom error handling logic outside of `createAction`, you can use the `handleActionError` utility directly:

```typescript
import { handleActionError } from '@/lib/actions/create-action';

export async function myComplexAction(input: unknown) {
  try {
    // Your custom logic here
    const result = await someOperation();
    return success(result);
  } catch (err) {
    // Reuse the standardized error handling
    return handleActionError(err);
  }
}
```

The `handleActionError` function automatically:
- Logs the error for debugging
- Maps database errors (unique constraints, foreign keys) to appropriate error codes
- Returns a properly formatted `ActionState` error
- Handles both `Error` instances and unknown error types

You can extend this function in `lib/actions/create-action.ts` to add custom error patterns specific to your application.

## Authentication

### Creating Authenticated Actions

Use `createAuthenticatedAction` for actions that require a logged-in user:

```typescript
import { createAuthenticatedAction } from '@/lib/actions/create-action';

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

### Implementing Authentication

**TODO**: Update `lib/actions/create-action.ts` with your auth logic:

```typescript
// Example with next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export function createAuthenticatedAction<...>(...) {
  return async (rawInput: unknown): Promise<ActionState<TOutput>> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return error('You must be logged in', ActionErrorCode.UNAUTHORIZED);
    }

    const userId = session.user.id;

    // Continue with validation and handler execution...
  };
}
```

## Best Practices

### 1. Group Actions by Feature

Keep all related actions in a single file for easier maintenance and discoverability:

```
lib/actions/
├── users.ts      # All user-related actions (create, update, delete, list)
├── posts.ts      # All post-related actions
├── comments.ts   # All comment-related actions
└── auth.ts       # All authentication actions
```

**Benefits:**
- Fewer files to navigate
- Related functionality stays together
- Easier to see all available actions for a feature
- Less import boilerplate

### 2. Use JSDoc Comments

Add descriptive comments above each action to document its purpose:

```typescript
/**
 * Create a new user with email verification
 */
export const createUser = createAction({ ... });

/**
 * Update user profile (requires authentication)
 */
export const updateUserProfile = createAction({ ... });
```

### 3. Return Only What's Needed

Don't expose sensitive data or unnecessary fields:

```typescript
// ❌ Bad - returns entire user object with password hash
return user;

// ✅ Good - returns only public fields
return {
  id: user.id,
  email: user.email,
  name: user.name,
};
```

### 4. Use Descriptive Names

Action names should clearly describe what they do:

```typescript
// ✅ Good
createUser, updateUserProfile, deleteUserAccount

// ❌ Bad
doUserThing, handleUser, userAction
```

### 5. Validate Everything

Never trust client input - always validate with Zod:

```typescript
// ❌ Bad - no validation
export async function updateUser(data: any) { ... }

// ✅ Good - validated with schema
export const updateUser = createAction({
  schema: updateUserSchema,
  handler: async (data) => { ... }
});
```

### 6. Handle Database Errors

Provide meaningful error messages for common DB failures:

```typescript
try {
  await db.insert(users).values(input);
} catch (err) {
  if (err.message.includes('unique constraint')) {
    throw new Error('Email already exists');
  }
  throw err;
}
```

## Examples

### Example: CRUD Operations

A complete CRUD example in a single file (`lib/actions/users.ts`):

```typescript
'use server';

import { createAction } from '@/lib/actions';
import { createUserSchema, updateUserSchema, getUserSchema, deleteUserSchema } from '@/lib/validators/user';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const createUser = createAction({
  schema: createUserSchema,
  handler: async (input) => {
    const [user] = await db.insert(users).values(input).returning();
    return { id: user.id, email: user.email, name: user.name };
  },
});

export const updateUser = createAction({
  schema: updateUserSchema,
  handler: async (input) => {
    const [user] = await db.update(users).set(input).where(eq(users.id, input.id)).returning();
    if (!user) throw new Error('User not found');
    return { id: user.id, email: user.email, name: user.name };
  },
});

export const getUser = createAction({
  schema: getUserSchema,
  handler: async (input) => {
    const user = await db.query.users.findFirst({ where: eq(users.id, input.id) });
    if (!user) throw new Error('User not found');
    return { id: user.id, email: user.email, name: user.name };
  },
});

export const deleteUser = createAction({
  schema: deleteUserSchema,
  handler: async (input) => {
    await db.delete(users).where(eq(users.id, input.id));
    return { success: true };
  },
});
```

### Example: Complex Validation

```typescript
// lib/validators/post.ts
export const createPostSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(10000),
  tags: z.array(z.string()).min(1).max(5),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
}).refine(
  (data) => {
    // Custom validation: if published, must have publishedAt
    if (data.published && !data.publishedAt) {
      return false;
    }
    return true;
  },
  {
    message: 'Published posts must have a publish date',
    path: ['publishedAt'],
  }
);
```

### Example: Pagination & Filtering

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

---

## Quick Reference

| Use Case | Function | Example |
|----------|----------|---------|
| Standard action | `createAction()` | User CRUD, data fetching |
| Authenticated action | `createAuthenticatedAction()` | Profile updates, private data |
| No validation | `createUnsafeAction()` | Public data, no input |
| Success response | `success(data)` | Return successful result |
| Error response | `error(msg, code)` | Return error |
| Manual error handling | `handleActionError(err)` | Custom actions, complex flows |

---

For questions or suggestions, consult the Next.js server actions documentation or the project maintainer.
