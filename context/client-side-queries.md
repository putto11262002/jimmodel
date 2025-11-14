---
title: "Client-Side Queries"
description: "Pattern for implementing client-side data fetching in Client Components using React Query with Hono RPC client, skeleton loading states, and cache management."
---

# Client-Side Queries

## Overview

This pattern defines the complete workflow for implementing client-side data fetching (list, detail, filtered queries) in Client Components using React Query with Hono RPC client. Unlike Server Components which fetch on the server, these queries run in the browser, call API endpoints via Hono RPC client, and manage cache with React Query. Queries display skeleton loading states and automatically refetch when data becomes stale.

## Core Principles

### 1. Type-Safe Queries with Hono RPC

Use `apiClient` from Hono RPC for fully typed API calls with automatic request/response inference.

**See:** `context/hono-rpc-client-usage.md` for RPC client patterns

### 2. React Query for Data Fetching

Wrap API calls in React Query's `useQuery` for declarative data fetching with automatic caching, refetching, and state management (`isLoading`, `isFetching`, `error`, `data`).

**See:** `context/react-query-hooks.md` for hook organization and query key patterns

### 3. Loading State UX Pattern

All queries must provide clear, consistent loading feedback using skeleton components.

**Loading states (during query):**
- Show skeleton component that matches final UI structure
- Skeleton maintains layout stability during initial load
- Optional: show subtle indicator during background refetch

**Error handling:**
- Display clear error message if query fails
- Provide retry option when appropriate
- Show empty state when no data

**See:** `context/loading-states-pattern.md` for complete loading state UX patterns

### 4. Query Key Structure

Query keys mirror API route structure for hierarchical cache management and predictable invalidation.

**Pattern:** `['/api/<resource>', filters?]`

**See:** `context/react-query-hooks.md` for query key conventions

### 5. Automatic Cache Management

React Query automatically:
- Caches query results
- Refetches when data becomes stale
- Deduplicates identical requests
- Garbage collects unused cache entries

Configure `staleTime` based on data volatility.

## Query Hook Pattern

### File Organization

**Location:** `hooks/queries/<feature>/use-<feature>s.ts` (list) or `use-<feature>.ts` (detail)

**Naming conventions:**
- List: `use-<feature>s.ts` (plural)
- Detail: `use-<feature>.ts` (singular)
- Filtered: `use-<feature>s.ts` with options parameter
- Nested: `use-<parent>-<child>s.ts`

**See:** `context/component-organization.md` for file placement rules

### Standard Query Hook Template

```typescript
// hooks/queries/models/use-models.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface UseModelsOptions {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  category?: string;
  published?: boolean;
}

export function useModels(options?: UseModelsOptions) {
  const queryKey = options
    ? ["/api/models", options]
    : ["/api/models"];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.models.$get({
        query: options,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch models");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

**Key components:**
- `queryKey` - Unique identifier matching API route structure
- `queryFn` - Async function calling `apiClient`
- Error handling - Check `response.ok`, throw with message
- Type inference - Return type automatically inferred from API
- `staleTime` - How long data stays fresh (configure per use case)

### Typing Query Hook Return Values

Use `InferResponseType` to explicitly type the data returned from query hooks:

```typescript
// hooks/queries/models/use-models.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { apiClient } from "@/lib/api/client";

type ModelsResponse = InferResponseType<typeof apiClient.api.models["$get"], 200>;

interface UseModelsOptions {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  category?: string;
  published?: boolean;
}

export function useModels(options?: UseModelsOptions): UseQueryResult<ModelsResponse> {
  const queryKey = options
    ? ["/api/models", options]
    : ["/api/models"];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.api.models.$get({
        query: options,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch models");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
```

**Key points:**
- **IMPORTANT:** Extract response type with `InferResponseType<typeof apiClient.api.models["$get"], 200>` - **MUST include status code**
- Type the hook return value with `UseQueryResult<ModelsResponse>`
- TypeScript automatically infers return type in `queryFn` from `response.json()`
- Explicit typing improves IDE autocomplete when using the hook

### Detail Query Hook Pattern

```typescript
// hooks/queries/models/use-model.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { apiClient } from "@/lib/api/client";

type ModelResponse = InferResponseType<typeof apiClient.api.models[":id"]["$get"], 200>;

export function useModel(id: string | undefined): UseQueryResult<ModelResponse> {
  return useQuery({
    queryKey: ["/api/models", id!],
    queryFn: async () => {
      const response = await apiClient.api.models[":id"].$get({
        param: { id: id! },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch model");
      }

      return response.json();
    },
    enabled: !!id, // Only run query when ID exists
    staleTime: 1000 * 60 * 5,
  });
}
```

**Pattern for detail queries:**
- **IMPORTANT:** Extract response type with `InferResponseType<typeof apiClient.api.models[":id"]["$get"], 200>` - **MUST include status code**
- Accept ID parameter (typed as `string | undefined`)
- Use `enabled: !!id` to prevent running without ID
- Query key: `['/api/<resource>', id]`
- Path parameter: `[":id"].$get({ param: { id } })`

### Filtered List Query Pattern

```typescript
// hooks/queries/models/use-models.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface UseModelsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  published?: boolean;
}

export function useModels(options?: UseModelsOptions) {
  const queryKey = options
    ? ["/api/models", options]
    : ["/api/models"];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.models.$get({
        query: options,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch models");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
```

**Pattern for filtered lists:**
- Accept options object with filter parameters
- Include filters in query key for separate caching
- Pass options as `query` parameter to API client
- Each unique filter combination gets its own cache entry

### Nested Resource Query Pattern

```typescript
// hooks/queries/models/use-model-images.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useModelImages(modelId: string | undefined) {
  return useQuery({
    queryKey: ["/api/models", modelId!, "images"],
    queryFn: async () => {
      const response = await apiClient.models[":id"].images.$get({
        param: { id: modelId! },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch images");
      }

      return response.json();
    },
    enabled: !!modelId,
    staleTime: 1000 * 60 * 2, // Shorter stale time for nested resources
  });
}
```

**Pattern for nested resources:**
- Query key: `['/api/<parent>', parentId, '<child>']`
- Use `enabled: !!parentId` to prevent running without parent ID
- Shorter stale time for frequently changing nested data

## Component Integration

### Understanding isPending vs Data State

**IMPORTANT**: `isPending === false` does NOT guarantee `data !== undefined`.

React Query can have `isPending: false` while `data` is still `undefined` in cases like:
- Query is disabled (`enabled: false`)
- Query has not run yet
- Query failed and has no cached data

**Correct pattern - Check both:**
```typescript
if (isPending || !data) {
  return <ComponentSkeleton />;
}
```

**Incorrect pattern:**
```typescript
// ❌ WRONG - data might still be undefined
if (isPending) {
  return <ComponentSkeleton />;
}
```

**Why this matters:** Rendering components with `undefined` data causes runtime errors.

### Basic List Component

```typescript
"use client";

import { useModels } from "@/hooks/queries/models/use-models";
import { ModelsTable } from "./_components/models-table";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ModelsPage() {
  const { data, isPending, error } = useModels();

  // Show skeleton during loading OR if data not available
  if (isPending || !data) {
    return <ModelsTableSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load models: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Show data
  return <ModelsTable data={data} />;
}
```

**Component pattern:**
1. Import and call query hook
2. Check `isPending || !data` → show skeleton
3. Check `error` → show error message
4. Render data

### Filtered List Component

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { useModels } from "@/hooks/queries/models/use-models";
import { ModelsTable } from "./_components/models-table";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";

export function ModelsPage() {
  const searchParams = useSearchParams();

  // Parse filters from URL
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const category = searchParams.get("category") || undefined;
  const published = searchParams.get("published")
    ? searchParams.get("published") === "true"
    : undefined;

  // Fetch with filters
  const { data, isPending, error } = useModels({
    page,
    limit,
    category,
    published,
  });

  if (isPending || !data) {
    return <ModelsTableSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <ModelsTable data={data} />;
}
```

**Filtered list pattern:**
- Parse filters from URL search params
- Pass filters to query hook
- React Query creates separate cache entry for each filter combination
- Changing filters triggers new query automatically

### Detail Component with Loading States

```typescript
"use client";

import { useModel } from "@/hooks/queries/models/use-model";
import { ModelForm } from "./_components/model-form";
import { ModelFormSkeleton } from "./_components/model-form-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ModelDetailProps {
  id: string;
}

export function ModelDetail({ id }: ModelDetailProps) {
  const { data, isPending, error, refetch } = useModel(id);

  if (isPending || !data) {
    return <ModelFormSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error.message}
        </AlertDescription>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Retry
        </Button>
      </Alert>
    );
  }

  return <ModelForm model={data} />;
}
```

**Detail component pattern:**
- Accept ID as prop or from params
- Pass ID to query hook
- Provide retry button in error state
- Use `refetch()` to manually trigger refetch

### Background Refetch Indicator (Optional)

```typescript
"use client";

import { useModels } from "@/hooks/queries/models/use-models";
import { ModelsTable } from "./_components/models-table";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";
import { Loader2 } from "lucide-react";

export function ModelsPage() {
  const { data, isPending, isFetching, error } = useModels();

  if (isPending || !data) {
    return <ModelsTableSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Optional refetch indicator */}
      {isFetching && !isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Updating...</span>
        </div>
      )}

      <ModelsTable data={data} />
    </div>
  );
}
```

**Background refetch pattern:**
- Check `isFetching && !isPending` for background updates
- Show subtle indicator above/beside content
- Keep existing content visible during refetch
- Optional - only use for important data

## Pagination Pattern

### URL-Based Pagination

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useModels } from "@/hooks/queries/models/use-models";
import { ModelsTable } from "./_components/models-table";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function ModelsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 20;

  const { data, isPending } = useModels({ page, limit });

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/models?${params.toString()}`);
  };

  if (isPending || !data) {
    return <ModelsTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <ModelsTable data={data} />

      {data.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => updatePage(Math.max(1, page - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => updatePage(p)}
                  isActive={p === page}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => updatePage(Math.min(data.totalPages, page + 1))}
                className={
                  page === data.totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
```

**URL pagination pattern:**
- Store page number in URL search params
- Parse page from URL in component
- Pass to query hook
- Update URL when page changes
- React Query caches each page separately

## Stale Time Configuration

Configure `staleTime` based on data volatility:

```typescript
// Highly volatile data - always refetch
staleTime: 0 // Default

// Moderately stable - 5 minutes
staleTime: 1000 * 60 * 5

// Very stable - 30 minutes
staleTime: 1000 * 60 * 30

// Static data - 1 hour
staleTime: 1000 * 60 * 60
```

**Guidelines:**
- User-generated content: 5 minutes
- Configuration/settings: 30 minutes
- Reference data (categories, etc.): 1 hour
- Real-time data: 0 (always refetch)

## Error Handling

### Error Handling Strategy

**Query errors are always unexpected:**
- Network errors
- Server errors (500)
- Not found errors (404)
- Authorization errors (401, 403)

### Error Handling Pattern

```typescript
"use client";

import { useModels } from "@/hooks/queries/models/use-models";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function ModelsPage() {
  const { data, isPending, error, refetch } = useModels();

  if (isPending || !data) {
    return <ModelsTableSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Models</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error.message}</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return <ModelsTable data={data} />;
}
```

**Pattern:**
- Display clear error message
- Show retry button using `refetch()`
- Use destructive alert variant
- Include icon for visual feedback

### Specific Error Handling

```typescript
if (error) {
  // Handle specific error types
  if (error.message === "Model not found") {
    return (
      <Alert>
        <AlertDescription>
          The model you're looking for doesn't exist.
        </AlertDescription>
      </Alert>
    );
  }

  // Network error
  if (error.message.includes("fetch")) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Unable to connect to server. Please check your connection.
        </AlertDescription>
      </Alert>
    );
  }

  // Default error
  return (
    <Alert variant="destructive">
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
```

## Empty State Pattern

```typescript
"use client";

import { useModels } from "@/hooks/queries/models/use-models";
import { ModelsTable } from "./_components/models-table";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function ModelsPage() {
  const { data, isPending, error } = useModels();

  if (isPending || !data) {
    return <ModelsTableSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Empty state
  if (data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <PlusCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No models yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get started by creating your first model.
        </p>
        <Button>Create Model</Button>
      </div>
    );
  }

  return <ModelsTable data={data} />;
}
```

**Empty state pattern:**
- Check `data.items.length === 0` after loading
- Show helpful message and icon
- Provide action to create first item
- Different from error state

## Common Workflows

### Workflow 1: Create List Query Hook

1. Create file: `hooks/queries/<feature>/use-<feature>s.ts`
2. Import `useQuery`, `UseQueryResult`, `InferResponseType`, and `apiClient`
3. Extract response type: `type Response = InferResponseType<typeof apiClient.api.<feature>["$get"], 200>` - **MUST include status code**
4. Define options interface for filters/pagination
5. Build query key: `['/api/<feature>', options?]`
6. Implement `queryFn` calling `apiClient.api.<feature>.$get({ query: options })`
7. Check `response.ok`, throw error if not
8. Set appropriate `staleTime` (5 min for lists)
9. Return `useQuery` result typed as `UseQueryResult<Response>`

### Workflow 2: Create Detail Query Hook

1. Create file: `hooks/queries/<feature>/use-<feature>.ts`
2. Import `useQuery`, `UseQueryResult`, `InferResponseType`, and `apiClient`
3. Extract response type: `type Response = InferResponseType<typeof apiClient.api.<feature>[":id"]["$get"], 200>` - **MUST include status code**
4. Accept `id` parameter typed as `string | undefined`
5. Build query key: `['/api/<feature>', id]`
6. Implement `queryFn` calling `apiClient.api.<feature>[":id"].$get({ param: { id } })`
7. Add `enabled: !!id` option
8. Set appropriate `staleTime` (5 min default)
9. Return `useQuery` result typed as `UseQueryResult<Response>`

### Workflow 3: Integrate Query in Component

1. Mark component as `"use client"`
2. Import query hook
3. Call hook: `const { data, isPending, error } = useQuery()`
4. Handle `isPending || !data` → show skeleton
5. Handle `error` → show error message with retry
6. Handle empty state → show empty message with CTA
7. Render data

### Workflow 4: Add Filters to Existing Query

1. Update options interface in query hook
2. Add new filter parameters to options
3. Include in query key for separate caching
4. Pass to API client in `query` object
5. Parse filter from URL in component
6. Pass to query hook

### Workflow 5: Add Pagination

1. Add `page` and `limit` to query options
2. Parse page from URL search params
3. Pass to query hook
4. Add pagination UI component
5. Update URL when page changes
6. React Query caches each page separately

## React Query States Reference

### Query States

| State | Property | When | UI Treatment |
|-------|----------|------|--------------|
| Initial load | `isPending` or `!data` | First fetch, no data | Show skeleton |
| Refetch | `isFetching && !isPending` | Background refetch | Optional indicator |
| Error | `isError` or `error` | Query failed | Show error message |
| Success | `isSuccess` and `data` | Data loaded | Show data |
| Empty | `data.length === 0` | No results | Show empty state |

### Query Options

| Option | Type | Purpose | Example |
|--------|------|---------|---------|
| `queryKey` | `array` | Cache key | `['/api/models', { page: 1 }]` |
| `queryFn` | `async function` | Fetch function | `() => apiClient.models.$get()` |
| `staleTime` | `number (ms)` | Fresh duration | `1000 * 60 * 5` (5 min) |
| `enabled` | `boolean` | Enable/disable | `!!id` |
| `refetchOnWindowFocus` | `boolean` | Refetch on focus | `true` (default) |
| `retry` | `number | boolean` | Retry on error | `3` (default) |

## Guidelines

### DO

1. **Create query hooks** - Always wrap queries in custom hooks in `hooks/queries/`
2. **Extract response types with status code** - Use `InferResponseType<..., 200>` for explicit typing (MUST include status code)
3. **Check both isPending and data** - Always use `isPending || !data` to prevent undefined data errors
4. **Use skeletons for loading** - Show skeleton during `isPending || !data`
5. **Handle all states** - Loading, error, empty, and data states
6. **Check response.ok** - Always verify response status before parsing
7. **Throw errors in queryFn** - Let React Query handle error state
8. **Set appropriate staleTime** - Based on data volatility (5 min default)
9. **Use enabled option** - Prevent queries when dependencies missing
10. **Parse URL params** - Get filters from search params in component
11. **Mirror API structure** - Query keys match API route structure
12. **Provide retry option** - Use `refetch()` in error states

### DON'T

1. **Don't check only isPending** - Always use `isPending || !data` to ensure data exists before rendering
2. **Don't skip skeleton** - Always show skeleton during `isPending || !data`
3. **Don't ignore errors** - Always display error state with message
4. **Don't forget enabled** - Use `enabled: !!id` for dependent queries
5. **Don't call API directly** - Always use query hooks
6. **Don't skip empty state** - Handle no results gracefully
7. **Don't use router.refresh()** - React Query handles refetching
8. **Don't duplicate queries** - Reuse hooks across components
9. **Don't forget staleTime** - Configure based on data volatility
10. **Don't mix patterns** - Use skeletons for queries, loaders for mutations
11. **Don't manually type responses** - Use `InferResponseType<..., 200>` from Hono RPC client with status code

## Benefits

✅ **Type safety** - Full end-to-end type inference from Hono RPC
✅ **Automatic caching** - React Query caches and deduplicates requests
✅ **Background updates** - Automatic refetch when data goes stale
✅ **Optimized performance** - Cached data serves instantly
✅ **Declarative** - React Query handles all fetch state automatically
✅ **Consistent UX** - Skeleton loading states across all queries
✅ **Error resilience** - Automatic retry with exponential backoff
✅ **Developer experience** - Clear patterns, less boilerplate
✅ **Maintainability** - Query logic centralized in hooks

## Related Patterns

- **Hono RPC Client**: `context/hono-rpc-client-usage.md` (using `apiClient` for API calls)
- **React Query Hooks**: `context/react-query-hooks.md` (hook organization, query keys, cache management)
- **Loading States**: `context/loading-states-pattern.md` (skeleton components and loading UX)
- **Client-Side Mutations**: `context/client-side-mutations.md` (mutations that modify data)
- **Component Organization**: `context/component-organization.md` (file placement and naming)
