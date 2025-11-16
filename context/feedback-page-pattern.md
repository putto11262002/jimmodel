---
title: "Feedback Page Pattern"
description: "UI structure and visual conventions for dedicated feedback pages that display action outcomes."
---

# Feedback Page Pattern

## Overview

Feedback pages are dedicated routes that display the outcome of user actions (form submissions, payments, operations). They provide clear status communication, contextual messaging, and next-step CTAs in a centered, focused layout.

## Core Principles

### 1. Centered Focused Layout

All feedback pages use a centered, single-column layout with vertical flow: icon → heading → description → CTA.

### 2. State-Specific Visual Language

Each state (success, error, pending, info) has distinct iconography and color conventions.

### 3. Minimal, Actionable CTAs

Provide 1-2 clear next actions using link-style buttons to reduce visual weight.

## File Organization

### Location Pattern

Place feedback pages as child routes of the feature they relate to:

```
app/
├── (public)/
│   ├── contact/
│   │   ├── page.tsx           # Contact form
│   │   └── success/
│   │       └── page.tsx       # Contact success feedback
│   ├── checkout/
│   │   ├── page.tsx
│   │   ├── success/
│   │   │   └── page.tsx       # Payment success
│   │   └── failed/
│   │       └── page.tsx       # Payment failure
```

**Pattern:** `<feature>/<state>/page.tsx` where state is `success`, `error`, `pending`, etc.

## Page Structure

### Standard Layout

```tsx
<div className="container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16">
  <div className="text-center">
    {/* Icon */}
    {/* Heading */}
    {/* Description */}
    {/* CTA */}
  </div>
</div>
```

**Container conventions:**
- `min-h-[60vh]` - Sufficient height without forcing full-screen
- `max-w-2xl` - Readable line length for content
- `flex items-center justify-center` - Vertical and horizontal centering
- `text-center` - All content center-aligned

## Visual Conventions by State

### Success State

**Icon:**
```tsx
<div className="mb-6 flex justify-center">
  <div className="rounded-full bg-green-100 p-2.5 dark:bg-green-900/20">
    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
  </div>
</div>
```

**Typography:**
```tsx
<h1 className="mb-4 text-2xl font-bold tracking-tight">
  [Success Message]
</h1>

<p className="mb-8 text-muted-foreground">
  [Description of what happened / next steps]
</p>
```

**CTA:**
```tsx
<Button asChild variant="link">
  <Link href="/">
    <Home className="mr-2 h-4 w-4" />
    Back to Home
  </Link>
</Button>
```

**Color scheme:**
- Icon background: `bg-green-100 dark:bg-green-900/20`
- Icon color: `text-green-600 dark:text-green-500`
- Common icons: `CheckCircle2`, `Check`

### Error State

**Icon:**
```tsx
<div className="mb-6 flex justify-center">
  <div className="rounded-full bg-red-100 p-2.5 dark:bg-red-900/20">
    <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
  </div>
</div>
```

**Typography:**
```tsx
<h1 className="mb-4 text-2xl font-bold tracking-tight">
  [Error Message]
</h1>

<p className="mb-8 text-muted-foreground">
  [What went wrong / how to fix]
</p>
```

**CTA:**
```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
  <Button asChild>
    <Link href="/previous-page">
      <RotateCcw className="mr-2 h-4 w-4" />
      Try Again
    </Link>
  </Button>

  <Button asChild variant="link">
    <Link href="/">
      <Home className="mr-2 h-4 w-4" />
      Back to Home
    </Link>
  </Button>
</div>
```

**Color scheme:**
- Icon background: `bg-red-100 dark:bg-red-900/20`
- Icon color: `text-red-600 dark:text-red-500`
- Common icons: `XCircle`, `AlertCircle`

### Pending/Info State

**Icon:**
```tsx
<div className="mb-6 flex justify-center">
  <div className="rounded-full bg-blue-100 p-2.5 dark:bg-blue-900/20">
    <Info className="h-10 w-10 text-blue-600 dark:text-blue-500" />
  </div>
</div>
```

**Typography:**
```tsx
<h1 className="mb-4 text-2xl font-bold tracking-tight">
  [Status Message]
</h1>

<p className="mb-8 text-muted-foreground">
  [What's happening / what to expect]
</p>
```

**Color scheme:**
- Icon background: `bg-blue-100 dark:bg-blue-900/20`
- Icon color: `text-blue-600 dark:text-blue-500`
- Common icons: `Info`, `Clock`, `Mail`

### Warning State

**Icon:**
```tsx
<div className="mb-6 flex justify-center">
  <div className="rounded-full bg-yellow-100 p-2.5 dark:bg-yellow-900/20">
    <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
  </div>
</div>
```

**Color scheme:**
- Icon background: `bg-yellow-100 dark:bg-yellow-900/20`
- Icon color: `text-yellow-600 dark:text-yellow-500`
- Common icons: `AlertTriangle`, `AlertCircle`

## Size Standards

### Icon Sizing

**Icon container:**
- Padding: `p-2.5`
- Border radius: `rounded-full`
- Margin bottom: `mb-6`

**Icon itself:**
- Size: `h-10 w-10`
- **DON'T** use larger sizes - `h-10 w-10` is the standard

### Typography

**Heading (h1):**
- Size: `text-2xl`
- Weight: `font-bold`
- Tracking: `tracking-tight`
- Margin: `mb-4`

**Description (p):**
- Color: `text-muted-foreground`
- Margin: `mb-8`
- No explicit size (inherits base)

### CTA Icon Sizing

**Button icons:**
- Size: `h-4 w-4`
- Margin: `mr-2`

## CTA Patterns

### Single CTA (Common)

Use `variant="link"` for minimal visual weight:

```tsx
<Button asChild variant="link">
  <Link href="/">
    <Home className="mr-2 h-4 w-4" />
    Back to Home
  </Link>
</Button>
```

### Multiple CTAs (Error/Complex States)

Primary action as filled button, secondary as link variant:

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
  <Button asChild>
    <Link href="/retry-action">
      <RotateCcw className="mr-2 h-4 w-4" />
      Try Again
    </Link>
  </Button>

  <Button asChild variant="link">
    <Link href="/">
      <Home className="mr-2 h-4 w-4" />
      Back to Home
    </Link>
  </Button>
</div>
```

**Responsive behavior:**
- Mobile: Stack vertically (`flex-col`)
- Desktop: Horizontal row (`sm:flex-row sm:justify-center`)
- Spacing: `gap-3`

### Common CTA Actions

**Success pages:**
- Back to Home
- View [Resource]
- Create Another

**Error pages:**
- Try Again (primary)
- Back to Home (secondary)
- Contact Support

**Pending pages:**
- Back to Home
- Check Status

## Common Workflows

### Workflow 1: Create Success Feedback Page

1. Create route: `app/<feature>/success/page.tsx`
2. Import: `Button`, `Link`, success icon (e.g., `CheckCircle2`, `Home`)
3. Use container: `container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center`
4. Add icon in green circular background: `bg-green-100 p-2.5`, icon `h-10 w-10`
5. Add heading: `text-2xl font-bold tracking-tight mb-4`
6. Add description: `text-muted-foreground mb-8`
7. Add CTA: `Button variant="link"` with icon

### Workflow 2: Create Error Feedback Page

1. Create route: `app/<feature>/error/page.tsx`
2. Import: `Button`, `Link`, error icons (e.g., `XCircle`, `RotateCcw`, `Home`)
3. Use same container structure
4. Add icon in red circular background: `bg-red-100 p-2.5`, icon `h-10 w-10`
5. Add error heading and description
6. Add primary CTA (Try Again) and secondary CTA (Back to Home)
7. Wrap CTAs in responsive flex container

### Workflow 3: Add Redirect to Feedback Page

1. Import `useRouter` from `next/navigation` in form component
2. Initialize router: `const router = useRouter()`
3. On successful action, redirect: `router.push('/feature/success')`
4. Keep error handling with toast (inline feedback)
5. Don't reset `isSubmitting` on success (redirect happens)

## Guidelines

### DO

1. **Use centered layout** - All feedback pages use the standard centered container
2. **Match state to color** - Success=green, Error=red, Info=blue, Warning=yellow
3. **Keep icon size consistent** - Always `h-10 w-10` for main icon
4. **Use link variant CTAs** - `variant="link"` for minimal visual weight (success/info states)
5. **Provide clear next action** - Always offer "Back to Home" or relevant next step
6. **Use descriptive messaging** - Explain what happened and what's next
7. **Follow file organization** - Place as `<feature>/<state>/page.tsx`

### DON'T

1. **Don't use oversized icons** - `h-10 w-10` is standard, not `h-12` or larger
2. **Don't use large headings** - `text-2xl` is standard, not `text-4xl`
3. **Don't overcomplicate CTAs** - 1-2 actions maximum
4. **Don't use filled buttons** - Use `variant="link"` unless primary action needed
5. **Don't add unnecessary content** - Keep messaging concise (heading + description)
6. **Don't forget dark mode** - Always include dark variants for colors
7. **Don't mix visual languages** - Stick to established color/icon conventions

## Examples

### Example 1: Contact Form Success

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";

export default function ContactSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-2.5 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          Message Sent Successfully!
        </h1>

        <p className="mb-8 text-muted-foreground">
          We've received your message and will get back to you as soon as possible.
        </p>

        <Button asChild variant="link">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
```

**Why:** Follows all conventions - centered layout, standard icon size, link variant CTA, concise messaging.

### Example 2: Payment Error with Retry

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, RotateCcw, Home } from "lucide-react";

export default function PaymentErrorPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-2.5 dark:bg-red-900/20">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          Payment Failed
        </h1>

        <p className="mb-8 text-muted-foreground">
          We couldn't process your payment. Please check your payment details and try again.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/checkout">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>

          <Button asChild variant="link">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Why:** Error state with red color scheme, provides retry action as primary button, secondary action as link variant.

### Example 3: Email Verification Pending

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Home } from "lucide-react";

export default function VerificationPendingPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-2.5 dark:bg-blue-900/20">
            <Mail className="h-10 w-10 text-blue-600 dark:text-blue-500" />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          Check Your Email
        </h1>

        <p className="mb-8 text-muted-foreground">
          We've sent a verification link to your email address. Click the link to activate your account.
        </p>

        <Button asChild variant="link">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
```

**Why:** Info state with blue color scheme, informational messaging about pending action.

## Benefits

- **Focused attention** - Dedicated page eliminates distractions
- **Clear communication** - More space for context and explanation
- **Better UX for critical actions** - Reinforces important outcomes (payments, signups)
- **Prevents accidental navigation** - User can't accidentally dismiss like toast
- **Flexible CTAs** - Room for multiple next actions
- **Consistent visual language** - State-based color conventions create familiarity

## Related Patterns

- **Feedback Patterns**: `context/feedback-patterns.md` (when to use feedback pages vs other mechanisms)
- **Empty State Pattern**: `context/empty-state-pattern.md` (different use case - no data vs action outcome)
- **Loading States Pattern**: `context/loading-states-pattern.md` (transient states during actions)
