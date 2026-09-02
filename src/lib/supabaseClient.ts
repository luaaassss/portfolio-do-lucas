import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_STORAGE_KEY = 'portfolio_supabase_config_v1';

export interface StoredSupabaseConfig {
  url: string;
  anon_key: string;
}

export function getSavedSupabaseConfig(): StoredSupabaseConfig {
  try {
    const raw = localStorage.getItem(SUPABASE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anon_key) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  // Check import.meta.env
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl.startsWith('http') ? envUrl : '',
    anon_key: envKey.length > 10 ? envKey : '',
  };
}

export function saveSupabaseConfig(config: StoredSupabaseConfig): void {
  try {
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Falha ao salvar configuração do Supabase:', err);
  }
}

export function clearSupabaseConfig(): void {
  try {
    localStorage.removeItem(SUPABASE_STORAGE_KEY);
  } catch (err) {
    console.error('Falha ao limpar configuração do Supabase:', err);
  }
}

export function isSupabaseConfigured(): boolean {
  const config = getSavedSupabaseConfig();
  return Boolean(config.url && config.anon_key);
}

let activeClient: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSavedSupabaseConfig();
  if (!config.url || !config.anon_key) {
    activeClient = null;
    return null;
  }

  const keySignature = `${config.url}::${config.anon_key}`;
  if (activeClient && currentConfigKey === keySignature) {
    return activeClient;
  }

  try {
    activeClient = createClient(config.url, config.anon_key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentConfigKey = keySignature;
    return activeClient;
  } catch (err) {
    console.warn('Erro ao instanciar cliente Supabase:', err);
    activeClient = null;
    return null;
  }
}

export async function testSupabaseConnection(
  url: string,
  anonKey: string
): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL e Anon Key são obrigatórias.' };
  }
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return { success: false, message: 'A URL do Supabase deve começar com https://' };
  }

  try {
    const testClient = createClient(url, anonKey);
    // Ping an endpoint or check auth health
    const { error } = await testClient.from('portfolio_settings').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && !error.message.includes('permission denied')) {
      // If table doesn't exist yet, it's still connected to Supabase
      if (
        error.message.includes('relation "portfolio_settings" does not exist') ||
        error.code === '42P01'
      ) {
        return {
          success: true,
          message:
            'Conectado com sucesso ao Supabase! (Observação: Execute o script SQL de migração para criar as tabelas).',
        };
      }
      return { success: false, message: `Erro do Supabase: ${error.message}` };
    }
    return { success: true, message: 'Conexão com Supabase estabelecida com sucesso!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão de rede';
    return { success: false, message: `Falha ao conectar: ${msg}` };
  }
}
