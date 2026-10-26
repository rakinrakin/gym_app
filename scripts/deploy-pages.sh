#!/usr/bin/env bash
set -e

echo "Building production bundle with base /gym_app/..."
VITE_BASE_PATH=/gym_app/ npm --prefix app run build

WORKTREE_DIR="$(mktemp -d)"
git worktree prune
git worktree add "$WORKTREE_DIR" -B gh-pages
rm -rf "$WORKTREE_DIR"/*
cp -r app/dist/* "$WORKTREE_DIR/"
touch "$WORKTREE_DIR/.nojekyll"

git -C "$WORKTREE_DIR" add -A
git -C "$WORKTREE_DIR" commit -m "Deploy to GitHub Pages" || true
git -C "$WORKTREE_DIR" push -u origin gh-pages --force
git worktree remove "$WORKTREE_DIR" --force

echo "Successfully deployed to gh-pages branch!"
