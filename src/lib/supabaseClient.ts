import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.SUPABASE_URL || '').trim();
const supabasePublishableKey = (import.meta.env.SUPABASE_PUBLISHABLE_KEY || '').trim();

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    '[Supabase] SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY não foram configuradas. '
      + 'Configure essas variáveis no ambiente de build da Vercel.'
  );
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase não está configurado. Defina SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY no ambiente de build.'
    );
  }
  return supabase;
}

export async function getCurrentUser() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  return data.user;
}
