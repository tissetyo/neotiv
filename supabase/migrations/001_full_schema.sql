-- ============================================================
-- NEOTIV PLATFORM — FULL SCHEMA MIGRATION + SEED DATA
-- Run this in Supabase SQL Editor (fresh start)
-- ============================================================

-- ─── CLEANUP (safe to re-run) ───────────────────────────────
drop table if exists chat_messages   cascade;
drop table if exists notifications   cascade;
drop table if exists alarms          cascade;
drop table if exists guest_sessions  cascade;
drop table if exists deals           cascade;
drop table if exists hotel_services  cascade;
drop table if exists rooms           cascade;
drop table if exists room_types      cascade;
drop table if exists users           cascade;
drop table if exists hotels          cascade;
drop table if exists organizations   cascade;

drop type if exists room_status      cascade;
drop type if exists user_role        cascade;
drop type if exists service_category cascade;
drop type if exists sender_role      cascade;
drop type if exists hotel_status     cascade;

-- ─── ENUMS ──────────────────────────────────────────────────
create type room_status      as enum ('available', 'occupied', 'maintenance');
create type user_role        as enum ('super_admin', 'hotel_manager', 'front_office');
create type service_category as enum ('food', 'transport', 'spa', 'laundry', 'other');
create type sender_role      as enum ('guest', 'front_office');
create type hotel_status     as enum ('active', 'setup_pending');

-- ─── ORGANIZATIONS ──────────────────────────────────────────
create table organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── HOTELS ─────────────────────────────────────────────────
create table hotels (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  address         text,
  timezone        text not null default 'Asia/Jakarta',
  logo_url        text,
  status          hotel_status not null default 'active',
  deleted_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── USERS (staff profiles linked to auth.users) ────────────
create table users (
  id              uuid primary key default gen_random_uuid(),
  auth_id         uuid not null unique references auth.users(id) on delete cascade,
  email           text not null,
  first_name      text not null default '',
  last_name       text not null default '',
  role            user_role not null default 'front_office',
  organization_id uuid references organizations(id) on delete set null,
  hotel_id        uuid references hotels(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── ROOM TYPES ─────────────────────────────────────────────
create table room_types (
  id          uuid primary key default gen_random_uuid(),
  hotel_id    uuid not null references hotels(id) on delete cascade,
  name        text not null,
  description text,
  base_price  numeric(10,2) not null default 0,
  capacity    int not null default 2,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── ROOMS ──────────────────────────────────────────────────
create table rooms (
  id           uuid primary key default gen_random_uuid(),
  hotel_id     uuid not null references hotels(id) on delete cascade,
  room_type_id uuid not null references room_types(id) on delete restrict,
  number       text not null,
  floor        int not null default 1,
  status       room_status not null default 'available',
  deleted_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (hotel_id, number)
);

-- ─── GUEST SESSIONS ─────────────────────────────────────────
create table guest_sessions (
  id                uuid primary key default gen_random_uuid(),
  room_id           uuid not null references rooms(id) on delete cascade,
  guest_name        text not null,
  guest_photo_url   text,
  tv_background_url text,
  check_in          timestamptz not null default now(),
  check_out         timestamptz,
  session_token     text not null unique default gen_random_uuid()::text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ─── CHAT MESSAGES ──────────────────────────────────────────
create table chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references guest_sessions(id) on delete cascade,
  sender_role sender_role not null,
  content     text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ─── NOTIFICATIONS ──────────────────────────────────────────
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid references guest_sessions(id) on delete cascade,
  hotel_id   uuid references hotels(id) on delete cascade,
  title      text not null,
  body       text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

-- ─── ALARMS ─────────────────────────────────────────────────
create table alarms (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references guest_sessions(id) on delete cascade,
  scheduled_at timestamptz not null,
  note         text,
  is_active    boolean not null default true,
  acknowledged boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── DEALS ──────────────────────────────────────────────────
create table deals (
  id          uuid primary key default gen_random_uuid(),
  hotel_id    uuid not null references hotels(id) on delete cascade,
  title       text not null,
  description text not null default '',
  poster_url  text not null default '',
  valid_until timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── HOTEL SERVICES ─────────────────────────────────────────
create table hotel_services (
  id           uuid primary key default gen_random_uuid(),
  hotel_id     uuid not null references hotels(id) on delete cascade,
  category     service_category not null default 'other',
  name         text not null,
  description  text,
  icon_url     text,
  is_available boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── INDEXES ────────────────────────────────────────────────
create index on hotels           (organization_id);
create index on users            (auth_id);
create index on users            (hotel_id);
create index on users            (organization_id);
create index on rooms            (hotel_id);
create index on rooms            (status);
create index on guest_sessions   (room_id, is_active);
create index on chat_messages    (session_id, created_at);
create index on notifications    (session_id);
create index on notifications    (hotel_id);
create index on alarms           (session_id, is_active);
create index on deals            (hotel_id);
create index on hotel_services   (hotel_id);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_organizations_updated_at   before update on organizations   for each row execute function update_updated_at();
create trigger trg_hotels_updated_at          before update on hotels          for each row execute function update_updated_at();
create trigger trg_users_updated_at           before update on users           for each row execute function update_updated_at();
create trigger trg_room_types_updated_at      before update on room_types      for each row execute function update_updated_at();
create trigger trg_rooms_updated_at           before update on rooms           for each row execute function update_updated_at();
create trigger trg_guest_sessions_updated_at  before update on guest_sessions  for each row execute function update_updated_at();
create trigger trg_alarms_updated_at          before update on alarms          for each row execute function update_updated_at();
create trigger trg_deals_updated_at           before update on deals           for each row execute function update_updated_at();
create trigger trg_hotel_services_updated_at  before update on hotel_services  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table organizations  enable row level security;
alter table hotels         enable row level security;
alter table users          enable row level security;
alter table room_types     enable row level security;
alter table rooms          enable row level security;
alter table guest_sessions enable row level security;
alter table chat_messages  enable row level security;
alter table notifications  enable row level security;
alter table alarms         enable row level security;
alter table deals          enable row level security;
alter table hotel_services enable row level security;

-- Helper: get the current user's profile row
create or replace function get_my_profile()
returns users language sql security definer stable as $$
  select * from users where auth_id = auth.uid() limit 1;
$$;

-- ─── organizations ──────────────────────────────────────────
-- Authenticated staff can read their own org
create policy "org: authenticated read own"
  on organizations for select
  to authenticated
  using (
    id = (get_my_profile()).organization_id
  );

-- ─── hotels ─────────────────────────────────────────────────
-- TV Dashboard (anon) can read all hotels — needed for /[hotelId]/[roomNumber]
create policy "hotel: anon read"
  on hotels for select
  to anon
  using (deleted_at is null);

-- Authenticated users can read hotels in their org
create policy "hotel: authenticated read own org"
  on hotels for select
  to authenticated
  using (
    deleted_at is null
    and (
      organization_id = (get_my_profile()).organization_id
      or (get_my_profile()).role = 'super_admin'
    )
  );

-- Hotel managers and super admins can insert/update
create policy "hotel: manager insert"
  on hotels for insert
  to authenticated
  with check (
    (get_my_profile()).role in ('super_admin', 'hotel_manager')
    and organization_id = (get_my_profile()).organization_id
  );

create policy "hotel: manager update"
  on hotels for update
  to authenticated
  using (
    (get_my_profile()).role in ('super_admin', 'hotel_manager')
    and organization_id = (get_my_profile()).organization_id
  );

-- ─── users ──────────────────────────────────────────────────
-- Users can read their own profile
create policy "user: read own"
  on users for select
  to authenticated
  using (auth_id = auth.uid());

-- Super admins and hotel managers can read all users in their org
create policy "user: manager read org"
  on users for select
  to authenticated
  using (
    (get_my_profile()).role in ('super_admin', 'hotel_manager')
    and (
      organization_id = (get_my_profile()).organization_id
      or (get_my_profile()).role = 'super_admin'
    )
  );

-- Only super_admins can insert/update users
create policy "user: super admin write"
  on users for all
  to authenticated
  using ((get_my_profile()).role = 'super_admin')
  with check ((get_my_profile()).role = 'super_admin');

-- ─── room_types ─────────────────────────────────────────────
create policy "room_type: anon read"
  on room_types for select
  to anon using (true);

create policy "room_type: authenticated read"
  on room_types for select
  to authenticated using (true);

create policy "room_type: manager write"
  on room_types for all
  to authenticated
  using ((get_my_profile()).role in ('super_admin', 'hotel_manager'))
  with check ((get_my_profile()).role in ('super_admin', 'hotel_manager'));

-- ─── rooms ──────────────────────────────────────────────────
create policy "room: anon read"
  on rooms for select
  to anon using (deleted_at is null);

create policy "room: authenticated read"
  on rooms for select
  to authenticated using (deleted_at is null);

create policy "room: staff write"
  on rooms for all
  to authenticated
  using ((get_my_profile()).role in ('super_admin', 'hotel_manager', 'front_office'))
  with check ((get_my_profile()).role in ('super_admin', 'hotel_manager', 'front_office'));

-- ─── guest_sessions ─────────────────────────────────────────
create policy "session: anon read"
  on guest_sessions for select
  to anon using (true);

create policy "session: authenticated read"
  on guest_sessions for select
  to authenticated using (true);

create policy "session: staff write"
  on guest_sessions for all
  to authenticated
  using ((get_my_profile()).role in ('super_admin', 'hotel_manager', 'front_office'))
  with check ((get_my_profile()).role in ('super_admin', 'hotel_manager', 'front_office'));

-- ─── chat_messages ──────────────────────────────────────────
create policy "chat: anon read"
  on chat_messages for select
  to anon using (true);

create policy "chat: anon insert (guest)"
  on chat_messages for insert
  to anon
  with check (sender_role = 'guest');

create policy "chat: authenticated read"
  on chat_messages for select
  to authenticated using (true);

create policy "chat: staff insert"
  on chat_messages for insert
  to authenticated
  with check (sender_role = 'front_office');

-- ─── notifications ──────────────────────────────────────────
create policy "notif: anon read"
  on notifications for select
  to anon using (true);

create policy "notif: authenticated read"
  on notifications for select
  to authenticated using (true);

create policy "notif: staff write"
  on notifications for all
  to authenticated
  using ((get_my_profile()).role in ('super_admin', 'hotel_manager', 'front_office'))
  with check ((get_my_profile()).role in ('super_admin', 'hotel_manager', 'front_office'));

-- ─── alarms ─────────────────────────────────────────────────
create policy "alarm: anon read"
  on alarms for select
  to anon using (true);

create policy "alarm: anon write (guest sets alarm)"
  on alarms for insert
  to anon with check (true);

create policy "alarm: anon update (acknowledge)"
  on alarms for update
  to anon using (true);

create policy "alarm: authenticated all"
  on alarms for all
  to authenticated using (true) with check (true);

-- ─── deals ──────────────────────────────────────────────────
create policy "deal: anon read"
  on deals for select
  to anon using (true);

create policy "deal: authenticated read"
  on deals for select
  to authenticated using (true);

create policy "deal: manager write"
  on deals for all
  to authenticated
  using ((get_my_profile()).role in ('super_admin', 'hotel_manager'))
  with check ((get_my_profile()).role in ('super_admin', 'hotel_manager'));

-- ─── hotel_services ─────────────────────────────────────────
create policy "service: anon read"
  on hotel_services for select
  to anon using (true);

create policy "service: authenticated read"
  on hotel_services for select
  to authenticated using (true);

create policy "service: staff toggle"
  on hotel_services for update
  to authenticated
  using ((get_my_profile()).role in ('super_admin', 'hotel_manager', 'front_office'));

create policy "service: manager write"
  on hotel_services for insert
  to authenticated
  with check ((get_my_profile()).role in ('super_admin', 'hotel_manager'));

create policy "service: manager delete"
  on hotel_services for delete
  to authenticated
  using ((get_my_profile()).role in ('super_admin', 'hotel_manager'));

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table alarms;
alter publication supabase_realtime add table guest_sessions;
alter publication supabase_realtime add table hotel_services;

-- ============================================================
-- SEED DATA
-- ============================================================

-- 1. Organization
insert into organizations (id, name, slug) values
  ('00000000-0000-0000-0000-000000000001', 'Merah Putih Hospitality Group', 'merah-putih-group');

-- 2. Hotel
insert into hotels (id, organization_id, name, address, timezone, status) values
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Hotel Merah Putih',
    'Jl. Sudirman No. 1, Jakarta Pusat, DKI Jakarta 10220',
    'Asia/Jakarta',
    'active'
  );

-- 3. User profile for hotelmerahputih@gmail.com
--    auth_id matches the Supabase Auth UUID from the JWT above
insert into users (auth_id, email, first_name, last_name, role, organization_id, hotel_id) values
  (
    'bc05e7fd-cdff-4884-ac1c-f9e4e28c5e46',
    'hotelmerahputih@gmail.com',
    'Hotel',
    'Merah Putih',
    'hotel_manager',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002'
  );

-- 4. Room Types
insert into room_types (id, hotel_id, name, description, base_price, capacity) values
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000002', 'Standard Room',    'Comfortable room with modern amenities',            450000,  2),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000002', 'Deluxe Room',      'Spacious room with city view and premium furniture', 750000,  2),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000002', 'Junior Suite',     'Separate living area with lounge and kitchenette',  1200000, 3),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000002', 'Presidential Suite','Top-floor luxury with panoramic Jakarta views',    2500000, 4);

-- 5. Rooms (Floor 1–3, 4 rooms per floor = 12 rooms)
insert into rooms (id, hotel_id, room_type_id, number, floor, status) values
  -- Floor 1
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000001', '101', 1, 'available'),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000001', '102', 1, 'occupied'),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000002', '103', 1, 'available'),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000001', '104', 1, 'maintenance'),
  -- Floor 2
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000002', '201', 2, 'occupied'),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000002', '202', 2, 'available'),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000003', '203', 2, 'available'),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000002', '204', 2, 'occupied'),
  -- Floor 3
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000003', '301', 3, 'available'),
  ('00000000-0000-0000-0002-000000000010', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000003', '302', 3, 'available'),
  ('00000000-0000-0000-0002-000000000011', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000004', '303', 3, 'occupied'),
  ('00000000-0000-0000-0002-000000000012', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000004', '304', 3, 'available');

-- 6. Guest Sessions (for occupied rooms)
insert into guest_sessions (id, room_id, guest_name, tv_background_url, check_in, check_out, is_active) values
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0002-000000000002', -- Room 102
    'Budi Santoso',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    now() - interval '2 days',
    now() + interval '3 days',
    true
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0002-000000000005', -- Room 201
    'Siti Rahayu',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
    now() - interval '1 day',
    now() + interval '5 days',
    true
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    '00000000-0000-0000-0002-000000000008', -- Room 204
    'Ahmad Wijaya',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80',
    now() - interval '3 days',
    now() + interval '1 day',
    true
  ),
  (
    '00000000-0000-0000-0003-000000000004',
    '00000000-0000-0000-0002-000000000011', -- Room 303
    'Maria Sukma',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80',
    now() - interval '4 hours',
    now() + interval '7 days',
    true
  );

-- 7. Sample Chat Messages
insert into chat_messages (session_id, sender_role, content, created_at) values
  ('00000000-0000-0000-0003-000000000001', 'guest',        'Hello! Can I get extra towels please?',         now() - interval '30 minutes'),
  ('00000000-0000-0000-0003-000000000001', 'front_office', 'Of course! We will send them right away.',       now() - interval '28 minutes'),
  ('00000000-0000-0000-0003-000000000001', 'guest',        'Thank you!',                                     now() - interval '25 minutes'),
  ('00000000-0000-0000-0003-000000000002', 'guest',        'What time does the restaurant open?',            now() - interval '1 hour'),
  ('00000000-0000-0000-0003-000000000002', 'front_office', 'Our restaurant opens at 06:30 for breakfast.',   now() - interval '58 minutes');

-- 8. Sample Notifications
insert into notifications (session_id, hotel_id, title, body) values
  ('00000000-0000-0000-0003-000000000001', null,                                         'Room Service Delivered', 'Your towels and amenities have been delivered to Room 102.'),
  (null,                                   '00000000-0000-0000-0000-000000000002',        'Pool Hours Update',      'The rooftop pool is open 07:00–22:00 today. Enjoy!'),
  ('00000000-0000-0000-0003-000000000002', null,                                         'Welcome Gift',           'A welcome fruit basket has been placed in your room. Enjoy your stay!');

-- 9. Sample Alarms
insert into alarms (session_id, scheduled_at, note, is_active, acknowledged) values
  ('00000000-0000-0000-0003-000000000001', now() + interval '6 hours',  'Early checkout reminder',  true, false),
  ('00000000-0000-0000-0003-000000000002', now() + interval '8 hours',  'Airport transfer pickup',  true, false);

-- 10. Hotel Services
insert into hotel_services (hotel_id, category, name, description, is_available) values
  ('00000000-0000-0000-0000-000000000002', 'food',      'Room Dining',          'Order food and beverages directly to your room, available 24 hours.',  true),
  ('00000000-0000-0000-0000-000000000002', 'food',      'Restaurant',           'Our main restaurant serves Indonesian and international cuisine.',      true),
  ('00000000-0000-0000-0000-000000000002', 'spa',       'Spa & Wellness',       'Rejuvenate with our full range of massage and beauty treatments.',      true),
  ('00000000-0000-0000-0000-000000000002', 'transport', 'Airport Transfer',     'Comfortable car transfer to and from Soekarno–Hatta Airport.',         true),
  ('00000000-0000-0000-0000-000000000002', 'transport', 'City Car Rental',      'Premium vehicles with driver for city tours or business trips.',        true),
  ('00000000-0000-0000-0000-000000000002', 'laundry',   'Laundry & Dry Cleaning','Same-day laundry service. Drop off before 10:00 AM.',                 true),
  ('00000000-0000-0000-0000-000000000002', 'other',     'Rooftop Pool',         'Our heated rooftop pool is open daily 07:00–22:00.',                   true),
  ('00000000-0000-0000-0000-000000000002', 'other',     'Business Center',      'Fully equipped meeting rooms and high-speed internet access.',          true);

-- 11. Deals
insert into deals (hotel_id, title, description, poster_url, valid_until) values
  (
    '00000000-0000-0000-0000-000000000002',
    'Weekend Getaway Package',
    'Stay 2 nights, get the 3rd night free. Includes breakfast for 2, spa voucher, and late checkout until 2 PM.',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    now() + interval '30 days'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Business Traveler Special',
    'Enjoy 20% off room rates on weekday stays. Includes complimentary airport transfer and express laundry.',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    now() + interval '60 days'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Spa & Dine Experience',
    'Romantic dinner for 2 at our rooftop restaurant plus 60-minute couple spa treatment.',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    now() + interval '14 days'
  );

-- ============================================================
-- VERIFICATION QUERIES (run separately to confirm)
-- ============================================================
-- select count(*) from organizations;   -- should be 1
-- select count(*) from hotels;          -- should be 1
-- select count(*) from users;           -- should be 1
-- select count(*) from rooms;           -- should be 12
-- select count(*) from guest_sessions;  -- should be 4
-- select count(*) from hotel_services;  -- should be 8
-- select count(*) from deals;           -- should be 3
