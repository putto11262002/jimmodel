# API Organization

## Pattern Overview

This project uses **Hono** as the API framework within Next.js App Router. All API routes are centralized through a catch-all route with feature-based modular organization. Feature modules are organized in `lib/api/` for better structure and reusability.

## File Structure

```
lib/api/
├── <feature>/
│   ├── routes.ts      # Feature route handlers (Hono app)
│   └── validators.ts  # Zod validation schemas
└── ...

app/api/[[...route]]/
└── route.ts           # Main Hono app instance and handler exports
```

**Organization:**
- **Feature modules** (`lib/api/<feature>/`) contain route handlers and validators
- **Central API** (`lib/api/index.ts`) creates Hono instance and mounts all feature modules
- **Next.js handler** (`app/api/[[...route]]/route.ts`) imports and exports HTTP handlers
- **Validators** are colocated with routes for better maintainability

## Implementation

### Central API Instance

**File:** `lib/api/index.ts`

- Creates Hono instance with `/api` base path
- Imports and mounts all feature route modules
- Exports `api` instance for use in Next.js route handler

```typescript
import { Hono } from 'hono'
import { modelRoutes } from './models/routes'

export const api = new Hono()
  .basePath('/api')
  .route('/models', modelRoutes)
```

**Method chaining:** Use chained calls when mounting multiple routes:

```typescript
export const api = new Hono()
  .basePath('/api')
  .route('/models', modelRoutes)
  .route('/users', userRoutes)
  .route('/bookings', bookingRoutes)
```

### Next.js Route Handler

**File:** `app/api/[[...route]]/route.ts`

- Imports `api` instance from `lib/api/index.ts`
- Exports HTTP method handlers for Next.js

```typescript
import { api } from '@/lib/api'
import { handle } from 'hono/vercel'

// Export handlers for Next.js App Router
export const GET = handle(api)
export const POST = handle(api)
export const PUT = handle(api)
export const DELETE = handle(api)
export const PATCH = handle(api)
```

### Feature Route Modules

**File Pattern:** `lib/api/<feature>/routes.ts`

Each module exports a Hono instance for its feature domain using **method chaining**:

```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { listSchema, createSchema } from './validators'

export const featureRoutes = new Hono()
  .get('/', zValidator('query', listSchema), (c) => c.json({ ... }))
  .post('/', zValidator('json', createSchema), (c) => c.json({ ... }))
  .get('/:id', (c) => c.json({ ... }))
```

**Method chaining:** Chain all route definitions instead of separate statements:

```typescript
// Good: Method chaining
const app = new Hono()
  .get('/', handler1)
  .post('/', handler2)
  .put('/:id', handler3)

// Bad: Separate statements
const app = new Hono()
app.get('/', handler1)
app.post('/', handler2)
app.put('/:id', handler3)
```

### Validators

**File Pattern:** `lib/api/<feature>/validators.ts`

Zod schemas for request validation:

```typescript
import { z } from 'zod'

export const listSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export const createSchema = z.object({
  name: z.string().min(1),
  // ... other fields
})
```

## Guidelines

1. **Feature organization** - Create feature modules in `lib/api/<feature>/`
2. **Colocate validators** - Keep Zod schemas in `validators.ts` alongside routes
3. **Named exports** - Export routes as named exports (e.g., `export const modelRoutes`)
4. **Relative paths** - Define routes relative to feature base (e.g., `/` not `/models`)
5. **Mount in `lib/api/index.ts`** - Use chained `.route('/path', module)` calls
6. **Method chaining** - Chain route definitions: `.get(...).post(...).put(...)`
7. **Export main API instance** - Export `api` instance from `lib/api/index.ts`
8. **Use zValidator** - Validate all requests with `@hono/zod-validator`
9. **Query parameter coercion** - Use `z.coerce` for query params (strings to numbers/booleans)

## Benefits

- **Modularity** - Features are isolated and independently maintainable
- **Scalability** - Easy to add new feature routes without cluttering route.ts
- **Organization** - Clear separation: routes in `lib/api/`, handler in `app/api/`
- **Reusability** - Validators can be shared across routes
- **Type Safety** - Full TypeScript support with Hono's type inference
- **Performance** - Single catch-all route handler with efficient routing

## Example: Models API

This project includes a complete models API implementation:

**Files:**
- `lib/api/models/routes.ts` - 10 REST endpoints for model management
- `lib/api/models/validators.ts` - Zod schemas for all model operations
- `lib/api/index.ts` - Mounts models routes at `/api/models`
- `app/api/[[...route]]/route.ts` - Next.js handler exports

**Endpoints:**
- `GET /api/models` - List models (pagination, filters, search)
- `POST /api/models` - Create model
- `GET /api/models/:id` - Get single model
- `PUT /api/models/:id` - Update model
- `DELETE /api/models/:id` - Delete model
- `PATCH /api/models/bulk-publish` - Bulk update published status
- `POST /api/models/:id/profile-image` - Upload profile image
- `POST /api/models/:id/images` - Upload portfolio image
- `DELETE /api/models/images/:id` - Delete portfolio image
- `PATCH /api/models/:id/images/reorder` - Reorder images

## Related Files

- Central API: `lib/api/index.ts`
- Next.js handler: `app/api/[[...route]]/route.ts`
- Example feature: `lib/api/models/`
- Hono docs: https://hono.dev/docs/getting-started/nextjs
- Zod validator: https://github.com/honojs/middleware/tree/main/packages/zod-validator
