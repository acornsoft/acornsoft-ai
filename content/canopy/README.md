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
- Short X post from @acornsoftai linking `#cn-00N`  
- Next scheduled pull → Canopy shows it under **Our Work** / All with **Live** (+ **Standout** if enabled)

### Cost
User timeline for one account is cheaper than many topic searches. Keep topic `queries` for SpaceXAI / SpaceX / Tesla; keep **subscriptions** for your own Radar.

### Not the same as
- X Premium “for you” feed  
- Webhooks on every post (X does not give free instant webhooks for this; schedule is the reliable path)
