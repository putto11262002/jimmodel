---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git branch:*), Bash(git log:*), Bash(gh pr view:*), Bash(gh issue view:*)
argument-hint: "[title or issue#] [issue# (optional)]"
description: Create a GitHub pull request for the current branch using gh
---

## Context

You are helping the user create a GitHub pull request for the **current Git branch** using the GitHub CLI (`gh`).

Gather the following context first:

- Current git status (short): !`git status -sb`
- Current branch: !`git branch --show-current`
- Recent commits (last 5): !`git log --oneline -5`
- Diff summary vs HEAD: !`git diff --stat`
- Check if a PR already exists for this branch: !`gh pr view --json number,title,url,headRefName || echo "NO_EXISTING_PR"`

The user may optionally pass arguments:
- `$1` - Can be either a custom PR title (text) or an issue number (e.g., "123" or "#123")
- `$2` - Optional issue number if `$1` was used as a title

**Argument parsing logic:**
- If `$1` matches a number or starts with `#` → treat as issue number
- If `$1` is text and `$2` exists → `$1` is title, `$2` is issue number
- If `$1` is text and no `$2` → `$1` is title (existing behavior)
- If no arguments → use commit message as title

**If an issue number is provided**, fetch issue details:
- !`gh issue view <issue-number> --json number,title,body,labels,state || echo "ISSUE_NOT_FOUND"`

## Your task

1. **If a PR already exists** for the current branch  
   - Detect this from the `gh pr view` output (unless it printed `NO_EXISTING_PR`).  
   - If it exists, **do NOT create a new PR**.  
   - Instead, show a short summary of the existing PR (number, title, URL) and stop.

2. **If no PR exists yet**, create one for the current branch:
   - **Parse arguments** using the logic described above to determine:
     - Custom title (if provided)
     - Issue number (if provided)

   - **Determine the PR title**:
     - If custom title provided → use it
     - Else if issue provided → use issue title
     - Otherwise → use the most representative recent commit message (first line)

   - **Compose a concise PR body** using this minimal template:

     ## Summary
     - Brief explanation of what this PR does and why
     - If issue context available, incorporate the issue description/requirements

     ## Changes
     - Key change 1 (based on git diff and commits)
     - Key change 2

     ## Testing
     - Tests performed and how they were run

     ## Notes
     - Anything reviewers should know (edge cases, follow-ups, migrations)
     - If issue labels are present, mention them if relevant (e.g., "bug fix", "enhancement")

     **If an issue number was provided**, append at the end:
     ```
     Closes #<issue-number>
     ```

3. Use the **Bash tool** to run `gh pr create` for the current branch, targeting the repository’s default base branch.  
   - The command should look like (adjusting title/body appropriately):

     - `gh pr create --title "<computed title>" --body "<computed body>"`

   - Prefer a **single** `gh pr create` command, and ensure it runs only once.

4. After you run `gh pr create`, print:
   - The PR URL
   - The PR title
   - A one- or two-line summary of what was included (based on the body you generated).


## Usage Examples

```bash
# Use commit message as title, no issue reference
/git_create_pr

# Use custom title, no issue reference
/git_create_pr "Add user authentication"

# Use issue #42 for context (title from issue)
/git_create_pr 42
/git_create_pr #42

# Use custom title + issue #42 for context
/git_create_pr "Add user authentication" 42
```

## Constraints

* DO NOT add Claude co-authorship footer to pull requests
* When an issue is referenced, always add "Closes #<number>" to the PR body
* Use issue context to write more informed PR descriptions when available

Be careful not to create duplicate PRs and always rely on the injected bash context above when deciding what to do.
