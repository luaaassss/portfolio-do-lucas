import React, { useState, useEffect } from 'react';
import {
  Palette,
  Type,
  LayoutGrid,
  Square,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Save,
  RotateCcw,
  Sliders,
  MessageSquare,
} from 'lucide-react';
import { ThemeConfig, UxVoiceConfig, UxVoiceTone } from '../../types';
import { THEME_PRESETS, applyThemeToDOM } from '../../lib/themeManager';
import { auditContrast } from '../../lib/colorContrast';

interface AppearanceManagerProps {
  initialTheme: ThemeConfig;
  initialUxVoice: UxVoiceConfig;
  onSaveTheme: (theme: ThemeConfig, uxVoice: UxVoiceConfig) => void;
}

export const AppearanceManager: React.FC<AppearanceManagerProps> = ({
  initialTheme,
  initialUxVoice,
  onSaveTheme,
}) => {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [uxVoice, setUxVoice] = useState<UxVoiceConfig>(initialUxVoice);
  const [activeSubTab, setActiveSubTab] = useState<'colors' | 'typography' | 'grid' | 'shapes' | 'motion' | 'voice' | 'presets'>('colors');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Apply preview to DOM in real-time as user adjusts sliders/inputs
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const handleApplyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setTheme((prev) => ({ ...prev, ...preset.config }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTheme(theme, uxVoice);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // WCAG Contrast audits
  const textOnBgAudit = auditContrast(theme.color_text_primary, theme.color_background);
  const secTextOnBgAudit = auditContrast(theme.color_text_secondary, theme.color_background);
  const textOnSurfaceAudit = auditContrast(theme.color_text_primary, theme.color_surface);
  const buttonContrastAudit = auditContrast(theme.color_surface, theme.color_primary);

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Design Tokens & Identidade Autoral
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure o Design System do seu portfólio: cores, tipografia, grid, formas, motion e tom de voz.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Design System</span>
        </button>
      </div>

      {savedSuccess && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-3 animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Tokens salvos e aplicados com sucesso!</p>
            <p className="text-neutral-600">As variáveis visuais e configurações de tom de voz foram persistidas.</p>
          </div>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('colors')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'colors'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Cores & Contraste WCAG</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('typography')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'typography'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Tipografia & Escala</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('grid')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'grid'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Grid & Layout</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('shapes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'shapes'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span>Bordas, Radius & Sombras</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('motion')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'motion'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Motion & Transições</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('voice')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'voice'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tom de Voz & UX Writing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('presets')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'presets'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Estilos & Presets</span>
        </button>
      </div>

      {/* Main Grid: Controls + Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editor controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: COLORS & WCAG AUDIT */}
          {activeSubTab === 'colors' && (
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Paleta de Cores e Tokens
                </h3>
              </div>

              {/* Color Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Fundo da Página (Background)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.color_background}
                      onChange={(e) => setTheme({ ...theme, color_background: e.target.value })}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.color_background}
                      onChange={(e) => setTheme({ ...theme, color_background: e.target.value })}
                      className="w-28 px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Superfície dos Cards (Surface)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.color_surface}
                      onChange={(e) => setTheme({ ...theme, color_surface: e.target.value })}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.color_surface}
                      onChange={(e) => setTheme({ ...theme, color_surface: e.target.value })}
                      className="w-28 px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Texto Principal (Text Primary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.color_text_primary}
                      onChange={(e) => setTheme({ ...theme, color_text_primary: e.target.value })}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.color_text_primary}
                      onChange={(e) => setTheme({ ...theme, color_text_primary: e.target.value })}
                      className="w-28 px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Texto Secundário (Text Secondary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.color_text_secondary}
                      onChange={(e) => setTheme({ ...theme, color_text_secondary: e.target.value })}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.color_text_secondary}
                      onChange={(e) => setTheme({ ...theme, color_text_secondary: e.target.value })}
                      className="w-28 px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Cor Primária (Botões & Títulos)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.color_primary}
                      onChange={(e) => setTheme({ ...theme, color_primary: e.target.value })}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.color_primary}
                      onChange={(e) => setTheme({ ...theme, color_primary: e.target.value })}
                      className="w-28 px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Cor de Destaque / Acento (Accent)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.color_accent}
                      onChange={(e) => setTheme({ ...theme, color_accent: e.target.value })}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.color_accent}
                      onChange={(e) => setTheme({ ...theme, color_accent: e.target.value })}
                      className="w-28 px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Bordas e Divisórias (Border)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.color_border}
                      onChange={(e) => setTheme({ ...theme, color_border: e.target.value })}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.color_border}
                      onChange={(e) => setTheme({ ...theme, color_border: e.target.value })}
                      className="w-28 px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Foco de Teclado (Focus Outline)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.color_focus}
                      onChange={(e) => setTheme({ ...theme, color_focus: e.target.value })}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.color_focus}
                      onChange={(e) => setTheme({ ...theme, color_focus: e.target.value })}
                      className="w-28 px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* LIVE WCAG 2.2 AA CONTRAST AUDIT (Section 42 requirement) */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Auditoria de Contraste WCAG 2.2 AA em Tempo Real</span>
                </h4>

                <div className="space-y-2">
                  {/* Test 1 */}
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Texto Principal vs Fundo</p>
                      <p className="text-neutral-500 text-[11px]">{textOnBgAudit.statusText}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded font-mono font-bold text-xs ${
                        textOnBgAudit.passesAABody ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {textOnBgAudit.formattedRatio} {textOnBgAudit.passesAABody ? '✓ AA' : '✗ Falha'}
                    </span>
                  </div>

                  {/* Test 2 */}
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Texto Secundário vs Fundo</p>
                      <p className="text-neutral-500 text-[11px]">{secTextOnBgAudit.statusText}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded font-mono font-bold text-xs ${
                        secTextOnBgAudit.passesAABody ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {secTextOnBgAudit.formattedRatio} {secTextOnBgAudit.passesAABody ? '✓ AA' : '⚠ Baixo'}
                    </span>
                  </div>

                  {/* Test 3 */}
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">Texto Principal vs Superfície do Card</p>
                      <p className="text-neutral-500 text-[11px]">{textOnSurfaceAudit.statusText}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded font-mono font-bold text-xs ${
                        textOnSurfaceAudit.passesAABody ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {textOnSurfaceAudit.formattedRatio} {textOnSurfaceAudit.passesAABody ? '✓ AA' : '✗ Falha'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY */}
          {activeSubTab === 'typography' && (
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Tipografia & Hierarquia
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Fonte dos Títulos (Heading)
                  </label>
                  <select
                    value={theme.font_heading}
                    onChange={(e) => setTheme({ ...theme, font_heading: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="newsreader">Newsreader (Editorial Clássico)</option>
                    <option value="syne">Syne (Geométrica Expressiva)</option>
                    <option value="space-grotesk">Space Grotesk (Brutalista / Tech)</option>
                    <option value="cinzel">Cinzel (Lapidar / Nobre)</option>
                    <option value="instrument-serif">Instrument Serif (Elegante Fina)</option>
                    <option value="plus-jakarta">Plus Jakarta Sans (Moderna Neutra)</option>
                    <option value="jetbrains-mono">JetBrains Mono (Código / Arte Generativa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Fonte do Corpo de Texto (Body)
                  </label>
                  <select
                    value={theme.font_body}
                    onChange={(e) => setTheme({ ...theme, font_body: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="plus-jakarta">Plus Jakarta Sans (Legibilidade Alta)</option>
                    <option value="space-grotesk">Space Grotesk (Designers & Arquitetos)</option>
                    <option value="newsreader">Newsreader (Leitura Literária)</option>
                    <option value="jetbrains-mono">JetBrains Mono (Monospace Acessível)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Escala Tipográfica
                  </label>
                  <select
                    value={theme.scale_ratio}
                    onChange={(e) => setTheme({ ...theme, scale_ratio: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="compact">Compacta (1.15 - Mais densa)</option>
                    <option value="normal">Equilibrada (1.25 - Major Second)</option>
                    <option value="expressive">Expressiva (1.333 - Perfect Fourth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Tamanho Base da Fonte ({theme.base_font_size}px)
                  </label>
                  <input
                    type="range"
                    min={14}
                    max={20}
                    step={1}
                    value={theme.base_font_size}
                    onChange={(e) => setTheme({ ...theme, base_font_size: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                    <span>14px</span>
                    <span>16px (Padrão)</span>
                    <span>20px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GRID & LAYOUT */}
          {activeSubTab === 'grid' && (
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Grid & Proporções
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Colunas do Grid de Projetos
                  </label>
                  <select
                    value={theme.grid_columns}
                    onChange={(e) => setTheme({ ...theme, grid_columns: parseInt(e.target.value) as any })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value={1}>1 Coluna (Editorial / Lista Ampla)</option>
                    <option value={2}>2 Colunas (Equilibrado / Padrão)</option>
                    <option value={3}>3 Colunas (Mosaico / Visual)</option>
                    <option value={4}>4 Colunas (Grid Denso)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Largura Máxima da Página ({theme.max_width_px}px)
                  </label>
                  <select
                    value={theme.max_width_px}
                    onChange={(e) => setTheme({ ...theme, max_width_px: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value={1024}>1024px (Mais Contido / Foco na Leitura)</option>
                    <option value={1200}>1200px (Padrão Equilibrado)</option>
                    <option value={1400}>1400px (Expansivo / Telas Largas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Espaçamento entre Cards (Gap: {theme.grid_gap_px}px)
                  </label>
                  <input
                    type="range"
                    min={16}
                    max={48}
                    step={8}
                    value={theme.grid_gap_px}
                    onChange={(e) => setTheme({ ...theme, grid_gap_px: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                    <span>16px</span>
                    <span>32px</span>
                    <span>48px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SHAPES, RADIUS & SHADOWS */}
          {activeSubTab === 'shapes' && (
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Bordas, Arredondamentos & Sombras
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Border Radius (Arredondamento)
                  </label>
                  <select
                    value={theme.border_radius}
                    onChange={(e) => setTheme({ ...theme, border_radius: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="none">Reto (0px - Brutalista)</option>
                    <option value="sm">Leve (4px - Editorial)</option>
                    <option value="md">Médio (8px - Contemporâneo)</option>
                    <option value="lg">Arredondado (16px - Acolhedor)</option>
                    <option value="xl">Super Arredondado (24px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Espessura da Borda ({theme.border_width}px)
                  </label>
                  <select
                    value={theme.border_width}
                    onChange={(e) => setTheme({ ...theme, border_width: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value={0}>Sem borda (0px)</option>
                    <option value={1}>Fina (1px)</option>
                    <option value={2}>Média (2px)</option>
                    <option value={3}>Grossa (3px - Forte)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Nível de Sombra (Elevation)
                  </label>
                  <select
                    value={theme.shadow_level}
                    onChange={(e) => setTheme({ ...theme, shadow_level: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="none">Nenhuma (Plana / Flat)</option>
                    <option value="sm">Sutil (Small)</option>
                    <option value="md">Média (Medium)</option>
                    <option value="lg">Elevada (Large)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MOTION */}
          {activeSubTab === 'motion' && (
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Microinterações & Motion Design
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Velocidade das Transições
                  </label>
                  <select
                    value={theme.motion_duration}
                    onChange={(e) => setTheme({ ...theme, motion_duration: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="fast">Rápida (150ms)</option>
                    <option value="normal">Normal (280ms)</option>
                    <option value="slow">Suave / Lenta (450ms)</option>
                    <option value="none">Sem animação (Respeito a Reduced Motion)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Curva de Easing
                  </label>
                  <select
                    value={theme.motion_easing}
                    onChange={(e) => setTheme({ ...theme, motion_easing: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="smooth">Smooth (Cubic Bezier Orgânica)</option>
                    <option value="snappy">Snappy (Dinâmica / Responsiva)</option>
                    <option value="linear">Linear</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: UX WRITING */}
          {activeSubTab === 'voice' && (
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Tom de Voz & Textos Customizáveis (UX Writing)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Tom de Voz do Portfólio
                  </label>
                  <select
                    value={uxVoice.tone}
                    onChange={(e) => setUxVoice({ ...uxVoice, tone: e.target.value as UxVoiceTone })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="poetic">Poético & Sensível</option>
                    <option value="direct">Direto & Objetivo</option>
                    <option value="informal">Informal & Próximo</option>
                    <option value="academic">Acadêmico & Pesquisa</option>
                    <option value="experimental">Experimental & Disruptivo</option>
                    <option value="professional">Profissional / Executivo</option>
                    <option value="minimalist">Minimalista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Rótulo do Botão nos Cards de Projetos
                  </label>
                  <input
                    type="text"
                    value={uxVoice.cta_project_label}
                    onChange={(e) => setUxVoice({ ...uxVoice, cta_project_label: e.target.value })}
                    placeholder="Ex: Explorar projeto, Ver projeto, Abrir"
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Rótulo do Botão de Envio de Contato
                  </label>
                  <input
                    type="text"
                    value={uxVoice.cta_contact_label}
                    onChange={(e) => setUxVoice({ ...uxVoice, cta_contact_label: e.target.value })}
                    placeholder="Ex: Iniciar conversa no WhatsApp"
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PRESETS */}
          {activeSubTab === 'presets' && (
            <div className="p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Estilos & Presets de Inspiração
              </h3>
              <p className="text-xs text-neutral-500">
                Escolha uma proposta estética inicial e continue personalizando os tokens individuais livremente.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset.id)}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white rounded-xl text-left transition-all hover:-translate-y-0.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-neutral-900 dark:text-white text-xs">{preset.name}</h4>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: preset.config.color_background }}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.config.color_primary }}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.config.color_accent }}
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Preview em Tempo Real dos Tokens
            </h3>

            {/* Preview Box */}
            <div
              className="p-6 border transition-all duration-300 space-y-5"
              style={{
                backgroundColor: theme.color_background,
                borderColor: theme.color_border,
                borderRadius:
                  theme.border_radius === 'none'
                    ? '0px'
                    : theme.border_radius === 'sm'
                    ? '4px'
                    : theme.border_radius === 'md'
                    ? '8px'
                    : theme.border_radius === 'lg'
                    ? '16px'
                    : '24px',
              }}
            >
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: theme.color_accent }}
                >
                  Identidade Visual & Mídia
                </span>
                <h4
                  className="text-xl font-bold mt-1 tracking-tight leading-snug"
                  style={{
                    color: theme.color_text_primary,
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  Sinestesia Tipográfica: Frequências & Glifos
                </h4>
              </div>

              {/* Sample Card */}
              <div
                className="p-4 border transition-all"
                style={{
                  backgroundColor: theme.color_surface,
                  borderColor: theme.color_border,
                  borderRadius:
                    theme.border_radius === 'none'
                      ? '0px'
                      : theme.border_radius === 'sm'
                      ? '4px'
                      : theme.border_radius === 'md'
                      ? '6px'
                      : '12px',
                  boxShadow:
                    theme.shadow_level === 'sm'
                      ? '0 1px 3px rgba(0,0,0,0.08)'
                      : theme.shadow_level === 'md'
                      ? '0 4px 6px -1px rgba(0,0,0,0.1)'
                      : theme.shadow_level === 'lg'
                      ? '0 10px 15px -3px rgba(0,0,0,0.1)'
                      : 'none',
                }}
              >
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: theme.color_text_secondary,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Pesquisa investigando a transdução de harmônicos acústicos em caracteres tipográficos variáveis.
                </p>

                <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: theme.color_border }}>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-transform hover:scale-105"
                    style={{
                      backgroundColor: theme.color_primary,
                      color: theme.color_surface,
                    }}
                  >
                    {uxVoice.cta_project_label || 'Explorar projeto'}
                  </button>

                  <span className="text-[11px] font-mono" style={{ color: theme.color_accent }}>
                    2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
