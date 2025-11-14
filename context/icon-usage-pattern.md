---
title: "Icon Usage Pattern"
description: "Conventions for using icons in buttons, actions, and UI elements with Lucide React"
---

# Icon Usage Pattern

## Overview

This pattern defines consistent icon usage across the application using Lucide React icons. Icons enhance UI clarity by providing visual context for actions, states, and navigation. Proper icon selection, sizing, and placement ensure intuitive user experience and accessible interfaces.

## Core Principles

### 1. Use Lucide React Icons

**Icon library:** `lucide-react`

All icons come from Lucide React for consistency, tree-shaking, and TypeScript support.

```typescript
import { Trash2, Eye, EyeOff, Edit, Plus, X } from "lucide-react";
```

**Why Lucide:**
- Consistent design language
- Tree-shakeable (only import what you use)
- Full TypeScript support
- Optimized SVG icons
- Regular updates and comprehensive set

### 2. Icon-Only vs. Icon + Text

**Use icon-only buttons when:**
- Space is constrained (toolbars, table actions)
- Action is universally understood (delete, edit, close)
- Icons are in groups with similar actions
- Tooltips provide text description

**Use icon + text when:**
- Primary actions (submit forms, create new)
- Actions may be ambiguous
- Call-to-action buttons
- First-time user flows

### 3. Standard Sizes

**Size guidelines:**
- **Small actions** (table rows, compact UI): `h-4 w-4`
- **Standard buttons**: `h-4 w-4` or `h-5 w-5`
- **Large buttons**: `h-5 w-5` or `h-6 w-6`
- **Headers/titles**: `h-5 w-5` or `h-6 w-6`

### 4. Accessibility

**Always provide:**
- `title` attribute for icon-only buttons
- `aria-label` for screen readers when appropriate
- Semantic button variants (`variant="destructive"` for delete)
- Sufficient color contrast

### 5. Consistent Icon Selection

Use the same icon for the same action throughout the app.

## Icon Conventions by Action

### CRUD Operations

| Action | Icon | Usage |
|--------|------|-------|
| Create/Add | `<Plus>` | Create new items, add to list |
| Read/View | `<Eye>` | View details, show content |
| Edit/Update | `<Edit>` or `<Pencil>` | Edit existing items |
| Delete | `<Trash2>` | Delete items (always destructive variant) |
| Save | `<Check>` or `<Save>` | Save changes, confirm |
| Cancel | `<X>` | Cancel action, close dialog |

### Visibility/Publishing

| Action | Icon | Usage |
|--------|------|-------|
| Publish | `<Eye>` | Make public, publish content |
| Unpublish | `<EyeOff>` | Make private, unpublish |
| Show | `<Eye>` | Reveal hidden content |
| Hide | `<EyeOff>` | Hide visible content |

### Navigation

| Action | Icon | Usage |
|--------|------|-------|
| Next/Forward | `<ChevronRight>` | Navigate forward, next page |
| Previous/Back | `<ChevronLeft>` | Navigate back, previous page |
| Up | `<ChevronUp>` | Scroll up, collapse |
| Down | `<ChevronDown>` | Scroll down, expand |
| External Link | `<ExternalLink>` | Open in new tab |

### Status/Feedback

| Action | Icon | Usage |
|--------|------|-------|
| Success | `<Check>` or `<CheckCircle>` | Success state, completed |
| Error | `<X>` or `<XCircle>` | Error state, failed |
| Warning | `<AlertTriangle>` | Warning state, caution |
| Info | `<Info>` or `<InfoCircle>` | Information, help |
| Loading | `<Loader2>` | Loading state (with `animate-spin`) |

### Content

| Action | Icon | Usage |
|--------|------|-------|
| Search | `<Search>` | Search input, find |
| Filter | `<Filter>` | Filter options |
| Sort | `<ArrowUpDown>` | Sort column |
| Upload | `<Upload>` | Upload files |
| Download | `<Download>` | Download files |
| Settings | `<Settings>` | Settings, preferences |
| More Options | `<MoreHorizontal>` or `<MoreVertical>` | Dropdown menu |

## Button Patterns

### Icon-Only Buttons

**Pattern:** Standard size icon buttons

```typescript
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

// Standard icon button
<Button variant="ghost" size="icon" title="Edit model">
  <Edit className="h-4 w-4" />
</Button>

// Destructive icon button
<Button variant="destructive" size="icon" title="Delete model">
  <Trash2 className="h-4 w-4" />
</Button>

// Outline icon button
<Button variant="outline" size="icon" title="View details">
  <Eye className="h-4 w-4" />
</Button>
```

**Key components:**
- `size="icon"` - Square button for icon-only
- `title` attribute - Tooltip/accessibility
- Icon with `h-4 w-4` or `h-5 w-5` - Consistent sizing
- Semantic variant - Matches action purpose

### Icon + Text Buttons

**Pattern:** Icon before text with spacing

```typescript
import { Plus, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Primary action
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Create Model
</Button>

// Secondary action
<Button variant="outline">
  <Download className="mr-2 h-4 w-4" />
  Export
</Button>

// Save button
<Button type="submit">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
```

**Key components:**
- Icon before text - Left-to-right reading order
- `mr-2` spacing - Consistent gap between icon and text
- `h-4 w-4` - Standard icon size for text buttons
- Text describes action clearly

### Loading State Buttons

**Pattern:** Replace icon with spinner during loading

```typescript
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button type="submit" disabled={isPending}>
  {isPending ? (
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  ) : (
    <Save className="mr-2 h-4 w-4" />
  )}
  {isPending ? "Saving..." : "Save Changes"}
</Button>
```

**Key components:**
- Conditional icon - Spinner when pending, action icon when idle
- `animate-spin` - Animation for loader
- Disabled state - `disabled={isPending}`
- Updated text - Reflects current state

**See:** `context/loading-states-pattern.md` for complete loading state patterns

### Bulk Action Buttons

**Pattern:** Icon-only with selection count

```typescript
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

<div className="flex items-center gap-2">
  <span className="text-sm text-muted-foreground">
    {selectedIds.length} selected
  </span>

  <Button
    variant="outline"
    size="icon"
    onClick={() => handleBulkPublish(true)}
    disabled={isPending}
    title="Publish selected"
  >
    {isPending ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Eye className="h-4 w-4" />
    )}
  </Button>

  <Button
    variant="outline"
    size="icon"
    onClick={() => handleBulkPublish(false)}
    disabled={isPending}
    title="Unpublish selected"
  >
    {isPending ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <EyeOff className="h-4 w-4" />
    )}
  </Button>

  <Button
    variant="destructive"
    size="icon"
    onClick={handleBulkDelete}
    disabled={isPending}
    title="Delete selected"
  >
    {isPending ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Trash2 className="h-4 w-4" />
    )}
  </Button>
</div>
```

**Key components:**
- Selection count - Shows number of selected items
- Icon-only buttons - Compact for multiple actions
- Loading states - Spinner during pending
- Tooltips - `title` attribute for each action
- Destructive variant - For delete action

## Dropdown Menu Items

### Menu with Icons

**Pattern:** Icon before menu item text

```typescript
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleTogglePublish}>
      {published ? (
        <>
          <EyeOff className="mr-2 h-4 w-4" />
          Unpublish
        </>
      ) : (
        <>
          <Eye className="mr-2 h-4 w-4" />
          Publish
        </>
      )}
    </DropdownMenuItem>
    <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Key components:**
- `<MoreHorizontal>` trigger - Standard for more options
- Icon before text - `mr-2` spacing
- Conditional icons - Show based on state
- `text-destructive` class - For delete items (not variant)

## Table Actions

### Inline Action Buttons

**Pattern:** Icon-only buttons in action column

```typescript
import { Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

<TableCell className="text-right">
  <div className="flex items-center justify-end gap-2">
    <Link href={`/admin/models/${model.id}`}>
      <Button variant="ghost" size="icon" title="Edit model">
        <Edit className="h-4 w-4" />
      </Button>
    </Link>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="More options">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {/* Menu items... */}
    </DropdownMenu>
  </div>
</TableCell>
```

**Key components:**
- Icon-only buttons - Compact for table rows
- `variant="ghost"` - Subtle in table context
- Tooltips - `title` for each action
- Right-aligned - Standard for action column

### Sortable Column Headers

**Pattern:** Sort icon with column name

```typescript
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

<TableHead>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleSort("name")}
    className="hover:bg-transparent"
  >
    Name
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
</TableHead>
```

**Key components:**
- `<ArrowUpDown>` - Universal sort indicator
- Icon after text - `ml-2` spacing
- Ghost button - Blends with header
- `h-4 w-4` - Standard small size

## Alert and Status Icons

### Alert Messages

**Pattern:** Icon with alert content

```typescript
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Error alert
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to load models: {error.message}
  </AlertDescription>
</Alert>

// Success alert
<Alert>
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Model created successfully
  </AlertDescription>
</Alert>

// Warning alert
<Alert>
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    This action cannot be undone
  </AlertDescription>
</Alert>

// Info alert
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    Select items to enable bulk actions
  </AlertDescription>
</Alert>
```

**Key components:**
- Semantic icons - Match alert type
- `h-4 w-4` - Standard size for alerts
- Icon before title - Visual hierarchy
- Alert variant - Controls color scheme

## Common Workflows

### Workflow 1: Add Icon to Button

1. Import icon from `lucide-react`
2. Determine button type (icon-only or icon + text)
3. Use `size="icon"` for icon-only buttons
4. Apply `h-4 w-4` or `h-5 w-5` to icon
5. Add `mr-2` spacing for icon + text buttons
6. Add `title` attribute for icon-only buttons
7. Use semantic variant (`destructive`, `outline`, `ghost`)

### Workflow 2: Add Loading State to Icon Button

1. Import `<Loader2>` from `lucide-react`
2. Get pending state from mutation: `mutation.isPending`
3. Conditionally render: spinner when pending, action icon when idle
4. Add `animate-spin` to `<Loader2>`
5. Disable button when `isPending`
6. Update button text if applicable

### Workflow 3: Create Dropdown Menu with Icons

1. Import menu icons and `<MoreHorizontal>`
2. Use `<MoreHorizontal>` for trigger button
3. Add icons to each `<DropdownMenuItem>`
4. Apply `mr-2` spacing to menu item icons
5. Use `h-4 w-4` sizing
6. Apply `text-destructive` class to destructive items

### Workflow 4: Add Icons to Table Actions

1. Create action column with `className="text-right"`
2. Wrap buttons in flex container: `flex items-center justify-end gap-2`
3. Use icon-only buttons with `size="icon"` and `variant="ghost"`
4. Add `title` attribute to each button
5. Include dropdown for additional actions

## Guidelines

### DO

1. **Use Lucide React** - Import from `lucide-react` for all icons
2. **Consistent sizing** - Use `h-4 w-4` for most actions
3. **Add tooltips** - Always include `title` for icon-only buttons
4. **Semantic variants** - Use `destructive` for delete actions
5. **Icon before text** - Left-to-right reading order
6. **Standard spacing** - Use `mr-2` for icon-text gap
7. **Loading states** - Replace icon with `<Loader2 animate-spin>`
8. **Semantic icons** - Use same icon for same action everywhere
9. **Accessibility** - Provide text alternatives
10. **Tree-shake** - Import only icons you use

### DON'T

1. **Don't mix libraries** - Always use Lucide React, never mix with other icon sets
2. **Don't use custom sizes** - Stick to `h-4 w-4` or `h-5 w-5`
3. **Don't skip tooltips** - Icon-only buttons must have `title`
4. **Don't use wrong variants** - Delete should always be `destructive`
5. **Don't put text before icons** - Icons come first in reading order
6. **Don't forget spacing** - Always add `mr-2` for icon + text
7. **Don't use static loaders** - Always `animate-spin` on `<Loader2>`
8. **Don't use different icons** - Same action = same icon everywhere
9. **Don't skip disabled state** - Disable buttons during mutations
10. **Don't import default** - Use named imports for tree-shaking

## Icon Size Reference

| Context | Size Class | Pixel Size | Usage |
|---------|-----------|------------|-------|
| Small actions | `h-4 w-4` | 16×16px | Table actions, compact UI |
| Standard buttons | `h-4 w-4` | 16×16px | Most buttons |
| Standard buttons | `h-5 w-5` | 20×20px | Slightly larger buttons |
| Large buttons | `h-6 w-6` | 24×24px | Primary actions, headers |
| Alerts | `h-4 w-4` | 16×16px | Alert indicators |
| Menu items | `h-4 w-4` | 16×16px | Dropdown menu icons |

## Common Icon Imports

```typescript
// CRUD operations
import { Plus, Eye, Edit, Pencil, Trash2, Save, X } from "lucide-react";

// Visibility
import { Eye, EyeOff } from "lucide-react";

// Navigation
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";

// Status
import { Check, CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

// Actions
import { Search, Filter, ArrowUpDown, Upload, Download, Settings } from "lucide-react";

// Menus
import { MoreHorizontal, MoreVertical } from "lucide-react";
```

## Benefits

✅ **Visual clarity** - Icons provide immediate visual context
✅ **Space efficiency** - Icon-only buttons save horizontal space
✅ **Consistency** - Same icons for same actions across app
✅ **Accessibility** - Tooltips and semantic variants
✅ **Professional** - Polished, modern interface
✅ **Tree-shakeable** - Only bundle icons you use
✅ **Type-safe** - Full TypeScript support
✅ **Maintainable** - Clear conventions and patterns

## Related Patterns

- **Loading States**: `context/loading-states-pattern.md` (icon usage in loading states)
- **Client-Side Mutations**: `context/client-side-mutations.md` (icons in mutation buttons)
- **Client-Side Queries**: `context/client-side-queries.md` (icons in query states)
