---
allowed-tools: Bash(git status:*),Bash(git diff:*), Bash(git branch:*), Bash(git log:*), Bash(gh pr view:*)
argument-hint: "[title (optional)]"
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

The user may optionally pass a PR title as the first argument: `$1`.

## Your task

1. **If a PR already exists** for the current branch  
   - Detect this from the `gh pr view` output (unless it printed `NO_EXISTING_PR`).  
   - If it exists, **do NOT create a new PR**.  
   - Instead, show a short summary of the existing PR (number, title, URL) and stop.

2. **If no PR exists yet**, create one for the current branch:
   - Determine the PR **title**:
     - If `$1` is non-empty, use `$1` as the PR title.
     - Otherwise, use the most representative recent commit message (first line) as the title.
   - Compose a concise PR **body** using this minimal template (fill in from the context above):

     Summary  
     - Brief explanation of what this PR does and why.

     Changes  
     - Key change 1  
     - Key change 2  

     Testing  
     - Tests performed and how they were run.

     Notes  
     - Anything reviewers should know (edge cases, follow-ups, migrations).

3. Use the **Bash tool** to run `gh pr create` for the current branch, targeting the repository’s default base branch.  
   - The command should look like (adjusting title/body appropriately):

     - `gh pr create --title "<computed title>" --body "<computed body>"`

   - Prefer a **single** `gh pr create` command, and ensure it runs only once.

4. After you run `gh pr create`, print:
   - The PR URL
   - The PR title
   - A one- or two-line summary of what was included (based on the body you generated).

Be careful not to create duplicate PRs and always rely on the injected bash context above when deciding what to do.
