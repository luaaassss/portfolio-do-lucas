import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
} from '../../lib/supabaseClient';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getSavedSupabaseConfig();
      setUrl(current.url);
      setAnonKey(current.anon_key);
      setTestResult(null);
    }
  }, [isOpen]);

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url.trim(), anonKey.trim());
    setTestResult(result);
    setTesting(false);

    if (result.success) {
      saveSupabaseConfig({
        url: url.trim(),
        anon_key: anonKey.trim(),
      });
      onConfigChanged();
    }
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult({
      success: true,
      message: 'Supabase desconectado. O portfólio está operando com persistência local segura.',
    });
    onConfigChanged();
  };

  const copySqlToClipboard = () => {
    const sqlContent = `-- Script de Configuração do Supabase para Portfólio Autoral
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings_default_01',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_name TEXT NOT NULL DEFAULT 'Portfólio Autoral',
  tagline TEXT DEFAULT '',
  about_title TEXT DEFAULT 'Sobre',
  about_text TEXT DEFAULT '',
  short_bio TEXT DEFAULT '',
  profile_image TEXT,
  whatsapp TEXT DEFAULT '',
  email_public TEXT DEFAULT '',
  location TEXT DEFAULT '',
  social_links JSONB DEFAULT '[]'::jsonb,
  ux_voice JSONB,
  theme_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT DEFAULT '',
  cover_image TEXT,
  year TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_blocks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  alt_text TEXT,
  caption TEXT,
  transcript TEXT,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Settings" ON public.portfolio_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Blocks" ON public.project_blocks FOR SELECT USING (true);

CREATE POLICY "Owner Manage Settings" ON public.portfolio_settings FOR ALL USING (true);
CREATE POLICY "Owner Manage Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Owner Manage Projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Owner Manage Blocks" ON public.project_blocks FOR ALL USING (true);
`;
    navigator.clipboard.writeText(sqlContent);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Conexão com Banco de Dados Supabase"
      description="Configure seu projeto Supabase na nuvem para sincronização em tempo real de dados, autenticação e storage de mídia."
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Status card */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-start gap-3">
          <Database className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-neutral-900 dark:text-neutral-100">
              Arquitetura de Dupla Persistência (Resiliente)
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              O portfólio armazena todas as suas edições de forma persistente localmente e pode ser sincronizado a qualquer momento com o Supabase Cloud sem perda de dados ao recarregar o navegador.
            </p>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div>
            <label
              htmlFor="supabase-url"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Project URL do Supabase
            </label>
            <input
              id="supabase-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="supabase-key"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Anon / Public API Key
            </label>
            <input
              id="supabase-key"
              type="text"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              * Nunca utilize a Service Role Key no front-end. Utilize apenas a Anon Public Key.
            </p>
          </div>

          {/* Test result message */}
          {testResult && (
            <div
              role="alert"
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={testing || !url || !anonKey}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Testando Conexão...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Testar e Salvar Conexão</span>
                </>
              )}
            </button>

            {url && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Desconectar
              </button>
            )}
          </div>
        </form>

        {/* SQL Schema helper */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Script SQL de Migração (SQL Editor do Supabase)
              </h4>
              <p className="text-[11px] text-neutral-500">
                Execute este script no painel do Supabase para criar as tabelas e políticas RLS.
              </p>
            </div>
            <button
              type="button"
              onClick={copySqlToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-md text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
