---
title: "UI Validation Pattern"
description: "Defines validation schema organization and placement strategy in the UI layer using Zod."
---

# UI Validation Pattern

## Overview

This document defines the standardized pattern for defining and organizing validation schemas in the UI layer (`app/` directory). The pattern ensures proper separation of concerns, minimizes duplication, and provides clear guidelines for validator placement and composition.

## Core Principles

### 1. Reference Action Validators When Data Flows to Actions

**When to derive from action validators:**
- UI data flows to server actions
- UI data has dependencies on other layers (core services, database)
- UI validation needs to match server-side validation

**How to derive:**
Use Zod's composition methods to extend or modify action validators:
- `.pick()` - Select specific fields
- `.omit()` - Exclude specific fields
- `.extend()` - Add new fields
- `.partial()` - Make fields optional
- `.required()` - Make fields required
- `.merge()` or `.and()` - Combine schemas

### 2. Independent Validators for UI-Only Data

**When to define brand new schemas:**
- Data is purely UI state (no action or layer dependency)
- No data flow to server actions
- Component-specific local state

**Examples of UI-only data:**
- Filter states (search queries, sort order, visibility toggles)
- UI preferences (theme, layout mode, collapsed states)
- Local form state (wizard progress, temporary selections)
- Component-specific validation (password strength meter, live search)

### 3. Form Input Type Coercion

**The HTML Form Problem:**
HTML form inputs always return string values, even for numeric and date inputs. This creates a mismatch with action validators that expect proper types.

**When to use coercion:**
- Number inputs (`<input type="number">`) → Returns string, needs `z.coerce.number()`
- Date inputs (`<input type="date">`) → Returns string, needs `z.coerce.date()`
- Checkbox inputs → May need `z.coerce.boolean()`
- Select with numeric values → Needs `z.coerce.number()`

**Pattern: Apply coercion when deriving for forms:**

```typescript
// Action validator (strict types)
export const createModelSchema = z.object({
  age: z.number().int().positive(),
  height: z.number().positive(),
  dateOfBirth: z.date(),
});

// UI form validator (with coercion)
export const createModelFormSchema = createModelSchema.extend({
  age: z.coerce.number().int().positive(),
  height: z.coerce.number().positive(),
  dateOfBirth: z.coerce.date(),
});
```

**When NOT to use coercion:**
- Programmatic data (already typed correctly)
- API responses (use proper types)
- Non-form UI state (e.g., filter state managed in React state)

**Key principle:** Coercion is a form-specific concern. Don't add it to action validators—keep action validators type-strict, and apply coercion only in form-facing UI validators.

### 4. Validator Location by Scope (Bottom-Up Approach)

**Always start at the lowest level (page), move up only when sharing is needed.**

**Hierarchy (from most specific to most general):**
1. **Page-level**: `app/<route>/page/_validators.ts` - Only used by this page
2. **Route-level**: `app/<route>/_validators.ts` - Shared by child routes
3. **Route-group-level**: `app/(group)/_validators.ts` - Shared within route group
4. **Global UI**: `app/_validators.ts` - Shared across entire app

**Migration strategy:**
- Start: Define validator at page level
- Later: When siblings need it → move to parent route level
- Later: When route group needs it → move to route group level
- Last resort: When app-wide → move to global level

### 5. Component Co-location

**Same bottom-up approach applies to components:**
- Start: `app/<route>/page/_components/`
- Move up: `app/<route>/_components/` when siblings share
- Move up: `app/(group)/_components/` when route group shares
- Move up: `components/` for truly global components

## Validator Scope Hierarchy

```
app/
├── _validators.ts                           # Global UI validators (shared app-wide)
│
├── (admin)/                                 # Route group
│   ├── _validators.ts                       # Shared across admin route group
│   │
│   ├── dashboard/
│   │   ├── _validators.ts                   # Shared by dashboard sub-routes
│   │   └── page.tsx
│   │
│   └── models/
│       ├── _validators.ts                   # Shared across model routes
│       │
│       ├── (rest)/
│       │   ├── new/
│       │   │   ├── _validators.ts           # Page-specific (START HERE)
│       │   │   ├── _components/             # Page-specific components
│       │   │   └── page.tsx
│       │   │
│       │   ├── [id]/
│       │   │   └── edit/
│       │   │       ├── _validators.ts       # Page-specific
│       │   │       └── page.tsx
│       │   │
│       │   └── page.tsx                     # List page
│       │
│       └── _components/                     # Shared by all model routes
│
└── (public)/
    ├── _validators.ts                       # Shared across public routes
    └── ...
```

## Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│ Need validation in UI component/page?                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │ Does data flow to server action       │
        │ OR have layer dependency?             │
        └───────┬───────────────────────┬───────┘
                │                       │
               YES                     NO
                │                       │
                ▼                       ▼
    ┌─────────────────────┐   ┌──────────────────────┐
    │ Derive from action  │   │ Define brand new     │
    │ validators          │   │ schema (UI-only)     │
    └──────────┬──────────┘   └──────────┬───────────┘
               │                          │
               ▼                          │
    ┌──────────────────────┐             │
    │ Same schema?         │             │
    └─────┬────────────┬───┘             │
          │            │                 │
         YES          NO                 │
          │            │                 │
          ▼            ▼                 │
    ┌─────────┐  ┌─────────────┐        │
    │ Import  │  │ Extend with │        │
    │ directly│  │ .pick(),    │        │
    │         │  │ .omit(),    │        │
    │         │  │ .extend()   │        │
    └─────────┘  └─────────────┘        │
          │            │                 │
          └────────────┴─────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Where to define?             │
        └───────────────┬──────────────┘
                        │
            ┌───────────┼───────────┬──────────┐
            │           │           │          │
            ▼           ▼           ▼          ▼
    ┌────────────┐ ┌─────────┐ ┌─────────┐ ┌──────┐
    │ Page level │ │ Route   │ │ Group   │ │Global│
    │ (START)    │ │ level   │ │ level   │ │ UI   │
    └────────────┘ └─────────┘ └─────────┘ └──────┘
```

## Examples

### Example 1: Action-Derived Validators (Data Flows to Server)

**Scenario:** Multi-step form for creating a model. Data will be submitted to `createModel` server action.

```typescript
// app/(admin)/models/(rest)/new/_validators.ts
import { createModelSchema } from "@/actions/models/validator";

// Step 1: Basic Information
// Note: Using .extend() to add coercion for form inputs
export const step1Schema = createModelSchema.pick({
  name: true,
  nickName: true,
  gender: true,
  dateOfBirth: true,
  nationality: true,
  ethnicity: true,
}).extend({
  dateOfBirth: z.coerce.date(), // HTML date input returns string
});

export type Step1Input = z.infer<typeof step1Schema>;

// Step 2: Physical Attributes
// Note: Numeric fields need coercion for HTML form inputs
export const step2Schema = createModelSchema.pick({
  height: true,
  weight: true,
  hips: true,
  hairColor: true,
  eyeColor: true,
}).extend({
  height: z.coerce.number().positive(), // HTML number input returns string
  weight: z.coerce.number().positive(),
  hips: z.coerce.number().positive(),
});

export type Step2Input = z.infer<typeof step2Schema>;

// Step 3: Career Details
export const step3Schema = createModelSchema.pick({
  talents: true,
  experiences: true,
  bio: true,
});

export type Step3Input = z.infer<typeof step3Schema>;
```

**Why:** Data flows to `createModel` action, so we derive from `createModelSchema` to ensure consistency.

---

### Example 2: UI-Only Validators (No Action Dependency)

**Scenario:** Filter panel for model list page. Filter state is purely client-side, doesn't flow to actions.

```typescript
// app/(admin)/models/_validators.ts
import { z } from "zod";

// Filter state - purely UI, doesn't flow to actions
export const modelFilterSchema = z.object({
  searchQuery: z.string().optional(),
  showArchived: z.boolean().default(false),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  category: z.string().optional(),
});

export type ModelFilterState = z.infer<typeof modelFilterSchema>;
```

**Why:** This is UI state only, no dependency on action validators. Defined at route level (`models/`) because both list and detail pages might need it.

---

### Example 3: Extended Action Validator (Additional UI Fields)

**Scenario:** User registration form needs `confirmPassword` field for UI validation, but server action doesn't need it.

```typescript
// app/(public)/register/_validators.ts
import { createUserSchema } from "@/actions/users/validator";
import { z } from "zod";

// Extend action schema with UI-specific field
export const registrationFormSchema = createUserSchema.extend({
  confirmPassword: z.string().min(8, "Password confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegistrationFormInput = z.infer<typeof registrationFormSchema>;
```

**Why:** Base fields flow to action, but `confirmPassword` is UI-only. We extend the action schema rather than duplicate it.

---

### Example 4: Omit Sensitive Fields (Public Profile)

**Scenario:** Public profile edit page shouldn't allow editing sensitive fields like `role` or `permissions`.

```typescript
// app/(public)/profile/edit/_validators.ts
import { updateUserSchema } from "@/actions/users/validator";

// Remove sensitive fields for public profile
export const publicProfileSchema = updateUserSchema.omit({
  role: true,
  permissions: true,
  emailVerified: true,
});

export type PublicProfileInput = z.infer<typeof publicProfileSchema>;
```

**Why:** We want most fields from `updateUserSchema`, but need to restrict access to sensitive fields.

---

### Example 5: Partial Schema for Draft Save

**Scenario:** Blog post editor allows saving drafts with incomplete data.

```typescript
// app/(admin)/posts/new/_validators.ts
import { createPostSchema } from "@/actions/posts/validator";

// All fields optional for draft save
export const draftPostSchema = createPostSchema.partial();

// Full validation for publish
export const publishPostSchema = createPostSchema;

export type DraftPostInput = z.infer<typeof draftPostSchema>;
export type PublishPostInput = z.infer<typeof publishPostSchema>;
```

**Why:** Draft save has relaxed validation, but we still derive from the same base schema.

---

### Example 6: Form Number Input Coercion

**Scenario:** Product form with price and quantity fields. HTML number inputs return strings.

```typescript
// app/(admin)/products/new/_validators.ts
import { createProductSchema } from "@/actions/products/validator";
import { z } from "zod";

// Action schema expects proper number types
// export const createProductSchema = z.object({
//   name: z.string().min(1),
//   price: z.number().positive(),
//   quantity: z.number().int().nonnegative(),
//   discount: z.number().min(0).max(100).optional(),
// });

// Form validator with coercion for HTML inputs
export const productFormSchema = createProductSchema.extend({
  price: z.coerce.number().positive(),        // <input type="number"> returns string
  quantity: z.coerce.number().int().nonnegative(),
  discount: z.coerce.number().min(0).max(100).optional(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

// Usage in form component:
// const form = useForm<ProductFormInput>({
//   resolver: zodResolver(productFormSchema),
// });
```

**Why:** HTML number inputs return strings. Without `.coerce`, validation would fail. The action validator remains type-strict, while the form validator handles the string-to-number conversion.

**Alternative approach (when many fields need coercion):**
```typescript
// If most fields need coercion, rebuild the schema
export const productFormSchema = z.object({
  name: createProductSchema.shape.name,           // Reuse string validator
  price: z.coerce.number().positive(),            // Add coercion
  quantity: z.coerce.number().int().nonnegative(),
  discount: z.coerce.number().min(0).max(100).optional(),
});
```

---

### Example 7: Moving Validators Up the Tree

**Scenario:** Initially, search validation is only needed on the list page. Later, it's needed on detail pages too.

**Initially (page-level):**
```typescript
// app/(admin)/models/(rest)/page/_validators.ts
import { z } from "zod";

export const modelSearchSchema = z.object({
  query: z.string().min(1),
  filters: z.object({
    category: z.string().optional(),
    published: z.boolean().optional(),
  }),
});
```

**Later (route-level):**
```typescript
// Move to: app/(admin)/models/_validators.ts
import { z } from "zod";

// Now shared across all model routes
export const modelSearchSchema = z.object({
  query: z.string().min(1),
  filters: z.object({
    category: z.string().optional(),
    published: z.boolean().optional(),
  }),
});
```

**Why:** When multiple pages need the same validator, move it up to the nearest common parent.

---

### Example 8: Global UI Validator

**Scenario:** Pagination controls are used throughout the app.

```typescript
// app/_validators.ts
import { z } from "zod";

// Used by all list pages across the app
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// Theme preference (UI-only)
export const themeSchema = z.enum(["light", "dark", "system"]);

export type Theme = z.infer<typeof themeSchema>;
```

**Why:** These are truly app-wide UI validators with no specific feature ownership.

## Rules and Best Practices

### DO ✅

1. **Start at page level** - Always define validators in `_validators.ts` next to the page that needs them first
2. **Move up incrementally** - Only move validators to higher levels when sharing is actually needed
3. **Derive from action validators** - When data flows to server actions or has layer dependencies
4. **Define brand new schemas** - For purely UI data with no action/layer dependencies
5. **Use Zod composition** - `.pick()`, `.omit()`, `.extend()`, `.partial()`, `.required()`, `.merge()`
6. **Use `.coerce` for form inputs** - Apply type coercion when HTML form inputs return strings (numbers, dates, booleans)
7. **Export types** - Always export inferred types: `export type SchemaInput = z.infer<typeof schema>`
8. **Use underscore prefix** - Always name files `_validators.ts`
9. **Document why** - Add comments explaining why a validator is derived vs. independent
10. **Comment coercion usage** - Note why coercion is needed (e.g., "HTML number input returns string")

### DON'T ❌

1. **Don't prematurely optimize** - Don't put validators at higher levels "just in case"
2. **Don't duplicate logic** - Never recreate validation rules that exist in action validators
3. **Don't mix concerns** - Keep action validators in `actions/`, UI validators in `app/`
4. **Don't inline validators** - Extract validation schemas to `_validators.ts`, don't define inline in components
5. **Don't skip types** - Always export TypeScript types from inferred Zod schemas
6. **Don't ignore dependencies** - If data flows to actions, always derive from action validators
7. **Don't add coercion to actions** - Keep action validators type-strict; only add coercion in UI form validators
8. **Don't overuse coercion** - Only use for actual HTML form inputs, not for programmatic data or API responses

## File Naming Convention

- **Always**: `_validators.ts` (underscore prefix indicates internal/private to that scope)
- **At any scope level**: page, route, route-group, or global

## Zod Composition Reference

### Common Composition Methods

```typescript
import { createModelSchema } from "@/actions/models/validator";

// Pick specific fields
const subset = createModelSchema.pick({
  name: true,
  gender: true,
});

// Omit specific fields
const withoutSensitive = createModelSchema.omit({
  password: true,
  apiKey: true,
});

// Extend with new fields
const extended = createModelSchema.extend({
  confirmEmail: z.string().email(),
});

// Make all fields optional
const partial = createModelSchema.partial();

// Make all fields required
const required = createModelSchema.required();

// Make specific fields optional
const partialFields = createModelSchema.partial({
  bio: true,
  avatar: true,
});

// Merge two schemas
const merged = z.merge(schema1, schema2);
// or
const merged = schema1.and(schema2);

// Transform/refine
const refined = createModelSchema.refine(
  (data) => data.startDate < data.endDate,
  { message: "End date must be after start date" }
);
```

### Coercion Methods

**Use for HTML form inputs that return strings:**

```typescript
import { z } from "zod";

// Number coercion (for <input type="number">)
const numericForm = z.object({
  age: z.coerce.number().int().positive(),
  price: z.coerce.number().positive().max(1000000),
  weight: z.coerce.number().positive(),
  discount: z.coerce.number().min(0).max(100).optional(),
});

// Date coercion (for <input type="date">)
const dateForm = z.object({
  dateOfBirth: z.coerce.date(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

// Boolean coercion (for checkbox inputs)
const settingsForm = z.object({
  newsletter: z.coerce.boolean(),
  termsAccepted: z.coerce.boolean(),
});

// Combining coercion with derivation
const productFormSchema = createProductSchema.extend({
  price: z.coerce.number().positive(),      // Override with coercion
  quantity: z.coerce.number().int().min(0),
});

// Coercion with refinement
const eventFormSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: "End date must be after start date" }
);
```

**Important:** Only use coercion in UI form validators, never in action validators. Action validators should expect properly typed data.

## Integration with Multi-Step Forms

For multi-step forms, this pattern provides the foundation:

1. **Define step schemas** using `.pick()` from action schema
2. **Validate per-step** using step-scoped schemas
3. **Final validation** using full action schema before submission
4. **See**: `docs/multi-step-form-validation.md` for detailed multi-step implementation

## Related Patterns

- **Multi-Step Form Validation**: `docs/multi-step-form-validation.md`
- **Server Actions**: `actions/<feature>/validator.ts` (action layer validation)
- **Component Organization**: Same bottom-up approach for `_components/`

## Benefits

✅ **Single source of truth** - Action validators are the canonical validation rules
✅ **No duplication** - UI validators derive from action validators when needed
✅ **Clear boundaries** - Easy to determine validator scope and location
✅ **Type safety** - Full TypeScript inference from Zod schemas
✅ **Maintainable** - Changes to action validators automatically propagate to UI
✅ **Flexible** - Supports UI-specific validation when needed
✅ **Discoverable** - Consistent `_validators.ts` naming makes files easy to find
✅ **Scalable** - Bottom-up approach prevents premature abstraction

## Changelog

- **2025-01-12**: Initial pattern definition
