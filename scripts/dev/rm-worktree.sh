#!/usr/bin/env bash
set -euo pipefail

# Usage: rm-worktree.sh <branch-name> [--force]
# Example: rm-worktree.sh feature/login
#          rm-worktree.sh feature/login --force

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <branch-name> [--force]" >&2
  exit 1
fi

BRANCH="$1"
FORCE=0
if [[ "${2-}" == "--force" ]]; then
  FORCE=1
fi

# Ensure we're inside a git work tree
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository." >&2
  exit 1
fi

# Current directory name (same assumption as new-worktree.sh)
DIRNAME="$(basename "$PWD")"

# Worktree directory: parent_of_current/<dirname>_<branch>
WORKTREE_DIR="../${DIRNAME}_${BRANCH}"

if [[ ! -d "$WORKTREE_DIR" ]]; then
  echo "Error: worktree directory not found: $WORKTREE_DIR" >&2
  exit 1
fi

# Ensure this path is actually a registered worktree
if ! git worktree list --porcelain | awk '/^worktree / {print $2}' | grep -qx "$WORKTREE_DIR"; then
  echo "Error: $WORKTREE_DIR is not a registered git worktree." >&2
  exit 1
fi

echo "Removing worktree:"
echo "  Branch:        $BRANCH"
echo "  Worktree dir:  $WORKTREE_DIR"
echo

if (( FORCE )); then
  git worktree remove --force "$WORKTREE_DIR"
else
  git worktree remove "$WORKTREE_DIR"
fi

echo
# Delete the local branch if it exists
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Deleting local branch: $BRANCH"
  if (( FORCE )); then
    git branch -D "$BRANCH"
  else
    git branch -d "$BRANCH"
  fi
else
  echo "Local branch '$BRANCH' does not exist, skipping branch delete."
fi

echo
echo "Done."
