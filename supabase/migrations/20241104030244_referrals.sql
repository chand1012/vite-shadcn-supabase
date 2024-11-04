-- referral code table
-- id - serial primary key
-- code - text unique not null
-- user_id - uuid references auth.users not null
-- created_at - timestamp with time zone default now()

create table referral_codes (
  id serial primary key,
  code text unique not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table referral_codes enable row level security;
-- users can read referral codes if they are the owner
create policy "Can view own referral codes." on referral_codes for select using (auth.uid() = user_id);

-- need a table for redemptions. referral_redemptions
-- id - serial primary key
-- referral_code_id - integer references referral_codes not null
-- redeemed_by - uuid references auth.users not null
-- created_at - timestamp with time zone default now()

create table referral_redemptions (
  id serial primary key,
  referral_code_id integer references referral_codes not null,
  redeemed_by uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table referral_redemptions enable row level security;
