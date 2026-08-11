# Canopy live Radar

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
3. `npm run canopy:fetch` (or hourly cron / Vercel `/api/canopy/refresh`)

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
User timeline for one account is cheaper than many topic searches. Keep topic `queries` for SpaceXAI / SpaceX / Tesla; keep **subscriptions** for your own Radar.

### Not the same as
- X Premium “for you” feed  
- Webhooks on every post (X does not give free instant webhooks for this; schedule is the reliable path)
