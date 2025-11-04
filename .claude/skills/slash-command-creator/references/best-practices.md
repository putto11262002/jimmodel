# Slash Command Best Practices

Advanced techniques and patterns for effective slash commands.

## Prompt Engineering for Commands

### Principle: Be Specific and Actionable

**Poor example:**
```markdown
---
description: Check the code
---
Review the code: $ARGUMENTS
```

**Good example:**
```markdown
---
description: Comprehensive code review with security focus
argument-hint: <filepath>
allowed-tools: [View]
---

Perform a comprehensive code review of @$1

**Analysis Framework:**

1. **Security Vulnerabilities:**
   - Input validation issues
   - SQL injection risks
   - XSS vulnerabilities
   - Authentication/authorization flaws
   - Sensitive data exposure

2. **Code Quality:**
   - Readability and maintainability
   - Naming conventions
   - Code organization
   - Duplication

3. **Performance:**
   - Algorithm complexity
   - Resource usage
   - Potential bottlenecks

4. **Best Practices:**
   - Error handling
   - Testing considerations
   - Documentation

**Output Format:**
For each issue found, provide:
- Line number(s)
- Severity (Critical/High/Medium/Low)
- Detailed explanation
- Specific recommendation with code example

Prioritize findings by severity.
```

### Use Context Effectively

**Leverage project files:**
```markdown
---
description: Create component following project patterns
argument-hint: <ComponentName>
allowed-tools: [View, CreateFile]
---

Create a new React component: $1

**Project Context:**
- Component patterns: @src/components/README.md
- Styling approach: @package.json (check for styled-components/tailwind/etc)
- TypeScript config: @tsconfig.json
- Existing examples: @src/components/Button/

Follow the established patterns in this project.
```

**Combine file and command context:**
```markdown
---
description: API endpoint review with OpenAPI validation
argument-hint: <endpoint-file>
allowed-tools: [View, Bash]
---

Review API endpoint: @$1

**OpenAPI Specification:**
!cat openapi.yaml | grep -A 20 "$1"

**Project API Patterns:**
@docs/api-conventions.md

Validate that the endpoint matches:
1. OpenAPI spec requirements
2. Project conventions
3. Security best practices
```

## Scoping and Organization

### Project vs User Commands

**Project commands** (`.claude/commands/`):
- Team-shared workflows
- Project-specific conventions
- Version controlled
- Examples: component generators, migration helpers, deployment scripts

**User commands** (`~/.claude/commands/`):
- Personal productivity tools
- Cross-project utilities
- Personal preferences
- Examples: todo management, journal entries, personal templates

### Directory Organization Strategies

**By feature area:**
```
.claude/commands/
├── frontend/
│   ├── component.md
│   ├── hook.md
│   └── style.md
├── backend/
│   ├── api.md
│   ├── migration.md
│   └── test.md
└── devops/
    ├── deploy.md
    └── monitor.md
```

**By workflow type:**
```
.claude/commands/
├── create/
│   ├── component.md
│   ├── api.md
│   └── migration.md
├── review/
│   ├── code.md
│   ├── security.md
│   └── performance.md
└── maintain/
    ├── refactor.md
    └── document.md
```

## Tool Access Patterns

### Minimal Permissions Principle

Only grant tools that are essential for the command's purpose.

**Read-only analysis:**
```yaml
allowed-tools: [View]
```

**File creation without editing:**
```yaml
allowed-tools: [CreateFile, View]
```

**Full file manipulation:**
```yaml
allowed-tools: [CreateFile, Edit, View]
```

**Git operations only:**
```yaml
allowed-tools: [Bash]
```

**Mixed operations:**
```yaml
allowed-tools: [View, CreateFile, Bash]
```

### MCP Tool Integration

**Approve entire server:**
```yaml
allowed-tools: [mcp__github]  # All GitHub tools
```

**Approve specific tools:**
```yaml
allowed-tools: [
  mcp__github__search_issues,
  mcp__github__get_issue,
  mcp__github__create_comment
]
```

**Combine built-in and MCP:**
```yaml
allowed-tools: [
  View,
  CreateFile,
  mcp__github__create_pr,
  mcp__slack__send_message
]
```

## Advanced Argument Handling

### Default Values

Use shell parameter expansion syntax:

```markdown
Name: $1
Type: ${2:-functional}  # Default to 'functional' if $2 not provided
Options: ${3:-none}     # Default to 'none' if $3 not provided
```

### Conditional Content

```markdown
Create component: $1

${2:+Generate tests for $1 in $2 style}
# Only includes this line if $2 is provided
```

### Validation in Prompt

```markdown
---
description: Create database migration
argument-hint: <action> <table-name>
---

Migration action: $1
Table: $2

**Validation:** Ensure $1 is one of: create, alter, drop, rename

**Implementation:**
Based on action '$1', generate a migration to $1 table '$2'.
```

## Context Management

### Dynamic File Loading

```markdown
---
description: Review file with related tests
argument-hint: <source-file>
---

Source file: @$1

Related test file:
@${1/.ts/.test.ts}  # Automatically find test file

Review both source and tests for consistency.
```

### Conditional File References

```markdown
---
description: Component review with optional config
argument-hint: <component-path>
---

Component: @$1

Project config (if exists):
@.prettierrc
@.eslintrc.json
@tsconfig.json

Apply project standards from config files.
```

## Pattern Library

### Progressive Enhancement

```markdown
---
description: Create feature with progressive options
argument-hint: <feature-name> [with-tests] [with-docs] [with-types]
---

Creating feature: $1

Base implementation:
[always include]

${2:+**Tests:** Generate comprehensive test suite}
${3:+**Documentation:** Generate API documentation and usage guide}
${4:+**TypeScript:** Add full type definitions and interfaces}
```

### Workflow Orchestration

```markdown
---
description: Complete PR workflow
argument-hint: <branch-name>
allowed-tools: [Bash, View, CreateFile]
---

PR Workflow for branch: $1

**Step 1: Analyze Changes**
!git diff main..$1 --stat

**Step 2: Review Code Quality**
[Analysis of changes]

**Step 3: Check Tests**
!npm test 2>&1 | tail -20

**Step 4: Generate PR Description**
[Auto-generated description]

**Step 5: Checklist**
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Changelog updated
```

### Context-Aware Generation

```markdown
---
description: Generate endpoint with auto-detected framework
allowed-tools: [View, CreateFile, Bash]
---

Detect framework:
!cat package.json | grep -E "(express|fastify|koa|nestjs)"

Generate endpoint for detected framework following project patterns.
```

## Testing and Iteration

### Test Your Commands

1. **Start simple:** Test with basic inputs first
2. **Edge cases:** Try missing arguments, special characters
3. **File paths:** Test relative and absolute paths
4. **Error conditions:** What happens when files don't exist?
5. **Tool permissions:** Verify tool restrictions work as expected

### Iterate Based on Usage

**Version 1 - Basic:**
```markdown
---
description: Create component
---
Create React component: $ARGUMENTS
```

**Version 2 - Add structure:**
```markdown
---
description: Create React component
argument-hint: <ComponentName>
---
Create component $1 with:
- Component file
- Styles
- Basic props
```

**Version 3 - Full featured:**
```markdown
---
description: Create React component with options
argument-hint: <ComponentName> [type] [with-tests]
allowed-tools: [View, CreateFile]
---
Check existing patterns: @src/components/

Create component $1:
- Type: ${2:-functional}
- ${3:+Include test file}
- Follow project patterns
- Add TypeScript types
- Include prop documentation
```

### Common Improvements

**Add argument hints:**
```yaml
# Before
argument-hint: 

# After  
argument-hint: <n> <type> [options]
```

**Restrict tools:**
```yaml
# Before
allowed-tools: [Bash, Edit, View, CreateFile]

# After (only what's needed)
allowed-tools: [View]
```

**Add context:**
```markdown
# Before
Review @$1

# After
Review @$1 in context of:
- API spec: @docs/api.md
- Security guidelines: @docs/security.md
```

## Anti-Patterns to Avoid

### ❌ Vague Instructions

```markdown
Review this code and make it better: @$1
```

### ✅ Specific Instructions

```markdown
Review @$1 for:
1. Type safety issues
2. Error handling
3. Performance bottlenecks
Provide specific improvements with code examples.
```

### ❌ Too Many Tools

```yaml
allowed-tools: [Bash, Edit, View, CreateFile]  # For a read-only review
```

### ✅ Minimal Tools

```yaml
allowed-tools: [View]  # Read-only is sufficient
```

### ❌ No Argument Hints

```yaml
description: Create a thing
# No argument-hint
```

### ✅ Clear Argument Hints

```yaml
description: Create a component
argument-hint: <ComponentName> [type] [style]
```

### ❌ Overly Generic

```markdown
Do something with $ARGUMENTS
```

### ✅ Structured and Specific

```markdown
Component: $1
Type: ${2:-functional}
Style: ${3:-css-modules}

[Detailed implementation instructions]
```

## Maintenance Tips

1. **Document complex commands:** Add comments in the markdown
2. **Version control:** Commit `.claude/commands/` with your code
3. **Share with team:** Collaborate on project commands
4. **Review periodically:** Update commands as project evolves
5. **Remove unused:** Delete commands that aren't being used
6. **Test after changes:** Verify commands still work after updates

## Resources

- Official docs: https://docs.claude.com/en/docs/claude-code/slash-commands
- Example commands: See references/examples.md
- Templates: See assets/ directory
- Initialization script: scripts/init_command.py
