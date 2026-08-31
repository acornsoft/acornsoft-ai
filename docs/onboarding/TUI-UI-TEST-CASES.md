# TUI + UI test cases — command wiring & full MacroFlow turn

**Audience:** operator dogfooding Release 1 on Windows / macOS / any clean host.  
**Goal:** prove (1) VS Code **UI** commands are wired, (2) Grok Build **TUI** slash skills + agents resolve from the **luna-foundry** plugin, (3) you can run one **complete product-mode MacroFlow turn** end-to-end.

**Stamp to match:** extension + plugin **1.0.26242** (prefer same build as the VSIX you installed).  
**Related:** [01-grok-build.md](./01-grok-build.md) · [OPERATOR-REFERENCE.md](../OPERATOR-REFERENCE.md)

**Result codes:** `P` pass · `F` fail (note repro) · `S` skip · `L` limited

Fill the **Result** column as you go. Prefer a **clean test folder** for Setup; Gnomah vault is optional and must not block.

---

## Preflight (run once before series A–E)

| ID | Surface | Steps | Pass when | Result |
|----|---------|-------|-----------|--------|
| **PF-01** | Shell | `grok --version` | Prints version (e.g. `0.2.x`) | |
| **PF-02** | Shell | `grok plugin list` | Shows **luna-foundry** (or installed local id) | |
| **PF-03** | Shell | Note plugin path version | Path / version ≥ cut (**not** a stale older install when you shipped **26210+**) | |
| **PF-04** | Shell | `Test-Path $env:USERPROFILE\.grok\auth.json` (or `~/.grok/auth.json`) | Auth present **or** `grok login` succeeds | |
| **PF-05** | VS Code/Cursor | Extensions: **Luna Foundry Multiagent** | Enabled; version = cut | |
| **PF-06** | VS Code/Cursor | `Ctrl+Shift+P` → type `Luna` | Palette shows product commands only (see Series A) | |

**Known lag:** if `plugin list` still points only at an older VSIX path (e.g. `…1.0.26212…` / `…1.0.26213…`), re-run **Luna: Install Luna Plugin for Grok** from the **current** extension (**1.0.26242**), or reinstall the VSIX, then re-check PF-03.

---

## Series A — VS Code UI command wiring

Run from **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`). Exact titles must match.

| ID | Command (type fragment) | Full title | Pass when | Result |
|----|-------------------------|------------|-----------|--------|
| **UI-01** | `Setup` | **Luna: Setup (Copilot / Cursor / Grok)** | Dialog runs; **Set up** deploys pack; success offers **Finish with Grok** or **Done** only | |
| **UI-02** | After Setup | Explorer | `.github/agents/` has **Luna**, **BaseCamp**, **Route**, **Summit** | |
| **UI-03** | After Setup | Explorer | `.github/skills/macroflow` exists; `.cursorrules` present | |
| **UI-04** | `Install / Verify Grok` | **Luna: Install / Verify Grok CLI** | Hub / verify completes; `grok` on PATH | |
| **UI-05** | `Install Luna Plugin` | **Luna: Install Luna Plugin for Grok (xAI Marketplace / TUI)** | Menu opens; local/`--trust` install succeeds | |
| **UI-06** | `Grok Build (pwsh)` | **Luna: Create Grok Build (pwsh) Terminal** | Terminal tab **rocket**; **TUI auto-starts** | |
| **UI-07** | `Grok Build (bash)` | **Luna: Create Grok Build (bash) Terminal** | Same as UI-06 on bash/Git Bash | |
| **UI-08** | `Grok (pwsh)` | **Luna: Create Grok (pwsh) Terminal** | Clean shell; **no** auto TUI; `grok` resolves | |
| **UI-09** | `Grok (bash)` | **Luna: Create Grok (bash) Terminal** | Clean bash; no auto TUI | |
| **UI-10** | `Toggle Grok Keys` | **Luna: Toggle Grok Keys (pass-through in Luna terminals)** | Status / setting flips; chords reach TUI when on | |
| **UI-11** | Status bar | **Luna Setup** / **Grok CLI** (if shown) | Clicks open Setup / hub | |
| **UI-12** | Negative | Search palette: `Start MacroFlow`, `WSL`, `Voice Query`, `Ask Team` | **No** primary product hits for removed surfaces | |
| **UI-13** | Join | **Terminal: Join Terminals** | Build TUI + clean shell side-by-side | |

### UI-01 detailed steps

1. Open climb root (or clean folder).  
2. **Luna: Setup** → multi-root: pick folder → **Set up**.  
3. Optional success: **Finish with Grok** (plugin + preferred Build terminal) or **Done**. Advanced Grok tools live on **Install Luna Plugin** / **Grok CLI**, not on Setup.  
4. Open a **new** terminal so `$HOME/etc` / `%USERPROFILE%\etc` hooks can load.

---

## Series B — Grok Build TUI wiring (slash + agents)

Do this **inside the Grok Build TUI** (UI-06 or UI-07). Side shell (UI-08/09) is only for proof commands.

### B1 — Built-in TUI commands (host, not Luna)

| ID | In TUI type / do | Pass when | Result |
|----|------------------|-----------|--------|
| **TUI-01** | `/` (slash menu) | Menu opens; fuzzy filter works | |
| **TUI-02** | `/session-info` (or `/status`) | Shows model, auth, context | |
| **TUI-03** | `/doctor` | Terminal/clipboard/input findings (or clean) | |
| **TUI-04** | `/skills` | Extensions modal → Skills tab lists pack skills | |
| **TUI-05** | `/plugins` | **luna-foundry** visible | |
| **TUI-06** | `/config-agents` or `/agents` | Agents modal lists **Luna**, **BaseCamp**, **Route**, **Summit** | |
| **TUI-07** | `/docs` or `/tutorial` | Docs/tutorial UI opens (host feature) | |
| **TUI-08** | `Ctrl+P` or `?` | Command palette lists shortcuts + slash + skills | |
| **TUI-09** | `/goal` (if feature on) | Goal help or sets a goal; not a dead command | |

If **TUI-06** is empty, plugin agents did not load — reinstall plugin (UI-05), then `/new` and retry.

### B2 — Luna pack skills as slash commands

Grok advertises skills with short names from the plugin. Expect:

| ID | Slash | Pass when | Result |
|----|-------|-----------|--------|
| **SK-01** | Type `/base-camp` | Appears in menu **or** is accepted as skill invoke | |
| **SK-02** | Type `/route` | Same | |
| **SK-03** | Type `/summit` | Same | |
| **SK-04** | Type `/macroflow` | Same (orchestrator skill) | |
| **SK-05** | Type `/ensure-preflight` | Optional; present if pack includes it | |

**Fallback if slash does not bind:** plain-text skill invoke still counts as **L** pass for product mode:

```text
Use the constitution skill: confirm luna-foundry pack, product preflight only, skip ADO and Gnomah vault.
```

Qualify on name clash: `/luna-foundry:constitution` if your Grok build shows scoped skills.

### B3 — Agent start (multiagent)

| ID | Steps | Pass when | Result |
|----|-------|-----------|--------|
| **AG-01** | Outside TUI: `grok --agent Luna -p "Announce phase and next MacroFlow step only."` | Response in character as Sherpa; mentions Base Camp/Route/Summit | |
| **AG-02** | `grok --agent BaseCamp -p "Product preflight only. Skip ADO and Gnomah. Gaps only."` | Gap report; does not invent ADO work | |
| **AG-03** | In TUI: `/config-agents` → set default **Luna** (optional) | Default persists for new sessions | |
| **AG-04** | Mid-session freeform: “Hand off to Route for this job.” | Phase · Skill announced; Route behavior | |

---

## Series C — Complete MacroFlow turn (product mode)

One short job. **No secrets. No ADO projection. Gnomah optional (skip unless you explicitly opt in).**

**Job (fixed for evidence):**

> Write `docs/Analysis/outputs/macroflow-turn-smoke.md` with: machine name, date, extension version, plugin version, and the line `product mode MacroFlow turn OK`.

**Acceptance criteria:**

1. File exists at that path (create folders if needed).  
2. Contains extension version string and `product mode MacroFlow turn OK`.  
3. No secrets / PATs / client names.  
4. Operator can prove with side-shell `git status` or `Get-ChildItem` / `ls`.

### C0 — Camp (UI)

| ID | Action | Pass | Result |
|----|--------|------|--------|
| **MF-00** | UI-01 + UI-05 + dual pane UI-06/07 + UI-08/09 + UI-13 | Camp ready | |

### C1 — Base Camp

In **Grok Build TUI**:

```text
/base-camp Confirm the luna-foundry pack is present (plugin or workspace). Run product preflight only: shell, gh, grok as needed. Skip ADO and Gnomah vault. Report gaps only. Do not implement product work.
```

| ID | Pass when | Result |
|----|-----------|--------|
| **MF-01** | Announces **Phase · Base Camp** (or equivalent) | |
| **MF-02** | Preflight / tool gaps listed; **no** ADO required for green path | |
| **MF-03** | Explicitly ready for Route (or lists blockers only) | |

Fix blockers, then continue.

### C2 — Route

```text
/route Job: produce docs/Analysis/outputs/macroflow-turn-smoke.md with machine name, date, extension version, plugin version, and the exact line "product mode MacroFlow turn OK". Interview me only if a critical AC is missing; otherwise draft title, purpose, 3–5 ACs, out-of-scope (no ADO, no Gnomah required). Stop for my Go. Do not implement.
```

When the draft is right, send:

```text
Go
```

| ID | Pass when | Result |
|----|-----------|--------|
| **MF-04** | Concrete job + ACs restated | |
| **MF-05** | Out of scope includes no ADO invent-the-plan | |
| **MF-06** | Stops for **Go** before implementation | |

### C3 — Waypoint Check (do not skip)

```text
Waypoint Check: collect phase position, kit readiness, gaps. Report NAB event type or none. For this product smoke: NAB WaypointGo is fine if ACs are clear; do not invent TaskingReady or RequirementsToAdoReady. Then move to Summit only if Go.
```

| ID | Pass when | Result |
|----|-----------|--------|
| **MF-07** | Short collect → check → recover → hold/go | |
| **MF-08** | NAB named or “none”; **no** fake TaskingReady | |

### C4 — Summit (deliver + prove)

```text
/summit For the approved smoke job only: create folders if needed and write docs/Analysis/outputs/macroflow-turn-smoke.md with machine, date, extension version, plugin version, and exact line "product mode MacroFlow turn OK". Verify against ACs. Do not open PRs or post issues. Summarize proof paths.
```

Side shell:

```powershell
# pwsh
Get-Content docs/Analysis/outputs/macroflow-turn-smoke.md
git status
```

```bash
# bash
cat docs/Analysis/outputs/macroflow-turn-smoke.md
git status
```

| ID | Pass when | Result |
|----|-----------|--------|
| **MF-09** | File written at expected path | |
| **MF-10** | Content matches ACs | |
| **MF-11** | Response cites real path / command proof (not status theater) | |

### C5 — Optional multi-turn goal (Grok host)

Only if `/goal` is enabled in your session:

```text
/goal Complete product-mode MacroFlow smoke: constitution → clarify → waypoint → workforce for macroflow-turn-smoke.md with proof
/goal status
```

| ID | Pass when | Result |
|----|-----------|--------|
| **MF-12** | Goal tracks across turns; status readable | |
| **MF-13** | `/goal clear` when done (leave session clean) | |

### C6 — Optional feedback loop (wishlist climb)

Use the onboarding trail wish prompts in [01-grok-build.md](./01-grok-build.md) §3 when you want a **skill/feature wish** issue instead of the smoke file. Same ritual shape.

---

## Series D — Multiagent effectiveness (Luna four)

| ID | Surface | Steps | Pass when | Result |
|----|---------|-------|-----------|--------|
| **MA-01** | Grok TUI | Start with Luna: “Own this MacroFlow session. Phase only.” | Luna orchestrates; does not dump all skills | |
| **MA-02** | Grok CLI | `grok --agent BaseCamp` then later `--agent Route` | Each agent stays in phase; handoff language present | |
| **MA-03** | Grok TUI | Ask Luna to spawn a specialist **only** if it shortens the smoke (e.g. none needed) | No specialist thrash on a one-file job | |
| **MA-04** | Copilot (if licensed) | After Setup: agent picker shows Luna four | Custom agents visible | |
| **MA-05** | Copilot | Base Camp agent → product preflight phrase | Same product-mode rules as Grok | |
| **MA-06** | Cursor | After Setup: Agent reads `.cursorrules` + pack | Ritual language without Grok slashes | |
| **MA-07** | Claude | Project instructions + pack paths | Same initial climb, plain text | |

**Effectiveness bar:** one job, one phase at a time, proof at the end, specialists only when they cut path length.

---

## Series E — Negative / hygiene

| ID | Steps | Pass when | Result |
|----|-------|-----------|--------|
| **NG-01** | Paste a fake PAT into TUI, then undo | Operator aborts; secrets stay out of chat (discipline) | |
| **NG-02** | Base Camp with “require ADO” expectation | Agent **must not** block Route for missing az/devops | |
| **NG-03** | Ask for tasks without TaskingReady | Agent refuses task trees or keeps them in Gnomah-only notes | |
| **NG-04** | Stale plugin only | Documented as **F** until UI-05 reinstall | |
| **NG-05** | Mouse garbage in terminal after TUI | Follow [GROK-KEYBINDINGS-VS-CODE.md](./GROK-KEYBINDINGS-VS-CODE.md) fix; not a pack failure | |

---

## Fast path (15 minutes)

If you only have one pass today:

1. **PF-01…06**  
2. **UI-01, UI-05, UI-06, UI-08, UI-13**  
3. **TUI-04, TUI-06, SK-01…03**  
4. **MF-01 → MF-11** (full ritual)  
5. File evidence: date, versions, which IDs failed  

---

## Headless smoke (optional, non-interactive)

Use for wiring checks without full TUI (does **not** replace Series C):

```powershell
# From climb root after plugin install
grok -p "List Luna Foundry MacroFlow agents and whether constitution/route/summit skills are available. Gaps only." --yolo
grok --agent BaseCamp -p "Product preflight only. Skip ADO and Gnomah. Gaps only. Do not implement." --yolo
```

```bash
grok -p "List Luna Foundry MacroFlow agents and whether constitution/route/summit skills are available. Gaps only." --yolo
grok --agent BaseCamp -p "Product preflight only. Skip ADO and Gnomah. Gaps only. Do not implement." --yolo
```

---

## Sign-off

| Field | Value |
|-------|-------|
| Machine | |
| Date | |
| Extension version | |
| Plugin version / path | |
| Grok CLI version | |
| Series A fails | |
| Series B fails | |
| Series C (MF) fails | |
| Operator | |

**Gate for “commands wired + MacroFlow turn works”:** zero **F** on UI-01…09, SK-01…03, MF-01…11; PF-03 not lagging the cut.
