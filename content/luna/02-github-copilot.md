# Trail map: GitHub Copilot

For people who already work in **GitHub Copilot** day to day (Pro or a company seat). You do **not** need Grok for this ridge. Luna and MacroFlow join you in **Copilot Chat**—same climb language, familiar editor. You run one **complete MacroFlow turn** (Base Camp → Route → Waypoint → Summit) with proof; an optional second climb files a skill/feature wish.

**Multiagent on this ridge:** the Luna **four custom agents** (Luna, BaseCamp, Route, Summit) after Setup—not Grok slash menus.

### Before you start — ready to climb?

Confirm each line. If not, finish that item first.

<div align="center">

<table border="0" cellpadding="2" cellspacing="0">
<tr>
<td align="left">✓</td>
<td align="left"><small><strong>Luna Foundry Multiagent</strong> is installed and enabled in VS Code (or Cursor if that is your host)—prefer stamp <strong>1.0.26239</strong></small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>A <strong>project folder</strong> is open that <em>is</em> this climb</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small><strong>GitHub Copilot</strong> and <strong>Copilot Chat</strong> are signed in</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>Plan can run <strong>sustained Chat / custom agents</strong> (Pro or org seat—not free-only teaser limits)</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>Command Palette shows <strong>Luna:</strong> commands</small></td>
</tr>
<tr>
<td align="left">✓</td>
<td align="left"><small>A few quiet minutes; <strong>no secrets</strong> in Chat</small></td>
</tr>
</table>

</div>

**Command you will use**

| Type this | Full title |
|-----------|------------|
| `Setup Unified` | **Luna: Setup Unified Workspace (Copilot / Cursor / Grok)** |

Optional later (only if you also use Grok Build): [Grok Build trail](./01-grok-build.md) + [TUI-UI-TEST-CASES.md](./TUI-UI-TEST-CASES.md).

---

## Step 1 - Establish Camp

<img src="./assets/trail-set-camp-setup.jpg" alt="Establish camp — Setup Unified Workspace" width="50%" />

1. Confirm **Copilot Chat** opens and is signed in.  
2. Command Palette → **Luna: Setup Unified Workspace (Copilot / Cursor / Grok)**.  
   - Multi-root: pick the **climb root**.  
   - Choose **Yes, Unify Now**.  
3. What Setup actually does for you:  
   - Deploys **`.github/skills`**, **`.github/agents`**, and related instructions into the workspace.  
   - Agents on disk: **Luna**, **BaseCamp**, **Route**, **Summit**.  
   - Installs/refreshes shell under **`$HOME/etc`** (open a **new** terminal afterward).  
   - Sets workspace chat settings to prefer **`.github/agents`**.  
4. Quiet check: Explorer shows **`.github/agents`** and **`.github/skills/macroflow`**.

If `.github` is missing, re-run Setup on the real workspace root.

You do **not** need **Install Luna Plugin for Grok** for the Copilot ridge. Skip Grok CLI steps unless you also climb on Grok Build.

---

## Step 2 - Open Copilot Chat with a Luna agent

1. Open **Copilot Chat**.  
2. Open the **agent** picker and choose **Base Camp** or **Luna** if listed (from `.github/agents` after Setup).  
3. If custom agents are noisy, use Configure Custom Agents and hide non-Luna ones (Setup’s tip).  
4. If the agent list is empty, re-run Setup, then reload the window. You can still paste the Step 3 text as plain Chat messages—the pack on disk still guides the model when the project is open.

**Multiagent tip:** use **Luna** when you want orchestration; switch agent to **Base Camp** / **Route** / **Summit** for phase purity. Prefer one agent (or one phase) per stretch of work so handoffs stay readable.

Copilot may not treat `/base-camp` as a Grok-style slash skill. Prefer: pick the **Base Camp** agent, then send the sentence **without** relying on slash routing—or keep the slash if your build accepts it.

---

## Step 3 - Complete MacroFlow turn (product mode)

Send each prompt in **Copilot Chat**. Terminal only for proof (3.5).  
**Product mode:** skip Azure DevOps and Gnomah vault unless you ask. **No secrets** in Chat.

**Ritual:** Base Camp → Route → Waypoint → Summit → proof.

### 3.1 Base Camp

With agent **Base Camp** (or **Luna**), send:

```text
Confirm the Luna Foundry pack is present under .github (skills/macroflow and agents Luna, BaseCamp, Route, Summit). Report gaps only. Skip Azure DevOps and Gnomah vault. Do not implement product work.
```

### 3.2 Route

Switch to agent **Route** if listed (or stay on Luna).

**Smoke job (prove the turn):**

```text
Job: produce docs/Analysis/outputs/macroflow-turn-smoke.md with machine name, date, extension version, and the exact line "product mode MacroFlow turn OK". Draft title, purpose, 3–5 ACs, out-of-scope (no ADO). Interview only if needed. Stop for my Go. Do not implement.
```

**Wish climb:**

```text
Capture one skill or product feature I want in Luna Foundry Multiagent. Interview me one or two questions at a time about pain, skill vs product feature, who benefits, Given/When/Then done, never-do, that I use GitHub Copilot, and how often. Then draft title, purpose, and 3–5 acceptance criteria. Stop for my Go. Do not implement.
```

When the draft looks right, send:

```text
Go
```

### 3.3 Waypoint Check

Still in Chat (any Luna agent):

```text
Waypoint Check: phase position, kit, gaps. Report NAB event type or none. Product smoke: WaypointGo if ACs are clear—do not invent TaskingReady or RequirementsToAdoReady. Hold if fuzzy.
```

### 3.4 Summit

Switch to agent **Summit** if listed.

**Smoke:**

```text
For the approved smoke job only: create folders if needed and write docs/Analysis/outputs/macroflow-turn-smoke.md with machine, date, extension version, and exact line "product mode MacroFlow turn OK". Verify against ACs. No PR, no issue post. Summarize proof paths.
```

**Wish:**

```text
For the approved wish only: create folders if needed and write docs/Analysis/outputs/luna-wishlist-short-name.md with title, skill-vs-feature, purpose, ACs, never-do, host=Copilot, and frequency; draft a GitHub issue body titled Wish: name with labels feedback and skill-idea or enhancement and section Trail map: Copilot; do not open a PR and do not post the issue for me.
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

## How multiagent should feel (Copilot)

| Do | Don’t |
|----|--------|
| Pick the Luna **four** after Setup | Assume Grok `/base-camp` is required |
| Phase agent matches the work | One agent inventing ADO trees in product mode |
| Waypoint before claiming done | Skip proof |
| File wishes with trail section **Copilot** | Paste secrets into issue bodies |

Full dual-surface gates: [TUI-UI-TEST-CASES.md](./TUI-UI-TEST-CASES.md) Series D (MA-04, MA-05) · [DUAL-MACHINE-TEST-MATRIX.md](./DUAL-MACHINE-TEST-MATRIX.md).

---

[← All trail maps](./README.md) · [Security](./SECURITY-PRIVACY-ETHICS.md) · [Main story](../../README.md) · [Support](../../SUPPORT.md) · [Command reference](../OPERATOR-REFERENCE.md)
