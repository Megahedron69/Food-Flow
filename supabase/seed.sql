-- ============================================================
-- LOCAL DEVELOPMENT SEED — deterministic test users
-- ============================================================
-- DO NOT COMMIT REAL SECRETS. This file is for local dev only.
--
-- Test credentials:
--
--  Role            | Email / Outlet Code      | Password / PIN
-- -----------------+--------------------------+---------------
--  Platform Admin  | platform@foodflow.dev    | Admin@1234
--  Owner           | owner@demo.dev           | Owner@1234
--  Manager         | manager@demo.dev         | Mgr@12345
--  Staff POS       | Outlet: DEMO01, PIN 1234 | —
--  Staff KDS       | Outlet: DEMO01, PIN 5678 | —
-- ============================================================

-- ── Fixed UUIDs (stable across resets) ───────────────────────
-- tenant
-- a0000000-0000-0000-0000-000000000001
-- outlet
-- b0000000-0000-0000-0000-000000000001
-- auth user: platform admin
-- c0000000-0000-0000-0000-000000000001
-- auth user: owner
-- c0000000-0000-0000-0000-000000000002
-- auth user: manager
-- c0000000-0000-0000-0000-000000000003
-- auth user: staff POS
-- c0000000-0000-0000-0000-000000000004
-- auth user: staff KDS
-- c0000000-0000-0000-0000-000000000005

-- ── 1. Auth users ─────────────────────────────────────────────
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
values
  -- platform admin
  (
    'c0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'platform@foodflow.dev',
    crypt('Admin@1234', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Platform Admin"}',
    false, '', '', '', ''
  ),
  -- owner
  (
    'c0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'owner@demo.dev',
    crypt('Owner@1234', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo Owner"}',
    false, '', '', '', ''
  ),
  -- manager
  (
    'c0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'manager@demo.dev',
    crypt('Mgr@12345', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo Manager"}',
    false, '', '', '', ''
  ),
  -- staff POS (no password — PIN auth only)
  (
    'c0000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'staff.pos@demo.dev',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Counter Staff"}',
    false, '', '', '', ''
  ),
  -- staff KDS (no password — PIN auth only)
  (
    'c0000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'staff.kds@demo.dev',
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Kitchen Staff"}',
    false, '', '', '', ''
  )
on conflict (id) do nothing;

-- ── 2. Tenant ─────────────────────────────────────────────────
insert into public.tenants (id, name, slug, plan)
values (
  'a0000000-0000-0000-0000-000000000001',
  'Demo Restaurant', 'demo-restaurant', 'starter'
)
on conflict (id) do nothing;

-- ── 3. Outlet ─────────────────────────────────────────────────
insert into public.outlets (id, tenant_id, name, code, address)
values (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Main Branch', 'DEMO01', '1 Demo Street, Bengaluru'
)
on conflict (id) do nothing;

-- ── 4. Profiles ───────────────────────────────────────────────
insert into public.profiles (id, tenant_id, outlet_id, role, assigned_mode, full_name, email, pin_hash, is_active)
values
  -- platform admin (no tenant)
  (
    'c0000000-0000-0000-0000-000000000001',
    null, null,
    'platform_admin', null,
    'Platform Admin', 'platform@foodflow.dev',
    null, true
  ),
  -- owner
  (
    'c0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    null,
    'owner', null,
    'Demo Owner', 'owner@demo.dev',
    null, true
  ),
  -- manager
  (
    'c0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'manager', null,
    'Demo Manager', 'manager@demo.dev',
    null, true
  ),
  -- staff POS — PIN 1234
  (
    'c0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'staff', 'pos',
    'Counter Staff', 'staff.pos@demo.dev',
    'pbkdf2$210000$qrvM3e7_ABEiM0RVZneImQ$NP7cRGmEm0pM5cX_Po7cmNq0FmL1VJOnh6qMk4Ws984',
    true
  ),
  -- staff KDS — PIN 5678
  (
    'c0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'staff', 'kds',
    'Kitchen Staff', 'staff.kds@demo.dev',
    'pbkdf2$210000$mYh3ZlVEMyIRAP_u3cy7qg$v7Pv-ixigwokCIg7FH7FVc5rV1REUtt_JAFmwc27CQc',
    true
  )
on conflict (id) do nothing;

