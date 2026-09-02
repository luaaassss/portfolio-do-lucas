import {
  PortfolioSettings,
  Category,
  Project,
  ProjectBlock,
} from '../types';
import { getSupabaseClient } from './supabaseClient';

const STORAGE_KEYS = {
  SETTINGS: 'portfolio_autoral_settings_v1',
  CATEGORIES: 'portfolio_autoral_categories_v1',
  PROJECTS: 'portfolio_autoral_projects_v1',
  BLOCKS: 'portfolio_autoral_blocks_v1',
  AUTH: 'portfolio_autoral_auth_user_v1',
};

// Default seed dataset
export const DEFAULT_SETTINGS: PortfolioSettings = {
  id: 'settings_default_01',
  owner_id: 'owner_user_01',
  portfolio_name: 'Lucas Conceição',
  tagline: 'Designer de Interação, Tecnólogo Criativo & Pesquisador Visual',
  about_title: 'Sobre a pesquisa, processos e criação',
  short_bio: 'Investigo os limites entre tipografia experimental, interfaces acessíveis, som generativo e artefatos digitais reflexivos.',
  about_text: `Sou designer e desenvolvedor focado na interseção entre tipografia, novas mídias e sistemas interativos acessíveis. Acredito que o design digital não deve ser uma linha de montagem de templates genéricos, mas sim uma manifestação autoral de pensamento crítico, rigor técnico e sensibilidade humana.

Ao longo dos últimos anos, desenvolvi projetos que vão desde identidades visuais dinâmicas e tipografias paramétricas até aplicações web de alta performance e instalações audiovisuais imersivas. Cada projeto nasce de uma investigação aprofundada dos materiais, dos contextos socioculturais e dos padrões universais de acessibilidade (WCAG 2.2 AA).`,
  profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  whatsapp: '+55 55 99999-9999',
  email_public: 'lucas.conceicao@acad.ufsm.br',
  location: 'Santa Maria, RS — Brasil',
  social_links: [
    { id: 'soc_1', platform: 'GitHub', url: 'https://github.com', label: 'GitHub' },
    { id: 'soc_2', platform: 'Behance', url: 'https://behance.net', label: 'Behance' },
    { id: 'soc_3', platform: 'Instagram', url: 'https://instagram.com', label: 'Instagram' },
    { id: 'soc_4', platform: 'LinkedIn', url: 'https://linkedin.com', label: 'LinkedIn' },
  ],
  ux_voice: {
    tone: 'direct',
    cta_project_label: 'Ver projeto',
    cta_contact_label: 'Iniciar conversa no WhatsApp',
    empty_projects_msg: 'Nenhum projeto encontrado nesta categoria no momento.',
    about_nav_label: 'Sobre',
    projects_nav_label: 'Projetos',
    contact_nav_label: 'Contato',
  },
  theme_config: {
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
    scale_ratio: 'compact',
    base_font_size: 16,
    line_height: 1.6,
    border_radius: 'xl',
    border_width: 1,
    border_style: 'solid',
    shadow_level: 'sm',
    max_width_px: 1280,
    grid_columns: 2,
    grid_gap_px: 20,
    card_aspect_ratio: 'auto',
    motion_duration: 'normal',
    motion_easing: 'smooth',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_design_interfaces',
    owner_id: 'owner_user_01',
    name: 'Design de Interfaces & Sistemas',
    slug: 'interfaces-sistemas',
    description: 'Design systems, microinterações, arquitetura de informação e interfaces acessíveis.',
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat_audiovisual',
    owner_id: 'owner_user_01',
    name: 'Audiovisual & Mídia Sonora',
    slug: 'audiovisual-som',
    description: 'Composições sonoras, paisagens acústicas e narrativas em vídeo.',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat_pesquisa_editorial',
    owner_id: 'owner_user_01',
    name: 'Tipografia & Pesquisa Editorial',
    slug: 'tipografia-editorial',
    description: 'Estudos sobre tipografia expressiva, diagramação e publicação digital.',
    display_order: 3,
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj_sinestesia',
    owner_id: 'owner_user_01',
    category_id: 'cat_audiovisual',
    title: 'Sinestesia Tipográfica: Frequências & Glifos',
    slug: 'sinestesia-tipografica',
    short_description: 'Instalação interativa e ensaio sonoro investigando a transdução de frequências acústicas em morfologia de fontes variáveis.',
    cover_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    year: '2026',
    status: 'published',
    featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_sintaxe_inclusiva',
    owner_id: 'owner_user_01',
    category_id: 'cat_design_interfaces',
    title: 'Sintaxe Inclusiva: Design System para Todos',
    slug: 'sintaxe-inclusiva-design-system',
    short_description: 'Arquitetura de tokens, componentes com foco acessível e padrões auditados para conformidade rigorosa com WCAG 2.2 AA.',
    cover_image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    year: '2025',
    status: 'published',
    featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_arquivos_vivos',
    owner_id: 'owner_user_01',
    category_id: 'cat_pesquisa_editorial',
    title: 'Arquivos Vivos: A Memória na Era Digital',
    slug: 'arquivos-vivos-memoria',
    short_description: 'Monografia experimental e livro digital explorando a fragilidade e preservação de acervos culturais comunitários.',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    year: '2025',
    status: 'published',
    featured: false,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_BLOCKS: ProjectBlock[] = [
  // Blocks for Sinestesia Tipográfica
  {
    id: 'blk_1',
    project_id: 'proj_sinestesia',
    type: 'text',
    content: `## A Investigação Sensorial

O projeto parte da hipótese de que caracteres tipográficos não são apenas veículos passivos de significado semântico, mas corpos físicos com peso, ressonância e timbre. A pesquisa combinou síntese de áudio analógica e algoritmos de deformação bezier em tempo real.

### Metodologia e Processos
- Análise espectrográfica de amostras de voz humana.
- Mapeamento de harmônicos diretamente em eixos de largura, peso e contraste de fontes variáveis.
- Construção de interfaces hápticas e visuais para experimentação tátil.`,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blk_2',
    project_id: 'proj_sinestesia',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Fotografia de ondas sonoras projetadas em feixes de luz sobre uma superfície tipográfica tridimensional em fundo escuro.',
    caption: 'Figura 1: Projeção de feixes de frequência acústica sobre o grid tipográfico.',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blk_3',
    project_id: 'proj_sinestesia',
    type: 'audio',
    media_url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
    content: 'Gravação da paisagem sonora gerada durante a performance do protótipo.',
    alt_text: 'Áudio com modulações de sintetizador modular e frequências graves correspondentes aos glifos.',
    transcript: '[Transcrição sonora: O áudio inicia com uma frequência senoidal constante em 110Hz, seguida por modulações rítmicas de filtro ressonante que aumentam progressivamente de intensidade, simbolizando a expansão dos glifos tipográficos no espaço.]',
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blk_4',
    project_id: 'proj_sinestesia',
    type: 'youtube',
    media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    content: 'Registro em vídeo da interação em tempo real dos participantes com a mesa de controle táctil.',
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blk_5',
    project_id: 'proj_sinestesia',
    type: 'text',
    content: `### Resultados e Desdobramentos

A experiência demonstrou que participantes com diferentes níveis de acuidade visual puderam se relacionar com a composição de forma sinestésica, provando o potencial do design multissensorial na criação de ambientes digitais inclusivos e poéticos.`,
    display_order: 5,
    created_at: new Date().toISOString(),
  },

  // Blocks for Sintaxe Inclusiva
  {
    id: 'blk_6',
    project_id: 'proj_sintaxe_inclusiva',
    type: 'text',
    content: `## Acessibilidade como Fundamento Estrutural

Não concebemos a acessibilidade como uma camada decorativa adicionada ao final do desenvolvimento, mas como a própria espinha dorsal do design system.

### Pilares de Desenvolvimento:
1. **Perceptibilidade:** Índices de contraste auditados acima de 4.5:1 para texto normal e 7.0:1 para títulos.
2. **Operabilidade:** Navegação sequencial via teclado sem armadilhas de foco (*focus traps*).
3. **Compreensibilidade:** Rótulos claros, estados de erro descritivos e sem dependência exclusiva de cor.
4. **Robustez:** Semântica HTML rigorosa e atributos WAI-ARIA precisos.`,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blk_7',
    project_id: 'proj_sintaxe_inclusiva',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Diagrama detalhado mostrando a hierarquia de design tokens de cores, tipografia e espaçamentos com indicadores de contraste.',
    caption: 'Figura 2: Matriz de tokens e testes automatizados de razão de contraste.',
    display_order: 2,
    created_at: new Date().toISOString(),
  },

  // Blocks for Arquivos Vivos
  {
    id: 'blk_8',
    project_id: 'proj_arquivos_vivos',
    type: 'text',
    content: `## Preservação e Narrativas Comunitárias

Um projeto de pesquisa editorial que busca documentar saberes populares e tradições orais por meio de uma publicação digital interativa de baixo consumo de dados e alta legibilidade em qualquer dispositivo.`,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blk_9',
    project_id: 'proj_arquivos_vivos',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Páginas abertas de livro com composições tipográficas clássicas e fotografias históricas em preto e branco.',
    caption: 'Figura 3: Layout editorial impresso e contraparte responsiva digital.',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
];

// In-Memory & Local Storage unified methods
export const StorageEngine = {
  // SETTINGS
  async getSettings(): Promise<PortfolioSettings> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('portfolio_settings').select('*').limit(1).maybeSingle();
        if (data && !error) {
          // Cache in local
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
          return data as PortfolioSettings;
        }
      } catch (err) {
        console.warn('Erro ao consultar settings no Supabase, usando local:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    // Initialize defaults
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: PortfolioSettings): Promise<PortfolioSettings> {
    const updated = {
      ...settings,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('portfolio_settings').upsert(updated);
        if (error) {
          console.warn('Erro ao sincronizar settings no Supabase:', error.message);
        }
      } catch (err) {
        console.warn('Supabase offline ou tabela inexistente:', err);
      }
    }

    return updated;
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
        if (data && !error && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data));
          return data as Category[];
        }
      } catch (err) {
        console.warn('Erro ao consultar categories no Supabase:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => a.display_order - b.display_order);
        }
      }
    } catch {
      // ignore
    }

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  },

  async saveCategory(category: Partial<Category> & { name: string }): Promise<Category> {
    const categories = await this.getCategories();
    const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    let saved: Category;
    if (category.id) {
      const idx = categories.findIndex((c) => c.id === category.id);
      if (idx >= 0) {
        saved = { ...categories[idx], ...category, slug };
        categories[idx] = saved;
      } else {
        saved = {
          id: category.id,
          owner_id: category.owner_id || 'owner_user_01',
          name: category.name,
          slug,
          description: category.description,
          display_order: category.display_order ?? (categories.length + 1),
          created_at: category.created_at || new Date().toISOString(),
        };
        categories.push(saved);
      }
    } else {
      saved = {
        id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        owner_id: 'owner_user_01',
        name: category.name,
        slug,
        description: category.description,
        display_order: category.display_order ?? (categories.length + 1),
        created_at: new Date().toISOString(),
      };
      categories.push(saved);
    }

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('categories').upsert(saved);
      } catch (err) {
        console.warn('Erro ao salvar categoria no Supabase:', err);
      }
    }

    return saved;
  },

  async deleteCategory(categoryId: string): Promise<boolean> {
    const categories = await this.getCategories();
    const filtered = categories.filter((c) => c.id !== categoryId);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('categories').delete().eq('id', categoryId);
      } catch (err) {
        console.warn('Erro ao excluir categoria no Supabase:', err);
      }
    }

    return true;
  },

  async reorderCategories(orderedIds: string[]): Promise<Category[]> {
    const categories = await this.getCategories();
    const updated = categories.map((cat) => {
      const newOrder = orderedIds.indexOf(cat.id);
      return newOrder >= 0 ? { ...cat, display_order: newOrder + 1 } : cat;
    });

    updated.sort((a, b) => a.display_order - b.display_order);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        for (const cat of updated) {
          await supabase.from('categories').update({ display_order: cat.display_order }).eq('id', cat.id);
        }
      } catch (err) {
        console.warn('Erro ao reordenar categorias no Supabase:', err);
      }
    }

    return updated;
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
        if (data && !error && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data));
          return data as Project[];
        }
      } catch (err) {
        console.warn('Erro ao consultar projetos no Supabase:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => a.display_order - b.display_order);
        }
      }
    } catch {
      // ignore
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find((p) => p.slug === slug || p.id === slug) || null;
  },

  async saveProject(project: Partial<Project> & { title: string }): Promise<Project> {
    const projects = await this.getProjects();
    const slug = project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let saved: Project;
    if (project.id) {
      const idx = projects.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        saved = {
          ...projects[idx],
          ...project,
          slug,
          updated_at: new Date().toISOString(),
        };
        projects[idx] = saved;
      } else {
        saved = {
          id: project.id,
          owner_id: project.owner_id || 'owner_user_01',
          category_id: project.category_id,
          title: project.title,
          slug,
          short_description: project.short_description || '',
          cover_image: project.cover_image,
          year: project.year || new Date().getFullYear().toString(),
          status: project.status || 'published',
          featured: Boolean(project.featured),
          display_order: project.display_order ?? (projects.length + 1),
          created_at: project.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        projects.push(saved);
      }
    } else {
      saved = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        owner_id: 'owner_user_01',
        category_id: project.category_id,
        title: project.title,
        slug,
        short_description: project.short_description || '',
        cover_image: project.cover_image,
        year: project.year || new Date().getFullYear().toString(),
        status: project.status || 'published',
        featured: Boolean(project.featured),
        display_order: project.display_order ?? (projects.length + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      projects.push(saved);
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('projects').upsert(saved);
      } catch (err) {
        console.warn('Erro ao salvar projeto no Supabase:', err);
      }
    }

    return saved;
  },

  async deleteProject(projectId: string): Promise<boolean> {
    const projects = await this.getProjects();
    const filtered = projects.filter((p) => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));

    // Also delete associated blocks
    const blocks = await this.getAllBlocks();
    const remainingBlocks = blocks.filter((b) => b.project_id !== projectId);
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(remainingBlocks));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('project_blocks').delete().eq('project_id', projectId);
        await supabase.from('projects').delete().eq('id', projectId);
      } catch (err) {
        console.warn('Erro ao excluir projeto no Supabase:', err);
      }
    }

    return true;
  },

  async reorderProjects(orderedIds: string[]): Promise<Project[]> {
    const projects = await this.getProjects();
    const updated = projects.map((p) => {
      const idx = orderedIds.indexOf(p.id);
      return idx >= 0 ? { ...p, display_order: idx + 1 } : p;
    });

    updated.sort((a, b) => a.display_order - b.display_order);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        for (const p of updated) {
          await supabase.from('projects').update({ display_order: p.display_order }).eq('id', p.id);
        }
      } catch (err) {
        console.warn('Erro ao reordenar projetos no Supabase:', err);
      }
    }

    return updated;
  },

  // BLOCKS
  async getAllBlocks(): Promise<ProjectBlock[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('project_blocks').select('*').order('display_order', { ascending: true });
        if (data && !error && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(data));
          return data as ProjectBlock[];
        }
      } catch (err) {
        console.warn('Erro ao consultar blocos no Supabase:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(DEFAULT_BLOCKS));
    return DEFAULT_BLOCKS;
  },

  async getBlocksByProject(projectId: string): Promise<ProjectBlock[]> {
    const all = await this.getAllBlocks();
    return all.filter((b) => b.project_id === projectId).sort((a, b) => a.display_order - b.display_order);
  },

  async saveBlocksForProject(projectId: string, blocks: ProjectBlock[]): Promise<ProjectBlock[]> {
    const all = await this.getAllBlocks();
    const otherBlocks = all.filter((b) => b.project_id !== projectId);

    const orderedBlocks = blocks.map((b, idx) => ({
      ...b,
      project_id: projectId,
      display_order: idx + 1,
      id: b.id || `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: b.created_at || new Date().toISOString(),
    }));

    const combined = [...otherBlocks, ...orderedBlocks];
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(combined));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        // Replace blocks for this project
        await supabase.from('project_blocks').delete().eq('project_id', projectId);
        if (orderedBlocks.length > 0) {
          await supabase.from('project_blocks').insert(orderedBlocks);
        }
      } catch (err) {
        console.warn('Erro ao sincronizar blocos no Supabase:', err);
      }
    }

    return orderedBlocks;
  },

  // FILE UPLOAD (Storage)
  async uploadMedia(file: File, folder = 'uploads'): Promise<{ url: string; error?: string }> {
    // Validate size (max 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { url: '', error: 'O arquivo excede o limite máximo permitido de 25MB.' };
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'dat';
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const bucketName = 'portfolio-media';

        const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

        if (!uploadError) {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
          if (data?.publicUrl) {
            return { url: data.publicUrl };
          }
        }
      } catch (err) {
        console.warn('Falha no upload para Supabase Storage, utilizando fallback local:', err);
      }
    }

    // Fallback: convert file to Base64 Data URL for local persistence
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ url: '', error: 'Falha ao processar arquivo localmente.' });
      };
      reader.readAsDataURL(file);
    });
  },

  // BATCH SYNC & INITIALIZATION
  async init(): Promise<{
    settings: PortfolioSettings;
    categories: Category[];
    projects: Project[];
    blocks: ProjectBlock[];
  }> {
    const [settings, categories, projects, blocks] = await Promise.all([
      this.getSettings(),
      this.getCategories(),
      this.getProjects(),
      this.getAllBlocks(),
    ]);

    return { settings, categories, projects, blocks };
  },

  async saveCategories(categories: Category[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('categories').upsert(categories);
      } catch (err) {
        console.warn('Erro ao sincronizar categorias no Supabase:', err);
      }
    }
  },

  async saveProjects(projects: Project[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('projects').upsert(projects);
      } catch (err) {
        console.warn('Erro ao sincronizar projetos no Supabase:', err);
      }
    }
  },

  async saveBlocks(blocks: ProjectBlock[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('project_blocks').upsert(blocks);
      } catch (err) {
        console.warn('Erro ao sincronizar blocos no Supabase:', err);
      }
    }
  },

  // RESET TO DEFAULT
  resetAllToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(DEFAULT_BLOCKS));
  },

  async resetToDefaults(): Promise<{
    settings: PortfolioSettings;
    categories: Category[];
    projects: Project[];
    blocks: ProjectBlock[];
  }> {
    this.resetAllToDefault();
    return {
      settings: DEFAULT_SETTINGS,
      categories: DEFAULT_CATEGORIES,
      projects: DEFAULT_PROJECTS,
      blocks: DEFAULT_BLOCKS,
    };
  },
};
