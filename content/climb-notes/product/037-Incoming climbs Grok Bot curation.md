---
id: cn-037
number: "037"
title: Incoming climbs — curate, then Grok Bot
date: 2026-08-28
status: draft
folder: product
tags:
  - climb-note
  - product
  - intake
  - luna
---

## Base Camp

We take incoming requirements from /start. They must land in Gnomah as real Climb Notes, then be curated before any agent runs. Supporting repos stay destinations, not second brains. Luna Foundry Multiagent is the Sherpa pack; its docs ship in the VSIX and have a public trailhead on acornsoft.ai/luna.

Gear: Gnomah vault (acornsoft/gnomah), this site (acornsoft/acornsoft-ai), the extension (acornsoft/luna-foundry-multiagent), config pack (acornsoft/luna-foundry-config). Rule: mountain first. We are fit to leave when Inbox is a lane, not a lost 9xx file.

## Route

One summit: every incoming write-up is a draft in Gnomah Inbox. Curate (hold or go). Go means a lane (product / foundation / engagement) and one supporting repo. Then Grok Bot / Grok Build runs the step. Success: owner can filter Inbox, open CN-0xx, and know which repo gets the workforce. Not today: auto-running Workforce on every submit.

## Waypoint

Check the map. Intake now writes a draft with tag `intake` under `inbox/`. Gnomah has Inbox / Product / Foundation / Engagement lanes. Extension README + `docs/onboarding/**` already ship in the VSIX (.vscodeignore keeps them). Public host for the intro is `/luna`. Hold or go: go on curation; hold on silent Bot fire.

## Summit

Proof this week: send a Climb Note → Open CN-0xx → it sits in Inbox. Luna trailhead is on /luna. Next slice: Clarify bot on an Inbox note (hold/go + lane), then Workforce only after go.
