import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Tags, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Category, Project } from '../../types';
import { Modal } from '../common/Modal';

interface CategoriesManagerProps {
  categories: Category[];
  projects: Project[];
  onSaveCategory: (category: Partial<Category> & { name: string }) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories: (orderedIds: string[]) => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  projects,
  onSaveCategory,
  onDeleteCategory,
  onReorderCategories,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Delete protection modal state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || '');
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setCatName(name);
    if (!editingCategory) {
      const generatedSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setCatSlug(generatedSlug);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    onSaveCategory({
      id: editingCategory?.id,
      name: catName.trim(),
      slug: catSlug.trim(),
      description: catDesc.trim(),
    });

    setIsModalOpen(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    onReorderCategories(newCategories.map((c) => c.id));
  };

  const promptDelete = (cat: Category) => {
    setCategoryToDelete(cat);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const getAssociatedProjects = (catId: string) => {
    return projects.filter((p) => p.category_id === catId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Categorias de Projetos
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Crie, ordene e estruture as categorias temáticas do seu portfólio.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Categoria</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-xs">
        {categories.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <Tags className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
            <p className="font-semibold text-sm">Nenhuma categoria cadastrada</p>
            <p className="text-xs text-neutral-400 mt-1">
              Cadastre sua primeira categoria temática para classificar seus projetos.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
            >
              Criar primeira categoria
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {categories.map((cat, index) => {
              const associated = getAssociatedProjects(cat.id);
              return (
                <div
                  key={cat.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-bold flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                        {cat.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-mono">
                        /{cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-neutral-500 max-w-xl pl-8">
                        {cat.description}
                      </p>
                    )}
                    <div className="pl-8 pt-1">
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {associated.length} {associated.length === 1 ? 'projeto vinculado' : 'projetos vinculados'}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Order Controls */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-black"
                      aria-label={`Mover categoria ${cat.name} para cima`}
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === categories.length - 1}
                      className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-black"
                      aria-label={`Mover categoria ${cat.name} para baixo`}
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 mx-1" />

                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded text-neutral-600 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-1 focus:ring-black"
                      aria-label={`Editar categoria ${cat.name}`}
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => promptDelete(cat)}
                      className="p-1.5 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      aria-label={`Excluir categoria ${cat.name}`}
                      title="Excluir categoria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create/Edit Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Editar Categoria' : 'Criar Nova Categoria'}
        description="Defina o nome, slug amigável para URL e descrição opcional da categoria."
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="cat-name"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Nome da Categoria <span className="text-rose-500">*</span>
            </label>
            <input
              id="cat-name"
              type="text"
              value={catName}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Ex: Design de Interfaces & Sistemas"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="cat-slug"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Slug (Identificador na URL)
            </label>
            <input
              id="cat-slug"
              type="text"
              value={catSlug}
              onChange={(e) => setCatSlug(e.target.value)}
              placeholder="interfaces-sistemas"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="cat-desc"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Descrição Breve <span className="text-neutral-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="cat-desc"
              rows={3}
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Ex: Design systems, microinterações, arquitetura de informação e interfaces acessíveis."
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {editingCategory ? 'Salvar Categoria' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Protection Warning for Category Deletion */}
      <Modal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        title="Confirmar Exclusão de Categoria"
        description="Atenção: verifique o impacto da exclusão desta categoria antes de prosseguir."
        maxWidth="md"
      >
        {categoryToDelete && (
          <div className="space-y-4">
            {getAssociatedProjects(categoryToDelete.id).length > 0 ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    Esta categoria possui {getAssociatedProjects(categoryToDelete.id).length} projeto(s) associado(s)!
                  </p>
                  <p className="text-neutral-600">
                    Ao excluir esta categoria, os projetos não serão apagados, mas ficarão desvinculados de categoria ("Sem Categoria").
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                Tem certeza que deseja remover a categoria <strong>"{categoryToDelete.name}"</strong>? Esta ação não pode ser desfeita.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Sim, Excluir Categoria
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
