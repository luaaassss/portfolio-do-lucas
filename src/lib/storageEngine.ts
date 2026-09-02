import {
  PortfolioSettings,
  Category,
  Project,
  ProjectBlock,
} from '../types';
import { getCurrentUser, requireSupabase } from './supabaseClient';

const SETTINGS_ID = 'settings_default_01';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const now = () => new Date().toISOString();

async function requireUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Você precisa estar autenticado para alterar o portfólio.');
  }
  return user.id;
}

export const StorageEngine = {
  async getSettings(): Promise<PortfolioSettings> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('portfolio_settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as PortfolioSettings;

    // The database is authoritative. These defaults are only an in-memory
    // rendering fallback until the owner creates the first settings row.
    return {
      id: SETTINGS_ID,
      portfolio_name: 'Portfólio Autoral',
      tagline: '',
      about_title: 'Sobre',
      about_text: '',
      short_bio: '',
      profile_image: undefined,
      whatsapp: '',
      email_public: '',
      location: '',
      social_links: [],
      ux_voice: {
        tone: 'direct',
        cta_project_label: 'Ver projeto',
        cta_contact_label: 'Iniciar conversa',
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
      created_at: now(),
      updated_at: now(),
    };
  },

  async saveSettings(settings: PortfolioSettings): Promise<PortfolioSettings> {
    const client = requireSupabase();
    const owner_id = await requireUserId();
    const payload = {
      ...settings,
      id: SETTINGS_ID,
      owner_id,
      updated_at: now(),
    };
    const { data, error } = await client
      .from('portfolio_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data as PortfolioSettings;
  },

  async getCategories(): Promise<Category[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return (data || []) as Category[];
  },

  async saveCategory(category: Partial<Category> & { name: string }): Promise<Category> {
    const client = requireSupabase();
    const owner_id = await requireUserId();
    const payload = {
      id: category.id || `cat_${crypto.randomUUID()}`,
      owner_id,
      name: category.name.trim(),
      slug: slugify(category.slug || category.name),
      description: category.description || null,
      display_order: category.display_order ?? 1,
      created_at: category.created_at || now(),
    };
    const { data, error } = await client
      .from('categories')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async deleteCategory(categoryId: string): Promise<boolean> {
    const client = requireSupabase();
    await requireUserId();
    const { error } = await client.from('categories').delete().eq('id', categoryId);
    if (error) throw error;
    return true;
  },

  async reorderCategories(orderedIds: string[]): Promise<Category[]> {
    const client = requireSupabase();
    await requireUserId();
    for (const [index, id] of orderedIds.entries()) {
      const { error } = await client
        .from('categories')
        .update({ display_order: index + 1 })
        .eq('id', id);
      if (error) throw error;
    }
    return this.getCategories();
  },

  async getProjects(): Promise<Project[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return (data || []) as Project[];
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data as Project | null) || null;
  },

  async saveProject(project: Partial<Project> & { title: string }): Promise<Project> {
    const client = requireSupabase();
    const owner_id = await requireUserId();
    const payload = {
      id: project.id || `proj_${crypto.randomUUID()}`,
      owner_id,
      category_id: project.category_id || null,
      title: project.title.trim(),
      slug: slugify(project.slug || project.title) || `projeto-${Date.now()}`,
      short_description: project.short_description || '',
      cover_image: project.cover_image || null,
      year: project.year || String(new Date().getFullYear()),
      status: project.status || 'published',
      featured: Boolean(project.featured),
      display_order: project.display_order ?? 1,
      created_at: project.created_at || now(),
      updated_at: now(),
    };
    const { data, error } = await client
      .from('projects')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  },

  async deleteProject(projectId: string): Promise<boolean> {
    const client = requireSupabase();
    await requireUserId();
    const { error } = await client.from('projects').delete().eq('id', projectId);
    if (error) throw error;
    return true;
  },

  async reorderProjects(orderedIds: string[]): Promise<Project[]> {
    const client = requireSupabase();
    await requireUserId();
    for (const [index, id] of orderedIds.entries()) {
      const { error } = await client
        .from('projects')
        .update({ display_order: index + 1 })
        .eq('id', id);
      if (error) throw error;
    }
    return this.getProjects();
  },

  async getAllBlocks(): Promise<ProjectBlock[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('project_blocks')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return (data || []) as ProjectBlock[];
  },

  async getBlocksByProject(projectId: string): Promise<ProjectBlock[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('project_blocks')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return (data || []) as ProjectBlock[];
  },

  async saveBlocksForProject(projectId: string, blocks: ProjectBlock[]): Promise<ProjectBlock[]> {
    const client = requireSupabase();
    await requireUserId();

    const { error: deleteError } = await client
      .from('project_blocks')
      .delete()
      .eq('project_id', projectId);
    if (deleteError) throw deleteError;

    const orderedBlocks = blocks.map((block, index) => ({
      id: block.id || `blk_${crypto.randomUUID()}`,
      project_id: projectId,
      type: block.type,
      content: block.content || null,
      media_url: block.media_url || null,
      alt_text: block.alt_text || null,
      caption: block.caption || null,
      transcript: block.transcript || null,
      display_order: index + 1,
      created_at: block.created_at || now(),
    }));

    if (orderedBlocks.length) {
      const { error } = await client.from('project_blocks').insert(orderedBlocks);
      if (error) throw error;
    }

    return orderedBlocks as ProjectBlock[];
  },

  async uploadMedia(file: File, folder = 'uploads'): Promise<{ url: string; error?: string }> {
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { url: '', error: 'O arquivo excede o limite máximo permitido de 25MB.' };
    }

    const client = requireSupabase();
    await requireUserId();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'dat';
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '-');
    const fileName = `${safeFolder}/${crypto.randomUUID()}.${fileExt}`;
    const bucketName = 'portfolio-media';

    const { error } = await client.storage.from(bucketName).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) return { url: '', error: error.message };

    const { data } = client.storage.from(bucketName).getPublicUrl(fileName);
    return { url: data.publicUrl };
  },

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

  // Compatibility helpers used by the existing admin UI. Every operation
  // writes directly to Supabase and throws on failure; there is no local mirror.
  async saveCategories(categories: Category[]): Promise<void> {
    const client = requireSupabase();
    const owner_id = await requireUserId();
    const payload = categories.map((category, index) => ({
      ...category,
      owner_id,
      display_order: index + 1,
    }));
    if (!payload.length) return;
    const { error } = await client.from('categories').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
  },

  async saveProjects(projects: Project[]): Promise<void> {
    const client = requireSupabase();
    const owner_id = await requireUserId();
    if (!projects.length) return;
    const payload = projects.map((project, index) => ({
      ...project,
      owner_id,
      display_order: index + 1,
      updated_at: now(),
    }));
    const { error } = await client.from('projects').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
  },

  async saveBlocks(blocks: ProjectBlock[]): Promise<void> {
    const client = requireSupabase();
    await requireUserId();
    const byProject = new Map<string, ProjectBlock[]>();
    for (const block of blocks) {
      const list = byProject.get(block.project_id) || [];
      list.push(block);
      byProject.set(block.project_id, list);
    }
    for (const [projectId, projectBlocks] of byProject) {
      await this.saveBlocksForProject(projectId, projectBlocks);
    }
  },
};
