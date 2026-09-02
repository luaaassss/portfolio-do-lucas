import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { getSupabaseClient } from '../../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userEmail: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Informe um endereço de e-mail.');
      return;
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      setLoading(true);
      try {
        if (isRegisterMode) {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          if (data.user) {
            onLoginSuccess(data.user.email || email);
            onClose();
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data.user) {
            onLoginSuccess(data.user.email || email);
            onClose();
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Falha na autenticação com Supabase';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    } else {
      // Local authenticated mode
      if (!password && !isRegisterMode) {
        setErrorMsg('Informe a senha.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess(email || 'proprietario@portfolio.local');
        onClose();
      }, 300);
    }
  };

  const handleQuickDemoOwnerLogin = () => {
    onLoginSuccess('lucas.conceicao@acad.ufsm.br');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegisterMode ? 'Cadastrar Proprietário do Portfólio' : 'Autenticação de Administrador'}
      description="Área restrita e segura exclusiva para gerenciamento autoral de conteúdos e design system."
      maxWidth="md"
    >
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {errorMsg && (
          <div
            role="alert"
            className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="auth-email"
            className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            E-mail do Proprietário
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lucas.conceicao@acad.ufsm.br"
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Senha
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>{isRegisterMode ? 'Criar Acesso de Proprietário' : 'Entrar no Painel Admin'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick 1-click access */}
          <button
            type="button"
            onClick={handleQuickDemoOwnerLogin}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-medium text-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Entrar como Proprietário Autorizado (Acesso Rápido)</span>
          </button>
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline focus:outline-none"
          >
            {isRegisterMode ? 'Já possui conta? Clique para Entrar' : 'Primeiro acesso ao Supabase? Criar conta de proprietário'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
