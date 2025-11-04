#!/usr/bin/env bash
set -euo pipefail

# Usage: new-worktree.sh <branch-name> [<start-point>]
# Example: new-worktree.sh feature/login main

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <branch-name> [<start-point>]" >&2
  exit 1
fi

BRANCH="$1"
START_POINT="${2:-HEAD}"

# Ensure we're inside a git work tree
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository." >&2
  exit 1
fi

DIRNAME="$(basename "$PWD")"
WORKTREE_DIR="../${DIRNAME}_${BRANCH}"

if [[ -e "$WORKTREE_DIR" ]]; then
  echo "Error: target worktree directory already exists: $WORKTREE_DIR" >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Error: branch '$BRANCH' already exists. Use it or choose another name." >&2
  exit 1
fi

echo "Creating worktree at $WORKTREE_DIR"
git worktree add -b "$BRANCH" "$WORKTREE_DIR" "$START_POINT"

echo "Copying environment files if present..."
if [[ -f .env ]]; then
  cp .env "$WORKTREE_DIR/.env"
fi
if [[ -f .env.local ]]; then
  cp .env.local "$WORKTREE_DIR/.env.local"
fi

echo "Switching into $WORKTREE_DIR"
cd "$WORKTREE_DIR"

echo "Worktree ready:"
echo "  Branch: $BRANCH"
echo "  Dir:    $WORKTREE_DIR"
pwd
