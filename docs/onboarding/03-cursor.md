# Trail map: Cursor

For people who already build in **Cursor** with an **Agent**-capable plan. Multiagent does not replace Cursor—it gives Luna and MacroFlow a home via **Setup** (`.cursorrules` + `.github/`). You run one **complete MacroFlow turn** (Base Camp → Route → Waypoint → Summit) with proof; an optional second climb files a skill/feature wish.

**Multiagent on this ridge:** pack-on-disk + Cursor Agent/Composer reading **`.cursorrules`** and **`.github/`**. Grok slash skills (`/base-camp`) are **optional** only if you also open Grok Build terminals inside Cursor.

### Before you start — ready to climb?

Confirm each line. If not, finish that item first.

- **Cursor** is installed and can load VS Code-compatible extensions
- **Luna Foundry Multiagent** is installed and enabled in Cursor—prefer stamp **1.0.26243**
- A **project folder** is open that *is* this climb
- Plan includes **Agent** (Pro or current Agent-capable tier—not free-only limits)
- Command Palette shows **Luna:** commands
- **Privacy mode** on if the code is not public; no secrets in Agent chat

**Command you will use**

| Type this | Full title |
|-----------|------------|
| `Setup` | **Luna: Setup (Copilot / Cursor / Grok)** |


---

## Step 1 - Establish Camp

![Establish camp — Luna Setup](/images/luna/trail-set-camp-setup.jpg)

1. Confirm the multiagent extension is enabled in Cursor (Extensions view).  
2. Command Palette → **Luna: Setup (Copilot / Cursor / Grok)**.  
   - Multi-root: pick the **climb root**.  
   - Choose **Set up**.  
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
3. If Agent ignores the pack, point it at **`.cursorrules`**, **`.github/skills/macroflow`**, and agents under **`.github/agents`** (Luna, BaseCamp, Route, Summit).

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


---

