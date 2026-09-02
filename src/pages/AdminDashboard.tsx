import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  Palette,
  User,
  Database,
  ExternalLink,
  LogOut,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  PortfolioSettings,
  Category,
  Project,
  ProjectBlock,
  ThemeConfig,
  UxVoiceConfig,
} from '../types';
import { DashboardHome } from '../components/admin/DashboardHome';
import { ProjectsManager } from '../components/admin/ProjectsManager';
import { ProjectEditor } from '../components/admin/ProjectEditor';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { AppearanceManager } from '../components/admin/AppearanceManager';
import { AboutSettings } from '../components/admin/AboutSettings';

interface AdminDashboardProps {
  settings: PortfolioSettings;
  categories: Category[];
  projects: Project[];
  blocks: ProjectBlock[];
  isSupabaseConnected: boolean;
  onUpdateSettings: (newSettings: PortfolioSettings) => void;
  onSaveCategory: (category: Partial<Category> & { name: string }) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories: (orderedIds: string[]) => void;
  onSaveProject: (projectData: Partial<Project> & { title: string }, blocks: ProjectBlock[]) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleProjectStatus: (project: Project) => void;
  onReorderProjects: (orderedIds: string[]) => void;
  onOpenSupabaseModal: () => void;
  onResetDefaults: () => void;
  onOpenPublicView: (slug?: string) => void;
  onLogout: () => void;
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  categories,
  projects,
  blocks,
  isSupabaseConnected,
  onUpdateSettings,
  onSaveCategory,
  onDeleteCategory,
  onReorderCategories,
  onSaveProject,
  onDeleteProject,
  onToggleProjectStatus,
  onReorderProjects,
  onOpenSupabaseModal,
  onResetDefaults,
  onOpenPublicView,
  onLogout,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [editingProjectId, setEditingProjectId] = useState<string | null | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Open Project Editor for new or existing project
  const handleOpenProjectEditor = (projectId?: string) => {
    setEditingProjectId(projectId);
    setIsEditorOpen(true);
  };

  // Save project & blocks from editor
  const handleSaveProjectFromEditor = (
    projectData: Partial<Project> & { title: string },
    projectBlocks: ProjectBlock[]
  ) => {
    onSaveProject(projectData, projectBlocks);
    setIsEditorOpen(false);
    setEditingProjectId(undefined);
    showToast('Projeto Salvo', 'O projeto e seus blocos foram atualizados com sucesso.', 'success');
  };

  const currentEditingProject = projects.find((p) => p.id === editingProjectId);
  const currentEditingBlocks = blocks.filter((b) => b.project_id === editingProjectId);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      {/* Top CMS Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">
                  CMS Autoral
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                  v2.2 AA
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 truncate max-w-[200px] sm:max-w-none">
                {settings.portfolio_name}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenPublicView()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Portfólio Público</span>
            </button>

            <button
              onClick={onOpenSupabaseModal}
              className="p-1.5 sm:px-3 sm:py-1.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5"
              title="Configurações do Supabase"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Supabase</span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Sair do painel administrativo"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Layout with Navigation Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs Bar */}
        {!isEditorOpen && (
          <nav
            aria-label="Navegação do painel administrativo"
            className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-700 scrollbar-none"
          >
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('projetos')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'projetos'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projetos ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categorias')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'categorias'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <Tags className="w-4 h-4" />
              <span>Categorias ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('aparencia')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'aparencia'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Design Tokens & WCAG</span>
            </button>

            <button
              onClick={() => setActiveTab('sobre')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'sobre'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Apresentação & Perfil</span>
            </button>
          </nav>
        )}

        {/* Tab Content Render */}
        <main>
          {isEditorOpen ? (
            <ProjectEditor
              project={currentEditingProject}
              categories={categories}
              initialBlocks={currentEditingBlocks}
              onSave={handleSaveProjectFromEditor}
              onBack={() => {
                setIsEditorOpen(false);
                setEditingProjectId(undefined);
              }}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardHome
                  settings={settings}
                  categories={categories}
                  projects={projects}
                  blocks={blocks}
                  isSupabaseConnected={isSupabaseConnected}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenSupabaseModal={onOpenSupabaseModal}
                  onOpenProjectEditor={handleOpenProjectEditor}
                  onOpenPreview={() => onOpenPublicView()}
                  onResetDefaults={onResetDefaults}
                />
              )}

              {activeTab === 'projetos' && (
                <ProjectsManager
                  projects={projects}
                  categories={categories}
                  onOpenEditor={handleOpenProjectEditor}
                  onDeleteProject={(id) => {
                    onDeleteProject(id);
                    showToast('Projeto Removido', 'O projeto foi excluído com sucesso.', 'info');
                  }}
                  onToggleStatus={(p) => {
                    onToggleProjectStatus(p);
                    showToast('Status Atualizado', `Projeto marcado como ${p.status === 'published' ? 'Rascunho' : 'Publicado'}.`, 'success');
                  }}
                  onReorderProjects={onReorderProjects}
                  onViewPublicProject={(slug) => onOpenPublicView(slug)}
                />
              )}

              {activeTab === 'categorias' && (
                <CategoriesManager
                  categories={categories}
                  projects={projects}
                  onSaveCategory={(cat) => {
                    onSaveCategory(cat);
                    showToast('Categoria Salva', 'A categoria foi criada ou atualizada.', 'success');
                  }}
                  onDeleteCategory={(id) => {
                    onDeleteCategory(id);
                    showToast('Categoria Excluída', 'A categoria foi removida do sistema.', 'info');
                  }}
                  onReorderCategories={onReorderCategories}
                />
              )}

              {activeTab === 'aparencia' && (
                <AppearanceManager
                  initialTheme={settings.theme_config}
                  initialUxVoice={settings.ux_voice_config}
                  onSaveTheme={(theme: ThemeConfig, uxVoice: UxVoiceConfig) => {
                    onUpdateSettings({
                      ...settings,
                      theme_config: theme,
                      ux_voice_config: uxVoice,
                    });
                    showToast('Design Tokens Atualizados', 'As alterações visuais e de tom de voz foram salvas.', 'success');
                  }}
                />
              )}

              {activeTab === 'sobre' && (
                <AboutSettings
                  settings={settings}
                  onSave={(updated) => {
                    onUpdateSettings(updated);
                    showToast('Perfil Atualizado', 'As informações de apresentação foram salvas.', 'success');
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
