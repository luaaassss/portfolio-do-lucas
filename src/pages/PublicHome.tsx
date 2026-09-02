import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  FolderKanban,
  MessageSquare,
  Clock,
  Layers,
  ShieldCheck,
  Award,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import { PortfolioSettings, Category, Project } from '../types';
import { CategoryFilter } from '../components/public/CategoryFilter';
import { ProjectCard } from '../components/public/ProjectCard';

interface PublicHomeProps {
  settings: PortfolioSettings;
  categories: Category[];
  projects: Project[];
  onSelectProject: (slug: string) => void;
  onNavigate: (page: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  settings,
  categories,
  projects,
  onSelectProject,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter only published projects for public display
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.status === 'published');
  }, [projects]);

  // Apply category filter
  const displayedProjects = useMemo(() => {
    if (!selectedCategory) return publishedProjects;
    return publishedProjects.filter((p) => p.category_id === selectedCategory);
  }, [publishedProjects, selectedCategory]);

  const featuredProject = useMemo(() => {
    return publishedProjects.find((p) => p.featured) || publishedProjects[0];
  }, [publishedProjects]);

  // Project counts per category for filter badges
  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    publishedProjects.forEach((p) => {
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      }
    });
    return counts;
  }, [publishedProjects]);

  return (
    <div className="space-y-10 sm:space-y-12 animate-in fade-in duration-300">
      {/* ─── BENTO GRID HERO SECTION ─── */}
      <section aria-label="Apresentação em Bento Grid" className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Main Big Bento Hero Card */}
        <div className="md:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[360px] sm:min-h-[400px]">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{settings.location || 'Brasil'}</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary, #18181B)',
              }}
            >
              {settings.portfolio_name || 'Design & Tecnologia'}
            </h1>

            <p
              className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-secondary, #71717A)',
              }}
            >
              {settings.tagline || settings.short_bio}
            </p>
          </div>

          <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
            <a
              href="#projetos-showcase"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-transform hover:scale-[1.02] shadow-xs"
            >
              <span>{settings.ux_voice?.cta_project_label || 'Ver Projetos'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => onNavigate('contato')}
              className="inline-flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <span>Iniciar contato</span>
            </button>
          </div>

          {/* Ambient blur blob in the corner */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-100 dark:bg-indigo-950/40 rounded-full blur-3xl opacity-60 pointer-events-none" />
        </div>

        {/* Right Top: Availability Bento Card (Indigo High-Impact) */}
        <div className="md:col-span-4 bg-indigo-600 text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs relative overflow-hidden min-h-[190px]">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-xs">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-white/15 px-2.5 py-1 rounded-full">
              Disponibilidade
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight">Aberto para projetos</div>
            <p className="text-indigo-100 text-xs mt-1 leading-relaxed">
              Disponível para consultorias de design, sistemas interativos e contratos de inovação.
            </p>
          </div>
        </div>

        {/* Bento Card: WCAG 2.2 AA & Rigor */}
        <div className="md:col-span-4 bg-zinc-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xs min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight">Acessibilidade Total</span>
            </div>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full uppercase">
              Auditado
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xl font-bold">100% WCAG 2.2 AA</div>
            <p className="text-zinc-400 text-xs mt-0.5">Contraste, foco e suporte semântico rigoroso.</p>
          </div>
        </div>

        {/* Bento Card: Expertise & Research Areas */}
        <div className="md:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">
            Especialidades & Pesquisa
          </span>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-xs font-medium border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-zinc-800 dark:text-zinc-200">Design de Interfaces</span>
              <span className="text-zinc-400 font-mono text-[11px]">01</span>
            </li>
            <li className="flex justify-between items-center text-xs font-medium border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-zinc-800 dark:text-zinc-200">Design Systems & Tokens</span>
              <span className="text-zinc-400 font-mono text-[11px]">02</span>
            </li>
            <li className="flex justify-between items-center text-xs font-medium border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-zinc-800 dark:text-zinc-200">Tipografia & Novas Mídias</span>
              <span className="text-zinc-400 font-mono text-[11px]">03</span>
            </li>
            <li className="flex justify-between items-center text-xs font-medium">
              <span className="text-zinc-800 dark:text-zinc-200">Engenharia Front-end</span>
              <span className="text-zinc-400 font-mono text-[11px]">04</span>
            </li>
          </ul>
        </div>

        {/* Bento Card: Fast Metric Stats */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-xs">
            <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {publishedProjects.length}+
            </div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">
              Projetos
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-xs">
            <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {categories.length}
            </div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">
              Categorias
            </div>
          </div>
          <button
            onClick={() => onNavigate('sobre')}
            className="col-span-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-4 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-800 dark:text-zinc-200 shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">Conhecer Trajetória</div>
                <div className="text-[11px] text-zinc-500">Biografia & Processos</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </section>

      {/* ─── PROJECTS SHOWCASE SECTION ─── */}
      <section id="projetos-showcase" aria-labelledby="projects-section-title" className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest block mb-1 text-indigo-600 dark:text-indigo-400"
            >
              Portfólio & Galeria
            </span>
            <h2
              id="projects-section-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white"
              style={{
                fontFamily: 'var(--font-heading)',
              }}
            >
              Projetos Selecionados
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-500">
            {displayedProjects.length} {displayedProjects.length === 1 ? 'projeto listado' : 'projetos listados'}
          </span>
        </div>

        {/* Category Filters (Bento Pills) */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
          projectCounts={projectCounts}
          totalCount={publishedProjects.length}
        />

        {/* Dynamic Project Grid in Bento Card Style */}
        {displayedProjects.length === 0 ? (
          <div
            className="p-12 text-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl"
          >
            <FolderKanban className="w-10 h-10 mx-auto mb-3 opacity-30 text-zinc-400" />
            <p className="font-semibold text-base text-zinc-800 dark:text-zinc-200">
              Nenhum projeto encontrado nesta categoria
            </p>
            <p className="text-xs mt-1 text-zinc-500">
              Selecione "Todos os Projetos" ou utilize o painel administrativo para criar novas publicações.
            </p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              settings.theme_config.grid_columns === 1
                ? 'md:grid-cols-1'
                : settings.theme_config.grid_columns === 3
                ? 'md:grid-cols-2 lg:grid-cols-3'
                : settings.theme_config.grid_columns === 4
                ? 'sm:grid-cols-2 lg:grid-cols-4'
                : 'md:grid-cols-2'
            }`}
            style={{ gap: `${settings.theme_config.grid_gap_px || 20}px` }}
          >
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                category={categories.find((c) => c.id === project.category_id)}
                uxVoice={settings.ux_voice}
                onOpenProject={(slug) => onSelectProject(slug)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ─── CONTACT CALL-OUT BENTO CARD ─── */}
      <section
        className="p-8 sm:p-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs relative overflow-hidden"
      >
        <div className="space-y-2 max-w-xl relative z-10">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Vamos colaborar?
          </span>
          <h3
            className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            Tem interesse em discutir um projeto ou consultoria?
          </h3>
          <p
            className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"
            style={{
              fontFamily: 'var(--font-body)',
            }}
          >
            Estou disponível para projetos autorais, sistemas de design de larga escala, pesquisas criativas e direção de arte.
          </p>
        </div>

        <button
          onClick={() => onNavigate('contato')}
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-transform hover:scale-[1.02] shadow-xs cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Falar no WhatsApp</span>
        </button>

        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-zinc-100 dark:bg-zinc-800/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      </section>
    </div>
  );
};
