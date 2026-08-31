# Operator & builder reference

Technical detail for Luna Foundry Multiagent. The product story and trail maps live in [README.md](../README.md).

**Current release:** Marketplace / VSIX prerelease **`1.0.26239`** · publisher `acornsoft` · extension id `luna-foundry-multiagent` · display name **Luna Foundry Multiagent** · Grok plugin **Luna Foundry + MacroFlow™** (`plugin.json` same stamp).

**Self-contained product rule:** the installed extension does **not** depend on cloning this git repo or the dreamcatcher monorepo. All runtime content is under `context.extensionPath` (`resources/luna-config`, `resources/grok-plugin`, `resources/terminal`, `resources/shell-env`, `docs/onboarding`). Setting `lunaFoundry.allowDevMonorepoPaths` is **off by default** (builders only).

---

## What you get (commands that exist)

From the Command Palette (**Luna:** …) — these are the **registered** commands:

| Command Palette title (category **Luna:**) | What it does |
|---------|----------------|
| **Setup Unified Workspace (Copilot / Cursor / Grok)** | Deploys `.github/` + `.cursorrules`, installs shell → `$HOME/etc`, then offers **Install Grok Plugin** / **Grok CLI hub** / **Open Grok Build** |
| **Create Grok Build (pwsh) Terminal** / **Create Grok Build (bash) Terminal** | PATH hygiene + **auto-start** Grok TUI |
| **Create Grok (pwsh) Terminal** / **Create Grok (bash) Terminal** | **Clean shell** only (`~/.grok/bin` on PATH); does **not** start TUI |
| **Install / Verify Grok CLI** | Install, update, or troubleshoot the Grok CLI |
| **Install Luna Plugin for Grok (xAI Marketplace / TUI)** | Quick-pick: install bundled plugin, verify (`grok plugin list`), update, etc. |

Supported for product trails: **PowerShell 7 (`pwsh`)** and **native bash** (Git Bash on Windows, Homebrew/system bash on macOS/Linux). **WSL is not supported** — no Luna WSL terminals, installers, or product paths.

Small command surface on purpose: **unify the pack + get you into Grok/Copilot**, not reinvent the agent host.

---

## MacroFlow on the mountain (ritual)

Same climb as above—here with a little more trail detail when you are mid-session:

- **Base Camp** — Guardrails, context, readiness (preflight).  
- **Route** — Job, acceptance criteria, what is out of scope.  
- **Waypoint** — Map check: collect → check → recover → hold or go (handoffs, after proof, when stuck, before claiming the summit).  
- **Summit** — Deliver, verify, specialists as needed.  

**Luna** stays the Sherpa for the whole route. On **Grok Build**, host features (e.g. **`/goal`**) walk *alongside* the climb—they stack; they do not replace the mountain path.

**Azure DevOps / enterprise board projection** is **internal dogfood** for now — not part of the default public path. Public product mode: pack + Git + proof; no invent-the-plan only in ADO.

---

## Dual surface (one pack)

| Path | What ships |
|------|------------|
| **Copilot / Cursor** | Setup deploys SoT into the workspace; use Copilot models (Grok key **not** required for that path) |
| **Grok Build + xAI** | Same SoT as Grok plugin + Grok Build TUI, Imagine/Voice/API when **you** configure them |

**SoT** = skills/agents/instructions from `luna-foundry-config`, **bundled** for install. End users install VSIX or marketplace plugin; they do **not** need private SoT repos.

**v1.0.26239 (current prerelease):** full skill/agent parity between surfaces (no intentional “thin” Grok subset). First shipped at v1.0.26193+.

---

## Pack contents (what Setup / plugin install)

Typical deploy includes (names evolve; inspect after Setup or `grok plugin details luna-foundry`):

- **Agents:** Luna, BaseCamp, Route, Climb, Descent (Copilot Chat: ours only after Setup)  
- **Skills:** MacroFlow (+ constitution / clarify / workforce), ensure-* (incl. `ensure-grok-build`), content-creator*, forensic-*, gnomah-*, ado-wbs (when packaged), xAI bridge skills (voice / imagine / collections / agent-tools), and related pack skills  

Exact set = what was last **built into** the VSIX / plugin. Rebuild SoT → rebundle → reinstall if you change skills.

---

## Getting started (accurate path)

0. **Satisfy [Before you install](#before-you-install-prerequisites)** — **at least one** host from the table (Grok Build, Copilot, Cursor, or Claude) with a usable paid tier.  
1. Install the extension (Marketplace when published, or VSIX).  
2. **Luna: Setup Unified Workspace (Copilot / Cursor / Grok)** → **Yes, Unify Now**.  
3. Use your chosen host: **Copilot Chat** agents, **Cursor** Agent, **Grok Build** TUI (+ plugin), or **Claude** with the deployed pack.  
4. Start Base Camp / MacroFlow (pick **BaseCamp** agent in Copilot, or `/base-camp` in Grok Build).  
5. Ship work with proof; stop at Waypoint before claiming done.

### Surface tutorials

Use these as the **operator climb notes** for a unified experience (same pack, same Base Camp, same shell contract). Prefer **updating these trails** when Grok/xAI ships features (workflows, goals, keybinds) so product and docs stay aligned.

| Surface | Guide |
|---------|--------|
| Requirements matrix | [onboarding/SURFACE-REQUIREMENTS.md](./onboarding/SURFACE-REQUIREMENTS.md) |
| **Grok Build** (primary; Join Terminals Build + shell) | [onboarding/01-grok-build.md](./onboarding/01-grok-build.md) |
| **GitHub Copilot** | [onboarding/02-github-copilot.md](./onboarding/02-github-copilot.md) |
| **Cursor** | [onboarding/03-cursor.md](./onboarding/03-cursor.md) |
| **Claude** (portable pack) | [onboarding/04-claude.md](./onboarding/04-claude.md) |
| **TUI + UI test cases** (wiring + full MacroFlow turn) | [onboarding/TUI-UI-TEST-CASES.md](./onboarding/TUI-UI-TEST-CASES.md) |
| **Grok keys in VS Code** (toggle) | [onboarding/GROK-KEYBINDINGS-VS-CODE.md](./onboarding/GROK-KEYBINDINGS-VS-CODE.md) |
| Index | [onboarding/README.md](./onboarding/README.md) |
| **Visuals** | [onboarding/VISUAL-GUIDE.md](./onboarding/VISUAL-GUIDE.md) |
| **Security · privacy · ethics** | [onboarding/SECURITY-PRIVACY-ETHICS.md](./onboarding/SECURITY-PRIVACY-ETHICS.md) |

**Unified shell (all OS):** Base Camp → `ensure-shell-env` → `$HOME/etc` + Starship (soft) + Grok Build/Shell terminals that load the same include. Status bar **Grok keys** toggles chord pass-through.

**UI:** Grok Build = **TUI**; Copilot/Cursor = **agents + handoffs**; Claude = **project chat + pack**.  
**Critical:** Host-specific privacy, AUP, and secrets rules — [onboarding/SECURITY-PRIVACY-ETHICS.md](./onboarding/SECURITY-PRIVACY-ETHICS.md).  
Recommended Grok layout: **Create Grok Build (bash|pwsh) Terminal** beside **Create Grok (bash|pwsh) Terminal**, then **Terminal: Join Terminals**.

### Grok plugin install

**Bundled from the extension (preferred while iterating):** Command Palette → **Luna: Install Luna Plugin for Grok (xAI Marketplace / TUI)** → pick the local install / verify option. Confirm with `grok plugin list` (expect **luna-foundry**).

**Git (public, subdir + tag):**

```bash
# From the installed VSIX (Command Palette → Luna: Install Luna Plugin for Grok)
# grok plugin install "<extensionPath>/resources/grok-plugin/luna-foundry" --trust
```

**Official xAI catalog (`/marketplace`):** not listed until PR merges — see [marketplace/GROK-MARKETPLACE-SUBMISSION.md](./marketplace/GROK-MARKETPLACE-SUBMISSION.md). Operator security trail: [onboarding/SECURITY-PRIVACY-ETHICS.md](./onboarding/SECURITY-PRIVACY-ETHICS.md).

**Builders (monorepo SoT live layout):**

```bash
PLUGIN="src/apps/luna-foundry-config/live/grok-plugin/luna-foundry"
grok plugin validate "$PLUGIN"
grok plugin install "$(cd "$(dirname "$PLUGIN")" && pwd)/luna-foundry" --trust
```

Prefer pure `x.y.z` in `plugin.json` (no `-preview.N` in the version string). After pack changes: `npm run build:grok-plugin` in `luna-foundry-config`, then reinstall plugin / VSIX.

---

## Installation

### VSIX (current practical path)

```powershell
code --install-extension .\luna-foundry-multiagent-1.0.26239.vsix --force
```

Then: **Setup Unified Workspace** · optionally **Install Luna Plugin for Grok**.

### Development (this monorepo)

```powershell
cd src/apps/luna-foundry-multiagent
npm install
npm run package        # pure x.y.z VSIX
# optional: npm run package:pre   # vsce pre-release flag only
```

---

## Architecture (as implemented)

| Layer | Reality |
|-------|---------|
| **Extension host** | Commands for Setup, terminals, Grok CLI, Grok plugin install (`src/commands/*`, `src/core/extension.ts`) |
| **Bundled SoT** | Skills/agents copied into extension + `resources/grok-plugin` for install |
| **Hosts** | Copilot Chat / Cursor / Grok Build execute the ritual — not a custom MacroFlow-only runtime UI |
| **Summit modules** | Code under `src/summit/` supports routing / RealmEvent **builders** used by extension internals and tests; **not** the same as “open Luna and a full Realm cloud is live” |

Diagrams under `images/` (phases, agents, architecture) illustrate the **ritual and pack model**, not a separate SaaS console.

---

## Configuration

Settings live under `lunaFoundry.*` where contributed (see `package.json` / Settings UI). Typical concerns: API base URL, model preference, voice/video toggles when enabled, agent preference.

API keys should use VS Code **Secrets** — never commit keys.

**Cost-aware use:** Prefer focused Grok Build sessions, early Base Camp, and avoid unbounded loops. Local API proxies are optional for cheap iteration when you do not need full Grok fidelity.

---

## Design principles (grounded)

- **One pack, two surfaces** — Copilot and Grok Build share MacroFlow skills/agents.  
- **Sherpa, not tool soup** — ritual first; terminals and install are how you reach the rope.  
- **Hosts do the agent work** — we deploy and launch; Copilot/Grok execute.  
- **Private SoT, public install** — builders change `luna-foundry-config`; users get VSIX/plugin.  
- **Honest scope** — enterprise ADO mode and advanced continuity (full NAB/SIGNALS/Realm productization) are **not** claimed as fully shipped public UX here.

---

## Roadmap (direction, not pretend features)

| Now (shipped focus) | Next | Later |
|---------------------|------|--------|
| Dual-surface pack parity, Setup, terminals, Grok plugin install | Smoother Grok Build + `/goal` + MacroFlow stacking; keep pack current with xAI Build | Richer voice/NAB UX, multi-session continuity, optional enterprise ALM when proven portable |

---

## What this README is not claiming

- That every idea in older docs (full voice-first NAB product, Event Hubs Realm store, “Start MacroFlow” as a single extension chat that replaces Copilot/Grok) is **fully live** as the default path.  
- That ADO enterprise board projection is on by default for public users.  
- That install paths under private monorepo folders are required for marketplace users.

For **release notes and exact deltas**, see `CHANGELOG.md`.

