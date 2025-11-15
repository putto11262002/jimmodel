---
title: "Feedback Patterns"
description: "Decision framework for choosing appropriate feedback mechanisms across the application."
---

# Feedback Patterns

## Overview

This context provides governance-level guidance for selecting appropriate feedback mechanisms based on action type, user context, and outcome importance. It helps determine when to use dedicated feedback pages, toasts, inline validation, or other feedback methods.

## Feedback Mechanism Types

The application uses several feedback mechanisms:

1. **Feedback Pages** - Dedicated routes for action outcomes
2. **Toast Notifications** - Temporary overlay messages
3. **Inline Validation** - Real-time form field feedback
4. **Loading States** - Visual feedback during operations

**This context focuses on decision criteria. See related patterns for implementation details.**

## Decision Framework

### Use Feedback Pages When

**Action requires follow-up context:**
- User needs to understand what happens next
- Multiple next-step options exist
- Outcome requires explanation beyond simple success/failure

**Action is high-stakes:**
- Payments or financial transactions
- Account creation or deletion
- Data submission that can't be easily undone
- Legal or contractual actions

**User flow naturally breaks:**
- Form submission completes a multi-step process
- Action concludes a workflow (checkout, application, booking)
- User should not return to previous page

**Examples:**
- Contact form submission → `/contact/success`
- Payment completion → `/checkout/success`
- Account creation → `/signup/verify-email`
- Order placement → `/orders/[id]/confirmation`

**See:** `context/feedback-page-pattern.md` for implementation details

### Use Toast Notifications When

**Action is simple and non-critical:**
- Quick operations that don't change user context
- Background updates or saves
- Non-destructive actions

**User should stay on current page:**
- CRUD operations in admin panels
- Inline edits or updates
- Actions within a workflow (not completing it)

**Feedback is temporary:**
- Confirmation of save/update
- Non-blocking errors
- Informational messages

**Examples:**
- Model profile updated
- Item added to list
- Changes saved
- Copy to clipboard

**See:** Toast pattern context (when available)

### Use Inline Validation When

**Feedback is field-specific:**
- Form input validation errors
- Real-time format checking
- Constraint violations

**User is actively editing:**
- During form interaction
- Before submission attempt

**See:** `context/ui-validation-pattern.md`

### Use Loading States When

**Operation is in progress:**
- Data fetching
- Form submission processing
- Background operations

**See:** `context/loading-states-pattern.md`

## Trigger Conditions

### Redirect to Feedback Page Triggers

```typescript
// In form submission handlers
async function onSubmit(values: FormInput) {
  const result = await submitAction(values);

  if (result.success) {
    // ✅ Redirect to feedback page for form submissions
    router.push('/feature/success');
  } else {
    // ✅ Toast for error (allows retry without losing context)
    toast.error("Failed", { description: result.error.message });
  }
}
```

**Trigger criteria:**
- Success outcome of form submission
- Completion of multi-step process
- High-stakes action completion
- User workflow concludes

### Toast Notification Triggers

```typescript
// In mutation handlers
const mutation = useMutation({
  mutationFn: updateModel,
  onSuccess: () => {
    // ✅ Toast for inline updates
    toast.success("Model updated successfully");
    queryClient.invalidateQueries({ queryKey: ['/api/models'] });
  },
  onError: (error) => {
    // ✅ Toast for errors
    toast.error("Update failed", { description: error.message });
  },
});
```

**Trigger criteria:**
- CRUD operations within admin panels
- Quick updates or saves
- User stays on current page
- Non-critical actions

## Pattern Combinations

### Form Submission Pattern

**Success:** Redirect to feedback page
**Error:** Toast notification

```typescript
async function onSubmit(values: FormInput) {
  setIsSubmitting(true);

  try {
    const result = await submitContactForm(values);

    if (result.success) {
      // Success: Redirect (don't reset isSubmitting - redirect happens)
      router.push("/contact/success");
    } else {
      // Error: Toast (let user retry)
      toast.error("Failed to send message", {
        description: result.error.message,
      });
      setIsSubmitting(false);
    }
  } catch (error) {
    // Unexpected error: Toast
    toast.error("An unexpected error occurred");
    setIsSubmitting(false);
  }
}
```

**Why:**
- Success redirects to prevent resubmission
- Errors use toast to preserve form state for retry
- User can fix issues and resubmit without starting over

### Admin Panel CRUD Pattern

**All outcomes:** Toast notifications

```typescript
const mutation = useMutation({
  mutationFn: updateModel,
  onSuccess: () => {
    toast.success("Model updated");
    queryClient.invalidateQueries({ queryKey: ['/api/models'] });
    setOpen(false); // Close dialog
  },
  onError: (error) => {
    toast.error("Update failed", { description: error.message });
  },
});
```

**Why:**
- User stays in admin context
- Quick feedback without navigation
- Allows continued work in same view

### Payment Flow Pattern

**Success:** Redirect to order confirmation page
**Error:** Redirect to payment error page

```typescript
async function handlePayment() {
  const result = await processPayment(paymentData);

  if (result.success) {
    router.push(`/orders/${result.data.orderId}/confirmation`);
  } else {
    router.push('/checkout/failed');
  }
}
```

**Why:**
- Both outcomes are high-stakes (require explanation)
- Success needs order details and next steps
- Error needs retry guidance and support options
- Neither should allow easy navigation back to payment page

## Anti-Patterns

### DON'T

1. **Don't use toast for critical actions** - Payment success should not be a toast
2. **Don't redirect for inline updates** - Updating a model field doesn't need a feedback page
3. **Don't use feedback page for errors if user can retry** - Form validation errors should be inline/toast
4. **Don't mix mechanisms inconsistently** - Use same pattern for similar actions across app
5. **Don't redirect without user data loss consideration** - Form state is lost on redirect

## Guidelines

### DO

1. **Consider user context** - Will redirect disrupt their workflow?
2. **Match importance to mechanism** - Critical actions deserve dedicated pages
3. **Preserve state when needed** - Use toast for errors that allow retry
4. **Follow established patterns** - Check existing similar features
5. **Think about next steps** - Does user need guidance on what to do next?

### DON'T

1. **Don't overthink simple actions** - Not everything needs a feedback page
2. **Don't use multiple mechanisms** - Don't show toast AND redirect
3. **Don't surprise users** - Follow expected patterns for action types
4. **Don't lose user work** - Redirecting loses form state

## Common Workflows

### Workflow 1: Deciding Feedback Mechanism for New Feature

1. Identify action type (form submission, inline update, delete, etc.)
2. Determine if action completes a workflow or is part of ongoing work
3. Assess if action is high-stakes or casual
4. Check if user needs follow-up context or next-step guidance
5. Review similar existing features for consistency
6. Choose mechanism based on criteria above
7. Reference appropriate context for implementation

### Workflow 2: Implementing Form Submission Feedback

1. Build form with inline validation (see `ui-validation-pattern.md`)
2. Show loading state during submission (see `loading-states-pattern.md`)
3. On success: redirect to feedback page (see `feedback-page-pattern.md`)
4. On error: show toast notification with error message
5. Keep error state to allow retry without losing form data

## Related Patterns

- **Feedback Page Pattern**: `context/feedback-page-pattern.md` (implementation details for dedicated feedback pages)
- **UI Validation Pattern**: `context/ui-validation-pattern.md` (inline form validation)
- **Loading States Pattern**: `context/loading-states-pattern.md` (feedback during operations)
- **Client-Side Mutations**: `context/client-side-mutations.md` (toast feedback for mutations)
