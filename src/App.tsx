import React, { useState, useEffect, useCallback } from 'react';
import {
  PortfolioSettings,
  Category,
  Project,
  ProjectBlock,
  ActivePage,
  ToastNotification,
} from './types';
import { StorageEngine } from './lib/storageEngine';
import { applyThemeToDOM } from './lib/themeManager';
import { isSupabaseConfigured } from './lib/supabaseClient';

// Public Components & Pages
import { Header } from './components/public/Header';
import { Footer } from './components/public/Footer';
import { PublicHome } from './pages/PublicHome';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Components & Modals
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthModal } from './components/admin/AuthModal';
import { SupabaseSetupModal } from './components/admin/SupabaseSetupModal';
import { Toast } from './components/common/Toast';

export function App() {
  // Global Application State
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);

  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('projetos');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  // Auth & Admin State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('portfolio_auth_admin') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
      const newToast: ToastNotification = {
        id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title,
        message,
        type,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initial Load from Storage Engine (Local-first / Supabase)
  useEffect(() => {
    async function loadData() {
      try {
        const data = await StorageEngine.init();
        setSettings(data.settings);
        setCategories(data.categories);
        setProjects(data.projects);
        setBlocks(data.blocks);
        setIsSupabaseConnected(isSupabaseConfigured());

        // Apply Design Tokens to :root
        applyThemeToDOM(data.settings.theme_config);
      } catch (err) {
        console.error('Failed to initialize portfolio data:', err);
        addToast('Erro ao carregar dados', 'Carregando versão local...', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [addToast]);

  // Handle Settings Update
  const handleUpdateSettings = async (newSettings: PortfolioSettings) => {
    setSettings(newSettings);
    applyThemeToDOM(newSettings.theme_config);
    await StorageEngine.saveSettings(newSettings);
  };

  // Handle Category operations
  const handleSaveCategory = async (catData: Partial<Category> & { name: string }) => {
    if (catData.id) {
      // Update
      const updated = categories.map((c) =>
        c.id === catData.id
          ? {
              ...c,
              name: catData.name,
              slug: catData.slug || c.slug,
              description: catData.description,
            }
          : c
      );
      setCategories(updated);
      await StorageEngine.saveCategories(updated);
    } else {
      // Create new
      const newCat: Category = {
        id: `cat_${Date.now()}`,
        name: catData.name,
        slug:
          catData.slug ||
          catData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
        description: catData.description || '',
        display_order: categories.length + 1,
        created_at: new Date().toISOString(),
      };
      const updated = [...categories, newCat];
      setCategories(updated);
      await StorageEngine.saveCategories(updated);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const updated = categories.filter((c) => c.id !== categoryId);
    setCategories(updated);
    await StorageEngine.saveCategories(updated);

    // Unassign deleted category from existing projects
    const updatedProjects = projects.map((p) =>
      p.category_id === categoryId ? { ...p, category_id: undefined } : p
    );
    setProjects(updatedProjects);
    await StorageEngine.saveProjects(updatedProjects);
  };

  const handleReorderCategories = async (orderedIds: string[]) => {
    const updated = [...categories].sort(
      (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
    );
    setCategories(updated);
    await StorageEngine.saveCategories(updated);
  };

  // Handle Project operations
  const handleSaveProject = async (
    projectData: Partial<Project> & { title: string },
    projectBlocks: ProjectBlock[]
  ) => {
    let targetProjectId = projectData.id;

    if (targetProjectId) {
      // Update existing project
      const updatedProjects = projects.map((p) =>
        p.id === targetProjectId
          ? {
              ...p,
              ...projectData,
              updated_at: new Date().toISOString(),
            }
          : p
      );
      setProjects(updatedProjects);
      await StorageEngine.saveProjects(updatedProjects);
    } else {
      // Create new project
      targetProjectId = `proj_${Date.now()}`;
      const newProject: Project = {
        id: targetProjectId,
        title: projectData.title,
        slug: projectData.slug || `projeto-${Date.now()}`,
        short_description: projectData.short_description || '',
        category_id: projectData.category_id,
        cover_image: projectData.cover_image,
        year: projectData.year || new Date().getFullYear().toString(),
        status: projectData.status || 'published',
        featured: projectData.featured || false,
        display_order: projects.length + 1,
        created_at: new Date().toISOString(),
      };
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      await StorageEngine.saveProjects(updatedProjects);
    }

    // Update blocks for this project
    const normalizedBlocks = projectBlocks.map((b, idx) => ({
      ...b,
      project_id: targetProjectId as string,
      display_order: idx + 1,
    }));

    const otherBlocks = blocks.filter((b) => b.project_id !== targetProjectId);
    const allUpdatedBlocks = [...otherBlocks, ...normalizedBlocks];
    setBlocks(allUpdatedBlocks);
    await StorageEngine.saveBlocks(allUpdatedBlocks);
  };

  const handleDeleteProject = async (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    await StorageEngine.saveProjects(updatedProjects);

    const updatedBlocks = blocks.filter((b) => b.project_id !== projectId);
    setBlocks(updatedBlocks);
    await StorageEngine.saveBlocks(updatedBlocks);
  };

  const handleToggleProjectStatus = async (project: Project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    const updatedProjects = projects.map((p) =>
      p.id === project.id ? { ...p, status: newStatus as 'draft' | 'published' } : p
    );
    setProjects(updatedProjects);
    await StorageEngine.saveProjects(updatedProjects);
  };

  const handleReorderProjects = async (orderedIds: string[]) => {
    const updated = [...projects].sort(
      (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
    );
    setProjects(updated);
    await StorageEngine.saveProjects(updated);
  };

  // Reset to default seed data
  const handleResetDefaults = async () => {
    if (
      window.confirm(
        'Tem certeza que deseja restaurar o portfólio para os dados e temas autorais padrão?'
      )
    ) {
      const reset = await StorageEngine.resetToDefaults();
      setSettings(reset.settings);
      setCategories(reset.categories);
      setProjects(reset.projects);
      setBlocks(reset.blocks);
      applyThemeToDOM(reset.settings.theme_config);
      addToast('Portfólio Restaurado', 'Dados padrão carregados com sucesso.', 'success');
    }
  };

  // Navigation handlers
  const handleNavigate = (page: ActivePage) => {
    if (page === 'admin' && !isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setActivePage(page);
    setSelectedProjectSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (slug: string) => {
    setSelectedProjectSlug(slug);
    setActivePage('projeto_detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication Handlers
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('portfolio_auth_admin', 'true');
    setActivePage('admin');
    addToast('Bem-vindo ao CMS', 'Sessão administrativa iniciada.', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('portfolio_auth_admin');
    setActivePage('projetos');
    addToast('Sessão Encerrada', 'Você saiu do painel administrativo.', 'info');
  };

  // Loading state with high-contrast accessible skeleton
  if (loading || !settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white font-mono p-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-neutral-400">Carregando Portfólio Autoral...</p>
      </div>
    );
  }

  // Find active project for detail view
  const currentProject = selectedProjectSlug
    ? projects.find((p) => p.slug === selectedProjectSlug) || null
    : null;
  const currentProjectBlocks = currentProject
    ? blocks.filter((b) => b.project_id === currentProject.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Skip to Main Content Link (WCAG 2.2 AA Mandatory) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:font-bold focus:text-xs focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Pular para o conteúdo principal
      </a>

      {/* Main Render based on Active Page */}
      {activePage === 'admin' && isAuthenticated ? (
        <AdminDashboard
          settings={settings}
          categories={categories}
          projects={projects}
          blocks={blocks}
          isSupabaseConnected={isSupabaseConnected}
          onUpdateSettings={handleUpdateSettings}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onReorderCategories={handleReorderCategories}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
          onToggleProjectStatus={handleToggleProjectStatus}
          onReorderProjects={handleReorderProjects}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onResetDefaults={handleResetDefaults}
          onOpenPublicView={(slug) => {
            if (slug) {
              handleSelectProject(slug);
            } else {
              handleNavigate('projetos');
            }
          }}
          onLogout={handleLogout}
          showToast={addToast}
        />
      ) : (
        <>
          {/* Public Header */}
          <Header
            settings={settings}
            activePage={activePage}
            onNavigate={handleNavigate}
            onOpenAdmin={() => {
              if (isAuthenticated) {
                setActivePage('admin');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
          />

          {/* Main Content Area */}
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 w-full max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 focus:outline-none"
          >
            {activePage === 'projetos' && (
              <PublicHome
                settings={settings}
                categories={categories}
                projects={projects}
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'projeto_detalhe' && currentProject && (
              <ProjectDetailPage
                project={currentProject}
                categories={categories}
                allProjects={projects}
                blocks={currentProjectBlocks}
                onBack={() => handleNavigate('projetos')}
                onSelectProject={handleSelectProject}
              />
            )}

            {activePage === 'sobre' && <AboutPage settings={settings} />}

            {activePage === 'contato' && <ContactPage settings={settings} />}
          </main>

          {/* Public Footer */}
          <Footer
            settings={settings}
            onNavigate={handleNavigate}
            onOpenAdmin={() => {
              if (isAuthenticated) {
                setActivePage('admin');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
          />
        </>
      )}

      {/* Auth Modal for Admin Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Supabase Cloud Setup & Sync Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnected={() => {
          setIsSupabaseConnected(true);
          addToast('Supabase Conectado', 'Sincronização em tempo real ativada.', 'success');
        }}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
export default App;
