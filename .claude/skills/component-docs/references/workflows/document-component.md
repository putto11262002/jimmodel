# Workflow: Document a Component

## Purpose
Create or update component documentation in `docs/components/` by exploring git changes to understand what was implemented.

## When to Use
- After implementing a new feature or component
- When updating an existing feature with significant changes
- To create a reference guide for future developers

## Workflow Steps

### 1. Determine Component Name
Ask the user which component they want to document, or infer from their description.
- Example: "I just implemented authentication" → component name: `authentication`
- Resulting file: `docs/components/authentication.md`

### 2. Explore Git Changes
Use git commands to discover what was actually changed/implemented:

```bash
# See recent commits (get context on what was done)
git log --oneline -10

# See what files were changed in the latest commits
git diff HEAD~N HEAD --name-only  # where N = number of commits back

# See the actual code changes
git diff HEAD~N HEAD

# See unstaged changes if working on active feature
git status
git diff
```

**Goal:** Extract from git:
- Files created/modified
- Technologies/libraries added (check package.json changes)
- Configuration changes
- Overall implementation scope

### 3. Check for Existing Documentation
Look for: `docs/components/[component-name].md`

**If file exists:**
- Load the current documentation
- Identify which sections need updating based on git changes
- Preserve existing content that's still accurate
- Add/update sections with new implementation details

**If file doesn't exist:**
- Proceed to Step 4 (create new)

### 4. Gather Implementation Details from Git Exploration
Extract and organize:

**Files & Locations:**
- All relevant files discovered from `git diff` and `git status`
- Map to project structure (app/, db/, etc.)

**Technologies & Libraries:**
- Any new packages added (check `git diff package.json`)
- Version information
- Why each was chosen (infer from context or ask user)

**Configuration:**
- Environment variables referenced in code changes
- Config files modified
- Setup steps required

**How It Works:**
- Explain the flow/architecture based on code exploration
- Reference the actual implementation files

### 5. Create or Update Documentation
Use the template from `assets/component-template.md`:
- Fill sections with information gathered from git
- Keep language clear and concise
- Include file paths as references
- Add documentation links for used libraries

### 6. Validate Completeness
Use the checklist from `checklists/component-docs-checklist.md` to ensure:
- All key sections are present
- File paths are correct
- Documentation links are included
- Overview is clear for future developers

## Key Principles

1. **Git-Driven Discovery** - Use git to objectively find what changed, not just user memory
2. **Single Source of Truth** - Document what's actually in the code, not ideal architecture
3. **Future Developer Focus** - Write for someone unfamiliar with the project
4. **Progressive Detail** - Overview first, then implementation details
5. **Maintain Consistency** - Follow template structure across all component docs
