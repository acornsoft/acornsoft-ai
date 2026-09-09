# Canopy live Radar

## Cadence: once a week

X API usage is limited. Canopy **does not pull on page load**. One pull per **7 days** (`scheduleMinutes: 10080`).

| Path | Spends credits? |
| --- | --- |
| Visit /canopy | No — reads `public/canopy/live-feed.json` |
| GET `/api/canopy/refresh` | No — cache only |
| POST `/api/canopy/refresh` | **Yes**, only if the weekly window is open |
| POST + `Authorization: Bearer $CRON_SECRET` | Yes — scheduled Grok Bot / cron, even if early |

A click inside the window that is **not due** returns **429** and the last cache. Credits are not spent.

Weekly budget today: 2 user lookups + 2 timelines + a few topic searches. Stay well under pay-per-use caps. Do not add hourly jobs.

## X developer policy (how we stay inside it)

- **Official API only.** No scraping.
- **Do not exceed or circumvent rate limits.** Weekly window + 350ms pacing between calls.
- **Display integrity.** Cards keep the post text (trimmed for length), the `@handle`, and a link to the original post on X.
- **Takedown.** Live cache is replaced on each weekly pull. If X or an account owner asks to remove a post sooner, delete it from `live-feed.json` or run the weekly job with `CRON_SECRET` — do not wait for the window.
- **Keys stay private.** Bearer is env or owner-encrypted Settings. Never in the client.
- **Use case.** Public radar of our work and a few followed tool-builders. Not a firehose, not a white-label X client.

Full policy: [Developer Policy](https://docs.x.com/developer-terms/policy) · [Display requirements](https://developer.x.com/developer-terms/display-requirements.html)

## @acornsoftai Radar subscription

Yes — you can (and should) treat **@acornsoftai** as a **Radar subscription**:

1. You post on X as @acornsoftai (Climb Notes, research, product).
2. Scheduled pull reads your **user timeline** (not a noisy search).
3. Posts land on Canopy as **live** (and standout when configured).

Configured in `interests.json` → `subscriptions`:

```json
{
  "id": "radar-acornsoftai",
  "username": "acornsoftai",
  "actor": "acornsoft",
  "standout": true,
  "maxResults": 40
}
```

### Setup
1. X Developer portal → App with **read** access  
2. App-only **Bearer Token** → `X_BEARER_TOKEN`  
3. `npm run canopy:fetch` once, or the weekly Grok Bot / cron below

### Posting habit (recommended)
- Climb Notes™ on site first (`content/climb-notes`)  
- Gate **what** lands on Canopy with registry `onCanopy: true` (journal uses `status: published` alone)  
- Gate **when** with optional `canopyAt` (ISO time — future = not on timeline yet)  
- Short X post from @acornsoftai linking `#cn-00N`  
- Next scheduled pull → Canopy shows live posts under **Our Work** / All with **Live** (+ **Standout** if enabled)

**Climb Notes lane control** (`_publish-registry.json` per note):

| Field | Controls |
| --- | --- |
| `status: "published"` | Public journal (`/climb-notes`) |
| `onCanopy: true` | Climb Notes lane on Canopy timeline |
| `canopyAt` | Go-live time for Canopy (optional schedule) |
| `publishedAt` | Journal publish audit + fallback sort |

Only **published + onCanopy + canopyAt ≤ now** appears on the timeline. Example: only `cn-016` is on Canopy while consumer pack `cn-101`… stays journal-only.

### Cost
User timeline for one account is cheaper than many topic searches. Keep topic `queries` for SpaceXAI / SpaceX / Tesla; keep **subscriptions** for Radar. Run both **once a week**, not on a timer that fires daily.

### Not the same as
- X Premium “for you” feed  
- Webhooks on every post (X does not give free instant webhooks for this)

## Grok Bot + GitHub (same repo)

**Source of truth is [acornsoft/acornsoft-ai](https://github.com/acornsoft/acornsoft-ai).** Grok Build, Grok Bots, and www.acornsoft.ai all run that tree. Do not point bots at the Grok “Push to Code” export repo (`honey-reef-yonder-fleet`).

Weekly pull is a GitHub Action, not a second X client:

1. Workflow [`.github/workflows/canopy-weekly.yml`](../../.github/workflows/canopy-weekly.yml) runs Monday 09:00 ET (`0 13 * * 1` UTC) and on **Actions → Canopy weekly Radar → Run workflow**.
2. It runs `npm run canopy:fetch` with secret `X_BEARER_TOKEN`.
3. If the feed changed, it commits `public/canopy/live-feed.json` to `main`. Vercel deploys that file. (A POST to `/api/canopy/refresh` on Vercel cannot keep the JSON after the function exits.)
4. If the script reports the weekly window is closed, it stops. Do not retry until `nextPullAt`. Do not scrape. Do not pull extra accounts.
5. Takedown: run the workflow with **force**, or edit `live-feed.json` on `main`.

Secrets on the GitHub repo (Actions): `X_BEARER_TOKEN`. Optional host env `CRON_SECRET` is only for the Vercel GET cron (cache wake). The durable pull is this workflow.

A Grok Bot, if you still want one, is the same clock: it must clone **acornsoft-ai** and either dispatch this workflow or `POST /api/canopy/refresh` with `CRON_SECRET`. It must not search X itself.
