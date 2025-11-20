---
description: Create a GitHub issue with guided prompts
allowed-tools: [Bash]
argument-hint: <initial-description>
---

Create a GitHub issue based on this initial description:

$ARGUMENTS

Follow this workflow:

## Step 1: Gather Information

Analyze the initial description and determine what additional information is needed to complete the issue template below. Use the AskUserQuestion tool to gather any missing details:

**Issue Template Fields:**
- **Summary**: Brief description of the issue/request
- **Type**: Bug, Feature request, or Question/other
- **Details**: Detailed explanation with links, screenshots, or examples if useful
- **Steps to Reproduce** (for bugs only): Numbered steps, expected behavior, actual behavior
- **Environment** (if relevant): Version/commit, OS/browser, other details

Ask clear, specific questions to fill in any gaps. For example:
- "Is this a bug, feature request, or question?"
- "Can you provide the steps to reproduce this bug?"
- "What environment are you using (OS, version, etc.)?"

## Step 2: Format the Issue

Once you have sufficient information, format the complete issue using this template:

```
## Summary

[Brief description]

## Type

- [x] Bug / [ ] Feature request / [ ] Question/other

## Details

[Detailed explanation with links, screenshots, or examples]

## Steps to Reproduce (for bugs)

1. [First step]
2. [Second step]
3. [Third step]

**Expected behavior:** [What should happen]
**Actual behavior:** [What actually happens]

## Environment (if relevant)

- Version / commit: [version]
- OS / browser: [environment]
- Other details: [additional context]
```

**Formatting notes:**
- Check the appropriate type with `[x]`
- If not a bug, mark "Steps to Reproduce" as "N/A" or omit details
- Only include Environment section if relevant

## Step 3: Get Approval

Present the formatted issue content to the user and explicitly ask: "Should I create this GitHub issue?"

Do NOT proceed until the user approves.

## Step 4: Create the Issue

Once approved, create the issue using GitHub CLI:

1. Extract a concise, descriptive title from the summary (max 80 characters)
2. Use `gh issue create` with a HEREDOC for proper formatting:

```bash
gh issue create --title "Your Title Here" --body "$(cat <<'EOF'
[Full formatted issue content here]
EOF
)"
```

3. Confirm the issue was created successfully and provide the issue URL to the user.

**Important:** Only create the issue after explicit user approval.
