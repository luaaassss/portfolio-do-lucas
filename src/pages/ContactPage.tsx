import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, MessageSquare } from 'lucide-react';
import { PortfolioSettings } from '../types';
import { ContactForm } from '../components/public/ContactForm';

interface ContactPageProps {
  settings: PortfolioSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  return (
    <div className="space-y-10 sm:space-y-12 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Header Bento Banner */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <span
            className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block"
          >
            Canais de Contato
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            Iniciar Conversa
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
            style={{
              fontFamily: 'var(--font-body)',
            }}
          >
            Tem interesse em novos projetos, consultorias de design, exposições ou parcerias criativas? Envie uma mensagem pelo formulário ou escolha um dos canais diretos abaixo.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Col: Direct Information */}
        <aside className="md:col-span-5 space-y-6">
          <div
            className="p-6 sm:p-7 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl space-y-5 shadow-xs"
          >
            <h2
              className="text-base font-bold text-zinc-900 dark:text-white"
              style={{
                fontFamily: 'var(--font-heading)',
              }}
            >
              Atendimento Direto
            </h2>

            {settings.whatsapp && (
              <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  WhatsApp Oficial
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  {settings.whatsapp}
                </p>
              </div>
            )}

            {settings.email_public && (
              <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  E-mail
                </span>
                <a
                  href={`mailto:${settings.email_public}`}
                  className="text-sm font-semibold hover:underline break-all block text-zinc-900 dark:text-white"
                >
                  {settings.email_public}
                </a>
              </div>
            )}

            {settings.location && (
              <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                  Localização
                </span>
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {settings.location}
                </p>
              </div>
            )}
          </div>

          {/* Social Links */}
          {settings.social_links.length > 0 && (
            <div
              className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl space-y-4 shadow-xs"
            >
              <h3
                className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400"
              >
                Outras Plataformas
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {settings.social_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white transition-all hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <span>{link.label || link.platform}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Col: Contact Form */}
        <main className="md:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
              style={{
                fontFamily: 'var(--font-heading)',
              }}
            >
              Mensagem Direta
            </h2>
            <p className="text-xs sm:text-sm mt-1 text-zinc-500">
              Campos essenciais com validação e conformidade acessível para WhatsApp.
            </p>
          </div>
          <ContactForm settings={settings} />
        </main>
      </div>
    </div>
  );
};
