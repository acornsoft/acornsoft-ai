-- Append-only analytics event log (no PII; props are small JSON).
create table if not exists analytics_events (
  id bigserial primary key,
  event_name text not null,
  path text,
  session_id text,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_created_idx
  on analytics_events (event_name, created_at desc);

create index if not exists analytics_events_created_idx
  on analytics_events (created_at desc);
