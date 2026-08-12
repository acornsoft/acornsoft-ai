#!/bin/sh
set -eu
cd /workspace

# SoT is acornsoft/acornsoft-ai — Grok "Push to Code" rebinds origin
# to the export repo; always retarget before anything else.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git remote set-url origin https://github.com/acornsoft/acornsoft-ai.git
  git remote get-url grok-export >/dev/null 2>&1 || \
    git remote add grok-export https://github.com/acornsoft/honey-reef-yonder-fleet.git
fi

if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
