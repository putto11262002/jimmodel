# Git Exploration Guide

This guide explains how to use git commands to discover what was implemented in a feature/component.

## Quick Reference Commands

### See Recent Commits
```bash
git log --oneline -10
```
Shows the last 10 commits with their messages. Use this to understand recent work.

### See What Files Changed
```bash
# Between two commits
git diff HEAD~N HEAD --name-only

# See what was changed (with lines added/removed)
git diff HEAD~N HEAD --stat

# In current working directory (uncommitted changes)
git status
```

### See Actual Code Changes
```bash
# All changes in the last N commits
git diff HEAD~N HEAD

# Changes to specific file
git diff HEAD~N HEAD -- path/to/file.ts

# More readable: only show changed lines without full context
git diff HEAD~N HEAD --unified=1
```

### See New Files Created
```bash
# Show only new files in commits
git log --oneline --diff-filter=A --name-only HEAD~N..HEAD
```

## Discovery Workflow

### Step 1: Understand Recent Work
```bash
git log --oneline -15
```

This shows you recent commits. Look at commit messages to understand the scope of work done.

### Step 2: Identify Changed Files
```bash
# If work is in last N commits:
git diff HEAD~N HEAD --stat
```

Example output:
```
 app/lib/auth.ts        | 150 ++
 app/middleware.ts      | 45 ++
 app/api/auth/route.ts  | 30 ++
 .env.example           | 3 +
 package.json           | 2 ++
 5 files changed, 230 insertions(+)
```

This tells you:
- Which files were created/modified
- How much code was added/removed

### Step 3: Review Package Changes
```bash
git diff HEAD~N HEAD -- package.json
```

This shows new dependencies added. This indicates what technologies/libraries were integrated.

Example:
```diff
+ "next-auth": "^5.0.0",
+ "jsonwebtoken": "^9.0.0",
```

### Step 4: Examine Key Files
```bash
# View the complete file as it is now
git show HEAD:path/to/file.ts

# Or see what was added
git diff HEAD~N HEAD -- path/to/file.ts
```

### Step 5: Understand File Structure
```bash
# See new directories/files created
git log --oneline --diff-filter=A --name-only HEAD~N..HEAD
```

## Practical Examples

### Example 1: Document a New Auth Implementation

**Step 1: Check commits**
```bash
git log --oneline -5
# Output:
# a1b2c3d feat: implement github oauth authentication
# e4f5g6h feat: add auth middleware
# i7j8k9l feat: create auth configuration
```

**Step 2: See what files changed**
```bash
git diff HEAD~3 HEAD --stat
```

**Step 3: Check dependencies added**
```bash
git diff HEAD~3 HEAD -- package.json
```

**Step 4: Review the auth implementation**
```bash
git show HEAD:app/lib/auth.ts
git show HEAD:app/middleware.ts
git show HEAD:app/api/auth/[...nextauth]/route.ts
```

### Example 2: Document Database Schema Changes

**Step 1: Check recent commits**
```bash
git log --oneline -3 -- db/schema/
```

**Step 2: See schema file changes**
```bash
git diff HEAD~2 HEAD -- db/schema/
```

**Step 3: Check migrations generated**
```bash
git log --oneline --diff-filter=A -- drizzle/
```

**Step 4: Review configuration**
```bash
git show HEAD:drizzle.config.ts
```

## Tips for Effective Git Exploration

1. **Use `-p` flag** to see full code diffs with context:
   ```bash
   git log -p --oneline -5
   ```

2. **Filter by file pattern** to see only relevant changes:
   ```bash
   git diff HEAD~N HEAD -- "app/lib/*"
   ```

3. **Use `--since` and `--until`** to explore by date:
   ```bash
   git log --oneline --since="2 days ago"
   ```

4. **See who changed what**:
   ```bash
   git log --oneline --author="username"
   ```

5. **Check if a file existed in the past**:
   ```bash
   git ls-tree HEAD -- path/to/file.ts
   ```
   If output is empty, file didn't exist in this commit.

## Inferring Implementation Details from Git

### From Commit Messages
- **"feat:"** = new feature implemented
- **"fix:"** = bug fix made
- **"refactor:"** = code reorganized
- **"chore:"** = dependency/config updates

### From File Paths
- `app/lib/` = shared utilities/clients
- `app/api/` = API routes
- `app/middleware.ts` = request middleware
- `db/schema/` = database schema
- `drizzle/` = migrations

### From Package.json Changes
- New dependencies tell you what libraries/services were integrated
- Version changes indicate compatibility updates

### From Code Changes
- `import` statements show what modules are being used
- Configuration patterns show how features are set up
- Comments in code can explain "why" decisions were made

## Common Issues & Solutions

**Issue: Can't find the right commits**
- Use `git log --grep="keyword"` to search commit messages
- Example: `git log --grep="auth"`

**Issue: Changes spread across multiple files**
- Use `git diff HEAD~N HEAD --name-only | xargs git show HEAD:` to view all files

**Issue: Too much output**
- Use `--unified=1` to reduce context lines
- Use `--stat` to see only file summaries
- Pipe to `less` or use `git -P` for pagination

**Issue: Unsure how many commits back to look**
- Start with `git log --oneline -20` and look for logical commit boundaries
- Or use `git diff main..HEAD` to compare against main branch
