# Slash Commands API Reference

Comprehensive reference for slash command features and syntax.

## Frontmatter Fields Reference

### description
**Type:** String  
**Required:** No (defaults to first line of prompt)  
**Description:** Brief description shown in `/help` output

**Example:**
```yaml
description: Review code for quality and security issues
```

### allowed-tools
**Type:** Array of strings  
**Required:** No (inherits from conversation if omitted)  
**Description:** Restricts which tools the command can use

**Built-in Tools:**
- `Bash` - Execute shell commands
- `Edit` - Edit existing files
- `View` - View files and directories
- `CreateFile` - Create new files

**MCP Tools:**
- `mcp__servername` - Approve all tools from a server
- `mcp__servername__toolname` - Approve specific tool
- Wildcards NOT supported

**Examples:**
```yaml
allowed-tools: [Bash, View]
allowed-tools: [mcp__github__get_issue, mcp__github__search_issues]
allowed-tools: [mcp__github]  # Approves ALL github tools
```

### argument-hint
**Type:** String  
**Required:** No  
**Description:** Shows expected parameters in autocomplete

**Conventions:**
- Required args: `<arg-name>`
- Optional args: `[arg-name]`
- Multiple options: `add <id> | remove <id> | list`

**Examples:**
```yaml
argument-hint: <filepath>
argument-hint: <n> <type> [options]
argument-hint: add <tag> | remove <tag> | list
```

### model
**Type:** String  
**Required:** No  
**Description:** Specific Claude model to use for this command

**Available Models:**
- `claude-sonnet-4-20250514` (current)
- Check https://docs.anthropic.com/en/docs/about-claude/models for latest

**Example:**
```yaml
model: claude-sonnet-4-20250514
```

## Argument Placeholders

### $ARGUMENTS
Captures all arguments as a single string.

**Example:**
```markdown
Command: /search functional programming
$ARGUMENTS = "functional programming"
```

### $1, $2, $3, etc.
Individual positional arguments (space-separated).

**Example:**
```markdown
Command: /create Button primary large
$1 = "Button"
$2 = "primary"
$3 = "large"
```

**Note:** Arguments with spaces must be quoted in the shell, but the quotes are not included in the placeholder values.

## Context References

### File References (@)
Include file contents in the prompt using `@filename` syntax.

**Examples:**
```markdown
@README.md
@src/config.ts
@package.json
```

**Usage with arguments:**
```markdown
Review the following file: @$1
```

**Multiple files:**
```markdown
Compare @$1 with @$2
```

### Command Execution (!)
Execute bash commands and include output in prompt using `!command` syntax.

**Requirements:**
- Must include `Bash` in `allowed-tools`

**Examples:**
```markdown
!git status
!cat package.json
!ls -la src/
!git log --oneline -5
```

**Common patterns:**
```markdown
Current branch:
!git branch --show-current

Recent changes:
!git diff --stat

Dependencies:
!npm list --depth=0
```

## Command Organization

### Naming Conventions
- Use lowercase with hyphens: `code-review`, `create-component`
- Filename becomes command name: `optimize.md` → `/optimize`
- Avoid conflicts between user and project commands

### Directory Structure

**Project-level (.claude/commands/):**
```
.claude/
└── commands/
    ├── review.md           → /review (project)
    ├── frontend/
    │   ├── component.md    → /component (project:frontend)
    │   └── hook.md         → /hook (project:frontend)
    └── backend/
        └── migration.md    → /migration (project:backend)
```

**User-level (~/.claude/commands/):**
```
~/.claude/
└── commands/
    ├── todo.md            → /todo (user)
    ├── personal/
    │   └── journal.md     → /journal (user:personal)
    └── work/
        └── standup.md     → /standup (user:work)
```

## Best Practices

### Prompt Engineering

**Be specific and detailed:**
```markdown
❌ Review this code
✅ Review this code for security vulnerabilities, focusing on:
   - Input validation
   - SQL injection risks
   - Authentication issues
```

**Provide context:**
```markdown
✅ Analyze @$1 in the context of our API design from @docs/api-design.md
```

**Use structured output:**
```markdown
✅ Provide analysis in the following format:
   1. Issues Found
   2. Severity (High/Medium/Low)
   3. Recommendations
   4. Code Examples
```

### Tool Restrictions

**Only allow necessary tools:**
```yaml
# Too permissive
allowed-tools: [Bash, Edit, View, CreateFile]

# Better - only what's needed
allowed-tools: [View]
```

**For read-only analysis:**
```yaml
allowed-tools: [View]
```

**For file creation:**
```yaml
allowed-tools: [CreateFile, View]
```

**For git operations:**
```yaml
allowed-tools: [Bash]
```

### Argument Design

**Single file operations:**
```yaml
argument-hint: <filepath>
```
```markdown
Process @$1
```

**Multiple arguments:**
```yaml
argument-hint: <source> <destination>
```
```markdown
Copy from @$1 to $2
```

**Optional arguments:**
```yaml
argument-hint: <n> [type] [options]
```
```markdown
Name: $1
Type: ${2:-default}
Options: ${3:-none}
```

## Advanced Patterns

### Conditional Logic in Prompts

```markdown
---
description: Create component with optional test file
argument-hint: <n> [with-tests]
---

Create component: $1

${2:+Also generate test file for $1}
```

### Multi-step Workflows

```markdown
---
description: Complete feature workflow
argument-hint: <feature-name>
allowed-tools: [CreateFile, Edit, View, Bash]
---

Implement feature: $1

Steps:
1. Check current state: !git status
2. Review existing code: @src/
3. Create necessary files
4. Update documentation
5. Suggest test cases
```

### MCP Integration

```markdown
---
description: GitHub issue workflow
allowed-tools: [mcp__github__search_issues, mcp__github__get_issue, mcp__github__create_issue]
argument-hint: <action> <query>
---

GitHub action: $1
Query: $2

Execute the requested GitHub operation.
```

## Troubleshooting

### Command not found
- Check file is in `.claude/commands/` or `~/.claude/commands/`
- Verify filename matches command name (without .md)
- Restart Claude Code if needed

### Arguments not working
- Use `$ARGUMENTS` for all args as string
- Use `$1`, `$2`, etc. for individual args
- Check for proper spacing in command invocation

### File references not working
- Verify file paths are correct relative to project root
- Use `@` prefix for file references
- Check file exists and is readable

### Bash commands failing
- Ensure `Bash` is in `allowed-tools`
- Test command in terminal first
- Check for proper escaping of special characters

### Tool permissions errors
- Verify tool names in `allowed-tools` are correct
- Built-in tools: `Bash`, `Edit`, `View`, `CreateFile`
- MCP tools: Check `/mcp` output for exact names
