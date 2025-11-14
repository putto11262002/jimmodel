---
title: "UI Component Conventions"
description: "Usage conventions and gotchas for shadcn/ui components in this project."
---

# UI Component Conventions

## Overview

This document contains component-specific conventions, gotchas, and usage patterns for shadcn/ui components. These are practical reminders for developers working with UI components in this codebase.

## Core Principles

### 1. Explicit Sizing

Many shadcn components have auto-sizing behavior that requires explicit width definitions.

### 2. Consistent Token Usage

Always use shadcn design tokens (e.g., `bg-primary`, `text-muted-foreground`) before raw Tailwind classes.

### 3. Accessibility First

Follow shadcn's built-in accessibility patterns without modifications.

## Component-Specific Conventions

### Select Component

**Width Behavior:**
The `SelectTrigger` component has `w-auto` by default, causing it to size based on content rather than its container.

**Convention:**
- **Always define explicit width** on `SelectTrigger` when using Select components
- Use `w-full` if the select should fill its parent container
- Use specific widths (`w-[200px]`, `w-64`) for fixed-size selects

**Example (Full Width):**
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Example (Fixed Width):**
```tsx
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="tech">Technology</SelectItem>
    <SelectItem value="design">Design</SelectItem>
  </SelectContent>
</Select>
```

**Why:** Without explicit width, the select trigger will size to its content, causing layout inconsistencies and unexpected wrapping behavior.

## Guidelines

### DO

1. **Define SelectTrigger width** - Always add `className="w-full"` or specific width
2. **Use design tokens first** - Reach for `bg-primary`, `text-muted-foreground` before raw colors
3. **Preserve accessibility** - Don't remove ARIA attributes or keyboard navigation
4. **Test interactivity** - Verify all interactive states (hover, focus, disabled)
5. **Check responsive behavior** - Ensure components work on mobile screens

### DON'T

1. **Don't omit SelectTrigger width** - Leads to unpredictable sizing
2. **Don't use raw Tailwind colors** - Use shadcn tokens for consistency
3. **Don't modify component internals** - Extend via composition instead
4. **Don't skip testing states** - Always test hover, focus, active, disabled states
5. **Don't ignore mobile** - Test touch interactions and viewport sizes

## Common Workflows

### Workflow 1: Adding a Select to a Form

1. Import Select components from `@/components/ui/select`
2. Add `SelectTrigger` with explicit width class (`w-full` or specific)
3. Add `SelectValue` with appropriate placeholder
4. Add `SelectContent` with `SelectItem` options
5. Wire up to form state/validation

### Workflow 2: Creating Responsive Selects

1. Define mobile-first width: `className="w-full"`
2. Add responsive overrides if needed: `sm:w-[200px] md:w-[300px]`
3. Test on multiple screen sizes
4. Verify dropdown positioning on small screens

## Examples

### Example 1: Form Select (Full Width)

```tsx
// app/(admin)/models/new/_components/model-form.tsx
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

export function ModelForm() {
  const form = useForm();

  return (
    <form>
      <div className="space-y-2">
        <label>Gender</label>
        <Select onValueChange={(value) => form.setValue("gender", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
```

**Why:** Form inputs should fill their container for consistent layout.

### Example 2: Inline Filter Select (Fixed Width)

```tsx
// app/(admin)/models/_components/model-filters.tsx
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ModelFilters() {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select defaultValue="createdAt">
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Recently Added</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="updatedAt">Last Updated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

**Why:** Inline filters benefit from fixed widths to maintain compact layouts.

### Example 3: Responsive Select

```tsx
// Mobile-first, grows on larger screens
<Select>
  <SelectTrigger className="w-full sm:w-[200px] lg:w-[300px]">
    <SelectValue placeholder="Choose option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Why:** Responsive widths adapt to different screen sizes while maintaining control.

## Benefits

- **Consistent layouts** - Explicit widths prevent unexpected component sizing
- **Predictable behavior** - Developers know components won't auto-size unpredictably
- **Better mobile UX** - Explicit widths work better on small screens
- **Easier maintenance** - Clear conventions reduce debugging time

## Related Patterns

- **UI Validation Pattern**: `context/ui-validation-pattern.md` (form validation)
- **Component Organization**: `context/component-organization.md` (file placement)
- **UI Skill**: `.claude/skills/ui/SKILL.md` (general UI implementation)
