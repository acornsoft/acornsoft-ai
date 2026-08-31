# Trail map: Cursor

For people who already build in **Cursor** with an **Agent**-capable plan. Multiagent does not replace Cursor—it gives Luna and MacroFlow a home via **Setup** (`.cursorrules` + `.github/`). You run one **complete MacroFlow turn** (Base Camp → Route → Waypoint → Summit) with proof; an optional second climb files a skill/feature wish.

**Multiagent on this ridge:** pack-on-disk + Cursor Agent/Composer reading **`.cursorrules`** and **`.github/`**. Grok slash skills (`/base-camp`) are **optional** only if you also open Grok Build terminals inside Cursor.

### Before you start — ready to climb?

Confirm each line. If not, finish that item first.

<div align="center">

<table border="0" cellpadding="2" cellspacing="0">
<tr>
<td align="left">✓</td>
<td align="left"><small><strong>Cursor</strong> is installed and can load VS Code-compatible extensions</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small><strong>Luna Foundry Multiagent</strong> is installed and enabled in Cursor—prefer stamp <strong>1.0.26242</strong></small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>A <strong>project folder</strong> is open that <em>is</em> this climb</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>Plan includes <strong>Agent</strong> (Pro or current Agent-capable tier—not free-only limits)</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>Command Palette shows <strong>Luna:</strong> commands</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small><strong>Privacy mode</strong> on if the code is not public; no secrets in Agent chat</small></td>
</tr>
</table>

</div>

**Command you will use**

| Type this | Full title |
|-----------|------------|
| `Setup Unified` | **Luna: Setup Unified Workspace (Copilot / Cursor / Grok)** |

Optional later (Grok Build inside Cursor terminals): **Luna: Create Grok Build (bash|pwsh) Terminal**, **Luna: Install Luna Plugin for Grok (xAI Marketplace / TUI)** — full dual-pane + slash ritual: [Grok Build trail](./01-grok-build.md) · [TUI-UI-TEST-CASES.md](./TUI-UI-TEST-CASES.md).

---

## Step 1 - Establish Camp

<img src="./assets/trail-set-camp-setup.jpg" alt="Establish camp — Setup Unified Workspace" width="50%" />

1. Confirm the multiagent extension is enabled in Cursor (Extensions view).  
2. Command Palette → **Luna: Setup Unified Workspace (Copilot / Cursor / Grok)**.  
   - Multi-root: pick the **climb root**.  
   - Choose **Yes, Unify Now**.  
3. What Setup actually does:  
   - Deploys **`.github/`** (skills, agents, instructions).  
   - Writes **`.cursorrules`** at the project root (ritual + pointers into `.github`).  
   - Installs/refreshes shell under **`$HOME/etc`**.  
4. Quiet check: both **`.cursorrules`** and **`.github/skills/macroflow`** exist. Open a **new** terminal.

If `.cursorrules` is missing, re-run Setup on the correct root—camp cannot be half a directory away.

---

## Step 2 - Open Cursor Agent

1. Open **Agent** (or Composer—use the Agent-capable surface your plan includes).  
2. One thread for this climb.  
3. If Agent ignores the pack, point it at **`.cursorrules`**, **`.github/skills/macroflow`**, and agents under **`.github/agents`** (Luna, BaseCamp, Route, Climb, Descent).

Slash skills like `/base-camp` are **Grok Build**-style. In Cursor, send the **same intent as plain text** (or @-mention pack files if your workflow does that).

**Multiagent tip:** ask Agent to announce **Phase · Skill** before significant work, and to stay in one phase until Waypoint. Do not expect Grok’s `/config-agents` modal here—the “agents” are files under `.github/agents` that Agent should read.

---

## Step 3 - Complete MacroFlow turn (product mode)

Send each prompt in Cursor **Agent**. Terminal only for proof (3.5).  
**Product mode:** skip Azure DevOps and Gnomah vault unless you ask. **No secrets** in Agent chat.

**Ritual:** Base Camp → Route → Waypoint → Summit → proof.

### 3.1 Base Camp

```text
Read .cursorrules and .github/skills/macroflow (and agents if present). Confirm the Luna Foundry pack is present. Report gaps only. Skip Azure DevOps and Gnomah vault. Do not implement product work.
```

### 3.2 Route

**Smoke job:**

```text
Job: produce docs/Analysis/outputs/macroflow-turn-smoke.md with machine name, date, extension version, and the exact line "product mode MacroFlow turn OK". Draft title, purpose, 3–5 ACs, out-of-scope (no ADO). Interview only if needed. Stop for my Go. Do not implement.
```

**Wish climb:**

```text
Capture one skill or product feature I want in Luna Foundry Multiagent. Interview me one or two questions at a time about pain, skill vs product feature, who benefits, Given/When/Then done, never-do, that I use Cursor, and how often. Then draft title, purpose, and 3–5 acceptance criteria. Stop for my Go. Do not implement.
```

When the draft looks right, send:

```text
Go
```

### 3.3 Waypoint Check

```text
Waypoint Check: phase position, kit, gaps. Report NAB event type or none. Product smoke: WaypointGo if ACs are clear—do not invent TaskingReady or RequirementsToAdoReady. Hold if fuzzy.
```

### 3.4 Summit

**Smoke:**

```text
For the approved smoke job only: create folders if needed and write docs/Analysis/outputs/macroflow-turn-smoke.md with machine, date, extension version, and exact line "product mode MacroFlow turn OK". Verify against ACs. No PR, no issue post. Summarize proof paths.
```

**Wish:**

```text
For the approved wish only: create folders if needed and write docs/Analysis/outputs/luna-wishlist-short-name.md with title, skill-vs-feature, purpose, ACs, never-do, host=Cursor, and frequency; draft a GitHub issue body titled Wish: name with labels feedback and skill-idea or enhancement and section Trail map: Cursor; do not open a PR and do not post the issue for me.
```

### 3.5 Prove it (terminal)

```bash
git status
# or list docs/Analysis/outputs
```

### 3.6 File feedback (wish only)

Keep the wish brief in this workspace (**no secrets**). Help stays in this pack — see `SUPPORT.md`. Do not file it on GitHub.

Done.

---

## How multiagent should feel (Cursor)

| Do | Don’t |
|----|--------|
| Trust **`.cursorrules` + `.github`** as the pack | Expect Grok-only slash menus |
| One job, Waypoint, then proof | Drive-by refactors outside ACs |
| Optional Grok dual-pane for TUI multiagent | Mix secrets into Agent chat |
| Privacy mode for non-public code | Skip camp (Setup) and invent ritual |

Wiring + dual-pane: [TUI-UI-TEST-CASES.md](./TUI-UI-TEST-CASES.md) · [01-grok-build.md](./01-grok-build.md).

---

[← All trail maps](./README.md) · [Security](./SECURITY-PRIVACY-ETHICS.md) · [Main story](../../README.md) · [Support](../../SUPPORT.md) · [Command reference](../OPERATOR-REFERENCE.md)
