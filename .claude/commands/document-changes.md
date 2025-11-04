---
description: Analyze current git changes and document the component using the component-docs skill
allowed-tools: [Bash]
argument-hint: "[component-name]"
---

# Document Changes

Analyze the current git changes in the project and create or update component documentation based on what was implemented.

## What This Does

1. Shows recent git changes in your working directory
2. Identifies files that were modified or added
3. Invokes the `component-docs` skill to create/update documentation in `docs/components/`

## Usage

```
/document-changes              # Interactive: shows changes and asks for component name
/document-changes auth         # Specific: documents the "auth" component
```

---

## Implementation

Let me show you the current git changes and help document them.

### Step 1: Display Current Git Changes

First, let's see what changes exist:

```bash
!git status --short
```

```bash
!git diff --stat HEAD~5..HEAD
```

### Step 2: Get Component Name

If you didn't provide a component name as an argument, I'll ask you now:

**What component name should we use for documentation?**

Suggestions based on the files changed:
- Look at the directories that were modified (e.g., `app/lib/auth.ts` → suggest "authentication")
- Think about the feature/component being documented
- Use kebab-case (e.g., "database-schema", "api-routes")

$1 is the component name (if provided as argument)

### Step 3: Invoke Component-Docs Skill

Now I'll invoke the `component-docs` skill to handle the documentation creation/update.

The skill will:
1. **Explore git changes** - Analyze what was actually implemented
2. **Check existing docs** - Look for `docs/components/[component-name].md`
3. **Gather details** - Extract files, technologies, configuration from code changes
4. **Create or update** - Use the component documentation template
5. **Validate** - Ensure completeness using the checklist

**Invoking skill:** `component-docs`

The component-docs skill has the expertise to:
- Use git commands intelligently to discover implementation details
- Apply the predefined template structure (Overview, Files & Locations, Technologies, etc.)
- Handle both new documentation and updates to existing docs
- Validate the final documentation quality

---

**Let's begin! Showing your current changes...**
