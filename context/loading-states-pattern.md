---
title: "Loading States Pattern"
description: "UX patterns for loading states in queries and mutations using skeletons and loaders"
---

# Loading States Pattern

## Overview

This pattern defines consistent loading state UX across the application. Different loading contexts require different UI treatments: data fetching uses skeletons to maintain layout stability, while user-initiated actions use inline loaders in buttons for immediate feedback.

## Core Principles

### 1. Skeletons for Data Fetching (Queries)

Use skeleton components that mimic the final UI structure during initial data loads and refetches.

**When to use:**
- Initial page load (`isLoading`)
- Background refetch (`isFetching`)
- Filter/search operations that trigger new queries
- Pagination navigation

**Why:** Skeletons maintain layout stability, reduce perceived loading time, and provide context about the content being loaded.

### 2. Inline Loaders for User Actions (Mutations)

Use spinner icons inside buttons for user-initiated actions like create, update, delete.

**When to use:**
- Form submissions
- Delete confirmations
- Bulk operations
- Any mutation triggered by user interaction

**Why:** Inline loaders provide immediate feedback at the point of interaction, disable the trigger to prevent duplicate submissions, and maintain button size/layout.

### 3. Never Mix Patterns

Don't use skeletons for mutations or loaders for data fetching. Each pattern serves a specific UX purpose.

## Query Loading States (Use Skeletons)

### Critical: isPending vs Data State

**React Query Gotcha**: `isPending: false` does NOT mean `data` is defined.

**States where isPending is false but data is undefined:**
- Query disabled with `enabled: false`
- Query not yet executed
- Query failed with no cached data

**Always check both conditions:**

```typescript
// ✅ CORRECT
if (isPending || !data) {
  return <Skeleton />;
}

// ❌ WRONG - can render with undefined data
if (isPending) {
  return <Skeleton />;
}
```

**Why:** Prevents runtime errors from accessing undefined data properties.

### Pattern: Skeleton Components

**Structure:**
- Create skeleton component matching the final UI layout
- Mirror the structure: headers, rows, cards, sections
- Use `<Skeleton />` from `@/components/ui/skeleton` (shadcn/ui)
- Animate with pulse or shimmer effect

### Implementation

**File organization:**
```
app/<route>/_components/
├── <feature>-table.tsx           # Main component
└── <feature>-table-skeleton.tsx  # Skeleton version
```

**Naming convention:**
- `<component-name>-skeleton.tsx`
- Export as `<ComponentName>Skeleton`

**Example: Table skeleton**

```typescript
// app/(admin)/admin/@content/models/(index)/_components/models-table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ModelsTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Bulk actions skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead className="w-16">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-10 w-10 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}
```

### Usage in Components

**Pattern: Show skeleton during loading, data when ready**

```typescript
"use client";

import { useModels } from "@/hooks/queries/models/use-models";
import { ModelsTable } from "./_components/models-table";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";

export function ModelsPage() {
  const { data, isPending, error } = useModels();

  if (isPending || !data) {
    return <ModelsTableSkeleton />;
  }

  if (error) {
    return <div>Error loading models: {error.message}</div>;
  }

  return <ModelsTable data={data} />;
}
```

### Loading State Hierarchy

**Priority order:**

1. **Error state** - Show error message if query failed
2. **Initial loading** - Show skeleton if `isPending || !data` (no data available)
3. **Data state** - Show actual data
4. **Background refetch** - Optional: show subtle indicator while `isFetching`

**Example: All states**

```typescript
"use client";

import { useModels } from "@/hooks/queries/models/use-models";
import { ModelsTable } from "./_components/models-table";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function ModelsPage() {
  const { data, isPending, isFetching, error } = useModels();

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load models: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Initial loading state
  if (isPending || !data) {
    return <ModelsTableSkeleton />;
  }

  // Data state with optional refetch indicator
  return (
    <div className="space-y-4">
      {isFetching && (
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

## Mutation Loading States (Use Inline Loaders)

### Pattern: Loader Icon in Buttons

**Structure:**
- Use `<Loader2 />` from `lucide-react` with `animate-spin`
- Position before button text: `mr-2`
- Standard size: `h-4 w-4`
- Disable button when `mutation.isPending`
- Update button text to reflect action in progress

### Implementation

**Standard button pattern:**

```typescript
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {mutation.isPending ? "Saving..." : "Save Changes"}
</Button>
```

**Action-specific text:**

| Action | Loading Text | Default Text |
|--------|--------------|--------------|
| Create | "Creating..." | "Create" |
| Save/Update | "Saving..." | "Save Changes" |
| Delete | "Deleting..." | "Delete" |
| Publish | "Publishing..." | "Publish" |
| Upload | "Uploading..." | "Upload" |
| Submit | "Submitting..." | "Submit" |

### Form Integration

**Disable all inputs during mutation:**

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useUpdateModel } from "@/hooks/queries/models/use-update-model";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ModelForm({ model }) {
  const updateModel = useUpdateModel();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: model,
  });

  const onSubmit = (data) => {
    updateModel.mutate({ id: model.id, data });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                {/* Disable input during mutation */}
                <Input {...field} disabled={updateModel.isPending} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Disable button and show loader */}
        <Button type="submit" disabled={updateModel.isPending}>
          {updateModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {updateModel.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
```

### Delete Confirmation Pattern

```typescript
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDeleteModel } from "@/hooks/queries/models/use-delete-model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteModelButton({ modelId }) {
  const [open, setOpen] = useState(false);
  const deleteModel = useDeleteModel();

  const handleDelete = () => {
    deleteModel.mutate(modelId, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* ... trigger ... */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Model?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Disable cancel during deletion */}
          <AlertDialogCancel disabled={deleteModel.isPending}>
            Cancel
          </AlertDialogCancel>

          {/* Action button with loader */}
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteModel.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {deleteModel.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Bulk Actions Pattern

```typescript
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useBulkUpdatePublished } from "@/hooks/queries/models/use-bulk-update-published";
import { Button } from "@/components/ui/button";

export function BulkActions({ selectedIds }) {
  const bulkUpdate = useBulkUpdatePublished();

  const handlePublish = (published: boolean) => {
    bulkUpdate.mutate({ ids: selectedIds, published });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePublish(true)}
        disabled={bulkUpdate.isPending}
      >
        {bulkUpdate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {bulkUpdate.isPending ? "Publishing..." : `Publish Selected (${selectedIds.length})`}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePublish(false)}
        disabled={bulkUpdate.isPending}
      >
        {bulkUpdate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {bulkUpdate.isPending ? "Unpublishing..." : "Unpublish Selected"}
      </Button>
    </div>
  );
}
```

## Common Workflows

### Workflow 1: Add Skeleton to Query Component

1. Create skeleton file: `<component-name>-skeleton.tsx` next to main component
2. Import `<Skeleton />` from `@/components/ui/skeleton`
3. Mirror the structure of the main component's layout
4. Replace content elements with `<Skeleton>` components matching sizes
5. Use appropriate skeleton shapes (rectangles, circles, rounded)
6. Export as `<ComponentName>Skeleton`
7. Use in parent: `if (isPending || !data) return <ComponentSkeleton />`

### Workflow 2: Add Loading State to Mutation Button

1. Import `<Loader2 />` from `lucide-react`
2. Add `disabled={mutation.isPending}` to button
3. Add conditional loader before text: `{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}`
4. Add conditional text: `{mutation.isPending ? "Loading text..." : "Default text"}`
5. Disable all form inputs with `disabled={mutation.isPending}`

### Workflow 3: Add Loading States to Form

1. Get mutation hook: `const mutation = useMutation()`
2. Disable all form inputs: `<Input disabled={mutation.isPending} />`
3. Disable all buttons: `<Button disabled={mutation.isPending} />`
4. Add loader to submit button following mutation button pattern
5. Update submit button text based on `isPending`

### Workflow 4: Add Refetch Indicator (Optional)

1. Check query hook: `const { isFetching } = useQuery()`
2. Show subtle indicator when `isFetching && !isPending`
3. Position indicator above or beside content (not replacing it)
4. Use small `<Loader2 className="h-4 w-4 animate-spin" />` with text
5. Use muted colors: `text-muted-foreground`

## Guidelines

### DO

1. **Check both isPending and data** - Always use `isPending || !data` for query loading checks
2. **Use skeletons for data loading** - Queries, initial loads, pagination, filtering
3. **Use loaders for user actions** - Mutations, form submissions, confirmations
4. **Match skeleton structure** - Skeleton should mirror final UI layout
5. **Disable during mutations** - Disable buttons and inputs when `isPending`
6. **Update button text** - Show action in progress ("Saving...", "Deleting...")
7. **Standard loader size** - Use `h-4 w-4` for inline loaders
8. **Position loader before text** - `mr-2` spacing between loader and text
9. **Import from lucide-react** - Use `<Loader2 />` for consistency
10. **Disable cancel actions** - Disable cancel/close buttons during mutations
11. **Handle all states** - Error, loading, data, refetch states

### DON'T

1. **Don't check only isPending** - Always use `isPending || !data` to ensure data exists before rendering
2. **Don't use loaders for queries** - Use skeletons instead
3. **Don't use skeletons for mutations** - Use inline loaders instead
4. **Don't show skeletons with data** - Replace skeleton completely with data
5. **Don't forget to disable** - Always disable interactive elements during mutations
6. **Don't use generic "Loading..."** - Use action-specific text
7. **Don't skip loader icon** - Always show `<Loader2>` with loading text
8. **Don't block UI unnecessarily** - Background refetch can show data + indicator
9. **Don't use different loader icons** - Stick to `<Loader2>` for consistency
10. **Don't forget error states** - Handle query errors before showing skeleton
11. **Don't allow duplicate submissions** - Disable buttons during `isPending`

## Skeleton Design Principles

### Match Layout Structure

Skeleton should replicate:
- Grid layouts
- Table rows and columns
- Card structures
- List items
- Headers and sections

### Use Appropriate Shapes

| Content Type | Skeleton Shape | Class |
|--------------|----------------|-------|
| Text (single line) | Rectangle | `h-4 w-[width]` |
| Text (multi-line) | Multiple rectangles | `space-y-2` |
| Avatar/Image | Square or circle | `rounded-md` or `rounded-full` |
| Button | Rounded rectangle | `h-9 w-[width] rounded-md` |
| Badge | Small rounded rect | `h-5 w-[width] rounded-full` |
| Card | Container with padding | `rounded-lg border p-4` |

### Skeleton Row Count

**Table/List skeletons:**
- Use 5-10 rows for tables
- Use 3-6 items for card grids
- Match typical page size for lists

**Why:** Enough to show pattern without overwhelming, similar to actual data volume.

## Loading Text Conventions

### Standard Patterns

**Present continuous form:**
- "Creating..." (not "Create...")
- "Saving..." (not "Save...")
- "Deleting..." (not "Delete...")
- "Publishing..." (not "Publish...")

**Consistency:**
- Always use "..." (ellipsis)
- Always capitalize first letter
- Keep brief (1-2 words max)

### Context-Specific Text

**Bulk operations:**
```typescript
// Show count when relevant
`Publishing ${count} models...`
`Deleting ${count} items...`
```

**Multi-step operations:**
```typescript
// Show current step
"Uploading..." → "Processing..." → "Finalizing..."
```

## React Query States Reference

### Query States

| State | Property | When | UI Treatment |
|-------|----------|------|--------------|
| Initial load | `isPending` or `!data` | First fetch, no data | Show skeleton |
| Refetch | `isFetching && !isPending` | Background refetch | Optional indicator |
| Error | `isError` or `error` | Query failed | Show error message |
| Success | `isSuccess` and `data` | Data loaded | Show data |

### Mutation States

| State | Property | When | UI Treatment |
|-------|----------|------|--------------|
| Idle | `isIdle` | Before mutate() | Normal state |
| Pending | `isPending` | During mutation | Loader + disabled + text |
| Error | `isError` | Mutation failed | Toast error |
| Success | `isSuccess` | Mutation succeeded | Toast success |

## Benefits

✅ **Consistent UX** - Same patterns across all loading states
✅ **Layout stability** - Skeletons prevent layout shifts
✅ **Immediate feedback** - Loaders show action is processing
✅ **Prevent errors** - Disabled states prevent duplicate actions
✅ **Professional polish** - Loading states improve perceived performance
✅ **User confidence** - Clear feedback builds trust
✅ **Accessibility** - Disabled states communicate system status

## Related Patterns

- **Client-Side Mutations**: `context/client-side-mutations.md` (mutation loading states)
- **React Query Hooks**: `context/react-query-hooks.md` (query states and patterns)
- **Component Organization**: `context/component-organization.md` (skeleton file placement)
