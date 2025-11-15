---
title: "Component Spacing Architecture"
description: "Convention for managing spacing, padding, and layout control between components and their parent containers"
---

# Component Spacing Architecture

## Overview

Components are purely presentational and do not control their own layout spacing. Parent containers control all composition spacing (padding, margins, gaps between sections) via the `className` prop. Components retain only semantic spacing that defines their internal structure.

## Core Principles

### 1. Components Own Semantic Spacing

Spacing that defines internal component structure stays within the component:
- Gap between label and value in a form field (`space-y-1`)
- Spacing between grid items (`gap-4`)
- Spacing between list items (`space-y-2`)
- Internal card padding between border and content (`p-6`)
- Gap between icon and text in a button (`gap-2`)

### 2. Parents Own Composition Spacing

Spacing that controls layout and composition belongs to the parent:
- Section padding (`py-*`, `px-*`)
- Margins between components (`mb-*`, `mt-*`)
- Spacing between sibling sections (`space-y-*`)
- Background colors and container styling

### 3. className Prop for Flexibility

All reusable components accept an optional `className` prop to allow parent control of outer spacing and styling.

### 4. No Hardcoded Layout

Components must not include hardcoded layout spacing at their root level. Remove `py-*`, `px-*` padding and `space-y-*` between major sections from component roots. Backgrounds and containers belong to parents.

## Decision Tree

```
Does this spacing define the component's internal structure?
│
├─ YES (Semantic)
│   Examples: label→value gap, grid/flex item spacing, list item spacing, internal padding
│   → Keep in component (use gap-*, space-y-*, internal p-*)
│
└─ NO (Composition)
    Examples: section padding, margins, spacing between major sections
    → Parent controls via className prop
```

## Common Workflows

### Workflow 1: Refactor Existing Component

1. Read the component file to understand current spacing
2. Identify semantic vs composition spacing
3. Remove composition spacing (`py-*`, `px-*`) from component root
4. Remove `space-y-*` between major sections (use `gap-*` or move to parent)
5. Keep `space-y-*` / `gap-*` for internal items (lists, label-value pairs)
6. Add `className?: string` to component props
7. Apply `className` to root element
8. Move removed spacing to parent components

### Workflow 2: Create New Component

1. Build component structure without any root-level spacing
2. Add semantic spacing only (gaps, internal padding)
3. Add `className?: string` to props interface
4. Apply to root element: `<div className={className}>`
5. Parent controls all composition spacing

### Workflow 3: Compose Components in Parent

1. Import component from `_components/`
2. Add wrapper with desired padding/spacing
3. Pass spacing classes via `className` prop
4. Control background, container width, and layout

## Guidelines

### DO

1. **Add className prop** - All reusable components accept optional `className`
2. **Use gap/space-y for internal items** - `gap-4` in grids, `space-y-2` in lists is semantic
3. **Keep label-value spacing** - `space-y-1` between label and input is semantic
4. **Keep list item spacing** - `space-y-2` between list items is semantic
5. **Parent controls padding** - Wrapper divs in parent add `py-*`, `px-*`

### DON'T

1. **Don't add root padding** - No `py-*`, `px-*` at component root element
2. **Don't use space-y between sections** - Spacing between major sections goes to parent
3. **Don't add containers** - No `container mx-auto` in components
4. **Don't add backgrounds** - No `bg-gradient-to-b` in components
5. **Don't affect siblings** - Internal spacing only, never margin/spacing that affects siblings

## Examples

### Example 1: Component with className Prop

```typescript
interface ProfileSectionProps {
  model: Model;
  className?: string;
}

export function ProfileSection({ model, className }: ProfileSectionProps) {
  return (
    <div className={className}>
      {/* Component content - no root padding/spacing */}
      <div className="flex flex-col gap-4">
        <h1>{model.name}</h1>
        <p>{model.bio}</p>
      </div>
    </div>
  );
}
```

**Why:** Component accepts `className`, uses `gap-4` for internal spacing only.

### Example 2: Parent Controls Composition

```typescript
// Parent route file
export default function Page() {
  return (
    <div className="bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <ProfileSection model={model} />
        </div>
      </div>
    </div>
  );
}
```

**Why:** Parent controls background, padding, spacing, max-width.

### Example 3: Semantic Spacing (Keep in Component)

```typescript
// Stats grid - gap between items is semantic
<div className="grid grid-cols-2 gap-4 p-6 rounded-lg border">
  <StatItem label="Age" value={age} />
  <StatItem label="Height" value={height} />
</div>

// List items - space-y between items is semantic
<ul className="space-y-2 p-4 rounded-lg border">
  {experiences.map((exp) => <li key={exp}>{exp}</li>)}
</ul>

// Label-value pair - space-y is semantic
<div className="space-y-1">
  <label>Name</label>
  <input />
</div>
```

**Why:** These spacings define internal structure, don't affect siblings.

### Example 4: Before/After Refactoring

**Before:**
```typescript
export function ModelProfile({ model }: Props) {
  return (
    <div className="bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Content */}
        </div>
      </div>
    </div>
  );
}
```

**After:**
```typescript
export function ModelProfile({ model, className }: Props) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-6">
        {/* Content */}
      </div>
    </div>
  );
}

// Parent controls spacing
<div className="bg-gradient-to-b from-background to-muted/20">
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-7xl mx-auto">
      <ModelProfile model={model} />
    </div>
  </div>
</div>
```

**Why:** Component is now reusable, parent controls all layout.

## Semantic vs Composition Reference

| Spacing Type | Location | Example |
|--------------|----------|---------|
| Label → Value | Component | `space-y-1` |
| Grid items | Component | `gap-4` |
| List items | Component | `space-y-2` |
| Internal card padding | Component | `p-6` |
| Section padding | Parent | `py-8` |
| Component margins | Parent | `mb-6` |
| Between major sections | Parent | `space-y-8` or `gap-8` |

## Benefits

- **Reusability** - Components work in any context
- **Flexibility** - Parents control composition without editing components
- **Maintainability** - Spacing changes happen in one place (parent)
- **Consistency** - Clear separation of concerns
- **Testability** - Components are pure presentation

## Related Patterns

- **Component Organization**: `context/component-organization.md` (placement rules)
- **Implementation**: See refactored files in `app/(public)/models/profile/[id]/_components/`
