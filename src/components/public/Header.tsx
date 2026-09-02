import React, { useState } from 'react';
import { Menu, X, Shield, Sparkles } from 'lucide-react';
import { PortfolioSettings, ActivePage } from '../../types';

interface HeaderProps {
  settings: PortfolioSettings;
  activePage: ActivePage;
  onNavigate: (page: ActivePage, projectSlug?: string) => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activePage,
  onNavigate,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'sobre' as ActivePage, label: settings.ux_voice?.about_nav_label || 'Sobre' },
    { id: 'projetos' as ActivePage, label: settings.ux_voice?.projects_nav_label || 'Projetos' },
    { id: 'contato' as ActivePage, label: settings.ux_voice?.contact_nav_label || 'Contato' },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <>
      {/* Skip Link para Acessibilidade (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-white focus:font-semibold focus:shadow-lg focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
      >
        Pular para o conteúdo principal
      </a>

      <header
        className="sticky top-0 z-40 w-full border-b transition-colors duration-200 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90"
        style={{
          borderColor: 'var(--color-border, #E4E4E7)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4"
          style={{ maxWidth: 'var(--max-width, 1280px)' }}
        >
          {/* Logo / Brand Name with Bento Geometric Mark */}
          <button
            onClick={() => handleNavClick('projetos')}
            className="group flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-2xl p-1"
            style={{
              outlineColor: 'var(--color-focus, #4F46E5)',
            }}
            aria-label={`${settings.portfolio_name} - Página inicial`}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <div className="w-3.5 h-3.5 bg-white dark:bg-zinc-900 rotate-45 rounded-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-base sm:text-lg font-bold tracking-tight"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text-primary, #18181B)',
                  }}
                >
                  {settings.portfolio_name || 'Portfólio Autoral'}
                </span>
              </div>
              {settings.tagline && (
                <span
                  className="text-[11px] font-normal tracking-normal line-clamp-1 opacity-75 hidden sm:block"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-secondary, #71717A)',
                  }}
                >
                  {settings.tagline}
                </span>
              )}
            </div>
          </button>

          {/* Center / Right Metadata Badge (Bento Style) */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-zinc-400">
              {currentDate}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: Disponível</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-1.5"
          >
            <div className="bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-2xl flex items-center gap-1 border border-zinc-200/60 dark:border-zinc-700/60">
              {navItems.map((item) => {
                const isActive = activePage === item.id || (activePage === 'projeto_detalhe' && item.id === 'projetos');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 ${
                      isActive
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                    style={{
                      fontFamily: 'var(--font-body)',
                      outlineColor: 'var(--color-focus, #4F46E5)',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Admin Access Button */}
            <button
              onClick={() => onNavigate('admin')}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--color-border, #E4E4E7)',
                color: 'var(--color-text-primary, #18181B)',
                backgroundColor: 'var(--color-surface, #FFFFFF)',
                outlineColor: 'var(--color-focus, #4F46E5)',
              }}
              aria-label={isAdminLoggedIn ? 'Acessar painel administrativo' : 'Entrar na área administrativa'}
              title="Área Administrativa do Portfólio"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span>{isAdminLoggedIn ? 'Painel Admin' : 'Admin'}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onNavigate('admin')}
              className="p-2 text-zinc-700 dark:text-zinc-300 rounded-xl border border-zinc-200 dark:border-zinc-700"
              aria-label="Acessar painel administrativo"
            >
              <Shield className="w-4 h-4 text-indigo-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2"
              style={{
                color: 'var(--color-text-primary, #18181B)',
                outlineColor: 'var(--color-focus, #4F46E5)',
              }}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden border-t px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200 bg-white dark:bg-zinc-900"
            style={{
              borderColor: 'var(--color-border, #E4E4E7)',
            }}
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors flex items-center justify-between focus:outline-none focus:ring-2 ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-300'
                  }`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    outlineColor: 'var(--color-focus, #4F46E5)',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
};
