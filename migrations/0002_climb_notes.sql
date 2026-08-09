-- Climb Notes runtime store (Gnomah editor) + single-owner gate.
-- Markdown under content/climb-notes remains the Obsidian / git mirror;
-- this table is the live edit surface after seed.

create table if not exists climb_notes_owner (
  user_id text primary key,
  handle text not null,
  claimed_at timestamptz not null default now()
);

create table if not exists climb_notes (
  id text primary key,
  number text not null,
  title text not null,
  note_date text not null default '',
  status text not null default 'draft',
  problem text not null default '',
  measure text not null default '',
  slice text not null default '',
  lesson text not null default '',
  tags text not null default '[]',
  x_url text,
  version integer not null default 1,
  submitted_at timestamptz,
  submitted_by text,
  approved_at timestamptz,
  approved_by text,
  published_at timestamptz,
  unpublished_at timestamptz,
  approval_note text,
  history text not null default '[]',
  source_file text,
  owner_user_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists climb_notes_status_idx on climb_notes (status);
create index if not exists climb_notes_number_idx on climb_notes (number);
