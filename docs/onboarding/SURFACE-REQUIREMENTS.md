# Surface requirements (short)

**Product:** pack + shell via the multiagent **extension**. **Not** a built-in LLM.

## Before install

| Need | Why |
|------|-----|
| **≥1 paid host** | Grok Build **or** Copilot **or** Cursor **or** Claude |
| VS Code or Cursor | Extension host for **Luna Foundry Multiagent** |
| A project folder | Setup deploys into a real root |

## Cost-effective entry (confirm on vendor sites)

| Host | Usable minimum |
|------|----------------|
| Grok Build | Premium ($30/mo or $300/yr), including the [two-week trial](https://grok.com/refer/bot?code=TQMG4SPCV849). Super and Ultra for a larger pool. An existing SuperGrok or X Premium+ plan still counts. |
| Copilot | Pro (~$10) |
| Cursor | Pro with Agent |
| Claude | Pro (~$20) |

A free tier covers a short look. A MacroFlow climb needs a paid host from the table above.

## After install (what the extension actually does)

1. **Luna: Setup Unified Workspace (Copilot / Cursor / Grok)** → **Yes, Unify Now**  
   - Deploys **`.github/`** (skills + agents + instructions)  
   - Writes **`.cursorrules`**  
   - Installs/refreshes shell → **`$HOME/etc`** when bundled  
   - Optional follow-up buttons: Install Grok Plugin, Grok CLI hub, Open Grok Build (pwsh/bash)  
2. Open a **new** terminal so shell hooks can load  
3. Follow **one** [trail map](./README.md)

**Not required:** Dreamcatcher Foundry monorepo clone (shell ships inside multiagent).

**Optional:** Starship, `gh` when feedback issues matter, Gnomah/ADO later (not this release’s Base Camp gate).

## How MacroFlow appears (by host)

| Host | UI | How the pack shows up |
|------|-----|------------------------|
| Grok Build | TUI + plugin | **Luna: Install Luna Plugin for Grok (xAI Marketplace / TUI)** → `grok plugin list` shows **luna-foundry**; slash skills **/base-camp** · **/route** · **/summit** |
| Copilot | Chat + custom agents | Setup → **`.github/agents`** (Luna, BaseCamp, Route, Climb, Descent); ours-only picker |
| Cursor | Agent | Setup → **`.cursorrules`** + **`.github/`** |
| Claude | Project / Code | Same files on disk + your project instructions (no dedicated Luna command) |

## Commands that exist (do not invent others)

Registered on the extension (Command Palette, category **Luna**):

- Setup Unified Workspace (Copilot / Cursor / Grok)  
- Create Grok Build (pwsh | bash) Terminal — auto-starts TUI  
- Create Grok (pwsh | bash) Terminal — clean shell only  
- Install / Verify Grok CLI  
- Install Luna Plugin for Grok (xAI Marketplace / TUI)  
- **WSL is not supported** (no Luna WSL terminals or installers)

Full table: [OPERATOR-REFERENCE.md](../OPERATOR-REFERENCE.md).

Security before client data: [SECURITY-PRIVACY-ETHICS.md](./SECURITY-PRIVACY-ETHICS.md)
