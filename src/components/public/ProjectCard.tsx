import React from 'react';
import { ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { Project, Category, UxVoiceConfig } from '../../types';

interface ProjectCardProps {
  project: Project;
  category?: Category;
  uxVoice: UxVoiceConfig;
  onOpenProject: (slug: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  category,
  uxVoice,
  onOpenProject,
}) => {
  return (
    <article
      onClick={() => onOpenProject(project.slug || project.id)}
      className="group cursor-pointer flex flex-col h-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md focus-within:ring-2 focus-within:ring-offset-2 overflow-hidden relative"
      style={{
        outlineColor: 'var(--color-focus, #4F46E5)',
      }}
    >
      {/* Cover Image Container with nested rounded-2xl border radius */}
      <div className="relative w-full aspect-16/10 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden mb-4">
        {project.cover_image ? (
          <img
            src={project.cover_image}
            alt={`Capa do projeto: ${project.title}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-xs font-mono">
            <span>[Sem imagem de capa]</span>
          </div>
        )}

        {/* Featured Tag */}
        {project.featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 text-white backdrop-blur-xs text-[11px] font-mono font-semibold uppercase tracking-wider rounded-full shadow-xs">
            <Sparkles className="w-3 h-3 text-indigo-400" aria-hidden="true" />
            <span>Destaque</span>
          </div>
        )}

        {/* Year */}
        {project.year && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 backdrop-blur-xs text-[11px] font-mono font-semibold rounded-full shadow-xs">
            <Calendar className="w-3 h-3 text-zinc-500" aria-hidden="true" />
            <span>{project.year}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between gap-4 px-1 pb-1">
        <div className="space-y-2">
          {/* Category Tag */}
          {category && (
            <span
              className="inline-block text-xs font-mono font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400"
            >
              {category.name}
            </span>
          )}

          {/* Title */}
          <h3
            className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            {project.title}
          </h3>

          {/* Short description */}
          {project.short_description && (
            <p
              className="text-xs sm:text-sm leading-relaxed line-clamp-2 text-zinc-500 dark:text-zinc-400"
              style={{
                fontFamily: 'var(--font-body)',
              }}
            >
              {project.short_description}
            </p>
          )}
        </div>

        {/* CTA Bar */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          >
            {uxVoice?.cta_project_label || 'Ver projeto'}
          </span>
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  );
};
