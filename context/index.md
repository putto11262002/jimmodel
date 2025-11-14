# Context Files Index

This directory contains context documentation that provides patterns and conventions used throughout the codebase.

## Available Context Files

- [Admin Panel Governance](./admin-panel-governance.md): Conventions and patterns for the admin panel route group, including client-side data management, slot-based layouts, and feature organization.

- [Admin Layout: Slot-Based Fixed Header](./admin-layout-slots.md): Explains layout patterns and route structure for /admin segment using Next.js parallel routes.

- [API Organization](./api-organization.md): Pattern for organizing API routes using Hono with feature-based modular structure.

- [Component Organization Pattern](./component-organization.md): Defines component file naming conventions and placement strategy across the codebase.

- [Dialog Definition Pattern](./dialog-definition-pattern.md): Workflow for defining and creating dialogs with context-based state management.

- [Hono RPC API Development](./hono-rpc-api-development.md): Conventions for building type-safe APIs with Hono RPC pattern, including validators, routes, and error handling.

- [Hono RPC Client Usage](./hono-rpc-client-usage.md): Conventions for consuming type-safe APIs with Hono RPC client, including type extraction with `InferRequestType` and `InferResponseType`, React Query integration, and automatic type inference.

- [Client-Side Queries](./client-side-queries.md): Pattern for implementing client-side data fetching (list, detail, filtered queries) in Client Components using React Query with Hono RPC client, type extraction for hook return values, skeleton loading states, and cache management.

- [Client-Side Mutations](./client-side-mutations.md): Pattern for implementing client-side mutations (create, update, delete) in Client Components with React Query, Hono RPC client, type extraction for mutation inputs, toast feedback, and cache invalidation.

- [React Query Custom Hooks](./react-query-hooks.md): Conventions for writing React Query custom hooks with query key patterns, revalidation strategies, and cache management.

- [UI Validation Pattern](./ui-validation-pattern.md): Defines validation schema organization and placement strategy in the UI layer using Zod.

- [UI Component Conventions](./ui-component-conventions.md): Usage conventions and gotchas for shadcn/ui components in this project.

- [Loading States Pattern](./loading-states-pattern.md): UX patterns for loading states in queries and mutations using skeletons and loaders.

- [Empty State UI Pattern](./empty-state-pattern.md): Conventions for displaying empty states with icons, messaging, and call-to-action patterns for different contexts (feature pages, tables, cards, search/filter results).

- [Writing Context Files](./writing-context-files.md): Guide for creating context files that document conventions, patterns, and structural decisions.
