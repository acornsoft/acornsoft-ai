# Trail map: Claude

For people who already think with **Claude** (Pro is the practical floor for a real climb). There is **no** dedicated “Install Luna for Claude” command in the multiagent extension. You use Claude as the engine; Multiagent still lays the **same pack on disk** so Claude Code or a Claude Project can read it. You run one **complete MacroFlow turn** (Base Camp → Route → Waypoint → Summit) with proof; an optional second climb files a skill/feature wish.

**Multiagent on this ridge:** portable pack (`.github/agents` + skills) + your Claude instructions—not Grok TUI slash menus, not Copilot’s agent picker.

### Before you start — ready to climb?

Confirm each line. If not, finish that item first.

- **Claude Pro** (or higher)—not free-only chat limits
- A **project folder** exists that *is* this climb
- **VS Code or Cursor** with **Luna Foundry Multiagent** (so Setup can lay the pack), *or* you can copy a teammate’s `.github` pack
- You can open that folder in **Claude Code** or a **Claude Project** with pack paths available
- A few quiet minutes; no secrets or client names in Claude chat

**Extension command (camp only)**

| Type this | Full title |
|-----------|------------|
| `Setup` | **Luna: Setup (Copilot / Cursor / Grok)** |


---

## Step 1 - Establish Camp

![Establish camp — pack on the project](/images/luna/trail-set-camp-setup.jpg)

1. Open the project in **VS Code or Cursor**. Run **Luna: Setup (Copilot / Cursor / Grok)** → **Set up**.  
2. Confirm on disk: **`.github/skills/macroflow`**, **`.github/agents`** (Luna, BaseCamp, Route, Summit). Setup also writes **`.cursorrules`** and may install shell under **`$HOME/etc`**—fine to ignore for Claude-only work.  
3. Open that **same** folder in **Claude Code**, or attach it as a **Claude Project** with those paths as knowledge.  
4. Add short project instructions (Project settings or a local instructions file). Paste:

```text
You are working a Luna MacroFlow climb. Ritual in order:
(1) Base Camp — readiness; no secrets in chat; skip ADO and Gnomah unless I ask.
(2) Route — one job + Given/When/Then ACs; wait for Go.
(3) Waypoint Check — NAB event type or none; hold or go; no TaskingReady / RequirementsToAdoReady unless enterprise is on and criteria are met.
(4) Summit — implement with proof; no drive-by refactors.
Luna is the Sherpa. Read .github/skills/macroflow and .github/agents when unsure. Announce Phase · Skill before significant work.
```

If you cannot run Setup, copy at least `macroflow` skills and the four agents into the project from a teammate—camp still needs those files.

---

## Step 2 - Open Claude on the pack

Open **Claude Code** or your **Project** on the folder that has **`.github`**. Claude will **not** use Grok’s `/base-camp` slash menu. Paste the Step 3 text as ordinary messages (or invoke skills the way Claude Code does if your build supports skill files).

**Multiagent tip:** you can role-prompt phase purity (“Act as Base Camp only…”) or stay in one Luna thread that announces phases. Prefer the latter for a first climb so handoffs stay in one transcript.

---

## Step 3 - Complete MacroFlow turn (product mode)

Send each prompt in **Claude**. Terminal only for proof (3.5).  
**Product mode:** skip Azure DevOps and Gnomah vault unless you ask.

**Ritual:** Base Camp → Route → Waypoint → Summit → proof.

### 3.1 Base Camp

```text
Read .github/skills/macroflow and .github/agents. Confirm the Luna Foundry pack is present. Report gaps only. Skip Azure DevOps and Gnomah vault. Do not implement product work.
```

### 3.2 Route

**Smoke job:**

```text
Job: produce docs/Analysis/outputs/macroflow-turn-smoke.md with machine name, date, extension version, and the exact line "product mode MacroFlow turn OK". Draft title, purpose, 3–5 ACs, out-of-scope (no ADO). Interview only if needed. Stop for my Go. Do not implement.
```

**Wish climb:**

```text
Capture one skill or product feature I want in Luna Foundry Multiagent. Interview me one or two questions at a time about pain, skill vs product feature, who benefits, Given/When/Then done, never-do, that I use Claude, and how often. Then draft title, purpose, and 3–5 acceptance criteria. Stop for my Go. Do not implement.
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
For the approved wish only: create folders if needed and write docs/Analysis/outputs/luna-wishlist-short-name.md with title, skill-vs-feature, purpose, ACs, never-do, host=Claude, and frequency; draft a GitHub issue body titled Wish: name with labels feedback and skill-idea or enhancement and section Trail map: Claude; do not open a PR and do not post the issue for me.
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

## How multiagent should feel (Claude)

| Do | Don’t |
|----|--------|
| Keep pack files in the project Claude can read | Rely on Grok-only slash wiring |
| Ritual order + proof | Skip Waypoint / claim done without a path |
| Product mode unless enterprise is explicit | Invent ADO hierarchy by default |
| Wish issues tagged **Trail map: Claude** | Secrets or client names in chat |

When you want the **richest** multiagent UX (slash skills, agent modal, dual-pane shell), add the [Grok Build trail](./01-grok-build.md) later—same pack language, stronger host tools.

---

