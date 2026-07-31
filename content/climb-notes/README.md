# Climb Notes — Obsidian vault folder

**Authoring:** Obsidian Markdown.  
**Site storage:** files synced into this folder.  
**Automation:** `npm run climb-notes:sync` / `npm run climb-notes:watch`

## One-time setup

1. In Obsidian, keep climbing logs in a folder (e.g. `Climb Notes`).
2. Copy `.climb-notes-sync.example.json` → `.climb-notes-sync.json` at repo root.
3. Set `"vault"` to that folder’s absolute path.  
   Or: `export CLIMB_NOTES_VAULT="/path/to/Climb Notes"`
4. Run:
   ```bash
   npm run climb-notes:sync    # one-shot
   npm run climb-notes:watch   # auto-copy on save
   ```
5. Keep `npm run dev` running — Vite reloads when Markdown under `content/climb-notes` changes.

## File rules

- Note files: `001 Title.md`, `002 Title.md` (top-level `*.md` in vault)
- Template: `templates/Climb Note.md`
- Required headings: `## Problem` · `## Measure` · `## Slice` · `## Lesson`
- Frontmatter: `id`, `number`, `title`, `date`, optional `tags`, `xUrl`

## Flow

```
Obsidian (save) → sync script → content/climb-notes → site /climb-notes
```

X remains optional short citation only.
