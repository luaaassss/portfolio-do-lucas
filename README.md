# Portfólio do Lucas

Aplicação React + Vite com Supabase como única camada de persistência e autenticação.

## Arquitetura
- Frontend: React + Vite
- Autenticação: Supabase Auth
- Banco: Supabase Postgres
- Arquivos: Supabase Storage (`portfolio-media`)
- Autorização: Row Level Security (RLS)
- Persistência local de conteúdo: não utilizada

## Configuração

O frontend usa duas variáveis públicas de cliente, sem o prefixo `VITE_`:

```text
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_PUBLISHABLE_KEY=sua_chave_publicável
```

O `vite.config.ts` expõe explicitamente apenas as variáveis com prefixo `SUPABASE_` para o código do navegador. Use somente a Publishable/anon key. Nunca coloque `service_role` ou outra chave secreta no frontend.

Essas variáveis são configuradas no ambiente de build da Vercel. Elas não são variáveis que precisam ser criadas no painel do Supabase. O Supabase fornece os valores (Project URL e Publishable/anon key); a Vercel fornece esses valores ao build.

## Supabase
1. Crie/confirme o usuário em Authentication > Users.
2. Execute `supabase-schema.sql` no SQL Editor.
3. Se o banco estiver vazio, substitua `SEU_USER_ID_AQUI` pelo UUID do usuário proprietário na seção de primeiro setup e execute o INSERT indicado.
4. O bucket `portfolio-media` é criado/configurado pelo SQL.
5. Configure `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` na Vercel.

## Desenvolvimento
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
