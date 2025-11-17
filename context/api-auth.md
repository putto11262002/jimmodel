---
title: "API Authentication Pattern"
description: "Conventions for protecting Hono API routes with session-based authentication using isAuth middleware."
---

# API Authentication Pattern

## Overview

This pattern defines how to protect API routes in the Hono API layer. Authentication is handled globally via middleware that populates context, and route-level authorization is enforced using the `isAuth` middleware. The underlying auth implementation is abstracted away from API route handlers.

## Core Principles

### 1. Global Auth Middleware

Auth middleware runs on all API routes, making user and session available in context.

**Implementation:** `lib/api/index.ts:8`

### 2. Route-Level Protection

Protected routes use `isAuth` middleware in the route chain to enforce authentication.

### 3. Abstracted Implementation

Route handlers access `c.var.user` and `c.var.session` without knowing the underlying auth system.

## Protected Route Pattern

**File:** `lib/api/<feature>/routes.ts`

Import the middleware:

```typescript
import { isAuth } from "@/lib/api/middlewares/auth";
```

Apply middleware to protected routes:

```typescript
export const featureRoutes = new Hono()
  .post("/", isAuth, zValidator("json", createSchema), async (c) => {
    // User is authenticated - c.var.user and c.var.session are guaranteed to exist
    const data = c.req.valid("json");
    const result = await featureService.create(data);
    return c.json(result, 201);
  })
  .get("/public", async (c) => {
    // Public route - no isAuth middleware
    return c.json({ message: "Public endpoint" }, 200);
  });
```

**Implementation:** `lib/api/models/routes.ts:38`, `lib/api/form-submissions/routes.ts:24`

## Auth Context Variables

Available in all route handlers via Hono context:

- `c.var.user` - Current authenticated user (or `null` if not authenticated)
- `c.var.session` - Current session (or `null` if not authenticated)

**Type definitions:** `lib/auth/index.ts:52`

```typescript
.get("/profile", isAuth, async (c) => {
  const user = c.var.user; // Type-safe, guaranteed non-null after isAuth
  const session = c.var.session; // Type-safe session object
  return c.json({ name: user.name, email: user.email }, 200);
});
```

## Middleware Definitions

**File:** `lib/api/middlewares/auth.ts`

Two middlewares are exported:

1. **`authMiddleware`** - Applied globally in `lib/api/index.ts`, populates `c.var.user` and `c.var.session` (non-blocking)
2. **`isAuth`** - Applied per-route, returns 401 if user not authenticated (blocks execution)

**Reference:** [Hono custom middleware guide](https://hono.dev/docs/guides/middleware#custom-middleware)

## Common Workflows

### Workflow 1: Protect Single Route

1. Import `isAuth` from `@/lib/api/middlewares/auth`
2. Add `isAuth` middleware to route chain after HTTP method, before validators
3. Access authenticated user via `c.var.user` (guaranteed non-null)

### Workflow 2: Protect Multiple Routes

1. Import `isAuth` once at top of routes file
2. Add middleware to each protected route's chain
3. Leave public routes without `isAuth` middleware

### Workflow 3: Mix Protected and Public Routes

1. Apply `isAuth` only to routes requiring authentication
2. Public routes omit the middleware
3. Both can coexist in same route file

## Guidelines

### DO

1. **Chain middleware correctly** - Place `isAuth` after HTTP method, before validators: `.post("/", isAuth, zValidator(...), handler)`
2. **Trust context after isAuth** - User and session are guaranteed non-null in protected handlers
3. **Access context variables** - Use `c.var.user` and `c.var.session` for auth data
4. **Leave public routes unprotected** - Omit `isAuth` for endpoints that don't require auth

### DON'T

1. **Don't call auth APIs directly** - Use `isAuth` middleware, not auth system internals
2. **Don't check for null after isAuth** - Middleware guarantees user exists
3. **Don't modify authMiddleware** - Global middleware is applied in `lib/api/index.ts`
4. **Don't manually return 401** - Middleware handles unauthorized responses

## Error Response

Unauthorized requests return:

```json
{
  "error": "Unauthorized"
}
```

Status code: `401`

Maintains RPC type inference compatibility.

**See:** `context/hono-rpc-api-development.md` for error response patterns

## Middleware Order

Correct middleware chaining order:

```typescript
.post(
  "/endpoint",
  isAuth,                          // 1. Auth check (optional)
  zValidator("json", schema),      // 2. Request validation
  async (c) => { /* handler */ }   // 3. Route logic
)
```

With multiple validators:

```typescript
.patch(
  "/:id",
  isAuth,
  zValidator("param", paramSchema),
  zValidator("json", bodySchema),
  async (c) => { /* handler */ }
)
```

**Implementation:** `lib/api/form-submissions/routes.ts:84-88`

## Type References

- **User and Session types**: `lib/auth/index.ts:52` (exports `AuthSession` type)
- **Auth middleware**: `lib/api/middlewares/auth.ts:43` (`authMiddleware`), `lib/api/middlewares/auth.ts:74` (`isAuth`)
- **Context variables**: Inferred from Better Auth configuration

## Benefits

- Clean separation between auth system and API routes
- Type-safe access to user and session data
- Consistent authorization pattern across all routes
- RPC-compatible JSON error responses
- Easy to identify protected vs public endpoints
- Middleware enforces auth automatically, no manual checks needed

## Related Patterns

- **API Organization**: `context/api-organization.md` (route structure and mounting)
- **Hono RPC API Development**: `context/hono-rpc-api-development.md` (error responses, status codes)
