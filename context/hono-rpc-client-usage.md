---
title: "Hono RPC Client Usage"
description: "Conventions for consuming type-safe APIs with Hono RPC client"
---

# Hono RPC Client Usage

## Overview

This project uses Hono's RPC client (`hc`) to consume APIs with full end-to-end type safety. The client automatically infers request and response types from the server implementation, eliminating manual API contract definitions and providing compile-time type checking.

## Core Principles

### 1. Type-Safe API Calls

Import and use the configured `apiClient` for fully typed API calls with autocomplete.

### 2. No Manual Types

Request and response types are automatically inferred from the server - no manual type definitions needed.

### 3. Method Chaining

Use method chaining with `$get`, `$post`, `$put`, `$patch`, `$delete` for requests.

### 4. Automatic Validation

The server validates inputs with Zod - client gets type safety without runtime validation.

### 5. Type Extraction

Use `InferRequestType` and `InferResponseType` from `hono/client` to extract types for components and hooks.

## Client Setup

**File:** `lib/api/client.ts`

Pre-configured RPC client for the entire application.

```typescript
import { hc } from "hono/client";
import type { Api } from ".";

export const apiClient = hc<Api>(
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
    : "http://localhost:3000/api",
);
```

**Usage:** Import `apiClient` in any component or hook.

### Important: `.api` Prefix Required

Since the Hono app is exported from `lib/api/index.ts` with the variable name `api`, all routes must be accessed through `apiClient.api`:

```typescript
// ✓ Correct
apiClient.api.models.$get()

// ✗ Wrong - won't work
apiClient.models.$get()
```

This is because `hc<Api>()` creates a typed client that mirrors the structure of your API export.

## Basic Usage

### GET Request (List)

```typescript
import { apiClient, toQueryParams } from "@/lib/api/client";

// Simple list
const response = await apiClient.api.models.$get();
const data = await response.json();

// With query parameters
// Use toQueryParams helper to convert numbers/booleans to strings
const filters = { page: 1, limit: 20, search: "john", published: true };
const response = await apiClient.api.models.$get({
  query: toQueryParams(filters),
});
const data = await response.json();
```

### GET Request (Single Item)

```typescript
// Get by ID
const response = await apiClient.api.models[":id"].$get({
  param: { id: "uuid-here" },
});
const data = await response.json();
```

### POST Request (Create)

```typescript
// Create with JSON body
const response = await apiClient.api.models.$post({
  json: {
    name: "John Doe",
    gender: "male",
    dateOfBirth: new Date("1995-01-01"),
    published: false,
  },
});

if (response.ok) {
  const data = await response.json();
  console.log("Created:", data);
}
```

### PUT Request (Update)

```typescript
// Update by ID
const response = await apiClient.api.models[":id"].$put({
  param: { id: "uuid-here" },
  json: {
    name: "Jane Doe",
    published: true,
  },
});

if (response.ok) {
  const data = await response.json();
  console.log("Updated:", data);
}
```

### DELETE Request

```typescript
// Delete by ID
const response = await apiClient.api.models[":id"].$delete({
  param: { id: "uuid-here" },
});

if (response.ok) {
  const data = await response.json();
  console.log("Deleted:", data);
}
```

### PATCH Request (Partial Update)

```typescript
// Bulk update
const response = await apiClient.api.models["bulk-publish"].$patch({
  json: {
    ids: ["uuid-1", "uuid-2", "uuid-3"],
    published: true,
  },
});
```

## Advanced Patterns

### File Upload

**IMPORTANT:** Each field in the `form` object can only be `string` or `File`. All other types (numbers, booleans, objects) must be converted to strings.

```typescript
// Client - upload file using form property
const response = await apiClient.api.user.picture.$put({
  form: {
    file: new File([fileToUpload], filename, {
      type: fileToUpload.type,
    }),
  },
});

// With path parameters
const response = await apiClient.api.models[":id"]["profile-image"].$post({
  param: { id: modelId },
  form: {
    file: new File([fileToUpload], filename, {
      type: fileToUpload.type,
    }),
  },
});

// Form with multiple fields - convert non-string values
const response = await apiClient.api.models.$post({
  form: {
    file: new File([fileToUpload], filename, { type: fileToUpload.type }),
    name: "Model Name",              // string - OK
    age: "25",                        // number must be string
    published: "true",                // boolean must be string
    metadata: JSON.stringify(obj),    // object must be stringified
  },
});
```

### Custom Headers

```typescript
const response = await apiClient.api.models.$get({
  headers: {
    "X-Custom-Header": "value",
  },
});
```

### Request with Credentials

```typescript
const response = await apiClient.api.models.$get({
  credentials: "include", // Send cookies
});
```

### Error Handling

```typescript
const response = await apiClient.api.models[":id"].$get({
  param: { id: "uuid-here" },
});

if (!response.ok) {
  const error = await response.json();
  if (response.status === 404) {
    console.error("Not found:", error.error);
  } else if (response.status === 500) {
    console.error("Server error:", error.error);
  }
  return;
}

const data = await response.json();
```

## React Query Integration

For declarative data fetching patterns with React Query, see the dedicated context file:

**Context:** `context/react-query-hooks.md`

The React Query context covers:
- Creating query and mutation hooks with Hono RPC client
- Query key patterns that mirror API structure
- Cache invalidation strategies
- Type-safe hook patterns

## Common Workflows

### Workflow 1: Fetch List with Filters

1. Import `apiClient` from `lib/api/client.ts`
2. Call endpoint with `$get` method
3. Pass filters in `query` object
4. Check `response.ok` before parsing
5. Parse response with `response.json()`

### Workflow 2: Create New Resource

1. Import `apiClient` from `lib/api/client.ts`
2. Call endpoint with `$post` method
3. Pass data in `json` object
4. Check `response.ok` and `response.status`
5. Parse success/error response

### Workflow 3: Update Resource by ID

1. Import `apiClient` from `lib/api/client.ts`
2. Call endpoint with `$put` or `$patch` method
3. Pass ID in `param` object
4. Pass updates in `json` object
5. Handle success/error responses

### Workflow 4: Delete Resource by ID

1. Import `apiClient` from `lib/api/client.ts`
2. Call endpoint with `$delete` method
3. Pass ID in `param` object
4. Check `response.ok` status
5. Handle success/error responses

### Workflow 5: Use with React Query

1. See `context/react-query-hooks.md` for hook patterns
2. Import `apiClient` in hook's `queryFn`
3. Call endpoint with type-safe parameters
4. Handle response with `response.ok` check
5. Parse with `response.json()` for typed data

## Type Inference

### Automatic Type Inference

No manual types needed - TypeScript infers everything:

```typescript
// Request types inferred from validators
const response = await apiClient.api.models.$post({
  json: {
    name: "Test", // ✓ string required
    gender: "male", // ✓ enum: "male" | "female"
    published: true, // ✓ boolean optional
    // invalid: "field", // ✗ TypeScript error
  },
});

// Response types inferred from handler
const data = await response.json();
data.id; // ✓ string
data.name; // ✓ string
data.createdAt; // ✓ Date
```

### Query Parameter Types

**IMPORTANT:** Query parameters only support `string | string[] | undefined`. Convert numbers and booleans to strings.

```typescript
// Manual conversion (verbose)
await apiClient.api.models.$get({
  query: {
    page: "1",           // Must be string (server converts with z.coerce.number())
    limit: "20",         // Must be string (server converts with z.coerce.number())
    search: "john",      // Already string
    published: "true",   // Must be string (server converts with z.coerce.boolean())
  },
});
```

**Use the helper function for automatic conversion:**

```typescript
import { apiClient, toQueryParams } from "@/lib/api/client";

// Automatically converts all values to strings
const filters = { page: 1, limit: 20, published: true, search: "john" };
await apiClient.api.models.$get({
  query: toQueryParams(filters),
});
```

**Helper:** `toQueryParams()` from `@/lib/api/client`

### Path Parameter Types

```typescript
// Path parameters with validation
await apiClient.api.models[":id"].$get({
  param: {
    id: "uuid-string", // ✓ string (validated as UUID on server)
  },
});
```

## Extracting Types from RPC Client

Use Hono's type utilities to extract request and response types from the RPC client for components and hooks.

### Import Type Utilities

```typescript
import type { InferRequestType, InferResponseType } from "hono/client";
import { apiClient } from "@/lib/api/client";
```

### Extract Response Types

**IMPORTANT:** Always specify the status code (typically `200`) as the second parameter to `InferResponseType` for correct type inference.

```typescript
// Extract response type from GET endpoint - MUST include status code
type User = InferResponseType<typeof apiClient.api.users[":id"]["$get"], 200>;
type UserList = InferResponseType<typeof apiClient.api.users["$get"], 200>;

// Use in component props
interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
}
```

### Extract Request Types

```typescript
// Extract request body type
type CreateUserInput = InferRequestType<typeof apiClient.api.users["$post"]>["json"];

// Extract query parameters type
type UserFilters = InferRequestType<typeof apiClient.api.users["$get"]>["query"];

// Extract path parameters type
type UserParams = InferRequestType<typeof apiClient.api.users[":id"]["$get"]>["param"];
```

### Common Use Cases

**Component props receiving API data:**

```typescript
type Model = InferResponseType<typeof apiClient.api.models[":id"]["$get"], 200>;

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <div>
      <h2>{model.name}</h2>
      <p>{model.description}</p>
    </div>
  );
}
```

**Hook return types:**

```typescript
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";

type ModelList = InferResponseType<typeof apiClient.api.models["$get"], 200>;

export function useModels(): UseQueryResult<ModelList> {
  return useQuery({
    queryKey: ["/api/models"],
    queryFn: async () => {
      const response = await apiClient.api.models.$get();
      if (!response.ok) throw new Error("Failed to fetch models");
      return response.json();
    },
  });
}
```

**Form inputs matching API contracts:**

```typescript
type CreateModelInput = InferRequestType<typeof apiClient.api.models["$post"]>["json"];

interface CreateModelFormProps {
  onSubmit: (data: CreateModelInput) => void;
}

export function CreateModelForm({ onSubmit }: CreateModelFormProps) {
  // Form implementation using CreateModelInput type
}
```

**Mutation hook input types:**

```typescript
import { useMutation } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";

type UpdateModelInput = InferRequestType<typeof apiClient.api.models[":id"]["$put"]>["json"];

export function useUpdateModel() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateModelInput }) => {
      const response = await apiClient.api.models[":id"].$put({
        param: { id },
        json: data,
      });
      if (!response.ok) throw new Error("Failed to update model");
      return response.json();
    },
  });
}
```

### Type Extraction Guidelines

**DO:**

1. **Always include status code** - Use `InferResponseType<..., 200>` with explicit status code (typically `200`)
2. **Extract response types for components** - Use `InferResponseType` for component props receiving API data
3. **Extract request body types** - Use `InferRequestType<...>["json"]` for request body types
4. **Extract query parameter types** - Use `InferRequestType<...>["query"]` for query parameter types
5. **Extract path parameter types** - Use `InferRequestType<...>["param"]` for path parameter types
6. **Extract inline where needed** - Type extraction happens at point of use, not in central type files

**DON'T:**

1. **Don't omit status code** - Always specify the second parameter (e.g., `200`) for `InferResponseType`
2. **Don't manually define API response types** - Use `InferResponseType` instead
3. **Don't re-export inferred types** - Extract types inline at point of use
4. **Don't forget nested property access** - Must use `["json"]`, `["query"]`, or `["param"]` for request types
5. **Don't extract from partial paths** - Always extract from complete endpoint path (e.g., `apiClient.api.users[":id"]["$get"]`)

## Guidelines

### DO

1. **Use `apiClient.api` prefix** - Access routes via `apiClient.api.models`, not `apiClient.models`
2. **Use `toQueryParams()` helper** - Import from `@/lib/api/client` to convert query parameters
3. **Check response.ok** - Always verify response status before parsing
4. **Parse responses** - Use `response.json()` to get typed data
5. **Handle errors** - Check `response.status` and parse error messages
6. **Use with React Query** - Wrap in hooks for declarative data fetching (see `context/react-query-hooks.md`)
7. **Trust type inference** - Let TypeScript guide you with autocomplete
8. **Extract types with utilities** - Use `InferResponseType` and `InferRequestType` for API-dependent components and hooks

### DON'T

1. **Don't forget `.api` prefix** - `apiClient.models` is wrong, use `apiClient.api.models`
2. **Don't pass numbers/booleans in query** - Use `toQueryParams()` from `@/lib/api/client`
3. **Don't define manual types** - Use `InferResponseType` and `InferRequestType` instead
4. **Don't skip error handling** - Always check `response.ok`
5. **Don't call directly in components** - Use React Query hooks instead (see `context/react-query-hooks.md`)
6. **Don't forget to parse** - Call `response.json()` to get data
7. **Don't ignore status codes** - Different errors need different handling

## Error Handling Patterns

### Check Status Code

```typescript
const response = await apiClient.api.models[":id"].$get({
  param: { id },
});

if (response.status === 404) {
  return { error: "Model not found" };
}

if (response.status === 500) {
  return { error: "Server error" };
}

if (!response.ok) {
  return { error: "Unknown error" };
}

return response.json();
```

### Parse Error Response

```typescript
try {
  const response = await apiClient.api.models.$post({ json: data });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  return response.json();
} catch (error) {
  console.error("API error:", error);
  throw error;
}
```

### Validation Errors

```typescript
const response = await apiClient.api.models.$post({ json: data });

if (response.status === 400) {
  const error = await response.json();

  if (error.fieldErrors) {
    // Display field-specific errors
    Object.entries(error.fieldErrors).forEach(([field, errors]) => {
      console.error(`${field}:`, errors);
    });
  }
}
```

## Benefits

- **Full type safety** - Request and response types inferred automatically
- **Autocomplete** - IDE suggests available endpoints and parameters
- **Compile-time checks** - TypeScript catches API mismatches
- **No manual contracts** - Types stay in sync with server implementation
- **Declarative data fetching** - Combine with React Query for powerful caching
- **Error handling** - Typed error responses with status codes
- **Developer experience** - Refactoring updates both server and client

## Related Patterns

- **React Query Hooks**: `context/react-query-hooks.md` (wrapping RPC client in hooks for declarative data fetching)
- **RPC API Development**: `context/hono-rpc-api-development.md` (building type-safe APIs)
- **API Organization**: `context/api-organization.md` (API file structure and routing)
