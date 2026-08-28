# SSL for acornsoft.ai

Vercel issues and renews Let’s Encrypt. Do not upload a private key into this repo.

**Today:** `https://www.acornsoft.ai` is good (Let’s Encrypt, expires 25 Nov 2026).  
**Broken:** `https://acornsoft.ai` — the certificate SAN is only `www.acornsoft.ai`. Browsers refuse the apex.

## Fix (once)

1. Vercel → this project → **Domains** → add `acornsoft.ai` and `www.acornsoft.ai`. Redirect apex → www.
2. At GoDaddy (or wherever DNS lives), replace the mixed apex A records (`76.223…`, `13.248…`) with Vercel’s:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | the target on the Vercel domain card (already `*.vercel-dns-013.com`) |

3. Optional CAA at apex: `0 issue "letsencrypt.org"`
4. Wait for Vercel to show **Valid** on both names. Handshake on `acornsoft.ai` must list SAN `acornsoft.ai` (and usually `www`).

Subdomain `unofficial-covid-report.acornsoft.ai` already has its own Vercel cert.

`BETTER_AUTH_URL` on production: `https://www.acornsoft.ai`

Login from www sends `Origin: https://www.acornsoft.ai`. If this env is a `*.vercel.app` URL, Better Auth returns **Invalid origin**. Trusted origins in the app now include www; still set the env so OAuth callbacks land on www.
