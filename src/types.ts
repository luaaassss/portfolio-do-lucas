/**
 * Types & Interfaces for Portfólio Autoral
 * WCAG 2.2 AA compliant, Supabase Data Model & Design Tokens
 */

export type ProjectStatus = 'draft' | 'published';

export type BlockType = 'text' | 'image' | 'youtube' | 'audio';

export type UxVoiceTone =
  | 'direct'
  | 'informal'
  | 'poetic'
  | 'academic'
  | 'experimental'
  | 'playful'
  | 'professional'
  | 'provocative'
  | 'welcoming'
  | 'minimalist';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
}

export interface UxVoiceConfig {
  tone: UxVoiceTone;
  cta_project_label: string; // e.g. "Ver projeto", "Explorar", "Abrir projeto"
  cta_contact_label: string; // e.g. "Conversar no WhatsApp", "Iniciar conversa"
  empty_projects_msg: string;
  about_nav_label: string;
  projects_nav_label: string;
  contact_nav_label: string;
}

export interface ThemeConfig {
  // Cores
  color_background: string;
  color_surface: string;
  color_text_primary: string;
  color_text_secondary: string;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  color_border: string;
  color_focus: string;
  color_success: string;
  color_warning: string;
  color_error: string;

  // Tipografia
  font_heading: 'syne' | 'space-grotesk' | 'cinzel' | 'instrument-serif' | 'newsreader' | 'plus-jakarta' | 'jetbrains-mono';
  font_body: 'plus-jakarta' | 'space-grotesk' | 'newsreader' | 'jetbrains-mono' | 'system';
  scale_ratio: 'compact' | 'normal' | 'expressive'; // 1.15, 1.25, 1.333
  base_font_size: number; // in px (e.g. 16)
  line_height: number; // e.g. 1.6

  // Formas & Bordas
  border_radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  border_width: number; // in px (0, 1, 2, 4)
  border_style: 'solid' | 'dashed' | 'dotted';
  shadow_level: 'none' | 'sm' | 'md' | 'lg';

  // Layout & Grid
  max_width_px: number; // 1024, 1200, 1400
  grid_columns: 1 | 2 | 3 | 4;
  grid_gap_px: number; // 16, 24, 32, 48
  card_aspect_ratio: 'auto' | '16/9' | '4/3' | '1/1' | '3/4';

  // Motion & Microinterações
  motion_duration: 'fast' | 'normal' | 'slow' | 'none';
  motion_easing: 'smooth' | 'snappy' | 'linear';
}

export interface PortfolioSettings {
  id: string;
  owner_id?: string;
  portfolio_name: string;
  tagline: string;
  about_title: string;
  about_text: string;
  short_bio: string;
  profile_image?: string;
  whatsapp: string;
  email_public: string;
  location: string;
  social_links: SocialLink[];
  ux_voice: UxVoiceConfig;
  theme_config: ThemeConfig;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  owner_id?: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  owner_id?: string;
  category_id?: string;
  title: string;
  slug: string;
  short_description: string;
  cover_image?: string;
  year?: string;
  status: ProjectStatus;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ProjectBlock {
  id: string;
  project_id: string;
  type: BlockType;
  content?: string; // Text / Markdown
  media_url?: string; // Image URL, YouTube URL, Audio URL
  alt_text?: string; // Obrigatório para imagem significativa
  caption?: string; // Legenda opcional
  transcript?: string; // Transcrição textual do áudio para acessibilidade
  display_order: number;
  created_at: string;
}


export type ActivePage = 'sobre' | 'projetos' | 'projeto_detalhe' | 'contato' | 'admin' | '404';

export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message?: string;
}
