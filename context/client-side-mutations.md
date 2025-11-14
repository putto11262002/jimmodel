---
title: "Client-Side Mutations"
description: "Pattern for implementing client-side mutations with React Query, Hono RPC client, toast feedback, and cache invalidation."
---

# Client-Side Mutations

## Overview

This pattern defines the complete workflow for implementing client-side mutations (create, update, delete operations) in Client Components using React Query with Hono RPC client. Unlike Server Actions which run on the server, these mutations run in the browser, call API endpoints via Hono RPC client, and manage state with React Query. Mutations trigger toast notifications for user feedback and invalidate query cache without optimistic updates.

## Core Principles

### 1. Type-Safe Mutations with Hono RPC

Use `apiClient` from Hono RPC for fully typed API calls with automatic request/response inference.

**See:** `context/hono-rpc-client-usage.md` for RPC client patterns

### 2. React Query for Mutation State

Wrap API calls in React Query's `useMutation` for declarative mutation state management (`isPending`, `error`, `data`).

**See:** `context/react-query-hooks.md` for hook organization and query key patterns

### 3. UX Feedback Pattern

All mutations must provide clear, consistent user feedback for loading states and completion status.

**Loading states (during mutation):**
- Disable all interactive elements when `mutation.isPending`
- Show inline loader in action buttons
- Update button text to show action in progress

**Success/Error feedback (after mutation):**
- Toast notifications for success: `toast.success()`
- Toast notifications for errors: `toast.error()`
- Server/network errors only (validation happens client-side)

**See:** `context/loading-states-pattern.md` for complete loading state UX patterns

**Key principle:** Client-side validation (React Hook Form + Zod) catches validation errors before submission. Mutations only handle unexpected server/network errors.

### 4. Cache Invalidation on Success

Invalidate relevant query keys in `onSuccess` callback to trigger automatic refetch:
- Use `queryClient.invalidateQueries()` with appropriate query keys
- React Query automatically refetches affected queries
- Do NOT use `router.refresh()` - cache invalidation handles updates
- Do NOT use optimistic updates

**See:** `context/react-query-hooks.md` for cache invalidation strategies

### 5. Client-Side Validation

Validation happens client-side with React Hook Form + Zod BEFORE submission:
- Forms use `zodResolver` with Zod schemas for validation
- Invalid data is caught by React Hook Form and displayed inline via `<FormMessage />`
- Mutations only execute with valid data
- Any errors from the API are unexpected (server/network errors), not validation errors

**See:** `context/ui-validation-pattern.md` for validation patterns

## Mutation Hook Pattern

### File Organization

**Location:** `hooks/queries/<feature>/use-<action>-<feature>.ts`

**Naming conventions:**
- Create: `use-create-<feature>.ts`
- Update: `use-update-<feature>.ts`
- Delete: `use-delete-<feature>.ts`
- Bulk: `use-bulk-<action>-<feature>.ts`
- Upload: `use-upload-<feature>-<resource>.ts`

**See:** `context/component-organization.md` for file placement rules

### Standard Mutation Hook Template

```typescript
// hooks/queries/models/use-create-model.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { apiClient } from "@/lib/api/client";

type CreateModelInput = InferRequestType<typeof apiClient.api.models["$post"]>["json"];

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateModelInput) => {
      const response = await apiClient.api.models.$post({ json: data });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create model");
      }

      return response.json();
    },

    onSuccess: () => {
      // Invalidate all model list queries
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
```

**Key components:**
- Extract input type with `InferRequestType<typeof apiClient.api.models["$post"]>["json"]`
- `mutationFn` - Async function calling `apiClient` with typed data parameter
- Error handling - Check `response.ok`, throw with message
- `onSuccess` - Invalidate query cache with appropriate query key
- Type inference - Return type automatically inferred from API

### Update Mutation Pattern

```typescript
// hooks/queries/models/use-update-model.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { apiClient } from "@/lib/api/client";

type UpdateModelInput = InferRequestType<typeof apiClient.api.models[":id"]["$put"]>["json"];

export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateModelInput }) => {
      const response = await apiClient.api.models[":id"].$put({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update model");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      // Invalidate specific model and nested resources
      queryClient.invalidateQueries({
        queryKey: ["/api/models", variables.id],
      });

      // Invalidate collection (item might appear in lists)
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
```

**Pattern for updates:**
- Extract input type with `InferRequestType<typeof apiClient.api.models[":id"]["$put"]>["json"]`
- Accept `{ id, data }` object with typed data
- Use path parameter: `[":id"].$put({ param: { id } })`
- Invalidate both specific item and collection queries

### Delete Mutation Pattern

```typescript
// hooks/queries/models/use-delete-model.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.models[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete model");
      }

      return response.json();
    },

    onSuccess: (_, id) => {
      // Remove specific item from cache
      queryClient.removeQueries({
        queryKey: ["/api/models", id],
      });

      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
```

**Pattern for deletes:**
- Accept ID as parameter
- Use `removeQueries` for deleted item
- Invalidate collection queries

### Bulk Operation Pattern

```typescript
// hooks/queries/models/use-bulk-update-published.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useBulkUpdatePublished() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, published }: { ids: string[]; published: boolean }) => {
      const response = await apiClient.models["bulk-publish"].$patch({
        json: { ids, published },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update models");
      }

      return response.json();
    },

    onSuccess: () => {
      // Invalidate all model queries (lists and details)
      queryClient.invalidateQueries({
        queryKey: ["/api/models"],
      });
    },
  });
}
```

**Pattern for bulk operations:**
- Accept bulk operation parameters
- Invalidate all related queries (broad invalidation)

## Form Integration

### React Hook Form Integration

**Pattern:** All forms with validation (REQUIRED PATTERN)

**Important:** ALL forms MUST use React Hook Form + Zod validation. This pattern provides client-side validation before data reaches the mutation layer.

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUpdateModel } from "@/hooks/queries/models/use-update-model";
import { updateModelSchema } from "@/actions/models/validator";
import type { UpdateModelInput } from "@/lib/core/models/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BasicInfoFormProps {
  model: {
    id: string;
    name: string;
    nickName?: string | null;
    // ... other fields
  };
}

export function BasicInfoForm({ model }: BasicInfoFormProps) {
  const router = useRouter();
  const updateModel = useUpdateModel();

  const form = useForm<UpdateModelInput>({
    resolver: zodResolver(updateModelSchema),
    defaultValues: {
      id: model.id,
      name: model.name,
      nickName: model.nickName ?? "",
      // ... other fields
    },
  });

  const onSubmit = async (data: UpdateModelInput) => {
    updateModel.mutate(
      { id: model.id, data },
      {
        onSuccess: () => {
          toast.success("Basic information updated successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={updateModel.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} disabled={updateModel.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateModel.isPending}>
          {updateModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {updateModel.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
```

**Key patterns:**
- React Hook Form with Zod resolver - validates client-side before submission
- `<FormMessage />` - Displays client-side validation errors inline
- `mutation.isPending` - Disable all form inputs during mutation
- `<Loader2 className="mr-2 h-4 w-4 animate-spin" />` - Show loading spinner in button
- Update button text based on `isPending` (e.g., "Saving..." vs "Save Changes")
- `toast.success()` - Success feedback
- `toast.error()` - Error feedback (server/network errors only, validation happens client-side)
- Cache invalidation in mutation hook handles data updates automatically

#### Create Form Example

**Pattern:** Simple create forms in dialogs

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useCreateModel } from "@/hooks/queries/models/use-create-model";
import { createModelFormSchema, type CreateModelFormInput } from "../_validators";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CreateModelDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const createModel = useCreateModel();

  const form = useForm<CreateModelFormInput>({
    resolver: zodResolver(createModelFormSchema),
    defaultValues: {
      name: "",
      gender: "male",
    },
  });

  const onSubmit = (data: CreateModelFormInput) => {
    createModel.mutate(data, {
      onSuccess: (result) => {
        toast.success("Model created successfully");
        setOpen(false);
        form.reset();
        router.push(`/admin/models/${result.id}/basic-info`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Model</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Model</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={createModel.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createModel.isPending}>
              {createModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {createModel.isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

**Validator setup** (`app/(admin)/admin/@header/models/_validators.ts`):

```typescript
import { createModelSchema } from "@/actions/models/validator";
import { z } from "zod";

// Derive from action schema, pick only fields needed for create dialog
export const createModelFormSchema = createModelSchema.pick({
  name: true,
  gender: true,
});

export type CreateModelFormInput = z.infer<typeof createModelFormSchema>;
```

**Key patterns:**
- Derive UI validator from action validator using `.pick()`
- Place validator in `_validators.ts` at appropriate scope level
- `mutation.isPending` - Disable inputs and show loader in button
- `<Loader2>` icon with `animate-spin` for visual feedback
- `form.reset()` on success to clear form state
- `setOpen(false)` to close dialog after successful creation
- Navigate to edit page after creation

### Delete Confirmation Pattern

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteModelButtonProps {
  modelId: string;
  modelName: string;
}

export function DeleteModelButton({ modelId, modelName }: DeleteModelButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const deleteModel = useDeleteModel();

  const handleDelete = () => {
    deleteModel.mutate(modelId, {
      onSuccess: () => {
        toast.success(`${modelName} deleted successfully`);
        setOpen(false);
        router.push("/admin/models");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Model</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {modelName}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteModel.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteModel.isPending}
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

**Key patterns:**
- Confirmation dialog before destructive action
- `mutation.isPending` - Disable cancel and action buttons
- `<Loader2>` icon with `animate-spin` in action button
- Update button text during deletion (e.g., "Deleting..." vs "Delete")
- `setOpen(false)` - Close dialog on success
- `router.push()` - Navigate after delete

### File Upload Pattern

```typescript
// hooks/queries/models/use-upload-profile-image.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modelId, file }: { modelId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.models[":id"]["profile-image"].$post({
        param: { id: modelId },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      // Invalidate model detail (includes profile image URL)
      queryClient.invalidateQueries({
        queryKey: ["/api/models", variables.modelId],
      });
    },
  });
}
```

**Pattern for file uploads:**
- Use `FormData` for file payload
- Pass as `body` (not `json`)
- Invalidate queries containing file URLs

## Cache Invalidation Strategy

### Query Key Hierarchy

Query keys mirror API route structure for hierarchical invalidation:

```typescript
["/api/models"]                    // All model queries
["/api/models", { search: "john" }] // Filtered model list
["/api/models", id]                // Single model
["/api/models", id, "images"]      // Model images
```

**See:** `context/react-query-hooks.md` for complete query key patterns

### Invalidation Patterns by Mutation Type

| Mutation | Invalidate | Reason |
|----------|-----------|--------|
| Create | `["/api/models"]` | New item appears in lists |
| Update | `["/api/models", id]` + `["/api/models"]` | Item and lists need refresh |
| Delete | Remove `["/api/models", id]` + invalidate `["/api/models"]` | Remove item, refresh lists |
| Bulk | `["/api/models"]` | Multiple items affected |

### Invalidation Methods

```typescript
// Invalidate all queries starting with key (hierarchical)
queryClient.invalidateQueries({
  queryKey: ["/api/models"],
});

// Remove specific query from cache
queryClient.removeQueries({
  queryKey: ["/api/models", id],
});

// Invalidate exact match only
queryClient.invalidateQueries({
  queryKey: ["/api/models"],
  exact: true, // Only ["/api/models"], not filtered queries
});
```

## Error Handling

### Error Handling Strategy

**Client-side validation prevents invalid submissions:**
- React Hook Form + Zod validates data before mutation executes
- Invalid data is caught client-side and displayed inline via `<FormMessage />`
- Mutations only execute with valid data

**Mutation errors are always unexpected:**
- Server errors (500)
- Network errors
- Not found errors (404)
- Authorization errors (401, 403)
- Business logic errors

### Error Handling Pattern

```typescript
onError: (error) => {
  toast.error(error.message);
}
```

**Simple and consistent:** All mutation errors show toast notifications.

### Custom Error Handling (Optional)

Handle specific error cases when needed:

```typescript
onError: (error) => {
  // Handle specific error cases
  if (error.message === "Model not found") {
    toast.error("The model you're trying to update no longer exists");
    router.push("/admin/models");
    return;
  }

  // Default error handling
  toast.error(error.message || "Something went wrong");
}
```

## Toast Notification Patterns

### Success Toasts

```typescript
onSuccess: () => {
  toast.success("Model created successfully");
}

onSuccess: (data) => {
  toast.success(`${data.name} updated successfully`);
}

onSuccess: () => {
  toast.success("3 models published successfully");
}
```

**Guidelines:**
- Use past tense ("created", "updated", "deleted")
- Include entity name when available
- Keep message under 50 characters
- Use positive, friendly language

### Error Toasts

```typescript
onError: (error) => {
  toast.error(error.message);
}

// With fallback message
onError: (error) => {
  toast.error(error.message || "Failed to create model");
}

// With custom handling
onError: (error) => {
  if (error.message === "Model not found") {
    toast.error("The model no longer exists");
    router.push("/admin/models");
    return;
  }
  toast.error(error.message || "Something went wrong");
}
```

**Guidelines:**
- Always show toast for mutation errors
- Display API error message when available
- Provide fallback message
- Avoid technical jargon
- Guide user on next steps when needed

**Error examples:**
- `toast.error("Model not found")` - 404 error
- `toast.error("Failed to connect to server")` - Network error
- `toast.error("You don't have permission to delete this model")` - Authorization error
- `toast.error("Something went wrong. Please try again.")` - Generic server error

**Note:** Validation errors are handled client-side by React Hook Form before mutations execute.

## Common Workflows

### Workflow 1: Create Mutation Hook

1. Create file: `hooks/queries/<feature>/use-create-<feature>.ts`
2. Import `useMutation`, `useQueryClient`, `InferRequestType`, and `apiClient`
3. Extract input type: `type Input = InferRequestType<typeof apiClient.api.<resource>["$post"]>["json"]`
4. Define `mutationFn` with typed data parameter calling `apiClient.api.<resource>.$post({ json: data })`
5. Check `response.ok`, throw error if not
6. Add `onSuccess` callback with `invalidateQueries(["/api/<resource>"])`
7. Return `useMutation` result
8. Export function with descriptive name

### Workflow 2: Update Mutation Hook

1. Create file: `hooks/queries/<feature>/use-update-<feature>.ts`
2. Import `useMutation`, `useQueryClient`, `InferRequestType`, and `apiClient`
3. Extract input type: `type Input = InferRequestType<typeof apiClient.api.<resource>[":id"]["$put"]>["json"]`
4. Define `mutationFn` accepting `{ id, data }` parameter with typed data
5. Call `apiClient.api.<resource>[":id"].$put({ param: { id }, json: data })`
6. Add `onSuccess` invalidating both `["/api/<resource>", id]` and `["/api/<resource>"]`
7. Return mutation hook

### Workflow 3: Integrate Mutation in Simple Form

1. Import mutation hook: `import { useCreateModel } from "@/hooks/queries/models/use-create-model"`
2. Call hook in component: `const createModel = useCreateModel()`
3. Call `mutation.mutate(data, { onSuccess, onError })` in submit handler
4. Use `mutation.isPending` to disable inputs
5. Show loading text on submit button when `isPending`
6. Add `toast.success()` in `onSuccess` callback
7. Add `toast.error()` in `onError` callback
8. Navigate with `router.push()` after success

### Workflow 4: Integrate Mutation in React Hook Form

1. Import mutation hook and form dependencies
2. Setup React Hook Form with Zod resolver
3. Call mutation hook: `const updateModel = useUpdateModel()`
4. In `onSubmit`, call `mutation.mutate(data, { onSuccess, onError })`
5. Handle field errors in `onError` with `form.setError()`
6. Disable all form inputs with `disabled={mutation.isPending}`
7. Update button text based on `mutation.isPending`
8. Add toast notifications
9. Refresh or navigate after success

### Workflow 5: Add Delete Mutation with Confirmation

1. Create delete mutation hook
2. Import hook in component with delete button
3. Add confirmation dialog (AlertDialog from shadcn/ui)
4. Call `mutation.mutate(id, { onSuccess, onError })` when confirmed
5. Close dialog on success
6. Navigate away after delete
7. Disable dialog buttons during `isPending`

## Migration from Server Actions

### Before (Server Actions)

```typescript
"use client";

import { createModel } from "@/actions/models/action";

export function CreateModelDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createModel({ name, gender });

      if (result.success) {
        router.push(`/admin/models/${result.data.id}`);
        router.refresh(); // Invalidate cache
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* ... form fields ... */}
      <Button disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
```

### After (React Query + Hono RPC)

```typescript
"use client";

import { useCreateModel } from "@/hooks/queries/models/use-create-model";
import { toast } from "sonner";

export function CreateModelDialog() {
  const createModel = useCreateModel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createModel.mutate(
      { name, gender },
      {
        onSuccess: (data) => {
          toast.success("Model created successfully");
          router.push(`/admin/models/${data.id}`);
          // Cache automatically invalidated by hook
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... form fields ... */}
      <Button disabled={createModel.isPending}>
        {createModel.isPending ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
```

**Key differences:**
- ❌ Remove manual `isSubmitting` state → use `mutation.isPending`
- ❌ Remove manual `error` state → use toast notifications
- ❌ Remove `router.refresh()` → automatic cache invalidation
- ❌ Remove try-catch → handled by React Query
- ✅ Add mutation hook import
- ✅ Add toast notifications
- ✅ Cleaner, declarative code

## Guidelines

### DO

1. **Create mutation hooks** - Always wrap mutations in custom hooks in `hooks/queries/`
2. **Extract input types** - Use `InferRequestType<...>["json"]` for mutation input parameters
3. **Use toast for success** - Show `toast.success()` on successful mutations
4. **Use toast for errors** - Show `toast.error()` for all mutation errors
5. **Validate client-side** - Use React Hook Form + Zod to validate before submission
6. **Invalidate cache on success** - Use `queryClient.invalidateQueries()` in mutation hooks
7. **Show loader icon in buttons** - Display `<Loader2 className="mr-2 h-4 w-4 animate-spin" />` from `lucide-react` when `isPending`
8. **Update button text during mutations** - Change text based on `isPending` (e.g., "Saving..." vs "Save Changes")
9. **Disable inputs during mutation** - Use `mutation.isPending` to disable all form inputs and buttons
10. **Check response.ok** - Always verify response status before parsing
11. **Throw errors in mutationFn** - Let React Query handle error state
12. **Navigate when needed** - Use `router.push()` after create/delete operations
13. **Follow query key patterns** - Match API route structure for cache invalidation

### DON'T

1. **Don't use optimistic updates** - Always invalidate and refetch instead
2. **Don't use router.refresh()** - Cache invalidation handles updates automatically
3. **Don't skip client-side validation** - Always use React Hook Form + Zod
4. **Don't handle validation in mutations** - Validation happens client-side before submission
5. **Don't manage isPending manually** - Use `mutation.isPending` from React Query
6. **Don't forget cache invalidation** - Mutation hooks must invalidate related queries
7. **Don't call API directly in components** - Always use mutation hooks
8. **Don't skip error handling** - Always provide `onError` callback with toast
9. **Don't forget loading states** - Disable buttons and inputs during mutations
10. **Don't skip success feedback** - Always show toast on successful mutations
11. **Don't manually type mutation inputs** - Use `InferRequestType` from Hono RPC client

## Benefits

- **Type safety** - Full end-to-end type inference from Hono RPC
- **Declarative** - React Query handles all mutation state automatically
- **Consistent feedback** - Toast notifications provide uniform UX
- **Cache management** - Automatic refetch after invalidation
- **Error handling** - Centralized error handling in hooks
- **Loading states** - Built-in `isPending` state
- **Testability** - Easy to mock and test mutation hooks
- **Developer experience** - Clear patterns, less boilerplate
- **Maintainability** - Mutation logic centralized in hooks

## Related Patterns

- **Hono RPC Client**: `context/hono-rpc-client-usage.md` (using `apiClient` for API calls)
- **React Query Hooks**: `context/react-query-hooks.md` (hook organization, query keys, cache invalidation)
- **UI Validation**: `context/ui-validation-pattern.md` (form validation with Zod)
- **Component Organization**: `context/component-organization.md` (file placement and naming)
- **Hono RPC API**: `context/hono-rpc-api-development.md` (API error response patterns)
