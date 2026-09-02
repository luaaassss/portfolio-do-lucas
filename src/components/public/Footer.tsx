import React from 'react';
import { ArrowUp, Shield, ExternalLink, MapPin, Sparkles } from 'lucide-react';
import { PortfolioSettings, ActivePage } from '../../types';

interface FooterProps {
  settings: PortfolioSettings;
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="w-full border-t mt-16 sm:mt-24 transition-colors bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
        style={{ maxWidth: 'var(--max-width, 1280px)' }}
      >
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white dark:bg-zinc-900 rotate-45 rounded-xs" />
            </div>
            <p
              className="text-base font-bold text-zinc-900 dark:text-white"
              style={{
                fontFamily: 'var(--font-heading)',
              }}
            >
              {settings.portfolio_name}
            </p>
          </div>

          {settings.location && (
            <p
              className="text-xs flex items-center gap-1.5 text-zinc-500 font-mono"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span>{settings.location}</span>
            </p>
          )}
          <p
            className="text-xs text-zinc-400 dark:text-zinc-500"
          >
            © {new Date().getFullYear()} • Portfólio Autoral acessível em conformidade com WCAG 2.2 AA.
          </p>
        </div>

        {/* Social links & quick actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {settings.social_links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-1.5 focus:outline-none focus:ring-2"
              style={{
                outlineColor: 'var(--color-focus, #4F46E5)',
              }}
              aria-label={`${link.label} (abre em nova janela)`}
            >
              <span>{link.label || link.platform}</span>
              <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
            </a>
          ))}

          {/* Admin shortcut */}
          <button
            onClick={() => onNavigate('admin')}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 p-2 rounded-xl"
            aria-label="Área administrativa do portfólio"
          >
            <Shield className="w-3.5 h-3.5 inline-block mr-1 text-indigo-600" />
            Admin
          </button>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all hover:-translate-y-0.5 hover:shadow-xs focus:outline-none focus:ring-2"
            style={{
              outlineColor: 'var(--color-focus, #4F46E5)',
            }}
            aria-label="Voltar ao topo da página"
            title="Voltar ao topo"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
