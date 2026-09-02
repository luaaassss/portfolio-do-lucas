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
import { isSupabaseConfigured, supabase } from './lib/supabaseClient';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isSupabaseConnected = isSupabaseConfigured;

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

  // Supabase is the single source of truth. Authentication is restored from
  // the Supabase session and portfolio data is read directly from Postgres.
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          throw new Error('Supabase não configurado.');
        }

        const { data: sessionData } = await supabase.auth.getSession();
        if (mounted) setIsAuthenticated(Boolean(sessionData.session));

        const data = await StorageEngine.init();
        if (!mounted) return;
        setSettings(data.settings);
        setCategories(data.categories);
        setProjects(data.projects);
        setBlocks(data.blocks);
        applyThemeToDOM(data.settings.theme_config);
      } catch (err) {
        console.error('Falha ao carregar dados do Supabase:', err);
        addToast('Erro ao carregar dados', err instanceof Error ? err.message : 'Verifique a configuração do Supabase.', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    const authSubscription = supabase?.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsAuthenticated(Boolean(session));
    });

    return () => {
      mounted = false;
      authSubscription?.data.subscription.unsubscribe();
    };
  }, [addToast]);

  // Handle Settings Update
  const handleUpdateSettings = async (newSettings: PortfolioSettings) => {
    try {
      const saved = await StorageEngine.saveSettings(newSettings);
      setSettings(saved);
      applyThemeToDOM(saved.theme_config);
    } catch (error) {
      addToast('Erro ao salvar configurações', error instanceof Error ? error.message : 'Falha no Supabase.', 'error');
    }
  };

  // Category operations are persisted directly in Supabase.
  const handleSaveCategory = async (catData: Partial<Category> & { name: string }) => {
    try {
      await StorageEngine.saveCategory({
        ...catData,
        display_order: catData.display_order ?? categories.length + 1,
      });
      setCategories(await StorageEngine.getCategories());
    } catch (error) {
      addToast('Erro ao salvar categoria', error instanceof Error ? error.message : 'Falha no Supabase.', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await StorageEngine.deleteCategory(categoryId);
      setCategories(await StorageEngine.getCategories());
      setProjects(await StorageEngine.getProjects());
    } catch (error) {
      addToast('Erro ao excluir categoria', error instanceof Error ? error.message : 'Falha no Supabase.', 'error');
    }
  };

  const handleReorderCategories = async (orderedIds: string[]) => {
    try {
      setCategories(await StorageEngine.reorderCategories(orderedIds));
    } catch (error) {
      addToast('Erro ao ordenar categorias', error instanceof Error ? error.message : 'Falha no Supabase.', 'error');
    }
  };

  // Project and block operations are persisted directly in Supabase.
  const handleSaveProject = async (
    projectData: Partial<Project> & { title: string },
    projectBlocks: ProjectBlock[]
  ) => {
    try {
      const savedProject = await StorageEngine.saveProject(projectData);
      await StorageEngine.saveBlocksForProject(savedProject.id, projectBlocks);
      const [nextProjects, nextBlocks] = await Promise.all([
        StorageEngine.getProjects(),
        StorageEngine.getAllBlocks(),
      ]);
      setProjects(nextProjects);
      setBlocks(nextBlocks);
    } catch (error) {
      addToast('Erro ao salvar projeto', error instanceof Error ? error.message : 'Falha no Supabase.', 'error');
      throw error;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await StorageEngine.deleteProject(projectId);
      const [nextProjects, nextBlocks] = await Promise.all([
        StorageEngine.getProjects(),
        StorageEngine.getAllBlocks(),
      ]);
      setProjects(nextProjects);
      setBlocks(nextBlocks);
    } catch (error) {
      addToast('Erro ao excluir projeto', error instanceof Error ? error.message : 'Falha no Supabase.', 'error');
    }
  };

  const handleToggleProjectStatus = async (project: Project) => {
    try {
      await StorageEngine.saveProject({
        ...project,
        status: project.status === 'published' ? 'draft' : 'published',
      });
      setProjects(await StorageEngine.getProjects());
    } catch (error) {
      addToast('Erro ao atualizar projeto', error instanceof Error ? error.message : 'Falha no Supabase.', 'error');
    }
  };

  const handleReorderProjects = async (orderedIds: string[]) => {
    try {
      setProjects(await StorageEngine.reorderProjects(orderedIds));
    } catch (error) {
      addToast('Erro ao ordenar projetos', error instanceof Error ? error.message : 'Falha no Supabase.', 'error');
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

  // Authentication handlers backed exclusively by Supabase Auth.
  const handleLoginSuccess = (userEmail: string) => {
    setIsAuthenticated(true);
    setActivePage('admin');
    addToast('Bem-vindo ao CMS', `Sessão iniciada para ${userEmail}.`, 'success');
  };

  const handleLogout = async () => {
    try {
      if (supabase) await supabase.auth.signOut();
      setIsAuthenticated(false);
      setActivePage('projetos');
      addToast('Sessão encerrada', 'Você saiu do painel administrativo.', 'info');
    } catch (error) {
      addToast('Erro ao sair', error instanceof Error ? error.message : 'Falha ao encerrar a sessão.', 'error');
    }
  };

  // Loading/configuration state. There is intentionally no local persistence fallback.
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white font-mono p-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-neutral-400">Carregando Portfólio Autoral...</p>
      </div>
    );
  }

  if (!isSupabaseConfigured || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-6">
        <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
          <h1 className="text-xl font-bold">Supabase não configurado</h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            As variáveis públicas do Supabase não chegaram ao build desta versão. Confira na Vercel se <code>SUPABASE_URL</code> e <code>SUPABASE_PUBLISHABLE_KEY</code> estão cadastradas para o ambiente deste deployment e faça um novo deploy.
          </p>
        </div>
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

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
export default App;
