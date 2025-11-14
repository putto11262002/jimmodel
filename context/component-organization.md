---
title: "Component Organization Pattern"
description: "Defines component file naming conventions and placement strategy across the codebase."
---

# Component Organization Pattern

## File Naming Convention

**Use kebab-case for all component files:**
- ✅ `date-picker.tsx`, `delete-confirm-dialog.tsx`, `admin-sidebar.tsx`
- ❌ `DatePicker.tsx`, `DeleteConfirmDialog.tsx`, `AdminSidebar.tsx`

## Component Placement Rules

### Decision Tree

```
Is the component feature-specific?
│
├─ NO (Generic UI) → components/<component-name>.tsx
│   Examples: components/date-picker.tsx
│             components/delete-confirm-dialog.tsx
│             components/array-input.tsx
│
└─ YES → Does route structure reflect the feature?
    │
    ├─ NO → components/<feature>/<component-name>.tsx
    │   Examples: components/models/model-card.tsx
    │             components/auth/login-form.tsx
    │
    └─ YES → Is it route/page-specific?
        │
        ├─ NO (App scope) → app/(<scope>)/<highest-shared-level>/_components/
        │   │
        │   ├─ Admin-wide → app/(admin)/admin/_components/
        │   │   Examples: app/(admin)/admin/_components/admin-sidebar.tsx
        │   │             app/(admin)/admin/_components/page-header/
        │   │
        │   └─ Public-wide → app/(public)/_components/
        │       Examples: app/(public)/_components/public-navbar.tsx
        │
        └─ YES → app/(...)/[route]/_components/ (at highest shared child level)
            Examples: app/(admin)/admin/models/_components/models-table.tsx
                      app/(admin)/admin/@content/models/new/_components/basic-information-step.tsx
```

## Placement Strategy

### 1. Generic UI Components
**Location:** `components/<component-name>.tsx`

**Criteria:**
- No feature, route, or application scope
- Reusable across entire application
- Generic wrappers around shadcn/ui or custom UI elements

**Examples:**
- `components/date-picker.tsx` - Generic date picker wrapper
- `components/array-input.tsx` - Generic array input field
- `components/delete-confirm-dialog.tsx` - Generic confirmation dialog

---

### 2. Feature-Specific Components (No Route Match)
**Location:** `components/<feature>/<component-name>.tsx`

**Criteria:**
- Feature-specific logic (e.g., models, products, users)
- Route structure DOES NOT reflect the feature
- Reusable across different route contexts

**Examples:**
- `components/models/model-card.tsx` - Display model info anywhere
- `components/models/model-filters.tsx` - Model filtering logic (if used outside /models)
- `components/auth/login-form.tsx` - Login form used in modal or page

**Note:** If route structure matches feature (e.g., `/models` route exists), use route-based placement instead.

---

### 3. Route/Page-Specific Components
**Location:** `app/(...)/[route]/_components/`

**Placement Rule:** Place at **highest route level where children share the component**

#### 3a. Application Scope (Admin/Public)
**Location:** `app/(<scope>)/<highest-level>/_components/`

**Admin-wide components:**
- Location: `app/(admin)/admin/_components/`
- Examples:
  - `admin-sidebar.tsx` - Used in `app/(admin)/layout.tsx`
  - `page-header/index.tsx` - Used across multiple `@header` slots

**Public-wide components:**
- Location: `app/(public)/_components/`
- Examples:
  - `public-footer.tsx` - Used in public layout

#### 3b. Route Segment Shared Components
**Location:** `app/(...)/[segment]/_components/`

**Criteria:**
- Used by multiple child routes within segment
- Shared across list/detail/new pages
- Segment-specific logic

**Examples:**
- `app/(admin)/admin/models/_components/models-table.tsx`
  - Used in: `@content/models/page.tsx`
- `app/(admin)/admin/models/_components/model-form.tsx`
  - Used in: `@content/models/[id]/page.tsx`

#### 3c. Single Page/Route Components
**Location:** `app/(...)/[segment]/[route]/_components/`

**Criteria:**
- Only used by ONE specific page
- Form step components for multi-step forms
- Tightly coupled to page logic

**Examples:**
- `app/(admin)/admin/@content/models/new/_components/basic-information-step.tsx`
  - Only used in: `app/(admin)/admin/@content/models/new/page.tsx`
- `app/(admin)/admin/@content/models/new/_components/career-details-step.tsx`
  - Only used in: `app/(admin)/admin/@content/models/new/page.tsx`

**Parallel Routes:** Components stay within their parallel route folder (`@content`, `@header`, etc.)

---

## Quick Reference

| Component Type | Location | Example |
|---------------|----------|---------|
| Generic UI | `components/<name>.tsx` | `components/date-picker.tsx` |
| Feature (no route) | `components/<feature>/<name>.tsx` | `components/models/model-card.tsx` |
| Admin-wide | `app/(admin)/admin/_components/` | `admin-sidebar.tsx` |
| Route segment shared | `app/(...)/[segment]/_components/` | `models/_components/models-table.tsx` |
| Single page | `app/(...)/[route]/_components/` | `new/_components/basic-info-step.tsx` |

---

## Import Path Principles

1. **Always use absolute imports** via `@/` alias
2. **No relative path traversal** (avoid `../../../`)
3. **Generic components** imported from `@/components/`
4. **Route components** imported from same or parent `_components/`

**Examples:**
```tsx
// Generic UI
import { DatePicker } from "@/components/date-picker";

// Feature component
import { ModelCard } from "@/components/models/model-card";

// Admin-wide
import { AdminSidebar } from "@/app/(admin)/admin/_components/admin-sidebar";

// Route segment
import { ModelsTable } from "../../models/_components/models-table";
```

---

## Migration Checklist

When reorganizing components:

1. ✅ Identify component scope (generic, feature, route)
2. ✅ Determine highest shared level for route components
3. ✅ Rename to kebab-case
4. ✅ Move to appropriate location
5. ✅ Update all import paths
6. ✅ Verify no broken imports
7. ✅ Test application functionality
