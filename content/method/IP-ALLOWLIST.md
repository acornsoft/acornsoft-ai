# IP allowlist (Vercel / Grok deploy)

**Default: public.** If `IP_ALLOWLIST` is empty, anyone can open the site.

GoDaddy DNS does **not** enforce this. Control is in the **app on Vercel**.

## Env (Vercel project → Settings → Environment Variables)

| Variable | Example | Meaning |
| --- | --- | --- |
| `IP_ALLOWLIST` | `203.0.113.10,198.51.100.0/24` | Allowed IPs / CIDRs (comma-separated) |
| `IP_ALLOWLIST_ENABLED` | `true` | Force on/off (optional; on if list non-empty) |
| `IP_ALLOWLIST_EXEMPT_PATHS` | `/api/canopy/refresh,/favicon.png` | Paths that skip the gate |
| `IP_ALLOWLIST_TRUST_PROXY` | `true` | Use `x-forwarded-for` (keep true on Vercel) |

## Behavior

- Request IP must match an entry (exact IPv4/IPv6 or IPv4 CIDR).
- Loopback (`127.0.0.1`, `::1`) always allowed (local tooling).
- Denied visitors get **403** + short HTML (“Access limited”).
- Cron path `/api/canopy/refresh` is exempt by default (Vercel cron).

## How to turn on (private site)

1. Visit the site once while open; note your public IP (or use a “what is my IP” tool).
2. In Vercel: set  
   `IP_ALLOWLIST=YOUR.IP.HERE`  
   (add office CIDR if needed, e.g. `203.0.113.0/24`).
3. Redeploy.
4. Confirm from an allowed network; from a phone off Wi‑Fi you should get 403.

## How to turn off (public launch)

1. Clear `IP_ALLOWLIST` or set `IP_ALLOWLIST_ENABLED=false`.
2. Redeploy.

## Limits

- Not a substitute for **login** on Gnomah/Voice.
- Home/mobile IPs change — prefer CIDR for offices or leave public + app auth.
- Shared VPNs: allowlist the VPN egress range.
- Stronger geo/IP product features: Cloudflare or Azure Front Door in front of Vercel later.
