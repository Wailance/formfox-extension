create table if not exists public.resume_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_payments (
  payment_id text primary key,
  user_id uuid not null references public.resume_credits(user_id) on delete cascade,
  pack_key text not null,
  credits_added integer not null,
  amount_rub numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists resume_payments_user_id_idx on public.resume_payments(user_id);

