-- Signed-in notes: explicit public allowlist, per-account assignment,
-- revocation, and an append-only audit trail.
-- Do not update or delete canopy_audit rows.

create table if not exists canopy_notes (
  note_id text primary key,
  kind text not null check (kind in ('product', 'foundation', 'engagement', 'other')),
  title text not null,
  body_md text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists canopy_public_allowlist (
  note_id text primary key references canopy_notes (note_id),
  added_at timestamptz not null default now(),
  added_by text not null
);

create table if not exists canopy_assignments (
  note_id text not null references canopy_notes (note_id),
  user_id text not null,
  assigned_at timestamptz not null default now(),
  assigned_by text not null,
  primary key (note_id, user_id)
);

create index if not exists canopy_assignments_user_idx
  on canopy_assignments (user_id);

create table if not exists canopy_account_status (
  user_id text primary key,
  revoked_at timestamptz null
);

create table if not exists canopy_audit (
  id bigserial primary key,
  at timestamptz not null default now(),
  actor_user_id text not null,
  action text not null check (
    action in (
      'assign',
      'unassign',
      'allowlist_add',
      'allowlist_remove',
      'revoke',
      'restore',
      'note_upsert'
    )
  ),
  note_id text,
  target_user_id text
);
