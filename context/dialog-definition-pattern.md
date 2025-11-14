---
title: "Dialog Definition Pattern"
description: "Workflow for defining and creating dialogs with context-based state management."
---

# Dialog Definition Pattern

## Overview

This document defines the workflow for creating dialogs in the application. Dialogs use context-based state management to separate trigger UI from dialog content, enabling programmatic control from anywhere within the provider scope.

## Core Principles

### 1. Separation of Concerns

Dialog definition separates three concerns:
- **Provider** - Wraps dialog content with context for state management
- **Hook** - Exposes `{ open, setOpen }` for programmatic control
- **Trigger** - UI component that calls the hook to open the dialog

### 2. Context-Based State

Dialog open state lives in React Context, not component props, enabling:
- Programmatic control from any child component
- Multiple triggers for the same dialog
- Separation of trigger UI from dialog logic

### 3. Provider Placement

Providers are added to the nearest layout that covers all routes needing access to the dialog.

## Dialog Patterns

### Pattern 1: Context-Based Dialog (Recommended)

**Use when:**
- Dialog needs programmatic control from multiple locations
- Trigger UI varies across different pages
- Dialog content has complex form logic or mutations

**Structure:**
```typescript
// Export from dialog component file
export function CreateModelDialogProvider({ children })  // Wraps content + context
export function useCreateModelDialog()                   // Returns { open, setOpen }

// Trigger implemented separately
function CreateButton() {
  const { setOpen } = useCreateModelDialog();
  return <Button onClick={() => setOpen(true)}>Create</Button>;
}
```

### Pattern 2: Controlled Dialog

**Use when:**
- Simple confirmation dialogs (delete, archive, etc.)
- Dialog controlled by single parent component
- No need for programmatic access from children

**Structure:**
```typescript
// Generic reusable dialog with props
<DeleteConfirmDialog
  open={open}
  onOpenChange={setOpen}
  onConfirm={handleDelete}
/>
```

**See:** `components/delete-confirm-dialog.tsx` for implementation example

## Common Workflows

### Workflow 1: Create Context-Based Dialog

1. Create dialog component file in appropriate location (see component-organization.md)
2. Define dialog context with `open` state and `setOpen` setter
3. Create provider component that wraps `Dialog` content (no trigger)
4. Export hook that returns `{ open, setOpen }` from context
5. Add provider to nearest layout covering required routes
6. Implement trigger UI using the hook in consuming components

### Workflow 2: Add Provider to Layout

1. Identify the nearest layout that covers all routes needing dialog access
2. Import the dialog provider component
3. Wrap existing layout children with provider
4. Verify provider doesn't include trigger UI (triggers stay in route components)

### Workflow 3: Implement Dialog Trigger

1. Import the dialog hook in component needing trigger
2. Call hook to get `{ open, setOpen }` accessors
3. Render trigger UI (Button, MenuItem, etc.)
4. Call `setOpen(true)` on trigger interaction
5. Optionally use `open` state for trigger active states

## Implementation Checklist

### Creating Context-Based Dialog

- [ ] Create dialog component file using kebab-case naming
- [ ] Define context with `createContext<{ open: boolean; setOpen: (open: boolean) => void }>()`
- [ ] Implement provider component:
  - [ ] Manages `open` state with `useState(false)`
  - [ ] Provides context value with `{ open, setOpen }`
  - [ ] Wraps `Dialog` component with form/mutation logic
  - [ ] Accepts `children` prop for context provider only
- [ ] Export hook `useDialogName()`:
  - [ ] Calls `useContext` with dialog context
  - [ ] Throws error if used outside provider
  - [ ] Returns `{ open, setOpen }`
- [ ] Export provider component
- [ ] Handle dialog close in mutation success:
  - [ ] Call `setOpen(false)` in mutation `onSuccess`
  - [ ] Reset form state if applicable
  - [ ] Handle navigation if needed

### Adding Provider to Layout

- [ ] Identify nearest layout covering required routes
- [ ] Import dialog provider component
- [ ] Wrap children with provider (provider wraps content, not trigger)
- [ ] Verify no layout shifts or style issues

### Implementing Trigger UI

- [ ] Import dialog hook in consuming component
- [ ] Call hook to access `{ open, setOpen }`
- [ ] Render trigger UI (Button, IconButton, MenuItem, etc.)
- [ ] Wire `onClick={() => setOpen(true)}` to trigger
- [ ] Test trigger opens dialog correctly

### Testing Checklist

- [ ] Dialog opens when trigger is clicked
- [ ] Dialog closes on cancel/close button
- [ ] Dialog closes after successful submission
- [ ] Form resets after close (if applicable)
- [ ] Multiple triggers work correctly (if applicable)
- [ ] Navigation works after submission (if applicable)
- [ ] No console errors or warnings

## File Structure

### Context-Based Dialog Structure

```
app/(admin)/admin/
├── layout.tsx                              # Add provider here
├── @header/models/
│   ├── page.tsx                           # Use trigger here
│   └── _components/
│       └── create-model-dialog.tsx        # Dialog definition
```

**Dialog component exports:**
```typescript
// app/(admin)/admin/@header/models/_components/create-model-dialog.tsx
export function CreateModelDialogProvider({ children })
export function useCreateModelDialog()
```

**Layout integration:**
```typescript
// app/(admin)/admin/layout.tsx
import { CreateModelDialogProvider } from "./@header/models/_components/create-model-dialog";

export default function AdminLayout({ children }) {
  return (
    <CreateModelDialogProvider>
      {children}
    </CreateModelDialogProvider>
  );
}
```

**Trigger usage:**
```typescript
// app/(admin)/admin/@header/models/page.tsx
import { useCreateModelDialog } from "./_components/create-model-dialog";

function ModelsHeader() {
  const { setOpen } = useCreateModelDialog();
  return <Button onClick={() => setOpen(true)}>Create Model</Button>;
}
```

## Guidelines

### DO

1. **Export provider and hook** - Both must be exported from dialog component file
2. **Use context for programmatic control** - When dialog needs access from multiple locations
3. **Separate trigger from content** - Provider wraps content only, not trigger UI
4. **Place provider at correct layout level** - Nearest layout covering all consuming routes
5. **Reset state on close** - Clear form data in `setOpen(false)` or mutation success
6. **Handle mutations in dialog** - Keep mutation logic inside dialog component
7. **Use controlled pattern for simple dialogs** - Props-based for confirmations

### DON'T

1. **Don't include trigger in provider** - Trigger UI stays in consuming components
2. **Don't add provider to root layout** - Place at nearest required level
3. **Don't duplicate state** - Dialog state lives in context, not props
4. **Don't forget error handling** - Check if hook used outside provider
5. **Don't skip form reset** - Always reset form state on successful submission
6. **Don't use context for simple cases** - Use controlled pattern for basic dialogs

## Examples

### Example 1: Context-Based Create Dialog

```typescript
// app/(admin)/admin/@header/models/_components/create-model-dialog.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateModel } from "@/hooks/queries/models/use-create-model";
import { CreateModelForm } from "./create-model-form";

interface CreateModelDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateModelDialogContext = createContext<CreateModelDialogContextValue | undefined>(undefined);

export function CreateModelDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <CreateModelDialogContext.Provider value={{ open, setOpen }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Model</DialogTitle>
          </DialogHeader>
          <CreateModelForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </CreateModelDialogContext.Provider>
  );
}

export function useCreateModelDialog() {
  const context = useContext(CreateModelDialogContext);
  if (!context) {
    throw new Error("useCreateModelDialog must be used within CreateModelDialogProvider");
  }
  return context;
}
```

**Why:** Separates dialog logic from trigger UI, enables programmatic control.

### Example 2: Layout Provider Integration

```typescript
// app/(admin)/admin/layout.tsx
import { CreateModelDialogProvider } from "./@header/models/_components/create-model-dialog";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CreateModelDialogProvider>
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </CreateModelDialogProvider>
  );
}
```

**Why:** Provider at admin layout level makes dialog accessible to all admin routes.

### Example 3: Multiple Trigger Implementations

```typescript
// app/(admin)/admin/@header/models/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCreateModelDialog } from "./_components/create-model-dialog";

export default function ModelsHeader() {
  const { setOpen } = useCreateModelDialog();

  return (
    <Button onClick={() => setOpen(true)}>
      <Plus className="mr-2 h-4 w-4" />
      Create Model
    </Button>
  );
}
```

```typescript
// app/(admin)/admin/@content/models/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCreateModelDialog } from "../../@header/models/_components/create-model-dialog";

export default function ModelsContentEmpty() {
  const { setOpen } = useCreateModelDialog();

  return (
    <div className="text-center">
      <p>No models found</p>
      <Button onClick={() => setOpen(true)}>Create Your First Model</Button>
    </div>
  );
}
```

**Why:** Same dialog controlled from different locations using the hook.

### Example 4: Controlled Dialog Pattern

```typescript
// components/delete-confirm-dialog.tsx
"use client";

import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm, title, description }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {/* ... */}
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Usage:**
```typescript
function ModelCard() {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setDeleteOpen(true)}>Delete</Button>
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Model"
        description="This action cannot be undone"
      />
    </>
  );
}
```

**Why:** Simple confirmation dialogs don't need context complexity.

## Decision Tree

```
Creating a new dialog?
│
├─ Is it a simple confirmation/alert?
│  └─ YES → Use controlled pattern with props
│      - Create reusable component in components/
│      - Accept open/onOpenChange props
│      - No context needed
│
└─ NO (complex form/mutation)
   │
   └─ Needs programmatic control from multiple locations?
       │
       ├─ YES → Use context-based pattern
       │   1. Create dialog component with provider + hook
       │   2. Add provider to nearest layout
       │   3. Implement triggers using hook
       │
       └─ NO → Consider controlled pattern
           - Single parent controls state
           - Pass open/onOpenChange as props
```

## Benefits

- **Programmatic control** - Open dialogs from anywhere within provider scope
- **Flexible triggers** - Multiple trigger UIs without prop drilling
- **Clean separation** - Dialog logic separate from trigger implementation
- **Reusable patterns** - Consistent structure across all dialogs
- **Type safety** - Context provides type-safe access to state
- **Better testing** - Trigger and content can be tested independently

## Related Patterns

- **Component Organization**: `context/component-organization.md` (file placement)
- **Client-Side Mutations**: `context/client-side-mutations.md` (form mutations in dialogs)
- **UI Validation Pattern**: `context/ui-validation-pattern.md` (dialog form validation)
- **Loading States Pattern**: `context/loading-states-pattern.md` (dialog loading states)
