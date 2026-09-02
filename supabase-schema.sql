-- ============================================================
-- PORTFÓLIO DO LUCAS — SUPABASE DATABASE
-- Fonte única de verdade: Postgres + Storage + Auth
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.portfolio_settings (
  id text primary key default 'settings_default_01',
  owner_id uuid references auth.users(id) on delete cascade,
  portfolio_name text not null default 'Portfólio Autoral',
  tagline text not null default '',
  about_title text not null default 'Sobre',
  about_text text not null default '',
  short_bio text not null default '',
  profile_image text,
  whatsapp text not null default '',
  email_public text not null default '',
  location text not null default '',
  social_links jsonb not null default '[]'::jsonb,
  ux_voice jsonb not null default '{}'::jsonb,
  theme_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key default ('cat_' || replace(gen_random_uuid()::text, '-', '')),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key default ('proj_' || replace(gen_random_uuid()::text, '-', '')),
  owner_id uuid references auth.users(id) on delete cascade,
  category_id text references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  cover_image text,
  year text default extract(year from current_date)::text,
  status text not null default 'published' check (status in ('draft', 'published')),
  featured boolean not null default false,
  display_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_blocks (
  id text primary key default ('blk_' || replace(gen_random_uuid()::text, '-', '')),
  project_id text not null references public.projects(id) on delete cascade,
  type text not null check (type in ('text', 'image', 'youtube', 'audio')),
  content text,
  media_url text,
  alt_text text,
  caption text,
  transcript text,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_owner on public.categories(owner_id);
create index if not exists idx_categories_order on public.categories(display_order);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_projects_owner on public.projects(owner_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_category on public.projects(category_id);
create index if not exists idx_projects_order on public.projects(display_order);
create index if not exists idx_project_blocks_project on public.project_blocks(project_id);
create index if not exists idx_project_blocks_order on public.project_blocks(display_order);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_portfolio_settings_updated on public.portfolio_settings;
create trigger trg_portfolio_settings_updated before update on public.portfolio_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
for each row execute function public.set_updated_at();

alter table public.portfolio_settings enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_blocks enable row level security;

drop policy if exists "Public Read Settings" on public.portfolio_settings;
drop policy if exists "Owner Manage Settings" on public.portfolio_settings;
drop policy if exists "Public Read Categories" on public.categories;
drop policy if exists "Owner Manage Categories" on public.categories;
drop policy if exists "Public Read Published Projects" on public.projects;
drop policy if exists "Owner Manage Projects" on public.projects;
drop policy if exists "Public Read Blocks For Published Projects" on public.project_blocks;
drop policy if exists "Owner Manage Blocks" on public.project_blocks;
drop policy if exists "settings_public_read" on public.portfolio_settings;
drop policy if exists "settings_owner_write" on public.portfolio_settings;
drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "categories_owner_write" on public.categories;
drop policy if exists "projects_public_read" on public.projects;
drop policy if exists "projects_owner_write" on public.projects;
drop policy if exists "blocks_public_read" on public.project_blocks;
drop policy if exists "blocks_owner_write" on public.project_blocks;

create policy "settings_public_read" on public.portfolio_settings
for select to anon, authenticated using (true);

create policy "settings_owner_write" on public.portfolio_settings
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "categories_public_read" on public.categories
for select to anon, authenticated using (true);

create policy "categories_owner_write" on public.categories
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "projects_public_read" on public.projects
for select to anon, authenticated using (status = 'published' or auth.uid() = owner_id);

create policy "projects_owner_write" on public.projects
for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "blocks_public_read" on public.project_blocks
for select to anon, authenticated using (
  exists (select 1 from public.projects p where p.id = project_blocks.project_id
    and (p.status = 'published' or auth.uid() = p.owner_id))
);

create policy "blocks_owner_write" on public.project_blocks
for all to authenticated using (
  exists (select 1 from public.projects p where p.id = project_blocks.project_id and p.owner_id = auth.uid())
) with check (
  exists (select 1 from public.projects p where p.id = project_blocks.project_id and p.owner_id = auth.uid())
);

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Read Media" on storage.objects;
drop policy if exists "Authenticated Upload Media" on storage.objects;
drop policy if exists "Authenticated Update/Delete Media" on storage.objects;
drop policy if exists "portfolio_media_public_read" on storage.objects;
drop policy if exists "portfolio_media_owner_insert" on storage.objects;
drop policy if exists "portfolio_media_owner_update_delete" on storage.objects;

create policy "portfolio_media_public_read" on storage.objects
for select to anon, authenticated using (bucket_id = 'portfolio-media');

create policy "portfolio_media_owner_insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'portfolio-media'
  and (storage.foldername(name))[1] in ('covers', 'profile', 'uploads')
);

create policy "portfolio_media_owner_update_delete" on storage.objects
for all to authenticated
using (bucket_id = 'portfolio-media' and owner_id = auth.uid())
with check (bucket_id = 'portfolio-media' and owner_id = auth.uid());

-- ------------------------------------------------------------
-- MIGRAÇÃO DE UMA VERSÃO ANTIGA
-- ------------------------------------------------------------
-- Se você já executou uma versão anterior deste schema e existem
-- registros com owner_id nulo ou inválido, NÃO apague os dados.
-- Primeiro descubra o UUID em Authentication > Users e execute,
-- adaptando as tabelas que realmente possuem registros antigos:
--
-- update public.portfolio_settings set owner_id = 'SEU_USER_ID_AQUI' where owner_id is null;
-- update public.categories set owner_id = 'SEU_USER_ID_AQUI' where owner_id is null;
-- update public.projects set owner_id = 'SEU_USER_ID_AQUI' where owner_id is null;
--
-- Registros antigos com o texto `owner_user_01` não são UUIDs válidos.
-- Substitua esse valor pelo UUID real antes de tentar editá-los pelo CMS.
--
-- PRIMEIRO SETUP:
-- 1) Crie o usuário em Authentication > Users.
-- 2) Copie o UUID do usuário.
-- 3) Se portfolio_settings estiver vazia, execute:
-- insert into public.portfolio_settings (id, owner_id, portfolio_name)
-- values ('settings_default_01', 'SEU_USER_ID_AQUI', 'Lucas Conceição')
-- on conflict (id) do nothing;
-- ============================================================
