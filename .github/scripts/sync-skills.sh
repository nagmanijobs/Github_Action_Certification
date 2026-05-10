#!/usr/bin/env bash
set -euo pipefail

# Lightweight wrapper that delegates to the canonical script in the central repo.
# This keeps per-repo maintenance near zero.

SOURCE_REPO="${SOURCE_REPO:-nagmanijobs/Nagmani-AI-Custom-Skills}"
SOURCE_BRANCH="${SOURCE_BRANCH:-main}"
TMP_DIR="$(mktemp -d)"
CENTRAL_SCRIPT_REL=".github/scripts/sync-skills.sh"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is required." >&2
  exit 1
fi

echo "Loading canonical sync script from $SOURCE_REPO ($SOURCE_BRANCH)..."
git clone --depth 1 --branch "$SOURCE_BRANCH" "https://github.com/$SOURCE_REPO.git" "$TMP_DIR/source" >/dev/null

if [[ ! -f "$TMP_DIR/source/$CENTRAL_SCRIPT_REL" ]]; then
  echo "Error: Canonical script not found at $CENTRAL_SCRIPT_REL in $SOURCE_REPO." >&2
  exit 1
fi

chmod +x "$TMP_DIR/source/$CENTRAL_SCRIPT_REL"
SOURCE_REPO="$SOURCE_REPO" SOURCE_BRANCH="$SOURCE_BRANCH" \
  "$TMP_DIR/source/$CENTRAL_SCRIPT_REL" "$@"