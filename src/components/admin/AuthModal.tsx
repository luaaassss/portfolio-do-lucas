import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { requireSupabase } from '../../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userEmail: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Informe e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const supabase = requireSupabase();
      if (isRegisterMode) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;

        if (data.session && data.user) {
          onLoginSuccess(data.user.email || email.trim());
          onClose();
        } else {
          setErrorMsg('Cadastro criado. Confirme o e-mail recebido e depois faça login.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (!data.user) throw new Error('O Supabase não retornou um usuário autenticado.');
        onLoginSuccess(data.user.email || email.trim());
        onClose();
      }
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'Não foi possível autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegisterMode ? 'Cadastrar Proprietário' : 'Autenticação de Administrador'}
      description="Acesso protegido pelo Supabase Auth. Não existe login local ou acesso de demonstração."
      maxWidth="md"
    >
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {errorMsg && (
          <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="seu@email.com"
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="auth-password" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
            Senha
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Autenticando...' : isRegisterMode ? 'Criar acesso' : 'Entrar no Painel Admin'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setIsRegisterMode((value) => !value);
            }}
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline focus:outline-none"
          >
            {isRegisterMode ? 'Já possui conta? Entrar' : 'Ainda não possui conta? Criar acesso'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
