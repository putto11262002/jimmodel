---
title: "React Query Custom Hooks"
description: "Conventions for writing React Query custom hooks with query key patterns, revalidation strategies, and cache management."
---

# React Query Custom Hooks

## Overview

Custom hooks encapsulate React Query operations for data fetching and mutations. These hooks provide a consistent interface for server state management across the application, with query keys that mirror API route structure for predictable cache management.

## Core Principles

### 1. No UI Code in Hooks

Hooks handle **data operations only** - never render UI components or return JSX.

**Valid hook returns:**
- Query results (`data`, `error`, `isLoading`, etc.)
- Mutation functions
- Derived state from data
- Helper functions for data operations

**Invalid hook returns:**
- JSX elements or components
- Toast notifications (use callbacks instead)
- Modal/dialog components

### 2. Hook Organization

**Location:** `hooks/queries/<feature>/<hook-name>.ts`

**Structure:**
```
hooks/
└── queries/
    └── <feature>/
        ├── use-<feature>s.ts        # List query hook
        ├── use-<feature>.ts         # Single item query hook
        ├── use-create-<feature>.ts  # Create mutation hook
        ├── use-update-<feature>.ts  # Update mutation hook
        └── use-delete-<feature>.ts  # Delete mutation hook
```

**Naming conventions:**
- Queries: `use-<feature>.ts` (single), `use-<feature>s.ts` (list)
- Mutations: `use-<action>-<feature>.ts`
- Use kebab-case for all files
- Group by feature domain in `hooks/queries/<feature>/`

### 3. Query Key Conventions

**Query keys mirror API route structure:**

```typescript
// API route: GET /api/models
queryKey: ['/api/models']

// API route: GET /api/models?search=john&category=fashion
queryKey: ['/api/models', { search: 'john', category: 'fashion' }]

// API route: GET /api/models/:id
queryKey: ['/api/models', id]

// API route: GET /api/models/:id/photos
queryKey: ['/api/models', id, 'photos']
```

**Key structure pattern:**
```
['/api/<resource>']                      # Collection endpoint
['/api/<resource>', filters]             # Filtered collection
['/api/<resource>', id]                  # Single resource
['/api/<resource>', id, '<subresource>'] # Nested resource
```

**Hierarchical invalidation:**
```typescript
// Invalidate ALL model queries
queryClient.invalidateQueries({ queryKey: ['/api/models'] });

// Invalidate specific model and its nested resources
queryClient.invalidateQueries({ queryKey: ['/api/models', id] });

// Invalidate only photos for a model
queryClient.invalidateQueries({ queryKey: ['/api/models', id, 'photos'] });
```

### 4. Mutation Callbacks and Revalidation

**Use callbacks for cache invalidation:**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModelAction,

    onSuccess: (data) => {
      // Invalidate all model list queries
      queryClient.invalidateQueries({
        queryKey: ['/api/models'],
      });

      // Optionally set new item in cache
      queryClient.setQueryData(
        ['/api/models', data.id],
        data
      );
    },
  });
}
```

**Revalidation patterns:**

| Mutation | Invalidate | Query Key |
|----------|-----------|-----------|
| Create | Collection | `['/api/models']` |
| Update | Specific item + collection | `['/api/models', id]`, `['/api/models']` |
| Delete | Specific item + collection | `['/api/models', id]`, `['/api/models']` |
| Bulk operation | All related | `['/api/models']` |

## Hook Patterns

### Query Hook (List)

**File:** `hooks/queries/models/use-models.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getModelsAction } from '@/actions/models/action';

interface UseModelsOptions {
  search?: string;
  category?: string;
  page?: number;
}

export function useModels(options?: UseModelsOptions) {
  const filters = options ? { ...options } : undefined;

  return useQuery({
    queryKey: filters ? ['/api/models', filters] : ['/api/models'],
    queryFn: () => getModelsAction(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

**Query key logic:**
- No filters: `['/api/models']`
- With filters: `['/api/models', { search: 'john', category: 'fashion' }]`

### Query Hook (Single Item)

**File:** `hooks/queries/models/use-model.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getModelAction } from '@/actions/models/action';

export function useModel(id: string | undefined) {
  return useQuery({
    queryKey: ['/api/models', id!],
    queryFn: () => getModelAction(id!),
    enabled: !!id,
  });
}
```

**Query key:** `['/api/models', id]` matches `/api/models/:id`

### Query Hook (Nested Resource)

**File:** `hooks/queries/models/use-model-photos.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getModelPhotosAction } from '@/actions/models/action';

export function useModelPhotos(modelId: string | undefined) {
  return useQuery({
    queryKey: ['/api/models', modelId!, 'photos'],
    queryFn: () => getModelPhotosAction(modelId!),
    enabled: !!modelId,
  });
}
```

**Query key:** `['/api/models', id, 'photos']` matches `/api/models/:id/photos`

### Mutation Hook (Create)

**File:** `hooks/queries/models/use-create-model.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createModelAction } from '@/actions/models/action';

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModelAction,

    onSuccess: () => {
      // Invalidate all model lists (with or without filters)
      queryClient.invalidateQueries({
        queryKey: ['/api/models'],
      });
    },
  });
}
```

### Mutation Hook (Update)

**File:** `hooks/queries/models/use-update-model.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateModelAction } from '@/actions/models/action';

export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModelInput }) =>
      updateModelAction(id, data),

    onSuccess: (_, variables) => {
      // Invalidate specific model and all nested resources
      queryClient.invalidateQueries({
        queryKey: ['/api/models', variables.id],
      });

      // Invalidate collection (item might appear in lists)
      queryClient.invalidateQueries({
        queryKey: ['/api/models'],
        exact: false, // Include filtered queries
      });
    },
  });
}
```

### Mutation Hook (Delete)

**File:** `hooks/queries/models/use-delete-model.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteModelAction } from '@/actions/models/action';

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteModelAction(id),

    onSuccess: (_, id) => {
      // Remove item from cache
      queryClient.removeQueries({
        queryKey: ['/api/models', id],
      });

      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: ['/api/models'],
      });
    },
  });
}
```

## Query Key Patterns by Use Case

### Collections

```typescript
// All items
['/api/models']

// Filtered/searched
['/api/models', { search: 'john' }]
['/api/models', { category: 'fashion', status: 'active' }]

// Paginated
['/api/models', { page: 1, pageSize: 20 }]

// Combined
['/api/models', { search: 'john', page: 2, category: 'fashion' }]
```

### Single Resources

```typescript
// By ID
['/api/models', id]
['/api/users', userId]

// By slug/identifier
['/api/posts', slug]
['/api/products', sku]
```

### Nested Resources

```typescript
// One level deep
['/api/models', modelId, 'photos']
['/api/users', userId, 'orders']

// Two levels deep
['/api/models', modelId, 'photos', photoId]
['/api/users', userId, 'orders', orderId, 'items']
```

### Related Resources

```typescript
// Stats/aggregations
['/api/models', 'stats']
['/api/users', userId, 'stats']

// Relationships
['/api/models', modelId, 'bookings']
['/api/clients', clientId, 'models']
```

## Common Workflows

### Workflow 1: Create List Query Hook

1. Create file: `hooks/queries/<feature>/use-<feature>s.ts`
2. Define options interface for filters/pagination
3. Use query key: `['/api/<feature>', filters?]`
4. Import data source (action or RPC client)
5. Set appropriate `staleTime` based on data volatility
6. Return `useQuery` result

### Workflow 2: Create Detail Query Hook

1. Create file: `hooks/queries/<feature>/use-<feature>.ts`
2. Accept `id` parameter (typed as `string | undefined`)
3. Use query key: `['/api/<feature>', id]`
4. Add `enabled: !!id` option
5. Import and call data source
6. Return `useQuery` result

### Workflow 3: Create Mutation Hook

1. Create file: `hooks/queries/<feature>/use-<action>-<feature>.ts`
2. Import `useQueryClient` from React Query
3. Define mutation with data source function
4. Add `onSuccess` callback
5. Invalidate appropriate query keys (collection and/or detail)
6. Return `useMutation` result

### Workflow 4: Add Cache Invalidation

**For create operations:**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['/api/models'] });
}
```

**For update operations:**
```typescript
onSuccess: (_, variables) => {
  queryClient.invalidateQueries({ queryKey: ['/api/models', variables.id] });
  queryClient.invalidateQueries({ queryKey: ['/api/models'] });
}
```

**For delete operations:**
```typescript
onSuccess: (_, id) => {
  queryClient.removeQueries({ queryKey: ['/api/models', id] });
  queryClient.invalidateQueries({ queryKey: ['/api/models'] });
}
```

## Guidelines

### DO

1. **Mirror API routes** - Query keys match API endpoint structure
2. **Include filters in key** - `['/api/models', { search: 'john' }]`
3. **Invalidate on mutations** - Use `onSuccess` callbacks
4. **Use hierarchical keys** - Enable targeted invalidation
5. **Type parameters** - Define interfaces for options
6. **Add `enabled` option** - For queries dependent on dynamic values
7. **Set `staleTime`** - Based on data volatility
8. **Group by feature** - Organize hooks in `hooks/queries/<feature>/`

### DON'T

1. **Don't return JSX** - Hooks are for data operations only
2. **Don't hardcode strings** - Use template literals if API routes change
3. **Don't show toasts in hooks** - Use callbacks in components
4. **Don't forget invalidation** - Mutations must invalidate related queries
5. **Don't use inconsistent keys** - Always follow API route pattern
6. **Don't nest hooks** - Keep hooks flat and composable
7. **Don't skip types** - Always type options and parameters
8. **Don't mix key patterns** - Stick to `['/api/<resource>', ...]` format

## Revalidation Strategy

### Invalidation Methods

```typescript
// Invalidate all queries starting with key
queryClient.invalidateQueries({
  queryKey: ['/api/models'],
});

// Remove specific query
queryClient.removeQueries({
  queryKey: ['/api/models', id],
});

// Optimistic update
queryClient.setQueryData(
  ['/api/models', id],
  (old) => ({ ...old, ...updates })
);

// Exact match only
queryClient.invalidateQueries({
  queryKey: ['/api/models'],
  exact: true, // Only invalidate ['/api/models'], not ['/api/models', {...}]
});
```

### Invalidation Scope

```typescript
// Invalidates:
// - ['/api/models']
// - ['/api/models', { search: 'john' }]
// - ['/api/models', id]
// - ['/api/models', id, 'photos']
queryClient.invalidateQueries({ queryKey: ['/api/models'] });

// Invalidates:
// - ['/api/models', '123']
// - ['/api/models', '123', 'photos']
// NOT ['/api/models'] or ['/api/models', '456']
queryClient.invalidateQueries({ queryKey: ['/api/models', '123'] });
```

## Integration Options

### Option 1: With Server Actions

Hooks call server actions from `actions/<feature>/action.ts`:

```typescript
// actions/models/action.ts
export async function getModelsAction(filters?: ModelFilters) {
  // Implementation
}

// hooks/queries/models/use-models.ts
import { getModelsAction } from '@/actions/models/action';

export function useModels(filters?: ModelFilters) {
  return useQuery({
    queryKey: filters ? ['/api/models', filters] : ['/api/models'],
    queryFn: () => getModelsAction(filters),
  });
}
```

**Data flow:** Component → Hook → Action → Service → Database

### Option 2: With Hono RPC Client

Hooks call Hono RPC API endpoints using the type-safe client:

```typescript
// hooks/queries/models/use-models.ts
import { apiClient } from '@/lib/api/client';

export function useModels(filters?: ModelFilters) {
  return useQuery({
    queryKey: filters ? ['/api/models', filters] : ['/api/models'],
    queryFn: async () => {
      const response = await apiClient.models.$get({ query: filters });

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      return response.json();
    },
  });
}
```

**Data flow:** Component → Hook → RPC Client → API Route → Service → Database

**See:** `context/hono-rpc-client-usage.md` for RPC client patterns

## Examples

### Example 1: Filtered List with Pagination

```typescript
// hooks/queries/models/use-models.ts
interface UseModelsOptions {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export function useModels(options?: UseModelsOptions) {
  const queryKey = options
    ? ['/api/models', options]
    : ['/api/models'];

  return useQuery({
    queryKey,
    queryFn: () => getModelsAction(options),
    staleTime: 1000 * 60 * 5,
  });
}

// Usage
const { data } = useModels({
  search: 'john',
  category: 'fashion',
  page: 1
});
```

### Example 2: Nested Resource with Multiple IDs

```typescript
// hooks/queries/bookings/use-booking-models.ts
export function useBookingModels(bookingId: string | undefined) {
  return useQuery({
    queryKey: ['/api/bookings', bookingId!, 'models'],
    queryFn: () => getBookingModelsAction(bookingId!),
    enabled: !!bookingId,
  });
}
```

### Example 3: Mutation with Nested Resource Invalidation

```typescript
// hooks/queries/models/use-upload-model-photo.ts
export function useUploadModelPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modelId, photo }: { modelId: string; photo: File }) =>
      uploadModelPhotoAction(modelId, photo),

    onSuccess: (_, variables) => {
      // Invalidate model photos
      queryClient.invalidateQueries({
        queryKey: ['/api/models', variables.modelId, 'photos'],
      });

      // Invalidate model detail (might include photo count)
      queryClient.invalidateQueries({
        queryKey: ['/api/models', variables.modelId],
      });
    },
  });
}
```

## Benefits

- **Predictable** - Query keys mirror API route structure
- **Discoverable** - Easy to understand cache relationships
- **Hierarchical** - Targeted invalidation with prefix matching
- **Type safe** - Full TypeScript inference
- **Consistent** - Standardized patterns across features
- **Maintainable** - Clear separation of data and UI concerns
- **Flexible** - Supports complex filtering and nesting

## Related Patterns

- **Hono RPC Client**: `context/hono-rpc-client-usage.md` (type-safe API client for use in `queryFn`)
- **Component Organization**: `context/component-organization.md` (hook file placement and naming)
