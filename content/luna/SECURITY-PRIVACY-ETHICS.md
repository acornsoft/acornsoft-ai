# Security · privacy · ethics (first principles)

Luna does **not** override host or vendor policy. Re-check vendor ToS when in doubt.

## Non-negotiables

1. **No secrets in chat, prompts, skills, or git.**  
   Secrets only: `~/.config/luna/secrets.env` (or OS keychain). Mode restrictive.
2. **Classify data before you paste.**  
   Public → any host. Internal → know training/retention. Client/confidential → contract + approved host only. Secrets → never in LLM.
3. **Human steers.**  
   Base Camp → Route (ACs) → Summit with **proof**. No fake “done.”
4. **Minimize context.**  
   Smallest paste that does the job.
5. **Review agent diffs** before commit. Prefer a **side shell** for `gh` / PATs — not the chat log. (Azure/ADO CLIs are optional later; not required for product trails.)

## By host (operator checklist)

| Host | Before production work |
|------|------------------------|
| **Grok Build** | Paid plan (SuperGrok / X Premium+); correct `grok login`; no secrets in TUI |
| **Copilot** | Pro or org seat; org allows custom agents if you need them; set AI spend budget; prefer Business for company confidential |
| **Cursor** | Paid Agent plan; **privacy mode** on for non-public code |
| **Claude** | Pro+; project instructions ban secrets; only attach needed pack paths |

## Base Camp (every climb)

- Confirm data class is allowed on **this** host today.  
- Secrets plane present; package does not invent PATs.  
- Stop if policy or readiness is unclear.

## If something leaks

Rotate credentials. Treat LLM paste as potentially retained per vendor policy. Tell your security contact when client data is involved.
