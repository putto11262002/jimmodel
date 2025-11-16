---
title: "Next.js Cache Components"
description: "Server-side rendering and caching patterns using Next.js 16 'use cache' directive, cacheLife profiles, cache tagging, revalidation strategies (updateTag vs revalidateTag), centralized cache configuration, PPR implementation, ISR patterns, and migration from route segment config. Covers file-level, component-level, and function-level caching with interleaving patterns for dynamic content."
---

# Next.js Cache Components

## Overview

Next.js 16 Cache Components provide fine-grained control over server-side rendering and caching through the `'use cache'` directive. This approach implements Partial Prerendering (PPR), allowing explicit control over what gets cached and when, rather than automatic optimization that could cause unexpected behavior.

**Key shift:** Everything is dynamic by default. Mark specific functions/components as cacheable instead of Next.js guessing what should be static.

**Reference:** [Cache Components overview](https://nextjs.org/docs/app/getting-started/cache-components)

## Core Principles

### 1. Everything is Dynamic by Default

Routes render dynamically unless explicitly marked with `'use cache'`. This prevents silent behavior changes from nested dynamic data.

### 2. Cache at Multiple Levels

Apply `'use cache'` at file-level (entire route), component-level, or function-level. File-level caching on pages/layouts caches the entire route segment. Component and function-level caching provides granular control over specific parts. Combine with `cacheLife()` and `cacheTag()` for fine-tuned control.

### 3. Suspense Boundaries Enforce Separation

Dynamic data requiring runtime APIs (`cookies()`, `headers()`, `searchParams`) must be wrapped in `<Suspense>`. This prevents accidentally blocking entire page renders.

### 4. Centralized Cache Configuration

Define cache profiles and tags in `config/cache-component.ts` for consistency across the application.

## Project Configuration

### Enable Cache Components

Already enabled in `next.config.js`:

```typescript
const nextConfig: NextConfig = {
  cacheComponents: true,
}
```

### Centralized Cache Profiles

Cache configuration lives in `config/cache-component.ts`:

```typescript
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Tag can be either string[] or (...) => string[]
// use plural for collection
// use singular for single + (optional identifier if needed to target specifics)
export const cacheComponentConfig = {
  modelListing: {
    tag: ["models"],  // Plural for collections
    profile: {
      stale: HOUR,
      revalidate: DAY * 7,
      expires: DAY * 30,
    },
  },
  modelProfile: {
    tag: (id: string): string[] => ["model", id],  // Singular + identifier for individual items
    profile: {
      stale: HOUR,
      revalidate: DAY * 30,
      expires: DAY * 35,
    },
  },
} as const;
```

**Tag naming convention:**
- **Plural** (`"models"`) for collections/lists
- **Singular** (`"model"`) + identifier for individual items
- Enables semantic distinction and flexible invalidation

**Pattern advantages:**
- **Clear semantics**: Plural vs singular indicates scope (collection vs item)
- **Flexible invalidation**: Invalidate all models via `"models"` tag OR specific model via `"model"` + id
- **Type safety**: Explicit `string[]` return type for clarity

## Decision Framework: Cache vs Suspense

```
Need runtime APIs (cookies, headers, searchParams)?
│
├─ YES → Wrap in <Suspense>, don't cache
│
└─ NO → Should this data be cached?
    │    (Consider: data volatility, user-specific needs, freshness requirements)
    │
    ├─ YES, cache this data → Use 'use cache' with cacheLife/cacheTag
    │   │
    │   └─ Tag depends on params (e.g., id)?
    │       ├─ YES → Component/Function-level 'use cache'
    │       └─ NO → File-level 'use cache'
    │
    └─ NO, needs per-request data → Wrap in <Suspense> for dynamic fetch
```

## 'use cache' Directive Patterns

**Official docs:** https://nextjs.org/docs/app/api-reference/directives/use-cache

### File-Level Usage

Use file-level `'use cache'` when:
- You want to cache the **entire page** or layout as a single unit
- Cache tags are **static** (don't depend on dynamic params)
- All imported components can be cached together

**Implications:**
- **All imported components** become part of the cache output
- The entire component tree (imports + page) shares the same cache entry
- All imported components must respect cache constraints (no runtime APIs)
- Pre-renders the entire route segment at build time
- Single cache lifetime applies to entire page

```typescript
// app/(public)/models/[category]/page.tsx
"use cache";
import { cacheLife, cacheTag } from "next/cache";
import { ModelCard } from "./_components/model-card"; // Becomes part of cache

export default async function Page() {
  cacheLife(cacheComponentConfig.modelListing.profile);
  cacheTag(...cacheComponentConfig.modelListing.tag); // Spread array: ["models"]

  const models = await listModels({ category });
  return <div>{models.map(m => <ModelCard model={m} />)}</div>; // ModelCard cached with page
}
```

**Gotcha:** If any imported component uses runtime APIs (`cookies()`, `headers()`), the entire route opts out of pre-rendering.

### Component-Level Usage

Use component-level `"use cache"` when cache tags are **dynamic** (depend on params like `id`):

```typescript
// app/(public)/models/profile/[id]/page.tsx
export default async function Page({ params }: PageProps) {
  "use cache"; // Component-level - need id for dynamic tag
  const { id } = await params;
  cacheLife(cacheComponentConfig.modelProfile.profile);
  cacheTag(...cacheComponentConfig.modelProfile.tag(id)); // Spread array: ["model", id]

  const model = await getModel({ id });
  return <div>...</div>;
}
```

**Same pattern for `generateMetadata`:** Use component-level directive when metadata needs dynamic tags.

**Why component-level:** Need access to `params` before calling `cacheTag()` with dynamic tag. File-level directive executes before accessing props.

### Function-Level Usage

Use function-level `"use cache"` to wrap **framework-agnostic services** with caching. Define wrapper functions within the page/component that needs them.

**Pattern:** Core services in `lib/core/` remain framework-agnostic. Wrap them with caching directives in page files.

```typescript
// lib/core/models/service.ts - Framework-agnostic
export async function getModel(options: { id: string }) {
  return await db.query.models.findFirst({ where: eq(models.id, options.id) });
}

// app/models/[id]/page.tsx - Wrapper with caching
import { getModel } from "@/lib/core/models/service";

async function getCachedModel(id: string) {
  "use cache";
  cacheLife(cacheComponentConfig.modelProfile.profile);
  cacheTag(...cacheComponentConfig.modelProfile.tag(id)); // Spread array: ["model", id]

  return await getModel({ id });
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const model = await getCachedModel(id); // Wrapper handles caching
  return <div>...</div>;
}
```

**Why this pattern:**
- Keeps framework-agnostic logic in `lib/core/` (no Next.js dependencies)
- Caching concerns (Next.js-specific) stay in page files
- Wrapper functions can be defined inline or extracted as needed
- Each page can apply different cache profiles to the same core service

### Placement Rules

**File-level:** First line of file (before imports)

```typescript
"use cache";
import { cacheLife } from "next/cache";
// ...
```

**Component-level:** First statement inside component function

```typescript
export default async function Page() {
  "use cache";
  // component code
}
```

**Function-level:** First statement inside function - use for reusable data fetching utilities

```typescript
export async function getCachedData() {
  "use cache"; // Immediately after function declaration
  // function code
}
```

**Pattern:** When data fetching logic is shared or framework-agnostic, wrap it in a cached function instead of caching at component level. This enables reuse across components while maintaining cache efficiency.

### Constraints

**Serializable arguments only:**
- Primitives (string, number, boolean)
- Plain objects and arrays
- Cannot use: Functions, class instances, symbols
- Non-serializable arguments can be **passed through** but not inspected inside cache boundary

**No runtime APIs at cache boundary:**
- Cannot use `cookies()`, `headers()`, `searchParams` inside cached scope
- Wrap dynamic data in `<Suspense>` instead
- Use `'use cache: private'` for user-specific cached content (advanced)

**Async functions only:**
- `'use cache'` works exclusively with `async` functions/components
- Synchronous functions cannot be cached

**Return value constraints:**
- Returned JSX must contain serializable props
- Non-serializable values in return become references (filled at request time)

**Platform limitations:**
- Requires Node.js server or Docker deployment
- Not compatible with static exports (`output: 'export'`)
- Not compatible with Edge runtime (`runtime: 'edge'`)

### Interleaving Pattern

Non-serializable content can **pass through** cached components without affecting cache entries:

```typescript
async function CachedWrapper({ children }: { children: React.ReactNode }) {
  "use cache";
  cacheLife("hours");

  const data = await fetchData();
  return (
    <div>
      <h1>{data.title}</h1>
      {children} {/* Children pass through - not inspected, not cached */}
    </div>
  );
}

// Usage - dynamic content inside cached wrapper
export default function Page() {
  return (
    <CachedWrapper>
      <DynamicUserContent /> {/* Not cached, renders per-request */}
    </CachedWrapper>
  );
}
```

**Key insight:** Compositional slots (`children`, custom slots) pass through without inspection. This enables mixing cached static shells with dynamic, uncached content.

**Server Actions interleaving:** Actions can be passed as props to cached components and forwarded to client components without invocation inside cache boundary.

**Cache key generation:** Build ID + Function ID + serialized arguments (non-serializable args excluded)

**Reference:** [use cache directive documentation](https://nextjs.org/docs/app/api-reference/directives/use-cache)

## Cache Tagging Patterns

### Purpose

Tags label cached data for selective invalidation. Instead of clearing all cache, target specific entries by their tags.

### Basic Syntax

```typescript
import { cacheTag } from 'next/cache';

cacheTag('my-tag');                    // Single tag
cacheTag('tag-one', 'tag-two');        // Multiple tags
```

**Constraints:**
- Must be called within `'use cache'` scope
- Max 256 characters per tag
- Max 128 tags per cache entry
- Duplicate tags have no additional effect (idempotent)

### Project Tag Patterns

#### Static Tags (Collections)

Use array-based tags for hierarchical invalidation:

```typescript
cacheTag(...cacheComponentConfig.modelListing.tag); // Spreads ["models"]
```

**Config pattern:**
```typescript
modelListing: {
  tag: ["models"],  // Array of tags
  // ...
}
```

#### Dynamic Tags (Individual Items)

Use tag functions returning arrays for hierarchical tagging with specific identifiers:

```typescript
cacheTag(...cacheComponentConfig.modelProfile.tag(id)); // Spreads ["model", id]
```

**Config pattern:**
```typescript
modelProfile: {
  tag: (id: string): string[] => ["model", id],  // Function returning tag array (singular + id)
  // ...
}
```

### Hierarchical Tagging Pattern

Tags are arrays supporting multiple identifiers for flexible invalidation:

```typescript
// Collection tag: plural for all models
tag: ["models"]

// Individual item tags: singular + specific identifier
tag: (id: string): string[] => ["model", id]
```

**Invalidation flexibility:**
- Invalidate **all models** (collection): `updateTag("models")` or `revalidateTag("models", "max")`
- Invalidate **specific model** (item): `updateTag("model")` + `updateTag(id)`
- Semantic distinction via plural (collections) vs singular (items)

**Usage with spread operator:**
```typescript
// Static tags (plural for collections)
cacheTag(...cacheComponentConfig.modelListing.tag); // cacheTag("models")

// Dynamic tags (singular + identifier for items)
cacheTag(...cacheComponentConfig.modelProfile.tag(id)); // cacheTag("model", id)
```

### Tag Naming Convention

**Pattern:** Plural for collections, singular + identifier for items
- `["models"]` - Collection of all models (plural)
- `["model", id]` - Individual model item (singular + identifier)
- `["models", "featured"]` - Featured models subset (plural + qualifier, if needed)

**Naming rules:**
- Collections: Use plural (`"models"`, `"users"`, `"posts"`)
- Individual items: Use singular + identifier (`"model"` + id, `"user"` + id)
- Subsets: Use plural + qualifier (`"models"` + `"featured"`)

**Benefits:**
- Clear semantic distinction between collections and items
- Granular control over cache invalidation
- Intuitive naming that matches resource type
- Type-safe with `string[]` return types

**Reference:** [cacheTag documentation](https://nextjs.org/docs/app/api-reference/functions/cacheTag)

## Cache Revalidation Strategies

### updateTag - Immediate Revalidation

**Purpose:** Read-your-own-writes scenarios where users must see their changes immediately.

**Behavior:** Immediate cache expiration - next request waits for fresh data instead of serving stale content.

**Syntax:**
```typescript
import { updateTag } from 'next/cache';

updateTag(tag: string): void;
```

**Constraints:**
- Max 256 characters per tag (case-sensitive)
- **Server Actions only** - throws error in Route Handlers or Client Components
- Tag must exist (via `cacheTag()`)

**Note:** For Route Handlers, use `revalidateTag` instead - `updateTag` is specifically for Server Actions.

**Usage pattern (Server Action):**
```typescript
'use server'

async function updateModel(id: string, data: FormData) {
  await db.models.update({ where: { id }, data });

  // On the server (Server Action context)
  // Invalidate collection tag (plural) - affects all model listings
  updateTag("models");

  // Invalidate individual item tags (singular + id) - affects specific model profile
  updateTag("model");
  updateTag(id);

  redirect(`/models/profile/${id}`);
}
```

**Why multiple tags:**
- Listings use `["models"]` (plural) - invalidate to refresh collections
- Profile uses `["model", id]` (singular + id) - invalidate both "model" and id to refresh specific item

**When to use:**
- User must see changes immediately
- Data consistency critical
- Mutation redirects to page showing modified data

**When NOT to use:**
- Performance more critical than immediate consistency

**Performance consideration:** Adds latency to mutation since it waits for fresh data.

### revalidateTag - Background Revalidation

**Official docs:** https://nextjs.org/docs/app/api-reference/functions/revalidateTag

**Purpose:** Eventual consistency scenarios where background revalidation is acceptable.

**Behavior:** Stale-while-revalidate pattern - marks cache as stale, serves cached content while fetching fresh data in background.

**Syntax:**
```typescript
import { revalidateTag } from 'next/cache';

revalidateTag(tag: string, profile: string | { expire?: number }): void;
```

**Parameters:**
- `tag`: Cache tag to invalidate (max 256 characters)
- `profile`: Revalidation behavior (`"max"` recommended)

**Profile options:**

**`"max"` (recommended):** Stale-while-revalidate semantics

```typescript
revalidateTag('model-listing', 'max');
```

**Custom expiration:** Immediate expiration (use sparingly)

```typescript
revalidateTag('model-listing', { expire: 0 });
```

**Execution contexts:**
- Server Actions: Yes
- Route Handlers: Yes
- Client Components: No

**Usage pattern:**
```typescript
'use server'

async function publishModel(id: string) {
  await db.models.update({ where: { id }, data: { published: true } });

  // Invalidate collection tag (plural) - background refresh for listings
  revalidateTag("models", "max");

  // Invalidate individual item tags (singular + id) - background refresh for profile
  revalidateTag("model", "max");
  revalidateTag(id, "max");
}
```

**When to use:**
- Eventual consistency acceptable
- Performance preferred over immediate consistency
- Background refresh pattern desired
- Called from Route Handlers (only revalidation option)

**When NOT to use:**
- User must see changes immediately

**Best practices:**
1. Default to `"max"` for optimal performance
2. Use `updateTag` for immediate updates in Server Actions
3. Avoid single-argument form (deprecated)

### updateTag vs revalidateTag

| Feature | updateTag | revalidateTag |
|---------|-----------|---------------|
| Context | Server Actions only | Server Actions & Route Handlers |
| Cache behavior | Immediate expiration, waits for fresh data | Serves stale while revalidating |
| Purpose | Read-your-own-writes | Eventual consistency |
| Performance | Slower (waits) | Faster (background) |

**References:** [updateTag documentation](https://nextjs.org/docs/app/api-reference/functions/updateTag) | [revalidateTag documentation](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

## Cache Lifetime with cacheLife

### Purpose

Controls cache duration for cached functions and components. Defines when content becomes stale, revalidates, and expires.

### Timing Properties

**`stale`**: Client-side cache duration - how long client uses cached data without server check

**`revalidate`**: Server background refresh interval - triggers regeneration while serving cached content (ISR pattern)

**`expire`**: Hard expiration - after this time with no requests, next request waits for fresh data

**Critical constraint:** `expire` must ALWAYS be greater than `revalidate`.

**Why:** The `revalidate` period implements stale-while-revalidate - it serves cached content while regenerating fresh data in the background. For this to work, the cached entry must still exist when the revalidation period triggers. If `expire` ≤ `revalidate`, the cache entry would be completely removed before revalidation occurs, breaking the background refresh mechanism. The entry would be gone, forcing a synchronous regeneration instead of serving stale content during refresh.

### Syntax

```typescript
import { cacheLife } from 'next/cache';

// Built-in profile
cacheLife('hours');

// Custom profile object
cacheLife({
  stale: 3600,        // 1 hour in seconds
  revalidate: 86400,  // 1 day
  expire: 2592000     // 30 days
});
```

**Constraints:**
- Must be called within `'use cache'` scope
- `expire` must be greater than `revalidate` (validated by Next.js)
- Minimum 30-second stale time enforced

### Built-in Profiles

| Profile | Stale | Revalidate | Expire | Use Case |
|---------|-------|-----------|--------|----------|
| `seconds` | 30s | 1s | 1m | Real-time data |
| `minutes` | 5m | 1m | 1h | Frequently updated |
| `hours` | 5m | 1h | 1d | Multiple daily updates |
| `days` | 5m | 1d | 1w | Daily updates |
| `weeks` | 5m | 1w | 30d | Weekly updates |
| `max` | 5m | 30d | 1y | Rarely changes |

**Default (without cacheLife):** 5m stale, 15m revalidate, 1y expire

### Project Cache Profiles Pattern

Always use centralized profiles from `config/cache-component.ts`:

```typescript
// DO: Use config
cacheLife(cacheComponentConfig.modelListing.profile);

// DON'T: Hardcode values
cacheLife({ stale: 3600, revalidate: 86400, expire: 2592000 });
```

### ISR (Incremental Static Regeneration)

The `revalidate` property implements ISR:

1. Request arrives after `revalidate` period
2. Server immediately serves cached content
3. Regenerates fresh data in background
4. Updates cache for next request

**Benefit:** Fast responses with fresh content updating in background.

### Nested Component Behavior

When components nest with different `cacheLife` profiles, **shortest duration takes precedence** to prevent serving stale data.

### Choosing Cache Durations

**Match data volatility:**
- Frequently changing (inventory, live stats): `seconds` or `minutes`
- Daily content (blog posts, news): `hours` or `days`
- Static content (documentation, profiles): `weeks` or `max`

**Project pattern:**
- Model listings: 1h stale, 7d revalidate (weekly catalog updates)
- Model profiles: 1h stale, 30d revalidate (stable profile data)

**Reference:** [cacheLife documentation](https://nextjs.org/docs/app/api-reference/functions/cacheLife)

## Common Workflows

### Workflow 1: Add Caching to a New Page

1. Determine if tag is static or dynamic (depends on params?)
2. Add `"use cache"` directive (file-level for static tags, component-level for dynamic)
3. Import `cacheLife` and `cacheTag` from `next/cache`
4. Apply profile: `cacheLife(cacheComponentConfig.<feature>.profile)`
5. Apply tag with spread operator:
   - Static: `cacheTag(...cacheComponentConfig.<feature>.tag)`
   - Dynamic: `cacheTag(...cacheComponentConfig.<feature>.tag(id))`

### Workflow 2: Define New Cache Profile

1. Open `config/cache-component.ts`
2. Add new entry to `cacheComponentConfig` object
3. Define `tag` following naming convention:
   - **Collection** (plural): `tag: ["resources"]` (string array)
   - **Individual item** (singular + id): `tag: (id: string): string[] => ["resource", id]` (function returning string array)
4. Define `profile` object with `stale`, `revalidate`, `expires` in milliseconds
5. Use constants: `MINUTE`, `HOUR`, `DAY` for readability
6. Export type will auto-update via `as const`
7. Remember: Plural for collections, singular + identifier for individual items

### Workflow 3: Invalidate Cache After Mutation (Server Action)

1. Import `updateTag` or `revalidateTag` from `next/cache`
2. Perform mutation (database update, external API call)
3. Choose invalidation strategy:
   - **Immediate:** `updateTag(tag)` - user sees changes right away
   - **Background:** `revalidateTag(tag, 'max')` - eventual consistency
4. Invalidate following plural/singular pattern:
   - Collection (plural): `updateTag("models")` - affects all listings tagged with `["models"]`
   - Individual item (singular + id): `updateTag("model")` and `updateTag(id)` - affects profile tagged with `["model", id]`
   - Invalidate all applicable tags for complete cache refresh
5. Redirect or return response

### Workflow 4: Invalidate Cache from Route Handler

1. Import `revalidateTag` from `next/cache` (`updateTag` not available in Route Handlers)
2. Perform operation (webhook processing, external trigger)
3. Call `revalidateTag(tag, 'max')` for background revalidation
4. Return response

## Guidelines

### DO

1. **Use centralized config** - Always reference `cacheComponentConfig` for profiles and tags
2. **Match directive placement to tag type** - File-level for static tags, component-level for dynamic tags
3. **Spread tag arrays when calling cacheTag** - Use `cacheTag(...config.tag)` or `cacheTag(...config.tag(id))`
4. **Follow plural/singular naming** - Plural for collections (`["models"]`), singular + id for items (`["model", id]`)
5. **Apply `'use cache'` to both page and `generateMetadata`** - Ensure metadata caching matches page caching
6. **Use hierarchical tags** - Define tags as arrays for flexible invalidation
7. **Use `updateTag` for immediate consistency** - When user must see changes right away in Server Actions
8. **Default to `revalidateTag` with `"max"`** - For optimal performance with eventual consistency
9. **Invalidate all applicable tags** - Invalidate plural (collection) and singular + id (item) tags when needed
10. **Choose `cacheLife` based on data volatility** - Frequently changing data gets shorter durations
11. **Wrap dynamic data in `<Suspense>`** - When using runtime APIs like `cookies()`, `headers()`
12. **Use built-in profiles when appropriate** - `'hours'`, `'days'` are good defaults

### DON'T

1. **Don't hardcode cache profiles** - Always use `cacheComponentConfig`
2. **Don't forget to spread tag arrays** - Must use `cacheTag(...config.tag)`, not `cacheTag(config.tag)`
3. **Don't use single-string tags** - Use arrays for hierarchical tagging: `["models"]` not `"models"`
4. **Don't mix plural/singular incorrectly** - Collections use plural, individual items use singular + id
5. **Don't use runtime APIs in cached scope** - `cookies()`, `headers()`, `searchParams` must be in `<Suspense>`
6. **Don't forget cache invalidation** - Mutations must invalidate related caches
7. **Don't invalidate only one tag** - For items tagged with `["model", id]`, invalidate both "model" and id
8. **Don't use `updateTag` in Route Handlers** - Only works in Server Actions, use `revalidateTag` instead
9. **Don't skip the `profile` parameter in `revalidateTag`** - Single-argument form is deprecated
10. **Don't make arguments non-serializable** - Functions, class instances break cache key generation
11. **Don't use file-level directive with dynamic tags** - Need params access before calling `cacheTag()`
12. **Don't set `expire` less than `revalidate`** - Next.js will throw validation error

## Migration from Old Route Segment Config

### Removed Configurations

The following route segment config options are **no longer needed** with Cache Components:

- `dynamic = 'force-dynamic'` → Default behavior (everything dynamic)
- `dynamic = 'force-static'` → Use `'use cache'` instead
- `revalidate = <seconds>` → Use `cacheLife({ revalidate })` instead
- `fetchCache` → Cache applies to all server I/O, not just fetch

### Before vs After

**Before (route segment config):**
```typescript
// app/models/page.tsx
export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Page() {
  const models = await fetch('/api/models', {
    cache: 'force-cache',
    next: { revalidate: 3600 }
  });
  return <div>...</div>;
}
```

**After (cache components):**
```typescript
// app/models/page.tsx
"use cache";
import { cacheLife, cacheTag } from 'next/cache';

export default async function Page() {
  cacheLife('hours'); // or custom profile
  cacheTag('model-listing');

  const models = await listModels(); // Any server I/O cached
  return <div>...</div>;
}
```

### Key Differences

**Explicit vs Implicit:**
- Old: Next.js guessed what should be static
- New: Explicitly mark cacheable sections with `'use cache'`

**Scope:**
- Old: Route-level config affected entire page
- New: Function/component-level granular control

**Coverage:**
- Old: Only `fetch()` requests cached
- New: All server I/O (database, APIs, computations) cached

**Predictability:**
- Old: Nested `cache: 'no-store'` could unexpectedly make entire route dynamic
- New: Cache boundaries explicit, behavior predictable

## Benefits

- **Fine-grained control** - Cache specific functions/components, not entire routes
- **Works with all server I/O** - Database queries, API calls, computations (not just `fetch`)
- **Explicit behavior** - No silent route changes from nested dynamic data
- **Centralized configuration** - Consistent cache profiles across application
- **Partial Prerendering (PPR)** - Static shell with dynamic sections via Suspense
- **On-demand revalidation** - Targeted cache invalidation via tags
- **ISR built-in** - Background regeneration with `cacheLife` revalidate property
- **Type-safe** - Config exported as `const` with full TypeScript inference

## Related Patterns

- **Server Actions** - Mutations triggering cache invalidation with `updateTag`/`revalidateTag`
- **Component Organization** - Where to place cached components in route structure
- **Data Fetching** - Integration with core services returning cacheable data (if documented separately)
