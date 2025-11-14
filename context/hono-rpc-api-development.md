---
title: "Hono RPC API Development"
description: "Conventions for building type-safe APIs with Hono RPC"
---

# Hono RPC API Development

## Overview

This project uses Hono with RPC (Remote Procedure Call) pattern to build type-safe REST APIs. The API layer provides end-to-end type safety from server to client through TypeScript type inference, eliminating manual API contract definitions.

## Core Principles

### 1. Type Export Required

Export the API type (`Api`) from `lib/api/index.ts` to enable RPC client type inference.

### 2. Explicit Status Codes

Return JSON responses with explicit status codes for proper type inference (avoid `c.notFound()`).

### 3. Structured Error Responses

Always return JSON error objects with status codes instead of throwing or using Hono error helpers.

## RPC Type Export

**File:** `lib/api/index.ts`

The critical requirement for RPC is exporting the API type.

```typescript
import { Hono } from 'hono'
import { modelRoutes } from './models/routes'

// Create and mount routes using method chaining
// See context/api-organization.md for file structure and mounting patterns
export const api = new Hono()
  .basePath('/api')
  .route('/models', modelRoutes)

// REQUIRED: Export type for RPC client
export type Api = typeof api
```

**Key requirement:** Export `type Api = typeof api` to enable client-side type inference.

**See:** `context/api-organization.md` for details on file structure, route mounting, and method chaining patterns.

## RPC Route Implementation

Routes must return explicit JSON responses with status codes for proper RPC type inference.

**Note:** Use method chaining for route definitions (see `context/api-organization.md`).

### Standard CRUD Pattern

```typescript
// GET by ID - explicit status codes for type discrimination
export const featureRoutes = new Hono()
  .get("/:id", zValidator("param", z.object({ id: z.string().uuid() })), async (c) => {
    try {
      const { id } = c.req.valid("param");
      const result = await featureService.get({ id });
      return c.json(result, 200);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get item";
      if (message === "Item not found") {
        return c.json({ error: message }, 404);
      }
      return c.json({ error: message }, 500);
    }
  })
```

**Implementation:** `lib/api/models/routes.ts`

### Multiple Validators

Chain validators for complex routes:

```typescript
export const featureRoutes = new Hono()
  .put(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    zValidator("json", updateSchema.omit({ id: true })),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      const result = await featureService.update({ id, ...data });
      return c.json(result, 200);
    }
  )
```

## Common Workflows

### Workflow 1: Add RPC-Compatible Route

1. Define validator schema in `lib/api/<feature>/validators.ts`
2. Add route using method chaining: `.get(...).post(...)`
3. Use `zValidator` middleware for request validation
4. Call core service function from `lib/core/<domain>/service.ts`
5. Return `c.json(data, statusCode)` with explicit status (required for RPC)
6. Handle errors with JSON responses and status codes
7. Never use `c.notFound()` - use `c.json({ error: "..." }, 404)`

**See:** `context/api-organization.md` for file organization and route mounting

### Workflow 2: Add File Upload Endpoint with RPC

1. Define validator schema with `z.instanceof(File)` in `lib/api/<feature>/validators.ts`
2. Use `zValidator('form', schema)` middleware for form data validation
3. Access validated file with `c.req.valid('form')`
4. Process file and call service function
5. Return `c.json(data, statusCode)` with explicit status
6. Handle errors with JSON responses and status codes

**Example:**

```typescript
// Server - define route with zValidator('form', ...)
export const userRoutes = new Hono()
  .put(
    '/user/picture',
    zValidator(
      'form',
      z.object({
        file: z.instanceof(File),
      })
    ),
    async (c) => {
      try {
        const { file } = c.req.valid('form');
        // Process file upload
        const result = await uploadService.upload(file);
        return c.json(result, 200);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        return c.json({ error: message }, 500);
      }
    }
  )

// Form with multiple fields - use z.coerce for type conversion
export const modelRoutes = new Hono()
  .post(
    '/',
    zValidator(
      'form',
      z.object({
        file: z.instanceof(File),
        name: z.string(),
        age: z.coerce.number(),        // Convert string to number
        published: z.coerce.boolean(), // Convert string to boolean
        metadata: z.string().transform((str) => JSON.parse(str)), // Parse JSON
      })
    ),
    async (c) => {
      const { file, name, age, published, metadata } = c.req.valid('form');
      // All fields properly typed: file is File, age is number, published is boolean, etc.
      // ...
    }
  )
```

**Note:** Client sends all form fields as `string` or `File`. Use `z.coerce` on server to convert strings back to their intended types.

## Guidelines

### DO

1. **Export Api type** - Always export `type Api = typeof api` from `lib/api/index.ts`
2. **Use explicit status codes** - Return `c.json(data, statusCode)` for proper type inference
3. **Return JSON for all errors** - Use `c.json({ error: "..." }, statusCode)` consistently
4. **Map specific errors** - Return 404 for "not found", 400 for validation, 500 for server errors
5. **Handle errors in try-catch** - Catch all errors and return structured JSON responses

### DON'T

1. **Don't use `c.notFound()`** - Breaks RPC type inference; use `c.json({ error: "Not found" }, 404)`
2. **Don't throw errors** - Always catch and return JSON with status codes
3. **Don't forget type export** - RPC client requires `export type Api = typeof api`
4. **Don't omit status codes** - Always provide explicit status for type discrimination
5. **Don't use Hono error helpers** - Use `c.json()` with explicit status codes instead

## Response Patterns

### Success Response

```typescript
return c.json({ id: "123", name: "Example" }, 200);
```

### Created Response

```typescript
return c.json(result, 201);
```

### Error Response (Not Found)

```typescript
if (message === "Item not found") {
  return c.json({ error: message }, 404);
}
```

### Error Response (Validation)

```typescript
if (!parseResult.success) {
  const fieldErrors = parseResult.error.flatten().fieldErrors;
  return c.json({ error: "Validation failed", fieldErrors }, 400);
}
```

### Error Response (Server Error)

```typescript
catch (err) {
  const message = err instanceof Error ? err.message : "Failed to perform action";
  return c.json({ error: message }, 500);
}
```

## RPC Type Inference

### Status Code Discrimination

Explicit status codes enable discriminated union types on the client:

```typescript
// Server returns different status codes
if (notFound) {
  return c.json({ error: "Not found" }, 404);
}
return c.json({ id: "123", name: "Item" }, 200);

// Client can discriminate by status
const res = await client.items[":id"].$get({ param: { id } });
if (res.status === 404) {
  const error = await res.json(); // Type: { error: string }
}
if (res.ok) {
  const data = await res.json(); // Type: { id: string, name: string }
}
```

## Benefits

- **End-to-end type safety** - Request/response types inferred automatically in client
- **No manual contracts** - Types derived from server implementation
- **Status-based discrimination** - Client can handle different responses by status code
- **Compile-time checks** - TypeScript catches API mismatches before runtime
- **IDE autocomplete** - Client gets full suggestions for endpoints and types

## Related Patterns

- **API Organization**: `context/api-organization.md` (file structure, validators, mounting routes)
- **RPC Client Usage**: `context/hono-rpc-client-usage.md` (consuming APIs from frontend)
