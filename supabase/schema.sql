-- ═══════════════════════════════════════════════════════════
--  BRYLLUPSAPPEN — Supabase SQL Schema
--  Kjør dette i Supabase: SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "pgcrypto";


-- ────────────────────────────────────────────────────────────
-- WEDDINGS
-- ────────────────────────────────────────────────────────────
create table if not exists weddings (
  id                  text primary key default 'w_' || gen_random_uuid()::text,
  invite_code         text unique not null,
  name1               text not null,
  name2               text not null,
  display_name        text,
  date                date,
  date_uncertain      boolean default false,
  country             text default 'Norge',
  city                text,
  venue               text,
  venue_type          text,
  guest_count         text,
  budget_total        numeric default 0,
  budget_uncertain    boolean default false,
  wedding_style       text default 'romantisk',
  planning_milestones text[] default '{}',
  partner_email       text,
  dress_code          text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- USERS  (planners, guests, vendors)
-- ────────────────────────────────────────────────────────────
create table if not exists users (
  id           text primary key default 'u_' || gen_random_uuid()::text,
  username     text unique not null,
  password     text not null,   -- store hashed in production!
  role         text not null check (role in ('planner','guest','vendor')),
  name         text not null,
  wedding_id   text references weddings(id) on delete set null,
  vendor_id    text,
  vendor_name  text,
  category     text,
  created_at   timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- TASKS  (oppgaver / plan)
-- ────────────────────────────────────────────────────────────
create table if not exists tasks (
  id          text primary key default 't_' || gen_random_uuid()::text,
  wedding_id  text not null references weddings(id) on delete cascade,
  title       text not null,
  description text,
  status      text default 'open' check (status in ('open','in_progress','done','cancelled')),
  priority    text default 'medium' check (priority in ('low','medium','high','critical')),
  category    text,
  due_date    date,
  assigned_to text,
  notes       text,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- GUESTS  (gjesteliste)
-- ────────────────────────────────────────────────────────────
create table if not exists guests (
  id                  text primary key default 'g_' || gen_random_uuid()::text,
  wedding_id          text not null references weddings(id) on delete cascade,
  first_name          text not null,
  last_name           text,
  email               text,
  phone               text,
  relation_category   text default 'Venner',
  side_of_couple      text default 'felles' check (side_of_couple in ('brud','brudgom','felles')),
  rsvp_status         text default 'not_invited'
                        check (rsvp_status in ('not_invited','invited','pending','accepted','declined')),
  allergies           text,
  special_needs       text,
  plus_one_allowed    boolean default false,
  plus_one_name       text,
  table_id            text,
  seat_number         int,
  notes               text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- BUDGET  (budsjettlinjer)
-- ────────────────────────────────────────────────────────────
create table if not exists budget (
  id              text primary key default 'b_' || gen_random_uuid()::text,
  wedding_id      text not null references weddings(id) on delete cascade,
  category        text not null,
  description     text,
  estimated_cost  numeric default 0,
  actual_cost     numeric default 0,
  paid            boolean default false,
  vendor_id       text,
  notes           text,
  sort_order      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- VENDORS  (leverandører)
-- ────────────────────────────────────────────────────────────
create table if not exists vendors (
  id              text primary key default 'v_' || gen_random_uuid()::text,
  wedding_id      text not null references weddings(id) on delete cascade,
  name            text not null,
  category        text,
  status          text default 'researching'
                    check (status in ('researching','contacted','quote','shortlisted','booked','rejected')),
  contact_person  text,
  email           text,
  phone           text,
  website         text,
  price           numeric,
  price_note      text,
  rating          int check (rating between 1 and 5),
  notes           text,
  priority        text default 'medium',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- VENDOR CHATS  (meldinger mellom brudeparet og leverandør)
-- ────────────────────────────────────────────────────────────
create table if not exists vendor_messages (
  id          text primary key default 'vm_' || gen_random_uuid()::text,
  wedding_id  text not null references weddings(id) on delete cascade,
  vendor_id   text not null,
  sender      text not null,   -- 'couple' or vendor name
  message     text not null,
  sent_at     timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- CONTRACTS  (kontrakter)
-- ────────────────────────────────────────────────────────────
create table if not exists contracts (
  id                  text primary key default 'c_' || gen_random_uuid()::text,
  wedding_id          text not null references weddings(id) on delete cascade,
  vendor_id           text,
  vendor_name         text,
  title               text not null,
  content             text,
  amount              numeric default 0,
  status              text default 'draft'
                        check (status in ('draft','sent','signed_couple','signed_vendor','completed','rejected')),
  signed_by_vendor    boolean default false,
  signed_by_couple    boolean default false,
  signed_couple_name  text,
  signed_couple_date  date,
  sent_at             timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- GIFT LIST  (ønskeliste)
-- ────────────────────────────────────────────────────────────
create table if not exists gifts (
  id            text primary key default 'gift_' || gen_random_uuid()::text,
  wedding_id    text not null references weddings(id) on delete cascade,
  name          text not null,
  description   text,
  url           text,
  price         numeric,
  reserved_by   text,
  reserved_at   timestamptz,
  fulfilled     boolean default false,
  sort_order    int default 0,
  created_at    timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- PHOTOS  (bildedeling)
-- ────────────────────────────────────────────────────────────
create table if not exists photos (
  id            text primary key default 'p_' || gen_random_uuid()::text,
  wedding_id    text not null references weddings(id) on delete cascade,
  url           text not null,
  caption       text,
  uploaded_by   text,
  uploaded_at   timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- SONG REQUESTS  (musikk­ønsker)
-- ────────────────────────────────────────────────────────────
create table if not exists songs (
  id          text primary key default 's_' || gen_random_uuid()::text,
  wedding_id  text not null references weddings(id) on delete cascade,
  title       text not null,
  artist      text,
  requested_by text,
  created_at  timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- GUESTBOOK  (gjestebok)
-- ────────────────────────────────────────────────────────────
create table if not exists guestbook (
  id          text primary key default 'gb_' || gen_random_uuid()::text,
  wedding_id  text not null references weddings(id) on delete cascade,
  name        text not null,
  message     text not null,
  emoji       text default '✨',
  created_at  timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- BOOKINGS  (transport, shuttlebuss, overnatting o.l.)
-- ────────────────────────────────────────────────────────────
create table if not exists bookings (
  id          text primary key default 'bk_' || gen_random_uuid()::text,
  wedding_id  text not null references weddings(id) on delete cascade,
  icon        text default '🎟',
  name        text not null,
  description text,
  price       text default 'Gratis',
  slots       int default 20,
  taken       int default 0,
  created_at  timestamptz default now()
);

create table if not exists booking_registrations (
  id          text primary key default 'br_' || gen_random_uuid()::text,
  booking_id  text not null references bookings(id) on delete cascade,
  guest_name  text not null,
  guest_id    text,
  created_at  timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- SEATING TABLES  (bordplan)
-- ────────────────────────────────────────────────────────────
create table if not exists seating_tables (
  id          text primary key default 'st_' || gen_random_uuid()::text,
  wedding_id  text not null references weddings(id) on delete cascade,
  number      int not null,
  name        text,
  capacity    int default 8,
  shape       text default 'round' check (shape in ('round','rect')),
  pos_x       numeric default 100,
  pos_y       numeric default 100,
  created_at  timestamptz default now()
);


-- ════════════════════════════════════════════════════════════
-- UPDATED_AT trigger (auto-oppdatering)
-- ════════════════════════════════════════════════════════════
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger weddings_updated_at  before update on weddings  for each row execute function set_updated_at();
create trigger tasks_updated_at     before update on tasks     for each row execute function set_updated_at();
create trigger guests_updated_at    before update on guests    for each row execute function set_updated_at();
create trigger budget_updated_at    before update on budget    for each row execute function set_updated_at();
create trigger vendors_updated_at   before update on vendors   for each row execute function set_updated_at();
create trigger contracts_updated_at before update on contracts for each row execute function set_updated_at();


-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (aktiver etter at backend er klar)
-- ════════════════════════════════════════════════════════════
-- alter table weddings   enable row level security;
-- alter table tasks      enable row level security;
-- alter table guests     enable row level security;
-- alter table budget     enable row level security;
-- alter table vendors    enable row level security;
-- alter table contracts  enable row level security;
-- alter table gifts      enable row level security;
-- alter table photos     enable row level security;
-- alter table songs      enable row level security;
-- alter table guestbook  enable row level security;
-- alter table bookings   enable row level security;
