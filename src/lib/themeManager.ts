import { ThemeConfig } from '../types';

export const FONT_MAP: Record<ThemeConfig['font_heading'] | ThemeConfig['font_body'] | 'system', string> = {
  'syne': "'Syne', -apple-system, BlinkMacSystemFont, sans-serif",
  'space-grotesk': "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
  'cinzel': "'Cinzel', Georgia, serif",
  'instrument-serif': "'Instrument Serif', Georgia, serif",
  'newsreader': "'Newsreader', Georgia, serif",
  'plus-jakarta': "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  'jetbrains-mono': "'JetBrains Mono', monospace",
  'system': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export const THEME_PRESETS: { id: string; name: string; description: string; config: Partial<ThemeConfig> }[] = [
  {
    id: 'bento-grid',
    name: 'Bento Grid Modular (Padrão)',
    description: 'Estética modular moderna com cards arredondados, fundo zinc-50, realce índigo e tipografia geométrica.',
    config: {
      color_background: '#FAFAFA',
      color_surface: '#FFFFFF',
      color_text_primary: '#18181B',
      color_text_secondary: '#71717A',
      color_primary: '#18181B',
      color_secondary: '#F4F4F5',
      color_accent: '#4F46E5',
      color_border: '#E4E4E7',
      color_focus: '#4F46E5',
      color_success: '#10B981',
      color_warning: '#F59E0B',
      color_error: '#EF4444',
      font_heading: 'space-grotesk',
      font_body: 'plus-jakarta',
      border_radius: 'xl',
      border_width: 1,
      border_style: 'solid',
      shadow_level: 'sm',
      max_width_px: 1280,
      grid_columns: 2,
      grid_gap_px: 20,
    },
  },
  {
    id: 'editorial-moderno',
    name: 'Editorial Suíço & Minimalista',
    description: 'Tipografia serifada expressiva, alto contraste e fundo off-white nobre.',
    config: {
      color_background: '#F9F8F6',
      color_surface: '#FFFFFF',
      color_text_primary: '#111111',
      color_text_secondary: '#555555',
      color_primary: '#1A1A1A',
      color_secondary: '#E5E2DC',
      color_accent: '#B43E19',
      color_border: '#E2DED5',
      color_focus: '#B43E19',
      font_heading: 'newsreader',
      font_body: 'plus-jakarta',
      border_radius: 'sm',
      border_width: 1,
      grid_columns: 2,
      shadow_level: 'none',
    },
  },
  {
    id: 'dark-autoral',
    name: 'Bento Dark & Cyber Atelier',
    description: 'Atmosfera dark imersiva com cards em zinc-900 e acentos vibrantes.',
    config: {
      color_background: '#09090B',
      color_surface: '#18181B',
      color_text_primary: '#FAFAFA',
      color_text_secondary: '#A1A1AA',
      color_primary: '#6366F1',
      color_secondary: '#27272A',
      color_accent: '#818CF8',
      color_border: '#27272A',
      color_focus: '#818CF8',
      font_heading: 'space-grotesk',
      font_body: 'plus-jakarta',
      border_radius: 'xl',
      border_width: 1,
      grid_columns: 2,
      shadow_level: 'sm',
    },
  },
  {
    id: 'brutalismo-arquitetura',
    name: 'Brutalismo Monocromático',
    description: 'Bordas fortes, cantos retos geométricos, monospace e alta clareza estrutural.',
    config: {
      color_background: '#FFFFFF',
      color_surface: '#F4F4F4',
      color_text_primary: '#000000',
      color_text_secondary: '#404040',
      color_primary: '#000000',
      color_secondary: '#E0E0E0',
      color_accent: '#000000',
      color_border: '#000000',
      color_focus: '#000000',
      font_heading: 'space-grotesk',
      font_body: 'space-grotesk',
      border_radius: 'none',
      border_width: 2,
      grid_columns: 2,
      shadow_level: 'none',
    },
  },
  {
    id: 'organico-terra',
    name: 'Orgânico & Terracota',
    description: 'Tons acolhedores, curvas suaves e estética editorial contemporânea.',
    config: {
      color_background: '#FAF6F0',
      color_surface: '#FFFFFF',
      color_text_primary: '#2C2723',
      color_text_secondary: '#6E675F',
      color_primary: '#8C4327',
      color_secondary: '#E8DED1',
      color_accent: '#C86D43',
      color_border: '#DFD5C6',
      color_focus: '#8C4327',
      font_heading: 'cinzel',
      font_body: 'plus-jakarta',
      border_radius: 'lg',
      border_width: 1,
      grid_columns: 3,
      shadow_level: 'sm',
    },
  },
  {
    id: 'techno-creative',
    name: 'Creative Technologist',
    description: 'Inspirado em estúdios de arte generativa e design interativo.',
    config: {
      color_background: '#0A0A0B',
      color_surface: '#121214',
      color_text_primary: '#EDEDED',
      color_text_secondary: '#888888',
      color_primary: '#10B981',
      color_secondary: '#222226',
      color_accent: '#34D399',
      color_border: '#27272A',
      color_focus: '#10B981',
      font_heading: 'jetbrains-mono',
      font_body: 'jetbrains-mono',
      border_radius: 'sm',
      border_width: 1,
      grid_columns: 2,
      shadow_level: 'none',
    },
  },
];

export function applyThemeToDOM(theme: ThemeConfig): void {
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--color-bg', theme.color_background);
  root.style.setProperty('--color-surface', theme.color_surface);
  root.style.setProperty('--color-text-primary', theme.color_text_primary);
  root.style.setProperty('--color-text-secondary', theme.color_text_secondary);
  root.style.setProperty('--color-primary', theme.color_primary);
  root.style.setProperty('--color-secondary', theme.color_secondary);
  root.style.setProperty('--color-accent', theme.color_accent);
  root.style.setProperty('--color-border', theme.color_border);
  root.style.setProperty('--color-focus', theme.color_focus);
  root.style.setProperty('--color-success', theme.color_success);
  root.style.setProperty('--color-warning', theme.color_warning);
  root.style.setProperty('--color-error', theme.color_error);

  // Typography
  const headingFont = FONT_MAP[theme.font_heading] || FONT_MAP['space-grotesk'];
  const bodyFont = FONT_MAP[theme.font_body] || FONT_MAP['plus-jakarta'];

  root.style.setProperty('--font-heading', headingFont);
  root.style.setProperty('--font-body', bodyFont);
  root.style.setProperty('--base-font-size', `${theme.base_font_size}px`);
  root.style.setProperty('--line-height', `${theme.line_height}`);

  // Scale ratio
  const scaleMult = theme.scale_ratio === 'compact' ? '1.15' : theme.scale_ratio === 'expressive' ? '1.333' : '1.25';
  root.style.setProperty('--type-scale', scaleMult);

  // Radius
  const radiusMap: Record<ThemeConfig['border_radius'], string> = {
    'none': '0px',
    'sm': '6px',
    'md': '12px',
    'lg': '18px',
    'xl': '24px',
    'full': '9999px',
  };
  root.style.setProperty('--border-radius', radiusMap[theme.border_radius] || '24px');

  // Borders
  root.style.setProperty('--border-width', `${theme.border_width}px`);
  root.style.setProperty('--border-style', theme.border_style);

  // Shadows
  const shadowMap: Record<ThemeConfig['shadow_level'], string> = {
    'none': 'none',
    'sm': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    'md': '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04)',
    'lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
  };
  root.style.setProperty('--box-shadow', shadowMap[theme.shadow_level] || 'none');

  // Layout & Max Width
  root.style.setProperty('--max-width', `${theme.max_width_px}px`);
  root.style.setProperty('--grid-gap', `${theme.grid_gap_px}px`);

  // Motion
  const durationMap: Record<ThemeConfig['motion_duration'], string> = {
    'none': '0ms',
    'fast': '150ms',
    'normal': '280ms',
    'slow': '450ms',
  };
  root.style.setProperty('--motion-duration', durationMap[theme.motion_duration] || '280ms');

  const easingMap: Record<ThemeConfig['motion_easing'], string> = {
    'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
    'snappy': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'linear': 'linear',
  };
  root.style.setProperty('--motion-easing', easingMap[theme.motion_easing] || 'cubic-bezier(0.16, 1, 0.3, 1)');
}
