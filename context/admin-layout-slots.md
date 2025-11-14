---
title: "Admin Layout: Slot-Based Fixed Header"
description: "Explains layout patterns and route structure for /admin segment using Next.js parallel routes."
---

# Admin Layout Pattern: Slot-Based Fixed Header

## Overview

Admin pages use Next.js parallel routes to enforce consistent layout with fixed headers and independently scrollable content. The sidebar and page header remain fixed while only the content area scrolls on overflow.

## Architecture

**Three-Layer Structure:**
1. **Root Layout** (`app/(admin)/layout.tsx`) - Provides sidebar + delegates to children
2. **Slot Orchestrator** (`app/(admin)/admin/layout.tsx`) - Composes `@header` and `@content` slots with fixed positioning
3. **Page Implementations** - Split into header slot (`@header/**/page.tsx`) and content slot (`@content/**/page.tsx`)

## Directory Structure

```
app/(admin)/
├── layout.tsx                    # Sidebar + children wrapper
└── admin/
    ├── layout.tsx                # Slot orchestrator (fixed header + scrollable content)
    ├── @header/                  # Header slot (parallel route)
    │   ├── default.tsx          # Fallback for unmatched routes
    │   ├── page.tsx             # Dashboard header
    │   └── models/
    │       ├── page.tsx         # Models list header
    │       ├── new/page.tsx     # Create model header
    │       └── [id]/
    │           └── default.tsx  # Shared edit model header (all forms)
    └── @content/                 # Content slot (parallel route)
        ├── default.tsx          # Fallback for unmatched routes
        ├── page.tsx             # Dashboard content
        └── models/
            ├── page.tsx         # Models list content
            ├── new/page.tsx     # Create form content
            └── [id]/
                ├── layout.tsx   # Edit layout with sidebar
                ├── page.tsx     # Redirect to first form
                └── basic-info/page.tsx  # Individual form pages
```

## Layout Hierarchy

### Root Layout: `app/(admin)/layout.tsx`

**Responsibility:** Fixed sidebar + flexible content area

**Key Requirements:**
- `flex h-screen` - Full viewport height constraint
- Sidebar: Fixed width, no scroll
- Main area: `flex-1 flex flex-col` - Allows child to control overflow

**Reference:** See existing implementation at `app/(admin)/layout.tsx:10-16`

### Slot Orchestrator: `app/(admin)/admin/layout.tsx`

**Responsibility:** Compose header + content with scroll behavior

**Implementation Pattern:**
```tsx
export default function AdminSlotLayout({
  header,
  content,
}: {
  header: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          {header}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          {content}
        </div>
      </main>
    </>
  );
}
```

**Critical CSS:**
- Header: `sticky top-0` - Stays fixed during scroll
- Main: `flex-1 overflow-y-auto` - Only this area scrolls

### Header Slot: `app/(admin)/admin/@header/**/page.tsx`

**Responsibility:** Render page header using `PageHeader` component

**Implementation Pattern:**
```tsx
// app/(admin)/admin/@header/models/page.tsx
import { PageHeader } from "../../_components/page-header";

export default function ModelsHeader() {
  return (
    <PageHeader
      title="Models Management"
      description="View, create, and manage model profiles"
      actions={<Button>Create Model</Button>}
    />
  );
}
```

**Component Reference:** `app/(admin)/admin/_components/page-header/index.tsx`

### Content Slot: `app/(admin)/admin/@content/**/page.tsx`

**Responsibility:** Render page content (tables, forms, cards)

**Implementation Pattern:**
```tsx
// app/(admin)/admin/@content/models/page.tsx
export default async function ModelsContent({ searchParams }) {
  const data = await modelService.listModels(searchParams);
  return <ModelsTable initialData={data} />;
}
```

### Nested Layouts in Content Slots

Content slots **CAN** have nested `layout.tsx` files to provide shared UI patterns for child routes.

**Use cases for nested layouts:**
- Multi-step forms with step indicators
- Tabbed interfaces with shared navigation
- Shared context providers for related pages
- Common card wrappers or containers

**Example: Multi-Step Form Layout**
```tsx
// app/(admin)/admin/@content/models/new/layout.tsx
"use client";

import { FormProvider } from "./_contexts/form-context";
import { StepIndicator } from "./_components/step-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MultiStepFormLayout({ children }) {
  return (
    <FormProvider>
      <div className="max-w-3xl mx-auto space-y-6">
        <StepIndicator />
        <Card>
          <CardHeader>
            <CardTitle>Step Title</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
```

**Benefits:**
- DRY principle - Shared UI components across multiple pages
- Consistent user experience across related pages
- Centralized state management (contexts, providers)
- Reduces code duplication

**Important Notes:**
- Nested layouts do NOT affect the header slot or scroll behavior
- The slot orchestrator's scroll container still works correctly
- Use client components (`"use client"`) for interactive nested layouts
- Keep data fetching in page components, not nested layouts

## Default Fallbacks

Both slots require `default.tsx` for unmatched routes:

```tsx
// app/(admin)/admin/@header/default.tsx
export default function DefaultHeader() {
  return null;
}

// app/(admin)/admin/@content/default.tsx
export default function DefaultContent() {
  return null;
}
```

**Purpose:** Prevent Next.js 404 when navigating between admin routes

## Shared Headers with default.tsx

### When to Use

Use `default.tsx` instead of `page.tsx` in the `@header` slot when **all child route segments share the same header context**:

✅ **Use default.tsx when:**
- All child routes share the same resource context (e.g., editing the same model)
- Header content doesn't change between child routes
- You want a single header definition for an entire route segment
- Header content can be **static** (no params/searchParams needed)

❌ **Use page.tsx when:**
- Each route has unique header content
- Different routes need different titles, descriptions, or actions
- Headers vary significantly between sibling routes
- Header needs access to **dynamic route params or searchParams**

### Implementation Pattern

**Example: Edit Model Header Shared Across All Forms**

Instead of creating separate headers for each form page:
```
@header/models/[id]/basic-info/page.tsx    ❌ Duplicated
@header/models/[id]/physical/page.tsx       ❌ Duplicated
@header/models/[id]/career/page.tsx         ❌ Duplicated
```

Use a single `default.tsx` that applies to all child routes:
```tsx
// app/(admin)/admin/@header/models/[id]/default.tsx
import { PageHeader } from "../../../_components/page-header";

export default function EditModelHeaderDefault() {
  return (
    <PageHeader
      title="Edit Model"
      description="Update model profile"
      showBackButton
    />
  );
}
```

**IMPORTANT:** `default.tsx` files in parallel routes do **not** receive `params` or `searchParams` props. Keep content static or use client-side routing state if dynamic content is needed.

**Result:** This header automatically renders for ALL child routes:
- `/admin/models/[id]/basic-info` → Shows "Edit Model" header
- `/admin/models/[id]/physical` → Shows "Edit Model" header
- `/admin/models/[id]/career` → Shows "Edit Model" header
- `/admin/models/[id]/status` → Shows "Edit Model" header

### Directory Structure with Shared Headers

```
app/(admin)/admin/
├── @header/
│   └── models/
│       ├── page.tsx              # Models list header (unique)
│       ├── new/
│       │   └── page.tsx          # Create model header (unique)
│       └── [id]/
│           └── default.tsx       # ✅ Shared across all edit forms
└── @content/
    └── models/
        ├── page.tsx              # Models list content
        ├── new/
        │   └── page.tsx          # Create form content
        └── [id]/
            ├── layout.tsx        # Edit layout with sidebar
            ├── page.tsx          # Redirect to first form
            ├── basic-info/
            │   └── page.tsx      # Basic info form
            ├── physical/
            │   └── page.tsx      # Physical attributes form
            └── career/
                └── page.tsx      # Career details form
```

### Benefits

1. **Single Source of Truth** - One header definition for entire route segment
2. **DRY Principle** - No duplicated header code across child routes
3. **Consistent UX** - Ensures header remains stable while navigating between forms
4. **Easier Maintenance** - Update header once, applies everywhere
5. **Cleaner File Structure** - Fewer files to manage

### Limitations

**No Access to Route Parameters:**
- `default.tsx` files do **not** receive `params` or `searchParams` props
- Cannot perform data fetching based on route parameters
- Must use static content only

**Workarounds if dynamic content needed:**
1. Use `page.tsx` for each route instead of `default.tsx`
2. Use client-side routing/state (useParams from next/navigation)
3. Move dynamic content to the content slot where params are available

## Migration Strategy

**For each existing admin page:**

1. **Identify current structure** - Find `page.tsx` with `<PageHeader>` + content
2. **Create header slot** - Move `<PageHeader>` to `@header/[route]/page.tsx`
3. **Create content slot** - Move remaining JSX to `@content/[route]/page.tsx`
4. **Remove old page** - Delete original `page.tsx` or repurpose as redirect
5. **Nested layouts** - Content slots CAN have nested `layout.tsx` files for shared UI patterns (e.g., multi-step forms, tabbed interfaces)

**Example Migration:**
- **Before:** `app/(admin)/admin/models/(index)/layout.tsx` + `app/(admin)/admin/models/(index)/page.tsx`
- **After:** `app/(admin)/admin/@header/models/page.tsx` + `app/(admin)/admin/@content/models/page.tsx`

**Nested Layout Example (Multi-step Form):**
- `@content/models/new/layout.tsx` - Provides step indicator and form card wrapper
- `@content/models/new/basic-information/page.tsx` - Individual form step
- `@content/models/new/physical-attributes/page.tsx` - Individual form step

## Scroll Behavior

| Element | Scroll Behavior | CSS Classes |
|---------|----------------|-------------|
| Sidebar | Fixed, no scroll | `flex flex-col` (natural height) |
| Header | Fixed (sticky) | `sticky top-0 z-10` |
| Content | Scrolls independently | `flex-1 overflow-y-auto` |

**Viewport constraint:** Root layout enforces `h-screen` preventing entire page scroll

## Route Matching

Next.js matches slots by parallel route structure:

- `/admin` → `@header/page.tsx` + `@content/page.tsx`
- `/admin/models` → `@header/models/page.tsx` + `@content/models/page.tsx`
- `/admin/models/new` → `@header/models/new/page.tsx` + `@content/models/new/page.tsx`
- `/admin/models/[id]/basic-info` → `@header/models/[id]/default.tsx` + `@content/models/[id]/basic-info/page.tsx`
- `/admin/models/[id]/physical` → `@header/models/[id]/default.tsx` + `@content/models/[id]/physical/page.tsx`

**Unmatched routes:** Fall back to `default.tsx` in respective slot

**Note:** When using `default.tsx` for shared headers, all child routes under that segment will render the same header while content pages vary.

## Best Practices

1. **Keep headers stateless** - No data fetching in header slots
2. **Async content only** - Data fetching belongs in `@content` page components
3. **Consistent padding** - Use container classes defined in orchestrator
4. **Action buttons** - Pass via `<PageHeader actions={...}>` prop
5. **Back buttons** - Use `showBackButton` prop on `PageHeader` component
6. **Nested layouts allowed** - Use `layout.tsx` in content slots for shared UI patterns (forms, tabs, contexts)
7. **Client components for interactivity** - Nested layouts with state/context should use `"use client"`

## References

- **Next.js Parallel Routes:** https://nextjs.org/docs/app/building-your-application/routing/parallel-routes
- **Sticky Positioning:** https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky
- **Flexbox Overflow:** Container must constrain height for `overflow-y-auto` to work

## Troubleshooting

**Header scrolls with content:**
- Check root layout has `h-screen` constraint
- Verify orchestrator uses `sticky top-0` on header
- Ensure main has `flex-1 overflow-y-auto`

**Content doesn't scroll:**
- Parent must have constrained height (`h-screen` bubbles down)
- Check `overflow-y-auto` on main element
- Verify no intermediate `overflow-hidden` blocking scroll

**404 on navigation:**
- Add `default.tsx` fallbacks to both slots
- Check route structure matches between slots
- Verify parallel route naming (`@header`, `@content`)
