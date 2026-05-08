create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('owner', 'manager', 'staff', 'platform_admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'assigned_mode') then
    create type public.assigned_mode as enum ('pos', 'kds');
  end if;
end;
$$;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'starter',
  created_at timestamptz not null default now()
);

create table if not exists public.outlets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  code text not null unique,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  outlet_id uuid references public.outlets(id) on delete set null,
  role public.user_role not null,
  assigned_mode public.assigned_mode,
  full_name text not null,
  email text,
  pin_hash text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint profiles_staff_mode_required check (
    (role <> 'staff' and assigned_mode is null and pin_hash is null)
    or (role = 'staff' and assigned_mode is not null and pin_hash is not null)
  )
);

create table if not exists public.staff_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  session_token_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  last_seen_at timestamptz
);

create unique index if not exists profiles_staff_outlet_pin_hash_uniq
  on public.profiles(outlet_id, pin_hash)
  where role = 'staff' and is_active = true;

create unique index if not exists staff_sessions_token_hash_uniq
  on public.staff_sessions(session_token_hash)
  where revoked_at is null;

create index if not exists profiles_tenant_role_idx on public.profiles(tenant_id, role);
create index if not exists profiles_outlet_role_idx on public.profiles(outlet_id, role);
create index if not exists outlets_tenant_idx on public.outlets(tenant_id);
create index if not exists staff_sessions_profile_idx on public.staff_sessions(profile_id);

create schema if not exists app_private;

create or replace function app_private.current_profile()
returns public.profiles
language sql
stable
security definer
set search_path = public
as $$
  select p.*
  from public.profiles p
  where p.id = auth.uid()
    and p.is_active = true
  limit 1;
$$;

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select (app_private.current_profile()).role;
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select (app_private.current_profile()).tenant_id;
$$;

create or replace function public.current_outlet_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select (app_private.current_profile()).outlet_id;
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() = 'platform_admin', false);
$$;

create or replace function public.can_manage_staff(target_outlet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when public.is_platform_admin() then true
    when public.current_role() = 'owner' then exists (
      select 1
      from public.outlets o
      where o.id = target_outlet_id
        and o.tenant_id = public.current_tenant_id()
    )
    when public.current_role() = 'manager' then public.current_outlet_id() = target_outlet_id
    else false
  end;
$$;

alter table public.tenants enable row level security;
alter table public.outlets enable row level security;
alter table public.profiles enable row level security;
alter table public.staff_sessions enable row level security;

create policy tenants_select_policy on public.tenants
for select
using (
  public.is_platform_admin()
  or id = public.current_tenant_id()
);

create policy outlets_select_policy on public.outlets
for select
using (
  public.is_platform_admin()
  or (
    tenant_id = public.current_tenant_id()
    and (
      public.current_role() = 'owner'
      or id = public.current_outlet_id()
    )
  )
);

create policy profiles_select_policy on public.profiles
for select
using (
  public.is_platform_admin()
  or (
    tenant_id = public.current_tenant_id()
    and (
      public.current_role() = 'owner'
      or id = auth.uid()
      or (
        public.current_role() = 'manager'
        and outlet_id = public.current_outlet_id()
      )
    )
  )
);

create policy profiles_update_self_policy on public.profiles
for update
using (
  id = auth.uid()
  or public.is_platform_admin()
)
with check (
  id = auth.uid()
  or public.is_platform_admin()
);

create policy staff_sessions_select_policy on public.staff_sessions
for select
using (
  public.is_platform_admin()
  or (
    tenant_id = public.current_tenant_id()
    and (
      public.current_role() = 'owner'
      or (
        public.current_role() = 'manager'
        and outlet_id = public.current_outlet_id()
      )
      or profile_id = auth.uid()
    )
  )
);

revoke all on function app_private.current_profile() from public, anon, authenticated;
grant execute on function public.current_role() to authenticated;
grant execute on function public.current_tenant_id() to authenticated;
grant execute on function public.current_outlet_id() to authenticated;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.can_manage_staff(uuid) to authenticated;
