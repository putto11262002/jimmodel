# Next.js 16 Skill

**Use this skill when working with Next.js 16-specific features, breaking changes, and modern patterns.**

This skill captures Next.js 16-specific conventions and critical breaking changes. Assumes familiarity with Next.js fundamentals (App Router, Server Components, etc.).

---

## Documentation Lookup

**When you need Next.js documentation:**

1. Use the `mcp__context7__get-library-docs` tool with library ID: `/vercel/next.js`
2. Start with **2000 tokens**, increase if information not found
3. Specify a focused `topic` parameter (e.g., "caching", "routing", "server actions")

```typescript
// Example: Look up Next.js caching documentation
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/vercel/next.js",
  tokens: 2000,
  topic: "caching"
})
```

---

## Breaking Changes (CRITICAL)

### 1. Async Request APIs

**All request-scoped APIs are now async and require `await`:**

```typescript
// ❌ OLD (Next.js 15 and earlier)
export default function Page({ params, searchParams }) {
  const id = params.id;
  const query = searchParams.query;
}

// ✅ NEW (Next.js 16)
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const { query } = await searchParams;
}
```

**Applies to:**
- `params` (dynamic route segments)
- `searchParams` (URL query parameters)
- `cookies()` from `next/headers`
- `headers()` from `next/headers`
- `draftMode()` from `next/headers`

```typescript
// ✅ Correct usage
import { cookies, headers, draftMode } from 'next/headers';

export async function MyServerComponent() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const draft = await draftMode();
}
```

### 2. Parallel Routes: Explicit `default.js` Required

All parallel route slots MUST have a `default.js` file:

```
app/
├── @modal/
│   ├── default.js    ← Required!
│   └── login/page.js
└── page.js
```

```typescript
// app/@modal/default.js
export default function Default() {
  return null;
}
```

### 3. `proxy.ts` Replaces `middleware.ts`

The `middleware.ts` filename is deprecated. Use `proxy.ts`:

```typescript
// ✅ proxy.ts (new)
export function proxy(request: NextRequest) {
  // Middleware logic
}

// ❌ middleware.ts (deprecated)
export function middleware(request: NextRequest) {
  // Old approach
}
```

### 4. `revalidateTag()` Requires `cacheLife`

```typescript
// ❌ OLD
revalidateTag('posts');

// ✅ NEW
revalidateTag('posts', {
  cacheLife: 'default' // or 'aggressive', 'minimal'
});
```

### 5. Images Configuration

- `minimumCacheTTL` default: 60s → **4 hours**
- `images.domains` deprecated → use `images.remotePatterns`

```typescript
// next.config.ts
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
  },
};
```

---

## New Features

### Cache Components (`"use cache"`)

Opt-in caching for pages, components, and functions:

```typescript
"use cache";
export async function CachedComponent() {
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}
```

**Note:** Detailed caching patterns are documented separately.

---

## React 19 Patterns

Next.js 16 ships with React 19.2. Key features:

### View Transitions API

```typescript
"use client";
import { useTransition } from 'react';

export function NavigationLink({ href, children }) {
  const [isPending, startTransition] = useTransition();

  const navigate = () => {
    startTransition(() => {
      // Trigger navigation with view transition
      document.startViewTransition(() => {
        // Navigation logic
      });
    });
  };

  return <button onClick={navigate}>{children}</button>;
}
```

### `useEffectEvent()` Hook

Separates event handlers from reactive dependencies:

```typescript
"use client";
import { useEffectEvent } from 'react';

function Component({ url, onChange }) {
  const onUpdate = useEffectEvent(onChange);

  useEffect(() => {
    // onUpdate won't trigger re-runs when onChange changes
    fetch(url).then(data => onUpdate(data));
  }, [url]); // Only re-run when url changes
}
```

### `<Activity>` Component

For loading states and suspense boundaries:

```typescript
import { Activity } from 'react';

export default function Page() {
  return (
    <Activity fallback={<Loading />}>
      <AsyncContent />
    </Activity>
  );
}
```

---

## Removed Features

- AMP support
- `next lint` command (use `eslint` directly)
- `serverRuntimeConfig` / `publicRuntimeConfig`
- `next/legacy/image`
- `experimental.turbopack` config (moved to top-level)

---

## Requirements

- **Node.js:** 20.9+
- **TypeScript:** 5.1+
- **React:** 19.x

---

## Resources

- [Next.js 16 Blog](https://nextjs.org/blog/next-16) - Full breaking changes and migration details
- [Next.js Docs via Context7](/) - Use library ID: `/vercel/next.js`

---

## Project-Specific Conventions

<!-- Document your project's Next.js patterns here -->
