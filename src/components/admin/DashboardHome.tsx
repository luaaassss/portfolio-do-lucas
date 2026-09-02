import React from 'react';
import {
  FolderKanban,
  Tags,
  Layers,
  Sparkles,
  PlusCircle,
  Palette,
  User,
  ExternalLink,
} from 'lucide-react';
import { PortfolioSettings, Category, Project, ProjectBlock } from '../../types';

interface DashboardHomeProps {
  settings: PortfolioSettings;
  categories: Category[];
  projects: Project[];
  blocks: ProjectBlock[];
  isSupabaseConnected: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenProjectEditor: (projectId?: string) => void;
  onOpenPreview: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  settings,
  categories,
  projects,
  blocks,
  isSupabaseConnected,
  onNavigateTab,
  onOpenProjectEditor,
  onOpenPreview,
}) => {
  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 bg-neutral-900 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isSupabaseConnected ? 'Supabase conectado' : 'Supabase não configurado'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Olá, {settings.portfolio_name}
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Painel autoral de gerenciamento de conteúdo, design tokens, blocos de mídia (imagens, YouTube, áudio com transcrição) e acessibilidade WCAG 2.2 AA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenProjectEditor()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-neutral-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Novo Projeto</span>
          </button>
          <button
            onClick={onOpenPreview}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver Portfólio Público</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Projetos</span>
            <FolderKanban className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">{projects.length}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {publishedCount} publicados • {draftCount} rascunhos
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Categorias</span>
            <Tags className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">{categories.length}</p>
          <p className="text-xs text-neutral-500 mt-1">Categorias autorais ativas</p>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Blocos de Mídia</span>
            <Layers className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">{blocks.length}</p>
          <p className="text-xs text-neutral-500 mt-1">Textos, imagens, vídeos, áudio</p>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Design System</span>
            <Palette className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <p className="text-lg font-bold text-neutral-900 dark:text-white capitalize">
            {settings.theme_config.font_heading}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {settings.theme_config.grid_columns} colunas • {settings.theme_config.border_radius} radius
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">
          Ações Rápidas de Administração
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateTab('projetos')}
            className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white rounded-xl text-left transition-all hover:-translate-y-0.5 shadow-xs flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div>
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-lg w-fit mb-3">
                <FolderKanban className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              </div>
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Gerenciar Projetos</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Adicionar capas, blocos de texto, imagens, vídeos do YouTube e arquivos de áudio.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-neutral-900 dark:text-white underline">Acessar Projetos →</span>
          </button>

          <button
            onClick={() => onNavigateTab('categorias')}
            className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white rounded-xl text-left transition-all hover:-translate-y-0.5 shadow-xs flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div>
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-lg w-fit mb-3">
                <Tags className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              </div>
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Categorias Autorais</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Criar categorias personalizadas, alterar ordem de exibição e gerenciar vínculos.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-neutral-900 dark:text-white underline">Acessar Categorias →</span>
          </button>

          <button
            onClick={() => onNavigateTab('aparencia')}
            className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white rounded-xl text-left transition-all hover:-translate-y-0.5 shadow-xs flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div>
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-lg w-fit mb-3">
                <Palette className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              </div>
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Design Tokens & Aparência</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Cores, tipografia com clamp, grid, bordas, sombras, motion e auditoria de contraste WCAG AA.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-neutral-900 dark:text-white underline">Acessar Tokens →</span>
          </button>

          <button
            onClick={() => onNavigateTab('sobre')}
            className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white rounded-xl text-left transition-all hover:-translate-y-0.5 shadow-xs flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div>
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-lg w-fit mb-3">
                <User className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              </div>
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Apresentação & Sobre</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Biografia, fotografia de perfil, redes sociais, WhatsApp e dados de contato.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-neutral-900 dark:text-white underline">Editar Perfil →</span>
          </button>
        </div>
      </div>


    </div>
  );
};
