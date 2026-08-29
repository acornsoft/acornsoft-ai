# Grok Build keybindings inside VS Code (Luna multiagent)

## Short answer

| Goal | Possible? |
|------|-----------|
| Free **Ctrl+Space** (and other Grok chords) **only in Luna Grok shells** | **Yes** — extension unbinds conflicting VS Code defaults while that terminal is focused |
| Make VS Code “implement” every Grok shortcut | **No** — keys must reach the terminal; Grok handles them |
| Remap Grok’s own keys | **No** — Grok TUI bindings are fixed |

---

## Spurious characters (`[M…`, weird glyphs after Grok)

Those are almost always **xterm mouse-tracking escape sequences**, not corruption of your project. Grok’s TUI enables mouse mode; if it stays on after the TUI exits (or during focus glitches), clicks/scrolls get injected as text into the shell — and if you paste that into chat, the agent sees garbage.

### Immediate fix (run in the affected terminal)

**bash / Git Bash / macOS / Linux:**

```bash
printf '\033[?1000l\033[?1002l\033[?1003l\033[?1006l\033[?1015l\033[?1005l\033[?2004l'
```

**pwsh:**

```powershell
$e = [char]27; [Console]::Out.Write("$e[?1000l$e[?1002l$e[?1003l$e[?1006l$e[?1015l$e[?1005l$e[?2004l")
```

Then **Terminal: Clear** (or open a **new** Luna Grok terminal).

### Habits that reduce it

1. Prefer **Luna: Create Grok Build (…)** terminals (Luna clears mouse modes after `grok` exits).  
2. Do **not** select/copy the garbled line into chat — discard and retype.  
3. After Grok exits to a normal prompt, if you see garbage on click, run the printf / pwsh line above.  
4. Optional VS Code: leave mouse wheel for scroll; avoid relying on terminal mouse while Grok is mid-exit.

### Product fix (extension)

Grok Build startup scripts (pwsh + bash) now **disable mouse tracking** after the TUI process ends (`?1000l` / `?1002l` / `?1003l` / `?1006l` / bracketed paste off). Rebuild/reload multiagent to pick this up.

## What VS Code was doing with Ctrl+Space

**Trigger Suggest** (`editor.action.triggerSuggest`) — IntelliSense / autocomplete.  
That is why Grok voice never saw the chord in the integrated terminal.

**Official Grok voice keys:** `/voice` or **`Ctrl+Space`** (not F8). **Esc** leaves voice.

## What the Luna extension does

1. Sets context **`luna.grokTerminalFocus`** when the active terminal name is a Luna Grok profile (`Grok Build …`, `Grok (pwsh|bash)`, etc.).
2. Contributes **negative keybindings** (unbinds) so VS Code does not steal those chords while that terminal is focused (see matrix below).
3. Setting (default **on**):

```text
lunaFoundry.preferGrokKeybindingsInTerminal: true
```

4. **Status bar is a toggle (not display-only):**  
   - Focus a Luna Grok terminal → **Grok keys** (on) or **Grok keys off** appears.  
   - **Click** the item → flips the setting (User scope) and refreshes pass-through.  
   - Command Palette: **Luna: Toggle Grok Keys (pass-through in Luna terminals)** (`luna.toggleGrokKeybindings`).  
   - When off, the bar uses a warning background so you notice VS Code may steal chords.

---

## Grok vs VS Code — conflict matrix (VS Code family)

Grok already **rebinds some things on VS Code family** terminals (docs): e.g. **Ctrl+L** = mid-turn interject, **Ctrl+D** = quit (not Ctrl+Q), plugins via `/plugins`. Still, the **workbench** can steal chords before they reach the PTY.

| Grok action | Grok key | Typical VS Code / host thief | Priority | Extension unbind today? |
|-------------|----------|------------------------------|----------|-------------------------|
| **Voice** | **Ctrl+Space** | Trigger Suggest | **P0** | **Yes** |
| Command palette | Ctrl+P | Quick Open | **P0** | **Yes** |
| Background command | Ctrl+B | Toggle Sidebar | **P0** | **Yes** |
| Tasks pane | Ctrl+G | Go to Line | **P1** | **Yes** |
| Mid-turn **interject** (VS Code family) | **Ctrl+L** | Chat open / terminal clear | **P0** | **Yes** (chat variants) |
| Model / multiline | Ctrl+M | Tab focus mode | **P1** | **Yes** |
| Always-approve | Ctrl+O | Open File | **P1** | **Yes** |
| Prompt queue | Ctrl+; / Ctrl+' | Terminal focus tabs (varies) | **P2** | Partial (ctrl+;) |
| Todos | Ctrl+T | (often free) | **P2** | Optional |
| Session picker | Ctrl+S | Save | **P1** — careful | **No** (save is sacred; use `/resume`) |
| New session | Ctrl+N | New window/file | **P2** | Optional |
| Shortcuts help | Ctrl+. / **Ctrl+X** | (Ctrl+X cut in editor; terminal OK) | **P2** | Prefer **Ctrl+X** in VS Code |
| Settings | F2 / Ctrl+, | Rename symbol / settings | **P2** | Prefer **F2** in TUI or `/settings` |
| Send now mid-turn | **Ctrl+L** (VS Code) | same as interject | **P0** | covered with Ctrl+L unbinds |
| Expand thinking | Ctrl+E | Focus Open Editors | **P2** | **Yes** |
| Fullscreen block | Ctrl+F | Find | **P2** | Optional (Find is useful in editor; only when Grok terminal focused) |
| Half-page down | Ctrl+D → **Shift+D** in VS Code | (Grok already rebinds) | n/a | Grok-side |
| Quit | Ctrl+Q → **Ctrl+D** in VS Code | (Grok already rebinds) | n/a | Grok-side |
| Image paste (Windows) | **Alt+V** | rarely stolen | n/a | Document only |
| Shell mode | `!` on empty prompt | free | n/a | — |

**Do not unbind lightly:** Ctrl+C (copy/cancel), Ctrl+V (paste), Ctrl+S (save when not terminal-focused — our when clause already scopes to Grok terminal).

### Recommended next unbinds (if still stolen)

| Key | Unbind command (examples) |
|-----|---------------------------|
| Ctrl+F | `-actions.find` when `luna.grokTerminalFocus` |
| Ctrl+T | `-workbench.action.showAllSymbols` / terminal tabs (build-dependent) |
| Ctrl+N | `-workbench.action.files.newUntitledFile` when Grok terminal focused |
| Ctrl+L | also `-workbench.action.terminal.clear` if terminal profile maps Clear |

---

## Shell conveniences to add (Luna product)

Beyond keybinds — what makes “Grok inside VS Code” feel first-class for release closeout.

### Already have (good)

| Convenience | Status |
|-------------|--------|
| Grok Build terminals (auto-start TUI) pwsh/bash | Yes |
| Grok clean shells (PATH only) | Yes |
| Tab color by shell (pwsh blue / bash yellow) | Yes |
| Icons rocket vs terminal | Yes |
| Install / verify Grok CLI hub | Yes |
| Install Luna Grok plugin | Yes |
| Setup → shell `$HOME/etc` | Yes |
| Profile heal on activation | Yes |

### High value (status for 1.0.26243)

| # | Convenience | Why | Status |
|---|-------------|-----|--------|
| 1 | **Grok keybind pack** (this doc + package.json unbinds) | Voice + palette + interject work in-IDE | **Shipped** |
| 2 | **Status: “Grok keys”** when `luna.grokTerminalFocus` | Operator knows chords will pass through | **Shipped** |
| 3 | **One-click dual pane** — Build + clean shell + Join Terminals recipe in Setup success | Documented trail; automate if API allows |
| 4 | **Env banner in Build terminal** — one line after launch: shell-env version, `grok --version`, plugin hint | Base Camp confidence without typing |
| 5 | **Secrets discipline hint** — “use clean shell for PAT CLIs, not TUI paste” | AI-safe |
| 6 | **`/voice` fallback toast** if we detect voice toggle failures (hard) — else docs | Reliability |
| 7 | **Windows: Alt+V image paste note** in Grok shell welcome | Windows-specific |
| 8 | **Doctor shortcut** from status bar: run `grok doctor` in clean shell | Support |
| 9 | **Optional: send text to active Grok terminal** command (extension → PTY) | Power users; careful with focus |
| 10 | **WSL removed** | No Luna WSL terminals/installers — native pwsh/bash only |

### Explicitly later (not first release)

- Full 3D orbit / Deep Zoom productized in extension webview  
- Remappable Grok keymap (needs xAI)  
- Capture all Cursor/VS Code Insiders experimental chords forever  

---

## How to use (after rebuild)

1. Reload window / reinstall multiagent with new keybindings + context.
2. Open **Grok Build (pwsh)** or **Grok Build (bash)** (Luna profile name).
3. Focus that terminal tab (`luna.grokTerminalFocus`).
4. **Ctrl+Space** for voice, or **`/voice`**.

## Immediate user override (no rebuild)

```json
[
  {
    "key": "ctrl+space",
    "command": "-editor.action.triggerSuggest",
    "when": "terminalFocus"
  }
]
```

Broader than Luna-only. Prefer extension path for Grok shells only.

## Sources

- Grok Build user guide: `03-keyboard-shortcuts.md`, `21-terminal-support.md` (voice: `/voice` or `Ctrl+Space`)
- Extension: `package.json` keybindings + `registerGrokTerminalKeybindingContext`
