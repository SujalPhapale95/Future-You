-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CONTRACTS TABLE
create table if not exists public.contracts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  body text not null,
  category text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for contracts
alter table public.contracts enable row level security;

create policy "Users can view their own contracts"
on public.contracts for select
using (auth.uid() = user_id);

create policy "Users can insert their own contracts"
on public.contracts for insert
with check (auth.uid() = user_id);

create policy "Users can update their own contracts"
on public.contracts for update
using (auth.uid() = user_id);

create policy "Users can delete their own contracts"
on public.contracts for delete
using (auth.uid() = user_id);


-- 2. CONDITIONS TABLE
create table if not exists public.conditions (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  type text not null,
  value text not null,
  is_recurring boolean default true not null
);

-- RLS for conditions
alter table public.conditions enable row level security;

create policy "Users can view conditions of their contracts"
on public.conditions for select
using (
  exists (
    select 1 from public.contracts
    where contracts.id = conditions.contract_id
    and contracts.user_id = auth.uid()
  )
);

create policy "Users can insert conditions for their contracts"
on public.conditions for insert
with check (
  exists (
    select 1 from public.contracts
    where contracts.id = conditions.contract_id
    and contracts.user_id = auth.uid()
  )
);

create policy "Users can delete conditions of their contracts"
on public.conditions for delete
using (
  exists (
    select 1 from public.contracts
    where contracts.id = conditions.contract_id
    and contracts.user_id = auth.uid()
  )
);


-- 3. PUSH SUBSCRIPTIONS TABLE
create table if not exists public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  subscription jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- RLS for push_subscriptions
alter table public.push_subscriptions enable row level security;

create policy "Users can view their own subscription"
on public.push_subscriptions for select
using (auth.uid() = user_id);

create policy "Users can insert their own subscription"
on public.push_subscriptions for insert
with check (auth.uid() = user_id);

create policy "Users can update their own subscription"
on public.push_subscriptions for update
using (auth.uid() = user_id);


-- 4. REMINDERS TABLE
create table if not exists public.reminders (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  triggered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  response text,
  responded_at timestamp with time zone
);

-- RLS for reminders
alter table public.reminders enable row level security;

create policy "Users can view their own reminders"
on public.reminders for select
using (auth.uid() = user_id);

create policy "Users can insert their own reminders"
on public.reminders for insert
with check (auth.uid() = user_id);
