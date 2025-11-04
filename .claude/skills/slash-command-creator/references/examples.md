# Slash Command Examples

Complete working examples of slash commands for various use cases.

## Code Review Command

**File:** `.claude/commands/review.md`

```markdown
---
description: Review code for quality, security, and best practices
argument-hint: <filepath>
allowed-tools: [View]
---

Perform a comprehensive code review of @$1

Focus on:

**Code Quality:**
- Readability and maintainability
- Naming conventions
- Code organization
- Duplication and refactoring opportunities

**Security:**
- Input validation
- Authentication/authorization
- Injection vulnerabilities (SQL, XSS, etc.)
- Sensitive data handling

**Performance:**
- Algorithmic efficiency
- Resource usage
- Potential bottlenecks

**Best Practices:**
- Error handling
- Testing considerations
- Documentation quality
- Design patterns

Provide specific line numbers and actionable recommendations.
```

**Usage:** `/review src/api/users.ts`

## Component Generator

**File:** `.claude/commands/frontend/component.md`

```markdown
---
description: Generate a new React component with TypeScript
argument-hint: <ComponentName> <type>
allowed-tools: [CreateFile, Edit, View]
---

Create a new React component with the following specifications:

**Component Name:** $1
**Type:** $2 (functional, class, or hook)

**Requirements:**
1. Create the component file at `src/components/$1/$1.tsx`
2. Include TypeScript types/interfaces
3. Add PropTypes or TypeScript prop validation
4. Include basic styling (CSS module or styled-components based on project)
5. Add JSDoc documentation
6. Follow project naming and structure conventions
7. Create a basic test file at `src/components/$1/$1.test.tsx`

**Additional Context:**
Check @src/components for existing patterns and conventions.
Review @package.json to determine which styling library is used.

Generate clean, production-ready code following the project's established patterns.
```

**Usage:** `/component UserCard functional`

## Test Writer

**File:** `.claude/commands/test.md`

```markdown
---
description: Generate comprehensive tests for a given file
argument-hint: <filepath>
allowed-tools: [View, CreateFile, Edit]
---

Generate comprehensive unit tests for @$1

**Test Requirements:**
1. Analyze the code structure and identify all testable units
2. Create test file following project conventions (e.g., `*.test.ts` or `*.spec.ts`)
3. Include:
   - Happy path tests
   - Edge cases
   - Error handling
   - Boundary conditions
   - Mock external dependencies appropriately

4. Use the testing framework from @package.json (Jest, Vitest, Mocha, etc.)
5. Follow AAA pattern (Arrange, Act, Assert)
6. Add descriptive test names
7. Aim for >80% code coverage

**Additional Context:**
Check @tests for existing test patterns and utilities.
Review @jest.config.js or similar config for test setup.

Generate clean, maintainable tests that serve as documentation.
```

**Usage:** `/test src/utils/validation.ts`

## Documentation Updater

**File:** `~/.claude/commands/docs.md`

```markdown
---
description: Update or create documentation for a file
argument-hint: <filepath>
allowed-tools: [View, Edit, CreateFile]
---

Update or create documentation for @$1

**Documentation Tasks:**

1. **Code Comments:**
   - Add/update JSDoc or similar doc comments
   - Explain complex logic
   - Document parameters, return types, and exceptions
   - Add usage examples for public APIs

2. **README Updates:**
   - Update relevant README.md if this is a new feature
   - Add usage examples
   - Update API documentation

3. **CHANGELOG:**
   - Add entry to CHANGELOG.md if it exists
   - Note: only if this represents a significant change

**Style Guidelines:**
- Be concise but complete
- Use clear, active voice
- Include code examples for complex features
- Keep documentation up-to-date with implementation

Review @README.md and @CHANGELOG.md for existing format and style.
```

**Usage:** `/docs src/api/auth.ts`

## Git Workflow Helper

**File:** `~/.claude/commands/git-next.md`

```markdown
---
description: Analyze git status and suggest next steps
allowed-tools: [Bash]
---

Analyze the current git state and recommend next actions.

**Current Repository State:**

```bash
!git status
```

**Recent Commits:**

```bash
!git log --oneline -10
```

**Current Branch:**

```bash
!git branch --show-current
```

**Uncommitted Changes Summary:**

```bash
!git diff --stat
```

---

Based on the current state, provide:

1. **Status Summary:** Brief overview of uncommitted changes
2. **Recommended Actions:** What should be done next (commit, push, pull, create PR, etc.)
3. **Suggested Commit Message:** If changes are ready to commit
4. **Potential Issues:** Any conflicts, large files, or concerns
5. **Next Steps:** Specific git commands to run

Be concise and actionable.
```

**Usage:** `/git-next`

## API Schema Validator

**File:** `.claude/commands/api/validate.md`

```markdown
---
description: Validate API schema against OpenAPI spec
argument-hint: <endpoint-file>
allowed-tools: [View, Bash]
---

Validate the API endpoint in @$1 against the OpenAPI specification.

**OpenAPI Spec:**

```bash
!cat openapi.yaml
```

**Endpoint Implementation:**

@$1

---

**Validation Checklist:**

1. **Route Definition:**
   - Does the route match the spec?
   - Are HTTP methods correct?
   - Are path parameters defined correctly?

2. **Request Validation:**
   - Are all required parameters present?
   - Do parameter types match the spec?
   - Is request body schema validated?

3. **Response Structure:**
   - Do response codes match the spec?
   - Are response schemas correct?
   - Are error responses properly defined?

4. **Security:**
   - Are authentication requirements met?
   - Are authorization checks in place?
   - Are rate limits implemented?

5. **Documentation:**
   - Are inline comments helpful?
   - Is the endpoint well-documented?

Provide specific discrepancies and recommendations for fixes.
```

**Usage:** `/validate src/api/routes/users.ts`

## Refactor Command

**File:** `.claude/commands/refactor.md`

```markdown
---
description: Suggest refactoring improvements for code
argument-hint: <filepath>
allowed-tools: [View, Edit]
---

Analyze @$1 and suggest refactoring improvements.

**Refactoring Analysis:**

1. **Code Smells:**
   - Long methods/functions
   - Duplicated code
   - Large classes
   - Complex conditionals
   - Magic numbers/strings

2. **Design Patterns:**
   - Are appropriate patterns being used?
   - Would other patterns improve the code?

3. **SOLID Principles:**
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

4. **Readability:**
   - Naming clarity
   - Function/method size
   - Nesting depth
   - Comments necessity

**Provide:**
- Specific issues found
- Recommended refactorings
- Code examples for complex changes
- Estimated risk/effort for each change

Prioritize changes by impact and risk.
```

**Usage:** `/refactor src/services/payment.ts`

## Migration Command

**File:** `.claude/commands/migrate.md`

```markdown
---
description: Create database migration file
argument-hint: <migration-name>
allowed-tools: [CreateFile, View, Bash]
---

Create a database migration: $1

**Migration Name:** $1

**Determine Migration Framework:**

```bash
!cat package.json | grep -E "(sequelize|typeorm|prisma|knex)"
```

**Check Existing Migrations:**

```bash
!ls -la migrations/ 2>/dev/null || ls -la prisma/migrations/ 2>/dev/null || echo "No migrations directory found"
```

---

Based on the migration framework detected, create a new migration file for: $1

**Include:**
1. Timestamp-based filename
2. Up migration (apply changes)
3. Down migration (rollback changes)
4. Proper SQL or framework-specific syntax
5. Comments explaining the changes
6. Transaction wrapping if supported

**Consider:**
- Index creation for foreign keys
- Data migration if needed
- Backward compatibility
- Performance impact

Follow the existing migration patterns in the project.
```

**Usage:** `/migrate add-user-preferences-table`

## Performance Analyzer

**File:** `~/.claude/commands/perf.md`

```markdown
---
description: Analyze code for performance issues
argument-hint: <filepath>
allowed-tools: [View]
---

Analyze @$1 for performance issues and optimization opportunities.

**Performance Analysis:**

1. **Algorithm Complexity:**
   - Time complexity (Big O notation)
   - Space complexity
   - Nested loops
   - Recursive calls

2. **Data Structures:**
   - Appropriate data structure usage
   - Unnecessary data copying
   - Memory allocations

3. **I/O Operations:**
   - Database query efficiency
   - API call patterns
   - File I/O optimization
   - Caching opportunities

4. **Common Issues:**
   - N+1 query problems
   - Unnecessary re-renders (React)
   - Memory leaks
   - Blocking operations

5. **Optimization Strategies:**
   - Memoization opportunities
   - Lazy loading
   - Batch processing
   - Parallel execution

**Provide:**
- Specific bottlenecks found
- Estimated performance impact
- Optimization recommendations with code examples
- Trade-offs to consider

Prioritize by performance impact.
```

**Usage:** `/perf src/services/data-processor.ts`

## Quick Start Template

**File:** `.claude/commands/quickstart.md`

```markdown
---
description: Generate project quickstart template
argument-hint: <project-type>
allowed-tools: [CreateFile, Bash]
---

Generate a quickstart template for a $1 project.

**Project Type:** $1

Create a comprehensive quickstart guide that includes:

1. **Project Structure:**
   - Directory layout
   - Key files and their purposes

2. **Setup Instructions:**
   - Prerequisites
   - Installation steps
   - Environment configuration

3. **Development Workflow:**
   - Running locally
   - Testing
   - Building
   - Deployment

4. **Common Tasks:**
   - Adding features
   - Running tests
   - Debugging
   - Troubleshooting

5. **Best Practices:**
   - Code style
   - Git workflow
   - Testing strategy
   - Documentation

Generate the README.md with all necessary information for a new developer to get started quickly.
```

**Usage:** `/quickstart react-typescript-vite`

---

## Tips for Using These Examples

1. **Customize for your project:** Adapt examples to match your tech stack and conventions
2. **Start simple:** Begin with basic commands and add complexity as needed
3. **Combine patterns:** Mix and match techniques from different examples
4. **Use subdirectories:** Organize related commands (e.g., `/api/`, `/frontend/`)
5. **Share with team:** Project-level commands in `.claude/commands/` are version controlled
6. **Iterate based on usage:** Commands improve through real-world use and feedback
