---
title: "Empty State UI Pattern"
description: "Conventions for displaying empty states with icons, messaging, and call-to-action patterns"
---

# Empty State UI Pattern

## Overview

This pattern defines consistent empty state UX when queries return no data. Empty states occur after loading completes successfully but the result set is empty (zero items, no search results, new user with no content). Different contexts require different empty state treatments: tables use minimal inline messages, while feature pages use rich layouts with icons, headings, and CTAs.

## Core Principles

### 1. Empty State vs Loading vs Error

Empty state is a **successful data state** with zero results.

**State hierarchy:**
1. **Loading** - Data is being fetched → Show skeleton
2. **Error** - Query failed → Show error message with retry
3. **Empty** - Query succeeded, zero results → Show empty state
4. **Data** - Query succeeded with results → Show data

**Check order:**
```typescript
if (isPending || !data) return <Skeleton />;
if (error) return <ErrorState />;
if (data.items.length === 0) return <EmptyState />;
return <DataDisplay data={data} />;
```

**See:** `context/loading-states-pattern.md` for loading state patterns

### 2. Contextual Messaging

Empty state messaging adapts to context and user intent.

**Message types:**
- **First-time user:** "Get started by creating your first model"
- **Search/filter:** "No results found for 'search term'"
- **Nested resource:** "No images yet. Upload your first image above"
- **Temporary state:** "Your inbox is empty"

**Always:** Guide user on next action or explain why it's empty.

### 3. Visual Hierarchy by Context

Use appropriate visual richness based on UI context:

**Rich empty state** - Feature pages, main content areas:
- Icon in circular background
- Heading (h3)
- Descriptive text
- Call-to-action button (optional)

**Minimal empty state** - Tables, inline lists:
- Centered text only
- Single line message
- No icon or CTA

**Card empty state** - Card-based layouts:
- Wrapped in Card component
- Icon + text
- Matches surrounding card design

### 4. Actionable Guidance

Empty states should guide users toward resolution.

**DO:**
- "Get started by creating your first model"
- "Upload your first portfolio image above"
- "Try adjusting your filters"
- "No results found. Try a different search term"

**DON'T:**
- "No data" (unhelpful)
- "Empty" (states the obvious)
- "Nothing here" (not actionable)

### 5. Icon Selection

Choose icons that represent the missing content or action needed.

**Common patterns:**
- Upload contexts: `Upload` icon
- Create content: `PlusCircle` icon
- Search/filter: `Search` or `Filter` icon
- Inbox/messages: `Inbox` icon
- General content: `FileText`, `Folder`, `Package` icons

**Source:** lucide-react library

## Empty State Patterns

### Pattern 1: Rich Empty State (Feature Pages)

**Use for:** Main content areas, feature pages, dashboard sections

**Structure:**
- Centered flex column layout
- Icon in circular muted background container
- Heading (text-lg font-semibold/medium)
- Descriptive text (text-sm text-muted-foreground)
- Optional CTA button
- Generous padding (py-12)

**Implementation:**

```typescript
// app/(admin)/admin/@content/models/(index)/page.tsx
"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModelsPage() {
  const { data, isPending, error } = useModels();

  if (isPending || !data) return <ModelsTableSkeleton />;
  if (error) return <ErrorState error={error} />;

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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Model
        </Button>
      </div>
    );
  }

  return <ModelsTable data={data} />;
}
```

**Key elements:**
- Icon container: `rounded-full bg-muted p-3 mb-4`
- Icon size: `h-6 w-6 text-muted-foreground`
- Heading: `text-lg font-semibold mb-2`
- Description: `text-sm text-muted-foreground mb-4`
- CTA button: Standard Button component with icon

**Example:** See `app/(admin)/admin/@content/models/[id]/portfolio-images/page.tsx`

### Pattern 2: Minimal Empty State (Tables)

**Use for:** Data tables, inline lists, compact views

**Structure:**
- TableRow with single TableCell
- Centered text with vertical padding
- No icon or CTA
- Spans all columns (`colSpan={columns.length}`)

**Implementation:**

```typescript
// components/data-table.tsx
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function DataTable({ data, columns }) {
  return (
    <Table>
      <TableHeader>{/* ... headers ... */}</TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        ) : (
          data.map((row) => <TableRow key={row.id}>{/* ... */}</TableRow>)
        )}
      </TableBody>
    </Table>
  );
}
```

**Key elements:**
- Height: `h-24` for vertical spacing
- Alignment: `text-center`
- Column span: `colSpan={columns.length}`
- Message: Brief, period-terminated

**Example:** See `components/data-table.tsx`

### Pattern 3: Card Empty State (Card Layouts)

**Use for:** Card-based layouts, component cards, content panels

**Structure:**
- Wrapped in Card/CardContent components
- Centered flex column layout
- Icon + text (no heading needed)
- Matches surrounding card structure

**Implementation:**

```typescript
// app/(admin)/admin/@content/models/[id]/_components/model-image-manager.tsx
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ModelImageManager({ images }) {
  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            No images yet. Upload your first image above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>{/* ... render images ... */}</CardContent>
    </Card>
  );
}
```

**Key elements:**
- Wrapper: `Card` component
- Icon size: `h-12 w-12` (larger for card context)
- No heading: Single descriptive text line
- Padding: `py-12`

**Example:** See `app/(admin)/admin/@content/models/[id]/_components/model-image-manager.tsx`

## Filtered/Search Empty States

### No Search Results Pattern

**Message structure:** Acknowledge search term + suggest action

```typescript
// app/(admin)/admin/@content/models/(index)/page.tsx
"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModelsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const { data, isPending } = useModels({ search });

  if (isPending || !data) return <ModelsTableSkeleton />;

  if (data.items.length === 0) {
    // Search active but no results
    if (search) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No models match "{search}". Try a different search term.
          </p>
          <Button variant="outline" onClick={() => clearSearch()}>
            Clear Search
          </Button>
        </div>
      );
    }

    // No search, truly empty
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

**Pattern:**
- Detect if filters/search are active
- Different message for "no results" vs "no data yet"
- Search: Show search term, suggest clearing or adjusting
- Empty: Show create CTA

### No Filter Results Pattern

```typescript
if (data.items.length === 0 && hasActiveFilters) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Filter className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No matches found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Try adjusting your filters to see more results.
      </p>
      <Button variant="outline" onClick={() => clearFilters()}>
        Clear Filters
      </Button>
    </div>
  );
}
```

## Icon Sizing Guidelines

### Icon Container Size

| Context | Container Padding | Icon Size | Container Classes |
|---------|------------------|-----------|-------------------|
| Rich empty state | `p-3` | `h-6 w-6` | `rounded-full bg-muted p-3` |
| Card empty state | `p-4` | `h-8 w-8` | `rounded-full bg-muted p-4` |
| Large feature area | `p-6` | `h-12 w-12` | `rounded-full bg-muted p-6` |
| No container | n/a | `h-12 w-12` | Direct icon, no wrapper |

### Spacing

| Element | Spacing Class | Purpose |
|---------|---------------|---------|
| Icon container → heading | `mb-4` | Space between icon and heading |
| Heading → description | `mb-2` | Tight heading-description pair |
| Description → CTA | `mb-4` | Space before action button |
| Outer container | `py-12` | Generous vertical padding |

## Call-to-Action Patterns

### When to Include CTA

**Include CTA when:**
- User can immediately take action to resolve empty state
- Action is clear and singular (create, upload, invite)
- Empty state is on a feature page or main content area

**Omit CTA when:**
- Empty state is in a table or list (minimal pattern)
- Action is explained in context ("Upload your first image above")
- User lacks permission to take action
- Multiple actions are possible (too complex for empty state)

### CTA Button Patterns

**Primary action (create, upload):**
```typescript
<Button>
  <PlusCircle className="mr-2 h-4 w-4" />
  Create Model
</Button>
```

**Secondary action (clear, reset):**
```typescript
<Button variant="outline" onClick={clearFilters}>
  Clear Filters
</Button>
```

**Navigation action:**
```typescript
<Button asChild>
  <Link href="/settings">
    Go to Settings
  </Link>
</Button>
```

## Component Structure

### File Organization

Empty states are **inline patterns**, not separate components.

**DON'T create:**
- `_components/empty-state.tsx` (too generic)
- `_components/models-empty-state.tsx` (unnecessary abstraction)

**DO implement:**
- Inline in the same component that renders data
- After loading/error checks, before data rendering
- Context-specific messaging and icons

**Why:** Empty states are highly contextual and rarely reusable. Inline implementation is clearer and more maintainable.

### Exception: Reusable Empty State Component

**Only create a component if:**
- Same empty state appears in 3+ places
- Empty state has complex interactive logic
- Empty state needs to be tested independently

**Example scenario:** Shared "No search results" component across multiple searchable lists.

## Messaging Guidelines

### Tone and Voice

**Use:**
- Present tense: "No models yet"
- Actionable guidance: "Get started by creating..."
- Clear, direct language: "Upload your first image"
- Empathy: "Your inbox is empty" (positive spin)

**Avoid:**
- Passive voice: "No models have been created"
- Negative framing: "You don't have any models"
- Vague messages: "Nothing to see here"
- Technical jargon: "Query returned empty set"

### Message Length

**Heading:** 2-4 words
- "No models yet"
- "No results found"
- "Your inbox is empty"

**Description:** 5-12 words, single sentence
- "Get started by creating your first model."
- "Try adjusting your filters to see more results."
- "Upload your first portfolio image above."

**Keep it brief:** Users scan empty states quickly.

## Common Workflows

### Workflow 1: Add Rich Empty State to Feature Page

1. Check data state after loading/error: `if (data.items.length === 0)`
2. Choose appropriate icon from lucide-react
3. Create centered flex column container: `flex flex-col items-center justify-center py-12 text-center`
4. Add icon in circular container: `rounded-full bg-muted p-3 mb-4`
5. Add heading: `text-lg font-semibold mb-2`
6. Add description: `text-sm text-muted-foreground mb-4`
7. Add optional CTA button if action is clear

### Workflow 2: Add Minimal Empty State to Table

1. Check data length in TableBody: `data.length === 0`
2. Return TableRow with single TableCell
3. Set `colSpan={columns.length}` to span all columns
4. Add classes: `h-24 text-center`
5. Write brief message: "No results."

### Workflow 3: Add Card Empty State

1. Check data state: `items.length === 0`
2. Return Card component wrapping empty state
3. Use CardContent with centered flex layout
4. Add icon with `h-12 w-12` size
5. Add descriptive text below icon

### Workflow 4: Handle Search/Filter Empty States

1. Detect if filters/search are active from search params
2. Create conditional empty state messages
3. No results with filters: Show "No matches found" + clear action
4. No results without filters: Show "No data yet" + create action
5. Include search term in message when applicable

## Guidelines

### DO

1. **Check data after loading** - Empty state only renders when `data.items.length === 0`
2. **Use contextual icons** - Choose icons representing content or action needed
3. **Provide actionable messaging** - Guide users on what to do next
4. **Match visual richness to context** - Rich for features, minimal for tables
5. **Use design tokens** - `bg-muted`, `text-muted-foreground` for consistency
6. **Include search term** - Show what user searched for in "no results" messages
7. **Differentiate filtered vs empty** - Different messages for search/filter vs truly empty
8. **Use shadcn/ui components** - Button, Card for CTAs and containers
9. **Keep messages brief** - 2-4 words for heading, 5-12 for description
10. **Implement inline** - Render empty state in the same component as data

### DON'T

1. **Don't show during loading** - Use skeletons during `isPending || !data`
2. **Don't confuse with errors** - Empty is success with zero results, not failure
3. **Don't create generic components** - Empty states are highly contextual
4. **Don't use unhelpful messages** - Avoid "No data", "Empty", "Nothing here"
5. **Don't skip icons** - Icons improve visual hierarchy (except minimal tables)
6. **Don't use wrong icon size** - Follow sizing guidelines for context
7. **Don't add CTAs to tables** - Minimal empty states have text only
8. **Don't forget padding** - Use `py-12` for generous vertical space
9. **Don't use raw colors** - Always use design tokens
10. **Don't show same message for filtered** - Acknowledge filters/search in message

## Examples

### Example 1: First-Time User Empty State

```typescript
// No models exist, guide user to create first one
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
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Model
      </Button>
    </div>
  );
}
```

**Why:** Welcoming tone, clear CTA for primary action, PlusCircle icon signals creation.

### Example 2: Search No Results

```typescript
// User searched but no matches
if (data.items.length === 0 && search) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No results found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        No models match "{search}". Try a different search term.
      </p>
      <Button variant="outline" onClick={clearSearch}>
        Clear Search
      </Button>
    </div>
  );
}
```

**Why:** Acknowledges search term, suggests alternative, provides clear action to reset.

### Example 3: Nested Resource Empty State

```typescript
// Model has no portfolio images yet
if (images.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Upload className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No images yet</h3>
      <p className="text-sm text-muted-foreground">
        Upload your first portfolio image above
      </p>
    </div>
  );
}
```

**Why:** Upload icon matches action, message references UI ("above"), no redundant CTA since upload form is visible.

### Example 4: Table Empty State

```typescript
// Simple table with no rows
<TableBody>
  {data.length === 0 ? (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  ) : (
    data.map((row) => <TableRow key={row.id}>{/* ... */}</TableRow>)
  )}
</TableBody>
```

**Why:** Minimal design matches table context, spans all columns, brief message.

### Example 5: Card-Based Empty State

```typescript
// Image manager card with no images
if (images.length === 0) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          No images yet. Upload your first image above.
        </p>
      </CardContent>
    </Card>
  );
}
```

**Why:** Wrapped in Card to match surrounding UI, larger icon for card context, actionable guidance.

## Benefits

✅ **Consistent UX** - Same patterns across all empty states
✅ **Clear guidance** - Users know what to do next
✅ **Professional polish** - Icons and hierarchy improve perceived quality
✅ **Reduced confusion** - Distinct from loading and error states
✅ **Contextual messaging** - Different messages for search vs empty vs filtered
✅ **Accessible** - Clear messaging helps all users understand system state
✅ **Maintainable** - Inline patterns are easier to update than abstracted components

## Related Patterns

- **Loading States**: `context/loading-states-pattern.md` (skeleton components, state hierarchy)
- **Client-Side Queries**: `context/client-side-queries.md` (data state checking, error handling)
- **Component Organization**: `context/component-organization.md` (file placement for inline patterns)
- **UI Component Conventions**: `context/ui-component-conventions.md` (shadcn/ui components usage)
