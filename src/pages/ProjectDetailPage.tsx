import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  FolderKanban,
} from 'lucide-react';
import { Project, Category, ProjectBlock } from '../types';
import { TextBlock } from '../components/public/blocks/TextBlock';
import { ImageBlock } from '../components/public/blocks/ImageBlock';
import { YoutubeBlock } from '../components/public/blocks/YoutubeBlock';
import { AudioBlock } from '../components/public/blocks/AudioBlock';

interface ProjectDetailPageProps {
  project: Project;
  categories: Category[];
  allProjects: Project[];
  blocks: ProjectBlock[];
  onBack: () => void;
  onSelectProject: (slug: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  categories,
  allProjects,
  blocks,
  onBack,
  onSelectProject,
}) => {
  const category = categories.find((c) => c.id === project.category_id);

  // Sort blocks by display_order
  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => a.display_order - b.display_order);
  }, [blocks]);

  // Find previous and next projects for navigation
  const publishedProjects = useMemo(() => {
    return allProjects.filter((p) => p.status === 'published');
  }, [allProjects]);

  const currentIndex = publishedProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? publishedProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < publishedProjects.length - 1
      ? publishedProjects[currentIndex + 1]
      : null;

  return (
    <article className="space-y-10 sm:space-y-12 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Breadcrumb / Back button */}
      <nav aria-label="Navegação estrutural do projeto" className="pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 p-1 rounded-xl"
          style={{ outlineColor: 'var(--color-focus, #4F46E5)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Todos os Projetos</span>
        </button>
      </nav>

      {/* Project Header Bento Card */}
      <header className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          {category && (
            <span
              className="inline-block px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-indigo-600 dark:text-indigo-400"
            >
              {category.name}
            </span>
          )}

          {project.year && (
            <span
              className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-3 py-1 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-full"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{project.year}</span>
            </span>
          )}

          {project.featured && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white bg-zinc-900 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Projeto em Destaque</span>
            </span>
          )}
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight"
          style={{
            fontFamily: 'var(--font-heading)',
          }}
        >
          {project.title}
        </h1>

        {project.short_description && (
          <p
            className="text-base sm:text-lg lg:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-3xl"
            style={{
              fontFamily: 'var(--font-body)',
            }}
          >
            {project.short_description}
          </p>
        )}

        {/* Featured Cover Hero */}
        {project.cover_image && (
          <div
            className="relative w-full aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xs mt-6"
          >
            <img
              src={project.cover_image}
              alt={`Capa ilustrativa do projeto: ${project.title}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Sequential Content Blocks (Texts, Images, YouTube, Audio) */}
      <section aria-label="Conteúdo detalhado do projeto" className="space-y-8">
        {sortedBlocks.length === 0 ? (
          <div
            className="p-8 text-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl"
          >
            <p className="text-sm text-zinc-500">
              Nenhum bloco de conteúdo adicional cadastrado para este projeto.
            </p>
          </div>
        ) : (
          sortedBlocks.map((block) => {
            switch (block.type) {
              case 'text':
                return <TextBlock key={block.id} block={block} />;
              case 'image':
                return <ImageBlock key={block.id} block={block} />;
              case 'youtube':
                return <YoutubeBlock key={block.id} block={block} />;
              case 'audio':
                return <AudioBlock key={block.id} block={block} />;
              default:
                return null;
            }
          })
        )}
      </section>

      {/* Pagination Footer / Previous & Next Projects in Bento Cards */}
      <footer
        className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
      >
        {prevProject ? (
          <button
            onClick={() => onSelectProject(prevProject.slug)}
            className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl text-left transition-all hover:border-zinc-400 dark:hover:border-zinc-600 flex-1 max-w-sm shadow-xs"
          >
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 mb-1 text-indigo-600 dark:text-indigo-400"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Projeto Anterior</span>
            </span>
            <p
              className="font-bold text-sm truncate text-zinc-900 dark:text-white"
              style={{
                fontFamily: 'var(--font-heading)',
              }}
            >
              {prevProject.title}
            </p>
          </button>
        ) : (
          <div className="flex-1" />
        )}

        <button
          onClick={onBack}
          className="px-5 py-3.5 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider text-center text-zinc-800 dark:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
        >
          Todos os Projetos
        </button>

        {nextProject ? (
          <button
            onClick={() => onSelectProject(nextProject.slug)}
            className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl text-right transition-all hover:border-zinc-400 dark:hover:border-zinc-600 flex-1 max-w-sm shadow-xs"
          >
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-end gap-1 mb-1 text-indigo-600 dark:text-indigo-400"
            >
              <span>Próximo Projeto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <p
              className="font-bold text-sm truncate text-zinc-900 dark:text-white"
              style={{
                fontFamily: 'var(--font-heading)',
              }}
            >
              {nextProject.title}
            </p>
          </button>
        ) : (
          <div className="flex-1" />
        )}
      </footer>
    </article>
  );
};
