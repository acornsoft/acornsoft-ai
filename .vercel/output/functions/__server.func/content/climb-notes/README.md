# Climb Notes — Obsidian vault folder

**Authoring:** Obsidian Markdown.  
**Site storage:** files synced into this folder.  
**Publish gate:** `_publish-registry.json` (SharePoint-style lifecycle).  
**Automation:** `npm run climb-notes:sync` / `npm run climb-notes:watch`

## Lifecycle (pull in / pull out)

| Status | Public journal | Studio library |
| --- | --- | --- |
| `draft` | No | Yes |
| `pending` | No (awaiting approval) | Yes |
| `approved` | No (ready, not live) | Yes |
| `published` | **Yes** | Yes |
| `archived` | No | Yes |

Commands (update registry + frontmatter `status`):

```bash
npm run climb-notes:publish -- list
npm run climb-notes:publish -- submit cn-002
npm run climb-notes:publish -- approve cn-002 --by acornsoft --note "Ready"
npm run climb-notes:publish -- publish cn-002
npm run climb-notes:publish -- unpublish cn-002   # pull out of public
npm run climb-notes:publish -- archive cn-002
npm run climb-notes:publish -- restore cn-002
npm run climb-notes:publish -- status cn-001
```

- **Publish** = pull into the public journal.  
- **Unpublish** = pull out (Markdown stays; Studio still shows it).  
- Registry **wins** over frontmatter if both disagree.

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
5. Keep the site dev process running so Markdown reloads.

## File rules

- Note files: `001 Title.md`, `002 Title.md` (top-level `*.md` in vault)
- Template: `templates/Climb Note.md`
- Required headings: `## Problem` · `## Measure` · `## Slice` · `## Lesson`
- Frontmatter: `id`, `number`, `title`, `date`, `status`, optional `tags`, `xUrl`
- Do not edit `_publish-registry.json` by hand unless you know the shape—prefer the CLI

## Flow

```
Obsidian (draft)
  → sync script → content/climb-notes
  → submit / approve / publish (CLI)
  → public /climb-notes  (published only)
  → Studio library tab   (every note)
  → optional short citation on X
```

X remains optional short citation only—and only after Published.
