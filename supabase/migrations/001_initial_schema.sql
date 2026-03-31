-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique not null,
  stripe_price_id text not null,
  status text not null default 'active'
    check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ============================================================
-- CONVERSIONS
-- ============================================================
create table public.conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_url text not null,
  extracted_data jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

alter table public.conversions enable row level security;

create policy "Users can read own conversions"
  on public.conversions for select
  using (auth.uid() = user_id);

create policy "Users can insert own conversions"
  on public.conversions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversions"
  on public.conversions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
insert into storage.buckets (id, name, public)
values ('conversion-images', 'conversion-images', false);

create policy "Users can upload their own images"
  on storage.objects for insert
  with check (
    bucket_id = 'conversion-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read their own images"
  on storage.objects for select
  using (
    bucket_id = 'conversion-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- HELPER: count conversions this month
-- ============================================================
create or replace function public.conversions_this_month(uid uuid)
returns integer as $$
  select count(*)::integer
  from public.conversions
  where user_id = uid
    and status = 'completed'
    and created_at >= date_trunc('month', now());
$$ language sql security definer stable;
