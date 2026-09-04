import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  // Na Vercel, as variáveis cadastradas em Project Settings > Environment Variables
  // ficam disponíveis em process.env durante o build.
  //
  // IMPORTANTE: estas duas variáveis são públicas do cliente Supabase.
  // Nunca use SERVICE_ROLE_KEY ou qualquer segredo do Supabase no frontend.
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || '';
  const supabasePublishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() || '';

  // Mostra apenas se as variáveis chegaram, sem imprimir seus valores.
  console.log(
    `[build-env] SUPABASE_URL: ${supabaseUrl ? 'OK' : 'MISSING'}`
  );
  console.log(
    `[build-env] SUPABASE_PUBLISHABLE_KEY: ${
      supabasePublishableKey ? 'OK' : 'MISSING'
    }`
  );

  // Evita falso positivo: o projeto não deve gerar um bundle aparentemente
  // válido se as variáveis necessárias ao Supabase não chegaram ao build.
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Supabase não configurado no ambiente de build da Vercel. ' +
        'Verifique SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY e faça um novo deploy.'
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.SUPABASE_PUBLISHABLE_KEY': JSON.stringify(
        supabasePublishableKey
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
