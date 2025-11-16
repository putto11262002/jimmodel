---
title: "Writing Context Files"
description: "Guide for creating context files that document conventions, patterns, and structural decisions."
---

# Writing Context Files

## Purpose

Context files document **conventions and patterns** used throughout the codebase. They serve as implementation guides that help developers understand "how we do things here" rather than "what we built."

**Context files answer:**
- What conventions do we follow?
- Where should I put this code?
- How should I structure this feature?
- What patterns should I use?
- What are common mistakes to avoid?
- What are project-specific caveats?

**Context files are NOT:**
- Feature documentation (use `docs/components/` for that)
- Technology tutorials (assume developers know the library/framework)
- API reference documentation (link to official docs)
- Explanations of how libraries work (document patterns, not concepts)
- Project requirements or specifications

**Key distinction:** Context files document **YOUR patterns and tech-specific usage**, not **general tutorials**. They're for experienced developers who may know the tech deeply but don't use YOUR specific setup daily, OR who are advanced in the project but need reminders on patterns they don't use frequently.

## When to Create a Context File

Create a context file when you have:

1. **Established patterns** - A convention used in 3+ places
2. **Decision framework** - Rules for where/how to organize code
3. **Naming conventions** - Standardized file/folder/variable naming
4. **Structural patterns** - How to organize related code
5. **Workflow patterns** - Common multi-step operations

**Don't create context files for:**
- One-off implementations
- Features (document those in `docs/components/`)
- External library usage (link to official docs instead)
- Experimental patterns (wait until proven)

## File Structure

**Location:** `context/<topic>.md`

**Naming:** Use kebab-case, descriptive names that match the pattern domain
- `component-organization.md` - How to organize components
- `ui-validation-pattern.md` - UI validation conventions
- `react-query-hooks.md` - React Query hook patterns
- `api-organization.md` - API route organization

## Content Structure

### Required Sections

```markdown
---
title: "Pattern Name"
description: "One-line summary of what this pattern covers"
---

# Pattern Name

## Overview
Brief explanation of what this pattern covers (2-3 sentences)

## Core Principles
Key rules developers must follow (3-5 principles)

## [Pattern-Specific Sections]
Detailed conventions, file structures, code patterns

## Common Workflows
Step-by-step checklists for common tasks

## Guidelines
DO/DON'T lists

## Examples
Real code examples showing the pattern in practice

## Benefits
Why we use this pattern (bullet points)

## Related Patterns
Links to related context files or documentation
```

### Optional Sections

- **Decision Tree** - Visual flowchart for placement/organization decisions
- **Quick Reference** - Tables summarizing key information
- **Migration Checklist** - Steps for refactoring to the pattern
- **Integration with...** - How pattern connects to other layers
- **Implications** - When describing approaches (file-level vs component-level), list ALL implications:
  - What gets affected/cached/included
  - How it impacts imports/dependencies
  - Constraints it imposes
  - Side effects on nested components

## Patterns vs Technology Teaching

**Context files are quick-reference guides for experienced developers who may not work with this setup daily.**

### Target Audience

Context files assume developers who are:
- **Experienced with the tech** - May know React Query, Hono, Zod deeply
- **Infrequent users** - Don't use this specific setup every day
- **Needing quick reminders** - Want to recall "how do WE do this?"
- **Advanced in project** - Know the codebase but need pattern refreshers

**NOT for:**
- Beginners learning the technology for the first time
- Step-by-step tutorials on library basics

### What to Document

✅ **Project-specific conventions:**
- "Query keys mirror API route structure: `['/api/models', filters]`"
- "Use explicit status codes with `c.json(data, 200)` - never use `c.notFound()`"
- "Hooks go in `hooks/queries/<feature>/use-<feature>s.ts`"

✅ **Tech-specific gotchas in YOUR context:**
- "Don't use `c.notFound()` - breaks RPC type inference" (Hono-specific caveat)
- "Use `z.coerce.number()` for query params" (Zod-specific for URL params)
- "Explicit status codes enable discriminated unions on client" (TypeScript/RPC detail)

✅ **Common mistakes and reminders:**
- "Don't forget cache invalidation in mutation `onSuccess`"
- "Don't return JSX from hooks"
- "Always export `type Api = typeof api` for RPC"

✅ **Tech-specific implementation details:**
- "Hono RPC requires explicit `c.json(data, statusCode)` for type inference"
- "React Query: `enabled: !!id` prevents queries when ID is undefined"
- "`staleTime: 1000 * 60 * 5` means cache fresh for 5 minutes"

### What NOT to Document

❌ **Basic library introductions:**
- NOT: "React Query is a data fetching library for React applications..."
- NOT: "Zod is a TypeScript-first schema validation library..."

❌ **Generic "how to use" tutorials:**
- NOT: "To create a query, use the `useQuery` hook which accepts..."
- NOT: "Hono routes are defined using `app.get()`, `app.post()`..."

❌ **Concepts without YOUR context:**
- NOT: "Query keys identify queries in the cache" (generic)
- BETTER: "Query keys must match API routes: `['/api/models']`" (your pattern)

**The test:** Would an experienced developer who's been away from this project for 2 months find this helpful? If yes, include it.

## Avoiding Duplication

**Critical rule:** NEVER duplicate information across context files.

### Identifying Overlap

Before writing, check if related context files already cover:
- File structure and naming conventions
- Directory organization patterns
- Basic implementation patterns
- Integration details

### Delegation Strategy

When topics overlap:

1. **Identify ownership** - Which file should own this concept?
   - File structure → Component/API organization files
   - Technology-specific patterns → Technology context file
   - Integration details → Keep minimal, reference other files

2. **Reference, don't duplicate:**
   ```markdown
   **See:** `context/api-organization.md` for file structure and validators
   ```

3. **Keep focus narrow** - Each file documents ONE pattern domain

### Separation of Concerns Example

**api-organization.md** owns:
- File structure: `lib/api/<feature>/routes.ts`
- How to mount routes with `app.route()`
- Basic validator patterns

**hono-rpc-api-development.md** owns:
- RPC type export: `export type Api = typeof api`
- RPC-specific requirements (explicit status codes)
- Why explicit status codes enable type discrimination

**hono-rpc-client-usage.md** owns:
- Using the RPC client with `apiClient`
- Client-side type inference patterns
- Brief reference to React Query integration

**react-query-hooks.md** owns:
- React Query hook organization in `hooks/queries/`
- Query key patterns and cache invalidation
- Shows both integration options (actions OR RPC client)

## Integration vs Implementation

### Implementation (Document fully)

Pattern-specific concepts that define YOUR usage:
- React Query: query key conventions, cache invalidation strategy, `staleTime` policy
- Hono RPC: type export requirement, explicit status codes, error response format
- Component organization: file placement rules, naming patterns

### Integration (Document minimally)

How patterns connect to other layers:
- Show 1-2 brief examples
- Reference the other context file for details
- Don't explain the other pattern's concepts

**Example from React Query context:**

```markdown
## Integration Options

### Option 1: With Server Actions
```typescript
queryFn: () => getModelsAction(filters)
```

### Option 2: With Hono RPC Client
```typescript
queryFn: async () => {
  const res = await apiClient.models.$get({ query: filters });
  return res.json();
}
```

**See:** `context/hono-rpc-client-usage.md` for RPC client patterns
```

**Good:** Shows both options exist, references details elsewhere
**Bad:** Would explain how RPC client works, duplicate client usage patterns

## Writing Style

### Tone and Voice

**Use directive, imperative language:**
- "Place components in `app/<route>/_components/`"
- "Use kebab-case for all files"
- "Invalidate queries in `onSuccess` callbacks"

**Not explanatory or tutorial style:**
- NOT: "You should probably place your components..."
- NOT: "Let's learn how to organize files..."
- NOT: "Components can be placed anywhere but..."

### Conciseness

**Keep it concise:**
- Short sentences and paragraphs
- Bullet points over prose
- Code snippets over lengthy explanations
- Tables and checklists over narrative

**Remove filler:**
- No "In this section we will..."
- No "It's important to note that..."
- No "You might want to consider..."

### Framework Terminology Precision

Use exact framework terminology when documenting scope levels, API names, or technical concepts.

**Example - Next.js Caching:**
- **File-level** `'use cache'` - Directive at top of file
- **Component-level** `'use cache'` - Inside component function
- **Function-level** `'use cache'` - Inside utility function

Don't use imprecise terms like "function-level" when the framework calls it "component-level."

**Why:** Frameworks often have specific meanings for terms. Using wrong terminology creates confusion and makes it harder to search official docs.

**How to ensure precision:**
1. Use exact terms from official documentation
2. Define each term clearly if there are similar concepts
3. Show when to use each variant
4. Provide examples distinguishing each level/type

### No Emojis Policy

**Never use emojis** unless explicitly requested by the user, including:
- Unicode symbols: ✅ ❌ ✓ ✗ ⚠️ 🚀
- Checkmarks and X marks
- Visual decorations

**Instead use:**
- Text: "Yes/No", "DO/DON'T", "Warning", "Note"
- Structured headings: "When to use" vs "When NOT to use"
- Plain bullet points without symbols

**Applies to:**
- All prose content
- Code comments
- Tables and lists
- Examples and guidelines

### Code Examples

**Minimal, focused snippets:**
```typescript
// Good: Shows only relevant code
export function useModels(options?: UseModelsOptions) {
  return useQuery({
    queryKey: ['/api/models', options],
    queryFn: () => getModelsAction(options),
  });
}
```

**Not full implementations:**
```typescript
// Avoid: Too much detail
import { useQuery } from '@tanstack/react-query';
import { getModelsAction } from '@/actions/models/action';
import type { Model } from '@/lib/core/models/types';

interface UseModelsOptions {
  search?: string;
  category?: string;
  page?: number;
  // ... 20 more lines
}
```

**Reference files instead of duplicating:**
```markdown
See implementation: `hooks/queries/models/use-models.ts`
```

### Avoid Cross-Pattern Pollution

Code examples should focus ONLY on the pattern being documented. Avoid showing implementation details from other system layers:

**Example - Caching Context File:**

```typescript
// Good: Shows only cache-relevant code
export default async function Page() {
  "use cache";
  cacheLife(config.profile);
  cacheTag(config.tag);

  const data = await getData();
  return <div>{data.title}</div>;
}
```

```typescript
// Bad: Shows validation, database queries, error handling
export default async function Page() {
  "use cache";
  cacheLife(config.profile);

  const validated = validateInput(schema, input); // Don't show validation details
  const data = await db.query.select()... // Don't show DB query patterns
  if (!data) throw new Error(); // Don't show error handling

  return (
    <div className="flex gap-4"> {/* Don't show UI patterns */}
      {data.title}
    </div>
  );
}
```

**Why:** Including other patterns gives false impressions about how those systems work. Each pattern should be documented in its own context file.

**When in doubt:** Show ONLY the specific API calls, directives, and patterns being documented. Replace everything else with comments or simplified placeholders.

### Formatting

**Use consistent formatting:**

**File paths:** Inline code with path separators
- `app/(admin)/admin/_components/`
- `hooks/queries/models/use-models.ts`

**Code concepts:** Inline code
- `queryKey`, `onSuccess`, `invalidateQueries`

**File/folder structure:** Code blocks with tree notation
```
hooks/
├── queries/
│   ├── models/
│   │   └── use-models.ts
```

**Commands/keys:** Inline code
- `['/api/models']`
- `.pick()`, `.extend()`

**Examples:** Labeled code blocks with `// Good` or `// Usage` comments

### Reference Links

Always include markdown reference links to official documentation at the **end of each major section**.

**Pattern:**
```markdown
## Section Title

[Section content...]

**Reference:** [API documentation](https://official-docs.com/api)
```

**For sections covering multiple APIs:**
```markdown
**References:** [API 1 documentation](https://...) | [API 2 documentation](https://...)
```

**Placement:**
- After all section content
- Before the next section heading
- Use `**Reference:**` or `**References:**` as the label

**Don't:**
- Use inline "Official docs: URL" format
- Place links mid-section
- Skip reference links (every major section should have them)

## Common Workflows Section

This section provides step-by-step checklists for common tasks.

**Format:**

```markdown
### Workflow 1: Descriptive Task Name

1. First action to take
2. Second action to take
3. Third action to take
```

**Guidelines:**
- Number steps sequentially
- Use imperative verbs (Create, Define, Import, Add)
- Keep steps atomic (one action per step)
- Reference files/locations specifically
- 3-7 steps per workflow (split if longer)

**Example:**
```markdown
### Workflow 1: Create List Query Hook

1. Create file: `hooks/queries/<feature>/use-<feature>s.ts`
2. Define options interface for filters/pagination
3. Use query key: `['/api/<feature>', filters?]`
4. Import action from `actions/<feature>/action.ts`
5. Set appropriate `staleTime` based on data volatility
```

## Guidelines Section

Provide clear DO/DON'T lists.

**Format:**

```markdown
### DO

1. **Bold guideline** - Explanation
2. **Another guideline** - Explanation

### DON'T

1. **Don't do this** - Why not
2. **Don't do that** - Why not
```

**Characteristics:**
- Bold the action/rule
- Brief explanation after dash
- 5-10 items per list
- Action-oriented statements
- Specific, not vague

**Example:**
```markdown
### DO

1. **Mirror API routes** - Query keys match API endpoint structure
2. **Include filters in key** - `['/api/models', { search: 'john' }]`
3. **Invalidate on mutations** - Use `onSuccess` callbacks

### DON'T

1. **Don't return JSX** - Hooks are for data operations only
2. **Don't forget invalidation** - Mutations must invalidate related queries
```

### "When to Use" vs "When NOT to Use"

For APIs or patterns with alternatives, document both sides of the decision:

**Pattern:**
```markdown
**When to use:**
- Scenario requiring this approach
- Specific need this addresses
- Context where this is optimal

**When NOT to use:**
- Alternative is better
- Constraint makes this unsuitable
- Performance/consistency tradeoff
```

**Why:** Helps developers make informed decisions by understanding both when an approach fits AND when to choose alternatives.

**Example:**
```markdown
**When to use:**
- User must see changes immediately
- Data consistency critical
- Mutation redirects to page showing modified data

**When NOT to use:**
- Performance more critical than immediate consistency
- Background refresh acceptable
```

## Examples Section

Show real code examples that demonstrate the pattern.

**Format:**

```markdown
### Example 1: Descriptive Title

```typescript
// Code demonstrating the pattern
```

**Why:** Brief explanation of why this follows the pattern
```

**Guidelines:**
- 3-5 examples showing different scenarios
- Use realistic code (not foo/bar)
- Include brief explanation after each example
- Show edge cases and variations
- Reference actual file paths when helpful

## Decision Trees

Use ASCII tree diagrams for placement/organization decisions.

**Format:**

```markdown
## Decision Tree

```
Question?
│
├─ YES → Action
│   │
│   └─ Sub-question?
│       └─ Action
│
└─ NO → Different action
```
```

**Guidelines:**
- Start with high-level question
- Branch with YES/NO or clear options
- End each path with concrete action
- Use indentation consistently
- Keep depth manageable (3-4 levels max)

### Contextual Considerations in Decision Trees

Decision trees shouldn't just be binary yes/no. Include contextual factors to consider:

**Pattern:**
```
Question?
│    (Consider: factor 1, factor 2, factor 3)
│
├─ YES → Action
│
└─ NO → Different action
```

**Example:**
```
Should this data be cached?
│    (Consider: data volatility, user-specific needs, freshness requirements)
│
├─ YES, cache this data → Use 'use cache'
│
└─ NO, needs per-request → Use Suspense
```

**Why:** Provides guidance on what factors to evaluate, not just the final decision.

## Tables

Use tables for quick reference and comparisons.

**Format:**

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value    | Value    | Value    |
```

**When to use:**
- Comparing multiple options
- Listing patterns with variations
- Quick reference lookups
- Mapping relationships

**Guidelines:**
- Keep columns narrow (concise content)
- 3-5 columns maximum
- Use code formatting in cells when appropriate
- Align headers descriptively

## Front Matter

Always include YAML front matter:

```markdown
---
title: "Human-Readable Pattern Name"
description: "Comprehensive summary listing all major topics covered"
---
```

**Guidelines:**
- Title uses title case
- Description acts as a **trigger condition** - readers use it to decide if they should read the file
- List ALL major topics, APIs, patterns, and concepts covered (may exceed 100 characters for comprehensiveness)
- Include specific API names, strategies, and implementation approaches
- Example: "Server-side rendering and caching patterns using Next.js 16 'use cache' directive, cacheLife profiles, cache tagging, revalidation strategies (updateTag vs revalidateTag), centralized cache configuration, PPR implementation, ISR patterns, and migration from route segment config."
- No additional metadata needed

## Maintenance

### Updating Context Files

**When to update:**
- Pattern evolves or changes
- New use cases emerge
- Conventions are clarified or refined
- Related patterns are added

**What to update:**
- Add new examples for new scenarios
- Update workflows if steps change
- Refine DO/DON'T lists based on common mistakes
- Add related patterns when created

**What NOT to update:**
- Don't add every minor variation
- Don't document exceptions (keep patterns simple)
- Don't turn into feature documentation

### Validation Checklist

Before finalizing a context file:

1. Does it document conventions, not features?
2. Does it document patterns, not teach the technology?
3. Does it avoid duplicating content from other context files?
4. Does it clearly reference related patterns instead of re-explaining them?
5. Is the scope narrow and focused on one pattern domain?
6. Is the writing concise and directive?
7. Are code examples minimal and focused?
8. Do workflows have clear, actionable steps?
9. Are DO/DON'T lists specific and practical?
10. Is front matter included?
11. Is it added to `context/index.md`?
12. Are reference links included at the end of each major section?
13. Does the description list ALL major topics comprehensively?
14. Are framework-specific terms used precisely and correctly?
15. Do code examples avoid showing patterns from other system layers?
16. Are advanced patterns and edge cases documented (not just basics)?
17. Are all emojis and Unicode symbols removed?
18. Do decision trees include contextual considerations (not just yes/no)?
19. For APIs with alternatives, is "When to Use" vs "When NOT to Use" documented?

## File Template

```markdown
---
title: "Pattern Name"
description: "Brief description"
---

# Pattern Name

## Overview

[2-3 sentences explaining what this pattern covers]

## Core Principles

### 1. Principle Name

[Brief explanation]

### 2. Another Principle

[Brief explanation]

## [Pattern-Specific Sections]

[File structure, naming conventions, key patterns]

## Common Workflows

### Workflow 1: Task Name

1. Step one
2. Step two
3. Step three

### Workflow 2: Another Task

1. Step one
2. Step two

## Guidelines

### DO

1. **Guideline** - Explanation
2. **Guideline** - Explanation

### DON'T

1. **Don't do this** - Why
2. **Don't do that** - Why

## Examples

### Example 1: Scenario Name

```typescript
// Code example
```

**Why:** Explanation

## Benefits

- Benefit one
- Benefit two
- Benefit three

## Related Patterns

- **Related pattern**: `context/related.md` (relationship)
- **Another pattern**: `context/another.md` (relationship)
```

## Examples of Good Context Files

Reference these existing files as examples:

- `context/component-organization.md` - Comprehensive decision tree, clear workflows
- `context/ui-validation-pattern.md` - Detailed examples, strong DO/DON'T lists
- `context/react-query-hooks.md` - Convention-based approach, revalidation patterns, minimal integration
- `context/api-organization.md` - Concise structure documentation
- `context/hono-rpc-api-development.md` - Focused on RPC-specific patterns, references API organization
- `context/hono-rpc-client-usage.md` - Client patterns only, references React Query integration

## Example: Pattern Documentation vs Tutorial

### Bad (generic tutorial):

```markdown
# React Query Hooks

React Query is a powerful data fetching library for React. It provides hooks like `useQuery` and `useMutation` that help manage server state.

The `useQuery` hook accepts two arguments: a query key and a query function. The query key is used to identify the query in the cache...
```

**Why it's bad:** Teaches React Query basics. A dev experienced with React Query doesn't need this.

### Good (pattern reference with tech details):

```markdown
# React Query Custom Hooks

## Query Key Conventions

Query keys mirror API route structure:

```typescript
// API: GET /api/models
queryKey: ['/api/models']

// API: GET /api/models/:id
queryKey: ['/api/models', id]
```

**Why:** Hierarchical keys enable prefix-based invalidation. Invalidating `['/api/models']` invalidates all nested keys.

## Common Mistakes

### DON'T

1. **Don't forget invalidation** - Mutations must invalidate related queries in `onSuccess`
2. **Don't return JSX** - Hooks are for data operations only
3. **Don't skip `enabled: !!id`** - Prevents queries when ID is undefined

## Tech-Specific Details

**staleTime strategy:**
- Use `staleTime: 1000 * 60 * 5` (5 min) for relatively static data
- Use `staleTime: 0` for frequently changing data
- Omit for default (0ms - always stale)
```

**Why it's good:**
- Assumes React Query knowledge, provides quick reminders
- Documents YOUR conventions (query key structure)
- Includes tech-specific details relevant to YOUR usage (`staleTime` policy)
- Highlights common mistakes in YOUR codebase
- Useful for experienced devs who haven't touched this in weeks

## Anti-Patterns

**Don't write context files that:**

1. **Document features** - Use `docs/components/` instead
2. **Tutorial style** - "In this section we'll learn..."
3. **Teach the technology** - "React Query is a data fetching library..."
4. **Explain library concepts** - "Query keys help React Query cache data..."
5. **Overly verbose** - Long prose paragraphs
6. **Too specific** - Document patterns, not individual files
7. **Too vague** - "Components should be organized well"
8. **Include opinions** - Only document established conventions
9. **Duplicate docs** - Reference external docs instead of copying
10. **Duplicate content** - If another context file covers it, reference it
11. **Mix concerns** - Keep each file focused on ONE pattern domain
12. **Document integrations deeply** - Show the connection, reference the details

## Related Documentation

- **Feature catalogs**: `docs/components/` (what was built)
- **Project overview**: `CLAUDE.md` (architecture, tech stack)
- **Implementation details**: Code comments and README files
