# Canopy access ops

This file is for operators. It is not a public page.

## Required check before merge

Tests must pass before a merge to `acornsoft-ai` `main`. The workflow is
`.github/workflows/canopy-access-tests.yml`.

Mark this check required in branch protection. Do not rename it without
updating the protection rule:

`canopy-access-tests`

That is the name returned by the check-runs API and by `gh pr checks`.
It is the job name in `.github/workflows/canopy-access-tests.yml`.
Confirmed on the failing run for commit `1e30a2d` (check conclusion `failure`).
A failing access test fails this check. Do not rename the job without
updating the required check.

## CANOPY_ADMIN_USER_IDS

`isCanopyAdmin` in `src/lib/canopy-notes/admin.server.ts` reads
`CANOPY_ADMIN_USER_IDS`.

- Unset, empty, or blank: nobody is an admin. Admin calls return forbidden and
  write no audit row. The notes admin page returns not found. This is the safe
  default. Leave it this way until the real id is known.
- The value is not in source. Do not guess it. Do not commit it.
- Production holds exactly one id: David's site user id from his X sign-in.
- That id does not exist until David signs in with X once. Read it after that
  sign-in. Do not copy an id from Google.

How to read it:

1. David signs in on the site with X.
2. In the production database, read the new account row for that sign-in:

```sql
select "userId", "accountId", "providerId", "createdAt"
from "account"
where "providerId" = 'grok-x'
order by "createdAt" desc;
```

3. If more than one X account exists, David confirms which `userId` is his
   before anyone saves it.
4. Set `CANOPY_ADMIN_USER_IDS` to that single id in the production environment.
   No spaces, no second id.
5. Restart or redeploy only if that host reads environment variables at process
   start. This repo does not change DNS, Vercel project settings, or production
   deploys.

After that, signed in as David, `/canopy/notes/admin` returns 200. Any other
account gets 404 from that page. Admin function calls from anyone else return
403. The first audit row written after setup has David's id in `actor_user_id`.
The access tests already check that the actor stored on an audit row is the
configured admin id.

## Two Google accounts for the preview login proof

The browser test is `src/lib/canopy-notes/e2e-login.two-accounts.test.ts`.
It signs in as two Google accounts on the preview environment. Credentials are
not in the repo. The test reads them from the environment and skips, with the
missing names in the test title, when any name is unset.

Set these on the preview environment (secrets, not files):

| Name | What it is |
| --- | --- |
| `CANOPY_E2E_BASE_URL` | Preview origin, no path. Example shape: `https://<preview-host>` |
| `CANOPY_E2E_GOOGLE_A_EMAIL` | Google account A email |
| `CANOPY_E2E_GOOGLE_A_PASSWORD` | Google account A secret |
| `CANOPY_E2E_GOOGLE_B_EMAIL` | Google account B email |
| `CANOPY_E2E_GOOGLE_B_PASSWORD` | Google account B secret |
| `CANOPY_E2E_ALLOWLIST_NOTE_ID` | Note id on the public allowlist |
| `CANOPY_E2E_ACCOUNT_A_NOTE_ID` | Note id assigned only to account A |
| `CANOPY_E2E_ACCOUNT_B_NOTE_ID` | Note id assigned only to account B |

Seed those three notes in the preview database before the browser test. The
HTTP tests in `src/lib/canopy-notes/access.http.test.ts` cover the same page
rules without those accounts.

Run the browser test when the variables are present:

```
npx vitest run src/lib/canopy-notes/e2e-login.two-accounts.test.ts
```

It is not part of the required GitHub check. That check runs `npm run test:unit`,
every Vitest file under `src` except this browser test.
