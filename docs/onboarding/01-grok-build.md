# Trail map: Grok Build

For people who already use **Grok Build** (SuperGrok or X Premium+), or are about to. You establish camp with the **Luna Foundry Multiagent** extension, open a dual-pane layout, and run one **complete MacroFlow turn**—Base Camp → Route → Waypoint → Summit—with proof. An optional second climb files a skill/feature wish as product feedback.

**Host app:** Visual Studio Code or Cursor (both run the multiagent extension). The dual-pane picture is the same either way.  
**Primary ridge:** this trail is the **first-class** multiagent path (plugin agents + slash skills + side shell for proof).

### Before you start — ready to climb?

Confirm each line. If not, finish that item first.

<div align="center">

<table border="0" cellpadding="2" cellspacing="0">
<tr>
<td align="left">✓</td>
<td align="left"><small><strong>Luna Foundry Multiagent</strong> is installed and enabled (Marketplace or VSIX)—prefer stamp <strong>1.0.26242</strong></small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>A <strong>project folder</strong> is open that <em>is</em> this climb (workspace root)</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small><strong>SuperGrok</strong> or <strong>X Premium+</strong> is active (Grok Build—not free-only chat)</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>Command Palette shows <strong>Luna:</strong> commands (type <code>Luna</code> to filter)</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small><code>grok --version</code> works after install; you can sign in (<code>grok login</code> if needed)</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>A few quiet minutes; <strong>no secrets</strong> in the Grok Build TUI</small></td>
</tr>
</table>

</div>

**Exact command names** (Command Palette → type the short fragment):

| Type this | Full title (what the extension registers) |
|-----------|-------------------------------------------|
| `Setup Unified` | **Luna: Setup Unified Workspace (Copilot / Cursor / Grok)** |
| `Install / Verify Grok` | **Luna: Install / Verify Grok CLI** |
| `Install Luna Plugin` | **Luna: Install Luna Plugin for Grok (xAI Marketplace / TUI)** |
| `Grok Build (bash)` | **Luna: Create Grok Build (bash) Terminal** |
| `Grok Build (pwsh)` | **Luna: Create Grok Build (pwsh) Terminal** |
| `Grok (bash)` | **Luna: Create Grok (bash) Terminal** |
| `Grok (pwsh)` | **Luna: Create Grok (pwsh) Terminal** |
| `Toggle Grok Keys` | **Luna: Toggle Grok Keys (pass-through in Luna terminals)** |

Use native **bash** (Git Bash on Windows) or **pwsh** only. **WSL is not supported** by Luna.

**Wiring checklist (operator):** [TUI-UI-TEST-CASES.md](./TUI-UI-TEST-CASES.md) — Series A (UI), B (TUI slash/agents), C (full MacroFlow turn).  

**Screen-share coach (Grok Web watches your editor):** [SCREEN-SHARE-COACH-01-GROK-BUILD.md](./SCREEN-SHARE-COACH-01-GROK-BUILD.md) — paste Blocks A/B into Grok Web; Luna steps you through trail 01.

---

## Step 1 - Establish Camp

<img src="./assets/trail-set-camp-setup.jpg" alt="Establish camp — Setup Unified Workspace" width="50%" />

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`). Run these in order.

1. **Luna: Setup Unified Workspace (Copilot / Cursor / Grok)**  
   - If several folders are open, pick the **climb root**.  
   - When asked, choose **Yes, Unify Now**.  
   - What it actually does: deploys **`.github/`** (skills + agents), writes **`.cursorrules`**, installs/refreshes shell package under **`$HOME/etc`** (Windows: `%USERPROFILE%\etc`), and cleans legacy terminal profiles.  
   - When the summary appears you may see **Install Grok Plugin**, **Grok CLI hub**, **Open Grok Build (bash)** — use them, or finish steps 2–3 below.

2. **Luna: Install / Verify Grok CLI** (if `grok` is missing or old).  
   In a terminal: `grok login` if needed, then `grok --version`.

3. **Luna: Install Luna Plugin for Grok (xAI Marketplace / TUI)**  
   - This opens a **menu**, not a silent install. For a first install, pick the option that **opens Grok Build and installs the bundled plugin** (local/`--trust` path).  
   - Or from the Setup summary, press **Install Grok Plugin**.  
   - Verify in any shell with Grok on PATH:

```bash
grok plugin list
```

You want **luna-foundry** present, and the install path should match the **current** extension (not a stale older VSIX path). Skills should include short names **constitution**, **clarify**, **workforce** (also under macroflow). Agents: **Luna**, **BaseCamp**, **Route**, **Summit**.

Then open a **new** terminal so `$HOME/etc` hooks can load.

If Setup or plugin install fails, fix that before dual-pane. Camp should feel quiet and ready.

---

## Step 2 - Two panes: Grok Build TUI + shell

Both panes live in the editor’s **Terminal** panel (joined side by side)—not two floating apps.

<img src="./assets/trail-dual-pane-terminals.jpg" alt="Editor: Grok Build TUI left, bash terminal right" width="70%" />

| Pane | What it is |
|------|------------|
| **Left** | **Grok Build TUI** — real Build UI (welcome / agents / chat). *Not* a plain shell. |
| **Right** | **bash** or **pwsh** — ordinary terminal for `git`, tests, proof. |

Close-up of the TUI alone:

<img src="./assets/trail-grok-build-tui-reference.png" alt="Grok Build TUI close-up" width="50%" />

1. Run **Luna: Create Grok Build (bash) Terminal** (or **… (pwsh) Terminal**). Wait until the **Grok Build TUI** fills that terminal.  
2. Run **Luna: Create Grok (bash) Terminal** (or **… (pwsh)**) in a **second** terminal. It must **not** auto-start the TUI—only a shell prompt with `~/.grok/bin` on PATH.  
3. Join them: focus a terminal tab → Command Palette → **Terminal: Join Terminals** → pick the other. Match the picture: **TUI left · shell right**.  
4. Optional: **Luna: Toggle Grok Keys** so chords like voice/`Ctrl+Space` reach the TUI instead of VS Code. See [GROK-KEYBINDINGS-VS-CODE.md](./GROK-KEYBINDINGS-VS-CODE.md).

You put the Sherpa’s map (TUI) next to your boots (shell)—in one editor window.

### Quick TUI wiring check (30 seconds)

In the **Grok Build** pane:

| Type | Expect |
|------|--------|
| `/` | Slash menu opens |
| `/skills` | Pack skills visible |
| `/plugins` | **luna-foundry** listed |
| `/config-agents` or `/agents` | Luna five agents listed (Luna, BaseCamp, Route, Climb, Descent) |
| `/base-camp` | Skill appears or invokes (fallback: plain-text “use the constitution skill…”) |

If agents/skills are missing, reinstall the plugin from the **current** extension, then `/new` and retry.

---

## Step 3 - Complete MacroFlow turn (product mode)

Send prompts in the **Grok Build** pane (left). Use the **shell** pane only for proof.  
**Product mode:** skip Azure DevOps and Gnomah vault unless you explicitly opt in. **No secrets** in the TUI.

**Ritual (do not skip Waypoint):**

```text
Luna (Sherpa) → Base Camp → Route → Waypoint Check → Summit → proof
```

In Grok Build, phase skills are slash commands when the plugin is loaded:

| Phase | Slash | What it answers |
|-------|-------|-----------------|
| Base Camp | `/base-camp` | Safe to leave base camp? |
| Route | `/route` | Concrete job + ACs? |
| Waypoint | plain text *Waypoint Check* | Hold or go? Which NAB? |
| Summit | `/summit` | Ship with proof? |
| Orchestrator | `/macroflow` or agent **Luna** | Who owns the flow? |

**Multiagent tip:** start with agent **Luna** (or freeform “You are Luna”) when you want orchestration; switch to **Base Camp** / **Route** / **Summit** for phase purity—or stay on Luna and let her hand off. Prefer **one phase at a time**. Specialists only when they shorten the path.

### 3.1 Base Camp

In Grok Build, send:

```text
/base-camp Confirm the luna-foundry pack is present (plugin or workspace). Run product preflight only: shell, gh, grok as needed. Skip ADO and Gnomah vault. Report gaps only. Do not implement product work.
```

Wait for the report. Fix blockers, then continue.

### 3.2 Route

Pick a **smoke job** (wiring) **or** a **wish** (product feedback).

**Smoke job (prove the turn works):**

```text
/route Job: produce docs/Analysis/outputs/macroflow-turn-smoke.md with machine name, date, extension version, plugin version, and the exact line "product mode MacroFlow turn OK". Draft title, purpose, 3–5 ACs, out-of-scope (no ADO, no Gnomah required). Interview only if a critical AC is missing. Stop for my Go. Do not implement.
```

**Wish climb (skill / feature feedback):**

```text
/route Capture one skill or product feature I want in Luna Foundry Multiagent. Interview me one or two questions at a time about pain, skill vs product feature, who benefits, Given/When/Then done, never-do, that I use Grok Build, and how often. Then draft title, purpose, and 3–5 acceptance criteria. Stop for my Go. Do not implement.
```

Answer any questions. When the draft looks right, send:

```text
Go
```

### 3.3 Waypoint Check

Do not jump straight to Summit. Send:

```text
Waypoint Check: collect phase position, kit readiness, gaps. Report NAB event type or none. For product smoke: WaypointGo is fine if ACs are clear—do not invent TaskingReady or RequirementsToAdoReady. Hold if ACs are fuzzy.
```

**Hold** → return to Route. **Go** → Summit.

### 3.4 Summit

**Smoke job:**

```text
/summit For the approved smoke job only: create folders if needed and write docs/Analysis/outputs/macroflow-turn-smoke.md with machine, date, extension version, plugin version, and exact line "product mode MacroFlow turn OK". Verify against ACs. Do not open PRs or post issues. Summarize proof paths.
```

**Wish climb:**

```text
/summit For the approved wish only: create folders if needed and write docs/Analysis/outputs/luna-wishlist-short-name.md with title, skill-vs-feature, purpose, ACs, never-do, host=Grok Build, and frequency; draft a GitHub issue body titled Wish: name with labels feedback and skill-idea or enhancement and section Trail map: Grok Build; do not open a PR and do not post the issue for me.
```

### 3.5 Prove it (shell pane)

In the **bash** (or **pwsh**) terminal:

```bash
git status
# or:
ls docs/Analysis/outputs
# pwsh: Get-ChildItem docs/Analysis/outputs
```

(If the folder is not a git repo, listing the outputs folder is enough to show the file landed.)

### 3.6 Optional: `/goal` across turns

When goal mode is available in your Grok Build session:

```text
/goal Complete product-mode MacroFlow: constitution → clarify → waypoint → workforce for this climb with proof
/goal status
```

`/goal` **stacks with** MacroFlow—it does not replace Base Camp/Route/Summit. Clear when done: `/goal clear`.

### 3.7 File feedback (wish climb only)

Keep the wish brief from Summit in this workspace (**no secrets**). Help stays in this pack — see `SUPPORT.md`. Do not file it on GitHub.

Done.

---

## How multiagent should feel

| Do | Don’t |
|----|--------|
| Announce **Phase · Skill** so a human can join mid-trail | Dump every skill and tool on turn one |
| One job per Route; proof at Summit | Invent ADO task trees without **TaskingReady** |
| Use side shell for `gh`/`az` auth and secrets | Paste PATs into the TUI |
| Luna orchestrates; specialists only when useful | Spawn agents for a one-file smoke |
| Match plugin/extension stamp after upgrades | Run on a stale **26195** plugin path after installing **26209+** |

CLI alternatives (outside TUI, useful for quick checks):

```bash
grok --agent Luna -p "Announce phase and next MacroFlow step only."
grok --agent BaseCamp -p "Product preflight only. Skip ADO and Gnomah. Gaps only."
```

Full matrix: [TUI-UI-TEST-CASES.md](./TUI-UI-TEST-CASES.md).

---

[← All trail maps](./README.md) · [Security](./SECURITY-PRIVACY-ETHICS.md) · [Main story](../../README.md) · [Support](../../SUPPORT.md) · [Command reference](../OPERATOR-REFERENCE.md) · [Keybindings](./GROK-KEYBINDINGS-VS-CODE.md)
