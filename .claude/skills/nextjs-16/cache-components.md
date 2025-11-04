# Next.js 16 Cache Components

**Comprehensive patterns for using `"use cache"` directive and cache management in Next.js 16.**

---

## Overview

Cache Components enable opt-in caching for pages, components, and functions using the `"use cache"` directive. This replaces legacy caching configurations (`fetchCache`, `dynamic`, `revalidate` exports) with a unified, explicit caching model.

---

## Basic Usage

### 1. Directive Levels

The `"use cache"` directive can be applied at three levels:

```typescript
// FILE LEVEL - Caches entire file exports
"use cache";

export default async function Page() {
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}
```

```typescript
// COMPONENT LEVEL
export async function MyComponent() {
  "use cache";
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}
```

```typescript
// FUNCTION LEVEL
export async function getData() {
  "use cache";
  const data = await fetch('/api/data');
  return data;
}
```

### 2. Basic Page Caching

```typescript
import { cacheLife } from 'next/cache';

export default async function Page() {
  "use cache";
  cacheLife('hours');

  const data = await fetch('/api/data');
  return <div>{data}</div>;
}
```

---

## Cache Profiles

### Preset Profiles

Next.js provides 4 default profiles:

| Profile | Use Case | Typical Revalidation |
|---------|----------|---------------------|
| `'seconds'` | Real-time data, live feeds | Every few seconds |
| `'hours'` | Frequently updated content (products, news) | Multiple times per day |
| `'days'` | Daily updates (blog posts, articles) | Once per day |
| `'weeks'` | Rarely changing content (documentation) | Weekly |

**Usage:**

```typescript
import { cacheLife } from 'next/cache';

// Real-time widget
export async function RealtimeWidget() {
  "use cache";
  cacheLife('seconds');
  const data = await fetchRealtimeData();
  return <div>{data.value}</div>;
}

// Product catalog (updated multiple times daily)
export default async function ProductPage() {
  "use cache";
  cacheLife('hours');
  const product = await fetchProduct();
  return <div>{product.name}</div>;
}

// Blog content (updated daily)
export default async function BlogPost() {
  "use cache";
  cacheLife('days');
  const post = await fetchBlogPost();
  return <article>{post.content}</article>;
}
```

### Custom Profiles

Define reusable profiles in `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true, // Required for cache components
  cacheLife: {
    // Custom profile for editorial content
    editorial: {
      stale: 600,      // 10 minutes - serve from cache
      revalidate: 3600, // 1 hour - background revalidation
      expire: 86400,    // 1 day - maximum cache lifetime
    },
    // Custom profile for marketing pages
    marketing: {
      stale: 300,       // 5 minutes
      revalidate: 1800, // 30 minutes
      expire: 43200,    // 12 hours
    },
  },
};

export default nextConfig;
```

**Apply custom profiles:**

```typescript
import { cacheLife } from 'next/cache';

export default async function EditorialPage() {
  "use cache";
  cacheLife('editorial');
  const content = await fetchEditorialContent();
  return <article>{content}</article>;
}
```

### Override Default Profiles

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    // Override the default 'days' profile
    days: {
      stale: 3600,      // 1 hour (instead of default)
      revalidate: 900,  // 15 minutes
      expire: 86400,    // 1 day
    },
  },
};

export default nextConfig;
```

### Inline Cache Configuration

For one-off, component-specific caching:

```typescript
import { cacheLife } from 'next/cache';

export default async function Page() {
  "use cache";
  cacheLife({
    stale: 3600,      // 1 hour
    revalidate: 900,  // 15 minutes
    expire: 86400,    // 1 day
  });

  return <div>Page</div>;
}
```

---

## Cache Invalidation & Revalidation

### 1. Tag-Based Revalidation (Eventual Consistency)

Use `cacheTag()` and `revalidateTag()` for stale-while-revalidate behavior:

```typescript
import { cacheTag, revalidateTag } from 'next/cache';

// Data fetching function with cache tag
export async function getPosts() {
  "use cache";
  cacheTag('posts');
  const posts = await db.query.posts.findMany();
  return posts;
}

// Server Action to invalidate cache (eventual consistency)
export async function createPost(formData: FormData) {
  "use server";

  const post = await db.insert(posts).values({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  // Revalidates with stale-while-revalidate
  // Old cache served while new data loads in background
  revalidateTag('posts', { cacheLife: 'max' });
}
```

### 2. Immediate Cache Update

Use `updateTag()` for immediate invalidation:

```typescript
import { cacheTag, updateTag } from 'next/cache';

export async function getCart() {
  "use cache";
  cacheTag('cart');
  const cart = await fetchCart();
  return cart;
}

export async function updateCart(itemId: string) {
  "use server";

  await db.update(carts).where(eq(carts.itemId, itemId));

  // Immediately invalidates cache - next request gets fresh data
  updateTag('cart');
}
```

### 3. Path-Based Revalidation

Use `revalidatePath()` to invalidate specific routes:

```typescript
import { revalidatePath } from 'next/cache';

export async function updateProduct(productId: string) {
  "use server";

  await db.update(products).where(eq(products.id, productId));

  // Revalidate specific product page
  revalidatePath(`/products/${productId}`);

  // Revalidate entire products listing
  revalidatePath('/products');
}

// Revalidate layout and all nested pages
export async function updateGlobalSettings() {
  "use server";
  await db.update(settings).set({ /* ... */ });

  // Revalidates layout + all pages using it
  revalidatePath('/', 'layout');
}
```

### 4. Route Handler for External Webhooks

Create API route for third-party cache invalidation:

```typescript
// app/api/revalidate/route.ts
import type { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  const secret = request.nextUrl.searchParams.get('secret');

  // Validate secret for security
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag, { cacheLife: 'max' });
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    message: 'Missing tag parameter',
  });
}
```

**Usage:**
```bash
# Trigger revalidation from external service
curl "https://yoursite.com/api/revalidate?tag=posts&secret=YOUR_SECRET"
```

---

## Advanced Patterns

### 1. Nested Component Caching

When components with different `cacheLife` profiles are nested, **the shortest duration takes precedence** for the overall page render:

```typescript
import { cacheLife } from 'next/cache';
import { RealtimeWidget } from './realtime-widget';

// Parent component - cached for hours
export default async function Dashboard() {
  "use cache";
  cacheLife('hours');

  return (
    <div>
      <h1>Dashboard</h1>
      <RealtimeWidget /> {/* Child uses 'seconds' */}
    </div>
  );
}
```

```typescript
// Child component - needs fresh data every few seconds
import { cacheLife } from 'next/cache';

export async function RealtimeWidget() {
  "use cache";
  cacheLife('seconds'); // Shortest duration wins

  const data = await fetchRealtimeData();
  return <div>{data.value}</div>;
}
```

**Result:** Entire Dashboard page is cached using `'seconds'` profile to ensure RealtimeWidget stays fresh.

### 2. Component-Level Caching with Props

Cache is keyed by **serialized props** - same props = same cache entry:

```typescript
interface BookingsProps {
  type: string;
}

export async function Bookings({ type = 'haircut' }: BookingsProps) {
  "use cache";

  const data = await fetch(`/api/bookings?type=${encodeURIComponent(type)}`);
  return <div>{/* render bookings */}</div>;
}
```

**Behavior:**
- `<Bookings type="haircut" />` → Cache entry 1
- `<Bookings type="massage" />` → Cache entry 2 (different props)
- `<Bookings type="haircut" />` → Reuses cache entry 1

### 3. Multiple Cache Tags

Tag cached data with multiple tags for flexible invalidation:

```typescript
import { cacheTag } from 'next/cache';

export async function getUserPosts(userId: string) {
  "use cache";
  cacheTag('posts', `user:${userId}`);

  const posts = await db.query.posts.findMany({
    where: eq(posts.userId, userId),
  });

  return posts;
}

// Invalidate all posts
export async function invalidateAllPosts() {
  "use server";
  revalidateTag('posts', { cacheLife: 'max' });
}

// Invalidate only specific user's posts
export async function invalidateUserPosts(userId: string) {
  "use server";
  revalidateTag(`user:${userId}`, { cacheLife: 'max' });
}
```

### 4. Layout & Page Caching

Apply `"use cache"` to layouts and pages for route segment caching:

```typescript
// app/dashboard/layout.tsx
"use cache";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navData = await fetchNavigation();
  return (
    <div>
      <nav>{/* render nav */}</nav>
      {children}
    </div>
  );
}
```

```typescript
// app/dashboard/page.tsx
"use cache";

export default async function DashboardPage() {
  const stats = await fetchDashboardStats();
  return <div>{/* render stats */}</div>;
}
```

**Note:** Each route segment (layout, page) is cached independently.

---

## Migration Patterns

### From `fetchCache`

```typescript
// BEFORE
export const fetchCache = 'force-cache';

export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

```typescript
// AFTER
export default async function Page() {
  "use cache";
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

### From `dynamic = "force-static"`

```typescript
// BEFORE
export const dynamic = 'force-static';

export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

```typescript
// AFTER
export default async function Page() {
  "use cache";
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

**Important:** `"use cache"` does NOT support runtime APIs like `cookies()`, `headers()`, etc.

### From `revalidate` Export

```typescript
// BEFORE
export const revalidate = 3600; // 1 hour

export default async function Page() {
  return <div>{/* ... */}</div>;
}
```

```typescript
// AFTER
import { cacheLife } from 'next/cache';

export default async function Page() {
  "use cache";
  cacheLife('hours'); // or custom inline config
  return <div>{/* ... */}</div>;
}
```

---

## Cache Configuration Reference

### Profile Properties

```typescript
{
  stale: number;      // Duration (seconds) to serve cached content
  revalidate: number; // Background revalidation interval (ISR-like)
  expire: number;     // Maximum cache lifetime before forced regeneration
}
```

**Rules:**
- `expire` must be ≥ `revalidate` (if both are set)
- All values are in **seconds**
- After `expire` time, next request waits for fresh content

### Example Configuration Scenarios

```typescript
// Fast-changing data (news feed)
cacheLife({
  stale: 30,        // Serve from cache for 30 seconds
  revalidate: 60,   // Revalidate every minute in background
  expire: 300,      // Force regeneration after 5 minutes
});

// Moderate updates (product catalog)
cacheLife({
  stale: 600,       // 10 minutes
  revalidate: 1800, // 30 minutes
  expire: 3600,     // 1 hour
});

// Slow-changing content (documentation)
cacheLife({
  stale: 86400,     // 1 day
  revalidate: 43200, // 12 hours
  expire: 604800,   // 1 week
});
```

---

## Best Practices

1. **Start Conservative:** Begin with shorter cache durations (`'hours'`) and increase as needed
2. **Use Tags for Relationships:** Tag cached data by domain/entity for precise invalidation
3. **Nested Caching:** Be aware that shortest duration wins - design component hierarchy accordingly
4. **Avoid Runtime APIs:** `"use cache"` components cannot use `cookies()`, `headers()`, `draftMode()`, etc.
5. **Enable in Config:** Set `cacheComponents: true` in `next.config.ts` before using cache directives
6. **Monitor Cache Hits:** Use Next.js DevTools MCP to monitor cache performance
7. **Eventual vs Immediate:** Use `revalidateTag()` for gradual updates, `updateTag()` for immediate invalidation

---

## Troubleshooting

### Cache not working?

1. Ensure `cacheComponents: true` in `next.config.ts`
2. Verify `"use cache"` directive is in correct position (top of function/component)
3. Check for runtime API usage (`cookies()`, `headers()`) - not compatible with cache
4. Confirm component/function is `async`

### Stale data persisting?

1. Use `updateTag()` instead of `revalidateTag()` for immediate invalidation
2. Check `expire` value in cache profile - may need to be shorter
3. Verify revalidation is being triggered (add logging to Server Actions)

### Performance issues?

1. Avoid caching too many unique prop combinations (creates many cache entries)
2. Use component-level caching instead of file-level for better granularity
3. Consider using `'seconds'` profile for nested components with volatile data

---

## Resources

- [Next.js Cache Components Guide](https://nextjs.org/docs/app/getting-started/cache-components)
- [cacheLife API Reference](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [revalidateTag API Reference](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- Use Context7: `/vercel/next.js` for latest documentation
