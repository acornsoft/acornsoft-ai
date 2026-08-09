-- Owner-only encrypted private preferences (e.g. X API Bearer for Canopy Radar).
-- Plaintext never stored. Client APIs may only return configured + last4 + timestamps.

create table if not exists owner_private_secrets (
  user_id text not null,
  secret_kind text not null,
  ciphertext text not null,
  iv text not null,
  auth_tag text not null,
  key_version integer not null default 1,
  last4 text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, secret_kind)
);

create index if not exists owner_private_secrets_kind_idx
  on owner_private_secrets (secret_kind);
