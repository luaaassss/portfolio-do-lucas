-- ============================================================================
-- PORTFÓLIO PESSOAL AUTORAL — SUPABASE SCHEMA & RLS SECURITY POLICIES
-- WCAG 2.2 AA Compatible • Multi-Block CMS • Dynamic Design Tokens
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: portfolio_settings
-- Armazena dados de apresentação, biografia, contatos, UX writing e design tokens
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings_default_01',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_name TEXT NOT NULL DEFAULT 'Portfólio Autoral',
  tagline TEXT DEFAULT '',
  about_title TEXT DEFAULT 'Sobre',
  about_text TEXT DEFAULT '',
  short_bio TEXT DEFAULT '',
  profile_image TEXT,
  whatsapp TEXT DEFAULT '',
  email_public TEXT DEFAULT '',
  location TEXT DEFAULT '',
  social_links JSONB DEFAULT '[]'::jsonb,
  ux_voice JSONB DEFAULT '{
    "tone": "poetic",
    "cta_project_label": "Ver projeto",
    "cta_contact_label": "Conversar no WhatsApp",
    "empty_projects_msg": "Nenhum projeto encontrado nesta categoria no momento.",
    "about_nav_label": "Sobre",
    "projects_nav_label": "Projetos",
    "contact_nav_label": "Contato"
  }'::jsonb,
  theme_config JSONB DEFAULT '{
    "color_background": "#FBF9F5",
    "color_surface": "#FFFFFF",
    "color_text_primary": "#141414",
    "color_text_secondary": "#5C5852",
    "color_primary": "#1A1816",
    "color_secondary": "#E8E4DC",
    "color_accent": "#B43E19",
    "color_border": "#E2DDD3",
    "color_focus": "#B43E19",
    "color_success": "#15803D",
    "color_warning": "#B45309",
    "color_error": "#B91C1C",
    "font_heading": "newsreader",
    "font_body": "plus-jakarta",
    "scale_ratio": "expressive",
    "base_font_size": 16,
    "line_height": 1.65,
    "border_radius": "sm",
    "border_width": 1,
    "border_style": "solid",
    "shadow_level": "none",
    "max_width_px": 1200,
    "grid_columns": 2,
    "grid_gap_px": 32,
    "card_aspect_ratio": "16/9",
    "motion_duration": "normal",
    "motion_easing": "smooth"
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE: categories
-- Categorias autorais organizadas pelo proprietário
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT ('cat_' || replace(gen_random_uuid()::text, '-', '')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE: projects
-- Projetos autorais com status, ano e metadados de compartilhamento
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT ('proj_' || replace(gen_random_uuid()::text, '-', '')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT DEFAULT '',
  cover_image TEXT,
  year TEXT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::text,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE: project_blocks
-- Sistema dinâmico e ordenável de blocos (texto, imagem com alt, vídeo YouTube, áudio com transcrição)
CREATE TABLE IF NOT EXISTS public.project_blocks (
  id TEXT PRIMARY KEY DEFAULT ('blk_' || replace(gen_random_uuid()::text, '-', '')),
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'youtube', 'audio')),
  content TEXT,
  media_url TEXT,
  alt_text TEXT,
  caption TEXT,
  transcript TEXT,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_project_blocks_project ON public.project_blocks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_blocks_order ON public.project_blocks(display_order);

-- 7. TRIGGER DE ATUALIZAÇÃO AUTOMÁTICA DE updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_portfolio_settings_updated ON public.portfolio_settings;
CREATE TRIGGER trg_portfolio_settings_updated
BEFORE UPDATE ON public.portfolio_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated ON public.projects;
CREATE TRIGGER trg_projects_updated
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_blocks ENABLE ROW LEVEL SECURITY;

-- 8.1 Políticas para portfolio_settings
-- Visitantes: leitura pública
CREATE POLICY "Public Read Settings"
ON public.portfolio_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Proprietário autenticado: modificação total
CREATE POLICY "Owner Manage Settings"
ON public.portfolio_settings FOR ALL
TO authenticated
USING (auth.uid() = owner_id OR owner_id IS NULL)
WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- 8.2 Políticas para categories
-- Visitantes: leitura pública
CREATE POLICY "Public Read Categories"
ON public.categories FOR SELECT
TO anon, authenticated
USING (true);

-- Proprietário autenticado: modificação total
CREATE POLICY "Owner Manage Categories"
ON public.categories FOR ALL
TO authenticated
USING (auth.uid() = owner_id OR owner_id IS NULL)
WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- 8.3 Políticas para projects
-- Visitantes: leitura apenas de projetos com status 'published'
CREATE POLICY "Public Read Published Projects"
ON public.projects FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Proprietário autenticado: leitura e modificação de todos (rascunhos e publicados)
CREATE POLICY "Owner Manage Projects"
ON public.projects FOR ALL
TO authenticated
USING (auth.uid() = owner_id OR owner_id IS NULL)
WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- 8.4 Políticas para project_blocks
-- Visitantes: leitura de blocos de projetos publicados
CREATE POLICY "Public Read Blocks For Published Projects"
ON public.project_blocks FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE public.projects.id = public.project_blocks.project_id
    AND public.projects.status = 'published'
  )
);

-- Proprietário autenticado: controle total dos blocos
CREATE POLICY "Owner Manage Blocks"
ON public.project_blocks FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 9. SUPABASE STORAGE BUCKET: portfolio-media
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage
CREATE POLICY "Public Read Media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated Upload Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated Update/Delete Media"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'portfolio-media');
