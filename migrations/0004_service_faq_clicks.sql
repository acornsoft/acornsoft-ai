-- Service page FAQ open-counts for ranking (higher clicks = higher order).
create table if not exists service_faq_clicks (
  faq_id text primary key,
  clicks integer not null default 0,
  updated_at timestamptz not null default now()
);
