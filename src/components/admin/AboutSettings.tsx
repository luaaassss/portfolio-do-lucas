import React, { useState } from 'react';
import { Save, Upload, Plus, Trash2, CheckCircle2, User, Phone, Mail, MapPin, Globe, Sparkles } from 'lucide-react';
import { PortfolioSettings, SocialLink, UxVoiceTone } from '../../types';
import { StorageEngine } from '../../lib/storageEngine';

interface AboutSettingsProps {
  settings: PortfolioSettings;
  onSave: (updated: PortfolioSettings) => void;
}

export const AboutSettings: React.FC<AboutSettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<PortfolioSettings>(settings);
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const res = await StorageEngine.uploadMedia(file, 'profile');
    if (res.url) {
      setFormData((prev) => ({ ...prev, profile_image: res.url }));
    } else if (res.error) {
      alert(res.error);
    }
    setUploading(false);
  };

  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      id: `soc_${Date.now()}`,
      platform: 'GitHub',
      url: 'https://github.com/',
      label: 'GitHub',
    };
    setFormData((prev) => ({
      ...prev,
      social_links: [...prev.social_links, newLink],
    }));
  };

  const handleUpdateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...formData.social_links];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, social_links: updated }));
  };

  const handleRemoveSocialLink = (index: number) => {
    const updated = formData.social_links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, social_links: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Perfil, Apresentação & Contato
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cadastre o nome do portfólio, biografia, foto de perfil, número de WhatsApp e links externos.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {savedSuccess && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-3 animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Dados salvos com sucesso!</p>
            <p className="text-neutral-600">As informações foram atualizadas e persistidas de forma permanente.</p>
          </div>
        </div>
      )}

      {/* Grid: Identity & Profile Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info */}
        <div className="lg:col-span-2 space-y-4 p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Identidade do Portfólio</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="portfolio_name"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
              >
                Nome do Portfólio / Autor <span className="text-rose-500">*</span>
              </label>
              <input
                id="portfolio_name"
                type="text"
                value={formData.portfolio_name}
                onChange={(e) => setFormData({ ...formData, portfolio_name: e.target.value })}
                required
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
              >
                Localização / Cidade
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Santa Maria, RS — Brasil"
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tagline"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Tagline / Subtítulo de Apresentação
            </label>
            <input
              id="tagline"
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Ex: Designer de Interação, Tecnólogo Criativo & Pesquisador Visual"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="short_bio"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Biografia Resumida (Destaque)
            </label>
            <textarea
              id="short_bio"
              rows={2}
              value={formData.short_bio}
              onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
              placeholder="Uma frase marcante sobre sua atuação e pesquisa autoral."
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="about_title"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Título da Seção "Sobre"
            </label>
            <input
              id="about_title"
              type="text"
              value={formData.about_title}
              onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="about_text"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Texto Completo do "Sobre"
            </label>
            <textarea
              id="about_text"
              rows={6}
              value={formData.about_text}
              onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
              placeholder="Descreva sua trajetória, filosofia de trabalho, pesquisas e motivações autorais."
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Right 1 Col: Profile Photo */}
        <div className="space-y-4 p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs flex flex-col items-center text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Foto de Perfil / Retrato
          </h3>

          <div className="relative w-40 h-40 rounded-full border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-inner flex items-center justify-center">
            {formData.profile_image ? (
              <img
                src={formData.profile_image}
                alt={`Retrato de ${formData.portfolio_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-neutral-400" />
            )}
          </div>

          <div className="w-full space-y-2">
            <label className="block w-full">
              <span className="sr-only">Escolher arquivo de imagem</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                disabled={uploading}
                className="hidden"
                id="profile-image-upload"
              />
              <label
                htmlFor="profile-image-upload"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Processando Imagem...' : 'Fazer Upload de Foto'}</span>
              </label>
            </label>

            <div>
              <span className="text-[11px] text-neutral-500 block mb-1">Ou cole uma URL direta:</span>
              <input
                type="url"
                value={formData.profile_image || ''}
                onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Direct Contact Channels */}
      <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Canais de Contato & WhatsApp</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="whatsapp"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Número de WhatsApp (com DDI e DDD) <span className="text-rose-500">*</span>
            </label>
            <input
              id="whatsapp"
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="Ex: +55 55 99999-9999"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              * Utilizado no botão do formulário de contato para abrir a conversa pré-formatada.
            </p>
          </div>

          <div>
            <label
              htmlFor="email_public"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              E-mail Público
            </label>
            <input
              id="email_public"
              type="email"
              value={formData.email_public}
              onChange={(e) => setFormData({ ...formData, email_public: e.target.value })}
              placeholder="lucas.conceicao@acad.ufsm.br"
              className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* External Links & Social Networks */}
      <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Redes e Plataformas Externas</span>
          </h3>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Link</span>
          </button>
        </div>

        {formData.social_links.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-2">
            Nenhuma rede externa cadastrada. Clique em "Adicionar Link" acima.
          </p>
        ) : (
          <div className="space-y-3">
            {formData.social_links.map((link, index) => (
              <div
                key={link.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
              >
                <div className="sm:w-1/4">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleUpdateSocialLink(index, 'label', e.target.value)}
                    placeholder="Nome (Ex: GitHub, Behance)"
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="sm:flex-1">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUpdateSocialLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors self-end sm:self-center"
                  aria-label={`Remover link ${link.label}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};
