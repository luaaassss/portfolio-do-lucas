import React from 'react';
import { Check } from 'lucide-react';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  projectCounts: Record<string, number>;
  totalCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  projectCounts,
  totalCount,
}) => {
  return (
    <div
      role="region"
      aria-label="Filtrar projetos por categoria"
      className="w-full mb-6 pb-1 overflow-x-auto"
    >
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Categorias de projetos">
        {/* All Projects button */}
        <button
          onClick={() => onSelectCategory(null)}
          aria-pressed={selectedCategoryId === null}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            selectedCategoryId === null
              ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-xs'
              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
          }`}
          style={{
            outlineColor: 'var(--color-focus, #4F46E5)',
          }}
        >
          {selectedCategoryId === null && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
          <span>Todos os Projetos</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              selectedCategoryId === null
                ? 'bg-white/20 text-white dark:bg-black/10 dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Category list */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const count = projectCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isSelected}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isSelected
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
              }`}
              style={{
                outlineColor: 'var(--color-focus, #4F46E5)',
              }}
            >
              {isSelected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
              <span>{cat.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white dark:bg-black/10 dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
