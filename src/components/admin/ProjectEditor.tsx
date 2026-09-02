import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  Type,
  Youtube,
  Music,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
} from 'lucide-react';
import { Project, Category, ProjectBlock, BlockType } from '../../types';
import { StorageEngine } from '../../lib/storageEngine';
import { extractYoutubeId } from '../public/blocks/YoutubeBlock';

interface ProjectEditorProps {
  project?: Project;
  categories: Category[];
  initialBlocks: ProjectBlock[];
  onSave: (projectData: Partial<Project> & { title: string }, blocks: ProjectBlock[]) => void | Promise<void>;
  onBack: () => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  project,
  categories,
  initialBlocks,
  onSave,
  onBack,
}) => {
  // Project basic metadata
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [categoryId, setCategoryId] = useState(project?.category_id || categories[0]?.id || '');
  const [shortDescription, setShortDescription] = useState(project?.short_description || '');
  const [coverImage, setCoverImage] = useState(project?.cover_image || '');
  const [year, setYear] = useState(project?.year || new Date().getFullYear().toString());
  const [status, setStatus] = useState<'draft' | 'published'>(project?.status || 'published');
  const [featured, setFeatured] = useState(project?.featured || false);

  // Content Blocks
  const [blocks, setBlocks] = useState<ProjectBlock[]>(initialBlocks || []);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBlockMedia, setUploadingBlockMedia] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!project && title && !slug) {
      const generated = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  }, [title, project, slug]);

  // Handle Cover Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const res = await StorageEngine.uploadMedia(file, 'covers');
    if (res.url) {
      setCoverImage(res.url);
    } else if (res.error) {
      alert(res.error);
    }
    setUploadingCover(false);
  };

  // Add a new content block
  const handleAddBlock = (type: BlockType) => {
    const newBlock: ProjectBlock = {
      id: `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      project_id: project?.id || 'temp_proj',
      type,
      content:
        type === 'text'
          ? '## Subtítulo da Seção\n\nDescreva os detalhes, processos e resultados do projeto nesta seção.'
          : type === 'audio'
          ? 'Gravação sonora / Paisagem acústica'
          : '',
      media_url:
        type === 'image'
          ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
          : type === 'youtube'
          ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          : type === 'audio'
          ? 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
          : '',
      alt_text:
        type === 'image'
          ? 'Descrição detalhada do elemento visual para acessibilidade'
          : type === 'audio'
          ? 'Áudio de experimentação'
          : '',
      caption: '',
      transcript:
        type === 'audio'
          ? '[Transcrição textual acessível da fala ou dos elementos sonoros presentes neste arquivo.]'
          : '',
      display_order: blocks.length + 1,
      created_at: new Date().toISOString(),
    };

    setBlocks([...blocks, newBlock]);
  };

  // Update block fields
  const handleUpdateBlock = (index: number, field: keyof ProjectBlock, value: string) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], [field]: value };
    setBlocks(updated);
  };

  // Block media upload (image or audio)
  const handleBlockMediaUpload = async (index: number, file: File, folder: string) => {
    const blockId = blocks[index].id;
    setUploadingBlockMedia(blockId);

    const res = await StorageEngine.uploadMedia(file, folder);
    if (res.url) {
      handleUpdateBlock(index, 'media_url', res.url);
    } else if (res.error) {
      alert(res.error);
    }
    setUploadingBlockMedia(null);
  };

  // Reorder block up/down
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    setBlocks(newBlocks);
  };

  // Delete block
  const handleDeleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  };

  // Validate and submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!title.trim()) errs.title = 'O título do projeto é obrigatório.';
    if (!slug.trim()) errs.slug = 'O slug identificador é obrigatório.';

    // Check that all image blocks have alt text
    blocks.forEach((b, idx) => {
      if (b.type === 'image' && !b.alt_text?.trim()) {
        errs[`block_alt_${idx}`] = `O bloco de imagem #${idx + 1} precisa de texto alternativo (alt text) para acessibilidade.`;
      }
    });

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      await onSave(
      {
        id: project?.id,
        title: title.trim(),
        slug: slug.trim(),
        category_id: categoryId || undefined,
        short_description: shortDescription.trim(),
        cover_image: coverImage.trim() || undefined,
        year: year.trim(),
        status,
        featured,
      },
        blocks
      );
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Não foi possível salvar o projeto.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      {errors.form && (
        <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-lg">
          {errors.form}
        </div>
      )}
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Voltar para a lista de projetos"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {project ? `Editar: ${project.title}` : 'Criar Novo Projeto'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Defina as informações gerais e componha os blocos de mídia e texto na ordem desejada.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Projeto'}</span>
          </button>
        </div>
      </div>

      {/* Success banner */}
      {savedNotice && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-3 animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Projeto e blocos salvos com sucesso!</p>
            <p className="text-neutral-600">As alterações foram persistidas de forma permanente.</p>
          </div>
        </div>
      )}

      {/* Errors list */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl space-y-1 animate-in fade-in"
        >
          <div className="flex items-center gap-2 font-bold text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Corrija os seguintes pontos para salvar:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5">
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* General Project Metadata */}
      <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 border-b pb-2">
          Informações Básicas do Projeto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Title */}
          <div className="md:col-span-8">
            <label
              htmlFor="proj-title"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Título do Projeto <span className="text-rose-500">*</span>
            </label>
            <input
              id="proj-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Sinestesia Tipográfica: Frequências & Glifos"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Year */}
          <div className="md:col-span-4">
            <label
              htmlFor="proj-year"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Ano de Realização
            </label>
            <input
              id="proj-year"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-6">
            <label
              htmlFor="proj-slug"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Slug (Identificador na URL) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-r-0 border-neutral-300 dark:border-neutral-700 rounded-l-lg text-xs font-mono text-neutral-500">
                /projetos/
              </span>
              <input
                id="proj-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="sinestesia-tipografica"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-r-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Category */}
          <div className="md:col-span-6">
            <label
              htmlFor="proj-category"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Categoria Temática
            </label>
            <select
              id="proj-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">-- Sem Categoria --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Short description */}
          <div className="md:col-span-12">
            <label
              htmlFor="proj-short-desc"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Apresentação Curta (Exibida no Card)
            </label>
            <textarea
              id="proj-short-desc"
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Breve resumo conceitual do projeto para a listagem pública."
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Cover Image */}
          <div className="md:col-span-12 space-y-2">
            <label
              htmlFor="proj-cover-url"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
            >
              Imagem de Capa do Projeto
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                id="proj-cover-url"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="flex-shrink-0 w-full sm:w-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors w-full"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadingCover ? 'Enviando...' : 'Upload de Imagem'}</span>
                </label>
              </div>
            </div>

            {coverImage && (
              <div className="mt-2 relative w-48 aspect-16/10 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <img src={coverImage} alt="Preview da capa" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Status & Featured */}
          <div className="md:col-span-6 flex items-center gap-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Status de Publicação:
            </label>
            <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 p-1 bg-neutral-100 dark:bg-neutral-900">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  status === 'published' ? 'bg-white dark:bg-neutral-800 shadow-xs text-neutral-900 dark:text-white' : 'text-neutral-500'
                }`}
              >
                Publicado
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  status === 'draft' ? 'bg-white dark:bg-neutral-800 shadow-xs text-neutral-900 dark:text-white' : 'text-neutral-500'
                }`}
              >
                Rascunho
              </button>
            </div>
          </div>

          <div className="md:col-span-6 flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured-toggle"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
            />
            <label
              htmlFor="featured-toggle"
              className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              Destacar projeto na página inicial
            </label>
          </div>
        </div>
      </div>

      {/* Content Blocks Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Blocos de Conteúdo do Projeto ({blocks.length})
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Construa a narrativa autoral combinando blocos de Texto, Imagens, Vídeos do YouTube e Áudio.
            </p>
          </div>

          {/* Add block buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddBlock('text')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Texto</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('image')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Imagem</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('youtube')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <Youtube className="w-3.5 h-3.5 text-rose-600" />
              <span>+ Vídeo YouTube</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('audio')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <Music className="w-3.5 h-3.5 text-purple-600" />
              <span>+ Áudio</span>
            </button>
          </div>
        </div>

        {/* Blocks List */}
        {blocks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-500">
            <p className="font-semibold text-sm">Nenhum bloco de conteúdo adicionado ainda.</p>
            <p className="text-xs text-neutral-400 mt-1">
              Adicione blocos de Texto, Imagens, Vídeos ou Áudios pelos botões acima.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-4 transition-all"
              >
                {/* Block header */}
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {block.type === 'text' && <Type className="w-4 h-4 text-blue-600" />}
                      {block.type === 'image' && <ImageIcon className="w-4 h-4 text-emerald-600" />}
                      {block.type === 'youtube' && <Youtube className="w-4 h-4 text-rose-600" />}
                      {block.type === 'audio' && <Music className="w-4 h-4 text-purple-600" />}
                      <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
                        Bloco de {block.type === 'text' ? 'Texto' : block.type === 'image' ? 'Imagem' : block.type === 'youtube' ? 'Vídeo YouTube' : 'Áudio com Transcrição'}
                      </span>
                    </div>
                  </div>

                  {/* Reorder and Delete controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`Mover bloco #${index + 1} para cima`}
                      title="Mover bloco para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`Mover bloco #${index + 1} para baixo`}
                      title="Mover bloco para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(index)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                      aria-label={`Remover bloco #${index + 1}`}
                      title="Remover bloco"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Block Fields based on Type */}

                {/* 1. TEXT BLOCK */}
                {block.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor={`text-content-${block.id}`}
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
                      >
                        Conteúdo do Texto (Suporta ## Subtítulos, - Listas e links)
                      </label>
                      <textarea
                        id={`text-content-${block.id}`}
                        rows={5}
                        value={block.content || ''}
                        onChange={(e) => handleUpdateBlock(index, 'content', e.target.value)}
                        placeholder="Escreva seu parágrafo ou use markdown: ## Título, - Item de lista, **negrito**"
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                )}

                {/* 2. IMAGE BLOCK */}
                {block.type === 'image' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image URL & Upload */}
                      <div className="space-y-2">
                        <label
                          htmlFor={`image-url-${block.id}`}
                          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                        >
                          URL da Imagem ou Upload
                        </label>
                        <input
                          id={`image-url-${block.id}`}
                          type="url"
                          value={block.media_url || ''}
                          onChange={(e) => handleUpdateBlock(index, 'media_url', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBlockMediaUpload(index, file, 'images');
                            }}
                            className="hidden"
                            id={`img-upload-${block.id}`}
                          />
                          <label
                            htmlFor={`img-upload-${block.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded text-xs font-semibold cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingBlockMedia === block.id ? 'Enviando...' : 'Fazer Upload'}</span>
                          </label>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div>
                        {block.media_url && (
                          <div className="relative w-full max-h-40 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                            <img src={block.media_url} alt={block.alt_text || 'Preview'} className="max-h-40 object-contain" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mandatory Alt Text for WCAG AA */}
                    <div>
                      <label
                        htmlFor={`image-alt-${block.id}`}
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
                      >
                        Texto Alternativo (Alt Text) <span className="text-rose-500">* Requisito WCAG AA</span>
                      </label>
                      <input
                        id={`image-alt-${block.id}`}
                        type="text"
                        value={block.alt_text || ''}
                        onChange={(e) => handleUpdateBlock(index, 'alt_text', e.target.value)}
                        placeholder="Descreva visualmente o que a imagem retrata para leitores de tela"
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    {/* Caption */}
                    <div>
                      <label
                        htmlFor={`image-caption-${block.id}`}
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
                      >
                        Legenda Visível (Opcional)
                      </label>
                      <input
                        id={`image-caption-${block.id}`}
                        type="text"
                        value={block.caption || ''}
                        onChange={(e) => handleUpdateBlock(index, 'caption', e.target.value)}
                        placeholder="Ex: Figura 1: Projeção de ondas sonoras em ambiente tridimensional."
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                )}

                {/* 3. YOUTUBE BLOCK */}
                {block.type === 'youtube' && (
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor={`yt-url-${block.id}`}
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
                      >
                        URL do Vídeo do YouTube <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id={`yt-url-${block.id}`}
                        type="url"
                        value={block.media_url || ''}
                        onChange={(e) => handleUpdateBlock(index, 'media_url', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`yt-caption-${block.id}`}
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
                      >
                        Título ou Legenda Acessível do Vídeo
                      </label>
                      <input
                        id={`yt-caption-${block.id}`}
                        type="text"
                        value={block.caption || block.content || ''}
                        onChange={(e) => {
                          handleUpdateBlock(index, 'caption', e.target.value);
                          handleUpdateBlock(index, 'content', e.target.value);
                        }}
                        placeholder="Ex: Registro audiovisual da instalação e interação dos visitantes."
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    {block.media_url && extractYoutubeId(block.media_url) && (
                      <div className="relative w-64 aspect-16/9 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-black">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${extractYoutubeId(block.media_url)}`}
                          title="Preview"
                          className="w-full h-full border-0 pointer-events-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 4. AUDIO BLOCK */}
                {block.type === 'audio' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Audio URL & Upload */}
                      <div className="space-y-2">
                        <label
                          htmlFor={`audio-url-${block.id}`}
                          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
                        >
                          URL do Arquivo de Áudio ou Upload (MP3, WAV, OGG)
                        </label>
                        <input
                          id={`audio-url-${block.id}`}
                          type="url"
                          value={block.media_url || ''}
                          onChange={(e) => handleUpdateBlock(index, 'media_url', e.target.value)}
                          placeholder="https://.../musica.mp3"
                          className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <div>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBlockMediaUpload(index, file, 'audio');
                            }}
                            className="hidden"
                            id={`aud-upload-${block.id}`}
                          />
                          <label
                            htmlFor={`aud-upload-${block.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded text-xs font-semibold cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingBlockMedia === block.id ? 'Enviando Áudio...' : 'Upload de Áudio'}</span>
                          </label>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <div>
                          <label
                            htmlFor={`audio-title-${block.id}`}
                            className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
                          >
                            Título da Faixa Sonora
                          </label>
                          <input
                            id={`audio-title-${block.id}`}
                            type="text"
                            value={block.content || ''}
                            onChange={(e) => handleUpdateBlock(index, 'content', e.target.value)}
                            placeholder="Ex: Paisagem acústica gerativa #01"
                            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`audio-caption-${block.id}`}
                            className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
                          >
                            Descrição Breve
                          </label>
                          <input
                            id={`audio-caption-${block.id}`}
                            type="text"
                            value={block.caption || ''}
                            onChange={(e) => handleUpdateBlock(index, 'caption', e.target.value)}
                            placeholder="Ex: Sintetizador modular com modulação em 110Hz"
                            className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Accessible Textual Transcript (Mandatory for WCAG 2.2 AA audio) */}
                    <div>
                      <label
                        htmlFor={`audio-transcript-${block.id}`}
                        className="block text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Transcrição Textual Acessível (WCAG AA)</span>
                      </label>
                      <textarea
                        id={`audio-transcript-${block.id}`}
                        rows={3}
                        value={block.transcript || ''}
                        onChange={(e) => handleUpdateBlock(index, 'transcript', e.target.value)}
                        placeholder="Insira a transcrição textual de falas, descrições de timbres e eventos sonoros para acessibilidade."
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    {block.media_url && (
                      <div className="pt-2">
                        <audio controls src={block.media_url} className="w-full h-8" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};
