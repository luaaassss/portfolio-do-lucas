import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Eye,
  EyeOff,
  Search,
  FolderKanban,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { Project, Category } from '../../types';
import { Modal } from '../common/Modal';

interface ProjectsManagerProps {
  projects: Project[];
  categories: Category[];
  onOpenEditor: (projectId?: string) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleStatus: (project: Project) => void;
  onReorderProjects: (orderedIds: string[]) => void;
  onViewPublicProject: (slug: string) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  categories,
  onOpenEditor,
  onDeleteProject,
  onToggleStatus,
  onReorderProjects,
  onViewPublicProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const getCategoryName = (catId?: string) => {
    if (!catId) return 'Sem Categoria';
    return categories.find((c) => c.id === catId)?.name || 'Sem Categoria';
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' || p.category_id === selectedCategoryFilter;

    const matchesStatus =
      selectedStatusFilter === 'all' || p.status === selectedStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    onReorderProjects(newProjects.map((p) => p.id));
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Gerenciamento de Projetos
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cadastre, edite blocos de conteúdo, altere a ordem e publique seus trabalhos autorais.
          </p>
        </div>
        <button
          onClick={() => onOpenEditor()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Projeto</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, resumo ou slug..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Category filter */}
        <div className="w-full md:w-auto">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Filtrar por categoria"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="w-full md:w-auto">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Filtrar por status"
          >
            <option value="all">Todos os Status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-xs">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <FolderKanban className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
            <p className="font-semibold text-sm">Nenhum projeto encontrado</p>
            <p className="text-xs text-neutral-400 mt-1">
              {projects.length === 0
                ? 'Você ainda não cadastrou nenhum projeto no portfólio.'
                : 'Nenhum projeto corresponde aos filtros selecionados.'}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => onOpenEditor()}
                className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
              >
                Criar primeiro projeto
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:border-neutral-700">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex-shrink-0">
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={`Miniatura de ${project.title}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                        Sem capa
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                          <Sparkles className="w-3 h-3" />
                          Destaque
                        </span>
                      )}
                      <button
                        onClick={() => onToggleStatus(project)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          project.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                        }`}
                        title="Clique para alternar entre publicado e rascunho"
                      >
                        {project.status === 'published' ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Publicado</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-neutral-500" />
                            <span>Rascunho</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {getCategoryName(project.category_id)}
                      </span>
                      {project.year && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{project.year}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="font-mono text-[11px]">/{project.slug}</span>
                    </div>

                    {project.short_description && (
                      <p className="text-xs text-neutral-500 line-clamp-1 max-w-xl">
                        {project.short_description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-black"
                    aria-label={`Mover projeto ${project.title} para cima`}
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === projects.length - 1}
                    className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-black"
                    aria-label={`Mover projeto ${project.title} para baixo`}
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 mx-1" />

                  <button
                    onClick={() => onViewPublicProject(project.slug)}
                    className="p-1.5 rounded text-neutral-600 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-1 focus:ring-black"
                    aria-label={`Ver página pública do projeto ${project.title}`}
                    title="Ver página pública"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenEditor(project.id)}
                    className="p-1.5 rounded text-neutral-600 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-1 focus:ring-black"
                    aria-label={`Editar projeto ${project.title}`}
                    title="Editar projeto e blocos"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProjectToDelete(project)}
                    className="p-1.5 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    aria-label={`Excluir projeto ${project.title}`}
                    title="Excluir projeto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        title="Confirmar Exclusão de Projeto"
        description="Esta ação excluirá permanentemente o projeto e todos os seus blocos associados."
        maxWidth="md"
      >
        {projectToDelete && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Tem certeza que deseja excluir o projeto <strong>"{projectToDelete.title}"</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Sim, Excluir Projeto
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
